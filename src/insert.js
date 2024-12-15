import { addnavIcon } from "./index.js";

// Configuration
const apiKey = import.meta.env.VITE_DICTIONARY;
const BASE_URL = "https://dictionaryapi.com/api/v3/references/thesaurus/json/";

// Add navigation icons if needed
// addnavIcon();
// window.addEventListener('resize', addnavIcon);

// Dictionary Service
class DictionaryService {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async fetchWordDefinition(word) {
    if (!word) throw new Error("No word provided");

    try {
      const response = await fetch(
        `${this.baseUrl}${word}?key=${this.apiKey}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.processWordData(data);
    } catch (error) {
      console.error("Dictionary API Error:", error);
      return {
        word: word,
        definition: "Definition not found",
        syns: "Fetching failed",
        ants: "Fetching failed",
      };
    }
  }

  processWordData(rawData) {
    if (!rawData || !rawData.length || typeof rawData[0] !== "object") {
      throw new Error("No definition found");
    }

    const firstDefinition = rawData[0];
    const synonyms = Array.isArray(firstDefinition.meta?.syns)
      ? firstDefinition.meta.syns.flat().join(", ")
      : "N/A";
    const antonyms = Array.isArray(firstDefinition.meta?.ants)
      ? firstDefinition.meta.ants.flat().join(", ")
      : "N/A";
    return {
      word: firstDefinition.meta?.id || "Unknown",
      definition: firstDefinition.shortdef?.[0] || "No definition available",
      syns: synonyms,
      ants: antonyms,
    };
  }
}

// Task Manager
class TaskManager {
  constructor() {
    this.tasks = [];
    this.taskInput = document.getElementById("task-input");
    this.addTaskButton = document.getElementById("add-task-button");
    this.taskContainer = document.getElementById("task-container");
    this.apiTaskContainer = document.getElementById("api-task-container");

    this.dictionaryService = new DictionaryService(apiKey, BASE_URL);

    this.initializeEventListeners();
    this.loadTasks();
  }

  initializeEventListeners() {
    this.addTaskButton.addEventListener("click", () => this.addTask());
    this.taskInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") this.addTask();
    });
  }

  loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    this.tasks = storedTasks;
    this.displayTasks();
  }

  async addTask() {
    const taskText = this.taskInput.value.trim().toLowerCase();
    if (!taskText) return;

    const task = {
      id: Date.now(),
      description: taskText,
      completed: false,
      synonyms: "Fetching...",
      antonyms: "Fetching...",
    };

    try {
      const wordDefinition = await this.dictionaryService.fetchWordDefinition(
        taskText
      );

      task.definition = wordDefinition.definition;
      task.synonyms = wordDefinition.syns;
      task.antonyms = wordDefinition.ants;
    } catch (error) {
      task.definition = "Definition not found";
      task.synonyms = "_";
      task.antonyms = "_";
    }

    this.tasks.push(task);
    this.displayTasks();
    this.taskInput.value = "";
  }

  displayTasks() {
    this.taskContainer.innerHTML = this.tasks.length
      ? this.tasks
          .map(
            (task) => `
                  <li>
                      <input 
                          type="checkbox" 
                          ${task.completed ? "checked" : ""} 
                          onchange="taskManager.toggleTask(${task.id})"
                      >
                      <span class="${task.completed ? "completed" : ""}">${
              task.description
            }</span>
                      <button onclick="taskManager.deleteTask(${
                        task.id
                      })">Delete</button>
                  </li>
              `
          )
          .join("")
      : "<li>No words added yet!</li>";

    const checkedTasks = this.tasks.filter((task) => task.completed);
    this.apiTaskContainer.innerHTML = checkedTasks.length
      ? checkedTasks
          .map(
            (task) => `
                  <li>
                      <strong>${task.description}</strong>: 
                      ${task.definition || "Definition not found"}
                      <p>Synonyms:</p> ${task.synonyms || "na"}<br>
                      <p>Antonyms:</p> ${task.antonyms || "na"}
                  </li>
              `
          )
          .join("")
      : "<li>No checked tasks yet...</li>";

    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  toggleTask(id) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.displayTasks();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.displayTasks();
  }
}

// Application Initialization
document.addEventListener("DOMContentLoaded", () => {
  window.taskManager = new TaskManager();
});

export { TaskManager, DictionaryService };
