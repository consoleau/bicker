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

    console.log('linking new view : ' + iAttrs.name);

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
        console.log(iAttrs.name + ' : manageView : no matching binding');
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
      console.log(iAttrs.name + ' : manageView : matching binding yeilds state : ' + JSON.stringify(newState, {}, 2));
      if (matchingBinding === previousBinding && angular.equals(previousBoundState, newState)) {
        console.log(iAttrs.name + ' : manageView : binding state matches existing. Aborting');
        return;
      }

      previousBinding = matchingBinding;
      previousBoundState = newState;

      PendingViewCounter.increase();

      console.log(iAttrs.name + ' : manageView : resolving and showing resolve template');
      return showResolvingTemplate(element, matchingBinding).then(function (hasResolvingTemplate) {
        // @TODO: Magic number
        var delayForRealTemplateInsertion = hasResolvingTemplate ? 300 : undefined;

        console.log(iAttrs.name + ' : manageView : resolve done, now creatingView');
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
      element.on('$destroy', function () {
        console.log(iAttrs.name + ': DESTROY DESTROY on element destroy');
      });
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
        console.log(iAttrs.name + ' : stateWatcher called with changedPath: ' + changedPath + ', newValue: ' + JSON.stringify(newValue, {}, 2) + ',  oldValue: ' + JSON.stringify(oldValue, {}, 2));
        if (viewManagementPending) {
          console.log(iAttrs.name + ' : stateWatcher called pending true. Abort');
          return;
        }
        viewManagementPending = true;

        // Wrapped in a timeout so that we can finish the digest cycle before building the view, which should
        // prevent us from re-rendering a view multiple times if multiple properties of the same state dependency
        // get changed with repeated State.set calls
        console.log(iAttrs.name + ' : stateWatcher calling manageView');
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
      console.group('State.set calling notifyWatchers: ' + path);
      console.log('new value:  : ' + JSON.stringify(value, {}, 2));
      this._notifyWatchers(path, value);
      console.groupEnd('State.set calling notifyWatchers: ' + path);
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
        console.group('State.unset calling notifyWatchers: ' + path);
        _this._notifyWatchers(path, undefined);
        console.groupEnd('State.unset calling notifyWatchers: ' + path);
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
          console.group('WF: notifying watchPath: ' + watcher.watchPath);
          console.log('changePath: ' + changedPath);
          console.log('oldValue: ' + JSON.stringify(watcher.currentValue, {}, 2));
          console.log('newValue: ' + JSON.stringify(newValue, {}, 2));
          var newValueAtWatchedPath = _this3.ObjectHelper.get(_this3.list, watcher.watchPath);
          watcher.notify(changedPath, newValueAtWatchedPath);
          console.groupEnd('WF: notifying watchPath: ' + watcher.watchPath);
        } else {
          // console.group(`WF: NOT notifying watchPath: ${watcher.watchPath}`)
          // console.log(`changePath: ${changedPath}`);
          // console.log(`oldValue: ${JSON.stringify(watcher.currentValue, {}, 2)}`);
          // console.log(`newValue: ${JSON.stringify(newValue, {}, 2)}`);
          // console.groupEnd(`WF: NOT notifying watchPath: ${watcher.watchPath}`)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWlCLENBQWhDLEFBQWdDLEFBQUMsY0FBakMsQUFBK0Msd0ZBQUksVUFBQSxBQUFVLE9BQVYsQUFBaUIsT0FBakIsQUFBd0IsV0FBeEIsQUFBbUMsWUFBbkMsQUFBK0MsY0FBL0MsQUFBNkQsb0JBQW9CLEFBQ2xJO0FBRUE7O01BQUksU0FBSixBQUFhLEFBQ2I7YUFBQSxBQUFXLElBQVgsQUFBZSx3QkFBd0IsWUFBWSxBQUNqRDtRQUFJLE1BQUosQUFBSSxBQUFNLFdBQVcsQUFDbkI7WUFBQSxBQUFNLFNBQU4sQUFBZSxBQUNoQjtBQUNGO0FBSkQsQUFNQTs7YUFBQSxBQUFXLElBQVgsQUFBZSwwQkFBMEIsVUFBQSxBQUFVLEdBQVYsQUFBYSxRQUFRLEFBQzVEO0FBQ0E7UUFBSSxZQUFKLEFBQ0E7UUFBSSxXQUFKLEFBQWUsUUFBUSxBQUNyQjtBQUNEO0FBRUQ7O2FBQUEsQUFBUyxBQUVUOzt1QkFBQSxBQUFtQixBQUNuQjtRQUFNLFFBQVEsTUFBQSxBQUFNLE1BQU0sVUFBMUIsQUFBYyxBQUFZLEFBQVUsQUFFcEM7O1FBQUksQ0FBSixBQUFLLE9BQU8sQUFDVjthQUFBLEFBQU8sQUFDUjtBQUZELFdBRU8sQUFDTDthQUFPLE1BQUEsQUFBTSxZQUFiLEFBQU8sQUFBa0IsQUFDMUI7QUFFRDs7UUFBSSxnQkFBZ0IsYUFBQSxBQUFhLE1BQU0sTUFBbkIsQUFBeUIsTUFBN0MsQUFBb0IsQUFBK0IsQUFDbkQ7b0JBQWdCLEVBQUEsQUFBRSxXQUFGLEFBQWEsZUFBZSxNQUFBLEFBQU0sc0JBQU4sQUFBNEIsT0FBTyxNQUEvRSxBQUFnQixBQUE0QixBQUFtQyxBQUFNLEFBRXJGOztRQUFNLFlBQVks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LGNBQWMsQUFDOUQ7WUFBTSxTQUR3RCxBQUM5RCxBQUFlOzBDQUQrQztrQ0FBQTsrQkFBQTs7WUFFOUQ7aUNBQXNCLE1BQUEsQUFBTSxLQUE1QixBQUFzQixBQUFXLG9KQUFjO2dCQUFwQyxBQUFvQyxrQkFDN0M7O2dCQUFJLFlBQUosQUFDQTtnQkFBSSxFQUFFLGFBQU4sQUFBSSxBQUFlLFVBQVUsQUFDM0I7cUJBQU8sUUFBQSxBQUFRLGFBQWYsQUFBNEIsQUFDN0I7QUFDRDttQkFBQSxBQUFPLEtBQVAsQUFBWSxBQUNiO0FBUjZEO3NCQUFBO2dDQUFBOzZCQUFBO2tCQUFBO2NBQUE7b0VBQUE7MEJBQUE7QUFBQTtvQkFBQTtxQ0FBQTtvQkFBQTtBQUFBO0FBQUE7QUFTOUQ7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O1VBQUksY0FBSixBQUFrQixBQUNsQjtVQUFJLGNBQUosQUFBa0IsUUFBUSxBQUN4QjtzQkFBYyxPQUFkLEFBQWMsQUFBTyxBQUN0QjtBQUZELGFBRU8sQUFDTDtzQkFBZSxrQkFBRCxBQUFtQixRQUFuQixBQUE0QixTQUFTLENBQW5ELEFBQW1ELEFBQUMsQUFDckQ7QUFFRDs7VUFBSSxFQUFFLFlBQUEsQUFBWSxTQUFsQixBQUFJLEFBQXVCLElBQUksQUFDN0I7Y0FBTSxJQUFBLEFBQUksZ0VBQUosQUFBaUUsT0FBdkUsQUFDRDtBQUVEOzt3QkFBQSxBQUFrQixBQUNsQjthQUFPLE1BQUEsQUFBTSxRQUFRLElBQUEsQUFBSSxLQUFKLEFBQVMsTUFBOUIsQUFBcUIsQUFBZSxBQUNyQztBQTFFSSxBQTRFTDtBQTVFSywwQkE0RUUsQUFDTDs7QUFBTyxrQ0FBQSxBQUNHLE1BQU0sQUFDWjtpQkFBTyxNQUFQLEFBQU8sQUFBTSxBQUNkO0FBSEgsQUFBTyxBQUtSO0FBTFEsQUFDTDtBQTlFTixBQUFPLEFBb0ZSO0FBcEZRLEFBRUw7QUFuQkoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInLCBbJ25nQW5pbWF0ZSddKS5ydW4oZnVuY3Rpb24gKFN0YXRlLCBSb3V0ZSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCBPYmplY3RIZWxwZXIsIFBlbmRpbmdWaWV3Q291bnRlcikge1xuICBcIm5nSW5qZWN0XCI7XG5cbiAgbGV0IG9sZFVybCA9IHVuZGVmaW5lZDtcbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChSb3V0ZS5pc1JlYWR5KCkpIHtcbiAgICAgIFJvdXRlLnNldFJlYWR5KGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKGUsIG5ld1VybCkge1xuICAgIC8vIFdvcmstYXJvdW5kIGZvciBBbmd1bGFySlMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9pc3N1ZXMvODM2OFxuICAgIGxldCBkYXRhO1xuICAgIGlmIChuZXdVcmwgPT09IG9sZFVybCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9sZFVybCA9IG5ld1VybDtcblxuICAgIFBlbmRpbmdWaWV3Q291bnRlci5yZXNldCgpO1xuICAgIGNvbnN0IG1hdGNoID0gUm91dGUubWF0Y2goJGxvY2F0aW9uLnBhdGgoKSk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBSb3V0ZS5leHRyYWN0RGF0YShtYXRjaCk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkc1RvVW5zZXQgPSBPYmplY3RIZWxwZXIubm90SW4oU3RhdGUubGlzdCwgZGF0YSk7XG4gICAgZmllbGRzVG9VbnNldCA9IF8uZGlmZmVyZW5jZShmaWVsZHNUb1Vuc2V0LCBSb3V0ZS5nZXRQZXJzaXN0ZW50U3RhdGVzKCkuY29uY2F0KFJvdXRlLmdldEZsYXNoU3RhdGVzKCkpKTtcblxuICAgIGNvbnN0IGV2ZW50RGF0YSA9IHt1bnNldHRpbmc6IGZpZWxkc1RvVW5zZXQsIHNldHRpbmc6IGRhdGF9O1xuXG4gICAgJHJvb3RTY29wZS4kZW1pdCgnYmlja2VyX3JvdXRlci5iZWZvcmVTdGF0ZUNoYW5nZScsIGV2ZW50RGF0YSk7XG5cbiAgICBpZiAoKGV2ZW50RGF0YS51bnNldHRpbmcpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgU3RhdGUudW5zZXQoZXZlbnREYXRhLnVuc2V0dGluZyk7XG4gICAgfVxuXG4gICAgXy5mb3JFYWNoKGV2ZW50RGF0YS5zZXR0aW5nLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgUm91dGUucmVzZXRGbGFzaFN0YXRlcygpO1xuICAgIFJvdXRlLnNldFJlYWR5KHRydWUpO1xuICB9KTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmNvbnN0YW50KCdPYmplY3RIZWxwZXInLCB7XG4gIGdldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudFtrZXldO1xuICB9LFxuXG4gIHNldChvYmplY3QsIHBhdGgsIHZhbHVlKSB7XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgaWYgKHBhcmVudFtzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhcmVudFtzZWdtZW50XSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudFtrZXldID0gdmFsdWU7XG4gIH0sXG5cbiAgdW5zZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudFtrZXldID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgZGVsZXRlIHBhcmVudFtrZXldO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIC8vIFJlY3Vyc2l2ZWx5IHJldHVybiB0aGUgcHJvcGVydGllcyBpbiBhIHRoYXQgYXJlbid0IGluIGJcbiAgbm90SW4oYSwgYiwgcHJlZml4ID0gJycpIHtcbiAgICBsZXQgbm90SW4gPSBbXTtcbiAgICBwcmVmaXggPSBwcmVmaXgubGVuZ3RoID4gMCA/IGAke3ByZWZpeH0uYCA6ICcnO1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgQXJyYXkuZnJvbShPYmplY3Qua2V5cyhhKSkpIHtcbiAgICAgIGNvbnN0IHRoaXNQYXRoID0gYCR7cHJlZml4fSR7a2V5fWA7XG5cbiAgICAgIGlmIChiW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub3RJbi5wdXNoKHRoaXNQYXRoKTtcblxuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIGFba2V5XSA9PT0gJ29iamVjdCcpICYmICghKGFba2V5XSBpbnN0YW5jZW9mIEFycmF5KSkpIHtcbiAgICAgICAgbm90SW4gPSBub3RJbi5jb25jYXQodGhpcy5ub3RJbihhW2tleV0sIGJba2V5XSwgdGhpc1BhdGgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm90SW47XG4gIH0sXG5cbiAgZGVmYXVsdChvdmVycmlkZXMsIC4uLmRlZmF1bHRTZXRzKSB7XG4gICAgbGV0IGRlZmF1bHRTZXQsIHZhbHVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgaWYgKGRlZmF1bHRTZXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZGVmYXVsdFNldCA9IGRlZmF1bHRTZXRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0U2V0ID0gdGhpcy5kZWZhdWx0KC4uLkFycmF5LmZyb20oZGVmYXVsdFNldHMgfHwgW10pKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkZWZhdWx0U2V0KSB7XG4gICAgICB2YWx1ZSA9IGRlZmF1bHRTZXRba2V5XTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb3ZlcnJpZGVzW2tleV0gPT09IFwib2JqZWN0XCIpKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5kZWZhdWx0KG92ZXJyaWRlc1trZXldLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIG92ZXJyaWRlcykge1xuICAgICAgdmFsdWUgPSBvdmVycmlkZXNba2V5XTtcbiAgICAgIHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gfHwgdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG5cblxuY2xhc3Mgcm91dGVIcmVmRGlyZWN0aXZlIHtcbiAgY29uc3RydWN0b3IoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcblxuICAgIHRoaXMucmVzdHJpY3QgPSAnQSc7XG4gICAgdGhpcy5zY29wZSA9IHRydWU7XG5cbiAgICB0aGlzLmxpbmsgPSAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpID0+IHtcbiAgICAgIGlmIChpQXR0cnMuaWdub3JlSHJlZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlFbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgbGV0IHVybCA9IGlFbGVtZW50LmF0dHIoJ2hyZWYnKTtcblxuICAgICAgICAgIGlmICghUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmwpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgY29uc3Qgd3JpdGVyID0gb2JqZWN0W3dyaXRlck5hbWVdO1xuICAgICAgICBzY29wZVtgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gd3JpdGVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2NvcGUuJHdhdGNoKGlBdHRycy5yb3V0ZUhyZWYsIChuZXdVcmwpID0+IHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYgKFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgdXJsID0gbmV3VXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybCA9IGAjJHtuZXdVcmx9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaUVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZUhyZWYnLCAoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyByb3V0ZUhyZWZEaXJlY3RpdmUoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpO1xufSk7XG5cbi8vIEBUT0RPIG5vbmUgb2YgdGhlIGFuaW1hdGlvbiBjb2RlIGluIHRoaXMgZGlyZWN0aXZlIGhhcyBiZWVuIHRlc3RlZC4gTm90IHN1cmUgaWYgaXQgY2FuIGJlIGF0IHRoaXMgc3RhZ2UgVGhpcyBuZWVkcyBmdXJ0aGVyIGludmVzdGlnYXRpb24uXG4vLyBAVE9ETyB0aGlzIGNvZGUgZG9lcyB0b28gbXVjaCwgaXQgc2hvdWxkIGJlIHJlZmFjdG9yZWQuXG5cbmNsYXNzIHJvdXRlVmlld0RpcmVjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsICR0ZW1wbGF0ZVJlcXVlc3QsIFJvdXRlKSB7XG4gICAgdGhpcy5yZXN0cmljdCA9ICdFJztcbiAgICB0aGlzLnNjb3BlID0gZmFsc2U7XG4gICAgdGhpcy5yZXBsYWNlID0gdHJ1ZTtcbiAgICB0aGlzLnRlbXBsYXRlID0gJzxkaXY+PC9kaXY+JztcblxuICAgIHRoaXMubGluayA9ICh2aWV3RGlyZWN0aXZlU2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpID0+IHtcblxuICAgICAgY29uc29sZS5sb2coYGxpbmtpbmcgbmV3IHZpZXcgOiAke2lBdHRycy5uYW1lfWApXG5cbiAgICAgIGxldCB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgbGV0IHZpZXdTY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHZpZXcgPSBWaWV3QmluZGluZ3MuZ2V0VmlldyhpQXR0cnMubmFtZSk7XG4gICAgICBjb25zdCBiaW5kaW5ncyA9IHZpZXcuZ2V0QmluZGluZ3MoKTtcblxuICAgICAgaUVsZW1lbnQuYWRkQ2xhc3MoJ25nLWhpZGUnKTtcblxuICAgICAgbGV0IHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRGF0YUZvckJpbmRpbmcgPSBiaW5kaW5nID0+IF8uY2xvbmVEZWVwKFN0YXRlLmdldFN1YnNldChnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKGJpbmRpbmcpKSk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGZpZWxkKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9ICdjb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGJpbmRpbmdbZmllbGRdID8gJGluamVjdG9yLmdldChgJHtiaW5kaW5nW2ZpZWxkXX1EaXJlY3RpdmVgKVswXSA6IGJpbmRpbmc7XG4gICAgICAgIHJldHVybiBfLmRlZmF1bHRzKF8ucGljayhzb3VyY2UsIFsnY29udHJvbGxlcicsICd0ZW1wbGF0ZVVybCcsICdjb250cm9sbGVyQXMnXSksIHtjb250cm9sbGVyQXM6ICckY3RybCd9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpIHtcbiAgICAgICAgY29uc3QgcmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXTtcblxuICAgICAgICBmb3IgKGxldCByZXF1aXJlbWVudCBvZiBBcnJheS5mcm9tKHJlcXVpcmVkU3RhdGUpKSB7XG4gICAgICAgICAgbGV0IG5lZ2F0ZVJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgIGlmICgnIScgPT09IHJlcXVpcmVtZW50LmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgcmVxdWlyZW1lbnQgPSByZXF1aXJlbWVudC5zbGljZSgxKTtcbiAgICAgICAgICAgIG5lZ2F0ZVJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGVsZW1lbnQgPSBTdGF0ZS5nZXQocmVxdWlyZW1lbnQpO1xuXG4gICAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGlmIGVsZW1lbnQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgKChlbGVtZW50ID09PSBudWxsKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE9ubHkgY2hlY2sgdmFsdWUgb2YgZWxlbWVudCBpZiBpdCBpcyBkZWZpbmVkXG4gICAgICAgICAgaWYgKG5lZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgZWxlbWVudCA9ICFlbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmluZGluZy5jYW5BY3RpdmF0ZSkge1xuICAgICAgICAgIGlmICghJGluamVjdG9yLmludm9rZShiaW5kaW5nLmNhbkFjdGl2YXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtYW5hZ2VWaWV3KGVsZW1lbnQsIGJpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nQmluZGluZyA9IGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncyk7XG5cbiAgICAgICAgaWYgKCFtYXRjaGluZ0JpbmRpbmcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHtpQXR0cnMubmFtZX0gOiBtYW5hZ2VWaWV3IDogbm8gbWF0Y2hpbmcgYmluZGluZ2ApXG4gICAgICAgICAgaWYgKHZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveVZpZXcoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cblxuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IGdldFN0YXRlRGF0YUZvckJpbmRpbmcobWF0Y2hpbmdCaW5kaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coYCR7aUF0dHJzLm5hbWV9IDogbWFuYWdlVmlldyA6IG1hdGNoaW5nIGJpbmRpbmcgeWVpbGRzIHN0YXRlIDogJHtKU09OLnN0cmluZ2lmeShuZXdTdGF0ZSwge30sIDIpfWApXG4gICAgICAgIGlmICgobWF0Y2hpbmdCaW5kaW5nID09PSBwcmV2aW91c0JpbmRpbmcpICYmIGFuZ3VsYXIuZXF1YWxzKHByZXZpb3VzQm91bmRTdGF0ZSwgbmV3U3RhdGUpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7aUF0dHJzLm5hbWV9IDogbWFuYWdlVmlldyA6IGJpbmRpbmcgc3RhdGUgbWF0Y2hlcyBleGlzdGluZy4gQWJvcnRpbmdgKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZpb3VzQmluZGluZyA9IG1hdGNoaW5nQmluZGluZztcbiAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gbmV3U3RhdGU7XG5cbiAgICAgICAgUGVuZGluZ1ZpZXdDb3VudGVyLmluY3JlYXNlKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coYCR7aUF0dHJzLm5hbWV9IDogbWFuYWdlVmlldyA6IHJlc29sdmluZyBhbmQgc2hvd2luZyByZXNvbHZlIHRlbXBsYXRlYClcbiAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKGhhc1Jlc29sdmluZ1RlbXBsYXRlKSB7XG4gICAgICAgICAgLy8gQFRPRE86IE1hZ2ljIG51bWJlclxuICAgICAgICAgIGNvbnN0IGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uID0gaGFzUmVzb2x2aW5nVGVtcGxhdGUgPyAzMDAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHtpQXR0cnMubmFtZX0gOiBtYW5hZ2VWaWV3IDogcmVzb2x2ZSBkb25lLCBub3cgY3JlYXRpbmdWaWV3YClcbiAgICAgICAgICBpZiAoIXZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGFuaW1hdGUucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpIHtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20oYmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVzdHJveVZpZXcoZWxlbWVudCkge1xuICAgICAgICBpZiAodmlld0NyZWF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKS5yZW1vdmUoKTtcbiAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXcoZWxlbWVudCwgYmluZGluZywgbWluaW11bURlbGF5KSB7XG4gICAgICAgIGNvbnN0IHRpbWVTdGFydGVkTWFpblZpZXcgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nKTtcblxuICAgICAgICBjb25zdCBvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgICBpZiAoZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSAhPT0gYmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZpZXdDcmVhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGNvbnN0IHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lID0gRGF0ZS5ub3coKSAtIHRpbWVTdGFydGVkTWFpblZpZXc7XG5cbiAgICAgICAgICBjb25zdCBpbmplY3RNYWluVGVtcGxhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzaG93RXJyb3IoZSwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBnaXZlIHRoZSB2aWV3IHRpbWUgdG8gcHJvcGVybHkgaW5pdGlhbGlzZVxuICAgICAgICAgICAgICAvLyBiZWZvcmUgcG90ZW50aWFsbHkgdHJpZ2dlcmluZyB0aGUgaW50aWFsVmlld3NMb2FkZWQgZXZlbnRcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkgPSBNYXRoLm1heCgwLCBtaW5pbXVtRGVsYXkgLSByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSk7XG5cbiAgICAgICAgICBpZiAocmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiBpbmplY3RNYWluVGVtcGxhdGUoKVxuICAgICAgICAgICAgICAsIG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluamVjdE1haW5UZW1wbGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblJlc29sdXRpb25GYWlsdXJlID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgICRsb2cuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge3RlbXBsYXRlOiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCksIGRlcGVuZGVuY2llczogcmVzb2x2ZShiaW5kaW5nKX07XG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4ob25TdWNjZXNzZnVsUmVzb2x1dGlvbiwgb25SZXNvbHV0aW9uRmFpbHVyZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCB8fCAhYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgcmV0dXJuICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoJHJvb3RTY29wZS4kbmV3KCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmIChiaW5kaW5nLnJlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVybiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlID0gKGVsZW1lbnQsIGJpbmRpbmcpID0+IHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJyk7XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoYmluZGluZy5lcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLmVycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93RXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAnZXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCB0ZW1wbGF0ZUZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nW3RlbXBsYXRlRmllbGRdKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcbiAgICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgICBiaW5kaW5nQ29tcG9uZW50RmllbGQgPSAnZXJyb3JDb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYmluZGluZ1tiaW5kaW5nQ29tcG9uZW50RmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB7ZGVwZW5kZW5jaWVzOiB7ZXJyb3J9fTtcblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgYXJncy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpIHtcbiAgICAgICAgY29uc3Qge2RlcGVuZGVuY2llc30gPSBhcmdzO1xuICAgICAgICBjb25zdCB7dGVtcGxhdGV9ID0gYXJncztcblxuICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICBlbGVtZW50Lm9uKCckZGVzdHJveScsICgpID0+IHsgY29uc29sZS5sb2coYCR7aUF0dHJzLm5hbWV9OiBERVNUUk9ZIERFU1RST1kgb24gZWxlbWVudCBkZXN0cm95YCkgfSlcbiAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0gXy5tZXJnZShkZXBlbmRlbmNpZXMsIHskc2NvcGU6IHZpZXdTY29wZSwgJGVsZW1lbnQ6IGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKX0pO1xuXG4gICAgICAgICAgY29uc3QgY29udHJvbGxlciA9ICRjb250cm9sbGVyKGNvbXBvbmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICAgIGxvY2Fscy4kc2NvcGVbY29tcG9uZW50LmNvbnRyb2xsZXJBc10gPSBjb250cm9sbGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZSA9IGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7fSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgZGVwZW5kZW5jeU5hbWUgaW4gYmluZGluZy5yZXNvbHZlKSB7XG4gICAgICAgICAgY29uc3QgZGVwZW5kZW5jeUZhY3RvcnkgPSBiaW5kaW5nLnJlc29sdmVbZGVwZW5kZW5jeU5hbWVdO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkaW5qZWN0b3IuaW52b2tlKGRlcGVuZGVuY3lGYWN0b3J5KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkcS5yZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcyk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nID0gYmluZGluZyA9PiBfLnVuaW9uKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXSwgYmluZGluZy53YXRjaGVkU3RhdGUgfHwgW10pO1xuXG4gICAgICBmdW5jdGlvbiBzdHJpcE5lZ2F0aW9uUHJlZml4KHN0cikge1xuICAgICAgICBpZiAoc3RyLmNoYXJBdCgwKSA9PT0gJyEnKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3ID0gdmlldyA9PiBfLmZsYXR0ZW4oXy5tYXAodmlldy5nZXRCaW5kaW5ncygpLCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKSk7XG5cbiAgICAgIGNvbnN0IGdldEZpZWxkc1RvV2F0Y2ggPSB2aWV3ID0+IF8udW5pcShfLm1hcChnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3KHZpZXcpLCBzdHJpcE5lZ2F0aW9uUHJlZml4KSk7XG5cbiAgICAgIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc1RvV2F0Y2godmlldyk7XG5cbiAgICAgIHJldHVybiBSb3V0ZS53aGVuUmVhZHkoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAvLyBUcnkgdG8gc3RhcnQgdGhlIGJhbGwgcm9sbGluZyBpbiBjYXNlIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIGFuZCB3ZSBjYW4gY3JlYXRlIHRoZSB2aWV3IGltbWVkaWF0ZWx5XG4gICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gRG9uJ3QgYm90aGVyIHB1dHRpbmcgaW4gYSB3YXRjaGVyIGlmIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBldmVyIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgaWYgKGZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0ZVdhdGNoZXIgPSBmdW5jdGlvbiAoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2lBdHRycy5uYW1lfSA6IHN0YXRlV2F0Y2hlciBjYWxsZWQgd2l0aCBjaGFuZ2VkUGF0aDogJHtjaGFuZ2VkUGF0aH0sIG5ld1ZhbHVlOiAke0pTT04uc3RyaW5naWZ5KG5ld1ZhbHVlLCB7fSwgMil9LCAgb2xkVmFsdWU6ICR7SlNPTi5zdHJpbmdpZnkob2xkVmFsdWUsIHt9LCAyKX1gKVxuICAgICAgICAgIGlmICh2aWV3TWFuYWdlbWVudFBlbmRpbmcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2lBdHRycy5uYW1lfSA6IHN0YXRlV2F0Y2hlciBjYWxsZWQgcGVuZGluZyB0cnVlLiBBYm9ydGApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZmluaXNoIHRoZSBkaWdlc3QgY3ljbGUgYmVmb3JlIGJ1aWxkaW5nIHRoZSB2aWV3LCB3aGljaCBzaG91bGRcbiAgICAgICAgICAvLyBwcmV2ZW50IHVzIGZyb20gcmUtcmVuZGVyaW5nIGEgdmlldyBtdWx0aXBsZSB0aW1lcyBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzIG9mIHRoZSBzYW1lIHN0YXRlIGRlcGVuZGVuY3lcbiAgICAgICAgICAvLyBnZXQgY2hhbmdlZCB3aXRoIHJlcGVhdGVkIFN0YXRlLnNldCBjYWxsc1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke2lBdHRycy5uYW1lfSA6IHN0YXRlV2F0Y2hlciBjYWxsaW5nIG1hbmFnZVZpZXdgKTtcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIFN0YXRlLndhdGNoKGZpZWxkcywgc3RhdGVXYXRjaGVyKTtcblxuICAgICAgICB2aWV3RGlyZWN0aXZlU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IFN0YXRlLnJlbW92ZVdhdGNoZXIoc3RhdGVXYXRjaGVyKSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCd2aWV3JywgKCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsICR0ZW1wbGF0ZVJlcXVlc3QsIFJvdXRlKSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgcm91dGVWaWV3RGlyZWN0aXZlKCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsICR0ZW1wbGF0ZVJlcXVlc3QsIFJvdXRlKTtcbn0pO1xuXG5jbGFzcyBQZW5kaW5nVmlld0NvdW50ZXIge1xuICBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy4kcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50O1xuICB9XG5cbiAgaW5jcmVhc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQgKz0gMTtcbiAgfVxuXG4gIGRlY3JlYXNlKCkge1xuICAgIHRoaXMuY291bnQgPSBNYXRoLm1heCgwLCB0aGlzLmNvdW50IC0gMSk7XG4gICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgIGlmICghdGhpcy5pbml0aWFsVmlld3NMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5pbml0aWFsVmlld3NMb2FkZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmN1cnJlbnRWaWV3c0xvYWRlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnUGVuZGluZ1ZpZXdDb3VudGVyJywgKCRyb290U2NvcGUpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBQZW5kaW5nVmlld0NvdW50ZXIoJHJvb3RTY29wZSk7XG59KTtcblxuY2xhc3MgV2F0Y2hhYmxlTGlzdCB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnksIGxpc3QpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG5cbiAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgIHRoaXMud2F0Y2hlcnMgPSBbXTtcbiAgfVxuXG4gIGdldChwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHBhdGgpO1xuICB9XG5cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLmxpc3Q7XG4gIH1cblxuICBnZXRTdWJzZXQocGF0aHMpIHtcbiAgICByZXR1cm4gXy56aXBPYmplY3QocGF0aHMsIF8ubWFwKHBhdGhzLCB0aGlzLmdldC5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBzZXQocGF0aCwgdmFsdWUpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlci5zZXQodGhpcy5saXN0LCBwYXRoLCB2YWx1ZSk7XG4gICAgY29uc29sZS5ncm91cChgU3RhdGUuc2V0IGNhbGxpbmcgbm90aWZ5V2F0Y2hlcnM6ICR7cGF0aH1gKTtcbiAgICBjb25zb2xlLmxvZyhgbmV3IHZhbHVlOiAgOiAke0pTT04uc3RyaW5naWZ5KHZhbHVlLCB7fSwgMil9YCk7XG4gICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdmFsdWUpO1xuICAgIGNvbnNvbGUuZ3JvdXBFbmQoYFN0YXRlLnNldCBjYWxsaW5nIG5vdGlmeVdhdGNoZXJzOiAke3BhdGh9YClcbiAgfVxuXG4gIHVuc2V0KHBhdGhzKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLk9iamVjdEhlbHBlci51bnNldCh0aGlzLmxpc3QsIHBhdGgpO1xuICAgICAgY29uc29sZS5ncm91cChgU3RhdGUudW5zZXQgY2FsbGluZyBub3RpZnlXYXRjaGVyczogJHtwYXRofWApXG4gICAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB1bmRlZmluZWQpO1xuICAgICAgY29uc29sZS5ncm91cEVuZChgU3RhdGUudW5zZXQgY2FsbGluZyBub3RpZnlXYXRjaGVyczogJHtwYXRofWApXG4gICAgfSk7XG4gIH1cblxuICB3YXRjaChwYXRocywgaGFuZGxlcikge1xuICAgIGlmICghKHBhdGhzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBwYXRocyA9IFtwYXRoc107XG4gICAgfVxuXG4gICAgXyhwYXRocykuZWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy53YXRjaGVycy5wdXNoKHRoaXMuV2F0Y2hlckZhY3RvcnkuY3JlYXRlKHBhdGgsIGhhbmRsZXIsIHRoaXMuZ2V0KHBhdGgpKSk7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVXYXRjaGVyKHdhdGNoZXIpIHtcbiAgICBpZiAodGhpcy53YXRjaGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmV3V2F0Y2hlcnMgPSBbXTtcblxuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB0aGlzV2F0Y2hlciA9PiB7XG4gICAgICBpZiAodGhpc1dhdGNoZXIuaGFuZGxlciAhPT0gd2F0Y2hlcikge1xuICAgICAgICBuZXdXYXRjaGVycy5wdXNoKHRoaXNXYXRjaGVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLndhdGNoZXJzID0gbmV3V2F0Y2hlcnM7XG4gIH1cblxuICBfbm90aWZ5V2F0Y2hlcnMoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHdhdGNoZXIgPT4ge1xuICAgICAgaWYgKHdhdGNoZXIuc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkpIHtcbiAgICAgICAgY29uc29sZS5ncm91cChgV0Y6IG5vdGlmeWluZyB3YXRjaFBhdGg6ICR7d2F0Y2hlci53YXRjaFBhdGh9YClcbiAgICAgICAgY29uc29sZS5sb2coYGNoYW5nZVBhdGg6ICR7Y2hhbmdlZFBhdGh9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBvbGRWYWx1ZTogJHtKU09OLnN0cmluZ2lmeSh3YXRjaGVyLmN1cnJlbnRWYWx1ZSwge30sIDIpfWApO1xuICAgICAgICBjb25zb2xlLmxvZyhgbmV3VmFsdWU6ICR7SlNPTi5zdHJpbmdpZnkobmV3VmFsdWUsIHt9LCAyKX1gKTtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoZWRQYXRoID0gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgd2F0Y2hlci53YXRjaFBhdGgpO1xuICAgICAgICB3YXRjaGVyLm5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWVBdFdhdGNoZWRQYXRoKTtcbiAgICAgICAgY29uc29sZS5ncm91cEVuZChgV0Y6IG5vdGlmeWluZyB3YXRjaFBhdGg6ICR7d2F0Y2hlci53YXRjaFBhdGh9YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNvbnNvbGUuZ3JvdXAoYFdGOiBOT1Qgbm90aWZ5aW5nIHdhdGNoUGF0aDogJHt3YXRjaGVyLndhdGNoUGF0aH1gKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgY2hhbmdlUGF0aDogJHtjaGFuZ2VkUGF0aH1gKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYG9sZFZhbHVlOiAke0pTT04uc3RyaW5naWZ5KHdhdGNoZXIuY3VycmVudFZhbHVlLCB7fSwgMil9YCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBuZXdWYWx1ZTogJHtKU09OLnN0cmluZ2lmeShuZXdWYWx1ZSwge30sIDIpfWApO1xuICAgICAgICAvLyBjb25zb2xlLmdyb3VwRW5kKGBXRjogTk9UIG5vdGlmeWluZyB3YXRjaFBhdGg6ICR7d2F0Y2hlci53YXRjaFBhdGh9YClcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGFibGVMaXN0RmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG4gIH1cblxuICBjcmVhdGUobGlzdCA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0KHRoaXMuT2JqZWN0SGVscGVyLCB0aGlzLldhdGNoZXJGYWN0b3J5LCBsaXN0KTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoYWJsZUxpc3RGYWN0b3J5JywgKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0RmFjdG9yeShPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KTtcbn0pO1xuXG5jbGFzcyBXYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLndhdGNoUGF0aCA9IHdhdGNoUGF0aDtcbiAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAoaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIF90b2tlbml6ZVBhdGgocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJyk7XG4gIH1cblxuICBzaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgLy8gTkIgc2hvcnQgY2lyY3VpdCBsb2dpYyBpbiB0aGUgc2ltcGxlIGNhc2VcbiAgICBpZiAodGhpcy53YXRjaFBhdGggPT09IGNoYW5nZWRQYXRoKSB7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHRoaXMuY3VycmVudFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2F0Y2ggPSB7XG4gICAgICBwYXRoOiB0aGlzLndhdGNoUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKHRoaXMud2F0Y2hQYXRoKSxcbiAgICAgIHZhbHVlOiB0aGlzLmN1cnJlbnRWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBjaGFuZ2UgPSB7XG4gICAgICBwYXRoOiBjaGFuZ2VkUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKGNoYW5nZWRQYXRoKSxcbiAgICAgIHZhbHVlOiBuZXdWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBtaW5pbXVtTGVudGggPSBNYXRoLm1pbihjaGFuZ2UudG9rZW5zLmxlbmd0aCwgd2F0Y2gudG9rZW5zLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgdG9rZW5JbmRleCA9IDA7IHRva2VuSW5kZXggPCBtaW5pbXVtTGVudGg7IHRva2VuSW5kZXgrKykge1xuICAgICAgaWYgKHdhdGNoLnRva2Vuc1t0b2tlbkluZGV4XSAhPT0gY2hhbmdlLnRva2Vuc1t0b2tlbkluZGV4XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTkIgaWYgd2UgZ2V0IGhlcmUgdGhlbiBhbGwgY29tbW9uIHRva2VucyBtYXRjaFxuXG4gICAgY29uc3QgY2hhbmdlUGF0aElzRGVzY2VuZGFudCA9IGNoYW5nZS50b2tlbnMubGVuZ3RoID4gd2F0Y2gudG9rZW5zLmxlbmd0aDtcblxuICAgIGlmIChjaGFuZ2VQYXRoSXNEZXNjZW5kYW50KSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBjaGFuZ2UudG9rZW5zLnNsaWNlKHdhdGNoLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGggPSBfLmdldCh3YXRjaC52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMoY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCwgY2hhbmdlLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gd2F0Y2gudG9rZW5zLnNsaWNlKGNoYW5nZS50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hQYXRoID0gXy5nZXQoY2hhbmdlLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh3YXRjaC52YWx1ZSwgbmV3VmFsdWVBdFdhdGNoUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIHRoaXMuaGFuZGxlcihjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIHRoaXMuY3VycmVudFZhbHVlKTtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKG5ld1ZhbHVlKTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGVyRmFjdG9yeSB7XG4gIGNyZWF0ZSh3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hlcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGVyRmFjdG9yeScsICgpID0+IHtcbiAgcmV0dXJuIG5ldyBXYXRjaGVyRmFjdG9yeSgpO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1JvdXRlJywgZnVuY3Rpb24oT2JqZWN0SGVscGVyKSB7XG4gIFwibmdJbmplY3RcIjtcbiAgY29uc3QgdG9rZW5zID0ge307XG4gIGNvbnN0IHVybFdyaXRlcnMgPSBbXTtcbiAgY29uc3QgdXJscyA9IFtdO1xuICBjb25zdCBwZXJzaXN0ZW50U3RhdGVzID0gW107XG4gIGNvbnN0IHJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHR5cGVzID0ge307XG4gIGxldCBodG1sNU1vZGUgPSBmYWxzZTtcblxuICBjb25zdCBwcm92aWRlciA9IHtcblxuICAgIHJlZ2lzdGVyVHlwZShuYW1lLCBjb25maWcpIHtcbiAgICAgIHR5cGVzW25hbWVdID0gY29uZmlnO1xuICAgICAgdHlwZXNbbmFtZV0ucmVnZXggPSBuZXcgUmVnRXhwKHR5cGVzW25hbWVdLnJlZ2V4LnNvdXJjZSwgJ2knKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclR5cGUgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsVG9rZW4obmFtZSwgY29uZmlnKSB7XG4gICAgICB0b2tlbnNbbmFtZV0gPSBfLmV4dGVuZCh7bmFtZX0sIGNvbmZpZyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxUb2tlbiB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxXcml0ZXIobmFtZSwgZm4pIHtcbiAgICAgIHVybFdyaXRlcnNbbmFtZV0gPSBmbjtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFdyaXRlciB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmwocGF0dGVybiwgY29uZmlnID0ge30pIHtcbiAgICAgIGNvbnN0IHVybERhdGEgPSB7XG4gICAgICAgIGNvbXBpbGVkVXJsOiB0aGlzLl9jb21waWxlVXJsUGF0dGVybihwYXR0ZXJuLCBjb25maWcpLFxuICAgICAgICBwYXR0ZXJuXG4gICAgICB9O1xuXG4gICAgICB1cmxzLnB1c2goXy5leHRlbmQodXJsRGF0YSwgY29uZmlnKSk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmwgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHNldFBlcnNpc3RlbnRTdGF0ZXMoLi4uc3RhdGVMaXN0KSB7XG4gICAgICBfLmZvckVhY2goc3RhdGVMaXN0LCAoc3RhdGUpID0+IHtcbiAgICAgICAgaWYgKCFwZXJzaXN0ZW50U3RhdGVzLmluY2x1ZGVzKHN0YXRlKSkge1xuICAgICAgICAgIHBlcnNpc3RlbnRTdGF0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRIdG1sNU1vZGUobW9kZSkge1xuICAgICAgaHRtbDVNb2RlID0gbW9kZTtcbiAgICB9LFxuXG4gICAgX2NvbXBpbGVVcmxQYXR0ZXJuKHVybFBhdHRlcm4sIGNvbmZpZykge1xuICAgICAgbGV0IG1hdGNoO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnModXJsUGF0dGVybik7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHVybFBhdHRlcm4pO1xuXG4gICAgICBjb25zdCB0b2tlblJlZ2V4ID0gL1xceyhbQS1aYS16XFwuXzAtOV0rKVxcfS9nO1xuICAgICAgbGV0IHVybFJlZ2V4ID0gdXJsUGF0dGVybjtcblxuICAgICAgaWYgKCFjb25maWcucGFydGlhbE1hdGNoKSB7XG4gICAgICAgIHVybFJlZ2V4ID0gYF4ke3VybFJlZ2V4fSRgO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b2tlbkxpc3QgPSBbXTtcblxuICAgICAgd2hpbGUgKChtYXRjaCA9IHRva2VuUmVnZXguZXhlYyh1cmxQYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbbWF0Y2hbMV1dO1xuICAgICAgICB0b2tlbkxpc3QucHVzaCh0b2tlbik7XG4gICAgICAgIHVybFJlZ2V4ID0gdXJsUmVnZXgucmVwbGFjZShtYXRjaFswXSwgYCgke3R5cGVzW3Rva2VuLnR5cGVdLnJlZ2V4LnNvdXJjZX0pYCk7XG4gICAgICB9XG5cbiAgICAgIHVybFJlZ2V4LnJlcGxhY2UoJy4nLCAnXFxcXC4nKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyksXG4gICAgICAgIHRva2VuczogdG9rZW5MaXN0XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBfZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHN0cikge1xuICAgICAgaWYgKHN0ci5tYXRjaCgvXFwvJC8pKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwvJC8sICcvPycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGAke3N0cn0vP2A7XG4gICAgfSxcblxuICAgIF9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFwoXFwpXFwqXFwrXFw/XFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gICAgfSxcblxuICAgICRnZXQoJGxvY2F0aW9uLCAkaW5qZWN0b3IsICRxKSB7XG4gICAgICAnbmdJbmplY3QnO1xuXG4gICAgICAvLyBXaGVuIGdldHRpbmcgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHNlcnZpY2UgKG9ubHkgZG9uZSBvbmNlKSwgd2UgbmVlZCB0byBpdGVyYXRlIG92ZXIgdGhlIHVybFdyaXRlcnMgYW5kIHR1cm5cbiAgICAgIC8vIHRoZW0gaW50byBtZXRob2RzIHRoYXQgaW52b2tlIHRoZSBSRUFMIHVybFdyaXRlciwgYnV0IHByb3ZpZGluZyBkZXBlbmRlbmN5IGluamVjdGlvbiB0byBpdCwgd2hpbGUgYWxzb1xuICAgICAgLy8gZ2l2aW5nIGl0IHRoZSBkYXRhIHRoYXQgdGhlIGNhbGxlZSBwYXNzZXMgaW4uXG5cbiAgICAgIC8vIFRoZSByZWFzb24gd2UgaGF2ZSB0byBkbyB0aGlzIGhlcmUgaXMgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGUgJGluamVjdG9yIGJhY2sgaW4gdGhlIHJvdXRlUHJvdmlkZXIuXG5cbiAgICAgIF8uZm9ySW4odXJsV3JpdGVycywgKHdyaXRlciwgd3JpdGVyTmFtZSkgPT5cbiAgICAgICAgdXJsV3JpdGVyc1t3cml0ZXJOYW1lXSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBpZiAoIWRhdGEpIHsgZGF0YSA9IHt9OyB9XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0ge1VybERhdGE6IGRhdGF9O1xuICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKHdyaXRlciwge30sIGxvY2Fscyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGxldCBmbGFzaFN0YXRlcyA9IFtdO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0ge1xuICAgICAgICByZWFkeURlZmVycmVkOiAkcS5kZWZlcigpLFxuXG4gICAgICAgIG1hdGNoKHVybFRvTWF0Y2gpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHVybCBvZiBBcnJheS5mcm9tKHVybHMpKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gdXJsLmNvbXBpbGVkVXJsLnJlZ2V4LmV4ZWModXJsVG9NYXRjaCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7dXJsLCByZWdleE1hdGNoOiBtYXRjaH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REYXRhKG1hdGNoLCBzZWFyY2hEYXRhID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB0aGlzLmV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCk7XG4gICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuZXh0cmFjdFBhdGhEYXRhKG1hdGNoKTtcbiAgICAgICAgICBzZWFyY2hEYXRhID0gdGhpcy5leHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKTtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0SGVscGVyLmRlZmF1bHQoc2VhcmNoRGF0YSwgcGF0aCwgZGVmYXVsdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpIHtcbiAgICAgICAgICBpZiAoIXNlYXJjaERhdGEpIHsgc2VhcmNoRGF0YSA9ICRsb2NhdGlvbi5zZWFyY2goKTsgfVxuICAgICAgICAgIGNvbnN0IGRhdGEgPSBfLmNsb25lKHNlYXJjaERhdGEpO1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChkYXRhLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhcmdldEtleSA9IF8uZmluZEtleSh0b2tlbnMsIHsgc2VhcmNoQWxpYXM6IGtleSB9KTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0S2V5KSB7IHRhcmdldEtleSA9IGtleTsgfVxuXG4gICAgICAgICAgICBjb25zdCB0b2tlblR5cGVOYW1lID0gdG9rZW5zW3RhcmdldEtleV0gPyBfLmdldCh0b2tlbnNbdGFyZ2V0S2V5XSwgJ3R5cGUnKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICghdG9rZW5zW3RhcmdldEtleV0gfHwgKHR5cGVzW3Rva2VuVHlwZU5hbWVdLnJlZ2V4LnRlc3QodmFsdWUpKSkge1xuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0udHlwZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdHlwZVRva2VuVHlwZSA9IHRva2VuVHlwZSA/IHR5cGVzW3Rva2VuVHlwZV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZVBhcnNlZCA9IHR5cGVUb2tlblR5cGUgPyB0eXBlVG9rZW5UeXBlLnBhcnNlciA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICBpZiAodG9rZW5UeXBlUGFyc2VkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHRva2VuVHlwZVBhcnNlZCwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnN0YXRlUGF0aCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgZGF0YUtleSA9IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoIHx8IHRhcmdldEtleTtcblxuICAgICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KG5ld0RhdGEsIGRhdGFLZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChtYXRjaC51cmwuc3RhdGUsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsIGtleSwgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyBfLmNsb25lRGVlcCh2YWx1ZSkgOiB2YWx1ZSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFBhdGhEYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICAgIGNvbnN0IHBhdGhUb2tlbnMgPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zO1xuXG4gICAgICAgICAgaWYgKHBhdGhUb2tlbnMubGVuZ3RoID09PSAwKSB7IHJldHVybiB7fTsgfVxuXG4gICAgICAgICAgZm9yIChsZXQgbiA9IDAsIGVuZCA9IHBhdGhUb2tlbnMubGVuZ3RoLTEsIGFzYyA9IDAgPD0gZW5kOyBhc2MgPyBuIDw9IGVuZCA6IG4gPj0gZW5kOyBhc2MgPyBuKysgOiBuLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2Vuc1tuXTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG1hdGNoLnJlZ2V4TWF0Y2hbbisxXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlcikgeyB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7IH1cblxuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCAodG9rZW4uc3RhdGVQYXRoIHx8IHRva2VuLm5hbWUpLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVycygpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVycztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXIobmFtZSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXShkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnbyhuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gJGxvY2F0aW9uLnVybCh0aGlzLmludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGVyc2lzdGVudFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gcGVyc2lzdGVudFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkRmxhc2hTdGF0ZXMoLi4ubmV3U3RhdGVzKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBmbGFzaFN0YXRlcy5jb25jYXQobmV3U3RhdGVzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gZmxhc2hTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UmVhZHkocmVhZHkpIHtcbiAgICAgICAgICBpZiAoIXJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNSZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNIdG1sNU1vZGVFbmFibGVkKCkge1xuICAgICAgICAgIHJldHVybiBodG1sNU1vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2hlblJlYWR5KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5RGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICB9O1xuXG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbnVtZXJpYycsIHtyZWdleDogL1xcZCsvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiBwYXJzZUludCh0b2tlbildfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYWxwaGEnLCB7cmVnZXg6IC9bYS16QS1aXSsvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYW55Jywge3JlZ2V4OiAvLisvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbGlzdCcsIHtyZWdleDogLy4rLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gdG9rZW4uc3BsaXQoJywnKV19KTtcblxuICByZXR1cm4gcHJvdmlkZXI7XG59KTtcblxuY2xhc3MgU3RhdGVQcm92aWRlciB7XG4gICRnZXQoV2F0Y2hhYmxlTGlzdEZhY3RvcnkpIHtcbiAgICAnbmdJbmplY3QnO1xuICAgIHJldHVybiBXYXRjaGFibGVMaXN0RmFjdG9yeS5jcmVhdGUoKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdTdGF0ZScsIG5ldyBTdGF0ZVByb3ZpZGVyKTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignVmlld0JpbmRpbmdzJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCB2aWV3cyA9IFtdO1xuXG4gIGNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJpbmRpbmdzKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgaWYgKCEodGhpcy5iaW5kaW5ncyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0gW3RoaXMuYmluZGluZ3NdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEJpbmRpbmdzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3M7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIGJpbmQobmFtZSwgY29uZmlnKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShiaW5kaW5ncywgY29tbW9uUmVxdWlyZWRTdGF0ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoYmluZGluZy5yZXF1aXJlZFN0YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBbYmluZGluZy5yZXF1aXJlZFN0YXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goYmluZGluZy5yZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlLmNvbmNhdChjb21tb25SZXF1aXJlZFN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXNvbHZlKGJpbmRpbmdzLCBjb21tb25SZXNvbHZlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoISgncmVzb2x2ZScgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVzb2x2ZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChfLmRlZmF1bHRzKGJpbmRpbmcucmVzb2x2ZSwgY29tbW9uUmVzb2x2ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJhc2ljQ29tbW9uRmllbGRzID0gW1xuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JUZW1wbGF0ZVVybCd9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCBjb21tb25GaWVsZCBvZiBBcnJheS5mcm9tKGJhc2ljQ29tbW9uRmllbGRzKSkge1xuICAgICAgICAgIGlmIChjb21tb25GaWVsZC5uYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgZGVmYXVsdEJpbmRpbmdGaWVsZChuZXdCaW5kaW5ncywgY29tbW9uRmllbGQub3ZlcnJpZGVGaWVsZCwgY29uZmlnW2NvbW1vbkZpZWxkLm5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlcXVpcmVkU3RhdGUnIGluIGNvbmZpZykge1xuICAgICAgICAgIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXF1aXJlZFN0YXRlJ10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXNvbHZlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb21tb25SZXNvbHZlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlc29sdmUnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdEJpbmRpbmdGaWVsZChiaW5kaW5ncywgZmllbGROYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgIGlmICghKGZpZWxkTmFtZSBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgaXRlbSA9IGJpbmRpbmdbZmllbGROYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
