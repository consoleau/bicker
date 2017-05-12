class StateProvider {
  $get(WatchableListFactory) {
    'ngInject';
    return WatchableListFactory.create();
  }
}

angular.module('bicker_router').provider('State', new StateProvider);
