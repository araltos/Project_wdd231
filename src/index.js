// nav
function viewNavTemplate() {
  return `    <nav class = 'nav900'>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="insert.html">Insert</a></li>
        <li><a href="test.html">Test</a></li>
        <li><a href="list.html">List</a></li>
      </ul>
    </nav>`;
}

function closeNavviewer() {
  const viewer = document.querySelector(".nav900");
  viewer.remove();
}

function toggleNav() {
  const existingNav = document.querySelector(".nav900");
  const navIcon = document.querySelector("#navIcon");

  if (existingNav) {
    existingNav.remove();
  } else {
    const viewerInsert = viewNavTemplate();
    navIcon.insertAdjacentHTML("afterbegin", viewerInsert);

    const removeModal = document.querySelector(".nav900");
    removeModal.addEventListener("click", closeNavviewer);
  }
}

function addnavIcon() {
  const navIcon = document.querySelector("#navIcon");

  if (window.innerWidth > 900) {
    if (!document.querySelector("#navimg")) {
      navIcon.innerHTML = `<button id="navimg"><img src="logos/menu.png" alt="Icon"></button>`;
    }

    document.querySelector("#navimg").addEventListener("click", toggleNav);
  } else {
    navIcon.innerHTML = "";
  }
}

addnavIcon();
window.addEventListener("resize", addnavIcon);

export { addnavIcon };
