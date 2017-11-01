window.onload = function () {
    trackLocalStorageForEmptyData();
}
/*
    This function Checks whether the Local Storage of the Browser is Empty or Not.
    If the Browser's Local Storage is Empty, then it shows a Message that: 'There are No Tasks'
    This function is temporarily used until Firebase functionality is added!
    */ 
function trackLocalStorageForEmptyData() {
    if (localStorage.length == 0) {
        let pendingPageBody = document.getElementById('pending-page-content');
        let archivedPageBody = document.getElementById('archived-page-content');
        pendingPageBody.innerHTML = '<b><br /><i class="fa fa-clone fa-4x" aria-hidden="true"></i><br /><br />Pending Task List is Empty!<br /><br /> Click on the <i class="icon-plus-sign"></i>  icon to Add a New Task</b>';
        archivedPageBody.innerHTML = '<b><br /><i class="fa fa-clone fa-4x" aria-hidden="true"></i><br /><br />Archived Task List is Empty!<br /><br /> Click on the <i class="icon-plus-sign"></i>  icon to Add a New Task</b>';
    }
}