import { addnavIcon } from "./index.js";

// Configuration
const apiKey = import.meta.env.VITE_DICTIONARY;
const BASE_URL = "https://www.dictionaryapi.com/api/v3/references/sd3/json/";

// Navigation setup
addnavIcon();
window.addEventListener('resize', addnavIcon);

// Dictionary API Service
class DictionaryService {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async fetchWordDefinition(word) {
        if (!word) throw new Error("No word provided");

        try {
            const response = await fetch(`${this.baseUrl}${word}?key=${this.apiKey}`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': this.apiKey,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.processWordData(data);
        } catch (error) {
            console.error('Dictionary API Error:', error);
            return {
                word: word,
                definition: 'Definition not found'
            };
        }
    }

    processWordData(rawData) {
        if (!rawData || !rawData.length) {
            throw new Error('No definition found');
        }

        const firstDefinition = rawData[0];
        return {
            word: firstDefinition.meta?.id || 'Unknown',
            definition: firstDefinition.shortdef?.[0] || 'No definition available'
        };
    }
}

// Task Management Class
class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskInput = document.getElementById('task-input');
        this.addTaskButton = document.getElementById('add-task-button');
        this.taskContainer = document.getElementById('task-container');
        this.apiTaskContainer = document.getElementById('api-task-container');
        
        // Initialize Dictionary Service
        this.dictionaryService = new DictionaryService(apiKey, BASE_URL);
        
        this.initializeEventListeners();
        this.loadTasks();
    }

    initializeEventListeners() {
        this.addTaskButton.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') this.addTask();
        });
    }

    loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        this.tasks = storedTasks;
        this.displayTasks();
    }

    async addTask() {
        const taskText = this.taskInput.value.trim().toLowerCase();
        if (!taskText) return;

        const task = {
            id: Date.now(),
            description: taskText,
            completed: false
        };

        // Fetch definition before adding task
        try {
            const wordDefinition = await this.dictionaryService.fetchWordDefinition(taskText);
            task.definition = wordDefinition.definition;
        } catch (error) {
            task.definition = 'Definition not found';
        }

        this.tasks.push(task);
        this.displayTasks();
        this.taskInput.value = "";
    }

    displayTasks() {
        // Update task list
        this.taskContainer.innerHTML = this.tasks.length 
            ? this.tasks.map(task => `
                <li>
                    <input 
                        type="checkbox" 
                        ${task.completed ? "checked" : ""} 
                        onchange="taskManager.toggleTask(${task.id})"
                    >
                    <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
                    <button onclick="taskManager.deleteTask(${task.id})">Delete</button>
                </li>
            `).join('')
            : "<li>No words added yet!</li>";

        // Update API/Meaning container
        this.apiTaskContainer.innerHTML = this.tasks.length
            ? this.tasks.map(task => `
                <li>
                    <strong>${task.description}</strong>: 
                    ${task.definition || 'Definition not found'}
                </li>
            `).join('')
            : "<li>Nothing yet...</li>";

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.displayTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.displayTasks();
    }
}

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance for window-level access
    window.taskManager = new TaskManager();
});












// import { addnavIcon } from "./index.js";
// const apiKey = import.meta.env.VITE_DICTIONARY;
// const baseURL = "https://www.dictionaryapi.com/api/v3/references/sd3/json/"

// addnavIcon();
// window.addEventListener('resize', addnavIcon);

// let tasks = [];

// window.onload = function() {
//     const storedTasks = JSON.parse(localStorage.getItem('tasks'));
//     if (storedTasks) {
//         tasks = storedTasks;
//         displayTasks();
//     }
// };

// const taskInput = document.getElementById('task-input');
// const addTaskButton = document.getElementById('add-task-button');
// const taskContainer = document.getElementById('task-container');

// function addTask() {
//     const taskText = taskInput.value.trim();
//     if (taskText === "") return;

//     const task = {
//         id: tasks.length,
//         description: taskText,
//         completed: false
//     };

//     tasks.push(task);
//     displayTasks();
//     taskInput.value = "";
// }

// window.addTask = addTask;

// function displayTasks() {
//     taskContainer.innerHTML = "";
//     tasks.forEach(task => {
//         const taskItem = document.createElement('li');
//         taskItem.innerHTML = `
//             <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${task.id})">
//             ${task.description}
//             <button onclick="deleteTask(${task.id})">Delete</button>
//         `;
//         taskContainer.appendChild(taskItem);
//     });

//     if (tasks.length === 0) {
//         taskContainer.innerHTML = "<li>No tasks added yet!</li>";
//     }
    
//     localStorage.setItem('tasks', JSON.stringify(tasks));
// }

// window.toggleTask = function(id) {
//     tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
//     displayTasks();
// };

// window.deleteTask = function(id) {
//     tasks = tasks.filter(task => task.id !== id);
//     displayTasks();
// };

// addTaskButton.addEventListener('click', addTask);
// taskInput.addEventListener('keydown', function(event) {
//     if (event.key === 'Enter') {
//         addTask();
//     }
// });

// async function getJson(url) {
//         const options = {
//           method: "GET",
//           headers: {
//             "X-Api-Key": apiKey
//           }
//         };
//         let data = {};
//         const response = await fetch(baseUrl + url, options);
//         if (response.ok) {
//           data = await response.json();
//         } else throw new Error("response not ok");
//         return data;
// }

// export async function getwords() {
//     const worddata = await getJson("");
//     return worddata.data[0];
//   }

// getJson();

