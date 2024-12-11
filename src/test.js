import { addnavIcon } from "./index.js";

addnavIcon();
window.addEventListener("resize", addnavIcon);

// test card

function getLocalStorageItem(key) {
  const storedItem = localStorage.getItem(key);
  return storedItem ? JSON.parse(storedItem) : [];
}
const tasks = getLocalStorageItem("tasks");
console.log(tasks);

function getRandomTasks(tasks) {
  function randomN(num) {
    return Math.floor(Math.random() * num);
  }
  const listLength = tasks.length;
  const randomNum = randomN(listLength);
  return tasks[randomNum];
}
const randomTask = getRandomTasks(tasks);
console.log(randomTask);

function taskTemplate(task) {
  return `
            <section class="flashcard">
          <div class="flashcard-inner" id="word1">
            <h2 class="flashcardfront">Words:${task.description}</h2>
            <p class="flashcardback">${task.definition}</p>
          </div>
        </section>
        <section class="hint1">
          <div class="flashcard-inner" id="word2">
            <h2 class="flashcardfront">Synonyms:</h2>
            <p class="flashcardback">${task.synonyms}</p>
          </div>
        </section>
        <section class="hint2">
          <div class="flashcard-inner" id="word3">
            <h2 class="flashcardfront">Antonyms:</h2>
            <p class="flashcardback">${task.antonyms}</p>
          </div>
        </section>`;
}

function renderTasks(randomObj) {
  // get the list element from the DOM
  const listElement = document.querySelector(".thirdpage");
  listElement.innerHTML = "";
  listElement.innerHTML = taskTemplate(randomObj);
}
renderTasks(randomTask);

function toggleFlipped(event) {
  event.currentTarget.classList.toggle("flipped");
}

document.querySelector(".flashcard").addEventListener("click", toggleFlipped);
document.querySelector(".hint1").addEventListener("click", toggleFlipped);
document.querySelector(".hint2").addEventListener("click", toggleFlipped);
