describe('routeOnClick directive', function() {
  beforeEach(function() {
    window.angular.mock.module('bicker_router');
  });

  describe('click eventTriggers', function() {
    const LEFT_BUTTON = 0;
    const MIDDLE_BUTTON = 1;

    const newWindowClickTestRuns = [
      { eventTriggers: { type: 'click',   button: LEFT_BUTTON,   metaKey: false, ctrlKey: false }, newWindowExpected: false, desc: 'left click' },
      { eventTriggers: { type: 'click',   button: LEFT_BUTTON,   metaKey: true,  ctrlKey: false }, newWindowExpected: true,  desc: 'left click + CTRL (Mac)' },
      { eventTriggers: { type: 'click',   button: LEFT_BUTTON,   metaKey: false, ctrlKey: true  }, newWindowExpected: true,  desc: 'left click + CTRL (Windows)' },
      { eventTriggers: { type: 'mouseup', button: MIDDLE_BUTTON, metaKey: false, ctrlKey: false }, newWindowExpected: true,  desc: 'middle mouse click'  },
      { eventTriggers: { type: 'mouseup', button: MIDDLE_BUTTON, metaKey: true,  ctrlKey: false }, newWindowExpected: true,  desc: 'middle mouse click + CTRL (Mac)' },
      { eventTriggers: { type: 'mouseup', button: MIDDLE_BUTTON, metaKey: false, ctrlKey: true  }, newWindowExpected: true,  desc: 'middle mouse click + CTRL (Windows)' }
    ];

    _(newWindowClickTestRuns).each(function(testRun) {
      it(`${testRun.newWindowExpected ? 'should' : 'should not'} open the target url in a new window for ${testRun.desc}`, function() {
        assertNewWindow(testRun.eventTriggers, testRun.newWindowExpected);
      });
    });
  });

  describe('when element is an Anchor tag', function() {
    it('should populate the href attribute of the element with the URL returned from the matching URL writer', function () {
      window.angular.mock.module(function (RouteProvider) {
        RouteProvider.registerUrlWriter('routeLink', () => '/contacts/update/1');
        RouteProvider.setHtml5Mode(false);
      });

      inject(function ($rootScope, $compile) {
        let element = $compile('<a route-on-click="routeLinkUrlWriter()">Link</a>')($rootScope.$new());
        $rootScope.$digest();
        expect(element.attr('href')).toBe('#/contacts/update/1');
      });
    });

    it('should update the href attribute when the expression eval changes', function() {
      window.angular.mock.module(function(RouteProvider) {
        RouteProvider.setPersistentStates('page');
        RouteProvider.setHtml5Mode(false);
        RouteProvider.registerUrlWriter('pagination', function(UrlData, State) {
          let page = State.get('page');
          return `/page/${page}`;
        });
      });

      inject(function($rootScope, $location, Route, $compile, State) {
        State.set('page', 2);
        let element = $compile('<a route-on-click="paginationUrlWriter()">Link</a>')($rootScope.$new());
        $rootScope.$digest();
        expect(element.attr('href'), 'href before eval update').toBe('#/page/2');

        State.set('page', 3);
        $rootScope.$digest();
        expect(element.attr('href'), 'href after eval update').toBe('#/page/3');
      });
    });
  });

  describe('html5Mode', function() {
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
        let element = $compile('<a route-on-click="paginationUrlWriter()">Link</a>')($rootScope.$new());
        $rootScope.$digest();

        expect(element.attr('href')).toBe('/page/2');
      });
    });
  });
});

const assertNewWindow = function(eventTriggers, newWindowExpected) {
  window.angular.mock.module(function (RouteProvider) {
    RouteProvider.registerUrlWriter('routeLink', () => '/contacts/update/1');
    RouteProvider.setHtml5Mode(false);
  });

  inject(function($rootScope, $compile, $window, $location, $timeout) {
    let element = $compile('<div route-on-click="routeLinkUrlWriter()">Link</div>')($rootScope.$new());
    $rootScope.$digest();

    $window.location.origin = 'http://localhost';
    spyOn($window, 'open');
    spyOn($location, 'url');

    element.triggerHandler(eventTriggers);
    $rootScope.$digest();

    if (newWindowExpected) {
      const expectedNewWindowUrl = $window.location.origin + '/#/contacts/update/1';
      expect($window.open, '$window.open should be called with correct params').toHaveBeenCalledWith(expectedNewWindowUrl, '_blank');
      expect($location.url, '$location.url should not be called').not.toHaveBeenCalled();
    } else {
      const expectedSameWindowUrlPath = '/contacts/update/1';
      $timeout.flush();
      expect($window.open, '$window.open should not be called').not.toHaveBeenCalled();
      expect($location.url, '$location.url should be called').toHaveBeenCalledWith(expectedSameWindowUrlPath);
    }
  });
};
