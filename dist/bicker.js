angular.module('bicker_router', ['ngAnimate']).run(function (State, Route, $location, $rootScope, ObjectHelper, PendingViewCounter) {
  "ngInject";

  let oldUrl = undefined;
  $rootScope.$on('$locationChangeStart', function () {
    if (Route.isReady()) {
      Route.setReady(false);
    }
  });

  $rootScope.$on('$locationChangeSuccess', function (e, newUrl) {
    // Work-around for AngularJS issue https://github.com/angular/angular.js/issues/8368
    let data;
    if (newUrl === oldUrl) {
      return;
    }

    oldUrl = newUrl;

    PendingViewCounter.reset();
    const match = Route.match($location.path());

    if (!match) {
      data = {};
    } else {
      data = Route.extractData(match);
    }

    let fieldsToUnset = ObjectHelper.notIn(State.list, data);
    fieldsToUnset = _.difference(fieldsToUnset, Route.getPersistentStates().concat(Route.getFlashStates()));

    const eventData = {unsetting: fieldsToUnset, setting: data};

    $rootScope.$emit('bicker_router.beforeStateChange', eventData);

    if ((eventData.unsetting).length !== 0) {
      State.unset(eventData.unsetting);
    }

    _.forEach(eventData.setting, (value, key) => {
      State.set(key, value);
    });

    Route.resetFlashStates();
    Route.setReady(true);
  });
});

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


// Usage:
//
// If you want to add the class "active" to an anchor element when the "main" view has a binding
// with the name "myBinding" rendered within it
//
// <a route-class="{ className: 'active', viewName: 'main', bindingName: 'myBinding' }">Anchor text</a>
//
// You can also use regular expressions for the binding name, but to do so you have to provide a method
// on your controller which returns the route class definition object, because AngularJS expressions
// don't support inline regular expressions
//
// class MyController {
//  getRouteClassObject() {
//    return { className: 'active', viewName: 'main', bindingName: /myBind/ }
//  }
// }
//
// <a route-class="$ctrl.getRouteClassObject()">Anchor text</a>
//

function routeClassFactory(Route) {
  'ngInject'
  return {
    restrict: 'A',
    link (scope, iElement, iAttrs) {
      scope.$watch(() => {
        const routeClassDefinition = scope.$eval(iAttrs['routeClass'])

        if (!Route.matchesCurrentBindingName(routeClassDefinition.viewName, routeClassDefinition.bindingName)) {
          if (iElement.hasClass(routeClassDefinition.className)) {
            iElement.removeClass(routeClassDefinition.className)
          }
        } else {
          if (!iElement.hasClass(routeClassDefinition.className)) {
            iElement.addClass(routeClassDefinition.className)
          }
        }
      })
    }
  }
}

angular.module('bicker_router').directive('routeClass', routeClassFactory);

function routeHrefFactory (Route, $window, $location, $timeout) {
  'ngInject'

  return {
    restrict: 'A',
    scope: true,
    link (scope, iElement, iAttrs) {
    if (iAttrs.ignoreHref === undefined) {
      iElement.click((event) => {
        event.preventDefault();
        let urlPath = iElement.attr('href');

        if (!Route.isHtml5ModeEnabled()) {
          urlPath = urlPath.replace(/^#/, '');
        }

        if (event.metaKey) {
          const fullUrl = $window.location.origin + '/' + urlPath;
          $window.open(fullUrl,'_blank')
        } else {
          return $timeout(() => $location.url(urlPath));
        }
      });
    }

    const object = Route.getUrlWriters();
    for (const writerName in object) {
      const writer = object[writerName];
      scope[`${writerName}UrlWriter`] = writer;
    }

    return scope.$watch(iAttrs.routeHref, (newUrl) => {
      let url;
      if (Route.isHtml5ModeEnabled()) {
        url = newUrl;
      } else {
        url = `#${newUrl}`;
      }
      return iElement.attr('href', url);
    });
  }
  }
}

angular.module('bicker_router').directive('routeHref', routeHrefFactory);

// @TODO none of the animation code in this directive has been tested. Not sure if it can be at this stage This needs further investigation.
// @TODO this code does too much, it should be refactored.

function routeViewFactory($log, $compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, $templateRequest, Route) {
  'ngInject';
  return {
    restrict: 'E',
    scope: false,
    replace: true,
    template: '<div></div>',
    link (viewDirectiveScope, iElement, iAttrs) {
      let viewCreated = false;
      let viewScope = undefined;
      let viewManagementPending = false;
      const view = ViewBindings.getView(iAttrs.name);
      const bindings = view.getBindings();

      iElement.addClass('ng-hide');

      let previousBoundState = undefined;
      let previousBinding = undefined;

      const getStateDataForBinding = binding => _.cloneDeep(State.getSubset(getStateFieldsFromBinding(binding)));

      function getComponentFromBinding(binding, field) {
        if (!field) {
          field = 'component';
        }
        const source = binding[field] ? $injector.get(`${binding[field]}Directive`)[0] : binding;
        return _.defaults(_.pick(source, ['controller', 'templateUrl', 'controllerAs']), {controllerAs: '$ctrl'});
      }

      function hasRequiredData(binding) {
        const requiredState = binding.requiredState || [];

        for (let requirement of Array.from(requiredState)) {
          let negateResult = false;
          if ('!' === requirement.charAt(0)) {
            requirement = requirement.slice(1);
            negateResult = true;
          }

          let element = State.get(requirement);

          // Return false if element is undefined
          if ((element === null)) {
            return false;
          }

          // Only check value of element if it is defined
          if (negateResult) {
            element = !element;
          }
          if (!element) {
            return false;
          }
        }

        if (binding.canActivate) {
          if (!$injector.invoke(binding.canActivate)) {
            return false;
          }
        }

        return true;
      }

      function manageView(element, bindings) {
        const matchingBinding = getMatchingBinding(bindings);

        if (!matchingBinding) {
          if (viewCreated) {
            $animate.addClass(element, 'ng-hide').then(() => {
              return destroyView(element);
            });
            previousBoundState = undefined;
            previousBinding = undefined;
            Route.deleteCurrentBinding(view.name)
          }
          return;
        }

        const newState = getStateDataForBinding(matchingBinding);
        if ((matchingBinding === previousBinding) && angular.equals(previousBoundState, newState)) {
          return;
        }

        previousBinding = matchingBinding;
        previousBoundState = newState;

        PendingViewCounter.increase();

        return showResolvingTemplate(element, matchingBinding).then(function (hasResolvingTemplate) {
          // @TODO: Magic number
          const delayForRealTemplateInsertion = hasResolvingTemplate ? 300 : undefined;

          if (!viewCreated) {
            return $animate.removeClass(element, 'ng-hide').then(() => {
              return createView(element, matchingBinding, delayForRealTemplateInsertion);
            });
          } else {
            viewScope.$destroy();
            return createView(element, matchingBinding, delayForRealTemplateInsertion);
          }
        });
      }

      function getMatchingBinding(bindings) {
        for (const binding of Array.from(bindings)) {
          if (hasRequiredData(binding)) {
            return binding;
          }
        }

        return undefined;
      }

      function destroyView(element) {
        if (viewCreated === false) {
          return;
        }
        viewCreated = false;
        element.children().eq(0).remove();
        viewScope.$destroy();
      }

      function createView(element, binding, minimumDelay) {
        const timeStartedMainView = Date.now();
        const component = getComponentFromBinding(binding);

        const onSuccessfulResolution = function (args) {
          if (getMatchingBinding(bindings) !== binding) {
            return;
          }

          viewCreated = true;

          const resolvingTemplateShownTime = Date.now() - timeStartedMainView;

          const injectMainTemplate = function () {
            try {
              return renderComponent(element, component, args);
            } catch (e) {
              return showError(e, element, binding);
            } finally {
              // Wrapped in a timeout so that we can give the view time to properly initialise
              // before potentially triggering the intialViewsLoaded event
              $timeout(function () {
                if (!binding.manualCompletion) {
                  return PendingViewCounter.decrease();
                }
              });
            }
          };

          const mainTemplateInjectionDelay = Math.max(0, minimumDelay - resolvingTemplateShownTime);

          if (resolvingTemplateShownTime < minimumDelay) {
            return $timeout(() => injectMainTemplate()
              , mainTemplateInjectionDelay);
          } else {
            return injectMainTemplate();
          }
        };

        const onResolutionFailure = function (error) {
          $timeout(function () {
            if (!binding.manualCompletion) {
              return PendingViewCounter.decrease();
            }
          });
          $log.error(error);
          return showResolvingError(error, element, binding);
        };

        Route.setCurrentBinding(view.name, binding)
        const promises = {template: $templateRequest(component.templateUrl), dependencies: resolve(binding)};
        return $q.all(promises).then(onSuccessfulResolution, onResolutionFailure);
      }

      function showResolvingTemplate(element, binding) {
        if (!binding.resolvingTemplateUrl || !binding.resolve || (Object.keys(binding.resolve).length === 0)) {
          const deferred = $q.defer();
          deferred.resolve(false);
          return deferred.promise;
        }

        return $templateRequest(binding.resolvingTemplateUrl).then(function (template) {
          element.html(template);
          return $compile(element.contents())($rootScope.$new());
        });
      }

      function showResolvingError(error, element, binding) {
        if (binding.resolvingErrorTemplateUrl) {
          return showResolvingErrorTemplate(element, binding);
        } else if (binding.resolvingErrorComponent) {
          return showErrorComponent(error, element, binding, 'resolvingErrorComponent');
        }
      }

      const showResolvingErrorTemplate = (element, binding) => showBasicTemplate(element, binding, 'resolvingErrorTemplateUrl');

      function showError(error, element, binding) {
        let returnValue = null;
        if (binding.errorTemplateUrl) {
          returnValue = showErrorTemplate(element, binding);
        } else if (binding.errorComponent) {
          returnValue = showErrorComponent(error, element, binding);
        }

        $timeout(function () {
          if (!binding.manualCompletion) {
            return PendingViewCounter.decrease();
          }
        });
        return returnValue;
      }

      const showErrorTemplate = (element, binding) => showBasicTemplate(element, binding, 'errorTemplateUrl');

      function showBasicTemplate(element, binding, templateField) {
        if (!binding[templateField]) {
          return;
        }
        return $templateRequest(binding[templateField]).then(function (template) {
          element.html(template);
          const link = $compile(element.contents());
          viewScope = viewDirectiveScope.$new();
          return link(viewScope);
        });
      }

      function showErrorComponent(error, element, binding, bindingComponentField) {
        if (!bindingComponentField) {
          bindingComponentField = 'errorComponent';
        }
        if (!binding[bindingComponentField]) {
          return;
        }
        const component = getComponentFromBinding(binding, bindingComponentField);
        const args = {dependencies: {error}};

        return $templateRequest(component.templateUrl).then(function (template) {
          args.template = template;
          return renderComponent(element, component, args);
        });
      }

      function renderComponent(element, component, args) {
        const {dependencies} = args;
        const {template} = args;

        element.html(template);
        const link = $compile(element.contents());
        viewScope = viewDirectiveScope.$new();

        if (component.controller) {
          const locals = _.merge(dependencies, {$scope: viewScope, $element: element.children().eq(0)});

          try {
            locals.$scope[component.controllerAs] = $controller(component.controller, locals);
          }
          catch (error) {
            let errorMessage;

            try {
              if (_.isObject(error)) {
                errorMessage = JSON.stringify(error);
              } else {
                errorMessage = error;
              }

            } catch (jsonError) {
              errorMessage = 'Failed to serialize error object for logging';
            }

            $log.error(`Failed instantiating controller for view ${view}: ${errorMessage}`);
            throw error;
          }
        }

        return link(viewScope);
      }

      const resolve = function (binding) {
        if (!binding.resolve || (Object.keys(binding.resolve).length === 0)) {
          const deferred = $q.defer();
          deferred.resolve({});
          return deferred.promise;
        }

        const promises = {};

        for (const dependencyName in binding.resolve) {
          const dependencyFactory = binding.resolve[dependencyName];
          try {
            promises[dependencyName] = $injector.invoke(dependencyFactory);
          } catch (e) {
            promises[dependencyName] = $q.reject(e);
          }
        }

        return $q.all(promises);
      };

      const getStateFieldsFromBinding = binding => _.union(binding.requiredState || [], binding.watchedState || []);

      function stripNegationPrefix(str) {
        if (str.charAt(0) === '!') {
          return str.substr(1);
        } else {
          return str;
        }
      }

      const getStateFieldsFromView = view => _.flatten(_.map(view.getBindings(), getStateFieldsFromBinding));

      const getFieldsToWatch = view => _.uniq(_.map(getStateFieldsFromView(view), stripNegationPrefix));

      const fields = getFieldsToWatch(view);

      return Route.whenReady().then(function () {
        viewManagementPending = true;

        // Try to start the ball rolling in case there's no dependencies and we can create the view immediately
        manageView(iElement, bindings);
        viewManagementPending = false;

        // Don't bother putting in a watcher if there's no dependencies that will ever trigger a change event
        if (fields.length === 0) {
          return;
        }

        const stateWatcher = function (changedPath, newValue, oldValue) {
          if (viewManagementPending) {
            return;
          }
          viewManagementPending = true;

          // Wrapped in a timeout so that we can finish the digest cycle before building the view, which should
          // prevent us from re-rendering a view multiple times if multiple properties of the same state dependency
          // get changed with repeated State.set calls
          return $timeout(function () {
            manageView(iElement, bindings);
            return viewManagementPending = false;
          });
        };

        State.watch(fields, stateWatcher);

        viewDirectiveScope.$on('$destroy', () => State.removeWatcher(stateWatcher));
      });
    }
  }
}

angular.module('bicker_router').directive('view', routeViewFactory);

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

angular.module('bicker_router').provider('Route', function(ObjectHelper) {
  "ngInject";
  const tokens = {};
  const urlWriters = [];
  const urls = [];
  const persistentStates = [];
  const ready = false;
  const types = {};
  let html5Mode = false;

  const provider = {

    registerType(name, config) {
      types[name] = config;
      types[name].regex = new RegExp(types[name].regex.source, 'i');
      return _.extend({ and: this.registerType }, this);
    },

    registerUrlToken(name, config) {
      tokens[name] = _.extend({name}, config);
      return _.extend({ and: this.registerUrlToken }, this);
    },

    registerUrlWriter(name, fn) {
      urlWriters[name] = fn;
      return _.extend({ and: this.registerUrlWriter }, this);
    },

    registerUrl(pattern, config = {}) {
      const urlData = {
        compiledUrl: this._compileUrlPattern(pattern, config),
        pattern
      };

      urls.push(_.extend(urlData, config));
      return _.extend({ and: this.registerUrl }, this);
    },

    setPersistentStates(...stateList) {
      _.forEach(stateList, (state) => {
        if (!persistentStates.includes(state)) {
          persistentStates.push(state);
        }
      });
    },

    setHtml5Mode(mode) {
      html5Mode = mode;
    },

    _compileUrlPattern(urlPattern, config) {
      let match;
      urlPattern = this._escapeRegexSpecialCharacters(urlPattern);
      urlPattern = this._ensureOptionalTrailingSlash(urlPattern);

      const tokenRegex = /\{([A-Za-z\._0-9]+)\}/g;
      let urlRegex = urlPattern;

      if (!config.partialMatch) {
        urlRegex = `^${urlRegex}$`;
      }

      const tokenList = [];

      while ((match = tokenRegex.exec(urlPattern)) !== null) {
        const token = tokens[match[1]];
        tokenList.push(token);
        urlRegex = urlRegex.replace(match[0], `(${types[token.type].regex.source})`);
      }

      urlRegex.replace('.', '\\.');

      return {
        regex: new RegExp(urlRegex, 'i'),
        tokens: tokenList
      };
    },

    _ensureOptionalTrailingSlash(str) {
      if (str.match(/\/$/)) {
        return str.replace(/\/$/, '/?');
      }
      return `${str}/?`;
    },

    _escapeRegexSpecialCharacters(str) {
      return str.replace(/[\-\[\]\/\(\)\*\+\?\\\^\$\|]/g, "\\$&");
    },

    $get($location, $injector, $q) {
      'ngInject';

      // When getting a new instance of the service (only done once), we need to iterate over the urlWriters and turn
      // them into methods that invoke the REAL urlWriter, but providing dependency injection to it, while also
      // giving it the data that the callee passes in.

      // The reason we have to do this here is because we don't have access to the $injector back in the routeProvider.

      _.forIn(urlWriters, (writer, writerName) =>
        urlWriters[writerName] = function(data) {
          if (!data) { data = {}; }
          const locals = {UrlData: data};
          return $injector.invoke(writer, {}, locals);
        }
      );

      let flashStates = [];

      const service = {
        currentBindings: {},
        readyDeferred: $q.defer(),

        match(urlToMatch) {
          for (const url of Array.from(urls)) {
            let match;
            if ((match = url.compiledUrl.regex.exec(urlToMatch)) !== null) {
              return {url, regexMatch: match};
            }
          }
          return null;
        },

        extractData(match, searchData = undefined) {
          const defaults = this.extractDefaultData(match);
          const path = this.extractPathData(match);
          searchData = this.extractSearchData(searchData);
          return ObjectHelper.default(searchData, path, defaults);
        },

        extractSearchData(searchData) {
          if (!searchData) { searchData = $location.search(); }
          const data = _.clone(searchData);
          const newData = {};

          _.forEach(data, (value, key) => {
            let targetKey = _.findKey(tokens, { searchAlias: key });
            if (!targetKey) { targetKey = key; }

            const tokenTypeName = tokens[targetKey] ? _.get(tokens[targetKey], 'type') : undefined;
            if (!tokens[targetKey] || (types[tokenTypeName].regex.test(value))) {

              const tokenType = tokens[targetKey] ? tokens[targetKey].type : undefined;
              const typeTokenType = tokenType ? types[tokenType] : undefined;
              const tokenTypeParsed = typeTokenType ? typeTokenType.parser : undefined;

              if (tokenTypeParsed) {
                value = $injector.invoke(tokenTypeParsed, null, {token: value});
              }

              const tokenTargetKeyStatePath = tokens[targetKey] ? tokens[targetKey].statePath : undefined;
              const dataKey = tokenTargetKeyStatePath || targetKey;

              ObjectHelper.set(newData, dataKey, value);
            }
          });

          return newData;
        },

        extractDefaultData(match) {
          const data = {};

          _.forEach(match.url.state, (value, key) => {
            ObjectHelper.set(data, key, (typeof value === 'object' ? _.cloneDeep(value) : value));
          });

          return data;
        },

        extractPathData(match) {
          const data = {};
          const pathTokens = match.url.compiledUrl.tokens;

          if (pathTokens.length === 0) { return {}; }

          for (let n = 0, end = pathTokens.length-1, asc = 0 <= end; asc ? n <= end : n >= end; asc ? n++ : n--) {
            const token = match.url.compiledUrl.tokens[n];
            let value = match.regexMatch[n+1];

            if (types[token.type].parser) { value = $injector.invoke(types[token.type].parser, null, {token: value}); }

            ObjectHelper.set(data, (token.statePath || token.name), value);
          }

          return data;
        },

        getUrlWriters() {
          return urlWriters;
        },

        getUrlWriter(name) {
          return urlWriters[name];
        },

        invokeUrlWriter(name, data = {}) {
          return urlWriters[name](data);
        },

        go(name, data = {}) {
          return $location.url(this.invokeUrlWriter(name, data));
        },

        getPersistentStates() {
          return persistentStates;
        },

        resetFlashStates() {
          flashStates = [];
        },

        addFlashStates(...newStates) {
          flashStates = flashStates.concat(newStates);
        },

        getFlashStates() {
          return flashStates;
        },

        setCurrentBinding(viewName, binding) {
          this.currentBindings[viewName] = binding;
        },

        getCurrentBinding(viewName) {
          return this.currentBindings[viewName];
        },

        deleteCurrentBinding(viewName) {
          delete this.currentBindings[viewName];
        },

        matchesCurrentBindingName(viewName, bindingNameExpression) {
          const currentBinding = this.getCurrentBinding(viewName)

          if (!currentBinding) {
            return false
          }

          return bindingNameExpression instanceof RegExp ?
            bindingNameExpression.test(currentBinding.name) :
            currentBinding.name === bindingNameExpression;
        },

        setReady(ready) {
          if (!ready) {
            this.readyDeferred = $q.defer();
          } else {
            this.readyDeferred.resolve();
          }
          return ready;
        },

        isReady() {
          return ready;
        },

        isHtml5ModeEnabled() {
          return html5Mode;
        },

        whenReady() {
          return this.readyDeferred.promise;
        }
      };

      return service;
    }
  };

  provider.registerType('numeric', {regex: /\d+/, parser: ['token', token => parseInt(token)]});
  provider.registerType('alpha', {regex: /[a-zA-Z]+/});
  provider.registerType('any', {regex: /.+/});
  provider.registerType('list', {regex: /.+/, parser: ['token', token => token.split(',')]});

  return provider;
});

class StateProvider {
  $get(WatchableListFactory) {
    'ngInject';
    return WatchableListFactory.create();
  }
}

angular.module('bicker_router').provider('State', new StateProvider);

angular.module('bicker_router').provider('ViewBindings', function () {
  const views = [];

  class View {
    constructor(name, bindings) {
      this.name = name;
      this.bindings = bindings;
      if (!(this.bindings instanceof Array)) {
        this.bindings = [this.bindings];
      }
    }

    getBindings() {
      return this.bindings;
    }
  }

  return {

    bind(name, config) {

      function applyCommonRequiredState(bindings, commonRequiredState) {
        const result = [];
        for (const binding of Array.from(newBindings)) {
          if (!(binding.requiredState instanceof Array)) {
            binding.requiredState = [binding.requiredState];
          }
          result.push(binding.requiredState = binding.requiredState.concat(commonRequiredState));
        }
        return result;
      }

      function applyCommonResolve(bindings, commonResolve) {
        const result = [];
        for (const binding of Array.from(newBindings)) {
          if (!('resolve' in binding)) {
            binding.resolve = {};
          }
          result.push(_.defaults(binding.resolve, commonResolve));
        }
        return result;
      }

      function applyCommonFields(newBindings) {
        const basicCommonFields = [
          {name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl'},
          {name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent'},
          {name: 'commonErrorComponent', overrideField: 'errorComponent'},
          {name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl'}
        ];

        for (const commonField of Array.from(basicCommonFields)) {
          if (commonField.name in config) {
            defaultBindingField(newBindings, commonField.overrideField, config[commonField.name]);
          }
        }

        if ('commonRequiredState' in config) {
          applyCommonRequiredState(newBindings, config['commonRequiredState']);
        }

        if ('commonResolve' in config) {
          return applyCommonResolve(newBindings, config['commonResolve']);
        }
      }

      function defaultBindingField(bindings, fieldName, defaultValue) {
        const result = [];
        for (const binding of Array.from(newBindings)) {
          let item;
          if (!(fieldName in binding)) {
            item = binding[fieldName] = defaultValue;
          }
          result.push(item);
        }
        return result;
      }

      let newBindings = [];
      if ('bindings' in config) {
        newBindings = config['bindings'];
      } else {
        newBindings = (config instanceof Array) ? config : [config];
      }

      if (!(newBindings.length > 0)) {
        throw new Error(`Invalid call to ViewBindingsProvider.bind for name '${name}'`);
      }

      applyCommonFields(newBindings);
      return views[name] = new View(name, newBindings);
    },

    $get() {
      return {
        getView(view) {
          return views[view];
        }
      };
    }
  };
});
