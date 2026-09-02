document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.custom-banner-slider');

  sliders.forEach(slider => {
    const wrapper = slider.querySelector('.cbs-wrapper');
    const slides = slider.querySelectorAll('.cbs-slide');
    const prevBtn = slider.querySelector('.cbs-prev');
    const nextBtn = slider.querySelector('.cbs-next');
    const dots = slider.querySelectorAll('.cbs-dot');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    const isAutoPlay = slider.dataset.autoplay === 'true';
    const speed = parseInt(slider.dataset.speed, 10) || 5000;
    let autoPlayInterval;

    if (totalSlides <= 1) return;

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots state
      if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
      }
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
      });
    }

    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          goToSlide(index);
          resetInterval();
        });
      });
    }

    function startInterval() {
      if (isAutoPlay) {
        autoPlayInterval = setInterval(nextSlide, speed);
      }
    }

    function resetInterval() {
      if (isAutoPlay) {
        clearInterval(autoPlayInterval);
        startInterval();
      }
    }

    // Start auto-play initially
    startInterval();
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    slider.addEventListener('mouseleave', startInterval);
  });
});
