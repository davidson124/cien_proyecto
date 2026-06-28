let tasks = JSON.parse(
    localStorage.getItem('tasks')
) || [];

let searchTerm = localStorage.getItem('searchTerm') || '';

let currentFilter = localStorage.getItem('currentFilter') || 'all';

let selectedPriority = 'medium';

let currentSort = localStorage.getItem('currentSort') || 'newest';

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

sortTasks.value = currentSort;

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
        priorityButtons.forEach((btn)=>{
            btn.classList.remove('active');
        });
        button.classList.add('active');
        selectedPriority = button.dataset.priority;
    });
});

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

    filteredTasks.forEach((task) => {

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

        tasksContainer.innerHTML += `

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
            </div>
        </div>
        `;
    });

    searchInput.value = searchTerm;
    updateFilterButtons();
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
        priority: selectedPriority,
        dueDate: taskDueDate.value,
        completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskForm.reset();
    console.log(tasks);
});

renderTasks();

