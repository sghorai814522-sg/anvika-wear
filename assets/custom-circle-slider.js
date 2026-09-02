document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.ccs-section');

  sliders.forEach(section => {
    const wrapper = section.querySelector('.ccs-slider-wrapper');
    if (!wrapper) return;

    const isAutoPlay = section.dataset.autoplay === 'true';
    const speed = parseInt(section.dataset.speed, 10) || 3000;
    let autoPlayInterval;

    function startAutoPlay() {
      if (!isAutoPlay) return;
      
      autoPlayInterval = setInterval(() => {
        const item = wrapper.querySelector('.ccs-slide-item');
        if (!item) return;
        
        // Calculate the width to scroll (item width + gap)
        const gap = parseInt(window.getComputedStyle(wrapper.querySelector('.ccs-slider-track')).gap) || 0;
        const scrollAmount = item.offsetWidth + gap;
        
        // Check if we reached the end (with a small buffer for precision errors)
        if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 10) {
          // Reset to beginning smoothly
          wrapper.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll one item forward
          wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, speed);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    }

    // Initialize Auto-play
    startAutoPlay();
    
    // Pause on user interactions
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
    wrapper.addEventListener('touchstart', stopAutoPlay, { passive: true });
    wrapper.addEventListener('touchend', startAutoPlay, { passive: true });
  });
});
