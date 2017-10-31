$('#show-about-info').click(function () {
    showDialog({
        title: '<b>Work-A-Holic!</b>',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi amet reprehenderit, quia illum facilis alias eaque dicta impedit tempore saepe?',
        negative: {
            title: 'Close'
        },
        cancelable: true
    });
});
$('#show-report-bug-info').click(function () {
    showDialog({
        title: 'You Hate Bugs <i class="icon-bug"></i>? We Do Too!',
        text: 'Please <a class="no-link-underline" href="https://github.com/abhisekjuneja/Sandbox/issues/new" target="_blank">Report</a> the Bug to our Developers at our GitHub <i class="icon-github icon-large"></i> Repository.',
        negative: {
            title: 'Close'
        },
        cancelable: true
    });
});
$('#give-feedback-info').click(function () {
    showDialog({
        title: 'We would <i class="icon-heart"></i> to Read about your Experience!',
        text: 'Visit <a class="no-link-underline" href="javascript:void(0)">this link</a> to share your Experience!',
        negative: {
            id: 'cancel-button',
            title: 'Close'
        },
        cancelable: true
    });
});

$('#contact-us-info').click(function () {
    showDialog({
        title: 'Want to get in Touch? Sure Reach out to Us!',
        text: 'Send an <a class="no-link-underline" href="mailto:abhisekjuneja@gmail.com">email</a> to our Team. We promise to get in touch Shortly!',
        negative: {
            id: 'cancel-button',
            title: 'Close'
        },
        cancelable: true
    });
});