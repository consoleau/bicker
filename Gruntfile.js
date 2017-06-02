'use strict';

const grunt = require('grunt');

grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-eslint');
grunt.loadNpmTasks('grunt-express-server');
grunt.loadNpmTasks('grunt-karma');
grunt.loadNpmTasks('grunt-ng-annotate');

grunt.initConfig({
  concat: {
    dist: {
      src: ['src/router.js', 'src/**/*.js'],
      dest: 'dist/bicker.js'
    }
  },

  uglify: {
    options: {
      sourceMap: true
    },

    dist: {
      files: {
        'dist/bicker.min.js': ['dist/bicker.js']
      }
    }
  },

  eslint: {
    options: {

    },
    target: ['.']
  },

  karma: {
    unit: {
      configFile: 'test/karma/karma.conf.js'
    }
  },

  clean: {
    dist: ['build', 'dist'],
    example: ['example/lib']
  },

  express: {
    example: {
      options: {
        script: 'examples/server.js'
      }
    }
  },

  browserify: {
    options: {
      browserifyOptions: {
        debug: true //debug:true adds a sourcemap to bottom of generated file
      },
      transform: [
        ["babelify", {"presets": ["es2015"]}]
      ]
    },

    dist: {
      files: {
        'dist/bicker.js': ['dist/bicker.js']
      }
    }
  },

  copy: {
    example: {
      files: [{
        src: 'bower_components/angular/angular.js',
        dest: 'examples/lib/angular.js'
      }, {
        src: 'bower_components/angular-animate/angular-animate.js',
        dest: 'examples/lib/angular-animate.js'
      }, {
        src: 'bower_components/lodash/lodash.js',
        dest: 'examples/lib/lodash.js'
      }, {
        src: 'bower_components/jquery/dist/jquery.js',
        dest: 'examples/lib/jquery.js'
      }, {
        src: 'dist/bicker.js',
        dest: 'examples/lib/bicker.js'
      }]
    }
  },

  watch: {
    concat: {
      files: ['src/**/*.js'],
      tasks: ['concat:dist']
    },
    transform: {
      files: ['dist/bicker.js'],
      tasks: ['browserify:dist', 'uglify:dist']
    }
  }
});

grunt.registerTask('dist', ['clean:dist', 'concat:dist', 'browserify:dist', 'uglify:dist']);
grunt.registerTask('default', ['dist']);
grunt.registerTask('test', ['karma']);
