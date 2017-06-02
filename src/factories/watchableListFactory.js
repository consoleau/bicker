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
    // console.group(`State.set calling notifyWatchers: ${path}`);
    // console.log(`new value:  : ${JSON.stringify(value, {}, 2)}`);
    this._notifyWatchers(path, value);
    // console.groupEnd(`State.set calling notifyWatchers: ${path}`)
  }

  unset(paths) {
    if (!(paths instanceof Array)) {
      paths = [paths];
    }

    _(paths).each((path) => {
      this.ObjectHelper.unset(this.list, path);
      // console.group(`State.unset calling notifyWatchers: ${path}`)
      this._notifyWatchers(path, undefined);
      // console.groupEnd(`State.unset calling notifyWatchers: ${path}`)
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
        // console.group(`WF: notifying watchPath: ${watcher.watchPath}`)
        // console.log(`changePath: ${changedPath}`);
        // console.log(`oldValue: ${JSON.stringify(watcher.currentValue, {}, 2)}`);
        // console.log(`newValue: ${JSON.stringify(newValue, {}, 2)}`);
        const newValueAtWatchedPath = this.ObjectHelper.get(this.list, watcher.watchPath);
        watcher.notify(changedPath, newValueAtWatchedPath);
        // console.groupEnd(`WF: notifying watchPath: ${watcher.watchPath}`)
      } else {
        // console.group(`WF: NOT notifying watchPath: ${watcher.watchPath}`)
        // console.log(`changePath: ${changedPath}`);
        // console.log(`oldValue: ${JSON.stringify(watcher.currentValue, {}, 2)}`);
        // console.log(`newValue: ${JSON.stringify(newValue, {}, 2)}`);
        // console.groupEnd(`WF: NOT notifying watchPath: ${watcher.watchPath}`)
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
