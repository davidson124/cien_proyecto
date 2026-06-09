const taskForm = document.getElementById("taskForm");
const tasks = [];

function renderTasks(){

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

    taskContainer.innerHTML = ''; 
    tasks.forEach((task) => {
        taskContainer.innerHTML += `
        <div class="task-card ${task.completed ? 'completed' : ''}">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-actions">
                <button class="complete-btn" data-id="${task.id}">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
        </div>
        `;
    });

}

function deleteTask(id) {
    const updatedTasks = tasks.filter((task) => {
        return task.id !== id;
    });
    tasks.length = 0; 
    tasks.push(...updatedTasks);
    renderTasks();

}

function toggleTask(id){

    const task = tasks.find((task) => task.id === id);
    if(task){
        task.completed = !task.completed;
    }
    renderTasks();
};

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskContainer = document.getElementById("tasksContainer");

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const task = {
        id: Date.now(),
        title: taskTitle.value,
        description: taskDescription.value,
        completed: false
    };
    tasks.push(task);
    renderTasks();
    taskForm.reset();
    console.log(tasks);
});


