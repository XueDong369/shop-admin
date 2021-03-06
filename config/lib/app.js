/**
 * Created by Don on 2017/4/23.
 */

/**
 * Module dependencies.
 */
var config = require('../config'),
    mongoose = require('./mongoose'),
    express = require('./express'),
    chalk = require('chalk');

/***
 * start cron jobs
 */
function startCronJobs() {
    require('./cronJobs').start();
}

// Initialize Models
mongoose.loadModels();


// Initialize Models
mongoose.loadModels();

module.exports.loadModels = function loadModels() {
    mongoose.loadModels();
};

module.exports.init = function init(callback) {
    mongoose.connect(function (db) {
        // Initialize express
        var app = express.init(db);
        startCronJobs();
        if (callback) callback(app, db, config);
    });
};

module.exports.start = function start(callback) {
    var _this = this;

    _this.init(function (app, db, config) {

        // Start the app by listening on <port>
        app.listen(config.port, function () {

            // Create server URL
            var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

            // Logging initialization
            console.log('--');
            console.log(chalk.green(config.app.title));
            console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
            console.log(chalk.green('server:\t\t\t\t' + server));
            console.log(chalk.green('Database:\t\t\t\t' + config.db.uri));
            if (process.env.NODE_ENV === 'secure') {
                console.log(chalk.green('HTTPs:\t\t\t\ton'));
            }
            console.log(chalk.green('App version:\t\t\t' + config.meanjs.version));
            if (config.meanjs['meanjs-version'])
                console.log(chalk.green('MEAN.JS version:\t\t\t' + config.meanjs['meanjs-version']));
            console.log('--');
            if (callback) callback(app, db, config);
        });

    });

};