// Initialization
window.onload = function () {
    document.getElementById('add-task-button').addEventListener('click', createAddTaskModal);
    renderTasksToScreen();
}

// let search = document.getElementById('search-option');
// search.addEventListener('click', function () {
//     showDialog({
//         id: 'dialog-id',
//         title: 'Title',
//         text: 'Text',
//         negative: {
//             id: 'cancel-button',
//             title: 'Cancel',
//             onClick: function () { }
//         },
//         positive: {
//             id: 'ok-button',
//             title: 'OK',
//             onClick: function () { }
//         },
//         cancelable: true,
//         contentStyle: { 'max-width': '500px' },
//         onLoaded: function () { },
//         onHidden: function () { }
//     });
// });