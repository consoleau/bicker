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

  it('should not prevent the default action by default if html5mode is false', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrlWriter('pagination', function(UrlData, State) {
        RouteProvider.setPersistentStates('page');
        RouteProvider.setHtml5Mode(false);
        let page = State.get('page');
        return `/page/${page}`;
      });
    });

    inject(function($rootScope, $compile, State, $timeout) {
      State.set('page', 2);
      let scope = $rootScope.$new();
      let element = $compile('<a route-href="paginationUrlWriter()">Link</a>')(scope);
      $rootScope.$digest();
      expect(element.attr('href'), 'href value').toBe('#/page/2');

      let event = undefined;

      element.click(e => event = e);
      element.click();

      $timeout.verifyNoPendingTasks();

      expect(event.isDefaultPrevented(), 'should not prevent event default').toBe(false);
    });
  });

  it('should ignore the route href when the ignore-href attribute is added to the anchor element', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.registerUrlWriter('path', () => 'test');
      RouteProvider.setHtml5Mode(false);
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
});
