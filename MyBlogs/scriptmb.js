document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Authentication & User Profile Logic ---
    // Check if the user is already logged in by looking in the browser's storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Get Elements for Profile UI
    const userDisplay = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');
    const loginLink = document.getElementById('login-link');
    const authDropdown = document.getElementById('auth-dropdown');
    const profileIcon = document.querySelector('.profile-icon');

    // Toggle UI elements based on authentication state
    if (currentUser && currentUser.username) {
        // User is Logged In
        if (userDisplay) {
            userDisplay.textContent = `Logged in as ${currentUser.username}`;
            userDisplay.style.display = 'block';
        }
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';
    } else {
        // User is Logged Out
        if (userDisplay) userDisplay.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
    }

    // Toggle the Profile Dropdown when the icon is clicked
    if (profileIcon) {
        profileIcon.addEventListener('click', () => {
            authDropdown.classList.toggle('show');
        });

        // Close Dropdown when clicking outside
        window.addEventListener('click', (e) => {
            if (!e.target.matches('.profile-icon') && !e.target.closest('.dropdown-content')) {
                if (authDropdown && authDropdown.classList.contains('show')) {
                    authDropdown.classList.remove('show');
                }
            }
        });
    }

    // Logout Functionality: clear storage and reload
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }

    // --- 2. Blog Rendering Logic ---
    const listContainer = document.querySelector('.blogs-list');

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('active');
        });
    }

    /**
     * Function to fetch blogs from storage and display them on the page.
     * It creates HTML elements dynamically for each blog post.
     */
    function renderBlogs() {
        // Get blogs array from LocalStorage, or use an empty array if none exist
        const blogs = JSON.parse(localStorage.getItem('myBlogs') || '[]');
        listContainer.innerHTML = ''; // Clear current list before re-rendering

        // Show a message if there are no blogs
        if (blogs.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; color:#fff; font-size: 1.2rem; margin-top: 2rem;">Start writing your first blog!</p>';
            return;
        }

        // Loop through each blog to create its card
        blogs.forEach(blog => {
            const article = document.createElement('article');
            article.className = 'blog-card'; // Add styling class

            // Check if author exists
            let authorHtml = blog.author ? `<span class="blog-tag" style="margin-left:auto;"><i class="fa-solid fa-user"></i> ${blog.author}</span>` : '';

            // Generate HTML for attachments (thumbnails) to show in the preview
            let attachmentsHtml = '';
            if (blog.attachments && blog.attachments.length > 0) {
                attachmentsHtml = '<div class="blog-attachments-preview" style="margin-top: 1rem;">';
                blog.attachments.forEach(img => {
                    attachmentsHtml += `<img src="${img.url}" alt="${img.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 0.5rem; display: block;">`;
                });
                attachmentsHtml += '</div>';
            }

            // Fill the card with HTML content
            article.innerHTML = `
                <header class="card-header">
                    <div class="header-main">
                        <h3 class="blog-title">${blog.title}</h3>
                        <span class="blog-date">Published on ${blog.date}</span>
                    </div>
                    <div class="card-actions">
                        <!-- Edit and Delete Buttons with blog ID -->
                        <button class="btn-sm edit-btn" data-id="${blog.id}">Edit</button>
                        <button class="btn-icon delete-btn" data-id="${blog.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </header>
                <div class="blog-content">
                    <p class="blog-snippet">${blog.content}</p>
                    ${attachmentsHtml} <!-- Insert attachments here -->
                </div>
                <footer class="card-footer" style="margin-top: 1rem;">
                    <span class="blog-tag"><i class="fa-solid fa-folder"></i> ${blog.category}</span>
                    ${authorHtml}
                    <div class="blog-stats">
                        <span><i class="fa-regular fa-eye"></i> ${blog.views} views</span>
                        <span><i class="fa-regular fa-message"></i> ${blog.comments} comments</span>
                    </div>
                </footer>
            `;
            // Add the new card to the list container
            listContainer.appendChild(article);
        });

        // Re-attach button listeners after creating new elements
        attachEventListeners();
    }

    /**
     * Adds click events to dynamic elements like Delete and Edit buttons
     */
    function attachEventListeners() {
        // Delete Button Logic
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this blog?')) {
                    // Filter out the blog with this ID
                    const blogs = JSON.parse(localStorage.getItem('myBlogs') || '[]');
                    const updatedBlogs = blogs.filter(b => b.id !== id);

                    // Save the updated list back to storage
                    localStorage.setItem('myBlogs', JSON.stringify(updatedBlogs));

                    // Re-render the list to show changes
                    renderBlogs();
                }
            });
        });

        // Edit Button Logic
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                // Redirect to the create page with the Blog ID in the URL
                window.location.href = `../blog-ui/createnewblog.html?id=${id}`;
            });
        });
    }

    // Initial render
    renderBlogs();

    // --- 3. Search Functionality ---
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const articles = document.querySelectorAll('.blog-card');

            // Loop through all currently rendered cards and toggle display
            articles.forEach(article => {
                const title = article.querySelector('.blog-title').innerText.toLowerCase();
                if (title.includes(term)) {
                    article.style.display = 'block'; // Show if matches
                } else {
                    article.style.display = 'none'; // Hide if doesn't match
                }
            });
        });
    }
});