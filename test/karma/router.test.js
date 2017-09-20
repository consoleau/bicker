describe('Router', function() {
  beforeEach(function() {
    window.angular.mock.module('bicker_router');
  });

  it('should set ready even if there is no state', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrl('/a');
    });

    inject(function(Route, State, $location, $rootScope) {
      spyOn(Route, 'setReady');
      $location.path('/a');
      $rootScope.$broadcast('$locationChangeSuccess', 'fake_new_url');
      expect(Route.setReady).toHaveBeenCalledWith(true);
    });
  });

  it('should inject default data into the state service', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrl('/a/b/c', {state: {testA: 'hello'}})
        .and('/c/b/a', {state: {testB: 'hello'}});
    });

    inject(function(State, $location, $rootScope) {
      $location.path('/a/b/c');
      $rootScope.$broadcast('$locationChangeSuccess', 'fake_new_url');
      expect(State.get('testA'), 'testA').toBe('hello');
      expect(State.get('testB'), 'testB').toBeUndefined();
    });
  });

  it('should remove from state any data not defined in the newly-extracted data', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrl('/a/b/c', {state: {testA: 'hello', testB: 'hai'}})
      .and('/c/b/a', {state: {testB: 'hello'}});
    });

    inject(function(State, $location, $rootScope) {
      $location.path('/a/b/c');
      $rootScope.$broadcast('$locationChangeSuccess', 'fake_initial_url');
      expect(State.get('testA'), 'fake_initial_url testA').toEqual('hello');
      expect(State.get('testB'), 'fake_initial_url testB').toEqual('hai');

      spyOn(State, 'unset').and.callThrough();

      $location.path('/c/b/a');
      State.set('testC', 'testC');

      $rootScope.$broadcast('$locationChangeSuccess', 'fake_new_url');

      expect(State.get('testB'), 'fake_new_url testB').toBe('hello');
      expect(State.get('testA'), 'fake_new_url testA').toBeUndefined();
      expect(State.unset, 'fake_new_url State.unset').toHaveBeenCalledWith(['testA', 'testC']);
    });
  });


  it('should not remove persistent state even if not defined in extracted data', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrl('/a', {state: {aonly: 'a'}});
      RouteProvider.registerUrl('/b', {state: {bonly: 'b'}});
      RouteProvider.setPersistentStates('persi');
    });

    inject(function(State, $location, $rootScope) {
      spyOn(State, 'unset').and.callThrough();

      $location.path('/a');
      $rootScope.$broadcast('$locationChangeSuccess', 'fake_initial_url');

      expect(State.get('aonly'), 'fake_initial_url aonly').toBe('a');
      expect(State.get('bonly'), 'fake_initial_url bonly').toBeUndefined();
      expect(State.get('persi'), 'fake_initial_url persi').toBeUndefined();
      State.set('persi', 'penguin');

      $location.path('/b');
      $rootScope.$broadcast('$locationChangeSuccess', '/b');

      expect(State.get('aonly'), 'location /b aonly').toBeUndefined();
      expect(State.get('bonly'), 'location /b bonly').toBe('b');
      expect(State.get('persi'), 'location /b persi').toBe('penguin');
      expect(State.unset, 'location /b State.unset').toHaveBeenCalledWith(['aonly']);
    });
  });


  it('should retain flash state for one route change', function() {
    inject(function (State, $location, $rootScope, Route) {
      State.set('flashState1', 'flashValue');
      State.set('flashState2', 'flashValue2');
      Route.addFlashStates('flashState1', 'flashState2');

      $location.path('/a');
      $rootScope.$broadcast('$locationChangeSuccess', 'fake_initial_url');

      expect(State.get('flashState1'), 'fake_initial_url flashState1').toBe('flashValue');
      expect(State.get('flashState2'), 'fake_initial_url flashState2').toBe('flashValue2');

      $location.path('/b');
      $rootScope.$broadcast('$locationChangeSuccess', '/b');

      expect(State.get('flashState1'), 'location /b flashState1').toBeUndefined();
      expect(State.get('flashState2'), 'location /b flashState2').toBeUndefined();
    });
  });

  it('should set all data extracted from the URL into State', function() {
    inject(function (Route, State, $rootScope) {
      spyOn(Route, 'match').and.returnValue({});
      spyOn(Route, 'extractData').and.returnValue({a: 21, b: 'zzz'});
      spyOn(State, 'set');

      $rootScope.$broadcast('$locationChangeSuccess', 'fake_initial_url');

      expect(State.set,'state a').toHaveBeenCalledWith('a', 21);
      expect(State.set,'state b').toHaveBeenCalledWith('b', 'zzz');
    });
  });

  it('should reset the PendingViewCounter', function() {
    inject(function ($rootScope, PendingViewCounter) {
      spyOn(PendingViewCounter, 'reset');
      $rootScope.$broadcast('$locationChangeSuccess', 'fake_new_url');
      expect(PendingViewCounter.reset).toHaveBeenCalled();
    });
  });

  it('should emit the bicker_router.beforeStateChange event', function() {
    let url = '/a/b/c';

    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrl(url);
    });

    inject(function(State, $location, $rootScope) {
      spyOn($location, 'path').and.returnValue(url);
      let handler = jasmine.createSpy('beforeStateChangeHandler');

      $rootScope.$on('bicker_router.beforeStateChange', handler);
      $rootScope.$broadcast('$locationChangeSuccess', url);
      $rootScope.$digest();
      expect(handler).toHaveBeenCalled();
    });
  });

  it('should allow event handlers to modify the data to set/unset', function() {
    let url = '/a/b/c';

    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrl(url, {state: {nope: true}});
    });

    inject(function(State, $location, $rootScope) {
      let unsetting = ['a', 'b', 'c'];
      let setting = { d: 'e', f: 'g'};

      let handler = function(event, data) {
        data.unsetting = unsetting;
        data.setting = setting;
      };

      spyOn($location, 'path').and.returnValue(url);
      spyOn(State, 'unset');
      spyOn(State, 'set');

      $rootScope.$on('bicker_router.beforeStateChange', handler);
      $rootScope.$broadcast('$locationChangeSuccess', url);

      expect(State.unset, '$locationChangeSuccess State.unset').toHaveBeenCalledWith(unsetting);
      expect(State.set, 'State.set d,e').toHaveBeenCalledWith('d', 'e');
      expect(State.set, 'State.set f,g').toHaveBeenCalledWith('f', 'g');
    });
  });

  it('should emit the routeChangeSuccess event with bindings when the route changes', function() {
    inject(function ($rootScope) {
      let routeChangeSuccessCalled = false;
      $rootScope.$on('bicker_router.routeChangeSuccess', (event, data) => {
        routeChangeSuccessCalled = true;
        expect(Object.keys(data)).toContain('bindings');
      });
      $rootScope.$broadcast('$locationChangeSuccess', 'fake_new_url');
      expect(routeChangeSuccessCalled).toEqual(true);
    });
  });
});
