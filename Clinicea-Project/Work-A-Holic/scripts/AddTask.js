const addTaskModalContent = `
<form action="#">
<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input class="mdl-textfield__input is-invalid" type="text" id="task-subject">
    <label class="mdl-textfield__label is-invalid" for="task-subject"><i class="fa fa-asterisk" aria-hidden="true"></i> Task Subject</label>
</div>
<br />
<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input class="mdl-textfield__input" type="text" id="task-due-date">
    <label class="mdl-textfield__label" for="task-due-date"><i class="fa fa-asterisk" aria-hidden="true"></i> Task Due Date</label>
</div>
<br />
<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input class="mdl-textfield__input" type="text" id="task-due-time">
    <label class="mdl-textfield__label" for="task-due-time"><i class="fa fa-asterisk" aria-hidden="true"></i> Task Due Time</label>
    
</span>
</div>
<br />
<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <textarea class="mdl-textfield__input" type="text" rows="2" id="task-description"></textarea>
    <label class="mdl-textfield__label" for="task-description"><i class="fa fa-sticky-note-o" aria-hidden="true"></i> Task Description</label>
</div>
</form>
`;

// $('#add-task-button').click(createAddTaskModal);
window.onload = function () {
    document.getElementById('add-task-button').addEventListener('click', createAddTaskModal);
};

function createAddTaskModal(taskInformation) {
    showDialog({
        id: 'add-task-dialog',
        title: 'Add New Task',
        text: addTaskModalContent,
        negative: {
            id: 'cancel-button',
            title: 'Cancel'
        },
        positive: {
            id: 'ok-button',
            title: 'Add',
            onClick: function (clickEvent) {
                let dialogBox = document.getElementById('add-task-dialog');
                let taskSubjectField = dialogBox.children[0].children[2].children[0].children[0];
                let datePickerTextField = dialogBox.children[0].children[2].children[2].children[0];
                let timePickerTextField = dialogBox.children[0].children[2].children[4].children[0];
                let taskDescriptionField = dialogBox.children[0].children[2].children[6].children[0];
                let validationReport = validateTaskData(taskSubjectField.value, datePickerTextField.value, timePickerTextField.value, taskDescriptionField.value);
                let snackbarContainer = document.getElementById('snackbar-example');
                // If the Validation Check has been Passed & the task is Ready to Be Stored
                if (validationReport.subject && validationReport.date && validationReport.time) {
                    // Add Task to Local Storage
                    // Show Success SnackBar with the Option to Undo the Last Change 
                    let snackbarData = {
                        message: 'Task Added to List',
                        timeout: 3000,
                        actionHandler: successHandler,
                        actionText: 'Undo'
                    };
                    // Create a Handler, which allows the User to Undo the Last Task Addition 
                    let successHandler = function (event) {
                        confirm('Do you Really Want to Undo the Addition of the Last Item?');
                    };
                    setTimeout(function () {
                        snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData)
                    }, 500);
                } else {
                    // Create the Body of the Error Dialog Box, Indicating all the Errors that the User has made
                    let errorBody = createErrorBody(validationReport);
                    // Show the Error Dialog to the User & Redirect the User to Rectify the Errors and try Again
                    showDialog({
                        id: 'form-validation-error-dialog',
                        title: `<span class="mdl-badge" data-badge="${errorBody.errorCount}">ERRORS</span>`,
                        text: errorBody.errorText,
                        positive: {
                            id: 'ok-button',
                            title: 'Rectify',
                            onClick: function () {
                                // Create an Object with the Partial Task Data that the user has entered along with the validation report object
                                // and pass that object to the method that creates a redirected modal again for the user to complete the form
                                let redirectedTaskInformation = createTaskInformation(taskSubjectField.value, datePickerTextField.value, timePickerTextField.value, taskDescriptionField.value, validationReport);
                                createAddTaskModal(redirectedTaskInformation);
                            }
                        },
                        cancelable: false,
                        contentStyle: { 'max-width': '300px' },
                    });
                }
            }
        },
        cancelable: false,
        contentStyle: { 'max-width': '400px', 'text-align': 'center' },
        onLoaded: function () {
            let dialogBox = document.getElementById('add-task-dialog');

            let taskSubjectField = dialogBox.children[0].children[2].children[0].children[0];
            taskSubjectField.addEventListener('focus', function () {
                taskSubjectField.scrollIntoView();
            });

            let datePickerTextField = dialogBox.children[0].children[2].children[2].children[0];
            let datePickerPopUp = new mdDateTimePicker.default({
                type: 'date',
                init: moment(),
                past: moment(),
                future: moment().add(1, 'years'),
                orientation: 'PORTRAIT'
            });

            datePickerTextField.addEventListener('focus', function () {
                datePickerTextField.setAttribute('readonly', '');
                datePickerPopUp.toggle();
            })
            datePickerPopUp.trigger = datePickerTextField;
            datePickerTextField.addEventListener('onOk', function () {
                datePickerTextField.parentElement.classList.add('is-focused');
                datePickerTextField.value = datePickerPopUp.time.format('dddd, MMMM Do YYYY');
                datePickerTextField.removeAttribute('readonly', '');
                datePickerTextField.dispatchEvent(new Event('change'));
            });

            let timePickerTextField = dialogBox.children[0].children[2].children[4].children[0];
            let timePickerPopUp = new mdDateTimePicker.default({
                type: 'time',
                init: moment('10:5 PM', 'h:m A'),
                orientation: 'PORTRAIT'
            });
            timePickerTextField.addEventListener('focus', function () {
                timePickerPopUp.toggle();
                timePickerTextField.setAttribute('readonly', '');
            })
            timePickerPopUp.trigger = timePickerTextField;
            timePickerTextField.addEventListener('onOk', function () {
                timePickerTextField.parentElement.classList.add('is-focused');
                timePickerTextField.value = timePickerPopUp.time.format('h:mm A');
                timePickerTextField.removeAttribute('readonly', '');
                timePickerTextField.dispatchEvent(new Event('change'));
            })

            let taskDescriptionField = dialogBox.children[0].children[2].children[6].children[0];
            taskDescriptionField.addEventListener('focus', function () {
                taskDescriptionField.scrollIntoView();
            });

            if (taskInformation.validationReport) {
                if (taskInformation.validationReport.subject == false) {
                    taskSubjectField.parentElement.classList.add('is-invalid');
                    taskSubjectField.addEventListener('change', function () {
                        taskSubjectField.parentElement.classList.remove('is-invalid');
                    });
                } else {
                    taskSubjectField.value = taskInformation.taskData.subject;
                    taskSubjectField.dispatchEvent(new Event('focus'));
                }
                if (taskInformation.validationReport.date == false) {
                    datePickerTextField.parentElement.classList.add('is-invalid');
                    datePickerTextField.addEventListener('change', function () {
                        datePickerTextField.parentElement.classList.remove('is-invalid');
                    });
                } else {
                    datePickerTextField.value = taskInformation.taskData.date;
                    datePickerTextField.parentElement.classList.add('is-focused');
                }
                if (taskInformation.validationReport.time == false) {
                    timePickerTextField.parentElement.classList.add('is-invalid');
                    timePickerTextField.addEventListener('change', function () {
                        console.log('c');
                        timePickerTextField.parentElement.classList.remove('is-invalid');
                    });
                }
                else {
                    timePickerTextField.value = taskInformation.taskData.time;
                    timePickerTextField.parentElement.classList.add('is-focused');
                }
                if (taskInformation.validationReport.description == true) {
                    taskDescriptionField.value = taskInformation.taskData.description;
                    taskDescriptionField.dispatchEvent(new Event('focus'));
                }
            }
        }
    });
}

function validateTaskData(subject, date, time, description) {
    let validationReport = {
        subject: true,
        date: true,
        time: true,
        description: true
    };
    if (subject.length === 0)
        validationReport.subject = false;
    if (date.length === 0)
        validationReport.date = false;
    if (time.length === 0)
        validationReport.time = false;
    if (description.length == 0)
        validationReport.description = false;
    return validationReport;
}

function createErrorBody(validationReport) {
    let errorBody = {};
    errorBody.errorCount = 0;
    errorBody.errorText = 'Please Rectify the Following Errors:<br /><br />';
    if (validationReport.subject == false) {
        errorBody.errorCount++;
        errorBody.errorText += createErrorText('Subject');
    }
    if (validationReport.date == false) {
        errorBody.errorCount++;
        errorBody.errorText += createErrorText('Date');
    }
    if (validationReport.time == false) {
        errorBody.errorCount++;
        errorBody.errorText += createErrorText('Time');
    }
    return errorBody;
}

function createErrorText(errorType) {
    let leadingChar = errorType.charAt(0);
    let errorString = `<span class="mdl-chip mdl-chip--contact">
    <span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">${leadingChar}</span>
    <span class="mdl-chip__text"><strong>${errorType}</strong></span>
    </span>
    <br/>The ${errorType} Field <strong>Cannot be Empty!</strong>`;
    return errorString;
}

function createTaskInformation(subject, date, time, description, validationReport) {
    let taskInformation = {};
    taskInformation.taskData = {
        subject: subject,
        date: date,
        time: time,
        description: description
    };
    taskInformation.validationReport = validationReport;
    return taskInformation;
}