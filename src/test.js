import { addnavIcon } from "./index.js";

addnavIcon();
window.addEventListener("resize", addnavIcon);

function toggleFlipped(event) {
  event.currentTarget.classList.toggle("flipped");
}

document.querySelector(".flashcard").addEventListener("click", toggleFlipped);
document.querySelector(".hint1").addEventListener("click", toggleFlipped);
document.querySelector(".hint2").addEventListener("click", toggleFlipped);
