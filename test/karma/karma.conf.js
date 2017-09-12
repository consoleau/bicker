// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-ng-scenario',
      'karma-spec-reporter',
      'karma-browserify'
    ],

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['browserify', 'jasmine'],

    preprocessors: {
      '../../src/**/*.js': ['browserify']
    },

    // list of files / patterns to load in the browser
    files: [
      '../../bower_components/jquery/dist/jquery.min.js',
      '../../bower_components/angular/angular.min.js',
      '../../bower_components/angular-animate/angular-animate.min.js',
      '../../bower_components/angular-mocks/angular-mocks.js',
      '../../bower_components/lodash/lodash.js',
      '../../src/router.js',
      '../../src/constants/*.js',
      '../../src/factories/*.js',
      '../../src/providers/*.js',
      '../../src/directives/*.js',
      '../../test/karma/**/*.js'
    ],

    browserify: {
      paths: ['../../src'],
      debug: true,
      transform: [["babelify", {"presets": ["es2015"]}]]
    },

    // list of files / patterns to exclude
    // exclude: ['app/.tmp/spec/cukes/**','app/.tmp/spec/e2e/**', 'app/.tmp/spec/pages/**'],

    // web server port
    port: 12345,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    browsers: ['Chrome'],

    // reporters: ['spec'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    // when CI gets slow the default of 10s between
    // karma start and karma run is not enough
    browserNoActivityTimeout: 30000

  });
};
