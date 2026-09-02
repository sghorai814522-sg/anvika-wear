document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.querySelector('.chi-mobile-menu-toggle');
  const closeBtn = document.querySelector('.chi-mobile-close');
  const overlay = document.querySelector('.chi-mobile-drawer-overlay');
  const drawer = document.getElementById('chi-mobile-menu');

  if(toggleBtn && drawer) {
    toggleBtn.addEventListener('click', function() {
      drawer.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMenu() {
    if(drawer) {
      drawer.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if(closeBtn) closeBtn.addEventListener('click', closeMenu);
  if(overlay) overlay.addEventListener('click', closeMenu);
});
