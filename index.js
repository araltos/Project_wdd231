// nav
function addnavIcon(){
  const navIcon = document.querySelector('#navIcon');
  if (window.innerWidth > 900){
      navIcon.innerHTML = '<img src="/logos/menu.png" alt="Icon">';
  }
  else{
    navIcon.innerHTML = '';
  }
}
addnavIcon();
window.addEventListener('resize', addnavIcon);
