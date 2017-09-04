(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

routeViewFactory.$inject = ["$log", "$compile", "$controller", "ViewBindings", "$q", "State", "$rootScope", "$animate", "$timeout", "$injector", "PendingViewCounter", "$templateRequest", "Route"];
routeHrefFactory.$inject = ["Route", "$window", "$location", "$timeout"];
routeClassFactory.$inject = ["Route"];
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
  'ngInject';

  return {
    restrict: 'A',
    link: function link(scope, iElement, iAttrs) {
      scope.$watch(function () {
        var routeClassDefinition = scope.$eval(iAttrs['routeClass']);

        if (!Route.matchesCurrentBindingName(routeClassDefinition.viewName, routeClassDefinition.bindingName)) {
          if (iElement.hasClass(routeClassDefinition.className)) {
            iElement.removeClass(routeClassDefinition.className);
          }
        } else {
          if (!iElement.hasClass(routeClassDefinition.className)) {
            iElement.addClass(routeClassDefinition.className);
          }
        }
      });
    }
  };
}

angular.module('bicker_router').directive('routeClass', routeClassFactory);

function routeHrefFactory(Route, $window, $location, $timeout) {
  'ngInject';

  return {
    restrict: 'A',
    scope: true,
    link: function link(scope, iElement, iAttrs) {
      if (iAttrs.ignoreHref === undefined && Route.isHtml5ModeEnabled()) {
        iElement.click(function (event) {
          event.preventDefault();
          var urlPath = iElement.attr('href').replace(/^#/, '');
          return $timeout(function () {
            return $location.url(urlPath);
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
    }
  };
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
    link: function link(viewDirectiveScope, iElement, iAttrs) {
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
            Route.deleteCurrentBinding(view.name);
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

        Route.setCurrentBinding(view.name, binding);
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

          try {
            locals.$scope[component.controllerAs] = $controller(component.controller, locals);
          } catch (error) {
            var errorMessage = void 0;

            try {
              if (_.isObject(error)) {
                errorMessage = JSON.stringify(error);
              } else {
                errorMessage = error;
              }
            } catch (jsonError) {
              errorMessage = 'Failed to serialize error object for logging';
            }

            $log.error('Failed instantiating controller for view ' + view + ': ' + errorMessage);
            throw error;
          }
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
    }
  };
}

angular.module('bicker_router').directive('view', routeViewFactory);

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
        currentBindings: {},
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
        setCurrentBinding: function setCurrentBinding(viewName, binding) {
          this.currentBindings[viewName] = binding;
        },
        getCurrentBinding: function getCurrentBinding(viewName) {
          return this.currentBindings[viewName];
        },
        deleteCurrentBinding: function deleteCurrentBinding(viewName) {
          delete this.currentBindings[viewName];
        },
        matchesCurrentBindingName: function matchesCurrentBindingName(viewName, bindingNameExpression) {
          var currentBinding = this.getCurrentBinding(viewName);

          if (!currentBinding) {
            return false;
          }

          return bindingNameExpression instanceof RegExp ? bindingNameExpression.test(currentBinding.name) : currentBinding.name === bindingNameExpression;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWlCLENBQWhDLEFBQWdDLEFBQUMsY0FBakMsQUFBK0Msd0ZBQUksVUFBQSxBQUFVLE9BQVYsQUFBaUIsT0FBakIsQUFBd0IsV0FBeEIsQUFBbUMsWUFBbkMsQUFBK0MsY0FBL0MsQUFBNkQsb0JBQW9CLEFBQ2xJO0FBRUE7O01BQUksU0FBSixBQUFhLEFBQ2I7YUFBQSxBQUFXLElBQVgsQUFBZSx3QkFBd0IsWUFBWSxBQUNqRDtRQUFJLE1BQUosQUFBSSxBQUFNLFdBQVcsQUFDbkI7WUFBQSxBQUFNLFNBQU4sQUFBZSxBQUNoQjtBQUNGO0FBSkQsQUFNQTs7YUFBQSxBQUFXLElBQVgsQUFBZSwwQkFBMEIsVUFBQSxBQUFVLEdBQVYsQUFBYSxRQUFRLEFBQzVEO0FBQ0E7UUFBSSxZQUFKLEFBQ0E7UUFBSSxXQUFKLEFBQWUsUUFBUSxBQUNyQjtBQUNEO0FBRUQ7O2FBQUEsQUFBUyxBQUVUOzt1QkFBQSxBQUFtQixBQUNuQjtRQUFNLFFBQVEsTUFBQSxBQUFNLE1BQU0sVUFBMUIsQUFBYyxBQUFZLEFBQVUsQUFFcEM7O1FBQUksQ0FBSixBQUFLLE9BQU8sQUFDVjthQUFBLEFBQU8sQUFDUjtBQUZELFdBRU8sQUFDTDthQUFPLE1BQUEsQUFBTSxZQUFiLEFBQU8sQUFBa0IsQUFDMUI7QUFFRDs7UUFBSSxnQkFBZ0IsYUFBQSxBQUFhLE1BQU0sTUFBbkIsQUFBeUIsTUFBN0MsQUFBb0IsQUFBK0IsQUFDbkQ7b0JBQWdCLEVBQUEsQUFBRSxXQUFGLEFBQWEsZUFBZSxNQUFBLEFBQU0sc0JBQU4sQUFBNEIsT0FBTyxNQUEvRSxBQUFnQixBQUE0QixBQUFtQyxBQUFNLEFBRXJGOztRQUFNLFlB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b24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJywgWyduZ0FuaW1hdGUnXSkucnVuKGZ1bmN0aW9uIChTdGF0ZSwgUm91dGUsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgT2JqZWN0SGVscGVyLCBQZW5kaW5nVmlld0NvdW50ZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuXG4gIGxldCBvbGRVcmwgPSB1bmRlZmluZWQ7XG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoUm91dGUuaXNSZWFkeSgpKSB7XG4gICAgICBSb3V0ZS5zZXRSZWFkeShmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uIChlLCBuZXdVcmwpIHtcbiAgICAvLyBXb3JrLWFyb3VuZCBmb3IgQW5ndWxhckpTIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvaXNzdWVzLzgzNjhcbiAgICBsZXQgZGF0YTtcbiAgICBpZiAobmV3VXJsID09PSBvbGRVcmwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvbGRVcmwgPSBuZXdVcmw7XG5cbiAgICBQZW5kaW5nVmlld0NvdW50ZXIucmVzZXQoKTtcbiAgICBjb25zdCBtYXRjaCA9IFJvdXRlLm1hdGNoKCRsb2NhdGlvbi5wYXRoKCkpO1xuXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gUm91dGUuZXh0cmFjdERhdGEobWF0Y2gpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHNUb1Vuc2V0ID0gT2JqZWN0SGVscGVyLm5vdEluKFN0YXRlLmxpc3QsIGRhdGEpO1xuICAgIGZpZWxkc1RvVW5zZXQgPSBfLmRpZmZlcmVuY2UoZmllbGRzVG9VbnNldCwgUm91dGUuZ2V0UGVyc2lzdGVudFN0YXRlcygpLmNvbmNhdChSb3V0ZS5nZXRGbGFzaFN0YXRlcygpKSk7XG5cbiAgICBjb25zdCBldmVudERhdGEgPSB7dW5zZXR0aW5nOiBmaWVsZHNUb1Vuc2V0LCBzZXR0aW5nOiBkYXRhfTtcblxuICAgICRyb290U2NvcGUuJGVtaXQoJ2JpY2tlcl9yb3V0ZXIuYmVmb3JlU3RhdGVDaGFuZ2UnLCBldmVudERhdGEpO1xuXG4gICAgaWYgKChldmVudERhdGEudW5zZXR0aW5nKS5sZW5ndGggIT09IDApIHtcbiAgICAgIFN0YXRlLnVuc2V0KGV2ZW50RGF0YS51bnNldHRpbmcpO1xuICAgIH1cblxuICAgIF8uZm9yRWFjaChldmVudERhdGEuc2V0dGluZywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIFJvdXRlLnJlc2V0Rmxhc2hTdGF0ZXMoKTtcbiAgICBSb3V0ZS5zZXRSZWFkeSh0cnVlKTtcbiAgfSk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5jb25zdGFudCgnT2JqZWN0SGVscGVyJywge1xuICBnZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XTtcbiAgfSxcblxuICBzZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIGlmIChwYXJlbnRbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJlbnRbc2VnbWVudF0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XSA9IHZhbHVlO1xuICB9LFxuXG4gIHVuc2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cblxuICAgIGlmIChwYXJlbnRba2V5XSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGRlbGV0ZSBwYXJlbnRba2V5XTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICAvLyBSZWN1cnNpdmVseSByZXR1cm4gdGhlIHByb3BlcnRpZXMgaW4gYSB0aGF0IGFyZW4ndCBpbiBiXG4gIG5vdEluKGEsIGIsIHByZWZpeCA9ICcnKSB7XG4gICAgbGV0IG5vdEluID0gW107XG4gICAgcHJlZml4ID0gcHJlZml4Lmxlbmd0aCA+IDAgPyBgJHtwcmVmaXh9LmAgOiAnJztcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIEFycmF5LmZyb20oT2JqZWN0LmtleXMoYSkpKSB7XG4gICAgICBjb25zdCB0aGlzUGF0aCA9IGAke3ByZWZpeH0ke2tleX1gO1xuXG4gICAgICBpZiAoYltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm90SW4ucHVzaCh0aGlzUGF0aCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBhW2tleV0gPT09ICdvYmplY3QnKSAmJiAoIShhW2tleV0gaW5zdGFuY2VvZiBBcnJheSkpKSB7XG4gICAgICAgIG5vdEluID0gbm90SW4uY29uY2F0KHRoaXMubm90SW4oYVtrZXldLCBiW2tleV0sIHRoaXNQYXRoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdEluO1xuICB9LFxuXG4gIGRlZmF1bHQob3ZlcnJpZGVzLCAuLi5kZWZhdWx0U2V0cykge1xuICAgIGxldCBkZWZhdWx0U2V0LCB2YWx1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgIGlmIChkZWZhdWx0U2V0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGRlZmF1bHRTZXQgPSBkZWZhdWx0U2V0c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFNldCA9IHRoaXMuZGVmYXVsdCguLi5BcnJheS5mcm9tKGRlZmF1bHRTZXRzIHx8IFtdKSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGVmYXVsdFNldCkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0U2V0W2tleV07XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIG92ZXJyaWRlc1trZXldID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMuZGVmYXVsdChvdmVycmlkZXNba2V5XSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvdmVycmlkZXMpIHtcbiAgICAgIHZhbHVlID0gb3ZlcnJpZGVzW2tleV07XG4gICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldIHx8IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuXG5cbi8vIFVzYWdlOlxuLy9cbi8vIElmIHlvdSB3YW50IHRvIGFkZCB0aGUgY2xhc3MgXCJhY3RpdmVcIiB0byBhbiBhbmNob3IgZWxlbWVudCB3aGVuIHRoZSBcIm1haW5cIiB2aWV3IGhhcyBhIGJpbmRpbmdcbi8vIHdpdGggdGhlIG5hbWUgXCJteUJpbmRpbmdcIiByZW5kZXJlZCB3aXRoaW4gaXRcbi8vXG4vLyA8YSByb3V0ZS1jbGFzcz1cInsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6ICdteUJpbmRpbmcnIH1cIj5BbmNob3IgdGV4dDwvYT5cbi8vXG4vLyBZb3UgY2FuIGFsc28gdXNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHRoZSBiaW5kaW5nIG5hbWUsIGJ1dCB0byBkbyBzbyB5b3UgaGF2ZSB0byBwcm92aWRlIGEgbWV0aG9kXG4vLyBvbiB5b3VyIGNvbnRyb2xsZXIgd2hpY2ggcmV0dXJucyB0aGUgcm91dGUgY2xhc3MgZGVmaW5pdGlvbiBvYmplY3QsIGJlY2F1c2UgQW5ndWxhckpTIGV4cHJlc3Npb25zXG4vLyBkb24ndCBzdXBwb3J0IGlubGluZSByZWd1bGFyIGV4cHJlc3Npb25zXG4vL1xuLy8gY2xhc3MgTXlDb250cm9sbGVyIHtcbi8vICBnZXRSb3V0ZUNsYXNzT2JqZWN0KCkge1xuLy8gICAgcmV0dXJuIHsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6IC9teUJpbmQvIH1cbi8vICB9XG4vLyB9XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCIkY3RybC5nZXRSb3V0ZUNsYXNzT2JqZWN0KClcIj5BbmNob3IgdGV4dDwvYT5cbi8vXG5cbmZ1bmN0aW9uIHJvdXRlQ2xhc3NGYWN0b3J5KFJvdXRlKSB7XG4gICduZ0luamVjdCdcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goKCkgPT4ge1xuICAgICAgICBjb25zdCByb3V0ZUNsYXNzRGVmaW5pdGlvbiA9IHNjb3BlLiRldmFsKGlBdHRyc1sncm91dGVDbGFzcyddKVxuXG4gICAgICAgIGlmICghUm91dGUubWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZShyb3V0ZUNsYXNzRGVmaW5pdGlvbi52aWV3TmFtZSwgcm91dGVDbGFzc0RlZmluaXRpb24uYmluZGluZ05hbWUpKSB7XG4gICAgICAgICAgaWYgKGlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5hZGRDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVDbGFzcycsIHJvdXRlQ2xhc3NGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVIcmVmRmFjdG9yeSAoUm91dGUsICR3aW5kb3csICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0J1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBzY29wZTogdHJ1ZSxcbiAgICBsaW5rIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgaWYgKGlBdHRycy5pZ25vcmVIcmVmID09PSB1bmRlZmluZWQgJiYgUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgaUVsZW1lbnQuY2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgdXJsUGF0aCA9IGlFbGVtZW50LmF0dHIoJ2hyZWYnKS5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiAkbG9jYXRpb24udXJsKHVybFBhdGgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgY29uc3Qgd3JpdGVyID0gb2JqZWN0W3dyaXRlck5hbWVdO1xuICAgICAgICBzY29wZVtgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gd3JpdGVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2NvcGUuJHdhdGNoKGlBdHRycy5yb3V0ZUhyZWYsIChuZXdVcmwpID0+IHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYgKFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgdXJsID0gbmV3VXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybCA9IGAjJHtuZXdVcmx9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaUVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlSHJlZicsIHJvdXRlSHJlZkZhY3RvcnkpO1xuXG4vLyBAVE9ETyBub25lIG9mIHRoZSBhbmltYXRpb24gY29kZSBpbiB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiB0ZXN0ZWQuIE5vdCBzdXJlIGlmIGl0IGNhbiBiZSBhdCB0aGlzIHN0YWdlIFRoaXMgbmVlZHMgZnVydGhlciBpbnZlc3RpZ2F0aW9uLlxuLy8gQFRPRE8gdGhpcyBjb2RlIGRvZXMgdG9vIG11Y2gsIGl0IHNob3VsZCBiZSByZWZhY3RvcmVkLlxuXG5mdW5jdGlvbiByb3V0ZVZpZXdGYWN0b3J5KCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsICR0ZW1wbGF0ZVJlcXVlc3QsIFJvdXRlKSB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZTogZmFsc2UsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXY+PC9kaXY+JyxcbiAgICBsaW5rICh2aWV3RGlyZWN0aXZlU2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGxldCB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgbGV0IHZpZXdTY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHZpZXcgPSBWaWV3QmluZGluZ3MuZ2V0VmlldyhpQXR0cnMubmFtZSk7XG4gICAgICBjb25zdCBiaW5kaW5ncyA9IHZpZXcuZ2V0QmluZGluZ3MoKTtcblxuICAgICAgaUVsZW1lbnQuYWRkQ2xhc3MoJ25nLWhpZGUnKTtcblxuICAgICAgbGV0IHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRGF0YUZvckJpbmRpbmcgPSBiaW5kaW5nID0+IF8uY2xvbmVEZWVwKFN0YXRlLmdldFN1YnNldChnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKGJpbmRpbmcpKSk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGZpZWxkKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9ICdjb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGJpbmRpbmdbZmllbGRdID8gJGluamVjdG9yLmdldChgJHtiaW5kaW5nW2ZpZWxkXX1EaXJlY3RpdmVgKVswXSA6IGJpbmRpbmc7XG4gICAgICAgIHJldHVybiBfLmRlZmF1bHRzKF8ucGljayhzb3VyY2UsIFsnY29udHJvbGxlcicsICd0ZW1wbGF0ZVVybCcsICdjb250cm9sbGVyQXMnXSksIHtjb250cm9sbGVyQXM6ICckY3RybCd9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpIHtcbiAgICAgICAgY29uc3QgcmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXTtcblxuICAgICAgICBmb3IgKGxldCByZXF1aXJlbWVudCBvZiBBcnJheS5mcm9tKHJlcXVpcmVkU3RhdGUpKSB7XG4gICAgICAgICAgbGV0IG5lZ2F0ZVJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgIGlmICgnIScgPT09IHJlcXVpcmVtZW50LmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgcmVxdWlyZW1lbnQgPSByZXF1aXJlbWVudC5zbGljZSgxKTtcbiAgICAgICAgICAgIG5lZ2F0ZVJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGVsZW1lbnQgPSBTdGF0ZS5nZXQocmVxdWlyZW1lbnQpO1xuXG4gICAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGlmIGVsZW1lbnQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgKChlbGVtZW50ID09PSBudWxsKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE9ubHkgY2hlY2sgdmFsdWUgb2YgZWxlbWVudCBpZiBpdCBpcyBkZWZpbmVkXG4gICAgICAgICAgaWYgKG5lZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgZWxlbWVudCA9ICFlbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmluZGluZy5jYW5BY3RpdmF0ZSkge1xuICAgICAgICAgIGlmICghJGluamVjdG9yLmludm9rZShiaW5kaW5nLmNhbkFjdGl2YXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtYW5hZ2VWaWV3KGVsZW1lbnQsIGJpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nQmluZGluZyA9IGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncyk7XG5cbiAgICAgICAgaWYgKCFtYXRjaGluZ0JpbmRpbmcpIHtcbiAgICAgICAgICBpZiAodmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBkZXN0cm95VmlldyhlbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgUm91dGUuZGVsZXRlQ3VycmVudEJpbmRpbmcodmlldy5uYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IGdldFN0YXRlRGF0YUZvckJpbmRpbmcobWF0Y2hpbmdCaW5kaW5nKTtcbiAgICAgICAgaWYgKChtYXRjaGluZ0JpbmRpbmcgPT09IHByZXZpb3VzQmluZGluZykgJiYgYW5ndWxhci5lcXVhbHMocHJldmlvdXNCb3VuZFN0YXRlLCBuZXdTdGF0ZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSBtYXRjaGluZ0JpbmRpbmc7XG4gICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IG5ld1N0YXRlO1xuXG4gICAgICAgIFBlbmRpbmdWaWV3Q291bnRlci5pbmNyZWFzZSgpO1xuXG4gICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChoYXNSZXNvbHZpbmdUZW1wbGF0ZSkge1xuICAgICAgICAgIC8vIEBUT0RPOiBNYWdpYyBudW1iZXJcbiAgICAgICAgICBjb25zdCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbiA9IGhhc1Jlc29sdmluZ1RlbXBsYXRlID8gMzAwIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgaWYgKCF2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuICRhbmltYXRlLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSB7XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKGJpbmRpbmdzKSkge1xuICAgICAgICAgIGlmIChoYXNSZXF1aXJlZERhdGEoYmluZGluZykpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lWaWV3KGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHZpZXdDcmVhdGVkID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCkucmVtb3ZlKCk7XG4gICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVWaWV3KGVsZW1lbnQsIGJpbmRpbmcsIG1pbmltdW1EZWxheSkge1xuICAgICAgICBjb25zdCB0aW1lU3RhcnRlZE1haW5WaWV3ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZyk7XG5cbiAgICAgICAgY29uc3Qgb25TdWNjZXNzZnVsUmVzb2x1dGlvbiA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgaWYgKGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykgIT09IGJpbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2aWV3Q3JlYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICBjb25zdCByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA9IERhdGUubm93KCkgLSB0aW1lU3RhcnRlZE1haW5WaWV3O1xuXG4gICAgICAgICAgY29uc3QgaW5qZWN0TWFpblRlbXBsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yKGUsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZ2l2ZSB0aGUgdmlldyB0aW1lIHRvIHByb3Blcmx5IGluaXRpYWxpc2VcbiAgICAgICAgICAgICAgLy8gYmVmb3JlIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgdGhlIGludGlhbFZpZXdzTG9hZGVkIGV2ZW50XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5ID0gTWF0aC5tYXgoMCwgbWluaW11bURlbGF5IC0gcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lIDwgbWluaW11bURlbGF5KSB7XG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gaW5qZWN0TWFpblRlbXBsYXRlKClcbiAgICAgICAgICAgICAgLCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmplY3RNYWluVGVtcGxhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25SZXNvbHV0aW9uRmFpbHVyZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkbG9nLmVycm9yKGVycm9yKTtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfTtcblxuICAgICAgICBSb3V0ZS5zZXRDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUsIGJpbmRpbmcpXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge3RlbXBsYXRlOiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCksIGRlcGVuZGVuY2llczogcmVzb2x2ZShiaW5kaW5nKX07XG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4ob25TdWNjZXNzZnVsUmVzb2x1dGlvbiwgb25SZXNvbHV0aW9uRmFpbHVyZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCB8fCAhYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgcmV0dXJuICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoJHJvb3RTY29wZS4kbmV3KCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmIChiaW5kaW5nLnJlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVybiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlID0gKGVsZW1lbnQsIGJpbmRpbmcpID0+IHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJyk7XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoYmluZGluZy5lcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLmVycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93RXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAnZXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCB0ZW1wbGF0ZUZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nW3RlbXBsYXRlRmllbGRdKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcbiAgICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgICBiaW5kaW5nQ29tcG9uZW50RmllbGQgPSAnZXJyb3JDb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYmluZGluZ1tiaW5kaW5nQ29tcG9uZW50RmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB7ZGVwZW5kZW5jaWVzOiB7ZXJyb3J9fTtcblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgYXJncy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpIHtcbiAgICAgICAgY29uc3Qge2RlcGVuZGVuY2llc30gPSBhcmdzO1xuICAgICAgICBjb25zdCB7dGVtcGxhdGV9ID0gYXJncztcblxuICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcblxuICAgICAgICBpZiAoY29tcG9uZW50LmNvbnRyb2xsZXIpIHtcbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSBfLm1lcmdlKGRlcGVuZGVuY2llcywgeyRzY29wZTogdmlld1Njb3BlLCAkZWxlbWVudDogZWxlbWVudC5jaGlsZHJlbigpLmVxKDApfSk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxzLiRzY29wZVtjb21wb25lbnQuY29udHJvbGxlckFzXSA9ICRjb250cm9sbGVyKGNvbXBvbmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KGVycm9yKSkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gJ0ZhaWxlZCB0byBzZXJpYWxpemUgZXJyb3Igb2JqZWN0IGZvciBsb2dnaW5nJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGxvZy5lcnJvcihgRmFpbGVkIGluc3RhbnRpYXRpbmcgY29udHJvbGxlciBmb3IgdmlldyAke3ZpZXd9OiAke2Vycm9yTWVzc2FnZX1gKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc29sdmUgPSBmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe30pO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVuY3lOYW1lIGluIGJpbmRpbmcucmVzb2x2ZSkge1xuICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lGYWN0b3J5ID0gYmluZGluZy5yZXNvbHZlW2RlcGVuZGVuY3lOYW1lXTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJGluamVjdG9yLmludm9rZShkZXBlbmRlbmN5RmFjdG9yeSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJHEucmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyA9IGJpbmRpbmcgPT4gXy51bmlvbihiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW10sIGJpbmRpbmcud2F0Y2hlZFN0YXRlIHx8IFtdKTtcblxuICAgICAgZnVuY3Rpb24gc3RyaXBOZWdhdGlvblByZWZpeChzdHIpIHtcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoMCkgPT09ICchJykge1xuICAgICAgICAgIHJldHVybiBzdHIuc3Vic3RyKDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyA9IHZpZXcgPT4gXy5mbGF0dGVuKF8ubWFwKHZpZXcuZ2V0QmluZGluZ3MoKSwgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZykpO1xuXG4gICAgICBjb25zdCBnZXRGaWVsZHNUb1dhdGNoID0gdmlldyA9PiBfLnVuaXEoXy5tYXAoZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyh2aWV3KSwgc3RyaXBOZWdhdGlvblByZWZpeCkpO1xuXG4gICAgICBjb25zdCBmaWVsZHMgPSBnZXRGaWVsZHNUb1dhdGNoKHZpZXcpO1xuXG4gICAgICByZXR1cm4gUm91dGUud2hlblJlYWR5KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgLy8gVHJ5IHRvIHN0YXJ0IHRoZSBiYWxsIHJvbGxpbmcgaW4gY2FzZSB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyBhbmQgd2UgY2FuIGNyZWF0ZSB0aGUgdmlldyBpbW1lZGlhdGVseVxuICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIERvbid0IGJvdGhlciBwdXR0aW5nIGluIGEgd2F0Y2hlciBpZiB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgZXZlciB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50XG4gICAgICAgIGlmIChmaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdGVXYXRjaGVyID0gZnVuY3Rpb24gKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAodmlld01hbmFnZW1lbnRQZW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBmaW5pc2ggdGhlIGRpZ2VzdCBjeWNsZSBiZWZvcmUgYnVpbGRpbmcgdGhlIHZpZXcsIHdoaWNoIHNob3VsZFxuICAgICAgICAgIC8vIHByZXZlbnQgdXMgZnJvbSByZS1yZW5kZXJpbmcgYSB2aWV3IG11bHRpcGxlIHRpbWVzIGlmIG11bHRpcGxlIHByb3BlcnRpZXMgb2YgdGhlIHNhbWUgc3RhdGUgZGVwZW5kZW5jeVxuICAgICAgICAgIC8vIGdldCBjaGFuZ2VkIHdpdGggcmVwZWF0ZWQgU3RhdGUuc2V0IGNhbGxzXG4gICAgICAgICAgcmV0dXJuICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHJldHVybiB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBTdGF0ZS53YXRjaChmaWVsZHMsIHN0YXRlV2F0Y2hlcik7XG5cbiAgICAgICAgdmlld0RpcmVjdGl2ZVNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiBTdGF0ZS5yZW1vdmVXYXRjaGVyKHN0YXRlV2F0Y2hlcikpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCd2aWV3Jywgcm91dGVWaWV3RmFjdG9yeSk7XG5cbmNsYXNzIFBlbmRpbmdWaWV3Q291bnRlciB7XG4gIGNvbnN0cnVjdG9yKCRyb290U2NvcGUpIHtcbiAgICB0aGlzLiRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gIH1cblxuICBpbmNyZWFzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudCArPSAxO1xuICB9XG5cbiAgZGVjcmVhc2UoKSB7XG4gICAgdGhpcy5jb3VudCA9IE1hdGgubWF4KDAsIHRoaXMuY291bnQgLSAxKTtcbiAgICBpZiAodGhpcy5jb3VudCA9PT0gMCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCkge1xuICAgICAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmluaXRpYWxWaWV3c0xvYWRlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuY3VycmVudFZpZXdzTG9hZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdQZW5kaW5nVmlld0NvdW50ZXInLCAoJHJvb3RTY29wZSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFBlbmRpbmdWaWV3Q291bnRlcigkcm9vdFNjb3BlKTtcbn0pO1xuXG5jbGFzcyBXYXRjaGFibGVMaXN0IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSwgbGlzdCkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcblxuICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgdGhpcy53YXRjaGVycyA9IFtdO1xuICB9XG5cbiAgZ2V0KHBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gIH1cblxuICBnZXRBbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdDtcbiAgfVxuXG4gIGdldFN1YnNldChwYXRocykge1xuICAgIHJldHVybiBfLnppcE9iamVjdChwYXRocywgXy5tYXAocGF0aHMsIHRoaXMuZ2V0LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIHNldChwYXRoLCB2YWx1ZSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyLnNldCh0aGlzLmxpc3QsIHBhdGgsIHZhbHVlKTtcbiAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB2YWx1ZSk7XG4gIH1cblxuICB1bnNldChwYXRocykge1xuICAgIGlmICghKHBhdGhzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBwYXRocyA9IFtwYXRoc107XG4gICAgfVxuXG4gICAgXyhwYXRocykuZWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy5PYmplY3RIZWxwZXIudW5zZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cblxuICB3YXRjaChwYXRocywgaGFuZGxlcikge1xuICAgIGlmICghKHBhdGhzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBwYXRocyA9IFtwYXRoc107XG4gICAgfVxuXG4gICAgXyhwYXRocykuZWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy53YXRjaGVycy5wdXNoKHRoaXMuV2F0Y2hlckZhY3RvcnkuY3JlYXRlKHBhdGgsIGhhbmRsZXIsIHRoaXMuZ2V0KHBhdGgpKSk7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVXYXRjaGVyKHdhdGNoZXIpIHtcbiAgICBpZiAodGhpcy53YXRjaGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmV3V2F0Y2hlcnMgPSBbXTtcblxuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB0aGlzV2F0Y2hlciA9PiB7XG4gICAgICBpZiAodGhpc1dhdGNoZXIuaGFuZGxlciAhPT0gd2F0Y2hlcikge1xuICAgICAgICBuZXdXYXRjaGVycy5wdXNoKHRoaXNXYXRjaGVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLndhdGNoZXJzID0gbmV3V2F0Y2hlcnM7XG4gIH1cblxuICBfbm90aWZ5V2F0Y2hlcnMoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHdhdGNoZXIgPT4ge1xuICAgICAgaWYgKHdhdGNoZXIuc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoZWRQYXRoID0gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgd2F0Y2hlci53YXRjaFBhdGgpO1xuICAgICAgICB3YXRjaGVyLm5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWVBdFdhdGNoZWRQYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGFibGVMaXN0RmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG4gIH1cblxuICBjcmVhdGUobGlzdCA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0KHRoaXMuT2JqZWN0SGVscGVyLCB0aGlzLldhdGNoZXJGYWN0b3J5LCBsaXN0KTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoYWJsZUxpc3RGYWN0b3J5JywgKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0RmFjdG9yeShPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KTtcbn0pO1xuXG5jbGFzcyBXYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLndhdGNoUGF0aCA9IHdhdGNoUGF0aDtcbiAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAoaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIF90b2tlbml6ZVBhdGgocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJyk7XG4gIH1cblxuICBzaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgLy8gTkIgc2hvcnQgY2lyY3VpdCBsb2dpYyBpbiB0aGUgc2ltcGxlIGNhc2VcbiAgICBpZiAodGhpcy53YXRjaFBhdGggPT09IGNoYW5nZWRQYXRoKSB7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHRoaXMuY3VycmVudFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2F0Y2ggPSB7XG4gICAgICBwYXRoOiB0aGlzLndhdGNoUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKHRoaXMud2F0Y2hQYXRoKSxcbiAgICAgIHZhbHVlOiB0aGlzLmN1cnJlbnRWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBjaGFuZ2UgPSB7XG4gICAgICBwYXRoOiBjaGFuZ2VkUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKGNoYW5nZWRQYXRoKSxcbiAgICAgIHZhbHVlOiBuZXdWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBtaW5pbXVtTGVudGggPSBNYXRoLm1pbihjaGFuZ2UudG9rZW5zLmxlbmd0aCwgd2F0Y2gudG9rZW5zLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgdG9rZW5JbmRleCA9IDA7IHRva2VuSW5kZXggPCBtaW5pbXVtTGVudGg7IHRva2VuSW5kZXgrKykge1xuICAgICAgaWYgKHdhdGNoLnRva2Vuc1t0b2tlbkluZGV4XSAhPT0gY2hhbmdlLnRva2Vuc1t0b2tlbkluZGV4XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTkIgaWYgd2UgZ2V0IGhlcmUgdGhlbiBhbGwgY29tbW9uIHRva2VucyBtYXRjaFxuXG4gICAgY29uc3QgY2hhbmdlUGF0aElzRGVzY2VuZGFudCA9IGNoYW5nZS50b2tlbnMubGVuZ3RoID4gd2F0Y2gudG9rZW5zLmxlbmd0aDtcblxuICAgIGlmIChjaGFuZ2VQYXRoSXNEZXNjZW5kYW50KSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBjaGFuZ2UudG9rZW5zLnNsaWNlKHdhdGNoLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGggPSBfLmdldCh3YXRjaC52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMoY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCwgY2hhbmdlLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gd2F0Y2gudG9rZW5zLnNsaWNlKGNoYW5nZS50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hQYXRoID0gXy5nZXQoY2hhbmdlLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh3YXRjaC52YWx1ZSwgbmV3VmFsdWVBdFdhdGNoUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIHRoaXMuaGFuZGxlcihjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIHRoaXMuY3VycmVudFZhbHVlKTtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKG5ld1ZhbHVlKTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGVyRmFjdG9yeSB7XG4gIGNyZWF0ZSh3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hlcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGVyRmFjdG9yeScsICgpID0+IHtcbiAgcmV0dXJuIG5ldyBXYXRjaGVyRmFjdG9yeSgpO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1JvdXRlJywgZnVuY3Rpb24oT2JqZWN0SGVscGVyKSB7XG4gIFwibmdJbmplY3RcIjtcbiAgY29uc3QgdG9rZW5zID0ge307XG4gIGNvbnN0IHVybFdyaXRlcnMgPSBbXTtcbiAgY29uc3QgdXJscyA9IFtdO1xuICBjb25zdCBwZXJzaXN0ZW50U3RhdGVzID0gW107XG4gIGNvbnN0IHJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHR5cGVzID0ge307XG4gIGxldCBodG1sNU1vZGUgPSBmYWxzZTtcblxuICBjb25zdCBwcm92aWRlciA9IHtcblxuICAgIHJlZ2lzdGVyVHlwZShuYW1lLCBjb25maWcpIHtcbiAgICAgIHR5cGVzW25hbWVdID0gY29uZmlnO1xuICAgICAgdHlwZXNbbmFtZV0ucmVnZXggPSBuZXcgUmVnRXhwKHR5cGVzW25hbWVdLnJlZ2V4LnNvdXJjZSwgJ2knKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclR5cGUgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsVG9rZW4obmFtZSwgY29uZmlnKSB7XG4gICAgICB0b2tlbnNbbmFtZV0gPSBfLmV4dGVuZCh7bmFtZX0sIGNvbmZpZyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxUb2tlbiB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxXcml0ZXIobmFtZSwgZm4pIHtcbiAgICAgIHVybFdyaXRlcnNbbmFtZV0gPSBmbjtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFdyaXRlciB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmwocGF0dGVybiwgY29uZmlnID0ge30pIHtcbiAgICAgIGNvbnN0IHVybERhdGEgPSB7XG4gICAgICAgIGNvbXBpbGVkVXJsOiB0aGlzLl9jb21waWxlVXJsUGF0dGVybihwYXR0ZXJuLCBjb25maWcpLFxuICAgICAgICBwYXR0ZXJuXG4gICAgICB9O1xuXG4gICAgICB1cmxzLnB1c2goXy5leHRlbmQodXJsRGF0YSwgY29uZmlnKSk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmwgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHNldFBlcnNpc3RlbnRTdGF0ZXMoLi4uc3RhdGVMaXN0KSB7XG4gICAgICBfLmZvckVhY2goc3RhdGVMaXN0LCAoc3RhdGUpID0+IHtcbiAgICAgICAgaWYgKCFwZXJzaXN0ZW50U3RhdGVzLmluY2x1ZGVzKHN0YXRlKSkge1xuICAgICAgICAgIHBlcnNpc3RlbnRTdGF0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRIdG1sNU1vZGUobW9kZSkge1xuICAgICAgaHRtbDVNb2RlID0gbW9kZTtcbiAgICB9LFxuXG4gICAgX2NvbXBpbGVVcmxQYXR0ZXJuKHVybFBhdHRlcm4sIGNvbmZpZykge1xuICAgICAgbGV0IG1hdGNoO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnModXJsUGF0dGVybik7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHVybFBhdHRlcm4pO1xuXG4gICAgICBjb25zdCB0b2tlblJlZ2V4ID0gL1xceyhbQS1aYS16XFwuXzAtOV0rKVxcfS9nO1xuICAgICAgbGV0IHVybFJlZ2V4ID0gdXJsUGF0dGVybjtcblxuICAgICAgaWYgKCFjb25maWcucGFydGlhbE1hdGNoKSB7XG4gICAgICAgIHVybFJlZ2V4ID0gYF4ke3VybFJlZ2V4fSRgO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b2tlbkxpc3QgPSBbXTtcblxuICAgICAgd2hpbGUgKChtYXRjaCA9IHRva2VuUmVnZXguZXhlYyh1cmxQYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbbWF0Y2hbMV1dO1xuICAgICAgICB0b2tlbkxpc3QucHVzaCh0b2tlbik7XG4gICAgICAgIHVybFJlZ2V4ID0gdXJsUmVnZXgucmVwbGFjZShtYXRjaFswXSwgYCgke3R5cGVzW3Rva2VuLnR5cGVdLnJlZ2V4LnNvdXJjZX0pYCk7XG4gICAgICB9XG5cbiAgICAgIHVybFJlZ2V4LnJlcGxhY2UoJy4nLCAnXFxcXC4nKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyksXG4gICAgICAgIHRva2VuczogdG9rZW5MaXN0XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBfZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHN0cikge1xuICAgICAgaWYgKHN0ci5tYXRjaCgvXFwvJC8pKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwvJC8sICcvPycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGAke3N0cn0vP2A7XG4gICAgfSxcblxuICAgIF9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFwoXFwpXFwqXFwrXFw/XFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gICAgfSxcblxuICAgICRnZXQoJGxvY2F0aW9uLCAkaW5qZWN0b3IsICRxKSB7XG4gICAgICAnbmdJbmplY3QnO1xuXG4gICAgICAvLyBXaGVuIGdldHRpbmcgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHNlcnZpY2UgKG9ubHkgZG9uZSBvbmNlKSwgd2UgbmVlZCB0byBpdGVyYXRlIG92ZXIgdGhlIHVybFdyaXRlcnMgYW5kIHR1cm5cbiAgICAgIC8vIHRoZW0gaW50byBtZXRob2RzIHRoYXQgaW52b2tlIHRoZSBSRUFMIHVybFdyaXRlciwgYnV0IHByb3ZpZGluZyBkZXBlbmRlbmN5IGluamVjdGlvbiB0byBpdCwgd2hpbGUgYWxzb1xuICAgICAgLy8gZ2l2aW5nIGl0IHRoZSBkYXRhIHRoYXQgdGhlIGNhbGxlZSBwYXNzZXMgaW4uXG5cbiAgICAgIC8vIFRoZSByZWFzb24gd2UgaGF2ZSB0byBkbyB0aGlzIGhlcmUgaXMgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGUgJGluamVjdG9yIGJhY2sgaW4gdGhlIHJvdXRlUHJvdmlkZXIuXG5cbiAgICAgIF8uZm9ySW4odXJsV3JpdGVycywgKHdyaXRlciwgd3JpdGVyTmFtZSkgPT5cbiAgICAgICAgdXJsV3JpdGVyc1t3cml0ZXJOYW1lXSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBpZiAoIWRhdGEpIHsgZGF0YSA9IHt9OyB9XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0ge1VybERhdGE6IGRhdGF9O1xuICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKHdyaXRlciwge30sIGxvY2Fscyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGxldCBmbGFzaFN0YXRlcyA9IFtdO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0ge1xuICAgICAgICBjdXJyZW50QmluZGluZ3M6IHt9LFxuICAgICAgICByZWFkeURlZmVycmVkOiAkcS5kZWZlcigpLFxuXG4gICAgICAgIG1hdGNoKHVybFRvTWF0Y2gpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHVybCBvZiBBcnJheS5mcm9tKHVybHMpKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gdXJsLmNvbXBpbGVkVXJsLnJlZ2V4LmV4ZWModXJsVG9NYXRjaCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7dXJsLCByZWdleE1hdGNoOiBtYXRjaH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REYXRhKG1hdGNoLCBzZWFyY2hEYXRhID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB0aGlzLmV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCk7XG4gICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuZXh0cmFjdFBhdGhEYXRhKG1hdGNoKTtcbiAgICAgICAgICBzZWFyY2hEYXRhID0gdGhpcy5leHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKTtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0SGVscGVyLmRlZmF1bHQoc2VhcmNoRGF0YSwgcGF0aCwgZGVmYXVsdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpIHtcbiAgICAgICAgICBpZiAoIXNlYXJjaERhdGEpIHsgc2VhcmNoRGF0YSA9ICRsb2NhdGlvbi5zZWFyY2goKTsgfVxuICAgICAgICAgIGNvbnN0IGRhdGEgPSBfLmNsb25lKHNlYXJjaERhdGEpO1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChkYXRhLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhcmdldEtleSA9IF8uZmluZEtleSh0b2tlbnMsIHsgc2VhcmNoQWxpYXM6IGtleSB9KTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0S2V5KSB7IHRhcmdldEtleSA9IGtleTsgfVxuXG4gICAgICAgICAgICBjb25zdCB0b2tlblR5cGVOYW1lID0gdG9rZW5zW3RhcmdldEtleV0gPyBfLmdldCh0b2tlbnNbdGFyZ2V0S2V5XSwgJ3R5cGUnKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICghdG9rZW5zW3RhcmdldEtleV0gfHwgKHR5cGVzW3Rva2VuVHlwZU5hbWVdLnJlZ2V4LnRlc3QodmFsdWUpKSkge1xuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0udHlwZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdHlwZVRva2VuVHlwZSA9IHRva2VuVHlwZSA/IHR5cGVzW3Rva2VuVHlwZV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZVBhcnNlZCA9IHR5cGVUb2tlblR5cGUgPyB0eXBlVG9rZW5UeXBlLnBhcnNlciA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICBpZiAodG9rZW5UeXBlUGFyc2VkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHRva2VuVHlwZVBhcnNlZCwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnN0YXRlUGF0aCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgZGF0YUtleSA9IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoIHx8IHRhcmdldEtleTtcblxuICAgICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KG5ld0RhdGEsIGRhdGFLZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChtYXRjaC51cmwuc3RhdGUsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsIGtleSwgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyBfLmNsb25lRGVlcCh2YWx1ZSkgOiB2YWx1ZSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFBhdGhEYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICAgIGNvbnN0IHBhdGhUb2tlbnMgPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zO1xuXG4gICAgICAgICAgaWYgKHBhdGhUb2tlbnMubGVuZ3RoID09PSAwKSB7IHJldHVybiB7fTsgfVxuXG4gICAgICAgICAgZm9yIChsZXQgbiA9IDAsIGVuZCA9IHBhdGhUb2tlbnMubGVuZ3RoLTEsIGFzYyA9IDAgPD0gZW5kOyBhc2MgPyBuIDw9IGVuZCA6IG4gPj0gZW5kOyBhc2MgPyBuKysgOiBuLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2Vuc1tuXTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG1hdGNoLnJlZ2V4TWF0Y2hbbisxXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlcikgeyB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7IH1cblxuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCAodG9rZW4uc3RhdGVQYXRoIHx8IHRva2VuLm5hbWUpLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVycygpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVycztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXIobmFtZSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXShkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnbyhuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gJGxvY2F0aW9uLnVybCh0aGlzLmludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGVyc2lzdGVudFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gcGVyc2lzdGVudFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkRmxhc2hTdGF0ZXMoLi4ubmV3U3RhdGVzKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBmbGFzaFN0YXRlcy5jb25jYXQobmV3U3RhdGVzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gZmxhc2hTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUsIGJpbmRpbmcpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV0gPSBiaW5kaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZSh2aWV3TmFtZSwgYmluZGluZ05hbWVFeHByZXNzaW9uKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudEJpbmRpbmcgPSB0aGlzLmdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKVxuXG4gICAgICAgICAgaWYgKCFjdXJyZW50QmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGJpbmRpbmdOYW1lRXhwcmVzc2lvbiBpbnN0YW5jZW9mIFJlZ0V4cCA/XG4gICAgICAgICAgICBiaW5kaW5nTmFtZUV4cHJlc3Npb24udGVzdChjdXJyZW50QmluZGluZy5uYW1lKSA6XG4gICAgICAgICAgICBjdXJyZW50QmluZGluZy5uYW1lID09PSBiaW5kaW5nTmFtZUV4cHJlc3Npb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UmVhZHkocmVhZHkpIHtcbiAgICAgICAgICBpZiAoIXJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNSZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNIdG1sNU1vZGVFbmFibGVkKCkge1xuICAgICAgICAgIHJldHVybiBodG1sNU1vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2hlblJlYWR5KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5RGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICB9O1xuXG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbnVtZXJpYycsIHtyZWdleDogL1xcZCsvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiBwYXJzZUludCh0b2tlbildfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYWxwaGEnLCB7cmVnZXg6IC9bYS16QS1aXSsvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYW55Jywge3JlZ2V4OiAvLisvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbGlzdCcsIHtyZWdleDogLy4rLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gdG9rZW4uc3BsaXQoJywnKV19KTtcblxuICByZXR1cm4gcHJvdmlkZXI7XG59KTtcblxuY2xhc3MgU3RhdGVQcm92aWRlciB7XG4gICRnZXQoV2F0Y2hhYmxlTGlzdEZhY3RvcnkpIHtcbiAgICAnbmdJbmplY3QnO1xuICAgIHJldHVybiBXYXRjaGFibGVMaXN0RmFjdG9yeS5jcmVhdGUoKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdTdGF0ZScsIG5ldyBTdGF0ZVByb3ZpZGVyKTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignVmlld0JpbmRpbmdzJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCB2aWV3cyA9IFtdO1xuXG4gIGNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJpbmRpbmdzKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgaWYgKCEodGhpcy5iaW5kaW5ncyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0gW3RoaXMuYmluZGluZ3NdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEJpbmRpbmdzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3M7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIGJpbmQobmFtZSwgY29uZmlnKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShiaW5kaW5ncywgY29tbW9uUmVxdWlyZWRTdGF0ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoYmluZGluZy5yZXF1aXJlZFN0YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBbYmluZGluZy5yZXF1aXJlZFN0YXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goYmluZGluZy5yZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlLmNvbmNhdChjb21tb25SZXF1aXJlZFN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXNvbHZlKGJpbmRpbmdzLCBjb21tb25SZXNvbHZlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoISgncmVzb2x2ZScgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVzb2x2ZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChfLmRlZmF1bHRzKGJpbmRpbmcucmVzb2x2ZSwgY29tbW9uUmVzb2x2ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJhc2ljQ29tbW9uRmllbGRzID0gW1xuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JUZW1wbGF0ZVVybCd9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCBjb21tb25GaWVsZCBvZiBBcnJheS5mcm9tKGJhc2ljQ29tbW9uRmllbGRzKSkge1xuICAgICAgICAgIGlmIChjb21tb25GaWVsZC5uYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgZGVmYXVsdEJpbmRpbmdGaWVsZChuZXdCaW5kaW5ncywgY29tbW9uRmllbGQub3ZlcnJpZGVGaWVsZCwgY29uZmlnW2NvbW1vbkZpZWxkLm5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlcXVpcmVkU3RhdGUnIGluIGNvbmZpZykge1xuICAgICAgICAgIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXF1aXJlZFN0YXRlJ10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXNvbHZlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb21tb25SZXNvbHZlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlc29sdmUnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdEJpbmRpbmdGaWVsZChiaW5kaW5ncywgZmllbGROYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgIGlmICghKGZpZWxkTmFtZSBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgaXRlbSA9IGJpbmRpbmdbZmllbGROYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
