let aboutContent = `
'<b>Work-A-Holic</b>' is the Go-To Application for Scheduling Tasks & Monitoring Them!
`;
$('#show-about-info').click(function () {
    showDialog({
        title: '<b>Work-A-Holic</b>',
        text: aboutContent,
        negative: {
            title: 'Close'
        },
        cancelable: false,
        contentStyle: { 'max-width': '300px' }
    });
});
$('#show-report-bug-info').click(function () {
    showDialog({
        title: 'Everyone Hates Bugs <i class="icon-bug"></i>!',
        text: 'Please <a class="no-link-underline" href="https://github.com/abhisekjuneja/Sandbox/issues/new" target="_blank"><b>Report</b></a> the Bug to me at my GitHub <i class="icon-github icon-large"></i> Repository.',
        negative: {
            title: 'Close'
        },
        cancelable: false
    });
});
$('#give-feedback-info').click(function () {
    showDialog({
        title: 'I <b class="mdl-color-text--red-600"><i class="icon-heart"></i></b> Your Feedback!',
        text: 'Visit <a class="no-link-underline" href="mailto:abhisekjuneja@gmail.com"><b>This Link</b></a> to share your Experience!',
        negative: {
            id: 'cancel-button',
            title: 'Close'
        },
        cancelable: false
    });
});

$('#contact-us-info').click(function () {
    showDialog({
        title: 'Reach out to Me!',
        text: 'Send me an <a class="no-link-underline" href="mailto:abhisekjuneja@gmail.com"><b>E-mail</b></a>.<br />I promise to get in touch ASAP!',
        negative: {
            id: 'cancel-button',
            title: 'Close'
        },
        cancelable: false
    });
});

