describe('routeClick directive', function() {
  beforeEach(function() {
    window.angular.mock.module('bicker_router');
  });

  it('should populate the href attribute of the element with the URL returned from the matching URL writer', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.setPersistentStates('page');
      RouteProvider.setHtml5Mode(false);
      RouteProvider.registerUrlWriter('routeLink', function(UrlData, State) {
        let page = State.get('page');
        return `/page/${page}`;
      });
    });

    inject(function($rootScope, $location, Route, $compile, State) {
      State.set('page', 2);
      let element = $compile('<div route-click="routeLinkUrlWriter()">content</div>')($rootScope.$new());
      $rootScope.$digest();
      expect(element.attr('href'), 'before: href value').toBe('#/page/2');
    });
  });

  it('should omit the # prefix when in html 5 mode', function() {
    window.angular.mock.module(function(RouteProvider) {
      RouteProvider.setPersistentStates('page');
      RouteProvider.setHtml5Mode(true);
      RouteProvider.registerUrlWriter('routeLink', function(UrlData, State) {
        let page = State.get('page');
        return `/page/${page}`;
      });
    });

    inject(function($rootScope, $location, Route, $compile, State) {
      State.set('page', 2);
      let element = $compile('<div route-click="routeLinkUrlWriter()">content</div>')($rootScope.$new());
      $rootScope.$digest();
      expect(element.attr('href')).toBe('/page/2');
    });
  });

  const newWindowClickTestRuns = [
    { eventTriggers: { which: 1, metaKey: false, ctrlKey: false }, newWindowExpected: false, desc: 'left click only' },
    { eventTriggers: { which: 1, metaKey: true,  ctrlKey: false }, newWindowExpected: true,  desc: 'left click + CTRL (Mac)' },
    { eventTriggers: { which: 1, metaKey: false, ctrlKey: true  }, newWindowExpected: true,  desc: 'left click + CTRL (Windows)' },
    { eventTriggers: { which: 2, metaKey: false, ctrlKey: false }, newWindowExpected: true,  desc: 'middle mouse click only'  },
    { eventTriggers: { which: 2, metaKey: true,  ctrlKey: false }, newWindowExpected: true,  desc: 'middle mouse click + CTRL (Mac)' },
    { eventTriggers: { which: 2, metaKey: false, ctrlKey: true  }, newWindowExpected: true,  desc: 'middle mouse click + CTRL (Windows)' }
  ];

  _(newWindowClickTestRuns).each(function(testRun) {
    it(`${testRun.newWindowExpected ? 'should' : 'should not'} open the target url in a new window for ${testRun.desc}`, function() {
      assertNewWindow(testRun.eventTriggers, testRun.newWindowExpected);
    });
  });
});

const assertNewWindow = function(eventTriggers, newWindowExpected) {
  window.angular.mock.module(function(RouteProvider) {
    RouteProvider.registerUrlWriter('routeLink', () => '/contacts/update/1');
    RouteProvider.setHtml5Mode(false);
  });

  inject(function($rootScope, $compile, $window, $location, $timeout) {
    let element = $compile('<div route-click="routeLinkUrlWriter()">Link</div>')($rootScope.$new());
    $rootScope.$digest();

    $window.location.origin = 'http://localhost';
    spyOn($window, 'open');
    spyOn($location, 'url');

    let event = jasmine.createSpyObj('mouseupEvent', {
      'open': _.noop(),
      'preventDefault': _.noop(),
    });
    event.type = 'mouseup';
    _.assign(event, eventTriggers);

    element.triggerHandler(event);
    $rootScope.$digest();

    expect(event.preventDefault, 'should prevent event default').toHaveBeenCalled();

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
