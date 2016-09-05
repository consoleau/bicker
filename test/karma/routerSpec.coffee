describe 'Router', ->

  beforeEach -> window.angular.mock.module 'bicker_router'

  it 'should set ready even if there is no state', ->
    window.angular.mock.module (RouteProvider) ->
      RouteProvider.registerUrl '/a'
      return
    inject (Route, State, $location, $rootScope) ->
      spyOn(Route, 'setReady')
      $location.path '/a'
      $rootScope.$broadcast '$locationChangeSuccess', 'fake_new_url'
      expect(Route.setReady).toHaveBeenCalledWith true

  it 'should inject default data into the state service', ->
    window.angular.mock.module (RouteProvider) ->
      RouteProvider.registerUrl '/a/b/c', state: testA: 'hello'
        .and '/c/b/a', state: testB: 'hello'
      return
    inject (State, $location, $rootScope) ->
      $location.path '/a/b/c'
      $rootScope.$broadcast '$locationChangeSuccess', 'fake_new_url'
      expect(State.get 'testA').toBe 'hello'
      expect(State.get 'testB').toBeUndefined()

  it 'should remove from state any data not defined in the newly-extracted data', ->
    window.angular.mock.module (RouteProvider) ->
      RouteProvider.registerUrl '/a/b/c', state: testA: 'hello', testB: 'hai'
      .and '/c/b/a', state: testB: 'hello'
      return
    inject (State, $location, $rootScope) ->
      $location.path '/a/b/c'
      $rootScope.$broadcast '$locationChangeSuccess', 'fake_initial_url'
      expect(State.get 'testA').toEqual 'hello'
      expect(State.get 'testB').toEqual 'hai'

      spyOn(State, 'unset').and.callThrough()

      $location.path '/c/b/a'
      State.set 'testC', 'testC'

      $rootScope.$broadcast '$locationChangeSuccess', 'fake_new_url'

      expect(State.get 'testB').toBe 'hello'
      expect(State.get 'testA').toBeUndefined()
      expect(State.unset).toHaveBeenCalledWith ['testA', 'testC']


  it 'should not remove persistent state even if not defined in extracted data', ->
    window.angular.mock.module (RouteProvider) ->
      RouteProvider.registerUrl '/a', state: aonly: 'a'
      RouteProvider.registerUrl '/b', state: bonly: 'b'
      RouteProvider.setPersistentStates 'persi'
      return

    inject (State, $location, $rootScope) ->
      spyOn(State, 'unset').and.callThrough()

      $location.path '/a'
      $rootScope.$broadcast '$locationChangeSuccess', 'fake_initial_url'

      expect(State.get('aonly')).toBe 'a'
      expect(State.get('bonly')).toBeUndefined()
      expect(State.get('persi')).toBeUndefined()
      State.set 'persi', 'penguin'

      $location.path '/b'
      $rootScope.$broadcast '$locationChangeSuccess', '/b'

      expect(State.get('aonly')).toBeUndefined()
      expect(State.get('bonly')).toBe 'b'
      expect(State.get('persi')).toBe 'penguin'
      expect(State.unset).toHaveBeenCalledWith ['aonly']


  it 'should retain flash state for one route change', ->
    inject (State, $location, $rootScope, Route) ->

      State.set('flashState1', 'flashValue')
      State.set('flashState2', 'flashValue2')
      Route.addFlashStates('flashState1', 'flashState2')

      $location.path '/a'
      $rootScope.$broadcast '$locationChangeSuccess', 'fake_initial_url'

      expect(State.get('flashState1')).toBe 'flashValue'
      expect(State.get('flashState2')).toBe 'flashValue2'

      $location.path '/b'
      $rootScope.$broadcast '$locationChangeSuccess', '/b'

      expect(State.get('flashState1')).toBeUndefined()
      expect(State.get('flashState2')).toBeUndefined()


  it 'should set all data extracted from the URL into State', ->
    inject (Route, State, $rootScope) ->
      spyOn(Route, 'match').and.returnValue {}
      spyOn(Route, 'extractData').and.returnValue { a: 21, b: 'zzz' }
      spyOn State, 'set'

      $rootScope.$broadcast '$locationChangeSuccess', 'fake_initial_url'

      expect(State.set).toHaveBeenCalledWith 'a', 21
      expect(State.set).toHaveBeenCalledWith 'b', 'zzz'

  it 'should reset the PendingViewCounter', ->
    inject ($rootScope, PendingViewCounter) ->
      spyOn PendingViewCounter, 'reset'
      $rootScope.$broadcast '$locationChangeSuccess', 'fake_new_url'
      expect(PendingViewCounter.reset).toHaveBeenCalled()

  it 'should emit the bicker_router.beforeStateChange event', ->
    url = '/a/b/c'

    window.angular.mock.module (RouteProvider) ->
      RouteProvider.registerUrl url
      return

    inject (State, $location, $rootScope) ->
      spyOn($location, 'path').and.returnValue url
      handler = jasmine.createSpy 'beforeStateChangeHandler'

      $rootScope.$on 'bicker_router.beforeStateChange', handler
      $rootScope.$broadcast '$locationChangeSuccess', url
      $rootScope.$digest()
      expect(handler).toHaveBeenCalled()

  it 'should allow event handlers to modify the data to set/unset', ->
    url = '/a/b/c'

    window.angular.mock.module (RouteProvider) ->
      RouteProvider.registerUrl url, state: nope: true
      return

    inject (State, $location, $rootScope) ->
      unsetting = ['a', 'b', 'c']
      setting = { d: 'e', f: 'g'}

      handler = (event, data) ->
        data.unsetting = unsetting
        data.setting = setting

      spyOn($location, 'path').and.returnValue url
      spyOn(State, 'unset')
      spyOn(State, 'set')

      $rootScope.$on 'bicker_router.beforeStateChange', handler
      $rootScope.$broadcast '$locationChangeSuccess', url

      expect(State.unset).toHaveBeenCalledWith unsetting
      expect(State.set).toHaveBeenCalledWith 'd', 'e'
      expect(State.set).toHaveBeenCalledWith 'f', 'g'
