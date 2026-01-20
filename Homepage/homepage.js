// Wait for the HTML structure to fully load before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Logic ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // Toggle menu visibility when hamburger icon is clicked
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active'); // Animates the icon
            menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('active');      // Shows/hides the links
        });
    }

    // --- Authentication Logic ---
    // Retrieve the currently logged-in user from Browser's LocalStorage (database)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Get references to UI elements
    const userDisplay = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');
    const loginLink = document.getElementById('login-link');
    const authDropdown = document.getElementById('auth-dropdown');
    const profileIcon = document.querySelector('.profile-icon');

    // Update UI based on whether a user is logged in
    if (currentUser && currentUser.username) {
        // User is Logged In: Show their name and Logout button
        userDisplay.textContent = `Logged in as ${currentUser.username}`;
        userDisplay.style.display = 'block';
        logoutBtn.style.display = 'block';
        loginLink.style.display = 'none'; // Hide Login button
    } else {
        // User is Logged Out: Hide profile info and show Login button
        userDisplay.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginLink.style.display = 'block';
    }

    // --- Profile Dropdown Toggle ---
    if (profileIcon) {
        profileIcon.addEventListener('click', () => {
            authDropdown.classList.toggle('show'); // Toggle visibility class
        });

        // Close dropdown if user clicks anywhere else on the screen
        window.addEventListener('click', (e) => {
            if (!e.target.matches('.profile-icon') && !e.target.closest('.dropdown-content')) {
                if (authDropdown.classList.contains('show')) {
                    authDropdown.classList.remove('show');
                }
            }
        });
    }

    // --- Logout Action ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Remove user data from storage to log them out
            localStorage.removeItem('currentUser');
            // Reload page to update UI
            window.location.reload();
        });
    }
});
