/**
 * Created by Don on 2017/4/23.
 */

'use strict';
var _ = require('lodash'),
    fs = require('fs'),
    defaultAssets = require('./config/assets/default'),
    glob = require('glob'),
    gulp = require('gulp'),
    extend = require('extend'),
    config = require('./config/config'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    runSequence = require('run-sequence'),
    plugins = gulpLoadPlugins({
        rename: {
            'gulp-angular-templatecache': 'templateCache'
        }
    }),
    path = require('path'),
    endOfLine = require('os').EOL,
    protractor = require('gulp-protractor').protractor,
    webdriver_update = require('gulp-protractor').webdriver_update,
    webdriver_standalone = require('gulp-protractor').webdriver_standalone;

// Nodemon task
gulp.task('nodemon', function () {
    return plugins.nodemon({
        script: 'server.js',
        ext: 'js,html',
        watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
    }).on('config:update', function () {
        // Delay before server listens on port
        setTimeout(function () {
            if (config.secureServer) {
                require('open')('https://localhost');
            } else {
                require('open')('http://localhost');
            }
        }, 3000);
    });
});
// Nodemon debug task
gulp.task('nodemon-debug', function () {
    return plugins.nodemon({
        exec: 'node_modules/node-inspector/bin/inspector.js --save-live-edit --preload=false --web-port 1337 & node --debug',
        script: 'server.js',
        nodeArgs: ['--debug'],
        ext: 'js,html',
        verbose: true,
        watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
    });
});

// Watch Files For Changes
gulp.task('watch', function () {
    // Start livereload
    plugins.livereload.listen();

    // Add watch rules
    gulp.watch(defaultAssets.server.views).on('change', plugins.livereload.changed);
    gulp.watch(defaultAssets.server.allJS, ['eslint']).on('change', plugins.livereload.changed);
    gulp.watch(defaultAssets.client.js, ['eslint']).on('change', plugins.livereload.changed);
    gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.livereload.changed);
    gulp.watch(defaultAssets.client.sassWatch, ['sass', 'csslint']).on('change', plugins.livereload.changed);

    if (process.env.NODE_ENV === 'production') {
        // gulp.watch(defaultAssets.server.gulpConfig, ['templatecache', 'eslint']);
        gulp.watch(defaultAssets.client.views, ['templatecache']).on('change', plugins.livereload.changed);
    } else {
        gulp.watch(defaultAssets.server.gulpConfig, ['eslint']);
        gulp.watch(defaultAssets.client.views).on('change', plugins.livereload.changed);
    }
});

// CSS linting task
gulp.task('csslint', function (done) {
    return gulp.src(defaultAssets.client.css)
        .pipe(plugins.csslint('.csslintrc'))
    // .pipe(plugins.csslint.reporter())
    // .pipe(plugins.csslint.failReporter());
});

// ESLint JS linting task
gulp.task('eslint', function () {
    // var assets = _.union(
    //     defaultAssets.server.gulpConfig,
    //     defaultAssets.server.allJS,
    //     defaultAssets.client.js
    // );
    //
    // return gulp.src(assets)
    //     .pipe(plugins.eslint())
    //     .pipe(plugins.eslint.format());
});
var autoPrefixerOptions = {
    browsers: ['last 2 versions',  'ie 8']
};
// Sass task
gulp.task('sass', function () {
    return gulp.src(defaultAssets.client.sass)
        .pipe(plugins.sass())
        .pipe(plugins.rename(function (file) {
            file.dirname = file.dirname.replace(path.sep + 'scss', path.sep + 'css');
        }))
        .pipe(plugins.autoprefixer(autoPrefixerOptions))
        .pipe(gulp.dest('./modules/'));
});

// wiredep task to default
gulp.task('wiredep', function () {
    return gulp.src('config/assets/default.js')
        .pipe(plugins.wiredep({
            ignorePath: '../../'
        }))
        .pipe(gulp.dest('config/assets/'));
});

// Make sure upload directory exists
gulp.task('makeLogsDir', function () {
    return fs.mkdir('logs', function (err) {
        if (err && err.code !== 'EEXIST') {
            console.error(err);
        }
    });
});

// Angular template cache task
gulp.task('templatecache', function () {
    return gulp.src(defaultAssets.client.views)
        .pipe(plugins.templateCache('templates.js', {
            root: 'modules/',
            module: 'core',
            templateHeader: '(function () {' + endOfLine + '	\'use strict\';' + endOfLine + endOfLine + '	angular' + endOfLine + '		.module(\'<%= module %>\'<%= standalone %>)' + endOfLine + '		.run(templates);' + endOfLine + endOfLine + '	templates.$inject = [\'$templateCache\'];' + endOfLine + endOfLine + '	function templates($templateCache) {' + endOfLine,
            templateBody: '		$templateCache.put(\'<%= url %>\', \'<%= contents %>\');',
            templateFooter: '	}' + endOfLine + '})();' + endOfLine
        }))
        .pipe(gulp.dest('build'));
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver_standalone', webdriver_standalone);

// Protractor test runner task
gulp.task('protractor', ['webdriver_update'], function () {
    gulp.src([])
        .pipe(protractor({
            configFile: 'protractor.conf.js'
        }))
        .on('end', function () {
            console.log('E2E Testing complete');
            // exit with success.
            process.exit(0);
        })
        .on('error', function (err) {
            console.error('E2E Tests failed:');
            console.error(err);
            process.exit(1);
        });
});

gulp.task('connect', function(){
    plugins.connect.server({
        livereload: true
    });
});

// Lint CSS and JavaScript files.
gulp.task('lint', function () {
    runSequence('sass', ['csslint', 'eslint']);
});

// Run the project in development mode
gulp.task('default', function () {
    runSequence('makeLogsDir','lint', ['nodemon', 'watch', 'connect']);
});

// Run the project in debug mode
gulp.task('debug', function () {
    runSequence('makeLogsDir', 'lint', ['nodemon-debug', 'watch']);
});