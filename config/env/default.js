'use strict';
var winston = require('winston'),
    path = require('path');

module.exports = {
    app: {
        version: '1.0.0',
        name: process.env.APP_NAME || 'shopAdmin',
        title: process.env.APP_TITLE || 'shopAdmin',
        description: process.env.APP_DESCRIPTION || 'shopAdmin',
        keywords: process.env.APP_KEYWORDS || 'shopAdmin',
        googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID
    },
    copyright: process.env.APP_TITLE || 'CommonService', // copyright for email templates
    fileSaveLocation: process.env.FILE_SAVE_LOCATION || 'local', //local,both,cloud
    azureContainer: process.env.AZURE_CONTAINER || 'educationaxis',
    fileOptions: {
        maxFieldsSize: 10 * 1024 * 1024 // 10MB,
    },
    port: process.env.PORT || 80,
    host: process.env.HOST || '0.0.0.0',
    db: {
        uri: process.env.DB_CONFIG_URI || 'mongodb://user:123gogogo@120.27.52.242:27758/common_service-dev',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    templateEngine: 'swig',
    // Session Cookie settings
    sessionCookie: {
        // session expiration is set by default to 24 hours
        maxAge: 24 * (60 * 60 * 1000),
        // httpOnly flag makes sure the cookie is only accessed
        // through the HTTP protocol and not JS/browser
        httpOnly: true,
        // secure cookie should be turned to true to provide additional
        // layer of security so that the cookie is set only when working
        // in HTTPS mode.
        secure: false
    },
    // sessionSecret should be changed for security measures and concerns
    sessionSecret: process.env.SESSION_SECRET || 'MEAN',
    // sessionKey is set to the generic sessionId key used by PHP applications
    // for obsecurity reasons
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    logger: {
        transports: [
            new winston.transports.Console({
                colorize: true
            })
        ]
    },
    logo: './public/img/logo.png',
    favicon: './public/img/favicon.ico',
    uploads: {
        profileUpload: {
            dest: './modules/users/server/img/profile/uploads/', // Profile upload destination path
            limits: {
                fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
            }
        }
    },
    mailGun: {
        api_key: process.env.MAILGUN_API_KEY || 'key-697beead3ec803b1343a384017cba797',
        domain: process.env.MAIL_DOMAIN || 'erealmsoft.com',
        fromWho: process.env.MAIL_FROM_WHO || 'support <support@erealmsoft.com>'
    },
    token: {
        userTokenLife: 5 * 60 * 1000, // 5 Minutes  5 * 60 * 1000
        userRefreshTokenShortLife: 24 * 60 * 60 * 1000, // 24 hours 24*60*60*1000
        userRefreshTokenLongLife: 10 * 24 * 60 * 60 * 1000 // ten days 10*24*60*60*1000
    },
    livereload: true
};
