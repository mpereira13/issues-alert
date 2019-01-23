const nodemailer = require('nodemailer');
const h2p = require('html2plaintext');
const ejs = require('ejs');
const fs = require('fs');
const debug = require('debug')('issues-alert');
const debugError = require('debug')('issues-alert-error');

async function main(options) {
    let transporter = nodemailer.createTransport(options.config);
    try {
        debug('loading Config.Report.email.template');
        file = eval(options.file);
        var html = ejs.render(fs.readFileSync(file, 'utf-8'), options);

        let mailOptions = {
            from: options.config.auth.user,
            to: options.to,
            cc: options.cc,
            bcc: options.bcc,
            subject: options.title,
            text: h2p(html),
            html: html
        };

        let info = await transporter.sendMail(mailOptions)

        debug("Message sent: " + info.messageId);
        options.emit.emit('send', info);
    } catch (ex) {
        debugError(`Error Loading Config.Report.email.template [ err: ${JSON.stringify(ex.stack)}]`);
    }
}


module.exports = main;