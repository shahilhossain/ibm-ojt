document.addEventListener('DOMContentLoaded', () => {

    const signinForm = document.getElementById('signin-form');
    const usernameInput = document.getElementById('username');

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();


            const username = usernameInput.value.trim();


            if (!username) {
                alert('Please enter a username');
                return;
            }


            const user = {
                username: username,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('currentUser', JSON.stringify(user));

            alert('Signed in successfully!');

            window.location.href = 'createnewblog.html';
        });
    }
});
