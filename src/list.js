import { addnavIcon } from "./index.js";
import { tasks } from "./utility.js";

addnavIcon();
window.addEventListener("resize", addnavIcon);

console.log(tasks);

// Render tasks
tasks.forEach(function processTask(task) {
  if (task.description) {
    document
      .querySelector("#item-list")
      .insertAdjacentHTML("beforeEnd", `<li>${task.description}</li>`);
  } else {
    console.error("Task has no description:", task);
  }
});

// Share button handler
function generateTaskUrl(tasks) {
  const url = new URL(`${window.location.origin}/insert.html`);
  url.searchParams.append(
    "words",
    tasks.map((task) => task.description).join(",")
  );

  return url.href;
}

function handleShare() {
  const url = generateTaskUrl(tasks);

  // Redirect to the insert.html page with the generated URL
  window.location.assign(url);
}

// share button
document.querySelector("#share").addEventListener("click", handleShare);
