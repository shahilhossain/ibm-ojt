document.addEventListener('DOMContentLoaded', () => {
    console.log('Blogverse UI loaded');

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('active');
        });
    }

    // Example: Add a simple hover effect logging or interaction
    const ctaButton = document.querySelector('.cta-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            console.log('Create New Blog clicked');
            // Logic to navigate or open modal could go here
        });
    }
});
