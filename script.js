const taskform = document.getElementById("taskForm");
taskform.addEventListener('submit', (event)=>{
    event.preventDefault();
    console.log('Task submitted');
});