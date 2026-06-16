let tasks = JSON.parse(
    localStorage.getItem('tasks')
) || [];

let searchTerm = '';
let currentFilter = 'all';

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const tasksContainer = document.getElementById("tasksContainer");
const searchInput = document.getElementById("searchInput");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const filterButtons = document.querySelectorAll(".filter-btn");
const taskPriority = document.getElementById("taskPriority");

searchInput.addEventListener('input', (event) => {
    searchTerm = event.target.value.toLowerCase();
    renderTasks();
});

filterButtons.forEach((button) => {
    button.addEventListener('click', ()=>{
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

function saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(){

    tasksContainer.innerHTML = ''; 

    let filteredTasks = tasks.filter((task) => {
        return task.title.toLowerCase().includes(searchTerm);
    });

    if(currentFilter === 'completed'){
        filteredTasks = filteredTasks.filter((task) => task.completed);
    }
    if(currentFilter === 'pending'){
        filteredTasks = filteredTasks.filter((task) => !task.completed);
    }

    filteredTasks.forEach((task) => {

        const priority = task.priority || 'medium';

        tasksContainer.innerHTML += `
        <div class="task-card ${task.completed ? 'completed' : ''}">
        <span class="priority-badge ${priority}">
            ${priority.toUpperCase()}
        </span>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-actions">
                <button class="complete-btn" data-id="${task.id}">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
        </div>
        `;
    });

    updateStats();

}

tasksContainer.addEventListener("click", (event) => {

        if(event.target.classList.contains("complete-btn")) {
            const taskId = Number(event.target.dataset.id);
            toggleTask(taskId);
        }
        if(event.target.classList.contains("delete-btn")) {
            const taskId = Number(event.target.dataset.id);
            deleteTask(taskId);
        }
    });

function deleteTask(id) {
    const updatedTasks = tasks.filter((task) => {
        return task.id !== id;
    });
    tasks.length = 0; 
    tasks.push(...updatedTasks);
    saveTasks();
    renderTasks();
};

function toggleTask(id){

    const task = tasks.find((task) => task.id === id);
    if(task){
        task.completed = !task.completed;
    }
    saveTasks();
    renderTasks();
};

function updateStats(){

    totalTasks.textContent = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;

}

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const task = {
        id: Date.now(),
        title: taskTitle.value,
        description: taskDescription.value,
        priority: taskPriority.value,
        completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskForm.reset();
    console.log(tasks);
});

renderTasks();

