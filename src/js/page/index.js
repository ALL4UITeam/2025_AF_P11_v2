
document.addEventListener('DOMContentLoaded', () => {
  const btnAllmenu = document.querySelector('#btnAllMenu');
  btnAllmenu.addEventListener('click', () => {
    const mobileNav = document.querySelector('#mobile-nav');
    mobileNav.classList.toggle('active');
  });
})
