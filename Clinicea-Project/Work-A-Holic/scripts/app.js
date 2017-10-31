// window.onload = function () {
//     trackLocalStorageForEmptyData();
// }
// /*
//     This function Checks whether the Local Storage of the Browser is Empty or Not.
//     If the Browser's Local Storage is Empty, then it shows a Message that: 'There are No Tasks'
//     This function is temporarily used until Firebase functionality is added!
//     */ 
// function trackLocalStorageForEmptyData() {
//     if (localStorage.length == 0) {
//         let pendingPageBody = document.getElementById('pending-page-content');
//         let archivedPageBody = document.getElementById('archived-page-content');
//         pendingPageBody.innerHTML = '<br />No Pending Tasks to Display<br /><br /> Click on the <i class="icon-plus-sign"></i>  icon to Add a New Task';
//         archivedPageBody.innerHTML = '<br />No Archived Tasks to Display<br /><br /> Click on the <i class="icon-plus-sign"></i> icon to Add a New Task';
//     }
// }