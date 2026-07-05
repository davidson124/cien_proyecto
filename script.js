/*CONFIGURACIÓN*/

let tasks = JSON.parse( localStorage.getItem('tasks')) || [];
let searchTerm = localStorage.getItem('searchTerm') || '';
let currentFilter = localStorage.getItem('currentFilter') || 'all';
let selectedPriority = 'medium';
let currentSort = localStorage.getItem('currentSort') || 'newest';
let editingTaskId = null;

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const tasksContainer = document.getElementById("tasksContainer");
const searchInput = document.getElementById("searchInput");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const filterButtons = document.querySelectorAll(".filter-btn");
const priorityButtons = document.querySelectorAll(".priority-btn");
const taskDueDate = document.getElementById("taskDueDate");
const sortTasks = document.getElementById('sortTasks');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEditButton');
cancelEditButton.classList.add('hidden');
sortTasks.value = currentSort;

/*UTILIDADES*/

function saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getDaysRemaining(dueDate){
    if(!dueDate) return '';
    const today = new Date();
    const targetDate = new Date(dueDate);
    const difference = targetDate - today;
    const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
    return days;
}

/* LOGICA DE NEGOCIO*/

function getFilteredTasks(){

    let filteredTasks = tasks.filter((task) => {
        return task.title.toLowerCase().includes(searchTerm);
    });

    if(currentFilter === 'completed'){
        filteredTasks = filteredTasks.filter((task) => task.completed);
    }
    if(currentFilter === 'pending'){
        filteredTasks = filteredTasks.filter((task) => !task.completed);
    }

    return filteredTasks;
}
 
function sortFilteredTasks(filteredTasks){

    if(currentSort === 'newest'){
        filteredTasks.sort((a,b)=>{
            return b.id - a.id;
        });
    }
    if(currentSort === 'oldest'){
        filteredTasks.sort((a,b)=>{
            return a.id - b.id;
        })
    }
    if(currentSort === 'priority'){
        const priorityOrder = {
            high:3,
            medium:2,
            low:1
        };
        filteredTasks.sort((a,b)=>{
            return(
                priorityOrder[b.priority] 
                -
                priorityOrder[a.priority]
            );
        });
    }
    if(currentSort === 'duedate'){
        filteredTasks.sort((a,b)=>{
            return(
                new Date(a.dueDate)
                -
                new Date(b.dueDate)
            );
        });
    }

}

/*RENDERIZADO*/

function createTaskCard(task){

    const priority = task.priority || 'medium';
    const remainingDays = getDaysRemaining(task.dueDate);
    let deadlineClass = '';

    if(!task.dueDate){
            deadlineClass = 'no-deadline';
        }
        else if(remainingDays < 0){
            deadlineClass = 'expired';
        }
        else if(remainingDays < 7){
            deadlineClass = 'warning';
        }
        else{
            deadlineClass = 'safe';
        }
        return `
        <div class="task-card ${task.completed ? 'completed' : ''}">
        <span class="priority-badge ${priority}">
            ${priority.toUpperCase()}
        </span>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p class="due-date">🕓 ${task.dueDate || 'No due date'} </p>
            <p class="deadline-status ${deadlineClass}"> ${ !task.dueDate ? 'No deadline' : remainingDays < 0 ? 'Expired' : remainingDays === 0 ? 'Due today' : `${remainingDays} days left`} </p>
            <div class="task-actions">
                <button class="complete-btn" data-id="${task.id}">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
                <button class="edit-btn" data-id="${task.id}">Edit</button>
            </div>
        </div>
        `;
}

function renderTaskCards(filteredtasks){
    const taskCards = filteredtasks.map(createTaskCard);
    tasksContainer.innerHTML = taskCards.join('');
}

function updateSearchInput(){
    searchInput.value = searchTerm;
}

function updateFilterButtons(){
    filterButtons.forEach((button)=>{
        button.classList.remove('active');
        if(
            button.dataset.filter === currentFilter
        ){
            button.classList.add('active');
        }
    });
}

function updateStats(){
    totalTasks.textContent = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
}

function setSelectedPriority(priority){
    priorityButtons.forEach((button)=>{
        button.classList.remove('active');
        if(button.dataset.priority === priority){
            button.classList.add('active');
        }
    });
    selectedPriority = priority;
}

/* MANIPULACIÓN DE DATOS */

function startEditing(taskId){
    const task = tasks.find((task)=>{
        return task.id === taskId;
        if(!task){
            return;
        }
    });
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskDueDate.value = task.dueDate;
    setSelectedPriority(task.priority);
    editingTaskId = task.id;
    submitButton.textContent = 'Save changes';
    cancelEditButton.classList.remove('hidden');
}

function resetFormState(){
    taskForm.reset();
    editingTaskId = null;
    submitButton.textContent = 'Add Task';
    setSelectedPriority('medium');
    cancelEditButton.classList.add('hidden');
}

function updateTask(){
    const task = tasks.find((task)=>{
        return task.id === editingTaskId;
    })
    if(!task){
            return;
    }
    task.title = taskTitle.value;
    task.description = taskDescription.value;
    task.priority = selectedPriority;
    task.dueDate = taskDueDate.value;

    saveTasks();
    renderTasks();
    resetFormState();
}

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

/*EVENTOS*/

searchInput.addEventListener('input', (event) => {
    searchTerm = event.target.value.toLowerCase();
    localStorage.setItem(
        'searchTerm',searchTerm
    );
    renderTasks();
});

sortTasks.addEventListener('change', (event)=>{
    currentSort = event.target.value;
    localStorage.setItem('currentSort',currentSort);
    renderTasks();
})

filterButtons.forEach((button) => {
    button.addEventListener('click', ()=>{
        currentFilter = button.dataset.filter;
        localStorage.setItem(
            'currentFilter', currentFilter
        );
        renderTasks();
    });
});

priorityButtons.forEach((button)=>{
    button.addEventListener('click', ()=>{
       setSelectedPriority(button.dataset.priority);
    });
});

cancelEditButton.addEventListener('click', () =>{
    resetFormState();
})

tasksContainer.addEventListener("click", (event) => {

        if(event.target.classList.contains("complete-btn")) {
            const taskId = Number(event.target.dataset.id);
            toggleTask(taskId);
        }
        if(event.target.classList.contains("delete-btn")) {
            const taskId = Number(event.target.dataset.id);
            deleteTask(taskId);
        }
        if(event.target.classList.contains('edit-btn')){
            const taskId = Number(event.target.dataset.id );
            startEditing(taskId);
        }
});

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if(editingTaskId !== null){
        updateTask();
        return;
    }
    const task = {
        id: Date.now(),
        title: taskTitle.value,
        description: taskDescription.value,
        priority: selectedPriority,
        dueDate: taskDueDate.value,
        completed: false
    };
    saveTasks();
    renderTasks();
    tasks.push(task);
    resetFormState();
    console.log(tasks);
});

/* INICIALIZACIÓN*/

function renderTasks(){

    tasksContainer.innerHTML = ''; 

    let filteredTasks = getFilteredTasks();
    sortFilteredTasks(filteredTasks);
    renderTaskCards(filteredTasks);
    updateSearchInput();
    updateFilterButtons();
    updateStats();
}
renderTasks();