import { addnavIcon } from "./index.js";

// Configuration - IMPORTANT: Verify this is correct!
const apiKey = import.meta.env.VITE_DICTIONARY;
const BASE_URL = "https://www.dictionaryapi.com/api/v3/references/sd3/json/";

// Navigation setup
addnavIcon();
window.addEventListener('resize', addnavIcon);

// Dictionary API Service with Enhanced Error Handling
class DictionaryService {
    constructor(apiKey, baseUrl) {
        if (!apiKey) {
            console.error('⚠️ No API key provided for dictionary service!');
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async fetchWordDefinition(word) {
        console.log('📚 Attempting to fetch definition for:', word);

        if (!word) {
            console.error('❌ No word provided for definition');
            return { word, definition: 'No word submitted' };
        }

        try {
            // Construct full URL with careful logging
            const fullUrl = `${this.baseUrl}${encodeURIComponent(word)}?key=${this.apiKey}`;
            console.log('🌐 Full API Request URL:', fullUrl);

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('📡 Response Status:', response.status);

            if (!response.ok) {
                console.error(`❌ HTTP Error: ${response.status}`);
                return { word, definition: 'API request failed' };
            }

            const data = await response.json();
            console.log('📊 Raw API Response:', data);

            // Enhanced error checking
            if (!data || data.length === 0) {
                console.warn('⚠️ No definition data found');
                return { word, definition: 'No definition available' };
            }

            return this.processWordData(data);

        } catch (error) {
            console.error('🔥 Fetch Error:', error);
            return { 
                word, 
                definition: `Definition fetch failed: ${error.message}`
            };
        }
    }

    processWordData(rawData) {
        // More robust definition extraction
        try {
            const firstEntry = rawData[0];

            // Different methods to extract definition
            const definition = 
                firstEntry.shortdef?.[0] ||  // Primary method
                firstEntry.def?.[0]?.sseq?.[0]?.[0]?.[1]?.dt?.[1] ||  // Fallback method
                'No definition found';

            return {
                word: firstEntry.meta?.id || 'Unknown',
                definition: definition
            };
        } catch (processError) {
            console.error('🚨 Definition processing error:', processError);
            return {
                word: 'Unknown',
                definition: 'Definition extraction failed'
            };
        }
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

        try {
            const wordDefinition = await this.dictionaryService.fetchWordDefinition(taskText);
            
            const task = {
                id: Date.now(),
                description: taskText,
                completed: false,
                definition: wordDefinition.definition
            };

            this.tasks.push(task);
            this.displayTasks();
            this.taskInput.value = "";
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Could not add word. Please try again.');
        }
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

        // Update API/Meaning container - ONLY show checked words with their meanings
        const checkedTasks = this.tasks.filter(task => task.completed);
        this.apiTaskContainer.innerHTML = checkedTasks.length
            ? checkedTasks.map(task => `
                <li>
                    <strong>${task.description}</strong>: 
                    ${task.definition || 'Definition not found'}
                </li>
            `).join('')
            : "<li>No checked words...</li>";

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

