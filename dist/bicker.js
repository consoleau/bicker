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

    for (var key in eventData.setting) {
      var value = eventData.setting[key];
      State.set(key, value);
    }

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
      for (var _iterator = Array.from(pieces)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
      for (var _iterator2 = Array.from(pieces)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
      for (var _iterator3 = Array.from(pieces)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
  notIn: function notIn(a, b, prefix) {
    if (prefix == null) {
      prefix = '';
    }
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

    for (key in overrides) {
      value = overrides[key];
      result[key] = result[key] || value;
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
      return viewScope.$destroy();
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

      var stateWatcher = function stateWatcher() {
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
      return this._notifyWatchers(path, value);
    }
  }, {
    key: 'unset',
    value: function unset(paths) {
      var _this = this;

      if (!(paths instanceof Array)) {
        paths = [paths];
      }

      return Array.from(paths).map(function (path) {
        return _this.ObjectHelper.unset(_this.list, path), _this._notifyWatchers(path, undefined);
      });
    }
  }, {
    key: 'watch',
    value: function watch(paths, handler) {
      var _this2 = this;

      if (!(paths instanceof Array)) {
        paths = [paths];
      }

      return Array.from(paths).map(function (path) {
        return _this2.watchers.push(_this2.WatcherFactory.create(path, handler, _this2.get(path)));
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
    value: function _notifyWatchers(changedPath) {
      var _this3 = this;

      var result = [];
      _.each(this.watchers, function (watcher) {
        var item = void 0;
        var watchedValue = _this3.ObjectHelper.get(_this3.list, watcher.watchPath);

        if (watcher.shouldNotify(changedPath, watchedValue)) {
          item = watcher.notify(changedPath, watchedValue);
        }
        result.push(item);
      });
      return result;
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
    key: 'shouldNotify',
    value: function shouldNotify(watchedValue) {
      return !angular.equals(this.currentValue, watchedValue);
    }
  }, {
    key: 'notify',
    value: function notify(changedPath, newValue) {
      this.handler(changedPath, newValue, this.currentValue);
      return this.currentValue = _.cloneDeep(newValue);
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
  var urlWriters = {};
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
    registerUrl: function registerUrl(pattern, config) {
      if (config == null) {
        config = {};
      }
      var urlData = {
        compiledUrl: this._compileUrlPattern(pattern, config),
        pattern: pattern
      };

      urls.push(_.extend(urlData, config));
      return _.extend({ and: this.registerUrl }, this);
    },
    setPersistentStates: function setPersistentStates() {
      for (var _len2 = arguments.length, stateList = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        stateList[_key2] = arguments[_key2];
      }

      return function () {
        var result = [];
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = Array.from(stateList)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var state = _step7.value;

            var item = void 0;
            if (!Array.from(persistentStates).includes(state)) {
              item = persistentStates.push(state);
            }
            result.push(item);
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

        return result;
      }();
    },
    setHtml5Mode: function setHtml5Mode(mode) {
      return html5Mode = mode;
    },
    _compileUrlPattern: function _compileUrlPattern(urlPattern, config) {
      var match = void 0;
      var compiledUrl = void 0;
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

      return compiledUrl = {
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
    $get: ["$location", "State", "$injector", "$q", function $get($location, State, $injector, $q) {
      'ngInject';

      // When getting a new instance of the service (only done once), we need to iterate over the urlWriters and turn
      // them into methods that invoke the REAL urlWriter, but providing dependency injection to it, while also
      // giving it the data that the callee passes in.

      // The reason we have to do this here is because we don't have access to the $injector back in the routeProvider.

      _.forIn(urlWriters, function (writer, writerName) {
        return urlWriters[writerName] = function (data) {
          if (data == null) {
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
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = Array.from(urls)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var url = _step8.value;

              var match;
              if ((match = url.compiledUrl.regex.exec(urlToMatch)) !== null) {
                return { url: url, regexMatch: match };
              }
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

          return null;
        },
        extractData: function extractData(match, searchData) {
          if (searchData == null) {
            searchData = undefined;
          }
          var defaults = this.extractDefaultData(match);
          var path = this.extractPathData(match);
          searchData = this.extractSearchData(searchData);
          return ObjectHelper.default(searchData, path, defaults);
        },
        extractSearchData: function extractSearchData(searchData) {
          if (searchData == null) {
            searchData = $location.search();
          }
          var data = _.clone(searchData);
          var newData = {};

          for (var key in data) {
            var value = data[key];
            var targetKey = _.findKey(tokens, { searchAlias: key });
            if (targetKey == null) {
              targetKey = key;
            }

            if (!tokens[targetKey] || __guard__(types[tokens[targetKey] != null ? tokens[targetKey].type : undefined], function (x) {
              return x.regex.test(value);
            })) {

              if (__guard__(types[tokens[targetKey] != null ? tokens[targetKey].type : undefined], function (x1) {
                return x1.parser;
              })) {
                value = $injector.invoke(types[tokens[targetKey].type] != null ? types[tokens[targetKey].type].parser : undefined, null, { token: value });
              }

              var dataKey = (tokens[targetKey] != null ? tokens[targetKey].statePath : undefined) || targetKey;

              ObjectHelper.set(newData, dataKey, value);
            }
          }

          return newData;
        },
        extractDefaultData: function extractDefaultData(match) {
          var data = {};

          for (var key in match.url.state) {
            var value = match.url.state[key];
            ObjectHelper.set(data, key, (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? _.cloneDeep(value) : value);
          }

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
        invokeUrlWriter: function invokeUrlWriter(name, data) {
          if (data == null) {
            data = {};
          }return urlWriters[name](data);
        },
        go: function go(name, data) {
          if (data == null) {
            data = {};
          }return $location.url(this.invokeUrlWriter(name, data));
        },
        getPersistentStates: function getPersistentStates() {
          return persistentStates;
        },
        resetFlashStates: function resetFlashStates() {
          return flashStates = [];
        },
        addFlashStates: function addFlashStates() {
          for (var _len3 = arguments.length, newStates = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            newStates[_key3] = arguments[_key3];
          }

          return flashStates = flashStates.concat(newStates);
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

          return this.ready = ready;
        },
        isReady: function isReady() {
          return this.ready;
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

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

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
  var provider = void 0;
  var views = {};

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

  return provider = {
    bind: function bind(name, config) {

      var applyCommonRequiredState = function applyCommonRequiredState(bindings, commonRequiredState) {
        return function () {
          var result = [];
          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = Array.from(newBindings)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var binding = _step9.value;

              if (!(binding.requiredState instanceof Array)) {
                binding.requiredState = [binding.requiredState];
              }
              result.push(binding.requiredState = binding.requiredState.concat(commonRequiredState));
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
        }();
      };

      var applyCommonResolve = function applyCommonResolve(bindings, commonResolve) {
        return function () {
          var result = [];
          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            for (var _iterator10 = Array.from(newBindings)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              var binding = _step10.value;

              if (!('resolve' in binding)) {
                binding.resolve = {};
              }
              result.push(_.defaults(binding.resolve, commonResolve));
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

          return result;
        }();
      };

      var applyCommonFields = function applyCommonFields(newBindings) {
        var basicCommonFields = [{ name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl' }, { name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent' }, { name: 'commonErrorComponent', overrideField: 'errorComponent' }, { name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl' }];

        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = Array.from(basicCommonFields)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var commonField = _step11.value;

            if (commonField.name in config) {
              defaultBindingField(newBindings, commonField.overrideField, config[commonField.name]);
            }
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

        if ('commonRequiredState' in config) {
          applyCommonRequiredState(newBindings, config['commonRequiredState']);
        }

        if ('commonResolve' in config) {
          return applyCommonResolve(newBindings, config['commonResolve']);
        }
      };

      var defaultBindingField = function defaultBindingField(bindings, fieldName, defaultValue) {
        return function () {
          var result = [];
          var _iteratorNormalCompletion12 = true;
          var _didIteratorError12 = false;
          var _iteratorError12 = undefined;

          try {
            for (var _iterator12 = Array.from(newBindings)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
              var binding = _step12.value;

              var item = void 0;
              if (!(fieldName in binding)) {
                item = binding[fieldName] = defaultValue;
              }
              result.push(item);
            }
          } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion12 && _iterator12.return) {
                _iterator12.return();
              }
            } finally {
              if (_didIteratorError12) {
                throw _iteratorError12;
              }
            }
          }

          return result;
        }();
      };

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWlCLENBQWhDLEFBQWdDLEFBQUMsY0FBakMsQUFBK0Msd0ZBQUksVUFBQSxBQUFTLE9BQVQsQUFBZ0IsT0FBaEIsQUFBdUIsV0FBdkIsQUFBa0MsWUFBbEMsQUFBOEMsY0FBOUMsQUFBNEQsb0JBQW9CLEFBQ2pJO0FBQ0E7O01BQUksU0FBSixBQUFhLEFBQ2I7YUFBQSxBQUFXLElBQVgsQUFBZSx3QkFBd0IsWUFBVyxBQUNoRDtRQUFJLE1BQUosQUFBSSxBQUFNLFdBQVcsQUFDcEI7WUFBQSxBQUFNLFNBQU4sQUFBZSxBQUNmO0FBQ0Y7QUFKRCxBQU1BOzthQUFBLEFBQVcsSUFBWCxBQUFlLDBCQUEwQixVQUFBLEFBQVMsR0FBVCxBQUFZLFFBQVEsQUFDM0Q7QUFDQTtRQUFJLFlBQUosQUFDQTtRQUFJLFdBQUosQUFBZSxRQUFRLEFBQUU7QUFBUztBQUVsQzs7YUFBQSxBQUFTLEFBRVQ7O3VCQUFBLEFBQW1CLEFBQ25CO1FBQUksUUFBUSxNQUFBLEFBQU0sTUFBTSxVQUF4QixBQUFZLEFBQVksQUFBVSxBQUVsQzs7UUFBSSxDQUFKLEFBQUssT0FBTyxBQUNWO2FBQUEsQUFBTyxBQUNSO0FBRkQsV0FFTyxBQUNMO2FBQU8sTUFBQSxBQUFNLFlBQWIsQUFBTyxBQUFrQixBQUMxQjtBQUVEOztRQUFJLGdCQUFnQixhQUFBLEFBQWEsTUFBTSxNQUFuQixBQUF5QixNQUE3QyxBQUFvQixBQUErQixBQUNuRDtvQkFBZ0IsRUFBQSxBQUFFLFdBQUYsQUFBYSxlQUFlLE1BQUEsQUFBTSxzQkFBTixBQUE0QixPQUFPLE1BQS9FLEFBQWdCLEFBQTRCLEFBQW1DLEFBQU0sQUFFckY7O1FBQUksWUFBWSxF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QUNiO0FBUkk7d0JBQUE7a0NBQUE7K0JBQUE7b0JBQUE7Z0JBQUE7c0VBQUE7NEJBQUE7QUFBQTtzQkFBQTt1Q0FBQTtzQkFBQTtBQUFBO0FBQUE7QUFTTDs7aUJBQUEsQUFBTyxBQUNSO0FBWHFCLEFBQ3RCLFNBQUM7QUFETCxBQWNBOztVQUFJLGNBQUosQUFBa0IsQUFDbEI7VUFBSSxjQUFKLEFBQWtCLFFBQVEsQUFDeEI7c0JBQWMsT0FBZCxBQUFjLEFBQU8sQUFDdEI7QUFGRCxhQUVPLEFBQ0w7c0JBQWUsa0JBQUQsQUFBbUIsUUFBbkIsQUFBNEIsU0FBUyxDQUFuRCxBQUFtRCxBQUFDLEFBQ3JEO0FBRUQ7O1VBQUksRUFBRSxZQUFBLEFBQVksU0FBbEIsQUFBSSxBQUF1QixJQUFJLEFBQzdCO2NBQU0sSUFBQSxBQUFJLGdFQUFKLEFBQWlFLE9BQXZFLEFBQ0Q7QUFFRDs7d0JBQUEsQUFBa0IsQUFDbEI7YUFBTyxNQUFBLEFBQU0sUUFBUSxJQUFBLEFBQUksS0FBSixBQUFTLE1BQTlCLEFBQXFCLEFBQWUsQUFDckM7QUFoRmUsQUFrRmhCO0FBbEZnQiwwQkFrRlQsQUFDTDs7QUFBTyxrQ0FBQSxBQUNHLE1BQU0sQUFDWjtpQkFBTyxNQUFQLEFBQU8sQUFBTSxBQUNkO0FBSEgsQUFBTyxBQUtSO0FBTFEsQUFDTDtBQXBGTixBQUFrQixBQTBGbkI7QUExRm1CLEFBRWhCO0FBcEJKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJywgWyduZ0FuaW1hdGUnXSkucnVuKGZ1bmN0aW9uKFN0YXRlLCBSb3V0ZSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCBPYmplY3RIZWxwZXIsIFBlbmRpbmdWaWV3Q291bnRlcikge1xuICBcIm5nSW5qZWN0XCI7XG4gIGxldCBvbGRVcmwgPSB1bmRlZmluZWQ7XG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKCkge1xuICAgIGlmIChSb3V0ZS5pc1JlYWR5KCkpIHtcbiAgICBcdFJvdXRlLnNldFJlYWR5KGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZSwgbmV3VXJsKSB7XG4gICAgLy8gV29yay1hcm91bmQgZm9yIEFuZ3VsYXJKUyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2lzc3Vlcy84MzY4XG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKG5ld1VybCA9PT0gb2xkVXJsKSB7IHJldHVybjsgfVxuXG4gICAgb2xkVXJsID0gbmV3VXJsO1xuXG4gICAgUGVuZGluZ1ZpZXdDb3VudGVyLnJlc2V0KCk7XG4gICAgbGV0IG1hdGNoID0gUm91dGUubWF0Y2goJGxvY2F0aW9uLnBhdGgoKSk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBSb3V0ZS5leHRyYWN0RGF0YShtYXRjaCk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkc1RvVW5zZXQgPSBPYmplY3RIZWxwZXIubm90SW4oU3RhdGUubGlzdCwgZGF0YSk7XG4gICAgZmllbGRzVG9VbnNldCA9IF8uZGlmZmVyZW5jZShmaWVsZHNUb1Vuc2V0LCBSb3V0ZS5nZXRQZXJzaXN0ZW50U3RhdGVzKCkuY29uY2F0KFJvdXRlLmdldEZsYXNoU3RhdGVzKCkpKTtcblxuICAgIGxldCBldmVudERhdGEgPSB7dW5zZXR0aW5nOiBmaWVsZHNUb1Vuc2V0LCBzZXR0aW5nOiBkYXRhfTtcblxuICAgICRyb290U2NvcGUuJGVtaXQoJ2JpY2tlcl9yb3V0ZXIuYmVmb3JlU3RhdGVDaGFuZ2UnLCBldmVudERhdGEpO1xuXG4gICAgaWYgKChldmVudERhdGEudW5zZXR0aW5nKS5sZW5ndGggIT09IDApIHtcbiAgICAgIFN0YXRlLnVuc2V0KGV2ZW50RGF0YS51bnNldHRpbmcpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGtleSBpbiBldmVudERhdGEuc2V0dGluZykge1xuICAgICAgbGV0IHZhbHVlID0gZXZlbnREYXRhLnNldHRpbmdba2V5XTtcbiAgICAgIFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9XG5cbiAgICBSb3V0ZS5yZXNldEZsYXNoU3RhdGVzKCk7XG4gICAgUm91dGUuc2V0UmVhZHkodHJ1ZSk7XG4gIH0pO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ09iamVjdEhlbHBlcicsIHtcbiAgZ2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgbGV0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBsZXQga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGxldCBzZWdtZW50IG9mIEFycmF5LmZyb20ocGllY2VzKSkge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV07XG4gIH0sXG5cbiAgc2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgICBsZXQgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGxldCBrZXkgPSBwaWVjZXMucG9wKCk7XG5cbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChsZXQgc2VnbWVudCBvZiBBcnJheS5mcm9tKHBpZWNlcykpIHtcbiAgICAgIGlmIChwYXJlbnRbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJlbnRbc2VnbWVudF0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XSA9IHZhbHVlO1xuICB9LFxuXG4gIHVuc2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgbGV0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBsZXQga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGxldCBzZWdtZW50IG9mIEFycmF5LmZyb20ocGllY2VzKSkge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cblxuICAgIGlmIChwYXJlbnRba2V5XSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGRlbGV0ZSBwYXJlbnRba2V5XTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICAvLyBSZWN1cnNpdmVseSByZXR1cm4gdGhlIHByb3BlcnRpZXMgaW4gYSB0aGF0IGFyZW4ndCBpbiBiXG4gIG5vdEluKGEsIGIsIHByZWZpeCkge1xuICAgIGlmIChwcmVmaXggPT0gbnVsbCkgeyBwcmVmaXggPSAnJzsgfVxuICAgIGxldCBub3RJbiA9IFtdO1xuICAgIHByZWZpeCA9IHByZWZpeC5sZW5ndGggPiAwID8gYCR7cHJlZml4fS5gIDogJyc7XG5cbiAgICBmb3IgKGxldCBrZXkgb2YgQXJyYXkuZnJvbShPYmplY3Qua2V5cyhhKSkpIHtcbiAgICAgIGxldCB0aGlzUGF0aCA9IGAke3ByZWZpeH0ke2tleX1gO1xuXG4gICAgICBpZiAoYltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm90SW4ucHVzaCh0aGlzUGF0aCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBhW2tleV0gPT09ICdvYmplY3QnKSAmJiAoIShhW2tleV0gaW5zdGFuY2VvZiBBcnJheSkpKSB7XG4gICAgICAgIG5vdEluID0gbm90SW4uY29uY2F0KHRoaXMubm90SW4oYVtrZXldLCBiW2tleV0sIHRoaXNQYXRoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdEluO1xuICB9LFxuXG4gIGRlZmF1bHQob3ZlcnJpZGVzLCAuLi5kZWZhdWx0U2V0cykge1xuICAgIGxldCBkZWZhdWx0U2V0LCB2YWx1ZTtcbiAgICBsZXQgcmVzdWx0ID0ge307XG5cbiAgICBpZiAoZGVmYXVsdFNldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBkZWZhdWx0U2V0ID0gZGVmYXVsdFNldHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRTZXQgPSB0aGlzLmRlZmF1bHQoLi4uQXJyYXkuZnJvbShkZWZhdWx0U2V0cyB8fCBbXSkpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGtleSBpbiBkZWZhdWx0U2V0KSB7XG4gICAgICB2YWx1ZSA9IGRlZmF1bHRTZXRba2V5XTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb3ZlcnJpZGVzW2tleV0gPT09IFwib2JqZWN0XCIpKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5kZWZhdWx0KG92ZXJyaWRlc1trZXldLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoa2V5IGluIG92ZXJyaWRlcykge1xuICAgICAgdmFsdWUgPSBvdmVycmlkZXNba2V5XTtcbiAgICAgIHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gfHwgdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG5cblxuY2xhc3Mgcm91dGVIcmVmRGlyZWN0aXZlIHtcbiAgY29uc3RydWN0b3IoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcblxuICAgIHRoaXMucmVzdHJpY3QgPSAnQSc7XG4gICAgdGhpcy5zY29wZSA9IHRydWU7XG5cbiAgICB0aGlzLmxpbmsgPSAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpID0+IHtcbiAgICAgIGlmIChpQXR0cnMuaWdub3JlSHJlZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlFbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgbGV0IHVybCA9IGlFbGVtZW50LmF0dHIoJ2hyZWYnKTtcblxuICAgICAgICAgIGlmICghUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmwpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgY29uc3Qgd3JpdGVyID0gb2JqZWN0W3dyaXRlck5hbWVdO1xuICAgICAgICBzY29wZVtgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gd3JpdGVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2NvcGUuJHdhdGNoKGlBdHRycy5yb3V0ZUhyZWYsIChuZXdVcmwpID0+IHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYgKFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgdXJsID0gbmV3VXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybCA9IGAjJHtuZXdVcmx9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaUVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZUhyZWYnLCAoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyByb3V0ZUhyZWZEaXJlY3RpdmUoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpO1xufSk7XG5cbi8vIEBUT0RPIG5vbmUgb2YgdGhlIGFuaW1hdGlvbiBjb2RlIGluIHRoaXMgZGlyZWN0aXZlIGhhcyBiZWVuIHRlc3RlZC4gTm90IHN1cmUgaWYgaXQgY2FuIGJlIGF0IHRoaXMgc3RhZ2UgVGhpcyBuZWVkcyBmdXJ0aGVyIGludmVzdGlnYXRpb24uXG4vLyBAVE9ETyB0aGlzIGNvZGUgZG9lcyB0b28gbXVjaCwgaXQgc2hvdWxkIGJlIHJlZmFjdG9yZWQuXG5cbmNsYXNzIHJvdXRlVmlld0RpcmVjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsICR0ZW1wbGF0ZVJlcXVlc3QsIFJvdXRlKSB7XG4gICAgdGhpcy5yZXN0cmljdCA9ICdFJztcbiAgICB0aGlzLnNjb3BlID0gZmFsc2U7XG4gICAgdGhpcy5yZXBsYWNlID0gdHJ1ZTtcbiAgICB0aGlzLnRlbXBsYXRlID0gJzxkaXY+PC9kaXY+JztcblxuICAgIHRoaXMubGluayA9ICh2aWV3RGlyZWN0aXZlU2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpID0+IHtcblxuICAgICAgbGV0IHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICBsZXQgdmlld1Njb3BlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgY29uc3QgdmlldyA9IFZpZXdCaW5kaW5ncy5nZXRWaWV3KGlBdHRycy5uYW1lKTtcbiAgICAgIGNvbnN0IGJpbmRpbmdzID0gdmlldy5nZXRCaW5kaW5ncygpO1xuXG4gICAgICBpRWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXG4gICAgICBsZXQgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVEYXRhRm9yQmluZGluZyA9IGJpbmRpbmcgPT4gXy5jbG9uZURlZXAoU3RhdGUuZ2V0U3Vic2V0KGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcoYmluZGluZykpKTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgZmllbGQpIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgIGZpZWxkID0gJ2NvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlID0gYmluZGluZ1tmaWVsZF0gPyAkaW5qZWN0b3IuZ2V0KGAke2JpbmRpbmdbZmllbGRdfURpcmVjdGl2ZWApWzBdIDogYmluZGluZztcbiAgICAgICAgcmV0dXJuIF8uZGVmYXVsdHMoXy5waWNrKHNvdXJjZSwgWydjb250cm9sbGVyJywgJ3RlbXBsYXRlVXJsJywgJ2NvbnRyb2xsZXJBcyddKSwge2NvbnRyb2xsZXJBczogJyRjdHJsJ30pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNSZXF1aXJlZERhdGEoYmluZGluZykge1xuICAgICAgICBjb25zdCByZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdO1xuXG4gICAgICAgIGZvciAobGV0IHJlcXVpcmVtZW50IG9mIEFycmF5LmZyb20ocmVxdWlyZWRTdGF0ZSkpIHtcbiAgICAgICAgICBsZXQgbmVnYXRlUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCchJyA9PT0gcmVxdWlyZW1lbnQuY2hhckF0KDApKSB7XG4gICAgICAgICAgICByZXF1aXJlbWVudCA9IHJlcXVpcmVtZW50LnNsaWNlKDEpO1xuICAgICAgICAgICAgbmVnYXRlUmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgZWxlbWVudCA9IFN0YXRlLmdldChyZXF1aXJlbWVudCk7XG5cbiAgICAgICAgICAvLyBSZXR1cm4gZmFsc2UgaWYgZWxlbWVudCBpcyB1bmRlZmluZWRcbiAgICAgICAgICBpZiAoKGVsZW1lbnQgPT09IG51bGwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT25seSBjaGVjayB2YWx1ZSBvZiBlbGVtZW50IGlmIGl0IGlzIGRlZmluZWRcbiAgICAgICAgICBpZiAobmVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gIWVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiaW5kaW5nLmNhbkFjdGl2YXRlKSB7XG4gICAgICAgICAgaWYgKCEkaW5qZWN0b3IuaW52b2tlKGJpbmRpbmcuY2FuQWN0aXZhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1hbmFnZVZpZXcoZWxlbWVudCwgYmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdCaW5kaW5nID0gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKTtcblxuICAgICAgICBpZiAoIW1hdGNoaW5nQmluZGluZykge1xuICAgICAgICAgIGlmICh2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3lWaWV3KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1N0YXRlID0gZ2V0U3RhdGVEYXRhRm9yQmluZGluZyhtYXRjaGluZ0JpbmRpbmcpO1xuICAgICAgICBpZiAoKG1hdGNoaW5nQmluZGluZyA9PT0gcHJldmlvdXNCaW5kaW5nKSAmJiBhbmd1bGFyLmVxdWFscyhwcmV2aW91c0JvdW5kU3RhdGUsIG5ld1N0YXRlKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZpb3VzQmluZGluZyA9IG1hdGNoaW5nQmluZGluZztcbiAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gbmV3U3RhdGU7XG5cbiAgICAgICAgUGVuZGluZ1ZpZXdDb3VudGVyLmluY3JlYXNlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKGhhc1Jlc29sdmluZ1RlbXBsYXRlKSB7XG4gICAgICAgICAgLy8gQFRPRE86IE1hZ2ljIG51bWJlclxuICAgICAgICAgIGNvbnN0IGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uID0gaGFzUmVzb2x2aW5nVGVtcGxhdGUgPyAzMDAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBpZiAoIXZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGFuaW1hdGUucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpIHtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20oYmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVzdHJveVZpZXcoZWxlbWVudCkge1xuICAgICAgICBpZiAodmlld0NyZWF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKS5yZW1vdmUoKTtcbiAgICAgICAgcmV0dXJuIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVWaWV3KGVsZW1lbnQsIGJpbmRpbmcsIG1pbmltdW1EZWxheSkge1xuICAgICAgICBjb25zdCB0aW1lU3RhcnRlZE1haW5WaWV3ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZyk7XG5cbiAgICAgICAgY29uc3Qgb25TdWNjZXNzZnVsUmVzb2x1dGlvbiA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgaWYgKGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykgIT09IGJpbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2aWV3Q3JlYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICBjb25zdCByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA9IERhdGUubm93KCkgLSB0aW1lU3RhcnRlZE1haW5WaWV3O1xuXG4gICAgICAgICAgY29uc3QgaW5qZWN0TWFpblRlbXBsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yKGUsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZ2l2ZSB0aGUgdmlldyB0aW1lIHRvIHByb3Blcmx5IGluaXRpYWxpc2VcbiAgICAgICAgICAgICAgLy8gYmVmb3JlIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgdGhlIGludGlhbFZpZXdzTG9hZGVkIGV2ZW50XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5ID0gTWF0aC5tYXgoMCwgbWluaW11bURlbGF5IC0gcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lIDwgbWluaW11bURlbGF5KSB7XG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gaW5qZWN0TWFpblRlbXBsYXRlKClcbiAgICAgICAgICAgICAgLCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmplY3RNYWluVGVtcGxhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25SZXNvbHV0aW9uRmFpbHVyZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkbG9nLmVycm9yKGVycm9yKTtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt0ZW1wbGF0ZTogJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLCBkZXBlbmRlbmNpZXM6IHJlc29sdmUoYmluZGluZyl9O1xuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24sIG9uUmVzb2x1dGlvbkZhaWx1cmUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwgfHwgIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIHJldHVybiAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKCRyb290U2NvcGUuJG5ldygpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGJpbmRpbmcuZXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5lcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ2Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgdGVtcGxhdGVGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG4gICAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgICAgYmluZGluZ0NvbXBvbmVudEZpZWxkID0gJ2Vycm9yQ29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWJpbmRpbmdbYmluZGluZ0NvbXBvbmVudEZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpO1xuICAgICAgICBjb25zdCBhcmdzID0ge2RlcGVuZGVuY2llczoge2Vycm9yfX07XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGFyZ3MudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKSB7XG4gICAgICAgIGNvbnN0IHtkZXBlbmRlbmNpZXN9ID0gYXJncztcbiAgICAgICAgY29uc3Qge3RlbXBsYXRlfSA9IGFyZ3M7XG5cbiAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0gXy5tZXJnZShkZXBlbmRlbmNpZXMsIHskc2NvcGU6IHZpZXdTY29wZSwgJGVsZW1lbnQ6IGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKX0pO1xuXG4gICAgICAgICAgY29uc3QgY29udHJvbGxlciA9ICRjb250cm9sbGVyKGNvbXBvbmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICAgIGxvY2Fscy4kc2NvcGVbY29tcG9uZW50LmNvbnRyb2xsZXJBc10gPSBjb250cm9sbGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZSA9IGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7fSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgZGVwZW5kZW5jeU5hbWUgaW4gYmluZGluZy5yZXNvbHZlKSB7XG4gICAgICAgICAgY29uc3QgZGVwZW5kZW5jeUZhY3RvcnkgPSBiaW5kaW5nLnJlc29sdmVbZGVwZW5kZW5jeU5hbWVdO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkaW5qZWN0b3IuaW52b2tlKGRlcGVuZGVuY3lGYWN0b3J5KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkcS5yZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcyk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nID0gYmluZGluZyA9PiBfLnVuaW9uKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXSwgYmluZGluZy53YXRjaGVkU3RhdGUgfHwgW10pO1xuXG4gICAgICBmdW5jdGlvbiBzdHJpcE5lZ2F0aW9uUHJlZml4KHN0cikge1xuICAgICAgICBpZiAoc3RyLmNoYXJBdCgwKSA9PT0gJyEnKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3ID0gdmlldyA9PiBfLmZsYXR0ZW4oXy5tYXAodmlldy5nZXRCaW5kaW5ncygpLCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKSk7XG5cbiAgICAgIGNvbnN0IGdldEZpZWxkc1RvV2F0Y2ggPSB2aWV3ID0+IF8udW5pcShfLm1hcChnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3KHZpZXcpLCBzdHJpcE5lZ2F0aW9uUHJlZml4KSk7XG5cbiAgICAgIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc1RvV2F0Y2godmlldyk7XG5cbiAgICAgIHJldHVybiBSb3V0ZS53aGVuUmVhZHkoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAvLyBUcnkgdG8gc3RhcnQgdGhlIGJhbGwgcm9sbGluZyBpbiBjYXNlIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIGFuZCB3ZSBjYW4gY3JlYXRlIHRoZSB2aWV3IGltbWVkaWF0ZWx5XG4gICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gRG9uJ3QgYm90aGVyIHB1dHRpbmcgaW4gYSB3YXRjaGVyIGlmIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBldmVyIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgaWYgKGZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0ZVdhdGNoZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHZpZXdNYW5hZ2VtZW50UGVuZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZmluaXNoIHRoZSBkaWdlc3QgY3ljbGUgYmVmb3JlIGJ1aWxkaW5nIHRoZSB2aWV3LCB3aGljaCBzaG91bGRcbiAgICAgICAgICAvLyBwcmV2ZW50IHVzIGZyb20gcmUtcmVuZGVyaW5nIGEgdmlldyBtdWx0aXBsZSB0aW1lcyBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzIG9mIHRoZSBzYW1lIHN0YXRlIGRlcGVuZGVuY3lcbiAgICAgICAgICAvLyBnZXQgY2hhbmdlZCB3aXRoIHJlcGVhdGVkIFN0YXRlLnNldCBjYWxsc1xuICAgICAgICAgIHJldHVybiAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICByZXR1cm4gdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgU3RhdGUud2F0Y2goZmllbGRzLCBzdGF0ZVdhdGNoZXIpO1xuXG4gICAgICAgIHZpZXdEaXJlY3RpdmVTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4gU3RhdGUucmVtb3ZlV2F0Y2hlcihzdGF0ZVdhdGNoZXIpKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3ZpZXcnLCAoJGxvZywgJGNvbXBpbGUsICRjb250cm9sbGVyLCBWaWV3QmluZGluZ3MsICRxLCBTdGF0ZSwgJHJvb3RTY29wZSwgJGFuaW1hdGUsICR0aW1lb3V0LCAkaW5qZWN0b3IsIFBlbmRpbmdWaWV3Q291bnRlciwgJHRlbXBsYXRlUmVxdWVzdCwgUm91dGUpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyByb3V0ZVZpZXdEaXJlY3RpdmUoJGxvZywgJGNvbXBpbGUsICRjb250cm9sbGVyLCBWaWV3QmluZGluZ3MsICRxLCBTdGF0ZSwgJHJvb3RTY29wZSwgJGFuaW1hdGUsICR0aW1lb3V0LCAkaW5qZWN0b3IsIFBlbmRpbmdWaWV3Q291bnRlciwgJHRlbXBsYXRlUmVxdWVzdCwgUm91dGUpO1xufSk7XG5cbmNsYXNzIFBlbmRpbmdWaWV3Q291bnRlciB7XG4gIGNvbnN0cnVjdG9yKCRyb290U2NvcGUpIHtcbiAgICB0aGlzLiRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gIH1cblxuICBpbmNyZWFzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudCArPSAxO1xuICB9XG5cbiAgZGVjcmVhc2UoKSB7XG4gICAgdGhpcy5jb3VudCA9IE1hdGgubWF4KDAsIHRoaXMuY291bnQgLSAxKTtcbiAgICBpZiAodGhpcy5jb3VudCA9PT0gMCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCkge1xuICAgICAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmluaXRpYWxWaWV3c0xvYWRlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuY3VycmVudFZpZXdzTG9hZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdQZW5kaW5nVmlld0NvdW50ZXInLCAoJHJvb3RTY29wZSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFBlbmRpbmdWaWV3Q291bnRlcigkcm9vdFNjb3BlKTtcbn0pO1xuXG5jbGFzcyBXYXRjaGFibGVMaXN0IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSwgbGlzdCkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcblxuICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgdGhpcy53YXRjaGVycyA9IFtdO1xuICB9XG5cbiAgZ2V0KHBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gIH1cblxuICBnZXRBbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdDtcbiAgfVxuXG4gIGdldFN1YnNldChwYXRocykge1xuICAgIHJldHVybiBfLnppcE9iamVjdChwYXRocywgXy5tYXAocGF0aHMsIHRoaXMuZ2V0LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIHNldChwYXRoLCB2YWx1ZSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyLnNldCh0aGlzLmxpc3QsIHBhdGgsIHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgdW5zZXQocGF0aHMpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIHJldHVybiBBcnJheS5mcm9tKHBhdGhzKS5tYXAoKHBhdGgpID0+XG4gICAgICAodGhpcy5PYmplY3RIZWxwZXIudW5zZXQodGhpcy5saXN0LCBwYXRoKSxcbiAgICAgICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdW5kZWZpbmVkKSkpO1xuICB9XG5cbiAgd2F0Y2gocGF0aHMsIGhhbmRsZXIpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIHJldHVybiBBcnJheS5mcm9tKHBhdGhzKS5tYXAoKHBhdGgpID0+XG4gICAgICB0aGlzLndhdGNoZXJzLnB1c2godGhpcy5XYXRjaGVyRmFjdG9yeS5jcmVhdGUocGF0aCwgaGFuZGxlciwgdGhpcy5nZXQocGF0aCkpKSk7XG4gIH1cblxuICByZW1vdmVXYXRjaGVyKHdhdGNoZXIpIHtcbiAgICBpZiAodGhpcy53YXRjaGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmV3V2F0Y2hlcnMgPSBbXTtcblxuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB0aGlzV2F0Y2hlciA9PiB7XG4gICAgICBpZiAodGhpc1dhdGNoZXIuaGFuZGxlciAhPT0gd2F0Y2hlcikge1xuICAgICAgICBuZXdXYXRjaGVycy5wdXNoKHRoaXNXYXRjaGVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLndhdGNoZXJzID0gbmV3V2F0Y2hlcnM7XG4gIH1cblxuICBfbm90aWZ5V2F0Y2hlcnMoY2hhbmdlZFBhdGgpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgd2F0Y2hlciA9PiB7XG4gICAgICBsZXQgaXRlbTtcbiAgICAgIGNvbnN0IHdhdGNoZWRWYWx1ZSA9IHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHdhdGNoZXIud2F0Y2hQYXRoKTtcblxuICAgICAgaWYgKHdhdGNoZXIuc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCB3YXRjaGVkVmFsdWUpKSB7XG4gICAgICAgIGl0ZW0gPSB3YXRjaGVyLm5vdGlmeShjaGFuZ2VkUGF0aCwgd2F0Y2hlZFZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hhYmxlTGlzdEZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuICB9XG5cbiAgY3JlYXRlKGxpc3QgPSB7fSkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdCh0aGlzLk9iamVjdEhlbHBlciwgdGhpcy5XYXRjaGVyRmFjdG9yeSwgbGlzdCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGFibGVMaXN0RmFjdG9yeScsIChPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdEZhY3RvcnkoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSk7XG59KTtcblxuY2xhc3MgV2F0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy53YXRjaFBhdGggPSB3YXRjaFBhdGg7XG4gICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKGluaXRpYWxWYWx1ZSk7XG4gIH1cblxuICBzaG91bGROb3RpZnkod2F0Y2hlZFZhbHVlKSB7XG4gICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh0aGlzLmN1cnJlbnRWYWx1ZSwgd2F0Y2hlZFZhbHVlKTtcbiAgfVxuXG4gIG5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICB0aGlzLmhhbmRsZXIoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCB0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAobmV3VmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoZXJGYWN0b3J5IHtcbiAgY3JlYXRlKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGVyKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoZXJGYWN0b3J5JywgKCkgPT4ge1xuICByZXR1cm4gbmV3IFdhdGNoZXJGYWN0b3J5KCk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignUm91dGUnLCBmdW5jdGlvbihPYmplY3RIZWxwZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuICBsZXQgdG9rZW5zID0ge307XG4gIGxldCB1cmxXcml0ZXJzID0ge307XG4gIGxldCB1cmxzID0gW107XG4gIGxldCBwZXJzaXN0ZW50U3RhdGVzID0gW107XG4gIGxldCByZWFkeSA9IGZhbHNlO1xuICBsZXQgdHlwZXMgPSB7fTtcbiAgbGV0IGh0bWw1TW9kZSA9IGZhbHNlO1xuXG4gIGxldCBwcm92aWRlciA9IHtcblxuICAgIHJlZ2lzdGVyVHlwZShuYW1lLCBjb25maWcpIHtcbiAgICAgIHR5cGVzW25hbWVdID0gY29uZmlnO1xuICAgICAgdHlwZXNbbmFtZV0ucmVnZXggPSBuZXcgUmVnRXhwKHR5cGVzW25hbWVdLnJlZ2V4LnNvdXJjZSwgJ2knKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclR5cGUgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsVG9rZW4obmFtZSwgY29uZmlnKSB7XG4gICAgICB0b2tlbnNbbmFtZV0gPSBfLmV4dGVuZCh7bmFtZX0sIGNvbmZpZyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxUb2tlbiB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxXcml0ZXIobmFtZSwgZm4pIHtcbiAgICAgIHVybFdyaXRlcnNbbmFtZV0gPSBmbjtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFdyaXRlciB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmwocGF0dGVybiwgY29uZmlnKSB7XG4gICAgICBpZiAoY29uZmlnID09IG51bGwpIHsgY29uZmlnID0ge307IH1cbiAgICAgIGxldCB1cmxEYXRhID0ge1xuICAgICAgICBjb21waWxlZFVybDogdGhpcy5fY29tcGlsZVVybFBhdHRlcm4ocGF0dGVybiwgY29uZmlnKSxcbiAgICAgICAgcGF0dGVyblxuICAgICAgfTtcblxuICAgICAgdXJscy5wdXNoKF8uZXh0ZW5kKHVybERhdGEsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBzZXRQZXJzaXN0ZW50U3RhdGVzKC4uLnN0YXRlTGlzdCkge1xuICAgICAgcmV0dXJuICgoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgc3RhdGUgb2YgQXJyYXkuZnJvbShzdGF0ZUxpc3QpKSB7XG4gICAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgICAgaWYgKCFBcnJheS5mcm9tKHBlcnNpc3RlbnRTdGF0ZXMpLmluY2x1ZGVzKHN0YXRlKSkgeyBpdGVtID0gcGVyc2lzdGVudFN0YXRlcy5wdXNoKHN0YXRlKTsgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KSgpO1xuICAgIH0sXG5cbiAgICBzZXRIdG1sNU1vZGUobW9kZSkgeyByZXR1cm4gaHRtbDVNb2RlID0gbW9kZTsgfSxcblxuICAgIF9jb21waWxlVXJsUGF0dGVybih1cmxQYXR0ZXJuLCBjb25maWcpIHtcbiAgICAgIGxldCBtYXRjaDtcbiAgICAgIGxldCBjb21waWxlZFVybDtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHVybFBhdHRlcm4pO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2Vuc3VyZU9wdGlvbmFsVHJhaWxpbmdTbGFzaCh1cmxQYXR0ZXJuKTtcblxuICAgICAgbGV0IHRva2VuUmVnZXggPSAvXFx7KFtBLVphLXpcXC5fMC05XSspXFx9L2c7XG4gICAgICBsZXQgdXJsUmVnZXggPSB1cmxQYXR0ZXJuO1xuXG4gICAgICBpZiAoIWNvbmZpZy5wYXJ0aWFsTWF0Y2gpIHtcbiAgICAgICAgdXJsUmVnZXggPSBgXiR7dXJsUmVnZXh9JGA7XG4gICAgICB9XG5cbiAgICAgIGxldCB0b2tlbkxpc3QgPSBbXTtcblxuICAgICAgd2hpbGUgKChtYXRjaCA9IHRva2VuUmVnZXguZXhlYyh1cmxQYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgbGV0IHRva2VuID0gdG9rZW5zW21hdGNoWzFdXTtcbiAgICAgICAgdG9rZW5MaXN0LnB1c2godG9rZW4pO1xuICAgICAgICB1cmxSZWdleCA9IHVybFJlZ2V4LnJlcGxhY2UobWF0Y2hbMF0sIGAoJHt0eXBlc1t0b2tlbi50eXBlXS5yZWdleC5zb3VyY2V9KWApO1xuICAgICAgfVxuXG4gICAgICB1cmxSZWdleC5yZXBsYWNlKCcuJywgJ1xcXFwuJyk7XG5cbiAgICAgIHJldHVybiBjb21waWxlZFVybCA9IHtcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyksXG4gICAgICAgIHRva2VuczogdG9rZW5MaXN0XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBfZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHN0cikge1xuICAgICAgaWYgKHN0ci5tYXRjaCgvXFwvJC8pKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwvJC8sICcvPycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ciArICcvPyc7XG4gICAgfSxcblxuICAgIF9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFwoXFwpXFwqXFwrXFw/XFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gICAgfSxcblxuICAgICRnZXQoJGxvY2F0aW9uLCBTdGF0ZSwgJGluamVjdG9yLCAkcSkge1xuICAgICAgJ25nSW5qZWN0JztcblxuICAgICAgLy8gV2hlbiBnZXR0aW5nIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlIChvbmx5IGRvbmUgb25jZSksIHdlIG5lZWQgdG8gaXRlcmF0ZSBvdmVyIHRoZSB1cmxXcml0ZXJzIGFuZCB0dXJuXG4gICAgICAvLyB0aGVtIGludG8gbWV0aG9kcyB0aGF0IGludm9rZSB0aGUgUkVBTCB1cmxXcml0ZXIsIGJ1dCBwcm92aWRpbmcgZGVwZW5kZW5jeSBpbmplY3Rpb24gdG8gaXQsIHdoaWxlIGFsc29cbiAgICAgIC8vIGdpdmluZyBpdCB0aGUgZGF0YSB0aGF0IHRoZSBjYWxsZWUgcGFzc2VzIGluLlxuXG4gICAgICAvLyBUaGUgcmVhc29uIHdlIGhhdmUgdG8gZG8gdGhpcyBoZXJlIGlzIGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhlICRpbmplY3RvciBiYWNrIGluIHRoZSByb3V0ZVByb3ZpZGVyLlxuXG4gICAgICBfLmZvckluKHVybFdyaXRlcnMsICh3cml0ZXIsIHdyaXRlck5hbWUpID0+XG4gICAgICAgIHVybFdyaXRlcnNbd3JpdGVyTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkgeyBkYXRhID0ge307IH1cbiAgICAgICAgICBsZXQgbG9jYWxzID0ge1VybERhdGE6IGRhdGF9O1xuICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKHdyaXRlciwge30sIGxvY2Fscyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGxldCBmbGFzaFN0YXRlcyA9IFtdO1xuXG4gICAgICBsZXQgc2VydmljZSA9IHtcbiAgICAgICAgcmVhZHlEZWZlcnJlZDogJHEuZGVmZXIoKSxcblxuICAgICAgICBtYXRjaCh1cmxUb01hdGNoKSB7XG4gICAgICAgICAgZm9yIChsZXQgdXJsIG9mIEFycmF5LmZyb20odXJscykpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSB1cmwuY29tcGlsZWRVcmwucmVnZXguZXhlYyh1cmxUb01hdGNoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHt1cmwsIHJlZ2V4TWF0Y2g6IG1hdGNofTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERhdGEobWF0Y2gsIHNlYXJjaERhdGEpIHtcbiAgICAgICAgICBpZiAoc2VhcmNoRGF0YSA9PSBudWxsKSB7IHNlYXJjaERhdGEgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgICBsZXQgZGVmYXVsdHMgPSB0aGlzLmV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCk7XG4gICAgICAgICAgbGV0IHBhdGggPSB0aGlzLmV4dHJhY3RQYXRoRGF0YShtYXRjaCk7XG4gICAgICAgICAgc2VhcmNoRGF0YSA9IHRoaXMuZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdEhlbHBlci5kZWZhdWx0KHNlYXJjaERhdGEsIHBhdGgsIGRlZmF1bHRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKSB7XG4gICAgICAgICAgaWYgKHNlYXJjaERhdGEgPT0gbnVsbCkgeyBzZWFyY2hEYXRhID0gJGxvY2F0aW9uLnNlYXJjaCgpOyB9XG4gICAgICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHNlYXJjaERhdGEpO1xuICAgICAgICAgIGxldCBuZXdEYXRhID0ge307XG5cbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gZGF0YVtrZXldO1xuICAgICAgICAgICAgbGV0IHRhcmdldEtleSA9IF8uZmluZEtleSh0b2tlbnMsIHsgc2VhcmNoQWxpYXM6IGtleSB9KTtcbiAgICAgICAgICAgIGlmICh0YXJnZXRLZXkgPT0gbnVsbCkgeyB0YXJnZXRLZXkgPSBrZXk7IH1cblxuICAgICAgICAgICAgaWYgKCF0b2tlbnNbdGFyZ2V0S2V5XSB8fCBfX2d1YXJkX18odHlwZXNbdG9rZW5zW3RhcmdldEtleV0gIT0gbnVsbCA/IHRva2Vuc1t0YXJnZXRLZXldLnR5cGUgOiB1bmRlZmluZWRdLCB4ID0+IHgucmVnZXgudGVzdCh2YWx1ZSkpKSB7XG5cbiAgICAgICAgICAgICAgaWYgKF9fZ3VhcmRfXyh0eXBlc1t0b2tlbnNbdGFyZ2V0S2V5XSAhPSBudWxsID8gdG9rZW5zW3RhcmdldEtleV0udHlwZSA6IHVuZGVmaW5lZF0sIHgxID0+IHgxLnBhcnNlcikpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodHlwZXNbdG9rZW5zW3RhcmdldEtleV0udHlwZV0gIT0gbnVsbCA/IHR5cGVzW3Rva2Vuc1t0YXJnZXRLZXldLnR5cGVdLnBhcnNlciA6IHVuZGVmaW5lZCwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbGV0IGRhdGFLZXkgPSAodG9rZW5zW3RhcmdldEtleV0gIT0gbnVsbCA/IHRva2Vuc1t0YXJnZXRLZXldLnN0YXRlUGF0aCA6IHVuZGVmaW5lZCkgfHwgdGFyZ2V0S2V5O1xuXG4gICAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQobmV3RGF0YSwgZGF0YUtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCkge1xuICAgICAgICAgIGxldCBkYXRhID0ge307XG5cbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbWF0Y2gudXJsLnN0YXRlKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBtYXRjaC51cmwuc3RhdGVba2V5XTtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwga2V5LCAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IF8uY2xvbmVEZWVwKHZhbHVlKSA6IHZhbHVlKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFBhdGhEYXRhKG1hdGNoKSB7XG4gICAgICAgICAgbGV0IGRhdGEgPSB7fTtcbiAgICAgICAgICBsZXQgcGF0aFRva2VucyA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnM7XG5cbiAgICAgICAgICBpZiAocGF0aFRva2Vucy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHt9OyB9XG5cbiAgICAgICAgICBmb3IgKGxldCBuID0gMCwgZW5kID0gcGF0aFRva2Vucy5sZW5ndGgtMSwgYXNjID0gMCA8PSBlbmQ7IGFzYyA/IG4gPD0gZW5kIDogbiA+PSBlbmQ7IGFzYyA/IG4rKyA6IG4tLSkge1xuICAgICAgICAgICAgbGV0IHRva2VuID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2Vuc1tuXTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG1hdGNoLnJlZ2V4TWF0Y2hbbisxXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlcikgeyB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7IH1cblxuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCAodG9rZW4uc3RhdGVQYXRoIHx8IHRva2VuLm5hbWUpLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVycygpIHsgcmV0dXJuIHVybFdyaXRlcnM7IH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVyKG5hbWUpIHsgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV07IH0sXG5cbiAgICAgICAgaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEpIHsgaWYgKGRhdGEgPT0gbnVsbCkgeyBkYXRhID0ge307IH0gcmV0dXJuIHVybFdyaXRlcnNbbmFtZV0oZGF0YSk7IH0sXG5cbiAgICAgICAgZ28obmFtZSwgZGF0YSkgeyBpZiAoZGF0YSA9PSBudWxsKSB7IGRhdGEgPSB7fTsgfSByZXR1cm4gJGxvY2F0aW9uLnVybCh0aGlzLmludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhKSk7IH0sXG5cbiAgICAgICAgZ2V0UGVyc2lzdGVudFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gcGVyc2lzdGVudFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBmbGFzaFN0YXRlcyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZEZsYXNoU3RhdGVzKC4uLm5ld1N0YXRlcykge1xuICAgICAgICAgIHJldHVybiBmbGFzaFN0YXRlcyA9IGZsYXNoU3RhdGVzLmNvbmNhdChuZXdTdGF0ZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBmbGFzaFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZWFkeShyZWFkeSkge1xuICAgICAgICAgIGlmICghcmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkgPSByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1JlYWR5KCkgeyByZXR1cm4gdGhpcy5yZWFkeTsgfSxcblxuICAgICAgICBpc0h0bWw1TW9kZUVuYWJsZWQoKSB7IHJldHVybiBodG1sNU1vZGU7IH0sXG5cbiAgICAgICAgd2hlblJlYWR5KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5RGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICB9O1xuXG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbnVtZXJpYycsIHtyZWdleDogL1xcZCsvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiBwYXJzZUludCh0b2tlbildfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYWxwaGEnLCB7cmVnZXg6IC9bYS16QS1aXSsvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYW55Jywge3JlZ2V4OiAvLisvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbGlzdCcsIHtyZWdleDogLy4rLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gdG9rZW4uc3BsaXQoJywnKV19KTtcblxuICByZXR1cm4gcHJvdmlkZXI7XG59KTtcblxuZnVuY3Rpb24gX19ndWFyZF9fKHZhbHVlLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsKSA/IHRyYW5zZm9ybSh2YWx1ZSkgOiB1bmRlZmluZWQ7XG59XG5jbGFzcyBTdGF0ZVByb3ZpZGVyIHtcbiAgJGdldChXYXRjaGFibGVMaXN0RmFjdG9yeSkge1xuICAgICduZ0luamVjdCc7XG4gICAgcmV0dXJuIFdhdGNoYWJsZUxpc3RGYWN0b3J5LmNyZWF0ZSgpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1N0YXRlJywgbmV3IFN0YXRlUHJvdmlkZXIpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdWaWV3QmluZGluZ3MnLCBmdW5jdGlvbiAoKSB7XG4gIGxldCBwcm92aWRlcjtcbiAgbGV0IHZpZXdzID0ge307XG5cbiAgY2xhc3MgVmlldyB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgYmluZGluZ3MpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XG4gICAgICBpZiAoISh0aGlzLmJpbmRpbmdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBbdGhpcy5iaW5kaW5nc107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QmluZGluZ3MoKSB7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcHJvdmlkZXIgPSB7XG5cbiAgICBiaW5kKG5hbWUsIGNvbmZpZykge1xuXG4gICAgICBsZXQgYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlID0gKGJpbmRpbmdzLCBjb21tb25SZXF1aXJlZFN0YXRlKSA9PlxuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgICAgIGlmICghKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgICAgIGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IFtiaW5kaW5nLnJlcXVpcmVkU3RhdGVdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZS5jb25jYXQoY29tbW9uUmVxdWlyZWRTdGF0ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9KSgpXG4gICAgICAgIDtcblxuICAgICAgbGV0IGFwcGx5Q29tbW9uUmVzb2x2ZSA9IChiaW5kaW5ncywgY29tbW9uUmVzb2x2ZSkgPT5cbiAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgICAgICBpZiAoISgncmVzb2x2ZScgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgICAgICBiaW5kaW5nLnJlc29sdmUgPSB7fTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXN1bHQucHVzaChfLmRlZmF1bHRzKGJpbmRpbmcucmVzb2x2ZSwgY29tbW9uUmVzb2x2ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9KSgpXG4gICAgICAgIDtcblxuICAgICAgbGV0IGFwcGx5Q29tbW9uRmllbGRzID0gZnVuY3Rpb24gKG5ld0JpbmRpbmdzKSB7XG4gICAgICAgIGxldCBiYXNpY0NvbW1vbkZpZWxkcyA9IFtcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yQ29tcG9uZW50Jywgb3ZlcnJpZGVGaWVsZDogJ2Vycm9yQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25FcnJvclRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ2Vycm9yVGVtcGxhdGVVcmwnfVxuICAgICAgICBdO1xuXG4gICAgICAgIGZvciAobGV0IGNvbW1vbkZpZWxkIG9mIEFycmF5LmZyb20oYmFzaWNDb21tb25GaWVsZHMpKSB7XG4gICAgICAgICAgaWYgKGNvbW1vbkZpZWxkLm5hbWUgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBkZWZhdWx0QmluZGluZ0ZpZWxkKG5ld0JpbmRpbmdzLCBjb21tb25GaWVsZC5vdmVycmlkZUZpZWxkLCBjb25maWdbY29tbW9uRmllbGQubmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29tbW9uUmVxdWlyZWRTdGF0ZScgaW4gY29uZmlnKSB7XG4gICAgICAgICAgYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlcXVpcmVkU3RhdGUnXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlc29sdmUnIGluIGNvbmZpZykge1xuICAgICAgICAgIHJldHVybiBhcHBseUNvbW1vblJlc29sdmUobmV3QmluZGluZ3MsIGNvbmZpZ1snY29tbW9uUmVzb2x2ZSddKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIGRlZmF1bHRCaW5kaW5nRmllbGQgPSAoYmluZGluZ3MsIGZpZWxkTmFtZSwgZGVmYXVsdFZhbHVlKSA9PlxuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgICAgICBpZiAoIShmaWVsZE5hbWUgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgICAgICBpdGVtID0gYmluZGluZ1tmaWVsZE5hbWVdID0gZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9KSgpXG4gICAgICAgIDtcblxuICAgICAgdmFyIG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pOyJdfQ==
