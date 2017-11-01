const addTaskModalContent = `
<form action="#">
<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input class="mdl-textfield__input" type="text" id="task-subject">
    <label class="mdl-textfield__label" for="task-subject">Task Subject</label>
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
$('#add-task-button').click(function () {
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
            onClick: function () {
                let dialogBox = document.getElementById('add-task-dialog');
                let taskSubjectField = dialogBox.children[0].children[2].children[0].children[0];
                let datePickerTextField = dialogBox.children[0].children[2].children[2].children[0];
                let timePickerTextField = dialogBox.children[0].children[2].children[4].children[0];
                let taskDescriptionField = dialogBox.children[0].children[2].children[6].children[0];
                // validateTaskData(taskSubjectField.value, datePickerTextField.value, timePickerTextField.value, taskDescriptionField.value);

                let snackbarContainer = document.getElementById('snackbar-example');
                let handler = function (event) {
                    alert('User wants to undo the Action!');
                };
                let snackbarData = {
                    message: 'Task Added to List',
                    timeout: 3000,
                    actionHandler: handler,
                    actionText: 'Undo'
                };
                setTimeout(function () {
                    snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData)
                }, 500);
            }
        },
        cancelable: false,
        contentStyle: { 'max-width': '400px', 'text-align': 'center' },
        onLoaded: function () {
            let dialogBox = document.getElementById('add-task-dialog');

            let taskSubjectField = dialogBox.children[0].children[2].children[0].children[0];
            taskSubjectField.addEventListener('focus', function() {
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
                datePickerTextField.value = datePickerPopUp.time.toString();
                let selectedDate = new Date(datePickerPopUp.time);
                console.log(selectedDate.getFullYear());
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
            })
            timePickerPopUp.trigger = timePickerTextField;
            timePickerTextField.addEventListener('onOk', function () {
                timePickerTextField.parentElement.classList.add('is-focused');
                timePickerTextField.value = timePickerPopUp.time.toString();
            })

            let taskDescriptionField = dialogBox.children[0].children[2].children[6].children[0];
        },
    });
});

// function addNewTaskToLocalStorage(subject, date, time, description) {
//     let validationReport = {
//         subject: true,
//         date: true,
//         time: true,
//         description: true
//     };
//     if(subject.length == 0) {
//         validationReport.subject = false;
//     }
//     if(date)
//     console.log(newTask);
// }