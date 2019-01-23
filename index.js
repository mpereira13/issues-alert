var EventEmitter = require('events').EventEmitter;
var util = require('util');
var debug = require('debug')('issues-alert');
var debugError = require('debug')('issues-alert-error');
var config = require('./config.json');
var _config = { listenning: false };
var processError = require('./lib/processError');
var mail = require('./lib/mail');

function start() {
    if (!_config.listenning) {
        _config.listenning = true;
        debug('Change Config Listenning to true');
        process.once('uncaughtException', function (error) {
            processError(error, function (data, checkFile) {
                if (config.report.listenning) {
                    debug('Process Error Emit Evento Error');
                    _config.me.emit('error', data);
                }
                if (config.report.email.status) {
                    mail(
                        {
                            file: config.report.email.template,
                            to: config.report.email.to,
                            cc: config.report.email.cc,
                            bcc: config.report.email.bcc,
                            title: 'ISSUES-ALERT [' + error.message + ']',
                            error_title: error.message,
                            error: error.stack,
                            filename: checkFile,
                            code: data,
                            config: config.report.email.config
                        }
                    )
                }
            });
        });
    } else {
        debugError('Listener is already started');
    }
}

function issues(options) {
    _config.me = this;
    config = Object.assign(config, options);

    if (config.autoStart) {
        debug('Start Listenning Method [Auto]');
        start();
    } else {
        debug('Module need to start manual, check configs');
    }

    EventEmitter.call(this);
}

util.inherits(issues, EventEmitter);

/**
 *  Get Config from module
 */
issues.prototype.getConfig = function () {
    return config;
}

/**
 * Set Config from module
 */
issues.prototype.setConfig = function (options) {
    config = Object.assign(config, options);
}

/**
 *  Manual Start Module
 */
issues.prototype.start = function (options) {
    options = options || {};
    config = Object.assign(config, options);
    start();
}

/**
 * Stop Module Listenning 
 */
issues.prototype.stop = function () {
    _config.listenning = false;
    //process.removeListener('uncaughtException', () => { });
}

module.exports = function (options) {
    return new issues(options);
};