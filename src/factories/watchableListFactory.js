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
    this._notifyWatchers(path, value);
  }

  unset(paths) {
    if (!(paths instanceof Array)) {
      paths = [paths];
    }

    _(paths).each((path) => {
      this.ObjectHelper.unset(this.list, path);
      this._notifyWatchers(path, undefined);
    });
  }

  watch(paths, handler) {
    if (!(paths instanceof Array)) {
      paths = [paths];
    }

    _(paths).each((path) => {
      this.watchers.push(this.WatcherFactory.create(path, handler, this.get(path)));
    });
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

  _notifyWatchers(changedPath, newValue) {
    _.each(this.watchers, watcher => {
      if (watcher.shouldNotify(changedPath, newValue)) {
        const newValueAtWatchedPath = this.ObjectHelper.get(this.list, watcher.watchPath);
        watcher.notify(changedPath, newValueAtWatchedPath);
      }
    });
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
