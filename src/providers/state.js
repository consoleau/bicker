class StateProvider {
  $get(WatchableListFactory) {
    return WatchableListFactory.create();
  }
}

angular.module('bicker_router').provider('State', new StateProvider);
