import { addnavIcon } from "./index.js";
import { getLocalStorageItem } from "./test.js";

addnavIcon();
window.addEventListener("resize", addnavIcon);

const tasks = getLocalStorageItem("tasks") || [];
console.log(tasks);

function findTaskByDescription(tasks, description) {
  return tasks.find((task) => task.description === description);
}

// Render tasks
tasks.forEach((task) => {
  const data = findTaskByDescription(tasks, task.description);
  console.log(data);
  if (data) {
    document
      .querySelector("#item-list")
      .insertAdjacentHTML("beforeEnd", `<li>${data.description}</li>`);
  } else {
    console.error("Task not found:", task);
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
