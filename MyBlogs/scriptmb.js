document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('.blogs-list');

    function renderBlogs() {
        const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
        listContainer.innerHTML = '';

        if (blogs.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; color:#fff;">No blogs found. Create one!</p>';
            return;
        }

        blogs.forEach(blog => {
            const article = document.createElement('article');
            article.className = 'blog-card';
            article.innerHTML = `
                <header class="card-header">
                    <div class="header-main">
                        <h3 class="blog-title">${blog.title}</h3>
                        <span class="blog-date">Published on ${blog.date}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-sm edit-btn" data-id="${blog.id}">Edit</button>
                        <button class="btn-icon delete-btn" data-id="${blog.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </header>
                <p class="blog-snippet">${blog.content.substring(0, 100)}...</p>
                <footer class="card-footer">
                    <span class="blog-tag"><i class="fa-solid fa-folder"></i> ${blog.category}</span>
                    <div class="blog-stats">
                        <span><i class="fa-regular fa-eye"></i> ${blog.views} views</span>
                        <span><i class="fa-regular fa-message"></i> ${blog.comments}</span>
                    </div>
                </footer>
            `;
            listContainer.appendChild(article);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this blog?')) {
                    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
                    const updatedBlogs = blogs.filter(b => b.id !== id);
                    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
                    renderBlogs();
                }
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                alert('Edit functionality would go here (e.g., redirect to create page with ID)');
            });
        });
    }

    renderBlogs();

    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const articles = document.querySelectorAll('.blog-card');
        articles.forEach(article => {
            const title = article.querySelector('.blog-title').innerText.toLowerCase();
            if (title.includes(term)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    });
});