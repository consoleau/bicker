describe('routeHref directive', function() {
  beforeEach(function() {
    window.angular.mock.module('bicker_router');
  });

  it('should populate the href attribute of the element with the URL returned from the matching URL writer', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.setPersistentStates('page');
      RouteProvider.registerUrlWriter('pagination', function(UrlData, State) {
        let page = State.get('page');
        return `/page/${page}`;
      });
    });

    inject(function($rootScope, $location, Route, $compile, State) {
      State.set('page', 2);
      let element = $compile('<a route-href="paginationUrlWriter()">Link</a>')($rootScope.$new());
      $rootScope.$digest();

      expect(element.attr('href'), 'before: href value').toBe('#/page/2');

      State.set('page', 3);
      $rootScope.$digest();
      expect(element.attr('href'), 'after: href value').toBe('#/page/3');
    });
  });

  it('should omit the # prefix when in html 5 mode', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.setPersistentStates('page');
      RouteProvider.setHtml5Mode(true);
      RouteProvider.registerUrlWriter('pagination', function(UrlData, State) {
        let page = State.get('page');
        return `/page/${page}`;
      });
    });

    inject(function($rootScope, $location, Route, $compile, State) {
      State.set('page', 2);
      let element = $compile('<a route-href="paginationUrlWriter()">Link</a>')($rootScope.$new());
      $rootScope.$digest();

      expect(element.attr('href')).toBe('/page/2');
    });
  });

  it('should prevent the default action by default and navigate using $location so as to use pushstate', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrlWriter('pagination', function(UrlData, State) {
        RouteProvider.setPersistentStates('page');
        let page = State.get('page');
        return `/page/${page}`;
      });
    });

    inject(function($rootScope, $compile, $location, State, $timeout) {
      State.set('page', 2);
      let scope = $rootScope.$new();
      let element = $compile('<a route-href="paginationUrlWriter()">Link</a>')(scope);
      $rootScope.$digest();
      expect(element.attr('href'), 'href value').toBe('#/page/2');

      spyOn($location, 'url');

      let event = undefined;

      element.click(e => event = e);
      element.click();

      $timeout.flush();

      expect($location.url, '$location.url should be called').toHaveBeenCalled();
      expect(event.isDefaultPrevented(), 'should prevent event default').toBe(true);
    });
  });

  it('should ignore the route href when the ignore-href attribute is added to the anchor element', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrlWriter('path', () => 'test');
      RouteProvider.setHtml5Mode(true);
    });

    inject(function($rootScope, $compile, $location, $timeout) {
      let element = $compile('<a route-href="pathUrlWriter()" ignore-href>Link</a>')($rootScope.$new());
      $rootScope.$digest();

      spyOn($location, 'url');

      let event = undefined;

      element.click(e => event = e);
      element.click();

      $timeout.verifyNoPendingTasks();

      expect($location.url, '$location.url should not be called').not.toHaveBeenCalled();
      expect(event.isDefaultPrevented(), 'should not prevent event default').toBe(false);
    });
  });

  it('should open the url in a new window for CTRL+click', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrlWriter('path', () => '/contacts/update/1');
      RouteProvider.setHtml5Mode(false);
    });

    inject(function($rootScope, $compile, $window, $location) {
      let element = $compile('<a route-href="pathUrlWriter()">Link</a>')($rootScope.$new());
      $rootScope.$digest();

      $window.location.origin = 'http://localhost';
      spyOn($window, 'open');
      spyOn($location, 'url');

      let event = jasmine.createSpyObj('clickEvent', {
        'open': _.noop(),
        'preventDefault': _.noop()
      });
      event.type = 'click';
      event.metaKey = true;

      element.triggerHandler(event);
      $rootScope.$digest();

      const expectedNewWindowUrl = $window.location.origin + '/#/contacts/update/1';
      expect($window.open, '$window.open should be called with correct params').toHaveBeenCalledWith(expectedNewWindowUrl, '_blank');
      expect($location.url, '$location.url should not be called').not.toHaveBeenCalled();
      expect(event.preventDefault, 'should prevent event default').toHaveBeenCalled();
    });
  })
});
