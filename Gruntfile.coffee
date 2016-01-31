module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-karma'

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

  grunt.registerTask 'dist', ['clean', 'coffee:dist', 'concat:dist', 'uglify:dist']
  grunt.registerTask 'default', ['dist']
  grunt.registerTask 'test', ['karma']


