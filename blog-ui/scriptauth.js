document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Logic ---
    const signinForm = document.getElementById('signin-form');
    const usernameInput = document.getElementById('username');

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page reload

            // Get input value
            const username = usernameInput.value.trim();

            // Simple validation
            if (!username) {
                alert('Please enter a username');
                return;
            }

            // --- 1. Create User Object ---
            // In a real app, this would involve checking a password against a database.
            // Here, we simulate a login by creating a user session object.
            const user = {
                username: username,
                loginTime: new Date().toISOString()
            };

            // --- 2. Save to LocalStorage ---
            // 'currentUser' is the key we use to check login status across pages.
            localStorage.setItem('currentUser', JSON.stringify(user));

            alert('Signed in successfully!');

            // --- 3. Redirect ---
            // Send user to the Create Blog page (or wherever they intend to go)
            window.location.href = 'createnewblog.html';
        });
    }
});
