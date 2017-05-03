class PendingViewCounter {
  constructor($rootScope) {
    this.$rootScope = $rootScope;
    this.count = 0;
    this.initialViewsLoaded = false;
  }

  get() {
    return this.count;
  }

  increase() {
    return this.count += 1;
  }

  decrease() {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) {
      if (!this.initialViewsLoaded) {
        this.initialViewsLoaded = true;
        this.$rootScope.$broadcast('bicker_router.initialViewsLoaded');
      } else {
        this.$rootScope.$broadcast('bicker_router.currentViewsLoaded');
      }
    }
  }

  reset() {
    this.count = 0;
    return this.initialViewsLoaded = false;
  }
}

angular.module('bicker_router').factory('PendingViewCounter', ($rootScope) => {
  'ngInject';
  return new PendingViewCounter($rootScope);
});
