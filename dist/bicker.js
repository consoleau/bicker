(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

angular.module('bicker_router', ['ngAnimate']).run(["State", "Route", "$location", "$rootScope", "ObjectHelper", "PendingViewCounter", function (State, Route, $location, $rootScope, ObjectHelper, PendingViewCounter) {
  "ngInject";

  var oldUrl = undefined;
  $rootScope.$on('$locationChangeStart', function () {
    if (Route.isReady()) {
      Route.setReady(false);
    }
  });

  $rootScope.$on('$locationChangeSuccess', function (e, newUrl) {
    // Work-around for AngularJS issue https://github.com/angular/angular.js/issues/8368
    var data = void 0;
    if (newUrl === oldUrl) {
      return;
    }

    oldUrl = newUrl;

    PendingViewCounter.reset();
    var match = Route.match($location.path());

    if (!match) {
      data = {};
    } else {
      data = Route.extractData(match);
    }

    var fieldsToUnset = ObjectHelper.notIn(State.list, data);
    fieldsToUnset = _.difference(fieldsToUnset, Route.getPersistentStates().concat(Route.getFlashStates()));

    var eventData = { unsetting: fieldsToUnset, setting: data };

    $rootScope.$emit('bicker_router.beforeStateChange', eventData);

    if (eventData.unsetting.length !== 0) {
      State.unset(eventData.unsetting);
    }

    _.forEach(eventData.setting, function (value, key) {
      State.set(key, value);
    });

    Route.resetFlashStates();
    Route.setReady(true);
  });
}]);

angular.module('bicker_router').constant('ObjectHelper', {
  get: function get(object, path) {
    if (path === '') {
      return object;
    }
    var pieces = path.split('.');
    var key = pieces.pop();
    var parent = object;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = pieces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var segment = _step.value;

        parent = parent[segment];
        if (parent === undefined) {
          return undefined;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return parent[key];
  },
  set: function set(object, path, value) {
    var pieces = path.split('.');
    var key = pieces.pop();
    var parent = object;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = pieces[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var segment = _step2.value;

        if (parent[segment] === undefined) {
          parent[segment] = {};
        }

        parent = parent[segment];
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return parent[key] = value;
  },
  unset: function unset(object, path) {
    if (path === '') {
      return object;
    }
    var pieces = path.split('.');
    var key = pieces.pop();
    var parent = object;

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = pieces[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var segment = _step3.value;

        parent = parent[segment];
        if (parent === undefined) {
          return false;
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (parent[key] === undefined) {
      return false;
    }
    delete parent[key];
    return true;
  },

  // Recursively return the properties in a that aren't in b
  notIn: function notIn(a, b) {
    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var notIn = [];
    prefix = prefix.length > 0 ? prefix + '.' : '';

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = Array.from(Object.keys(a))[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var key = _step4.value;

        var thisPath = '' + prefix + key;

        if (b[key] === undefined) {
          notIn.push(thisPath);
        } else if (_typeof(a[key]) === 'object' && !(a[key] instanceof Array)) {
          notIn = notIn.concat(this.notIn(a[key], b[key], thisPath));
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    return notIn;
  },
  default: function _default(overrides) {
    var defaultSet = void 0,
        value = void 0;
    var result = {};

    for (var _len = arguments.length, defaultSets = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      defaultSets[_key - 1] = arguments[_key];
    }

    if (defaultSets.length === 1) {
      defaultSet = defaultSets[0];
    } else {
      defaultSet = this.default.apply(this, _toConsumableArray(Array.from(defaultSets || [])));
    }

    for (var key in defaultSet) {
      value = defaultSet[key];
      if (value instanceof Array) {
        result[key] = overrides[key] || value;
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object" && _typeof(overrides[key]) === "object") {
        result[key] = this.default(overrides[key], value);
      } else {
        result[key] = overrides[key] || value;
      }
    }

    for (var _key2 in overrides) {
      value = overrides[_key2];
      result[_key2] = result[_key2] || value;
    }

    return result;
  }
});

var routeHrefDirective = function routeHrefDirective(Route, $location, $timeout) {
  _classCallCheck(this, routeHrefDirective);

  this.restrict = 'A';
  this.scope = true;

  this.link = function (scope, iElement, iAttrs) {
    if (iAttrs.ignoreHref === undefined) {
      iElement.click(function (event) {
        event.preventDefault();
        var url = iElement.attr('href');

        if (!Route.isHtml5ModeEnabled()) {
          url = url.replace(/^#/, '');
        }

        return $timeout(function () {
          return $location.url(url);
        });
      });
    }

    var object = Route.getUrlWriters();
    for (var writerName in object) {
      var writer = object[writerName];
      scope[writerName + 'UrlWriter'] = writer;
    }

    return scope.$watch(iAttrs.routeHref, function (newUrl) {
      var url = void 0;
      if (Route.isHtml5ModeEnabled()) {
        url = newUrl;
      } else {
        url = '#' + newUrl;
      }
      return iElement.attr('href', url);
    });
  };
};

angular.module('bicker_router').directive('routeHref', ["Route", "$location", "$timeout", function (Route, $location, $timeout) {
  'ngInject';

  return new routeHrefDirective(Route, $location, $timeout);
}]);

// @TODO none of the animation code in this directive has been tested. Not sure if it can be at this stage This needs further investigation.
// @TODO this code does too much, it should be refactored.

var routeViewDirective = function routeViewDirective($log, $compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, $templateRequest, Route) {
  _classCallCheck(this, routeViewDirective);

  this.restrict = 'E';
  this.scope = false;
  this.replace = true;
  this.template = '<div></div>';

  this.link = function (viewDirectiveScope, iElement, iAttrs) {

    var viewCreated = false;
    var viewScope = undefined;
    var viewManagementPending = false;
    var view = ViewBindings.getView(iAttrs.name);
    var bindings = view.getBindings();

    iElement.addClass('ng-hide');

    var previousBoundState = undefined;
    var previousBinding = undefined;

    var getStateDataForBinding = function getStateDataForBinding(binding) {
      return _.cloneDeep(State.getSubset(getStateFieldsFromBinding(binding)));
    };

    function getComponentFromBinding(binding, field) {
      if (!field) {
        field = 'component';
      }
      var source = binding[field] ? $injector.get(binding[field] + 'Directive')[0] : binding;
      return _.defaults(_.pick(source, ['controller', 'templateUrl', 'controllerAs']), { controllerAs: '$ctrl' });
    }

    function hasRequiredData(binding) {
      var requiredState = binding.requiredState || [];

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Array.from(requiredState)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var requirement = _step5.value;

          var negateResult = false;
          if ('!' === requirement.charAt(0)) {
            requirement = requirement.slice(1);
            negateResult = true;
          }

          var element = State.get(requirement);

          // Return false if element is undefined
          if (element === null) {
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
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
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
      var matchingBinding = getMatchingBinding(bindings);

      if (!matchingBinding) {
        if (viewCreated) {
          $animate.addClass(element, 'ng-hide').then(function () {
            return destroyView(element);
          });
          previousBoundState = undefined;
          previousBinding = undefined;
        }
        return;
      }

      var newState = getStateDataForBinding(matchingBinding);
      if (matchingBinding === previousBinding && angular.equals(previousBoundState, newState)) {
        return;
      }

      previousBinding = matchingBinding;
      previousBoundState = newState;

      PendingViewCounter.increase();

      return showResolvingTemplate(element, matchingBinding).then(function (hasResolvingTemplate) {
        // @TODO: Magic number
        var delayForRealTemplateInsertion = hasResolvingTemplate ? 300 : undefined;

        if (!viewCreated) {
          return $animate.removeClass(element, 'ng-hide').then(function () {
            return createView(element, matchingBinding, delayForRealTemplateInsertion);
          });
        } else {
          viewScope.$destroy();
          return createView(element, matchingBinding, delayForRealTemplateInsertion);
        }
      });
    }

    function getMatchingBinding(bindings) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = Array.from(bindings)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var binding = _step6.value;

          if (hasRequiredData(binding)) {
            return binding;
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
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
      var timeStartedMainView = Date.now();
      var component = getComponentFromBinding(binding);

      var onSuccessfulResolution = function onSuccessfulResolution(args) {
        if (getMatchingBinding(bindings) !== binding) {
          return;
        }

        viewCreated = true;

        var resolvingTemplateShownTime = Date.now() - timeStartedMainView;

        var injectMainTemplate = function injectMainTemplate() {
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

        var mainTemplateInjectionDelay = Math.max(0, minimumDelay - resolvingTemplateShownTime);

        if (resolvingTemplateShownTime < minimumDelay) {
          return $timeout(function () {
            return injectMainTemplate();
          }, mainTemplateInjectionDelay);
        } else {
          return injectMainTemplate();
        }
      };

      var onResolutionFailure = function onResolutionFailure(error) {
        $timeout(function () {
          if (!binding.manualCompletion) {
            return PendingViewCounter.decrease();
          }
        });
        $log.error(error);
        return showResolvingError(error, element, binding);
      };

      var promises = { template: $templateRequest(component.templateUrl), dependencies: resolve(binding) };
      return $q.all(promises).then(onSuccessfulResolution, onResolutionFailure);
    }

    function showResolvingTemplate(element, binding) {
      if (!binding.resolvingTemplateUrl || !binding.resolve || Object.keys(binding.resolve).length === 0) {
        var deferred = $q.defer();
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

    var showResolvingErrorTemplate = function showResolvingErrorTemplate(element, binding) {
      return showBasicTemplate(element, binding, 'resolvingErrorTemplateUrl');
    };

    function showError(error, element, binding) {
      var returnValue = null;
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

    var showErrorTemplate = function showErrorTemplate(element, binding) {
      return showBasicTemplate(element, binding, 'errorTemplateUrl');
    };

    function showBasicTemplate(element, binding, templateField) {
      if (!binding[templateField]) {
        return;
      }
      return $templateRequest(binding[templateField]).then(function (template) {
        element.html(template);
        var link = $compile(element.contents());
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
      var component = getComponentFromBinding(binding, bindingComponentField);
      var args = { dependencies: { error: error } };

      return $templateRequest(component.templateUrl).then(function (template) {
        args.template = template;
        return renderComponent(element, component, args);
      });
    }

    function renderComponent(element, component, args) {
      var dependencies = args.dependencies;
      var template = args.template;

      element.html(template);
      var link = $compile(element.contents());
      viewScope = viewDirectiveScope.$new();

      if (component.controller) {
        var locals = _.merge(dependencies, { $scope: viewScope, $element: element.children().eq(0) });

        var controller = $controller(component.controller, locals);
        locals.$scope[component.controllerAs] = controller;
      }

      return link(viewScope);
    }

    var resolve = function resolve(binding) {
      if (!binding.resolve || Object.keys(binding.resolve).length === 0) {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      }

      var promises = {};

      for (var dependencyName in binding.resolve) {
        var dependencyFactory = binding.resolve[dependencyName];
        try {
          promises[dependencyName] = $injector.invoke(dependencyFactory);
        } catch (e) {
          promises[dependencyName] = $q.reject(e);
        }
      }

      return $q.all(promises);
    };

    var getStateFieldsFromBinding = function getStateFieldsFromBinding(binding) {
      return _.union(binding.requiredState || [], binding.watchedState || []);
    };

    function stripNegationPrefix(str) {
      if (str.charAt(0) === '!') {
        return str.substr(1);
      } else {
        return str;
      }
    }

    var getStateFieldsFromView = function getStateFieldsFromView(view) {
      return _.flatten(_.map(view.getBindings(), getStateFieldsFromBinding));
    };

    var getFieldsToWatch = function getFieldsToWatch(view) {
      return _.uniq(_.map(getStateFieldsFromView(view), stripNegationPrefix));
    };

    var fields = getFieldsToWatch(view);

    return Route.whenReady().then(function () {
      viewManagementPending = true;

      // Try to start the ball rolling in case there's no dependencies and we can create the view immediately
      manageView(iElement, bindings);
      viewManagementPending = false;

      // Don't bother putting in a watcher if there's no dependencies that will ever trigger a change event
      if (fields.length === 0) {
        return;
      }

      var stateWatcher = function stateWatcher(changedPath, newValue, oldValue) {
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

      viewDirectiveScope.$on('$destroy', function () {
        return State.removeWatcher(stateWatcher);
      });
    });
  };
};

angular.module('bicker_router').directive('view', ["$log", "$compile", "$controller", "ViewBindings", "$q", "State", "$rootScope", "$animate", "$timeout", "$injector", "PendingViewCounter", "$templateRequest", "Route", function ($log, $compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, $templateRequest, Route) {
  'ngInject';

  return new routeViewDirective($log, $compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, $templateRequest, Route);
}]);

var PendingViewCounter = function () {
  function PendingViewCounter($rootScope) {
    _classCallCheck(this, PendingViewCounter);

    this.$rootScope = $rootScope;
    this.count = 0;
    this.initialViewsLoaded = false;
  }

  _createClass(PendingViewCounter, [{
    key: 'get',
    value: function get() {
      return this.count;
    }
  }, {
    key: 'increase',
    value: function increase() {
      return this.count += 1;
    }
  }, {
    key: 'decrease',
    value: function decrease() {
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
  }, {
    key: 'reset',
    value: function reset() {
      this.count = 0;
      return this.initialViewsLoaded = false;
    }
  }]);

  return PendingViewCounter;
}();

angular.module('bicker_router').factory('PendingViewCounter', ["$rootScope", function ($rootScope) {
  'ngInject';

  return new PendingViewCounter($rootScope);
}]);

var WatchableList = function () {
  function WatchableList(ObjectHelper, WatcherFactory, list) {
    _classCallCheck(this, WatchableList);

    this.ObjectHelper = ObjectHelper;
    this.WatcherFactory = WatcherFactory;

    this.list = list;
    this.watchers = [];
  }

  _createClass(WatchableList, [{
    key: 'get',
    value: function get(path) {
      return this.ObjectHelper.get(this.list, path);
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.list;
    }
  }, {
    key: 'getSubset',
    value: function getSubset(paths) {
      return _.zipObject(paths, _.map(paths, this.get.bind(this)));
    }
  }, {
    key: 'set',
    value: function set(path, value) {
      this.ObjectHelper.set(this.list, path, value);
      this._notifyWatchers(path, value);
    }
  }, {
    key: 'unset',
    value: function unset(paths) {
      var _this = this;

      if (!(paths instanceof Array)) {
        paths = [paths];
      }

      _(paths).each(function (path) {
        _this.ObjectHelper.unset(_this.list, path);
        _this._notifyWatchers(path, undefined);
      });
    }
  }, {
    key: 'watch',
    value: function watch(paths, handler) {
      var _this2 = this;

      if (!(paths instanceof Array)) {
        paths = [paths];
      }

      _(paths).each(function (path) {
        _this2.watchers.push(_this2.WatcherFactory.create(path, handler, _this2.get(path)));
      });
    }
  }, {
    key: 'removeWatcher',
    value: function removeWatcher(watcher) {
      if (this.watchers.length === 0) {
        return;
      }
      var newWatchers = [];

      _.each(this.watchers, function (thisWatcher) {
        if (thisWatcher.handler !== watcher) {
          newWatchers.push(thisWatcher);
        }
      });

      return this.watchers = newWatchers;
    }
  }, {
    key: '_notifyWatchers',
    value: function _notifyWatchers(changedPath, newValue) {
      var _this3 = this;

      _.each(this.watchers, function (watcher) {
        if (watcher.shouldNotify(changedPath, newValue)) {
          var newValueAtWatchedPath = _this3.ObjectHelper.get(_this3.list, watcher.watchPath);
          watcher.notify(changedPath, newValueAtWatchedPath);
        }
      });
    }
  }]);

  return WatchableList;
}();

var WatchableListFactory = function () {
  function WatchableListFactory(ObjectHelper, WatcherFactory) {
    _classCallCheck(this, WatchableListFactory);

    this.ObjectHelper = ObjectHelper;
    this.WatcherFactory = WatcherFactory;
  }

  _createClass(WatchableListFactory, [{
    key: 'create',
    value: function create() {
      var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new WatchableList(this.ObjectHelper, this.WatcherFactory, list);
    }
  }]);

  return WatchableListFactory;
}();

angular.module('bicker_router').factory('WatchableListFactory', ["ObjectHelper", "WatcherFactory", function (ObjectHelper, WatcherFactory) {
  'ngInject';

  return new WatchableListFactory(ObjectHelper, WatcherFactory);
}]);

var Watcher = function () {
  function Watcher(watchPath, handler) {
    var initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    _classCallCheck(this, Watcher);

    this.watchPath = watchPath;
    this.handler = handler;
    this.currentValue = _.cloneDeep(initialValue);
  }

  _createClass(Watcher, [{
    key: '_tokenizePath',
    value: function _tokenizePath(path) {
      return path.split('.');
    }
  }, {
    key: 'shouldNotify',
    value: function shouldNotify(changedPath, newValue) {
      // NB short circuit logic in the simple case
      if (this.watchPath === changedPath) {
        return !angular.equals(this.currentValue, newValue);
      }

      var watch = {
        path: this.watchPath,
        tokens: this._tokenizePath(this.watchPath),
        value: this.currentValue
      };

      var change = {
        path: changedPath,
        tokens: this._tokenizePath(changedPath),
        value: newValue
      };

      var minimumLenth = Math.min(change.tokens.length, watch.tokens.length);
      for (var tokenIndex = 0; tokenIndex < minimumLenth; tokenIndex++) {
        if (watch.tokens[tokenIndex] !== change.tokens[tokenIndex]) {
          return false;
        }
      }

      // NB if we get here then all common tokens match

      var changePathIsDescendant = change.tokens.length > watch.tokens.length;

      if (changePathIsDescendant) {
        var relativePath = change.tokens.slice(watch.tokens.length).join('.');
        var currentValueAtChangedPath = _.get(watch.value, relativePath);
        return !angular.equals(currentValueAtChangedPath, change.value);
      } else {
        var _relativePath = watch.tokens.slice(change.tokens.length).join('.');
        var newValueAtWatchPath = _.get(change.value, _relativePath);
        return !angular.equals(watch.value, newValueAtWatchPath);
      }
    }
  }, {
    key: 'notify',
    value: function notify(changedPath, newValue) {
      this.handler(changedPath, newValue, this.currentValue);
      this.currentValue = _.cloneDeep(newValue);
    }
  }]);

  return Watcher;
}();

var WatcherFactory = function () {
  function WatcherFactory() {
    _classCallCheck(this, WatcherFactory);
  }

  _createClass(WatcherFactory, [{
    key: 'create',
    value: function create(watchPath, handler) {
      var initialValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      return new Watcher(watchPath, handler, initialValue);
    }
  }]);

  return WatcherFactory;
}();

angular.module('bicker_router').factory('WatcherFactory', function () {
  return new WatcherFactory();
});

angular.module('bicker_router').provider('Route', ["ObjectHelper", function (ObjectHelper) {
  "ngInject";

  var tokens = {};
  var urlWriters = [];
  var urls = [];
  var persistentStates = [];
  var ready = false;
  var types = {};
  var html5Mode = false;

  var provider = {
    registerType: function registerType(name, config) {
      types[name] = config;
      types[name].regex = new RegExp(types[name].regex.source, 'i');
      return _.extend({ and: this.registerType }, this);
    },
    registerUrlToken: function registerUrlToken(name, config) {
      tokens[name] = _.extend({ name: name }, config);
      return _.extend({ and: this.registerUrlToken }, this);
    },
    registerUrlWriter: function registerUrlWriter(name, fn) {
      urlWriters[name] = fn;
      return _.extend({ and: this.registerUrlWriter }, this);
    },
    registerUrl: function registerUrl(pattern) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var urlData = {
        compiledUrl: this._compileUrlPattern(pattern, config),
        pattern: pattern
      };

      urls.push(_.extend(urlData, config));
      return _.extend({ and: this.registerUrl }, this);
    },
    setPersistentStates: function setPersistentStates() {
      for (var _len2 = arguments.length, stateList = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        stateList[_key3] = arguments[_key3];
      }

      _.forEach(stateList, function (state) {
        if (!persistentStates.includes(state)) {
          persistentStates.push(state);
        }
      });
    },
    setHtml5Mode: function setHtml5Mode(mode) {
      html5Mode = mode;
    },
    _compileUrlPattern: function _compileUrlPattern(urlPattern, config) {
      var match = void 0;
      urlPattern = this._escapeRegexSpecialCharacters(urlPattern);
      urlPattern = this._ensureOptionalTrailingSlash(urlPattern);

      var tokenRegex = /\{([A-Za-z\._0-9]+)\}/g;
      var urlRegex = urlPattern;

      if (!config.partialMatch) {
        urlRegex = '^' + urlRegex + '$';
      }

      var tokenList = [];

      while ((match = tokenRegex.exec(urlPattern)) !== null) {
        var token = tokens[match[1]];
        tokenList.push(token);
        urlRegex = urlRegex.replace(match[0], '(' + types[token.type].regex.source + ')');
      }

      urlRegex.replace('.', '\\.');

      return {
        regex: new RegExp(urlRegex, 'i'),
        tokens: tokenList
      };
    },
    _ensureOptionalTrailingSlash: function _ensureOptionalTrailingSlash(str) {
      if (str.match(/\/$/)) {
        return str.replace(/\/$/, '/?');
      }
      return str + '/?';
    },
    _escapeRegexSpecialCharacters: function _escapeRegexSpecialCharacters(str) {
      return str.replace(/[\-\[\]\/\(\)\*\+\?\\\^\$\|]/g, "\\$&");
    },
    $get: ["$location", "$injector", "$q", function $get($location, $injector, $q) {
      'ngInject';

      // When getting a new instance of the service (only done once), we need to iterate over the urlWriters and turn
      // them into methods that invoke the REAL urlWriter, but providing dependency injection to it, while also
      // giving it the data that the callee passes in.

      // The reason we have to do this here is because we don't have access to the $injector back in the routeProvider.

      _.forIn(urlWriters, function (writer, writerName) {
        return urlWriters[writerName] = function (data) {
          if (!data) {
            data = {};
          }
          var locals = { UrlData: data };
          return $injector.invoke(writer, {}, locals);
        };
      });

      var flashStates = [];

      var service = {
        readyDeferred: $q.defer(),

        match: function match(urlToMatch) {
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = Array.from(urls)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var url = _step7.value;

              var match = void 0;
              if ((match = url.compiledUrl.regex.exec(urlToMatch)) !== null) {
                return { url: url, regexMatch: match };
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }

          return null;
        },
        extractData: function extractData(match) {
          var searchData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

          var defaults = this.extractDefaultData(match);
          var path = this.extractPathData(match);
          searchData = this.extractSearchData(searchData);
          return ObjectHelper.default(searchData, path, defaults);
        },
        extractSearchData: function extractSearchData(searchData) {
          if (!searchData) {
            searchData = $location.search();
          }
          var data = _.clone(searchData);
          var newData = {};

          _.forEach(data, function (value, key) {
            var targetKey = _.findKey(tokens, { searchAlias: key });
            if (!targetKey) {
              targetKey = key;
            }

            var tokenTypeName = tokens[targetKey] ? _.get(tokens[targetKey], 'type') : undefined;
            if (!tokens[targetKey] || types[tokenTypeName].regex.test(value)) {

              var tokenType = tokens[targetKey] ? tokens[targetKey].type : undefined;
              var typeTokenType = tokenType ? types[tokenType] : undefined;
              var tokenTypeParsed = typeTokenType ? typeTokenType.parser : undefined;

              if (tokenTypeParsed) {
                value = $injector.invoke(tokenTypeParsed, null, { token: value });
              }

              var tokenTargetKeyStatePath = tokens[targetKey] ? tokens[targetKey].statePath : undefined;
              var dataKey = tokenTargetKeyStatePath || targetKey;

              ObjectHelper.set(newData, dataKey, value);
            }
          });

          return newData;
        },
        extractDefaultData: function extractDefaultData(match) {
          var data = {};

          _.forEach(match.url.state, function (value, key) {
            ObjectHelper.set(data, key, (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? _.cloneDeep(value) : value);
          });

          return data;
        },
        extractPathData: function extractPathData(match) {
          var data = {};
          var pathTokens = match.url.compiledUrl.tokens;

          if (pathTokens.length === 0) {
            return {};
          }

          for (var n = 0, end = pathTokens.length - 1, asc = 0 <= end; asc ? n <= end : n >= end; asc ? n++ : n--) {
            var token = match.url.compiledUrl.tokens[n];
            var value = match.regexMatch[n + 1];

            if (types[token.type].parser) {
              value = $injector.invoke(types[token.type].parser, null, { token: value });
            }

            ObjectHelper.set(data, token.statePath || token.name, value);
          }

          return data;
        },
        getUrlWriters: function getUrlWriters() {
          return urlWriters;
        },
        getUrlWriter: function getUrlWriter(name) {
          return urlWriters[name];
        },
        invokeUrlWriter: function invokeUrlWriter(name) {
          var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          return urlWriters[name](data);
        },
        go: function go(name) {
          var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          return $location.url(this.invokeUrlWriter(name, data));
        },
        getPersistentStates: function getPersistentStates() {
          return persistentStates;
        },
        resetFlashStates: function resetFlashStates() {
          flashStates = [];
        },
        addFlashStates: function addFlashStates() {
          for (var _len3 = arguments.length, newStates = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
            newStates[_key4] = arguments[_key4];
          }

          flashStates = flashStates.concat(newStates);
        },
        getFlashStates: function getFlashStates() {
          return flashStates;
        },
        setReady: function setReady(ready) {
          if (!ready) {
            this.readyDeferred = $q.defer();
          } else {
            this.readyDeferred.resolve();
          }
          return ready;
        },
        isReady: function isReady() {
          return ready;
        },
        isHtml5ModeEnabled: function isHtml5ModeEnabled() {
          return html5Mode;
        },
        whenReady: function whenReady() {
          return this.readyDeferred.promise;
        }
      };

      return service;
    }]
  };

  provider.registerType('numeric', { regex: /\d+/, parser: ['token', function (token) {
      return parseInt(token);
    }] });
  provider.registerType('alpha', { regex: /[a-zA-Z]+/ });
  provider.registerType('any', { regex: /.+/ });
  provider.registerType('list', { regex: /.+/, parser: ['token', function (token) {
      return token.split(',');
    }] });

  return provider;
}]);

var StateProvider = function () {
  function StateProvider() {
    _classCallCheck(this, StateProvider);
  }

  _createClass(StateProvider, [{
    key: '$get',
    value: ["WatchableListFactory", function $get(WatchableListFactory) {
      'ngInject';

      return WatchableListFactory.create();
    }]
  }]);

  return StateProvider;
}();

angular.module('bicker_router').provider('State', new StateProvider());

angular.module('bicker_router').provider('ViewBindings', function () {
  var views = [];

  var View = function () {
    function View(name, bindings) {
      _classCallCheck(this, View);

      this.name = name;
      this.bindings = bindings;
      if (!(this.bindings instanceof Array)) {
        this.bindings = [this.bindings];
      }
    }

    _createClass(View, [{
      key: 'getBindings',
      value: function getBindings() {
        return this.bindings;
      }
    }]);

    return View;
  }();

  return {
    bind: function bind(name, config) {

      function applyCommonRequiredState(bindings, commonRequiredState) {
        var result = [];
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = Array.from(newBindings)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var binding = _step8.value;

            if (!(binding.requiredState instanceof Array)) {
              binding.requiredState = [binding.requiredState];
            }
            result.push(binding.requiredState = binding.requiredState.concat(commonRequiredState));
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        return result;
      }

      function applyCommonResolve(bindings, commonResolve) {
        var result = [];
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = Array.from(newBindings)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var binding = _step9.value;

            if (!('resolve' in binding)) {
              binding.resolve = {};
            }
            result.push(_.defaults(binding.resolve, commonResolve));
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }

        return result;
      }

      function applyCommonFields(newBindings) {
        var basicCommonFields = [{ name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl' }, { name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent' }, { name: 'commonErrorComponent', overrideField: 'errorComponent' }, { name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl' }];

        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
          for (var _iterator10 = Array.from(basicCommonFields)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var commonField = _step10.value;

            if (commonField.name in config) {
              defaultBindingField(newBindings, commonField.overrideField, config[commonField.name]);
            }
          }
        } catch (err) {
          _didIteratorError10 = true;
          _iteratorError10 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion10 && _iterator10.return) {
              _iterator10.return();
            }
          } finally {
            if (_didIteratorError10) {
              throw _iteratorError10;
            }
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
        var result = [];
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = Array.from(newBindings)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var binding = _step11.value;

            var item = void 0;
            if (!(fieldName in binding)) {
              item = binding[fieldName] = defaultValue;
            }
            result.push(item);
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        return result;
      }

      var newBindings = [];
      if ('bindings' in config) {
        newBindings = config['bindings'];
      } else {
        newBindings = config instanceof Array ? config : [config];
      }

      if (!(newBindings.length > 0)) {
        throw new Error('Invalid call to ViewBindingsProvider.bind for name \'' + name + '\'');
      }

      applyCommonFields(newBindings);
      return views[name] = new View(name, newBindings);
    },
    $get: function $get() {
      return {
        getView: function getView(view) {
          return views[view];
        }
      };
    }
  };
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWlCLENBQWhDLEFBQWdDLEFBQUMsY0FBakMsQUFBK0Msd0ZBQUksVUFBQSxBQUFVLE9BQVYsQUFBaUIsT0FBakIsQUFBd0IsV0FBeEIsQUFBbUMsWUFBbkMsQUFBK0MsY0FBL0MsQUFBNkQsb0JBQW9CLEFBQ2xJO0FBRUE7O01BQUksU0FBSixBQUFhLEFBQ2I7YUFBQSxBQUFXLElBQVgsQUFBZSx3QkFBd0IsWUFBWSxBQUNqRDtRQUFJLE1BQUosQUFBSSxBQUFNLFdBQVcsQUFDbkI7WUFBQSxBQUFNLFNBQU4sQUFBZSxBQUNoQjtBQUNGO0FBSkQsQUFNQTs7YUFBQSxBQUFXLElBQVgsQUFBZSwwQkFBMEIsVUFBQSxBQUFVLEdBQVYsQUFBYSxRQUFRLEFBQzVEO0FBQ0E7UUFBSSxZQUFKLEFBQ0E7UUFBSSxXQUFKLEFBQWUsUUFBUSxBQUNyQjtBQUNEO0FBRUQ7O2FBQUEsQUFBUyxBQUVUOzt1QkFBQSxBQUFtQixBQUNuQjtRQUFNLFFBQVEsTUFBQSxBQUFNLE1BQU0sVUFBMUIsQUFBYyxBQUFZLEFBQVUsQUFFcEM7O1FBQUksQ0FBSixBQUFLLE9BQU8sQUFDVjthQUFBLEFBQU8sQUFDUjtBQUZELFdBRU8sQUFDTDthQUFPLE1BQUEsQUFBTSxZQUFiLEFBQU8sQUFBa0IsQUFDMUI7QUFFRDs7UUFBSSxnQkFBZ0IsYUFBQSxBQUFhLE1BQU0sTUFBbkIsQUFBeUIsTUFBN0MsQUFBb0IsQUFBK0IsQUFDbkQ7b0JBQWdCLEVBQUEsQUFBRSxXQUFGLEFBQWEsZUFBZSxNQUFBLEFBQU0sc0JBQU4sQUFBNEIsT0FBTyxNQUEvRSxBQUFnQixBQUE0QixBQUFtQyxBQUFNLEFBRXJGOztRQUFNLFlBQVks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LEVBQUUsYUFBTixBQUFJLEFBQWUsVUFBVSxBQUMzQjtxQkFBTyxRQUFBLEFBQVEsYUFBZixBQUE0QixBQUM3QjtBQUNEO21CQUFBLEFBQU8sS0FBUCxBQUFZLEFBQ2I7QUFSNkQ7c0JBQUE7Z0NBQUE7NkJBQUE7a0JBQUE7Y0FBQTtvRUFBQTswQkFBQTtBQUFBO29CQUFBO3FDQUFBO29CQUFBO0FBQUE7QUFBQTtBQVM5RDs7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7VUFBSSxjQUFKLEFBQWtCLEFBQ2xCO1VBQUksY0FBSixBQUFrQixRQUFRLEFBQ3hCO3NCQUFjLE9BQWQsQUFBYyxBQUFPLEFBQ3RCO0FBRkQsYUFFTyxBQUNMO3NCQUFlLGtCQUFELEFBQW1CLFFBQW5CLEFBQTRCLFNBQVMsQ0FBbkQsQUFBbUQsQUFBQyxBQUNyRDtBQUVEOztVQUFJLEVBQUUsWUFBQSxBQUFZLFNBQWxCLEFBQUksQUFBdUIsSUFBSSxBQUM3QjtjQUFNLElBQUEsQUFBSSxnRUFBSixBQUFpRSxPQUF2RSxBQUNEO0FBRUQ7O3dCQUFBLEFBQWtCLEFBQ2xCO2FBQU8sTUFBQSxBQUFNLFFBQVEsSUFBQSxBQUFJLEtBQUosQUFBUyxNQUE5QixBQUFxQixBQUFlLEFBQ3JDO0FBMUVJLEFBNEVMO0FBNUVLLDBCQTRFRSxBQUNMOztBQUFPLGtDQUFBLEFBQ0csTUFBTSxBQUNaO2lCQUFPLE1BQVAsQUFBTyxBQUFNLEFBQ2Q7QUFISCxBQUFPLEFBS1I7QUFMUSxBQUNMO0FBOUVOLEFBQU8sQUFvRlI7QUFwRlEsQUFFTDtBQW5CSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJhbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicsIFsnbmdBbmltYXRlJ10pLnJ1bihmdW5jdGlvbiAoU3RhdGUsIFJvdXRlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE9iamVjdEhlbHBlciwgUGVuZGluZ1ZpZXdDb3VudGVyKSB7XG4gIFwibmdJbmplY3RcIjtcblxuICBsZXQgb2xkVXJsID0gdW5kZWZpbmVkO1xuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJvdXRlLmlzUmVhZHkoKSkge1xuICAgICAgUm91dGUuc2V0UmVhZHkoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZSwgbmV3VXJsKSB7XG4gICAgLy8gV29yay1hcm91bmQgZm9yIEFuZ3VsYXJKUyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2lzc3Vlcy84MzY4XG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKG5ld1VybCA9PT0gb2xkVXJsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2xkVXJsID0gbmV3VXJsO1xuXG4gICAgUGVuZGluZ1ZpZXdDb3VudGVyLnJlc2V0KCk7XG4gICAgY29uc3QgbWF0Y2ggPSBSb3V0ZS5tYXRjaCgkbG9jYXRpb24ucGF0aCgpKTtcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IFJvdXRlLmV4dHJhY3REYXRhKG1hdGNoKTtcbiAgICB9XG5cbiAgICBsZXQgZmllbGRzVG9VbnNldCA9IE9iamVjdEhlbHBlci5ub3RJbihTdGF0ZS5saXN0LCBkYXRhKTtcbiAgICBmaWVsZHNUb1Vuc2V0ID0gXy5kaWZmZXJlbmNlKGZpZWxkc1RvVW5zZXQsIFJvdXRlLmdldFBlcnNpc3RlbnRTdGF0ZXMoKS5jb25jYXQoUm91dGUuZ2V0Rmxhc2hTdGF0ZXMoKSkpO1xuXG4gICAgY29uc3QgZXZlbnREYXRhID0ge3Vuc2V0dGluZzogZmllbGRzVG9VbnNldCwgc2V0dGluZzogZGF0YX07XG5cbiAgICAkcm9vdFNjb3BlLiRlbWl0KCdiaWNrZXJfcm91dGVyLmJlZm9yZVN0YXRlQ2hhbmdlJywgZXZlbnREYXRhKTtcblxuICAgIGlmICgoZXZlbnREYXRhLnVuc2V0dGluZykubGVuZ3RoICE9PSAwKSB7XG4gICAgICBTdGF0ZS51bnNldChldmVudERhdGEudW5zZXR0aW5nKTtcbiAgICB9XG5cbiAgICBfLmZvckVhY2goZXZlbnREYXRhLnNldHRpbmcsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBTdGF0ZS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBSb3V0ZS5yZXNldEZsYXNoU3RhdGVzKCk7XG4gICAgUm91dGUuc2V0UmVhZHkodHJ1ZSk7XG4gIH0pO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ09iamVjdEhlbHBlcicsIHtcbiAgZ2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV07XG4gIH0sXG5cbiAgc2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBpZiAocGFyZW50W3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFyZW50W3NlZ21lbnRdID0ge307XG4gICAgICB9XG5cbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV0gPSB2YWx1ZTtcbiAgfSxcblxuICB1bnNldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG5cbiAgICBpZiAocGFyZW50W2tleV0gPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBkZWxldGUgcGFyZW50W2tleV07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgLy8gUmVjdXJzaXZlbHkgcmV0dXJuIHRoZSBwcm9wZXJ0aWVzIGluIGEgdGhhdCBhcmVuJ3QgaW4gYlxuICBub3RJbihhLCBiLCBwcmVmaXggPSAnJykge1xuICAgIGxldCBub3RJbiA9IFtdO1xuICAgIHByZWZpeCA9IHByZWZpeC5sZW5ndGggPiAwID8gYCR7cHJlZml4fS5gIDogJyc7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKE9iamVjdC5rZXlzKGEpKSkge1xuICAgICAgY29uc3QgdGhpc1BhdGggPSBgJHtwcmVmaXh9JHtrZXl9YDtcblxuICAgICAgaWYgKGJba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vdEluLnB1c2godGhpc1BhdGgpO1xuXG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgYVtrZXldID09PSAnb2JqZWN0JykgJiYgKCEoYVtrZXldIGluc3RhbmNlb2YgQXJyYXkpKSkge1xuICAgICAgICBub3RJbiA9IG5vdEluLmNvbmNhdCh0aGlzLm5vdEluKGFba2V5XSwgYltrZXldLCB0aGlzUGF0aCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub3RJbjtcbiAgfSxcblxuICBkZWZhdWx0KG92ZXJyaWRlcywgLi4uZGVmYXVsdFNldHMpIHtcbiAgICBsZXQgZGVmYXVsdFNldCwgdmFsdWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBpZiAoZGVmYXVsdFNldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBkZWZhdWx0U2V0ID0gZGVmYXVsdFNldHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRTZXQgPSB0aGlzLmRlZmF1bHQoLi4uQXJyYXkuZnJvbShkZWZhdWx0U2V0cyB8fCBbXSkpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRTZXQpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFNldFtrZXldO1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiBvdmVycmlkZXNba2V5XSA9PT0gXCJvYmplY3RcIikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmRlZmF1bHQob3ZlcnJpZGVzW2tleV0sIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3ZlcnJpZGVzKSB7XG4gICAgICB2YWx1ZSA9IG92ZXJyaWRlc1trZXldO1xuICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSB8fCB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxuXG5jbGFzcyByb3V0ZUhyZWZEaXJlY3RpdmUge1xuICBjb25zdHJ1Y3RvcihSb3V0ZSwgJGxvY2F0aW9uLCAkdGltZW91dCkge1xuXG4gICAgdGhpcy5yZXN0cmljdCA9ICdBJztcbiAgICB0aGlzLnNjb3BlID0gdHJ1ZTtcblxuICAgIHRoaXMubGluayA9IChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykgPT4ge1xuICAgICAgaWYgKGlBdHRycy5pZ25vcmVIcmVmID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaUVsZW1lbnQuY2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBsZXQgdXJsID0gaUVsZW1lbnQuYXR0cignaHJlZicpO1xuXG4gICAgICAgICAgaWYgKCFSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL14jLywgJycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiAkbG9jYXRpb24udXJsKHVybCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2JqZWN0ID0gUm91dGUuZ2V0VXJsV3JpdGVycygpO1xuICAgICAgZm9yIChjb25zdCB3cml0ZXJOYW1lIGluIG9iamVjdCkge1xuICAgICAgICBjb25zdCB3cml0ZXIgPSBvYmplY3Rbd3JpdGVyTmFtZV07XG4gICAgICAgIHNjb3BlW2Ake3dyaXRlck5hbWV9VXJsV3JpdGVyYF0gPSB3cml0ZXI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzY29wZS4kd2F0Y2goaUF0dHJzLnJvdXRlSHJlZiwgKG5ld1VybCkgPT4ge1xuICAgICAgICBsZXQgdXJsO1xuICAgICAgICBpZiAoUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICB1cmwgPSBuZXdVcmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsID0gYCMke25ld1VybH1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpRWxlbWVudC5hdHRyKCdocmVmJywgdXJsKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlSHJlZicsIChSb3V0ZSwgJGxvY2F0aW9uLCAkdGltZW91dCkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IHJvdXRlSHJlZkRpcmVjdGl2ZShSb3V0ZSwgJGxvY2F0aW9uLCAkdGltZW91dCk7XG59KTtcblxuLy8gQFRPRE8gbm9uZSBvZiB0aGUgYW5pbWF0aW9uIGNvZGUgaW4gdGhpcyBkaXJlY3RpdmUgaGFzIGJlZW4gdGVzdGVkLiBOb3Qgc3VyZSBpZiBpdCBjYW4gYmUgYXQgdGhpcyBzdGFnZSBUaGlzIG5lZWRzIGZ1cnRoZXIgaW52ZXN0aWdhdGlvbi5cbi8vIEBUT0RPIHRoaXMgY29kZSBkb2VzIHRvbyBtdWNoLCBpdCBzaG91bGQgYmUgcmVmYWN0b3JlZC5cblxuY2xhc3Mgcm91dGVWaWV3RGlyZWN0aXZlIHtcbiAgY29uc3RydWN0b3IoJGxvZywgJGNvbXBpbGUsICRjb250cm9sbGVyLCBWaWV3QmluZGluZ3MsICRxLCBTdGF0ZSwgJHJvb3RTY29wZSwgJGFuaW1hdGUsICR0aW1lb3V0LCAkaW5qZWN0b3IsIFBlbmRpbmdWaWV3Q291bnRlciwgJHRlbXBsYXRlUmVxdWVzdCwgUm91dGUpIHtcbiAgICB0aGlzLnJlc3RyaWN0ID0gJ0UnO1xuICAgIHRoaXMuc2NvcGUgPSBmYWxzZTtcbiAgICB0aGlzLnJlcGxhY2UgPSB0cnVlO1xuICAgIHRoaXMudGVtcGxhdGUgPSAnPGRpdj48L2Rpdj4nO1xuXG4gICAgdGhpcy5saW5rID0gKHZpZXdEaXJlY3RpdmVTY29wZSwgaUVsZW1lbnQsIGlBdHRycykgPT4ge1xuXG4gICAgICBsZXQgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgIGxldCB2aWV3U2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICBjb25zdCB2aWV3ID0gVmlld0JpbmRpbmdzLmdldFZpZXcoaUF0dHJzLm5hbWUpO1xuICAgICAgY29uc3QgYmluZGluZ3MgPSB2aWV3LmdldEJpbmRpbmdzKCk7XG5cbiAgICAgIGlFbGVtZW50LmFkZENsYXNzKCduZy1oaWRlJyk7XG5cbiAgICAgIGxldCBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nID0gYmluZGluZyA9PiBfLmNsb25lRGVlcChTdGF0ZS5nZXRTdWJzZXQoZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyhiaW5kaW5nKSkpO1xuXG4gICAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBmaWVsZCkge1xuICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgZmllbGQgPSAnY29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzb3VyY2UgPSBiaW5kaW5nW2ZpZWxkXSA/ICRpbmplY3Rvci5nZXQoYCR7YmluZGluZ1tmaWVsZF19RGlyZWN0aXZlYClbMF0gOiBiaW5kaW5nO1xuICAgICAgICByZXR1cm4gXy5kZWZhdWx0cyhfLnBpY2soc291cmNlLCBbJ2NvbnRyb2xsZXInLCAndGVtcGxhdGVVcmwnLCAnY29udHJvbGxlckFzJ10pLCB7Y29udHJvbGxlckFzOiAnJGN0cmwnfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW107XG5cbiAgICAgICAgZm9yIChsZXQgcmVxdWlyZW1lbnQgb2YgQXJyYXkuZnJvbShyZXF1aXJlZFN0YXRlKSkge1xuICAgICAgICAgIGxldCBuZWdhdGVSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoJyEnID09PSByZXF1aXJlbWVudC5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIHJlcXVpcmVtZW50ID0gcmVxdWlyZW1lbnQuc2xpY2UoMSk7XG4gICAgICAgICAgICBuZWdhdGVSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBlbGVtZW50ID0gU3RhdGUuZ2V0KHJlcXVpcmVtZW50KTtcblxuICAgICAgICAgIC8vIFJldHVybiBmYWxzZSBpZiBlbGVtZW50IGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGlmICgoZWxlbWVudCA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPbmx5IGNoZWNrIHZhbHVlIG9mIGVsZW1lbnQgaWYgaXQgaXMgZGVmaW5lZFxuICAgICAgICAgIGlmIChuZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSAhZWxlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpbmRpbmcuY2FuQWN0aXZhdGUpIHtcbiAgICAgICAgICBpZiAoISRpbmplY3Rvci5pbnZva2UoYmluZGluZy5jYW5BY3RpdmF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWFuYWdlVmlldyhlbGVtZW50LCBiaW5kaW5ncykge1xuICAgICAgICBjb25zdCBtYXRjaGluZ0JpbmRpbmcgPSBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpO1xuXG4gICAgICAgIGlmICghbWF0Y2hpbmdCaW5kaW5nKSB7XG4gICAgICAgICAgaWYgKHZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveVZpZXcoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nKG1hdGNoaW5nQmluZGluZyk7XG4gICAgICAgIGlmICgobWF0Y2hpbmdCaW5kaW5nID09PSBwcmV2aW91c0JpbmRpbmcpICYmIGFuZ3VsYXIuZXF1YWxzKHByZXZpb3VzQm91bmRTdGF0ZSwgbmV3U3RhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gbWF0Y2hpbmdCaW5kaW5nO1xuICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgICAgICBQZW5kaW5nVmlld0NvdW50ZXIuaW5jcmVhc2UoKTtcblxuICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZykudGhlbihmdW5jdGlvbiAoaGFzUmVzb2x2aW5nVGVtcGxhdGUpIHtcbiAgICAgICAgICAvLyBAVE9ETzogTWFnaWMgbnVtYmVyXG4gICAgICAgICAgY29uc3QgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24gPSBoYXNSZXNvbHZpbmdUZW1wbGF0ZSA/IDMwMCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmICghdmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkYW5pbWF0ZS5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykge1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShiaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZXN0cm95VmlldyhlbGVtZW50KSB7XG4gICAgICAgIGlmICh2aWV3Q3JlYXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgZWxlbWVudC5jaGlsZHJlbigpLmVxKDApLnJlbW92ZSgpO1xuICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY3JlYXRlVmlldyhlbGVtZW50LCBiaW5kaW5nLCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgY29uc3QgdGltZVN0YXJ0ZWRNYWluVmlldyA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcpO1xuXG4gICAgICAgIGNvbnN0IG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24gPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgIGlmIChnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpICE9PSBiaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmlld0NyZWF0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgY29uc3QgcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPSBEYXRlLm5vdygpIC0gdGltZVN0YXJ0ZWRNYWluVmlldztcblxuICAgICAgICAgIGNvbnN0IGluamVjdE1haW5UZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGdpdmUgdGhlIHZpZXcgdGltZSB0byBwcm9wZXJseSBpbml0aWFsaXNlXG4gICAgICAgICAgICAgIC8vIGJlZm9yZSBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIHRoZSBpbnRpYWxWaWV3c0xvYWRlZCBldmVudFxuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSA9IE1hdGgubWF4KDAsIG1pbmltdW1EZWxheSAtIHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA8IG1pbmltdW1EZWxheSkge1xuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+IGluamVjdE1haW5UZW1wbGF0ZSgpXG4gICAgICAgICAgICAgICwgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0TWFpblRlbXBsYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUmVzb2x1dGlvbkZhaWx1cmUgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJGxvZy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7dGVtcGxhdGU6ICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKSwgZGVwZW5kZW5jaWVzOiByZXNvbHZlKGJpbmRpbmcpfTtcbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uLCBvblJlc29sdXRpb25GYWlsdXJlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsIHx8ICFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICByZXR1cm4gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKSgkcm9vdFNjb3BlLiRuZXcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLnJlc29sdmluZ0Vycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd1Jlc29sdmluZ0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGxldCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChiaW5kaW5nLmVycm9yVGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcuZXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNob3dFcnJvclRlbXBsYXRlID0gKGVsZW1lbnQsIGJpbmRpbmcpID0+IHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdlcnJvclRlbXBsYXRlVXJsJyk7XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsIHRlbXBsYXRlRmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nW3RlbXBsYXRlRmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuICAgICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICAgIGJpbmRpbmdDb21wb25lbnRGaWVsZCA9ICdlcnJvckNvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFiaW5kaW5nW2JpbmRpbmdDb21wb25lbnRGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHtkZXBlbmRlbmNpZXM6IHtlcnJvcn19O1xuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBhcmdzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncykge1xuICAgICAgICBjb25zdCB7ZGVwZW5kZW5jaWVzfSA9IGFyZ3M7XG4gICAgICAgIGNvbnN0IHt0ZW1wbGF0ZX0gPSBhcmdzO1xuXG4gICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQuY29udHJvbGxlcikge1xuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IF8ubWVyZ2UoZGVwZW5kZW5jaWVzLCB7JHNjb3BlOiB2aWV3U2NvcGUsICRlbGVtZW50OiBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCl9KTtcblxuICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSAkY29udHJvbGxlcihjb21wb25lbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgICBsb2NhbHMuJHNjb3BlW2NvbXBvbmVudC5jb250cm9sbGVyQXNdID0gY29udHJvbGxlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc29sdmUgPSBmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe30pO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVuY3lOYW1lIGluIGJpbmRpbmcucmVzb2x2ZSkge1xuICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lGYWN0b3J5ID0gYmluZGluZy5yZXNvbHZlW2RlcGVuZGVuY3lOYW1lXTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJGluamVjdG9yLmludm9rZShkZXBlbmRlbmN5RmFjdG9yeSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJHEucmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyA9IGJpbmRpbmcgPT4gXy51bmlvbihiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW10sIGJpbmRpbmcud2F0Y2hlZFN0YXRlIHx8IFtdKTtcblxuICAgICAgZnVuY3Rpb24gc3RyaXBOZWdhdGlvblByZWZpeChzdHIpIHtcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoMCkgPT09ICchJykge1xuICAgICAgICAgIHJldHVybiBzdHIuc3Vic3RyKDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyA9IHZpZXcgPT4gXy5mbGF0dGVuKF8ubWFwKHZpZXcuZ2V0QmluZGluZ3MoKSwgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZykpO1xuXG4gICAgICBjb25zdCBnZXRGaWVsZHNUb1dhdGNoID0gdmlldyA9PiBfLnVuaXEoXy5tYXAoZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyh2aWV3KSwgc3RyaXBOZWdhdGlvblByZWZpeCkpO1xuXG4gICAgICBjb25zdCBmaWVsZHMgPSBnZXRGaWVsZHNUb1dhdGNoKHZpZXcpO1xuXG4gICAgICByZXR1cm4gUm91dGUud2hlblJlYWR5KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgLy8gVHJ5IHRvIHN0YXJ0IHRoZSBiYWxsIHJvbGxpbmcgaW4gY2FzZSB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyBhbmQgd2UgY2FuIGNyZWF0ZSB0aGUgdmlldyBpbW1lZGlhdGVseVxuICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIERvbid0IGJvdGhlciBwdXR0aW5nIGluIGEgd2F0Y2hlciBpZiB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgZXZlciB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50XG4gICAgICAgIGlmIChmaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdGVXYXRjaGVyID0gZnVuY3Rpb24gKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAodmlld01hbmFnZW1lbnRQZW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBmaW5pc2ggdGhlIGRpZ2VzdCBjeWNsZSBiZWZvcmUgYnVpbGRpbmcgdGhlIHZpZXcsIHdoaWNoIHNob3VsZFxuICAgICAgICAgIC8vIHByZXZlbnQgdXMgZnJvbSByZS1yZW5kZXJpbmcgYSB2aWV3IG11bHRpcGxlIHRpbWVzIGlmIG11bHRpcGxlIHByb3BlcnRpZXMgb2YgdGhlIHNhbWUgc3RhdGUgZGVwZW5kZW5jeVxuICAgICAgICAgIC8vIGdldCBjaGFuZ2VkIHdpdGggcmVwZWF0ZWQgU3RhdGUuc2V0IGNhbGxzXG4gICAgICAgICAgcmV0dXJuICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHJldHVybiB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBTdGF0ZS53YXRjaChmaWVsZHMsIHN0YXRlV2F0Y2hlcik7XG5cbiAgICAgICAgdmlld0RpcmVjdGl2ZVNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiBTdGF0ZS5yZW1vdmVXYXRjaGVyKHN0YXRlV2F0Y2hlcikpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgndmlldycsICgkbG9nLCAkY29tcGlsZSwgJGNvbnRyb2xsZXIsIFZpZXdCaW5kaW5ncywgJHEsIFN0YXRlLCAkcm9vdFNjb3BlLCAkYW5pbWF0ZSwgJHRpbWVvdXQsICRpbmplY3RvciwgUGVuZGluZ1ZpZXdDb3VudGVyLCAkdGVtcGxhdGVSZXF1ZXN0LCBSb3V0ZSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IHJvdXRlVmlld0RpcmVjdGl2ZSgkbG9nLCAkY29tcGlsZSwgJGNvbnRyb2xsZXIsIFZpZXdCaW5kaW5ncywgJHEsIFN0YXRlLCAkcm9vdFNjb3BlLCAkYW5pbWF0ZSwgJHRpbWVvdXQsICRpbmplY3RvciwgUGVuZGluZ1ZpZXdDb3VudGVyLCAkdGVtcGxhdGVSZXF1ZXN0LCBSb3V0ZSk7XG59KTtcblxuY2xhc3MgUGVuZGluZ1ZpZXdDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoJHJvb3RTY29wZSkge1xuICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgfVxuXG4gIGluY3JlYXNlKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50ICs9IDE7XG4gIH1cblxuICBkZWNyZWFzZSgpIHtcbiAgICB0aGlzLmNvdW50ID0gTWF0aC5tYXgoMCwgdGhpcy5jb3VudCAtIDEpO1xuICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuaW5pdGlhbFZpZXdzTG9hZGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5jdXJyZW50Vmlld3NMb2FkZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1BlbmRpbmdWaWV3Q291bnRlcicsICgkcm9vdFNjb3BlKSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgUGVuZGluZ1ZpZXdDb3VudGVyKCRyb290U2NvcGUpO1xufSk7XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3Qge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5LCBsaXN0KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuXG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLndhdGNoZXJzID0gW107XG4gIH1cblxuICBnZXQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgfVxuXG4gIGdldEFsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0O1xuICB9XG5cbiAgZ2V0U3Vic2V0KHBhdGhzKSB7XG4gICAgcmV0dXJuIF8uemlwT2JqZWN0KHBhdGhzLCBfLm1hcChwYXRocywgdGhpcy5nZXQuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIuc2V0KHRoaXMubGlzdCwgcGF0aCwgdmFsdWUpO1xuICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIHVuc2V0KHBhdGhzKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLk9iamVjdEhlbHBlci51bnNldCh0aGlzLmxpc3QsIHBhdGgpO1xuICAgICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdhdGNoKHBhdGhzLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLndhdGNoZXJzLnB1c2godGhpcy5XYXRjaGVyRmFjdG9yeS5jcmVhdGUocGF0aCwgaGFuZGxlciwgdGhpcy5nZXQocGF0aCkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZVdhdGNoZXIod2F0Y2hlcikge1xuICAgIGlmICh0aGlzLndhdGNoZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdXYXRjaGVycyA9IFtdO1xuXG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHRoaXNXYXRjaGVyID0+IHtcbiAgICAgIGlmICh0aGlzV2F0Y2hlci5oYW5kbGVyICE9PSB3YXRjaGVyKSB7XG4gICAgICAgIG5ld1dhdGNoZXJzLnB1c2godGhpc1dhdGNoZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMud2F0Y2hlcnMgPSBuZXdXYXRjaGVycztcbiAgfVxuXG4gIF9ub3RpZnlXYXRjaGVycyhjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgd2F0Y2hlciA9PiB7XG4gICAgICBpZiAod2F0Y2hlci5zaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGggPSB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCB3YXRjaGVyLndhdGNoUGF0aCk7XG4gICAgICAgIHdhdGNoZXIubm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3RGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcbiAgfVxuXG4gIGNyZWF0ZShsaXN0ID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3QodGhpcy5PYmplY3RIZWxwZXIsIHRoaXMuV2F0Y2hlckZhY3RvcnksIGxpc3QpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hhYmxlTGlzdEZhY3RvcnknLCAoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3RGYWN0b3J5KE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpO1xufSk7XG5cbmNsYXNzIFdhdGNoZXIge1xuICBjb25zdHJ1Y3Rvcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHRoaXMud2F0Y2hQYXRoID0gd2F0Y2hQYXRoO1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChpbml0aWFsVmFsdWUpO1xuICB9XG5cbiAgX3Rva2VuaXplUGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKTtcbiAgfVxuXG4gIHNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICAvLyBOQiBzaG9ydCBjaXJjdWl0IGxvZ2ljIGluIHRoZSBzaW1wbGUgY2FzZVxuICAgIGlmICh0aGlzLndhdGNoUGF0aCA9PT0gY2hhbmdlZFBhdGgpIHtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHModGhpcy5jdXJyZW50VmFsdWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXRjaCA9IHtcbiAgICAgIHBhdGg6IHRoaXMud2F0Y2hQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgodGhpcy53YXRjaFBhdGgpLFxuICAgICAgdmFsdWU6IHRoaXMuY3VycmVudFZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IGNoYW5nZSA9IHtcbiAgICAgIHBhdGg6IGNoYW5nZWRQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgoY2hhbmdlZFBhdGgpLFxuICAgICAgdmFsdWU6IG5ld1ZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IG1pbmltdW1MZW50aCA9IE1hdGgubWluKGNoYW5nZS50b2tlbnMubGVuZ3RoLCB3YXRjaC50b2tlbnMubGVuZ3RoKTtcbiAgICBmb3IgKGxldCB0b2tlbkluZGV4ID0gMDsgdG9rZW5JbmRleCA8IG1pbmltdW1MZW50aDsgdG9rZW5JbmRleCsrKSB7XG4gICAgICBpZiAod2F0Y2gudG9rZW5zW3Rva2VuSW5kZXhdICE9PSBjaGFuZ2UudG9rZW5zW3Rva2VuSW5kZXhdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOQiBpZiB3ZSBnZXQgaGVyZSB0aGVuIGFsbCBjb21tb24gdG9rZW5zIG1hdGNoXG5cbiAgICBjb25zdCBjaGFuZ2VQYXRoSXNEZXNjZW5kYW50ID0gY2hhbmdlLnRva2Vucy5sZW5ndGggPiB3YXRjaC50b2tlbnMubGVuZ3RoO1xuXG4gICAgaWYgKGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQpIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGNoYW5nZS50b2tlbnMuc2xpY2Uod2F0Y2gudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCA9IF8uZ2V0KHdhdGNoLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyhjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoLCBjaGFuZ2UudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSB3YXRjaC50b2tlbnMuc2xpY2UoY2hhbmdlLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaFBhdGggPSBfLmdldChjaGFuZ2UudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHdhdGNoLnZhbHVlLCBuZXdWYWx1ZUF0V2F0Y2hQYXRoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5oYW5kbGVyKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgdGhpcy5jdXJyZW50VmFsdWUpO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAobmV3VmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoZXJGYWN0b3J5IHtcbiAgY3JlYXRlKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGVyKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoZXJGYWN0b3J5JywgKCkgPT4ge1xuICByZXR1cm4gbmV3IFdhdGNoZXJGYWN0b3J5KCk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignUm91dGUnLCBmdW5jdGlvbihPYmplY3RIZWxwZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuICBjb25zdCB0b2tlbnMgPSB7fTtcbiAgY29uc3QgdXJsV3JpdGVycyA9IFtdO1xuICBjb25zdCB1cmxzID0gW107XG4gIGNvbnN0IHBlcnNpc3RlbnRTdGF0ZXMgPSBbXTtcbiAgY29uc3QgcmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgdHlwZXMgPSB7fTtcbiAgbGV0IGh0bWw1TW9kZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3ZpZGVyID0ge1xuXG4gICAgcmVnaXN0ZXJUeXBlKG5hbWUsIGNvbmZpZykge1xuICAgICAgdHlwZXNbbmFtZV0gPSBjb25maWc7XG4gICAgICB0eXBlc1tuYW1lXS5yZWdleCA9IG5ldyBSZWdFeHAodHlwZXNbbmFtZV0ucmVnZXguc291cmNlLCAnaScpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVHlwZSB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxUb2tlbihuYW1lLCBjb25maWcpIHtcbiAgICAgIHRva2Vuc1tuYW1lXSA9IF8uZXh0ZW5kKHtuYW1lfSwgY29uZmlnKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFRva2VuIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFdyaXRlcihuYW1lLCBmbikge1xuICAgICAgdXJsV3JpdGVyc1tuYW1lXSA9IGZuO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsV3JpdGVyIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybChwYXR0ZXJuLCBjb25maWcgPSB7fSkge1xuICAgICAgY29uc3QgdXJsRGF0YSA9IHtcbiAgICAgICAgY29tcGlsZWRVcmw6IHRoaXMuX2NvbXBpbGVVcmxQYXR0ZXJuKHBhdHRlcm4sIGNvbmZpZyksXG4gICAgICAgIHBhdHRlcm5cbiAgICAgIH07XG5cbiAgICAgIHVybHMucHVzaChfLmV4dGVuZCh1cmxEYXRhLCBjb25maWcpKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybCB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGVyc2lzdGVudFN0YXRlcyguLi5zdGF0ZUxpc3QpIHtcbiAgICAgIF8uZm9yRWFjaChzdGF0ZUxpc3QsIChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIXBlcnNpc3RlbnRTdGF0ZXMuaW5jbHVkZXMoc3RhdGUpKSB7XG4gICAgICAgICAgcGVyc2lzdGVudFN0YXRlcy5wdXNoKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldEh0bWw1TW9kZShtb2RlKSB7XG4gICAgICBodG1sNU1vZGUgPSBtb2RlO1xuICAgIH0sXG5cbiAgICBfY29tcGlsZVVybFBhdHRlcm4odXJsUGF0dGVybiwgY29uZmlnKSB7XG4gICAgICBsZXQgbWF0Y2g7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyh1cmxQYXR0ZXJuKTtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2godXJsUGF0dGVybik7XG5cbiAgICAgIGNvbnN0IHRva2VuUmVnZXggPSAvXFx7KFtBLVphLXpcXC5fMC05XSspXFx9L2c7XG4gICAgICBsZXQgdXJsUmVnZXggPSB1cmxQYXR0ZXJuO1xuXG4gICAgICBpZiAoIWNvbmZpZy5wYXJ0aWFsTWF0Y2gpIHtcbiAgICAgICAgdXJsUmVnZXggPSBgXiR7dXJsUmVnZXh9JGA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRva2VuTGlzdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKG1hdGNoID0gdG9rZW5SZWdleC5leGVjKHVybFBhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1ttYXRjaFsxXV07XG4gICAgICAgIHRva2VuTGlzdC5wdXNoKHRva2VuKTtcbiAgICAgICAgdXJsUmVnZXggPSB1cmxSZWdleC5yZXBsYWNlKG1hdGNoWzBdLCBgKCR7dHlwZXNbdG9rZW4udHlwZV0ucmVnZXguc291cmNlfSlgKTtcbiAgICAgIH1cblxuICAgICAgdXJsUmVnZXgucmVwbGFjZSgnLicsICdcXFxcLicpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCh1cmxSZWdleCwgJ2knKSxcbiAgICAgICAgdG9rZW5zOiB0b2tlbkxpc3RcbiAgICAgIH07XG4gICAgfSxcblxuICAgIF9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2goc3RyKSB7XG4gICAgICBpZiAoc3RyLm1hdGNoKC9cXC8kLykpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXC8kLywgJy8/Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCR7c3RyfS8/YDtcbiAgICB9LFxuXG4gICAgX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXChcXClcXCpcXCtcXD9cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICB9LFxuXG4gICAgJGdldCgkbG9jYXRpb24sICRpbmplY3RvciwgJHEpIHtcbiAgICAgICduZ0luamVjdCc7XG5cbiAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc2VydmljZSAob25seSBkb25lIG9uY2UpLCB3ZSBuZWVkIHRvIGl0ZXJhdGUgb3ZlciB0aGUgdXJsV3JpdGVycyBhbmQgdHVyblxuICAgICAgLy8gdGhlbSBpbnRvIG1ldGhvZHMgdGhhdCBpbnZva2UgdGhlIFJFQUwgdXJsV3JpdGVyLCBidXQgcHJvdmlkaW5nIGRlcGVuZGVuY3kgaW5qZWN0aW9uIHRvIGl0LCB3aGlsZSBhbHNvXG4gICAgICAvLyBnaXZpbmcgaXQgdGhlIGRhdGEgdGhhdCB0aGUgY2FsbGVlIHBhc3NlcyBpbi5cblxuICAgICAgLy8gVGhlIHJlYXNvbiB3ZSBoYXZlIHRvIGRvIHRoaXMgaGVyZSBpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoZSAkaW5qZWN0b3IgYmFjayBpbiB0aGUgcm91dGVQcm92aWRlci5cblxuICAgICAgXy5mb3JJbih1cmxXcml0ZXJzLCAod3JpdGVyLCB3cml0ZXJOYW1lKSA9PlxuICAgICAgICB1cmxXcml0ZXJzW3dyaXRlck5hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmICghZGF0YSkgeyBkYXRhID0ge307IH1cbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSB7VXJsRGF0YTogZGF0YX07XG4gICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5pbnZva2Uod3JpdGVyLCB7fSwgbG9jYWxzKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgbGV0IGZsYXNoU3RhdGVzID0gW107XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgIHJlYWR5RGVmZXJyZWQ6ICRxLmRlZmVyKCksXG5cbiAgICAgICAgbWF0Y2godXJsVG9NYXRjaCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdXJsIG9mIEFycmF5LmZyb20odXJscykpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSB1cmwuY29tcGlsZWRVcmwucmVnZXguZXhlYyh1cmxUb01hdGNoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHt1cmwsIHJlZ2V4TWF0Y2g6IG1hdGNofTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERhdGEobWF0Y2gsIHNlYXJjaERhdGEgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMuZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKTtcbiAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5leHRyYWN0UGF0aERhdGEobWF0Y2gpO1xuICAgICAgICAgIHNlYXJjaERhdGEgPSB0aGlzLmV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpO1xuICAgICAgICAgIHJldHVybiBPYmplY3RIZWxwZXIuZGVmYXVsdChzZWFyY2hEYXRhLCBwYXRoLCBkZWZhdWx0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSkge1xuICAgICAgICAgIGlmICghc2VhcmNoRGF0YSkgeyBzZWFyY2hEYXRhID0gJGxvY2F0aW9uLnNlYXJjaCgpOyB9XG4gICAgICAgICAgY29uc3QgZGF0YSA9IF8uY2xvbmUoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKGRhdGEsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0S2V5ID0gXy5maW5kS2V5KHRva2VucywgeyBzZWFyY2hBbGlhczoga2V5IH0pO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRLZXkpIHsgdGFyZ2V0S2V5ID0ga2V5OyB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZU5hbWUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IF8uZ2V0KHRva2Vuc1t0YXJnZXRLZXldLCAndHlwZScpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCF0b2tlbnNbdGFyZ2V0S2V5XSB8fCAodHlwZXNbdG9rZW5UeXBlTmFtZV0ucmVnZXgudGVzdCh2YWx1ZSkpKSB7XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS50eXBlIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0eXBlVG9rZW5UeXBlID0gdG9rZW5UeXBlID8gdHlwZXNbdG9rZW5UeXBlXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlUGFyc2VkID0gdHlwZVRva2VuVHlwZSA/IHR5cGVUb2tlblR5cGUucGFyc2VyIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgIGlmICh0b2tlblR5cGVQYXJzZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodG9rZW5UeXBlUGFyc2VkLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblRhcmdldEtleVN0YXRlUGF0aCA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0uc3RhdGVQYXRoIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCBkYXRhS2V5ID0gdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggfHwgdGFyZ2V0S2V5O1xuXG4gICAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQobmV3RGF0YSwgZGF0YUtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKG1hdGNoLnVybC5zdGF0ZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwga2V5LCAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IF8uY2xvbmVEZWVwKHZhbHVlKSA6IHZhbHVlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0UGF0aERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICAgY29uc3QgcGF0aFRva2VucyA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnM7XG5cbiAgICAgICAgICBpZiAocGF0aFRva2Vucy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHt9OyB9XG5cbiAgICAgICAgICBmb3IgKGxldCBuID0gMCwgZW5kID0gcGF0aFRva2Vucy5sZW5ndGgtMSwgYXNjID0gMCA8PSBlbmQ7IGFzYyA/IG4gPD0gZW5kIDogbiA+PSBlbmQ7IGFzYyA/IG4rKyA6IG4tLSkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zW25dO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbWF0Y2gucmVnZXhNYXRjaFtuKzFdO1xuXG4gICAgICAgICAgICBpZiAodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyKSB7IHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIsIG51bGwsIHt0b2tlbjogdmFsdWV9KTsgfVxuXG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsICh0b2tlbi5zdGF0ZVBhdGggfHwgdG9rZW4ubmFtZSksIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXJzKCkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcihuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdvKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiAkbG9jYXRpb24udXJsKHRoaXMuaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRQZXJzaXN0ZW50U3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBwZXJzaXN0ZW50U3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBbXTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRGbGFzaFN0YXRlcyguLi5uZXdTdGF0ZXMpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IGZsYXNoU3RhdGVzLmNvbmNhdChuZXdTdGF0ZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBmbGFzaFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZWFkeShyZWFkeSkge1xuICAgICAgICAgIGlmICghcmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1JlYWR5KCkge1xuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0h0bWw1TW9kZUVuYWJsZWQoKSB7XG4gICAgICAgICAgcmV0dXJuIGh0bWw1TW9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICB3aGVuUmVhZHkoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHlEZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdudW1lcmljJywge3JlZ2V4OiAvXFxkKy8sIHBhcnNlcjogWyd0b2tlbicsIHRva2VuID0+IHBhcnNlSW50KHRva2VuKV19KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbHBoYScsIHtyZWdleDogL1thLXpBLVpdKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbnknLCB7cmVnZXg6IC8uKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdsaXN0Jywge3JlZ2V4OiAvLisvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiB0b2tlbi5zcGxpdCgnLCcpXX0pO1xuXG4gIHJldHVybiBwcm92aWRlcjtcbn0pO1xuXG5jbGFzcyBTdGF0ZVByb3ZpZGVyIHtcbiAgJGdldChXYXRjaGFibGVMaXN0RmFjdG9yeSkge1xuICAgICduZ0luamVjdCc7XG4gICAgcmV0dXJuIFdhdGNoYWJsZUxpc3RGYWN0b3J5LmNyZWF0ZSgpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1N0YXRlJywgbmV3IFN0YXRlUHJvdmlkZXIpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdWaWV3QmluZGluZ3MnLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHZpZXdzID0gW107XG5cbiAgY2xhc3MgVmlldyB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgYmluZGluZ3MpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XG4gICAgICBpZiAoISh0aGlzLmJpbmRpbmdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBbdGhpcy5iaW5kaW5nc107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QmluZGluZ3MoKSB7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuXG4gICAgYmluZChuYW1lLCBjb25maWcpIHtcblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKGJpbmRpbmdzLCBjb21tb25SZXF1aXJlZFN0YXRlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoIShiaW5kaW5nLnJlcXVpcmVkU3RhdGUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IFtiaW5kaW5nLnJlcXVpcmVkU3RhdGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUuY29uY2F0KGNvbW1vblJlcXVpcmVkU3RhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vblJlc29sdmUoYmluZGluZ3MsIGNvbW1vblJlc29sdmUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGlmICghKCdyZXNvbHZlJyBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgYmluZGluZy5yZXNvbHZlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKF8uZGVmYXVsdHMoYmluZGluZy5yZXNvbHZlLCBjb21tb25SZXNvbHZlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgYmFzaWNDb21tb25GaWVsZHMgPSBbXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ0Vycm9yQ29tcG9uZW50Jywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25FcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvclRlbXBsYXRlVXJsJ31cbiAgICAgICAgXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNvbW1vbkZpZWxkIG9mIEFycmF5LmZyb20oYmFzaWNDb21tb25GaWVsZHMpKSB7XG4gICAgICAgICAgaWYgKGNvbW1vbkZpZWxkLm5hbWUgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBkZWZhdWx0QmluZGluZ0ZpZWxkKG5ld0JpbmRpbmdzLCBjb21tb25GaWVsZC5vdmVycmlkZUZpZWxkLCBjb25maWdbY29tbW9uRmllbGQubmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29tbW9uUmVxdWlyZWRTdGF0ZScgaW4gY29uZmlnKSB7XG4gICAgICAgICAgYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlcXVpcmVkU3RhdGUnXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlc29sdmUnIGluIGNvbmZpZykge1xuICAgICAgICAgIHJldHVybiBhcHBseUNvbW1vblJlc29sdmUobmV3QmluZGluZ3MsIGNvbmZpZ1snY29tbW9uUmVzb2x2ZSddKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZWZhdWx0QmluZGluZ0ZpZWxkKGJpbmRpbmdzLCBmaWVsZE5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgICAgaWYgKCEoZmllbGROYW1lIGluIGJpbmRpbmcpKSB7XG4gICAgICAgICAgICBpdGVtID0gYmluZGluZ1tmaWVsZE5hbWVdID0gZGVmYXVsdFZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3QmluZGluZ3MgPSBbXTtcbiAgICAgIGlmICgnYmluZGluZ3MnIGluIGNvbmZpZykge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IGNvbmZpZ1snYmluZGluZ3MnXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0JpbmRpbmdzID0gKGNvbmZpZyBpbnN0YW5jZW9mIEFycmF5KSA/IGNvbmZpZyA6IFtjb25maWddO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShuZXdCaW5kaW5ncy5sZW5ndGggPiAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY2FsbCB0byBWaWV3QmluZGluZ3NQcm92aWRlci5iaW5kIGZvciBuYW1lICcke25hbWV9J2ApO1xuICAgICAgfVxuXG4gICAgICBhcHBseUNvbW1vbkZpZWxkcyhuZXdCaW5kaW5ncyk7XG4gICAgICByZXR1cm4gdmlld3NbbmFtZV0gPSBuZXcgVmlldyhuYW1lLCBuZXdCaW5kaW5ncyk7XG4gICAgfSxcblxuICAgICRnZXQoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXRWaWV3KHZpZXcpIHtcbiAgICAgICAgICByZXR1cm4gdmlld3Nbdmlld107XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
