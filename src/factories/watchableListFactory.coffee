angular.module('bicker_router').factory 'WatchableListFactory', (ObjectHelper, WatcherFactory) ->
  class WatchableList
    constructor: (@list) ->
      @watchers = []

    get: (path) ->
      ObjectHelper.get @list, path

    getAll: -> @list

    getSubset: (paths) ->
      _.zipObject(paths, _.map(paths, @get.bind(@)))

    set: (path, value) ->
      ObjectHelper.set @list, path, value
      @_notifyWatchers path, value

    unset: (paths) ->
      paths = [paths] if not (paths instanceof Array)

      for path in paths
        ObjectHelper.unset @list, path
        @_notifyWatchers path, undefined

    watch: (paths, handler) ->
      paths = [paths] if not (paths instanceof Array)

      for path in paths
        @watchers.push(WatcherFactory.create(path, handler, @get(path)))

    removeWatcher: (watcher) ->
      return if @watchers.length is 0
      newWatchers = []

      for index in [0..@watchers.length-1]
        if @watchers[index].handler isnt watcher
          newWatchers.push @watchers[index]

      @watchers = newWatchers

    _notifyWatchers: (changedPath) ->

      for watcher in @watchers
        watchedValue = ObjectHelper.get @list, watcher.watchPath

        if watcher.shouldNotify changedPath, watchedValue
          watcher.notify changedPath, watchedValue

  factory =
    create: (data = {}) -> new WatchableList(data)
