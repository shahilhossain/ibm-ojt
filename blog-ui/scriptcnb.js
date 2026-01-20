// Helper function to safely attach events even if DOM isn't ready
function document_addEventListener(event, callback) {
    if (document.readyState === 'loading') {
        document.addEventListener(event, callback);
    } else {
        callback();
    }
}

document_addEventListener('DOMContentLoaded', () => {
    // --- 1. Authentication Check ---
    // Protect this page: Redirect to Sign In if no user is found
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'signin.html';
        return; // Stop execution
    }

    // --- 2. Profile & Navbar Logic ---
    const userDisplay = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');
    const loginLink = document.getElementById('login-link');
    const authDropdown = document.getElementById('auth-dropdown');
    const profileIcon = document.querySelector('.profile-icon');

    // Display the logged-in user's name
    if (userDisplay) {
        userDisplay.textContent = `Logged in as ${currentUser.username}`;
        userDisplay.style.display = 'block';
    }
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (loginLink) loginLink.style.display = 'none';

    // Toggle Dropdown
    if (profileIcon) {
        profileIcon.addEventListener('click', () => {
            authDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', (e) => {
            if (!e.target.matches('.profile-icon') && !e.target.closest('.dropdown-content')) {
                if (authDropdown && authDropdown.classList.contains('show')) {
                    authDropdown.classList.remove('show');
                }
            }
        });
    }

    // Logout Action
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'signin.html'; // Redirect to login
        });
    }

    // --- 3. Blog Form & Rich Text Editor Logic ---
    const blogForm = document.querySelector('.blog-form');
    const titleInput = document.getElementById('title');
    const editor = document.getElementById('editor'); // The contenteditable div
    const categorySelect = document.getElementById('category');
    const cancelBtn = document.querySelector('.btn-cancel');
    const imageUpload = document.getElementById('image-upload');

    // Toolbar Buttons reference
    const btnBold = document.getElementById('btn-bold');
    const btnItalic = document.getElementById('btn-italic');
    const btnLink = document.getElementById('btn-link');
    const btnUl = document.getElementById('btn-ul');
    const btnOl = document.getElementById('btn-ol');
    const btnImage = document.getElementById('btn-image');
    const btnQuote = document.getElementById('btn-quote');

    // Attach functionality to toolbar buttons using document.execCommand
    // execCommand is a built-in browser API for simple rich text editing
    if (btnBold) btnBold.addEventListener('click', () => document.execCommand('bold', false, null));
    if (btnItalic) btnItalic.addEventListener('click', () => document.execCommand('italic', false, null));
    if (btnUl) btnUl.addEventListener('click', () => document.execCommand('insertUnorderedList', false, null));
    if (btnOl) btnOl.addEventListener('click', () => document.execCommand('insertOrderedList', false, null));
    if (btnQuote) btnQuote.addEventListener('click', () => document.execCommand('formatBlock', false, '<blockquote>'));

    // Link insertion requires a URL
    if (btnLink) {
        btnLink.addEventListener('click', () => {
            const url = prompt('Enter the link URL:');
            if (url) document.execCommand('createLink', false, url);
        });
    }

    // --- 4. Image Attachment Logic ---
    const attachmentsSection = document.getElementById('attachments-section');
    const filesList = document.getElementById('files-list');
    let attachedImages = []; // Store images as Base64 strings here

    // When clicking the image icon, trigger the hidden file input
    if (btnImage && imageUpload) {
        btnImage.addEventListener('click', () => {
            imageUpload.click();
        });

        // Handle file selection
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Use FileReader to convert image file to Base64 string for text storage
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgUrl = event.target.result;

                    // Add file info to our array
                    attachedImages.push({
                        name: file.name,
                        url: imgUrl
                    });

                    // Update the visual list
                    updateAttachmentsUI();
                };
                reader.readAsDataURL(file);
            }
            // Reset input so the same file can be selected again if needed
            imageUpload.value = '';
        });
    }

    // Function to render the list of attached files
    function updateAttachmentsUI() {
        filesList.innerHTML = '';
        if (attachedImages.length > 0) {
            attachmentsSection.style.display = 'block';
            attachedImages.forEach((img, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <i class="fa-regular fa-image"></i>
                    <span>${img.name}</span>
                    <i class="fa-solid fa-times file-remove" data-index="${index}"></i>
                `;
                filesList.appendChild(fileItem);
            });

            // Add click listeners to Remove icons
            document.querySelectorAll('.file-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    attachedImages.splice(index, 1); // Remove from array
                    updateAttachmentsUI(); // Re-render
                });
            });
        } else {
            attachmentsSection.style.display = 'none';
        }
    }

    // --- 5. Edit Mode Logic ---
    // Check if there is a blog ID in the URL (e.g. ?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    const submitBtn = blogForm.querySelector('button[type="submit"]');

    if (blogId) {
        loadBlogData(blogId);
        if (submitBtn) submitBtn.textContent = 'Update Blog'; // Change button text
    }

    // Load existing blog data into form
    function loadBlogData(id) {
        const blogs = JSON.parse(localStorage.getItem('myBlogs') || '[]');
        const blog = blogs.find(b => b.id == id);

        if (blog) {
            titleInput.value = blog.title;
            editor.innerHTML = blog.content; // Load HTML content
            categorySelect.value = blog.category.toLowerCase();

            // Load saved attachments
            if (blog.attachments && Array.isArray(blog.attachments)) {
                attachedImages = blog.attachments;
                updateAttachmentsUI();
            }
        }
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = '../MyBlogs/myblogs.html';
        });
    }

    // --- 6. Form Submission Logic ---
    if (blogForm) {
        blogForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop default form submit

            // Get values
            const title = titleInput.value.trim();
            const category = categorySelect.value;
            let contentHtml = editor.innerHTML.trim(); // Get HTML from editor
            const plainText = editor.innerText.trim(); // Used just for validation

            // Simple Validation
            if (!title || (!plainText && attachedImages.length === 0) || !category) {
                alert('Please fill in all fields (Title, Content, Category)');
                return;
            }

            // Retrieve existing blogs array
            let myBlogs = JSON.parse(localStorage.getItem('myBlogs') || '[]');

            if (blogId) {
                // --- UPDATE Existing Blog ---
                const index = myBlogs.findIndex(b => b.id == blogId);
                if (index !== -1) {
                    myBlogs[index] = {
                        ...myBlogs[index], // Keep existing properties (views, date, etc)
                        title: title,
                        content: contentHtml,
                        category: category.charAt(0).toUpperCase() + category.slice(1),
                        attachments: attachedImages
                    };
                    alert('Blog updated successfully!');
                }
            } else {
                // --- CREATE New Blog ---
                const newBlog = {
                    id: Date.now(), // Generate unique ID
                    title: title,
                    content: contentHtml,
                    date: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    category: category.charAt(0).toUpperCase() + category.slice(1),
                    views: 0,
                    comments: 0,
                    author: currentUser.username,
                    attachments: attachedImages
                };
                myBlogs.push(newBlog);
                alert('Blog published successfully!');
            }

            // Save updated array back to LocalStorage
            localStorage.setItem('myBlogs', JSON.stringify(myBlogs));

            // Redirect to My Blogs page
            window.location.href = '../MyBlogs/myblogs.html';
        });
    }
});
