document.addEventListener('DOMContentLoaded', () => {
    const toolBtns = document.querySelectorAll('.tool-btn');

    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');

            const icon = btn.querySelector('i');
            console.log(`Tool clicked: ${icon.className}`);
        });
    });

    const publishBtn = document.querySelector('.btn-publish');
    publishBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const originalText = publishBtn.innerText;
        publishBtn.innerText = 'Publishing...';

        setTimeout(() => {
            publishBtn.innerText = 'Published!';
            publishBtn.style.background = 'linear-gradient(90deg, #5da468 0%, #448f50 100%)';

            setTimeout(() => {
                publishBtn.innerText = originalText;
                publishBtn.style.background = '';
            }, 2000);
        }, 1500);
    });

    const cancelBtn = document.querySelector('.btn-cancel');
    cancelBtn.addEventListener('click', () => {
        document.querySelector('.blog-form').reset();
    });
});
