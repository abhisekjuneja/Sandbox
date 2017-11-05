// Initialization
window.onload = function () {
    renderTasksToScreen();

    let addTaskButton = document.getElementById('add-task-button');
    addTaskButton.addEventListener('click', createAddTaskDialog);


    let refreshOption = document.getElementById('refresh-option');
    refreshOption.addEventListener('click', function () {
        renderTasksToScreen();
    });

    let searchOption = document.getElementById('search-option');
    searchOption.addEventListener('click', createSearchDialog);

    let calendarOption = document.getElementById('calendar-option');
    calendarOption.addEventListener('click', createCalendar);

    document.addEventListener('wheel', onTouchStart, { passive: true });
    document.addEventListener('mousewheel', onTouchStart, { passive: true });
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchStart, { passive: true });

    setInterval(monitorTaskTimeStamps, 1000);
}

function createSearchDialog() {
    showDialog({
        id: 'search-dialog',
        title: 'Search Tasks By Keyword',
        text: searchTasksDialogContent,
        cancelable: true,
        contentStyle: { 'max-width': '400px', 'text-align': 'center' },
        negative: {
            id: 'cancel-button',
            title: 'Cancel',
        },
        onLoaded: function () { },
        positive: {
            id: 'search-button',
            title: 'Search',
            onClick: function () {
                // Grab a Hold of the Search Keyword Input Field from the 'search-dialog' Dialog
                let searchKeywordInputField = document.getElementById('search-dialog').children[0].children[2].children[0].children[0];
                // Check if the User has not entered any keyword, but is still trying to Search for Tasks
                if (searchKeywordInputField.value.trim() == '') {
                    // If the User has not entered any keywords, but is still trying to Search for Tasks
                    // Then Show him an Error Dialog, Asking them to rectify their error and try again
                    showDialog({
                        id: 'search-error-dialog',
                        title: '<span class="mdl-badge" data-badge="1">ERRORS</span>',
                        text: `
                        Please Rectify the Following Error:
                        <br /><br />
                        <span class="mdl-chip mdl-chip--contact">
                            <span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">K</span>
                            <span class="mdl-chip__text"><strong>Keyword</strong></span>
                        </span>
                        <br/>Search Keyword <strong>Cannot be Empty!</strong>`,
                        cancelable: true,
                        contentStyle: { 'max-width': '300px' },
                        positive: {
                            id: 'rectify-button',
                            title: 'Rectify',
                            onClick: function () {
                                // Once they Decide to Rectify the Error, Present the User with the 
                                // Search Task Dialog once again
                                createSearchDialog();
                            }
                        }
                    });
                }
                else {
                    // If the Search Keyword is not Empty,
                    // Try to Search for the Keyword in the Existing Task List
                    // By Passing the Keyword as an Argument to the 'searchTaskList' method 
                    searchTaskList(searchKeywordInputField.value)
                }
            }
        }
    });
}

const searchTasksDialogContent = `
<form action="#">

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused">
        <input class="mdl-textfield__input is-invalid" type="text" id="task-subject" required autocomplete="off"> 
        <label class="mdl-textfield__label is-invalid" for="task-subject">
            <i class="fa fa-asterisk" aria-hidden="true"></i> Search Keyword
        </label>
    </div>
    
</form>
`;

/*
    This Method Searches for the 'keyword' Passed to it as an Argument
    in all the Pending & Archived Tasks, Listing them out in the their Respective Tabs 
*/

function searchTaskList(keyword) {
    let pendingTabContent = document.getElementById('pending-tab-content');
    let archivedTabContent = document.getElementById('archived-tab-content');
    pendingTabContent.innerHTML = `
    <ul class="mdl-list" style="text-align: left; margin: -1.5rem 0 -1.4rem -1rem;">
        <li class="mdl-list__item mdl-list__item--three-line">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-avatar">search</i>
                <span>Search Results</span>
                <span class="mdl-list__item-text-body">
                Pending Tasks Containing the Keyword: <b>'${keyword}'</b>
                </span>
            </span>
        </li>
    </ul>
    <hr />
    `;
    archivedTabContent.innerHTML = `
    <ul class="mdl-list" style="text-align: left; margin: -1.5rem 0 -1.4rem -1rem;">
        <li class="mdl-list__item mdl-list__item--three-line">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-avatar">search</i>
                <span>Search Results</span>
                <span class="mdl-list__item-text-body">
                Archived Tasks Containing the Keyword: <b>'${keyword}'</b>
                </span>
            </span>
        </li>
    </ul>
    <hr />
    `;
    let pendingTasksSearchResultsCount = 0;
    let archivedTasksSearchResultsCount = 0;
    let pendingTasksBadge = document.getElementById('pending-tasks-badge');
    let archivedTasksBadge = document.getElementById('archived-tasks-badge');
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        try {
            let task = JSON.parse(localStorage[key]);
            if (task.timeStamp && task.data && task.status) {
                let taskInfo = `${task.data.subject} ${task.data.date} ${task.data.time} ${task.data.description} ${moment(task.timeStamp).format('dddd, MMMM Do YYYY')} ${moment(task.timeStamp).format('h:mm A')}`;
                let searchPattern = new RegExp(keyword.trim().toLowerCase());
                if (searchPattern.test(taskInfo.toLowerCase())) {
                    if (task.status === 'pending') {
                        addPendingTaskToScreen(task);
                        pendingTasksSearchResultsCount++;
                        pendingTasksBadge.setAttribute('data-badge', pendingTasksSearchResultsCount);
                    } else {
                        addArchivedTaskToScreen(task);
                        archivedTasksSearchResultsCount++;
                        archivedTasksBadge.setAttribute('data-badge', archivedTasksSearchResultsCount);
                    }
                }
            }
        }
        catch (exception) { }
    }
    if (pendingTasksSearchResultsCount == 0) {
        pendingTasksBadge.setAttribute('data-badge', pendingTasksSearchResultsCount);
        pendingTabContent.innerHTML += `
        <b><br /><i class="fa fa-exclamation-triangle fa-4x" aria-hidden="true"></i><br /><br />No Tasks Found with the Keyword:<br /><b>${keyword}</b><br /><br />`;
    }
    if (archivedTasksSearchResultsCount == 0) {
        archivedTasksBadge.setAttribute('data-badge', archivedTasksSearchResultsCount);
        archivedTabContent.innerHTML += `
        <b><br /><i class="fa fa-exclamation-triangle fa-4x" aria-hidden="true"></i><br /><br />No Tasks Found with the Keyword:<br /><b>${keyword}</b><br /><br />`;
    }
    pendingTabContent.innerHTML += `
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick="javascript:renderTasksToScreen()">
        <i class="material-icons">refresh</i>
    </button>`;
    archivedTabContent.innerHTML += `
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick="javascript:renderTasksToScreen()">
        <i class="material-icons">refresh</i>
    </button>`;
}

function createCalendar() {
    let calendarOption = document.getElementById('calendar-option');
    let datePickerPopUp = new mdDateTimePicker.default({
        type: 'date',
        init: moment(),
        past: moment().subtract(1, 'years'),
        future: moment().add(1, 'years'),
        orientation: 'PORTRAIT'
    });
    datePickerPopUp.trigger = calendarOption;
    datePickerPopUp.toggle();
    calendarOption.addEventListener('onOk', function () {
        searchTaskListWithDate(datePickerPopUp.time.format('dddd, MMMM Do YYYY'));
    });
}

/*
    This Method Searches for the 'keyword' Passed to it as an Argument
    in all the Pending & Archived Tasks, Listing them out in the their Respective Tabs 
*/

function searchTaskListWithDate(date) {
    let pendingTabContent = document.getElementById('pending-tab-content');
    let archivedTabContent = document.getElementById('archived-tab-content');
    pendingTabContent.innerHTML = `
    <ul class="mdl-list" style="text-align: left; margin: -1.5rem 0 -1.4rem -1rem;">
        <li class="mdl-list__item mdl-list__item--three-line">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-avatar">search</i>
                <span>Search Results</span>
                <span class="mdl-list__item-text-body">
                Pending Tasks Scheduled For: <b>'${date}'</b>
                </span>
            </span>
        </li>
    </ul>
    <hr />
    `;
    archivedTabContent.innerHTML = `
    <ul class="mdl-list" style="text-align: left; margin: -1.5rem 0 -1.4rem -1rem;">
        <li class="mdl-list__item mdl-list__item--three-line">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-avatar">search</i>
                <span>Search Results</span>
                <span class="mdl-list__item-text-body">
                Pending Tasks Scheduled For: <b>'${date}'</b>
                </span>
            </span>
        </li>
    </ul>
    <hr />
    `;
    let pendingTasksSearchResultsCount = 0;
    let archivedTasksSearchResultsCount = 0;
    let pendingTasksBadge = document.getElementById('pending-tasks-badge');
    let archivedTasksBadge = document.getElementById('archived-tasks-badge');
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        try {
            let task = JSON.parse(localStorage[key]);
            if (task.timeStamp && task.data && task.status) {
                let taskInfo = `${task.data.subject} ${task.data.date} ${task.data.time} ${task.data.description} ${moment(task.timeStamp).format('dddd, MMMM Do YYYY')} ${moment(task.timeStamp).format('h:mm A')}`;
                let searchPattern = new RegExp(date);
                if (searchPattern.test(task.data.date)) {
                    if (task.status === 'pending') {
                        addPendingTaskToScreen(task);
                        pendingTasksSearchResultsCount++;
                        pendingTasksBadge.setAttribute('data-badge', pendingTasksSearchResultsCount);
                    } else {
                        addArchivedTaskToScreen(task);
                        archivedTasksSearchResultsCount++;
                        archivedTasksBadge.setAttribute('data-badge', archivedTasksSearchResultsCount);
                    }
                }
            }
        }
        catch (exception) { }
    }
    if (pendingTasksSearchResultsCount == 0) {
        pendingTasksBadge.setAttribute('data-badge', pendingTasksSearchResultsCount);
        pendingTabContent.innerHTML += `
        <b><br /><i class="fa fa-exclamation-triangle fa-4x" aria-hidden="true"></i><br /><br />No Tasks were Scheduled For:<br /><b>${date}</b><br /><br />`;
    }
    if (archivedTasksSearchResultsCount == 0) {
        archivedTasksBadge.setAttribute('data-badge', archivedTasksSearchResultsCount);
        archivedTabContent.innerHTML += `
        <b><br /><i class="fa fa-exclamation-triangle fa-4x" aria-hidden="true"></i><br /><br />No Tasks were Scheduled For:<br /><b>${date}</b><br /><br />`;
    }
    pendingTabContent.innerHTML += `
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick="javascript:renderTasksToScreen()">
        <i class="material-icons">refresh</i>
    </button>`;
    archivedTabContent.innerHTML += `
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick="javascript:renderTasksToScreen()">
        <i class="material-icons">refresh</i>
    </button>`;
}