module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-express-server'
  grunt.loadNpmTasks 'grunt-contrib-copy'

  grunt.initConfig
    coffee:
      dist:
        files: [
          expand: true
          cwd: 'src'
          src: '**/*.coffee'
          dest: 'build'
          ext: '.js'
        ]
    concat:
      dist:
        # Bring in router.coffee first because it registers the angular module
        src: ['build/router.js', 'build/**/*.js']
        dest: 'dist/bicker.js'

    uglify:
      options:
        sourceMap: true

      dist:
        files:
          'dist/bicker.min.js': ['dist/bicker.js']

    karma:
      unit:
        configFile: 'test/karma/karma.conf.js'

    clean:
      dist: ['build', 'dist']
      example: ['example/lib']

    express:
      example:
        options:
          script: 'examples/server.js'

    copy:
      example:
        files: [
            src: 'bower_components/angular/angular.js'
            dest: 'examples/lib/angular.js'
          ,
            src: 'bower_components/angular-animate/angular-animate.js'
            dest: 'examples/lib/angular-animate.js'
          ,
            src: 'bower_components/lodash/lodash.js'
            dest: 'examples/lib/lodash.js'
          ,
            src: 'bower_components/jquery/dist/jquery.js'
            dest: 'examples/lib/jquery.js'
          ,
            src: 'dist/bicker.js'
            dest: 'examples/lib/bicker.js'
        ]

  grunt.registerTask 'dist', ['clean:dist', 'coffee:dist', 'concat:dist', 'uglify:dist']
  grunt.registerTask 'default', ['dist']
  grunt.registerTask 'test', ['karma']
  grunt.registerTask 'example', ['clean:example','copy:example','express:example']


