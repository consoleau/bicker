class Watcher {
  constructor(watchPath, handler, initialValue = undefined) {
    this.watchPath = watchPath;
    this.handler = handler;
    this.currentValue = _.cloneDeep(initialValue);
  }

  shouldNotify(watchedValue) {
    return !angular.equals(this.currentValue, watchedValue);
  }

  notify(changedPath, newValue) {
    this.handler(changedPath, newValue, this.currentValue);
    return this.currentValue = _.cloneDeep(newValue);
  }
}

class WatcherFactory {
  create(watchPath, handler, initialValue = undefined) {
    return new Watcher(watchPath, handler, initialValue);
  }
}

angular.module('bicker_router').factory('WatcherFactory', () => {
  return new WatcherFactory();
});
