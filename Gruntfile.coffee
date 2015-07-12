'use strict'

module.exports = (grunt) ->

  require('load-grunt-tasks') grunt
  require('time-grunt') grunt

  grunt.initConfig

    coffee:
      router:
        src: [
          'scripts/router.coffee'
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
        dest: 'dist/router.js'

      #Only for use when Im convinced the router must be loaded in a certain order
      #@TODO Delete once convinced it is not necessary
      # file0:
      #   src: [ 'scripts/router.coffee' ]
      #   dest: 'dist/bicker/router.js'
      # file1:
      #   src: [ 'scripts/constants/objectHelper.coffee' ]
      #   dest: 'dist/bicker/constants/objectHelper.js'
      # file2:
      #   src: [ 'scripts/directives/routeHref.coffee' ]
      #   dest: 'dist/bicker/directives/routeHref.js'
      # file3:
      #   src: [ 'scripts/directives/view.coffee' ]
      #   dest: 'dist/bicker/directives/view.js'
      # file4:
      #   src: [ 'scripts/factories/pendingViewCounter.coffee' ]
      #   dest: 'dist/bicker/factories/pendingViewCounter.js'
      # file5:
      #   src: [ 'scripts/factories/templateRequest.coffee' ]
      #   dest: 'dist/bicker/factories/templateRequest.js'
      # file6:
      #   src: [ 'scripts/factories/watchableListFactory.coffee' ]
      #   dest: 'dist/bicker/factories/watchableListFactory.js'
      # file7:
      #   src: [ 'scripts/factories/watcherFactory.coffee' ]
      #   dest: 'dist/bicker/factories/watcherFactory.js'
      # file8:
      #   src: [ 'scripts/providers/route.coffee' ]
      #   dest: 'dist/bicker/providers/route.js'
      # file9:
      #   src: [ 'scripts/providers/state.coffee' ]
      #   dest: 'dist/bicker/providers/state.js'
      # file10:
      #   src: [ 'scripts/providers/viewBindings.coffee' ]
      #   dest: 'dist/bicker/providers/viewBindings.js'

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
