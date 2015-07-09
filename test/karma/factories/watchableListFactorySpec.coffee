describe 'WatchableListFactory', ->
  beforeEach -> window.angular.mock.module 'bicker_router'

  it 'notifies watchers of changes to data', inject (WatchableListFactory) ->
    watchableList = WatchableListFactory.create()
    watcher = jasmine.createSpy()

    watchableList.watch ['a.b', 'c.d'], watcher
    watchableList.set 'a.b', 'x'
    watchableList.set 'c.d', 'y'

    expect(watcher).toHaveBeenCalledWith 'a.b', 'x', undefined
    expect(watcher).toHaveBeenCalledWith 'c.d', 'y', undefined

  it 'notifies watchers when a value is unset', inject (WatchableListFactory) ->
    watchableList = WatchableListFactory.create()
    watcher = jasmine.createSpy()

    watchableList.watch 'a.b', watcher
    watchableList.set 'a.b', 'x'
    watchableList.unset 'a.b'

    expect(watcher).toHaveBeenCalledWith 'a.b', 'x', undefined
    expect(watcher).toHaveBeenCalledWith 'a.b', undefined, 'x'

  it 'notifies watchers when an array of values are unset', inject (WatchableListFactory) ->
    watchableList = WatchableListFactory.create()
    watcher = jasmine.createSpy()

    watchableList.set 'a.b.c', 'x'
    watchableList.set 'd.e.f', 'z'
    watchableList.watch ['a.b.c', 'd.e.f'], watcher
    watchableList.unset ['a.b.c', 'd.e.f']

    expect(watcher).toHaveBeenCalledWith 'a.b.c', undefined, 'x'
    expect(watcher).toHaveBeenCalledWith 'd.e.f', undefined, 'z'


  it 'notifies watchers when descendant values change', inject (WatchableListFactory) ->
    watchableList = WatchableListFactory.create()
    watcher = jasmine.createSpy()

    watchableList.watch 'a', watcher
    watchableList.set 'a.b', 'z'
    watchableList.set 'a.b', 'n'

    lastCall = watcher.calls.mostRecent()
    expect(lastCall.args[0]).toBe 'a.b'
    expect(lastCall.args[1]).toEqual jasmine.objectContaining({b: 'n'})
    expect(lastCall.args[2]).toEqual jasmine.objectContaining({b: 'z'})

  it 'does not notify watchers that have been removed', inject (WatchableListFactory) ->
    watchableList = WatchableListFactory.create()
    watcher = jasmine.createSpy()

    watchableList.watch 'a', watcher
    watchableList.set 'a', 'b'

    watchableList.removeWatcher watcher

    watchableList.set 'a', 'c'
    expect(watcher.calls.count()).toBe 1

  describe 'getAll', ->
    it 'returns all data', inject (WatchableListFactory) ->
      watchableList = WatchableListFactory.create()
      watchableList.set 'a.b', 'z'

      expect(watchableList.getAll()).toEqual jasmine.objectContaining({a: b: 'z'})

  describe 'getSubset', ->
    it 'returns an object with all the requested values', inject (WatchableListFactory) ->
      watchableList = WatchableListFactory.create()

      watchableList.set 'a.b.c', 'd'
      watchableList.set 'e', 'f'
      watchableList.set 'g', 'h'

      expect(watchableList.getSubset ['a', 'g']).toEqual g: 'h', a: b: c: 'd'
