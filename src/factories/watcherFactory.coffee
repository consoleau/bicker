angular.module('bicker_router').factory 'WatcherFactory', ->
  class Watcher
    constructor: (@watchPath, @handler, initialValue = undefined) ->
      @currentValue = _.cloneDeep initialValue

    shouldNotify: (changedPath, watchedValue) ->
      not angular.equals(@currentValue, watchedValue)

    notify: (changedPath, newValue) ->
      @handler changedPath, newValue, @currentValue
      @currentValue = _.cloneDeep newValue

  factory =
    create: (watchPath, handler, initialValue = undefined) ->
      new Watcher(watchPath, handler, initialValue)
