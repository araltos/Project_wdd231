// Configuration
const apiKey = import.meta.env.VITE_DICTIONARY;
const BASE_URL = "https://www.dictionaryapi.com/api/v3/references/sd3/json/";

class DictionaryService {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async fetchWordDefinition(word) {
        if (!word) throw new Error("No word provided");

        try {
            // Ensure URL encoding for special characters
            const encodedWord = encodeURIComponent(word);
            const response = await fetch(`${this.baseUrl}${encodedWord}?key=${this.apiKey}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // More robust definition extraction
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
        // Added more robust checking
        if (!rawData || !rawData.length) {
            return {
                word: 'Unknown',
                definition: 'No definition available'
            };
        }

        const firstDefinition = rawData[0];
        
        // Multiple fallback strategies for definition
        const definition = 
            firstDefinition.shortdef?.[0] ||  // Primary method
            'No definition available';

        return {
            word: firstDefinition.meta?.id || 'Unknown',
            definition: definition
        };
    }
}

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

        try {
            // Fetch definition before creating task
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
        // Task list rendering remains the same
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

        // Modified to show ALL tasks' definitions initially
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

document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});














// import { addnavIcon } from "./index.js";


// const apiKey = import.meta.env.VITE_DICTIONARY;
// const BASE_URL = "https://www.dictionaryapi.com/api/v3/references/sd3/json/";


// addnavIcon();
// window.addEventListener('resize', addnavIcon);


// class DictionaryService {
//     constructor(apiKey, baseUrl) {
//         this.apiKey = apiKey;
//         this.baseUrl = baseUrl;
//     }

//     async fetchWordDefinition(word) {
//         if (!word) throw new Error("No word provided");

//         try {
//             const response = await fetch(`${this.baseUrl}${word}?key=${this.apiKey}`, {
//                 method: 'GET',
//                 headers: {
//                     'Accept': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             return this.processWordData(data);
//         } catch (error) {
//             console.error('Dictionary API Error:', error);
//             return {
//                 word: word,
//                 definition: 'Definition not found'
//             };
//         }
//     }

//     processWordData(rawData) {
//         if (!rawData || !rawData.length) {
//             throw new Error('No definition found');
//         }

//         const firstDefinition = rawData[0];
//         return {
//             word: firstDefinition.meta?.id || 'Unknown',
//             definition: firstDefinition.shortdef?.[0] || 'No definition available'
//         };
//     }
// }


// class TaskManager {
//     constructor() {
//         this.tasks = [];
//         this.taskInput = document.getElementById('task-input');
//         this.addTaskButton = document.getElementById('add-task-button');
//         this.taskContainer = document.getElementById('task-container');
//         this.apiTaskContainer = document.getElementById('api-task-container');
        
//         this.dictionaryService = new DictionaryService(apiKey, BASE_URL);
        
//         this.initializeEventListeners();
//         this.loadTasks();
//     }

//     initializeEventListeners() {
//         this.addTaskButton.addEventListener('click', () => this.addTask());
//         this.taskInput.addEventListener('keydown', (event) => {
//             if (event.key === 'Enter') this.addTask();
//         });
//     }

//     loadTasks() {
//         const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
//         this.tasks = storedTasks;
//         this.displayTasks();
//     }

//     async addTask() {
//         const taskText = this.taskInput.value.trim().toLowerCase();
//         if (!taskText) return;

//         const task = {
//             id: Date.now(),
//             description: taskText,
//             completed: false
//         };

//         try {
//             const wordDefinition = await this.dictionaryService.fetchWordDefinition(taskText);
//             task.definition = wordDefinition.definition;
//         } catch (error) {
//             task.definition = 'Definition not found';
//         }

//         this.tasks.push(task);
//         this.displayTasks();
//         this.taskInput.value = "";
//     }

//     displayTasks() {
//         this.taskContainer.innerHTML = this.tasks.length 
//             ? this.tasks.map(task => `
//                 <li>
//                     <input 
//                         type="checkbox" 
//                         ${task.completed ? "checked" : ""} 
//                         onchange="taskManager.toggleTask(${task.id})"
//                     >
//                     <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
//                     <button onclick="taskManager.deleteTask(${task.id})">Delete</button>
//                 </li>
//             `).join('')
//             : "<li>No words added yet!</li>";

//         this.apiTaskContainer.innerHTML = this.tasks.length
//             ? this.tasks.map(task => `
//                 <li>
//                     <strong>${task.description}</strong>: 
//                     ${task.definition || 'Definition not found'}
//                 </li>
//             `).join('')
//             : "<li>Nothing yet...</li>";

//         localStorage.setItem('tasks', JSON.stringify(this.tasks));
//     }

//     toggleTask(id) {
//         this.tasks = this.tasks.map(task => 
//             task.id === id ? { ...task, completed: !task.completed } : task
//         );
//         this.displayTasks();
//     }

//     deleteTask(id) {
//         this.tasks = this.tasks.filter(task => task.id !== id);
//         this.displayTasks();
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     window.taskManager = new TaskManager();
// });

