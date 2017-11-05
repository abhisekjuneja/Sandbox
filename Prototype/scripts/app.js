const addTaskButton = document.getElementById('add-task');
addTaskButton.addEventListener('click', addTask);

const taskSubject = document.getElementById('task-subject');
const taskDescription = document.getElementById('task-description');
const taskDueDate = document.getElementById('task-due-date');
const taskDueTime = document.getElementById('task-due-time');

function addTask() {
    let validationStatus = validateInput();
    if (validationStatus == false) {
        window.alert('Please Rectify the Errors!');
    }
    else {
        let currentDate = new Date;
        let task = {
            timestamp: currentDate.getTime(),
            subject: taskSubject.value,
            dueDate: taskDueDate.value,
            dueTime: taskDueTime.value,
            description: taskDescription
        };
        console.log(task);
        let taskNode = document.createTextNode(JSON.stringify(task));
        document.getElementById('output').appendChild(taskNode);
        sessionStorage.setItem(currentDate.getTime(), JSON.stringify(task));
    }
}

function validateInput() {
    let status = true;
    if (taskSubject.value === "") {
        taskSubject.parentElement.parentElement.classList.add('has-danger');
        taskSubject.parentElement.nextElementSibling.classList.remove('text-hide')
        status = false;
    } else {
        taskSubject.parentElement.parentElement.classList.remove('has-danger');
        taskSubject.parentElement.nextElementSibling.classList.add('text-hide')
    }
    if (taskDueDate.value === "") {
        taskDueDate.parentElement.classList.add('has-danger');
        taskDueDate.nextElementSibling.classList.remove('text-hide');
        status = false;
    } else {
        taskDueDate.parentElement.classList.remove('has-danger');
        taskDueDate.nextElementSibling.classList.add('text-hide');
    }
    if (taskDueTime.value === "") {
        taskDueTime.parentElement.classList.add('has-danger');
        taskDueTime.nextElementSibling.classList.remove('text-hide');
        status = false;
    } else {
        taskDueTime.parentElement.classList.remove('has-danger');
        taskDueTime.nextElementSibling.classList.add('text-hide');
    }
    return status;
}