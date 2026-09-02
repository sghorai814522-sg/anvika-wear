document.addEventListener("DOMContentLoaded", () => {
    // 1. Horizontal drag-to-scroll on mobile
    const sliders = document.querySelectorAll('.draped-grid');

    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            if (window.innerWidth > 767) return;
            isDown = true;
            slider.style.cursor = 'grabbing';
            slider.style.scrollSnapType = 'none';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = '';
            slider.style.scrollSnapType = 'x mandatory';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = '';
            slider.style.scrollSnapType = 'x mandatory';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    });

    // 2. Read More / Read Less Inline Toggle
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-read-more-toggle]');
        if (!toggleBtn) return;

        const reviewTextEl = toggleBtn.closest('.draped-review-text');
        if (!reviewTextEl) return;

        const textHolder = reviewTextEl.querySelector('.draped-text-holder');
        const shortText = reviewTextEl.getAttribute('data-short-text');
        const fullText = reviewTextEl.getAttribute('data-full-text');
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            if (textHolder && shortText) {
                textHolder.textContent = shortText;
            }
            toggleBtn.textContent = 'Read More';
            toggleBtn.setAttribute('aria-expanded', 'false');
            reviewTextEl.classList.remove('is-expanded');
        } else {
            if (textHolder && fullText) {
                textHolder.textContent = fullText;
            }
            toggleBtn.textContent = 'Read Less';
            toggleBtn.setAttribute('aria-expanded', 'true');
            reviewTextEl.classList.add('is-expanded');
        }
    });
});
