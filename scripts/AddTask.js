"use strict";

/*
    The "use strict" directive is new in JavaScript 1.8.5 (ECMAScript version 5).
    It is not a statement, but a literal expression, ignored by earlier versions of JavaScript.
    The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
    With strict mode, you can not, for example, use undeclared variables.

    Strict mode is supported in:
        IE from version 10. Firefox from version 4.
        Chrome from version 13. Safari from version 5.1.
        Opera from version 12.
*/

function createAddTaskDialog(taskInformation) {
    showDialog({
        id: 'add-new-task-dialog',
        title: 'Add New Task',
        text: addNewTaskDialogContent,
        cancelable: false,
        contentStyle: { 'max-width': '400px', 'text-align': 'center', 'margin-top': '5vh' },
        onLoaded: function () {
            let dialogBox = document.getElementById('add-new-task-dialog');

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
                init: moment((new Date).getTime()),
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
                    taskSubjectField.value = taskInformation.data.subject;
                    taskSubjectField.dispatchEvent(new Event('focus'));
                }
                if (taskInformation.validationReport.date == false) {
                    datePickerTextField.parentElement.classList.add('is-invalid');
                    datePickerTextField.addEventListener('change', function () {
                        datePickerTextField.parentElement.classList.remove('is-invalid');
                    });
                } else {
                    datePickerTextField.value = taskInformation.data.date;
                    datePickerTextField.parentElement.classList.add('is-focused');
                }
                if (taskInformation.validationReport.time == false) {
                    timePickerTextField.parentElement.classList.add('is-invalid');
                    timePickerTextField.addEventListener('change', function () {
                        timePickerTextField.parentElement.classList.remove('is-invalid');
                    });
                } else {
                    timePickerTextField.value = taskInformation.data.time;
                    timePickerTextField.parentElement.classList.add('is-focused');
                }
                if (taskInformation.validationReport.description == true) {
                    taskDescriptionField.value = taskInformation.data.description;
                    taskDescriptionField.dispatchEvent(new Event('focus'));
                }
            }
        },
        negative: {
            id: 'cancel-button',
            title: 'Cancel'
        },
        positive: {
            id: 'ok-button',
            title: 'Add',
            onClick: function (clickEvent) {
                // Grabbing Hold of the Elements in the 'Add New Task' Dialog Box
                let dialogBox = document.getElementById('add-new-task-dialog');
                let taskSubjectField = dialogBox.children[0].children[2].children[0].children[0];
                let datePickerTextField = dialogBox.children[0].children[2].children[2].children[0];
                let timePickerTextField = dialogBox.children[0].children[2].children[4].children[0];
                let taskDescriptionField = dialogBox.children[0].children[2].children[6].children[0];
                // Creating a Validation Report of the Data Entered by the User in the Form & Storing it in 'validationReport'
                let validationReport = validateData(taskSubjectField.value, datePickerTextField.value, timePickerTextField.value, taskDescriptionField.value);
                let snackbarContainer = document.getElementById('snackbar-example');
                // If the Validation Check has been Passed & the task is Ready to Be Stored
                if (validationReport.subject && validationReport.date && validationReport.time) {
                    let newTask = createTaskInformation(taskSubjectField.value, datePickerTextField.value, timePickerTextField.value, taskDescriptionField.value);
                    let currentTimeStamp = moment().format('X');
                    // let currentTimeStamp = (new Date).getTime();
                    newTask.timeStamp = currentTimeStamp;
                    newTask.status = 'pending';
                    // Add New Task Data to Local Storage with the Key of the Created Time Stamp
                    localStorage[currentTimeStamp] = JSON.stringify(newTask);
                    if (localStorage[currentTimeStamp]) {
                        renderTasksToScreen();
                    } else {

                        // TODO: Show An 'Error Snackbar' with the Option to Retry the Last Task Addition
                        // This Feature is Left for Future Additions
                        // This error is most unlikely to happen because of the fact that most browsers do Support LocalStorage

                    }
                    // Create a Handler, which allows the User to Undo the Last Task Addition 
                    let undoLastTaskAddition = function () {
                        showDialog({
                            id: 'undo-task-addition-dialog',
                            title: `Undo Addition of Task : '${newTask.data.subject}'?`,
                            text: `<h6>Are You Sure?</h6>`,
                            negative: {
                                id: 'cancel-button',
                                title: 'Cancel',
                            },
                            positive: {
                                id: 'yes-button',
                                title: 'Yes',
                                onClick: function () {
                                    deleteTask(newTask.timeStamp);
                                    let successSnackbarData = {
                                        message: `The Addition of the Task '${newTask.data.subject}' was Rolled Back`,
                                        timeout: 3000,
                                    };
                                    setTimeout(function () {
                                        snackbarContainer.MaterialSnackbar.showSnackbar(successSnackbarData);
                                    }, 250);
                                }
                            },
                            cancelable: false,
                            contentStyle: { 'max-width': '400px', 'text-align': 'center' },
                        });
                    };
                    // Show A 'Success Snackbar' with the Option to Undo the Last Task Addition
                    let successSnackbarData = {
                        message: `'${taskSubjectField.value}' was Added to the List of Pending Tasks`,
                        timeout: 3000,
                        actionText: 'Undo',
                        actionHandler: undoLastTaskAddition,
                    };
                    setTimeout(function () {
                        snackbarContainer.MaterialSnackbar.showSnackbar(successSnackbarData);
                    }, 250);
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
                                createAddTaskDialog(redirectedTaskInformation);
                            }
                        },
                        cancelable: false,
                        contentStyle: { 'max-width': '300px' },
                    });
                }
            }
        },
        
    });
}

function validateData(subject, date, time, description) {
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
    if (description.trim() === '')
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
    taskInformation.data = {
        subject: subject,
        date: date,
        time: time,
        description: description
    };
    if (validationReport) {
        taskInformation.validationReport = validationReport;
    }
    return taskInformation;
}

const addNewTaskDialogContent = `
<form action="#">

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input is-invalid" type="text" id="task-subject" autocomplete="off">
        <label class="mdl-textfield__label is-invalid" for="task-subject">
            <i class="fa fa-asterisk" aria-hidden="true"></i> Task Subject
        </label>
    </div>
    
    <br />
    
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input" type="text" id="task-due-date" autocomplete="off">
        <label class="mdl-textfield__label" for="task-due-date">
            <i class="fa fa-asterisk" aria-hidden="true"></i> Task Due Date
        </label>
    </div>
    
    <br />
    
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input" type="text" id="task-due-time" autocomplete="off">
        <label class="mdl-textfield__label" for="task-due-time">
            <i class="fa fa-asterisk" aria-hidden="true"></i> Task Due Time
        </label> 
    </div>
    
    <br />
    
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input class="mdl-textfield__input" type="text" rows="2" id="task-description" autocomplete="off"></textarea>
        <label class="mdl-textfield__label" for="task-description">
            <i class="fa fa-sticky-note-o" aria-hidden="true"></i> Task Description
        </label>
    </div>

</form>
`;