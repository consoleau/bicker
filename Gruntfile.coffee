'use strict'

module.exports = (grunt) ->

  require('load-grunt-tasks') grunt
  require('time-grunt') grunt

  grunt.initConfig

    coffee:
      router1:
        src: [ 'scripts/router.coffee' ]
        dest: 'dist/router1.js'

      router2:
        src: [
          'scripts/constants/objectHelper.coffee'
          'scripts/directives/routeHref.coffee'
          'scripts/directives/view.coffee'
          'scripts/factories/pendingViewCounter.coffee'
          'scripts/factories/templateRequest.coffee'
          'scripts/factories/watchableListFactory.coffee'
          'scripts/factories/watcherFactory.coffee'
          'scripts/providers/route.coffee'
          'scripts/providers/state.coffee'
          'scripts/providers/viewBindings.coffee'
        ]
        dest: 'dist/router2.js'

      example:
        src: [ 'examples/simple/**/*.coffee']
        dest: 'dist/example.js'

    express:
      options:
        port: 9000
        script: 'examples/server.coffee'
        opts: ['node_modules/coffee-script/bin/coffee']
        args: [ 'simple' ]
      default: {}

    watch:
      coffee:
        files: ['**/*.coffee']
        tasks: ['newer:coffee']

  grunt.registerTask 'build', (target) ->
    console.log 'build not implemented'

  grunt.registerTask 'example', (target) ->
    grunt.task.run [
      'coffee'
      'express:default'
      'watch'
    ]
