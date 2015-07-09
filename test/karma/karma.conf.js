// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({

    plugins: [
      'karma-coffee-preprocessor',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-ng-scenario'
    ],

    preprocessors: {
      '../../scripts/**/*.coffee': ['coffee'],
      '**/*.coffee': ['coffee']
    },

    coffeePreprocessor: {
      // options passed to the coffee compiler
      options: {
        bare: true,
        sourceMap: false
      },
      // transforming the filenames
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js');
      }
    },

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '../../bower_components/jquery/dist/jquery.min.js',
      '../../bower_components/angular/angular.min.js',
      '../../bower_components/angular-mocks/angular-mocks.js',
      '../../bower_components/lodash/lodash.min.js',
      '../../scripts/router.coffee',
      '../../scripts/**/*.coffee',
      '**/*.coffee'
    ],

    // list of files / patterns to exclude
    // exclude: ['app/.tmp/spec/cukes/**','app/.tmp/spec/e2e/**', 'app/.tmp/spec/pages/**'],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    // when CI gets slow the default of 10s between
    // karma start and karma run is not enough
    browserNoActivityTimeout: 30000

  });
};
