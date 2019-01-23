# issues-alert
Alert's Issues From nodeJS NPM Module

Example:

var index = require('issues-alert')({
    "autoStart": true,
    "report": {
        "listenning": true,
        "email": {
            "status": true,
            "to": "",
            "cc": "",
            "bcc": "",
            "template": "__dirname + '/../template/mail.ejs'",
            "config": {
                "host": "",
                "port": 587,
                "secure": false,
                "auth": {
                    "user": "",
                    "pass": ""
                }
            },
            "_options": {}
        }
    }
});


index.on('error', function (data) {
    console.log(data);
});