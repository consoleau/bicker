class WatchableList {
  constructor(ObjectHelper, WatcherFactory, list) {
    this.ObjectHelper = ObjectHelper;
    this.WatcherFactory = WatcherFactory;

    this.list = list;
    this.watchers = [];
  }

  get(path) {
    return this.ObjectHelper.get(this.list, path);
  }

  getAll() {
    return this.list;
  }

  getSubset(paths) {
    return _.zipObject(paths, _.map(paths, this.get.bind(this)));
  }

  set(path, value) {
    this.ObjectHelper.set(this.list, path, value);
    return this._notifyWatchers(path, value);
  }

  unset(paths) {
    if (!(paths instanceof Array)) {
      paths = [paths];
    }

    return Array.from(paths).map((path) =>
      (this.ObjectHelper.unset(this.list, path),
        this._notifyWatchers(path, undefined)));
  }

  watch(paths, handler) {
    if (!(paths instanceof Array)) {
      paths = [paths];
    }

    return Array.from(paths).map((path) =>
      this.watchers.push(this.WatcherFactory.create(path, handler, this.get(path))));
  }

  removeWatcher(watcher) {
    if (this.watchers.length === 0) {
      return;
    }
    const newWatchers = [];

    _.each(this.watchers, thisWatcher => {
      if (thisWatcher.handler !== watcher) {
        newWatchers.push(thisWatcher);
      }
    });

    return this.watchers = newWatchers;
  }

  _notifyWatchers(changedPath) {
    const result = [];
    _.each(this.watchers, watcher => {
      let item;
      const watchedValue = this.ObjectHelper.get(this.list, watcher.watchPath);

      if (watcher.shouldNotify(changedPath, watchedValue)) {
        item = watcher.notify(changedPath, watchedValue);
      }
      result.push(item);
    });
    return result;
  }
}

class WatchableListFactory {
  constructor(ObjectHelper, WatcherFactory) {
    this.ObjectHelper = ObjectHelper;
    this.WatcherFactory = WatcherFactory;
  }

  create(list = {}) {
    return new WatchableList(this.ObjectHelper, this.WatcherFactory, list);
  }
}

angular.module('bicker_router').factory('WatchableListFactory', (ObjectHelper, WatcherFactory) => {
  'ngInject';
  return new WatchableListFactory(ObjectHelper, WatcherFactory);
});
