const addTaskModalContent = `
<form action="#">
<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input class="mdl-textfield__input is-invalid" type="text" id="task-subject">
    <label class="mdl-textfield__label is-invalid" for="task-subject">Task Subject</label>
</div>
<br />
<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input class="mdl-textfield__input" type="text" id="task-due-date">
    <label class="mdl-textfield__label" for="task-due-date">Task Due Date</label>
</div>
<br />
<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input class="mdl-textfield__input" type="text" id="task-due-time">
    <label class="mdl-textfield__label" for="task-due-time">Task Due Time</label>
</div>
<br />
<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <textarea class="mdl-textfield__input" type="text" rows="2" id="task-description"></textarea>
    <label class="mdl-textfield__label" for="task-description">Task Description</label>
</div>
</form>
`;

$('#add-task-button').click(createAddTaskModal);

function createAddTaskModal(subject, date, time, description) {
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
                if (validationReport.subject || validationReport.date || validationReport.time) {
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
                    showDialog({
                        id: 'dialog-id',
                        title: 'Title',
                        text: 'Text',
                        negative: {
                            id: 'cancel-button',
                            title: 'Cancel',
                            onClick: function () { }
                        },
                        positive: {
                            id: 'ok-button',
                            title: 'OK',
                            onClick: function () { }
                        },
                        cancelable: true,
                        contentStyle: { 'max-width': '500px' },
                        onLoaded: function () { },
                        onHidden: function () { }
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
            })

            let taskDescriptionField = dialogBox.children[0].children[2].children[6].children[0];
        },
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
    if (description.length === 0)
        validationReport.description = false;
    return validationReport;
}