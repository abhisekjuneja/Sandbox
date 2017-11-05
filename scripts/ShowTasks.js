function renderTasksToScreen() {
    // console.log('Rendered!');
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
            // let timeStampObject = {};
            // timeStampObject.dueDateTimeStamp = moment(task.data.date + ' ' + task.data.time, 'dddd, MMMM Do YYYY h:mm A').format('X');
            // timeStampObject.createdDateTimeStamp = task.timeStamp;
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
            // tasksDueTimeStamp.push(timeStampObject);
        } catch (exception) {
            console.log(exception);
        }
    }
    // for (let i = 0; i < tasksDueTimeStamp.length; i++) {
    //     let task = JSON.parse(localStorage[tasksDueTimeStamp[i].createdDateTimeStamp]);
    // }
    if (pendingTasksCount == 0) {
        pendingTasksBadge.setAttribute('data-badge', pendingTasksCount);
        pendingTabContent.innerHTML = '<br /><img src="./assets/icon.png" class="logo-img" alt="Work-A-Holic Logo" /><br /><b>Pending Task List is Empty!<br /><br /> Click on the <i class="icon-plus-sign"></i>  icon to Add a New Task</b>';
    }
    if (archivedTasksCount == 0) {
        archivedTasksBadge.setAttribute('data-badge', archivedTasksCount);
        archivedTabContent.innerHTML = '<br /><img src="./assets/icon.png" class="logo-img" alt="Work-A-Holic Logo" /><br /><b>Archived Task List is Empty!<br /><br /> Click on the <i class="icon-plus-sign"></i>  icon to Add a New Task</b>';
    }
}

function addPendingTaskToScreen(task) {
    if (task.data.description.trim() !== '') {
        task.data.description = `<i class="fa fa-comments-o" aria-hidden="true"></i>&nbsp;&nbsp;<b>${task.data.description}</b>`
    }
    let taskTemplate = `
    <div class="demo-card-square mdl-card mdl-shadow--4dp mb-2" id="${task.timeStamp}">
        <div class="mdl-card__title mdl-color--amber-A100">
            <h2 class="mdl-card__title-text">${task.data.subject}</h2>
        </div>

        <div class="mdl-card__supporting-text">
            <div class="task-card-text">
                Task Details:<br />
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
                <i class="fa fa-calendar-plus-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.timeStamp, 'X').format('dddd, MMMM Do YYYY')}</b>
                <br />
                <i class="fa fa-clock-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.timeStamp, 'X').format('h:mm A')}</b>
            </div>
        </div>

        <div class="mdl-card__actions mdl-card--border">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--cyan-50" onclick="moveTaskToArchivedTab(${task.timeStamp})">
            Mark As Complete
            </button>
        </div>
    </div>
    `;
    document.getElementById('pending-tab-content').innerHTML += taskTemplate;
}

function addArchivedTaskToScreen(task) {
    let archivedTaskDisplayClass = '';
    let completionStatusHTML = '';
    if (task.data.description.trim() !== '') {
        task.data.description = `<i class="fa fa-comments-o" aria-hidden="true"></i> <b>${task.data.description}</b>`
    }
    if (task.completionInTime == true) {
        archivedTaskDisplayClass = 'mdl-color--green-A200';
        completionStatusHTML = `
        <i class="fa fa-thumbs-up fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b class="mdl-color-text--green-600">Completed Before Due Date!</b>
        <br />
        <i class="fa fa-calendar-plus-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.completionTimeStamp, 'X').format('dddd, MMMM Do YYYY')}</b>
        <br />
        <i class="fa fa-clock-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.completionTimeStamp, 'X').format('h:mm A')}</b>
        `;
    } else {
        archivedTaskDisplayClass = 'mdl-color--deep-orange-200';
        completionStatusHTML = `
        <i class="fa fa-thumbs-down fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b class="mdl-color-text--red-400">Expired on Due Date</b>
        <br />
        <i class="fa fa-calendar-plus-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.date).format('dddd, MMMM Do YYYY')}</b>
        <br />
        <i class="fa fa-clock-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.time).format('h:mm A')}</b>
        `;
    }
    let taskTemplate = `
    <div class="demo-card-square mdl-card mdl-shadow--2dp mb-2" id="${task.timeStamp}">
        <div class="mdl-card__title ${archivedTaskDisplayClass}">
            <h2 class="mdl-card__title-text">${task.data.subject}</h2>
        </div>

        <div class="mdl-card__supporting-text">
        <div class="task-card-text">
            Task Details:<br />
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
            <i class="fa fa-calendar-plus-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.timeStamp, 'X').format('dddd, MMMM Do YYYY')}</b>
            <br />
            <i class="fa fa-clock-o fa-large" aria-hidden="true"></i>&nbsp;&nbsp;<b>${moment(task.timeStamp, 'X').format('h:mm A')}</b>
        </div>
        <hr />
        <div class="task-card-text">
            ${completionStatusHTML}
        </div>
    </div>
        
        <div class="mdl-card__actions mdl-card--border">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--orange-100" onclick="deleteTask(${task.timeStamp})">
            Delete Task
            </button>
        </div>
    </div>
    `;
    document.getElementById('archived-tab-content').innerHTML += taskTemplate;
}

function moveTaskToArchivedTab(taskId) {
    let task = JSON.parse(localStorage[taskId]);
    task.status = 'archived';
    if (checkIfTaskExpired(task)) {
        task.completionInTime = false;
    } else {
        task.completionInTime = true;
        task.completionTimeStamp = moment().format('X');
    }
    console.log(task);
    localStorage[taskId] = JSON.stringify(task);
    renderTasksToScreen();
}

function checkIfTaskExpired(task) {
    let currentDateTimeStamp = moment().format('X');
    // console.log(currentDateTimeStamp);
    let dueDateTimeStamp = moment(task.data.date + ' ' + task.data.time, 'dddd, MMMM Do YYYY h:mm A').format('X');
    if (currentDateTimeStamp > dueDateTimeStamp) {
        return true;
    } else {
        return false
    }
}

function deleteTask(taskId) {
    localStorage.removeItem(taskId);
    renderTasksToScreen();
}

function monitorTaskTimeStamps() {
    // console.log('Monitoring!');
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        try {
            let task = JSON.parse(localStorage[key]);
            if (task.status === 'pending') {
                if (checkIfTaskExpired(task)) {
                    console.log(`Moving ${task} to Archived! Due Date ${task.date} ${task.time} Passed!`);
                    moveTaskToArchivedTab(task.timeStamp);
                }
            }
        }
        catch (exception) { }
    }
}