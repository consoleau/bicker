describe 'WatcherFactory', ->
  beforeEach -> window.angular.mock.module 'bicker_router'

  describe 'shouldNotify', ->
    it 'returns true if the data being watched has changed', inject (WatcherFactory) ->
      handler = ->
      watchPath = 'a'
      watcher = WatcherFactory.create watchPath, handler

      expect(watcher.shouldNotify('a', 'b')).toBe true

  describe 'notify', ->
    it 'notifies the handler of changes to data', inject (WatcherFactory) ->
      handler = jasmine.createSpy()
      watcher = WatcherFactory.create('a.b', handler)

      watcher.notify 'a.b', 'x'
      expect(handler).toHaveBeenCalledWith 'a.b', 'x', undefined

      watcher.notify 'a.b', 'n'
      expect(handler).toHaveBeenCalledWith 'a.b', 'n', 'x'
