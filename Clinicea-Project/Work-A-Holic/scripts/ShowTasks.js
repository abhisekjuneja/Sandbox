function renderTasksToScreen() {
    console.log('Rendered!');
    let pendingTabContent = document.getElementById('pending-tab-content');
    let archivedTabContent = document.getElementById('archived-tab-content');
    pendingTabContent.innerHTML = '';
    archivedTabContent.innerHTML = '';
    let pendingTasksCount = 0;
    let archivedTasksCount = 0;
    let pendingTasksBadge = document.getElementById('pending-tasks-badge');
    let archivedTasksBadge = document.getElementById('archived-tasks-badge');
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        try {
            let task = JSON.parse(localStorage[key]);
            if (task.timeStamp && task.data && task.status) {
                if (task.status === 'pending') {
                    addPendingTaskToScreen(task);
                    pendingTasksCount++;
                    pendingTasksBadge.setAttribute('data-badge', pendingTasksCount);
                }
                else {
                    addArchivedTaskToScreen(task);
                    archivedTasksCount++;
                    archivedTasksBadge.setAttribute('data-badge', archivedTasksCount);
                }
            }
        }
        catch (e) { }
    }
    if(pendingTasksCount == 0) {
        pendingTasksBadge.setAttribute('data-badge', pendingTasksCount);
        pendingTabContent.innerHTML = 'No Pending Tasks to Display!<br /> TODO: Improve this Message'
    }
    if(archivedTasksCount == 0) {
        archivedTasksBadge.setAttribute('data-badge', archivedTasksCount);
        archivedTabContent.innerHTML = 'No Archived Tasks to Display!<br /> TODO: Improve this Message'
    }
}

function addPendingTaskToScreen(task) {
    if(task.data.description.trim() !== '') {
        task.data.description = `<i class="fa fa-comments-o" aria-hidden="true"></i>&nbsp;&nbsp;<b>${task.data.description}</b>`
    }
    let taskTemplate = `
    <div class="demo-card-square mdl-card mdl-shadow--4dp mb-2" id="${task.timeStamp}">
        <div class="mdl-card__title task-pending">
            <h2 class="mdl-card__title-text">${task.data.subject}</h2>
        </div>

        <div class="mdl-card__supporting-text">
            <div class="task-card-text">
                <i class="fa fa-calendar fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${task.data.date}</b>
                <br />
                <i class="fa fa-clock-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${task.data.time}</b>
                <br />
                ${task.data.description}
            </div>                
            <hr />
            <div class="task-card-text">
                You Created this Entry on:
                <br />
                <i class="fa fa-calendar-plus-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.timeStamp).format('dddd, MMMM Do YYYY')}</b>
                <br />
                <i class="fa fa-clock-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.timeStamp).format('h:mm A')}</b>
            </div>
        </div>

        <div class="mdl-card__actions mdl-card--border">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="markTaskAsComplete(${task.timeStamp})">
            Mark As Complete
            </button>
        </div>
    </div>
    `;
    document.getElementById('pending-tab-content').innerHTML += taskTemplate;
}

function addArchivedTaskToScreen(task) {
    if(task.data.description.trim() !== '') {
        task.data.description = `<i class="fa fa-comments-o" aria-hidden="true"></i> <b>${task.data.description}</b>`
    }
    let taskTemplate = `
    <div class="demo-card-square mdl-card mdl-shadow--2dp mb-2" id="${task.timeStamp}">
        <div class="mdl-card__title task-archived">
            <h2 class="mdl-card__title-text">${task.data.subject}</h2>
        </div>

        <div class="mdl-card__supporting-text">
        <div class="task-card-text">
            <i class="fa fa-calendar fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${task.data.date}</b>
            <br />
            <i class="fa fa-clock-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${task.data.time}</b>
            <br />
            ${task.data.description}
        </div>                
        <hr />
        <div class="task-card-text">
            You Created this Entry on:
            <br />
            <i class="fa fa-calendar-plus-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.timeStamp).format('dddd, MMMM Do YYYY')}</b>
            <br />
            <i class="fa fa-clock-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.timeStamp).format('h:mm A')}</b>
        </div>
    </div>
        
        <div class="mdl-card__actions mdl-card--border">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="deleteArchivedTask(${task.timeStamp})">
            Delete Task
            </button>
        </div>
    </div>
    `;
    document.getElementById('archived-tab-content').innerHTML += taskTemplate;
}

function markTaskAsComplete(taskId) {
    let task = JSON.parse(localStorage[taskId]);
    task.status = 'archived';
    localStorage[taskId] = JSON.stringify(task);
    renderTasksToScreen();
}

function deleteArchivedTask(taskId) {
    localStorage.removeItem(taskId);
    renderTasksToScreen();
}