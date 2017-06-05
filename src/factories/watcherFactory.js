class Watcher {
  constructor(watchPath, handler, initialValue = undefined) {
    this.watchPath = watchPath;
    this.handler = handler;
    this.currentValue = _.cloneDeep(initialValue);
  }

  _tokenizePath(path) {
    return path.split('.');
  }

  shouldNotify(changedPath, newValue) {
    // NB short circuit logic in the simple case
    if (this.watchPath === changedPath) {
      return !angular.equals(this.currentValue, newValue);
    }

    const watch = {
      path: this.watchPath,
      tokens: this._tokenizePath(this.watchPath),
      value: this.currentValue
    };

    const change = {
      path: changedPath,
      tokens: this._tokenizePath(changedPath),
      value: newValue
    };

    const minimumLenth = Math.min(change.tokens.length, watch.tokens.length);
    for (let tokenIndex = 0; tokenIndex < minimumLenth; tokenIndex++) {
      if (watch.tokens[tokenIndex] !== change.tokens[tokenIndex]) {
        return false;
      }
    }

    // NB if we get here then all common tokens match

    const changePathIsDescendant = change.tokens.length > watch.tokens.length;

    if (changePathIsDescendant) {
      const relativePath = change.tokens.slice(watch.tokens.length).join('.');
      const currentValueAtChangedPath = _.get(watch.value, relativePath);
      return !angular.equals(currentValueAtChangedPath, change.value);
    } else {
      const relativePath = watch.tokens.slice(change.tokens.length).join('.');
      const newValueAtWatchPath = _.get(change.value, relativePath);
      return !angular.equals(watch.value, newValueAtWatchPath);
    }
  }

  notify(changedPath, newValue) {
    this.handler(changedPath, newValue, this.currentValue);
    this.currentValue = _.cloneDeep(newValue);
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
