angular.module('bicker_router').constant('ObjectHelper', {
  get(object, path) {
    if (path === '') { return object; }
    const pieces = path.split('.');
    const key = pieces.pop();
    let parent = object;

    for (const segment of pieces) {
      parent = parent[segment];
      if (parent === undefined) { return undefined; }
    }

    return parent[key];
  },

  set(object, path, value) {
    const pieces = path.split('.');
    const key = pieces.pop();
    let parent = object;

    for (const segment of pieces) {
      if (parent[segment] === undefined) {
        parent[segment] = {};
      }

      parent = parent[segment];
    }

    return parent[key] = value;
  },

  unset(object, path) {
    if (path === '') { return object; }
    const pieces = path.split('.');
    const key = pieces.pop();
    let parent = object;

    for (const segment of pieces) {
      parent = parent[segment];
      if (parent === undefined) { return false; }
    }

    if (parent[key] === undefined) { return false; }
    delete parent[key];
    return true;
  },

  // Recursively return the properties in a that aren't in b
  notIn(a, b, prefix = '') {
    let notIn = [];
    prefix = prefix.length > 0 ? `${prefix}.` : '';

    for (const key of Array.from(Object.keys(a))) {
      const thisPath = `${prefix}${key}`;

      if (b[key] === undefined) {
        notIn.push(thisPath);

      } else if ((typeof a[key] === 'object') && (!(a[key] instanceof Array))) {
        notIn = notIn.concat(this.notIn(a[key], b[key], thisPath));
      }
    }

    return notIn;
  },

  default(overrides, ...defaultSets) {
    let defaultSet, value;
    const result = {};

    if (defaultSets.length === 1) {
      defaultSet = defaultSets[0];
    } else {
      defaultSet = this.default(...Array.from(defaultSets || []));
    }

    for (const key in defaultSet) {
      value = defaultSet[key];
      if (value instanceof Array) {
        result[key] = overrides[key] || value;
      } else if ((typeof value === "object") && (typeof overrides[key] === "object")) {
        result[key] = this.default(overrides[key], value);
      } else {
        result[key] = overrides[key] || value;
      }
    }

    for (const key in overrides) {
      value = overrides[key];
      result[key] = result[key] || value;
    }

    return result;
  }
});

