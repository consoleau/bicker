describe('PendingViewCounter', function() {

  beforeEach(function() {
    window.angular.mock.module('bicker_router');

    // Trigger the PendingViewCounter.reset() call that happens when the $locationChangeSuccess event
    // fires after the module boots, otherwise this breaks the tests
    inject(function($rootScope) {
      $rootScope.$digest();
    });
  });

  it('should fire the bicker_router.initialViewsLoaded event when the count first decreases to 0 and the ' +
      'bicker_router.initialViewsLoaded event when the count decreases to 0 afterwards',
    inject(function(PendingViewCounter, $rootScope) {
      const currentViewsLoadedListener = jasmine.createSpy('bicker_router.currentViewsLoaded listener');
      $rootScope.$on('bicker_router.currentViewsLoaded', currentViewsLoadedListener);

      const initialViewsLoadedListener = jasmine.createSpy('bicker_router.currentViewsLoaded listener');
      $rootScope.$on('bicker_router.initialViewsLoaded', initialViewsLoadedListener);

      PendingViewCounter.increase();
      PendingViewCounter.decrease();
      $rootScope.$digest();
      expect(initialViewsLoadedListener.calls.count()).toBe(1);
      expect(currentViewsLoadedListener).not.toHaveBeenCalled();

      initialViewsLoadedListener.calls.reset();

      PendingViewCounter.increase();
      PendingViewCounter.decrease();
      $rootScope.$digest();

      expect(currentViewsLoadedListener).toHaveBeenCalled();
      expect(initialViewsLoadedListener).not.toHaveBeenCalled();
    })
  );

  it('should fire the bicker_router.initialViewsLoaded event once',
    inject(function(PendingViewCounter, $rootScope) {
      const eventListener = jasmine.createSpy('bicker_router.initialViewsLoaded listener');
      $rootScope.$on('bicker_router.initialViewsLoaded', eventListener);

      PendingViewCounter.increase();
      $rootScope.$digest();
      expect(PendingViewCounter.get()).toBe(1);
      expect(eventListener).not.toHaveBeenCalled();

      PendingViewCounter.decrease();
      $rootScope.$digest();
      expect(PendingViewCounter.get()).toBe(0);
      expect(eventListener).toHaveBeenCalled();

      PendingViewCounter.increase();
      PendingViewCounter.decrease();
      $rootScope.$digest();
      expect(eventListener.calls.count()).toBe(1);
    })
  );

  it('can be reset so that it will fire the bicker_router.initialViewsLoaded again',
    inject(function(PendingViewCounter, $rootScope) {
      const eventListener = jasmine.createSpy('bicker_router.initialViewsLoaded listener');
      $rootScope.$on('bicker_router.initialViewsLoaded', eventListener);

      PendingViewCounter.increase();
      $rootScope.$digest();
      expect(PendingViewCounter.get()).toBe(1);
      expect(eventListener).not.toHaveBeenCalled();

      PendingViewCounter.decrease();
      $rootScope.$digest();
      expect(PendingViewCounter.get()).toBe(0);
      expect(eventListener).toHaveBeenCalled();

      PendingViewCounter.reset();
      PendingViewCounter.increase();
      PendingViewCounter.decrease();
      $rootScope.$digest();
      expect(eventListener.calls.count()).toBe(2);
    })
  );
});
