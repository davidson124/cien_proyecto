const taskForm = document.getElementById("taskForm");
const tasks = [];
function renderTasks(){

    taskContainer.innerHTML = ''; 
    tasks.forEach((task) => {
        taskContainer.innerHTML += `
        <div class="task-card">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-actions">
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
        `;
    });

}

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


