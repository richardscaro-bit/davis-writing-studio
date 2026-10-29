document.querySelector('.nav-toggle')?.addEventListener('click', () => {
  const m = document.getElementById('mobileNav');
  const open = m.classList.toggle('open');
  document.querySelector('.nav-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
});
