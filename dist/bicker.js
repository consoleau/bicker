(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

routeHrefFactory.$inject = ["Route", "$location", "$timeout"];
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

function routeHrefFactory(Route, $location, $timeout) {
  'ngInject';

  return {
    restrict: 'A',
    scope: true,
    link: function link(scope, iElement, iAttrs) {
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
    }
  };
}

angular.module('bicker_router').directive('routeHref', routeHrefFactory);

// @TODO none of the animation code in this directive has been tested. Not sure if it can be at this stage This needs further investigation.
// @TODO this code does too much, it should be refactored.

function routeViewFactory($log, $compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, $templateRequest, Route) {
  'nginject';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0XFxiaWNrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWlCLENBQWhDLEFBQWdDLEFBQUMsY0FBakMsQUFBK0Msd0ZBQUksVUFBQSxBQUFVLE9BQVYsQUFBaUIsT0FBakIsQUFBd0IsV0FBeEIsQUFBbUMsWUFBbkMsQUFBK0MsY0FBL0MsQUFBNkQsb0JBQW9CLEFBQ2xJO0FBRUE7O01BQUksU0FBSixBQUFhLEFBQ2I7YUFBQSxBQUFXLElBQVgsQUFBZSx3QkFBd0IsWUFBWSxBQUNqRDtRQUFJLE1BQUosQUFBSSxBQUFNLFdBQVcsQUFDbkI7WUFBQSxBQUFNLFNBQU4sQUFBZSxBQUNoQjtBQUNGO0FBSkQsQUFNQTs7YUFBQSxBQUFXLElBQVgsQUFBZSwwQkFBMEIsVUFBQSxBQUFVLEdBQVYsQUFBYSxRQUFRLEFBQzVEO0FBQ0E7UUFBSSxZQUFKLEFBQ0E7UUFBSSxXQUFKLEFBQWUsUUFBUSxBQUNyQjtBQUNEO0FBRUQ7O2FBQUEsQUFBUyxBQUVUOzt1QkFBQSxBQUFtQixBQUNuQjtRQUFNLFFBQVEsTUFBQSxBQUFNLE1BQU0sVUFBMUIsQUFBYyxBQUFZLEFBQVUsQUFFcEM7O1FBQUksQ0FBSixBQUFLLE9BQU8sQUFDVjthQUFBLEFBQU8sQUFDUjtBQUZELFdBRU8sQUFDTDthQUFPLE1BQUEsQUFBTSxZQUFiLEFBQU8sQUFBa0IsQUFDMUI7QUFFRDs7UUFBSSxnQkFBZ0IsYUFBQSxBQUFhLE1BQU0sTUFBbkIsQUFBeUIsTUFBN0MsQUFBb0IsQUFBK0IsQUFDbkQ7b0JBQWdCLEVBQUEsQUFBRSxXQUFGLEFBQWEsZUFBZSxNQUFBLEFBQU0sc0JBQU4sQUFBNEIsT0FBTyxNQUEvRSxBQUFnQixBQUE0QixBQUFtQyxBQUFNLEFBRXJGOztRQUFNLFlBQVksRUFBQyxXQUFELEFBQVksZUFBZSxTQUE3QyxBQUFrQixBQUFvQyxBQUV0RDs7ZUFBQSxBQUFXLE1BQVgsQUFBaUIsbUNBQWpCLEFBQW9ELEFBRXBEOztRQUFLLFVBQUQsQUFBVyxVQUFYLEFBQXNCLFdBQTFCLEFBQXFDLEdBQUcsQUFDdEM7WUFBQSxBQUFNLE1BQU0sVUFBWixBQUFzQixBQUN2QjtBQUVEOztNQUFBLEFBQUUsUUFBUSxVQUFWLEFBQW9CLFNBQVMsVUFBQSxBQUFDLE9BQUQsQUFBUSxLQUFRLEFBQzNDO1lBQUEsQUFBTSxJQUFOLEFBQVUsS0FBVixBQUFlLEFBQ2hCO0FBRkQsQUFJQTs7VUFBQSxBQUFNLEFBQ047VUFBQSxBQUFNLFNBQU4sQUFBZSxBQUNoQjtBQW5DRCxBQW9DRDtBQTlDRDs7QUFnREEsUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxTQUFoQyxBQUF5QztBQUFnQixvQkFBQSxBQUNuRCxRQURtRCxBQUMzQyxNQUFNLEFBQ2hCO1FBQUksU0FBSixBQUFhLElBQUksQUFBRTthQUFBLEFBQU8sQUFBUztBQUNuQztRQUFNLFNBQVMsS0FBQSxBQUFLLE1BQXBCLEFBQWUsQUFBVyxBQUMxQjtRQUFNLE1BQU0sT0FBWixBQUFZLEFBQU8sQUFDbkI7UUFBSSxTQUpZLEFBSWhCLEFBQWE7O29DQUpHOzRCQUFBO3lCQUFBOztRQU1oQjsyQkFBQSxBQUFzQixvSUFBUTtZQUFuQixBQUFtQixnQkFDNUI7O2lCQUFTLE9BQVQsQUFBUyxBQUFPLEFBQ2hCO1lBQUksV0FBSixBQUFlLFdBQVcsQUFBRTtpQkFBQSxBQUFPLEFBQVk7QUFDaEQ7QUFUZTtrQkFBQTswQkFBQTt1QkFBQTtjQUFBO1VBQUE7NERBQUE7b0JBQUE7QUFBQTtnQkFBQTsrQkFBQTtnQkFBQTtBQUFBO0FBQUE7QUFXaEI7O1dBQU8sT0FBUCxBQUFPLEFBQU8sQUFDZjtBQWJzRCxBQWV2RDtBQWZ1RCxvQkFBQSxBQWVuRCxRQWZtRCxBQWUzQyxNQWYyQyxBQWVyQyxPQUFPLEFBQ3ZCO1FBQU0sU0FBUyxLQUFBLEFBQUssTUFBcEIsQUFBZSxBQUFXLEFBQzFCO1FBQU0sTUFBTSxPQUFaLEFBQVksQUFBTyxBQUNuQjtRQUFJLFNBSG1CLEFBR3ZCLEFBQWE7O3FDQUhVOzZCQUFBOzBCQUFBOztRQUt2Qjs0QkFBQSxBQUFzQix5SUFBUTtZQUFuQixBQUFtQixpQkFDNUI7O1lBQUksT0FBQSxBQUFPLGFBQVgsQUFBd0IsV0FBVyxBQUNqQztpQkFBQSxBQUFPLFdBQVAsQUFBa0IsQUFDbkI7QUFFRDs7aUJBQVMsT0FBVCxBQUFTLEFBQU8sQUFDakI7QUFYc0I7a0JBQUE7MkJBQUE7d0JBQUE7Y0FBQTtVQUFBOzhEQUFBO3FCQUFBO0FBQUE7Z0JBQUE7Z0NBQUE7Z0JBQUE7QUFBQTtBQUFBO0FBYXZCOztXQUFPLE9BQUEsQUFBTyxPQUFkLEFBQXFCLEFBQ3RCO0FBN0JzRCxBQStCdkQ7QUEvQnVELHdCQUFBLEFBK0JqRCxRQS9CaUQsQUErQnpDLE1BQU0sQUFDbEI7UUFBSSxTQUFKLEFBQWEsSUFBSSxBQUFFO2FBQUEsQUFBTyxBQUFTO0FBQ25DO1FBQU0sU0FBUyxLQUFBLEFBQUssTUFBcEIsQUFBZSxBQUFXLEFBQzFCO1FBQU0sTUFBTSxPQUFaLEFBQVksQUFBTyxBQUNuQjtRQUFJLFNBSmMsQUFJbEIsQUFBYTs7cUNBSks7NkJBQUE7MEJBQUE7O1FBTWxCOzRCQUFBLEFBQXNCLHlJQUFRO1lBQW5CLEFBQW1CLGlCQUM1Qjs7aUJBQVMsT0FBVCxBQUFTLEFBQU8sQUFDaEI7WUFBSSxXQUFKLEFBQWUsV0FBVyxBQUFFO2lCQUFBLEFBQU8sQUFBUTtBQUM1QztBQVRpQjtrQkFBQTsyQkFBQTt3QkFBQTtjQUFBO1VBQUE7OERBQUE7cUJBQUE7QUFBQTtnQkFBQTtnQ0FBQTtnQkFBQTtBQUFBO0FBQUE7QUFXbEI7O1FBQUksT0FBQSxBQUFPLFNBQVgsQUFBb0IsV0FBVyxBQUFFO2FBQUEsQUFBTyxBQUFRO0FBQ2hEO1dBQU8sT0FBUCxBQUFPLEFBQU8sQUFDZDtXQUFBLEFBQU8sQUFDUjtBQTdDc0QsQUErQ3ZEOztBQUNBO0FBaER1RCx3QkFBQSxBQWdEakQsR0FoRGlELEFBZ0Q5QyxHQUFnQjtRQUFiLEFBQWEsNkVBQUosQUFBSSxBQUN2Qjs7UUFBSSxRQUFKLEFBQVksQUFDWjthQUFTLE9BQUEsQUFBTyxTQUFQLEFBQWdCLElBQWhCLEFBQXVCLGVBRlQsQUFFdkIsQUFBNEM7O3FDQUZyQjs2QkFBQTswQkFBQTs7UUFJdkI7NEJBQWtCLE1BQUEsQUFBTSxLQUFLLE9BQUEsQUFBTyxLQUFwQyxBQUFrQixBQUFXLEFBQVksc0lBQUs7WUFBbkMsQUFBbUMsYUFDNUM7O1lBQU0sZ0JBQUEsQUFBYyxTQUFwQixBQUE2QixBQUU3Qjs7WUFBSSxFQUFBLEFBQUUsU0FBTixBQUFlLFdBQVcsQUFDeEI7Z0JBQUEsQUFBTSxLQUFOLEFBQVcsQUFFWjtBQUhELGVBR08sSUFBSyxRQUFPLEVBQVAsQUFBTyxBQUFFLFVBQVYsQUFBbUIsWUFBYyxFQUFFLEVBQUEsQUFBRSxnQkFBekMsQUFBcUMsQUFBb0IsUUFBUyxBQUN2RTtrQkFBUSxNQUFBLEFBQU0sT0FBTyxLQUFBLEFBQUssTUFBTSxFQUFYLEFBQVcsQUFBRSxNQUFNLEVBQW5CLEFBQW1CLEFBQUUsTUFBMUMsQUFBUSxBQUFhLEFBQTJCLEFBQ2pEO0FBQ0Y7QUFic0I7a0JBQUE7MkJBQUE7d0JBQUE7Y0FBQTtVQUFBOzhEQUFBO3FCQUFBO0FBQUE7Z0JBQUE7Z0NBQUE7Z0JBQUE7QUFBQTtBQUFBO0FBZXZCOztXQUFBLEFBQU8sQUFDUjtBQWhFc0QsQUFrRXZEO0FBbEV1RCw2QkFBQSxBQWtFL0MsV0FBMkIsQUFDakM7UUFBSSxrQkFBSjtRQUFnQixhQUFoQixBQUNBO1FBQU0sU0FGMkIsQUFFakMsQUFBZTs7c0NBRkssQUFBYSw2RUFBYjtBQUFhLHdDQUFBO0FBSWpDOztRQUFJLFlBQUEsQUFBWSxXQUFoQixBQUEyQixHQUFHLEFBQzVCO21CQUFhLFlBQWIsQUFBYSxBQUFZLEFBQzFCO0FBRkQsV0FFTyxBQUNMO21CQUFhLEtBQUEsQUFBSyx1Q0FBVyxNQUFBLEFBQU0sS0FBSyxlQUF4QyxBQUFhLEFBQWdCLEFBQTBCLEFBQ3hEO0FBRUQ7O1NBQUssSUFBTCxBQUFXLE9BQVgsQUFBa0IsWUFBWSxBQUM1QjtjQUFRLFdBQVIsQUFBUSxBQUFXLEFBQ25CO1VBQUksaUJBQUosQUFBcUIsT0FBTyxBQUMxQjtlQUFBLEFBQU8sT0FBTyxVQUFBLEFBQVUsUUFBeEIsQUFBZ0MsQUFDakM7QUFGRCxpQkFFWSxRQUFBLEFBQU8sOENBQVAsQUFBTyxZQUFSLEFBQWtCLFlBQWMsUUFBTyxVQUFQLEFBQU8sQUFBVSxVQUFyRCxBQUE4RCxVQUFXLEFBQzlFO2VBQUEsQUFBTyxPQUFPLEtBQUEsQUFBSyxRQUFRLFVBQWIsQUFBYSxBQUFVLE1BQXJDLEFBQWMsQUFBNkIsQUFDNUM7QUFGTSxPQUFBLE1BRUEsQUFDTDtlQUFBLEFBQU8sT0FBTyxVQUFBLEFBQVUsUUFBeEIsQUFBZ0MsQUFDakM7QUFDRjtBQUVEOztTQUFLLElBQUwsQUFBVyxTQUFYLEFBQWtCLFdBQVcsQUFDM0I7Y0FBUSxVQUFSLEFBQVEsQUFBVSxBQUNsQjthQUFBLEFBQU8sU0FBTyxPQUFBLEFBQU8sVUFBckIsQUFBNkIsQUFDOUI7QUFFRDs7V0FBQSxBQUFPLEFBQ1I7QUE3RkgsQUFBeUQ7QUFBQSxBQUN2RDs7QUFnR0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBQSxBQUFTLGtCQUFULEFBQTJCLE9BQU8sQUFDaEM7QUFDQTs7O2NBQU8sQUFDSyxBQUNWO0FBRkssd0JBQUEsQUFFQyxPQUZELEFBRVEsVUFGUixBQUVrQixRQUFRLEFBQzdCO1lBQUEsQUFBTSxPQUFPLFlBQU0sQUFDakI7WUFBTSx1QkFBdUIsTUFBQSxBQUFNLE1BQU0sT0FBekMsQUFBNkIsQUFBWSxBQUFPLEFBRWhEOztZQUFJLENBQUMsTUFBQSxBQUFNLDBCQUEwQixxQkFBaEMsQUFBcUQsVUFBVSxxQkFBcEUsQUFBSyxBQUFvRixjQUFjLEFBQ3JHO2NBQUksU0FBQSxBQUFTLFNBQVMscUJBQXRCLEFBQUksQUFBdUMsWUFBWSxBQUNyRDtxQkFBQSxBQUFTLFlBQVkscUJBQXJCLEFBQTBDLEFBQzNDO0FBQ0Y7QUFKRCxlQUlPLEFBQ0w7Y0FBSSxDQUFDLFNBQUEsQUFBUyxTQUFTLHFCQUF2QixBQUFLLEFBQXVDLFlBQVksQUFDdEQ7cUJBQUEsQUFBUyxTQUFTLHFCQUFsQixBQUF1QyxBQUN4QztBQUNGO0FBQ0Y7QUFaRCxBQWFEO0FBaEJILEFBQU8sQUFrQlI7QUFsQlEsQUFDTDs7O0FBbUJKLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWYsQUFBZ0MsVUFBaEMsQUFBMEMsY0FBMUMsQUFBd0Q7O0FBRXhELFNBQUEsQUFBUyxpQkFBVCxBQUEyQixPQUEzQixBQUFrQyxXQUFsQyxBQUE2QyxVQUFVLEFBQ3JEO0FBRUE7OztjQUFPLEFBQ0ssQUFDVjtXQUZLLEFBRUUsQUFDUDtBQUhLLHdCQUFBLEFBR0MsT0FIRCxBQUdRLFVBSFIsQUFHa0IsUUFBUSxBQUMvQjtVQUFJLE9BQUEsQUFBTyxlQUFYLEFBQTBCLFdBQVcsQUFDbkM7aUJBQUEsQUFBUyxNQUFNLFVBQUEsQUFBQyxPQUFVLEFBQ3hCO2dCQUFBLEFBQU0sQUFDTjtjQUFJLE1BQU0sU0FBQSxBQUFTLEtBQW5CLEFBQVUsQUFBYyxBQUV4Qjs7Y0FBSSxDQUFDLE1BQUwsQUFBSyxBQUFNLHNCQUFzQixBQUMvQjtrQkFBTSxJQUFBLEFBQUksUUFBSixBQUFZLE1BQWxCLEFBQU0sQUFBa0IsQUFDekI7QUFFRDs7MEJBQWdCLFlBQUE7bUJBQU0sVUFBQSxBQUFVLElBQWhCLEFBQU0sQUFBYztBQUFwQyxBQUFPLEFBQ1IsV0FEUTtBQVJULEFBVUQ7QUFFRDs7VUFBTSxTQUFTLE1BQWYsQUFBZSxBQUFNLEFBQ3JCO1dBQUssSUFBTCxBQUFXLGNBQVgsQUFBeUIsUUFBUSxBQUMvQjtZQUFNLFNBQVMsT0FBZixBQUFlLEFBQU8sQUFDdEI7Y0FBQSxBQUFTLDRCQUFULEFBQWtDLEFBQ25DO0FBRUQ7O21CQUFPLEFBQU0sT0FBTyxPQUFiLEFBQW9CLFdBQVcsVUFBQSxBQUFDLFFBQVcsQUFDaEQ7WUFBSSxXQUFKLEFBQ0E7WUFBSSxNQUFKLEFBQUksQUFBTSxzQkFBc0IsQUFDOUI7Z0JBQUEsQUFBTSxBQUNQO0FBRkQsZUFFTyxBQUNMO3NCQUFBLEFBQVUsQUFDWDtBQUNEO2VBQU8sU0FBQSxBQUFTLEtBQVQsQUFBYyxRQUFyQixBQUFPLEFBQXNCLEFBQzlCO0FBUkQsQUFBTyxBQVNSLE9BVFE7QUF2QlQsQUFBTyxBQWtDUjtBQWxDUSxBQUNMOzs7QUFtQ0osUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxVQUFoQyxBQUEwQyxhQUExQyxBQUF1RDs7QUFFdkQ7QUFDQTs7QUFFQSxTQUFBLEFBQVMsaUJBQVQsQUFBMEIsTUFBMUIsQUFBZ0MsVUFBaEMsQUFBMEMsYUFBMUMsQUFBdUQsY0FBdkQsQUFBcUUsSUFBckUsQUFBeUUsT0FBekUsQUFBZ0YsWUFBaEYsQUFBNEYsVUFBNUYsQUFBc0csVUFBdEcsQUFBZ0gsV0FBaEgsQUFBMkgsb0JBQTNILEFBQStJLGtCQUEvSSxBQUFpSyxPQUFPLEFBQ3RLO0FBQ0E7OztjQUFPLEFBQ0ssQUFDVjtXQUZLLEFBRUUsQUFDUDthQUhLLEFBR0ksQUFDVDtjQUpLLEFBSUssQUFDVjtBQUxLLHdCQUFBLEFBS0Msb0JBTEQsQUFLcUIsVUFMckIsQUFLK0IsUUFBUSxBQUMxQztVQUFJLGNBQUosQUFBa0IsQUFDbEI7VUFBSSxZQUFKLEFBQWdCLEFBQ2hCO1VBQUksd0JBQUosQUFBNEIsQUFDNUI7VUFBTSxPQUFPLGFBQUEsQUFBYSxRQUFRLE9BQWxDLEFBQWEsQUFBNEIsQUFDekM7VUFBTSxXQUFXLEtBQWpCLEFBQWlCLEFBQUssQUFFdEI7O2VBQUEsQUFBUyxTQUFULEFBQWtCLEFBRWxCOztVQUFJLHFCQUFKLEFBQXlCLEFBQ3pCO1VBQUksa0JBQUosQUFBc0IsQUFFdEI7O1VBQU0seUJBQXlCLFNBQXpCLEFBQXlCLGdDQUFBO2VBQVcsRUFBQSxBQUFFLFVBQVUsTUFBQSxBQUFNLFVBQVUsMEJBQXZDLEFBQVcsQUFBWSxBQUFnQixBQUEwQjtBQUFoRyxBQUVBOztlQUFBLEFBQVMsd0JBQVQsQUFBaUMsU0FBakMsQUFBMEMsT0FBTyxBQUMvQztZQUFJLENBQUosQUFBSyxPQUFPLEFBQ1Y7a0JBQUEsQUFBUSxBQUNUO0FBQ0Q7WUFBTSxTQUFTLFFBQUEsQUFBUSxTQUFTLFVBQUEsQUFBVSxJQUFPLFFBQWpCLEFBQWlCLEFBQVEsc0JBQTFDLEFBQWlCLEFBQTRDLEtBQTVFLEFBQWlGLEFBQ2pGO2VBQU8sRUFBQSxBQUFFLFNBQVMsRUFBQSxBQUFFLEtBQUYsQUFBTyxRQUFRLENBQUEsQUFBQyxjQUFELEFBQWUsZUFBekMsQUFBVyxBQUFlLEFBQThCLGtCQUFrQixFQUFDLGNBQWxGLEFBQU8sQUFBMEUsQUFBZSxBQUNqRztBQUVEOztlQUFBLEFBQVMsZ0JBQVQsQUFBeUIsU0FBUyxBQUNoQztZQUFNLGdCQUFnQixRQUFBLEFBQVEsaUJBREUsQUFDaEMsQUFBK0M7O3lDQURmO2lDQUFBOzhCQUFBOztZQUdoQztnQ0FBd0IsTUFBQSxBQUFNLEtBQTlCLEFBQXdCLEFBQVcsaUpBQWdCO2dCQUExQyxBQUEwQyxxQkFDakQ7O2dCQUFJLGVBQUosQUFBbUIsQUFDbkI7Z0JBQUksUUFBUSxZQUFBLEFBQVksT0FBeEIsQUFBWSxBQUFtQixJQUFJLEFBQ2pDOzRCQUFjLFlBQUEsQUFBWSxNQUExQixBQUFjLEFBQWtCLEFBQ2hDOzZCQUFBLEFBQWUsQUFDaEI7QUFFRDs7Z0JBQUksVUFBVSxNQUFBLEFBQU0sSUFBcEIsQUFBYyxBQUFVLEFBRXhCOztBQUNBO2dCQUFLLFlBQUwsQUFBaUIsTUFBTyxBQUN0QjtxQkFBQSxBQUFPLEFBQ1I7QUFFRDs7QUFDQTtnQkFBQSxBQUFJLGNBQWMsQUFDaEI7d0JBQVUsQ0FBVixBQUFXLEFBQ1o7QUFDRDtnQkFBSSxDQUFKLEFBQUssU0FBUyxBQUNaO3FCQUFBLEFBQU8sQUFDUjtBQUNGO0FBeEIrQjtzQkFBQTsrQkFBQTs0QkFBQTtrQkFBQTtjQUFBO2tFQUFBO3lCQUFBO0FBQUE7b0JBQUE7b0NBQUE7b0JBQUE7QUFBQTtBQUFBO0FBMEJoQzs7WUFBSSxRQUFKLEFBQVksYUFBYSxBQUN2QjtjQUFJLENBQUMsVUFBQSxBQUFVLE9BQU8sUUFBdEIsQUFBSyxBQUF5QixjQUFjLEFBQzFDO21CQUFBLEFBQU8sQUFDUjtBQUNGO0FBRUQ7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O2VBQUEsQUFBUyxXQUFULEFBQW9CLFNBQXBCLEFBQTZCLFVBQVUsQUFDckM7WUFBTSxrQkFBa0IsbUJBQXhCLEFBQXdCLEFBQW1CLEFBRTNDOztZQUFJLENBQUosQUFBSyxpQkFBaUIsQUFDcEI7Y0FBQSxBQUFJLGFBQWEsQUFDZjtxQkFBQSxBQUFTLFNBQVQsQUFBa0IsU0FBbEIsQUFBMkIsV0FBM0IsQUFBc0MsS0FBSyxZQUFNLEFBQy9DO3FCQUFPLFlBQVAsQUFBTyxBQUFZLEFBQ3BCO0FBRkQsQUFHQTtpQ0FBQSxBQUFxQixBQUNyQjs4QkFBQSxBQUFrQixBQUNsQjtrQkFBQSxBQUFNLHFCQUFxQixLQUEzQixBQUFnQyxBQUNqQztBQUNEO0FBQ0Q7QUFFRDs7WUFBTSxXQUFXLHVCQUFqQixBQUFpQixBQUF1QixBQUN4QztZQUFLLG9CQUFELEFBQXFCLG1CQUFvQixRQUFBLEFBQVEsT0FBUixBQUFlLG9CQUE1RCxBQUE2QyxBQUFtQyxXQUFXLEFBQ3pGO0FBQ0Q7QUFFRDs7MEJBQUEsQUFBa0IsQUFDbEI7NkJBQUEsQUFBcUIsQUFFckI7OzJCQUFBLEFBQW1CLEFBRW5COztxQ0FBTyxBQUFzQixTQUF0QixBQUErQixpQkFBL0IsQUFBZ0QsS0FBSyxVQUFBLEFBQVUsc0JBQXNCLEFBQzFGO0FBQ0E7Y0FBTSxnQ0FBZ0MsdUJBQUEsQUFBdUIsTUFBN0QsQUFBbUUsQUFFbkU7O2NBQUksQ0FBSixBQUFLLGFBQWEsQUFDaEI7NEJBQU8sQUFBUyxZQUFULEFBQXFCLFNBQXJCLEFBQThCLFdBQTlCLEFBQXlDLEtBQUssWUFBTSxBQUN6RDtxQkFBTyxXQUFBLEFBQVcsU0FBWCxBQUFvQixpQkFBM0IsQUFBTyxBQUFxQyxBQUM3QztBQUZELEFBQU8sQUFHUixhQUhRO0FBRFQsaUJBSU8sQUFDTDtzQkFBQSxBQUFVLEFBQ1Y7bUJBQU8sV0FBQSxBQUFXLFNBQVgsQUFBb0IsaUJBQTNCLEFBQU8sQUFBcUMsQUFDN0M7QUFDRjtBQVpELEFBQU8sQUFhUixTQWJRO0FBZVQ7O2VBQUEsQUFBUyxtQkFBVCxBQUE0QixVQUFVO3lDQUFBO2lDQUFBOzhCQUFBOztZQUNwQztnQ0FBc0IsTUFBQSxBQUFNLEtBQTVCLEFBQXNCLEFBQVcsNElBQVc7Z0JBQWpDLEFBQWlDLGlCQUMxQzs7Z0JBQUksZ0JBQUosQUFBSSxBQUFnQixVQUFVLEFBQzVCO3FCQUFBLEFBQU8sQUFDUjtBQUNGO0FBTG1DO3NCQUFBOytCQUFBOzRCQUFBO2tCQUFBO2NBQUE7a0VBQUE7eUJBQUE7QUFBQTtvQkFBQTtvQ0FBQTtvQkFBQTtBQUFBO0FBQUE7QUFPcEM7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O2VBQUEsQUFBUyxZQUFULEFBQXFCLFNBQVMsQUFDNUI7WUFBSSxnQkFBSixBQUFvQixPQUFPLEFBQ3pCO0FBQ0Q7QUFDRDtzQkFBQSxBQUFjLEFBQ2Q7Z0JBQUEsQUFBUSxXQUFSLEFBQW1CLEdBQW5CLEFBQXNCLEdBQXRCLEFBQXlCLEFBQ3pCO2tCQUFBLEFBQVUsQUFDWDtBQUVEOztlQUFBLEFBQVMsV0FBVCxBQUFvQixTQUFwQixBQUE2QixTQUE3QixBQUFzQyxjQUFjLEFBQ2xEO1lBQU0sc0JBQXNCLEtBQTVCLEFBQTRCLEFBQUssQUFDakM7WUFBTSxZQUFZLHdCQUFsQixBQUFrQixBQUF3QixBQUUxQzs7WUFBTSx5QkFBeUIsU0FBekIsQUFBeUIsdUJBQUEsQUFBVSxNQUFNLEFBQzdDO2NBQUksbUJBQUEsQUFBbUIsY0FBdkIsQUFBcUMsU0FBUyxBQUM1QztBQUNEO0FBRUQ7O3dCQUFBLEFBQWMsQUFFZDs7Y0FBTSw2QkFBNkIsS0FBQSxBQUFLLFFBQXhDLEFBQWdELEFBRWhEOztjQUFNLHFCQUFxQixTQUFyQixBQUFxQixxQkFBWSxBQUNyQztnQkFBSSxBQUNGO3FCQUFPLGdCQUFBLEFBQWdCLFNBQWhCLEFBQXlCLFdBQWhDLEFBQU8sQUFBb0MsQUFDNUM7QUFGRCxjQUVFLE9BQUEsQUFBTyxHQUFHLEFBQ1Y7cUJBQU8sVUFBQSxBQUFVLEdBQVYsQUFBYSxTQUFwQixBQUFPLEFBQXNCLEFBQzlCO0FBSkQsc0JBSVUsQUFDUjtBQUNBO0FBQ0E7dUJBQVMsWUFBWSxBQUNuQjtvQkFBSSxDQUFDLFFBQUwsQUFBYSxrQkFBa0IsQUFDN0I7eUJBQU8sbUJBQVAsQUFBTyxBQUFtQixBQUMzQjtBQUNGO0FBSkQsQUFLRDtBQUNGO0FBZEQsQUFnQkE7O2NBQU0sNkJBQTZCLEtBQUEsQUFBSyxJQUFMLEFBQVMsR0FBRyxlQUEvQyxBQUFtQyxBQUEyQixBQUU5RDs7Y0FBSSw2QkFBSixBQUFpQyxjQUFjLEFBQzdDOzRCQUFnQixZQUFBO3FCQUFBLEFBQU07QUFBZixhQUFBLEVBQVAsQUFBTyxBQUNILEFBQ0w7QUFIRCxpQkFHTyxBQUNMO21CQUFBLEFBQU8sQUFDUjtBQUNGO0FBakNELEFBbUNBOztZQUFNLHNCQUFzQixTQUF0QixBQUFzQixvQkFBQSxBQUFVLE9BQU8sQUFDM0M7bUJBQVMsWUFBWSxBQUNuQjtnQkFBSSxDQUFDLFFBQUwsQUFBYSxrQkFBa0IsQUFDN0I7cUJBQU8sbUJBQVAsQUFBTyxBQUFtQixBQUMzQjtBQUNGO0FBSkQsQUFLQTtlQUFBLEFBQUssTUFBTCxBQUFXLEFBQ1g7aUJBQU8sbUJBQUEsQUFBbUIsT0FBbkIsQUFBMEIsU0FBakMsQUFBTyxBQUFtQyxBQUMzQztBQVJELEFBVUE7O2NBQUEsQUFBTSxrQkFBa0IsS0FBeEIsQUFBNkIsTUFBN0IsQUFBbUMsQUFDbkM7WUFBTSxXQUFXLEVBQUMsVUFBVSxpQkFBaUIsVUFBNUIsQUFBVyxBQUEyQixjQUFjLGNBQWMsUUFBbkYsQUFBaUIsQUFBa0UsQUFBUSxBQUMzRjtlQUFPLEdBQUEsQUFBRyxJQUFILEFBQU8sVUFBUCxBQUFpQixLQUFqQixBQUFzQix3QkFBN0IsQUFBTyxBQUE4QyxBQUN0RDtBQUVEOztlQUFBLEFBQVMsc0JBQVQsQUFBK0IsU0FBL0IsQUFBd0MsU0FBUyxBQUMvQztZQUFJLENBQUMsUUFBRCxBQUFTLHdCQUF3QixDQUFDLFFBQWxDLEFBQTBDLFdBQVksT0FBQSxBQUFPLEtBQUssUUFBWixBQUFvQixTQUFwQixBQUE2QixXQUF2RixBQUFrRyxHQUFJLEFBQ3BHO2NBQU0sV0FBVyxHQUFqQixBQUFpQixBQUFHLEFBQ3BCO21CQUFBLEFBQVMsUUFBVCxBQUFpQixBQUNqQjtpQkFBTyxTQUFQLEFBQWdCLEFBQ2pCO0FBRUQ7O2dDQUF3QixRQUFqQixBQUF5QixzQkFBekIsQUFBK0MsS0FBSyxVQUFBLEFBQVUsVUFBVSxBQUM3RTtrQkFBQSxBQUFRLEtBQVIsQUFBYSxBQUNiO2lCQUFPLFNBQVMsUUFBVCxBQUFTLEFBQVEsWUFBWSxXQUFwQyxBQUFPLEFBQTZCLEFBQVcsQUFDaEQ7QUFIRCxBQUFPLEFBSVIsU0FKUTtBQU1UOztlQUFBLEFBQVMsbUJBQVQsQUFBNEIsT0FBNUIsQUFBbUMsU0FBbkMsQUFBNEMsU0FBUyxBQUNuRDtZQUFJLFFBQUosQUFBWSwyQkFBMkIsQUFDckM7aUJBQU8sMkJBQUEsQUFBMkIsU0FBbEMsQUFBTyxBQUFvQyxBQUM1QztBQUZELGVBRU8sSUFBSSxRQUFKLEFBQVkseUJBQXlCLEFBQzFDO2lCQUFPLG1CQUFBLEFBQW1CLE9BQW5CLEFBQTBCLFNBQTFCLEFBQW1DLFNBQTFDLEFBQU8sQUFBNEMsQUFDcEQ7QUFDRjtBQUVEOztVQUFNLDZCQUE2QixTQUE3QixBQUE2QiwyQkFBQSxBQUFDLFNBQUQsQUFBVSxTQUFWO2VBQXNCLGtCQUFBLEFBQWtCLFNBQWxCLEFBQTJCLFNBQWpELEFBQXNCLEFBQW9DO0FBQTdGLEFBRUE7O2VBQUEsQUFBUyxVQUFULEFBQW1CLE9BQW5CLEFBQTBCLFNBQTFCLEFBQW1DLFNBQVMsQUFDMUM7WUFBSSxjQUFKLEFBQWtCLEFBQ2xCO1lBQUksUUFBSixBQUFZLGtCQUFrQixBQUM1Qjt3QkFBYyxrQkFBQSxBQUFrQixTQUFoQyxBQUFjLEFBQTJCLEFBQzFDO0FBRkQsZUFFTyxJQUFJLFFBQUosQUFBWSxnQkFBZ0IsQUFDakM7d0JBQWMsbUJBQUEsQUFBbUIsT0FBbkIsQUFBMEIsU0FBeEMsQUFBYyxBQUFtQyxBQUNsRDtBQUVEOztpQkFBUyxZQUFZLEFBQ25CO2NBQUksQ0FBQyxRQUFMLEFBQWEsa0JBQWtCLEFBQzdCO21CQUFPLG1CQUFQLEFBQU8sQUFBbUIsQUFDM0I7QUFDRjtBQUpELEFBS0E7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7VUFBTSxvQkFBb0IsU0FBcEIsQUFBb0Isa0JBQUEsQUFBQyxTQUFELEFBQVUsU0FBVjtlQUFzQixrQkFBQSxBQUFrQixTQUFsQixBQUEyQixTQUFqRCxBQUFzQixBQUFvQztBQUFwRixBQUVBOztlQUFBLEFBQVMsa0JBQVQsQUFBMkIsU0FBM0IsQUFBb0MsU0FBcEMsQUFBNkMsZUFBZSxBQUMxRDtZQUFJLENBQUMsUUFBTCxBQUFLLEFBQVEsZ0JBQWdCLEFBQzNCO0FBQ0Q7QUFDRDtnQ0FBd0IsUUFBakIsQUFBaUIsQUFBUSxnQkFBekIsQUFBeUMsS0FBSyxVQUFBLEFBQVUsVUFBVSxBQUN2RTtrQkFBQSxBQUFRLEtBQVIsQUFBYSxBQUNiO2NBQU0sT0FBTyxTQUFTLFFBQXRCLEFBQWEsQUFBUyxBQUFRLEFBQzlCO3NCQUFZLG1CQUFaLEFBQVksQUFBbUIsQUFDL0I7aUJBQU8sS0FBUCxBQUFPLEFBQUssQUFDYjtBQUxELEFBQU8sQUFNUixTQU5RO0FBUVQ7O2VBQUEsQUFBUyxtQkFBVCxBQUE0QixPQUE1QixBQUFtQyxTQUFuQyxBQUE0QyxTQUE1QyxBQUFxRCx1QkFBdUIsQUFDMUU7WUFBSSxDQUFKLEFBQUssdUJBQXVCLEFBQzFCO2tDQUFBLEFBQXdCLEFBQ3pCO0FBQ0Q7WUFBSSxDQUFDLFFBQUwsQUFBSyxBQUFRLHdCQUF3QixBQUNuQztBQUNEO0FBQ0Q7WUFBTSxZQUFZLHdCQUFBLEFBQXdCLFNBQTFDLEFBQWtCLEFBQWlDLEFBQ25EO1lBQU0sT0FBTyxFQUFDLGNBQWMsRUFBQyxPQUE3QixBQUFhLEFBQWUsQUFFNUI7O2dDQUF3QixVQUFqQixBQUEyQixhQUEzQixBQUF3QyxLQUFLLFVBQUEsQUFBVSxVQUFVLEFBQ3RFO2VBQUEsQUFBSyxXQUFMLEFBQWdCLEFBQ2hCO2lCQUFPLGdCQUFBLEFBQWdCLFNBQWhCLEFBQXlCLFdBQWhDLEFBQU8sQUFBb0MsQUFDNUM7QUFIRCxBQUFPLEFBSVIsU0FKUTtBQU1UOztlQUFBLEFBQVMsZ0JBQVQsQUFBeUIsU0FBekIsQUFBa0MsV0FBbEMsQUFBNkMsTUFBTTtZQUFBLEFBQzFDLGVBRDBDLEFBQzFCLEtBRDBCLEFBQzFDO1lBRDBDLEFBRTFDLFdBRjBDLEFBRTlCLEtBRjhCLEFBRTFDLEFBRVA7O2dCQUFBLEFBQVEsS0FBUixBQUFhLEFBQ2I7WUFBTSxPQUFPLFNBQVMsUUFBdEIsQUFBYSxBQUFTLEFBQVEsQUFDOUI7b0JBQVksbUJBQVosQUFBWSxBQUFtQixBQUUvQjs7WUFBSSxVQUFKLEFBQWMsWUFBWSxBQUN4QjtjQUFNLFNBQVMsRUFBQSxBQUFFLE1BQUYsQUFBUSxjQUFjLEVBQUMsUUFBRCxBQUFTLFdBQVcsVUFBVSxRQUFBLEFBQVEsV0FBUixBQUFtQixHQUF0RixBQUFlLEFBQXNCLEFBQThCLEFBQXNCLEFBRXpGOztjQUFJLEFBQ0Y7bUJBQUEsQUFBTyxPQUFPLFVBQWQsQUFBd0IsZ0JBQWdCLFlBQVksVUFBWixBQUFzQixZQUE5RCxBQUF3QyxBQUFrQyxBQUMzRTtBQUZELFlBR0EsT0FBQSxBQUFPLE9BQU8sQUFDWjtnQkFBSSxvQkFBSixBQUVBOztnQkFBSSxBQUNGO2tCQUFJLEVBQUEsQUFBRSxTQUFOLEFBQUksQUFBVyxRQUFRLEFBQ3JCOytCQUFlLEtBQUEsQUFBSyxVQUFwQixBQUFlLEFBQWUsQUFDL0I7QUFGRCxxQkFFTyxBQUNMOytCQUFBLEFBQWUsQUFDaEI7QUFFRjtBQVBELGNBT0UsT0FBQSxBQUFPLFdBQVcsQUFDbEI7NkJBQUEsQUFBZSxBQUNoQjtBQUVEOztpQkFBQSxBQUFLLG9EQUFMLEFBQXVELGNBQXZELEFBQWdFLEFBQ2hFO2tCQUFBLEFBQU0sQUFDUDtBQUNGO0FBRUQ7O2VBQU8sS0FBUCxBQUFPLEFBQUssQUFDYjtBQUVEOztVQUFNLFVBQVUsU0FBVixBQUFVLFFBQUEsQUFBVSxTQUFTLEFBQ2pDO1lBQUksQ0FBQyxRQUFELEFBQVMsV0FBWSxPQUFBLEFBQU8sS0FBSyxRQUFaLEFBQW9CLFNBQXBCLEFBQTZCLFdBQXRELEFBQWlFLEdBQUksQUFDbkU7Y0FBTSxXQUFXLEdBQWpCLEFBQWlCLEFBQUcsQUFDcEI7bUJBQUEsQUFBUyxRQUFULEFBQWlCLEFBQ2pCO2lCQUFPLFNBQVAsQUFBZ0IsQUFDakI7QUFFRDs7WUFBTSxXQUFOLEFBQWlCLEFBRWpCOzthQUFLLElBQUwsQUFBVyxrQkFBa0IsUUFBN0IsQUFBcUMsU0FBUyxBQUM1QztjQUFNLG9CQUFvQixRQUFBLEFBQVEsUUFBbEMsQUFBMEIsQUFBZ0IsQUFDMUM7Y0FBSSxBQUNGO3FCQUFBLEFBQVMsa0JBQWtCLFVBQUEsQUFBVSxPQUFyQyxBQUEyQixBQUFpQixBQUM3QztBQUZELFlBRUUsT0FBQSxBQUFPLEdBQUcsQUFDVjtxQkFBQSxBQUFTLGtCQUFrQixHQUFBLEFBQUcsT0FBOUIsQUFBMkIsQUFBVSxBQUN0QztBQUNGO0FBRUQ7O2VBQU8sR0FBQSxBQUFHLElBQVYsQUFBTyxBQUFPLEFBQ2Y7QUFuQkQsQUFxQkE7O1VBQU0sNEJBQTRCLFNBQTVCLEFBQTRCLG1DQUFBO2VBQVcsRUFBQSxBQUFFLE1BQU0sUUFBQSxBQUFRLGlCQUFoQixBQUFpQyxJQUFJLFFBQUEsQUFBUSxnQkFBeEQsQUFBVyxBQUE2RDtBQUExRyxBQUVBOztlQUFBLEFBQVMsb0JBQVQsQUFBNkIsS0FBSyxBQUNoQztZQUFJLElBQUEsQUFBSSxPQUFKLEFBQVcsT0FBZixBQUFzQixLQUFLLEFBQ3pCO2lCQUFPLElBQUEsQUFBSSxPQUFYLEFBQU8sQUFBVyxBQUNuQjtBQUZELGVBRU8sQUFDTDtpQkFBQSxBQUFPLEFBQ1I7QUFDRjtBQUVEOztVQUFNLHlCQUF5QixTQUF6QixBQUF5Qiw2QkFBQTtlQUFRLEVBQUEsQUFBRSxRQUFRLEVBQUEsQUFBRSxJQUFJLEtBQU4sQUFBTSxBQUFLLGVBQTdCLEFBQVEsQUFBVSxBQUEwQjtBQUEzRSxBQUVBOztVQUFNLG1CQUFtQixTQUFuQixBQUFtQix1QkFBQTtlQUFRLEVBQUEsQUFBRSxLQUFLLEVBQUEsQUFBRSxJQUFJLHVCQUFOLEFBQU0sQUFBdUIsT0FBNUMsQUFBUSxBQUFPLEFBQW9DO0FBQTVFLEFBRUE7O1VBQU0sU0FBUyxpQkFBZixBQUFlLEFBQWlCLEFBRWhDOzttQkFBTyxBQUFNLFlBQU4sQUFBa0IsS0FBSyxZQUFZLEFBQ3hDO2dDQUFBLEFBQXdCLEFBRXhCOztBQUNBO21CQUFBLEFBQVcsVUFBWCxBQUFxQixBQUNyQjtnQ0FBQSxBQUF3QixBQUV4Qjs7QUFDQTtZQUFJLE9BQUEsQUFBTyxXQUFYLEFBQXNCLEdBQUcsQUFDdkI7QUFDRDtBQUVEOztZQUFNLGVBQWUsU0FBZixBQUFlLGFBQUEsQUFBVSxhQUFWLEFBQXVCLFVBQXZCLEFBQWlDLFVBQVUsQUFDOUQ7Y0FBQSxBQUFJLHVCQUF1QixBQUN6QjtBQUNEO0FBQ0Q7a0NBQUEsQUFBd0IsQUFFeEI7O0FBQ0E7QUFDQTtBQUNBOzBCQUFnQixZQUFZLEFBQzFCO3VCQUFBLEFBQVcsVUFBWCxBQUFxQixBQUNyQjttQkFBTyx3QkFBUCxBQUErQixBQUNoQztBQUhELEFBQU8sQUFJUixXQUpRO0FBVFQsQUFlQTs7Y0FBQSxBQUFNLE1BQU4sQUFBWSxRQUFaLEFBQW9CLEFBRXBCOzsyQkFBQSxBQUFtQixJQUFuQixBQUF1QixZQUFZLFlBQUE7aUJBQU0sTUFBQSxBQUFNLGNBQVosQUFBTSxBQUFvQjtBQUE3RCxBQUNEO0FBOUJELEFBQU8sQUErQlIsT0EvQlE7QUE3VFgsQUFBTyxBQThWUjtBQTlWUSxBQUNMOzs7QUErVkosUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxVQUFoQyxBQUEwQyxRQUExQyxBQUFrRDs7SSxBQUU1QyxpQ0FDSjs4QkFBQSxBQUFZLFlBQVk7MEJBQ3RCOztTQUFBLEFBQUssYUFBTCxBQUFrQixBQUNsQjtTQUFBLEFBQUssUUFBTCxBQUFhLEFBQ2I7U0FBQSxBQUFLLHFCQUFMLEFBQTBCLEFBQzNCOzs7OzswQkFFSyxBQUNKO2FBQU8sS0FBUCxBQUFZLEFBQ2I7Ozs7K0JBRVUsQUFDVDthQUFPLEtBQUEsQUFBSyxTQUFaLEFBQXFCLEFBQ3RCOzs7OytCQUVVLEFBQ1Q7V0FBQSxBQUFLLFFBQVEsS0FBQSxBQUFLLElBQUwsQUFBUyxHQUFHLEtBQUEsQUFBSyxRQUE5QixBQUFhLEFBQXlCLEFBQ3RDO1VBQUksS0FBQSxBQUFLLFVBQVQsQUFBbUIsR0FBRyxBQUNwQjtZQUFJLENBQUMsS0FBTCxBQUFVLG9CQUFvQixBQUM1QjtlQUFBLEFBQUsscUJBQUwsQUFBMEIsQUFDMUI7ZUFBQSxBQUFLLFdBQUwsQUFBZ0IsV0FBaEIsQUFBMkIsQUFDNUI7QUFIRCxlQUdPLEFBQ0w7ZUFBQSxBQUFLLFdBQUwsQUFBZ0IsV0FBaEIsQUFBMkIsQUFDNUI7QUFDRjtBQUNGOzs7OzRCQUVPLEFBQ047V0FBQSxBQUFLLFFBQUwsQUFBYSxBQUNiO2FBQU8sS0FBQSxBQUFLLHFCQUFaLEFBQWlDLEFBQ2xDOzs7Ozs7O0FBR0gsUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxRQUFoQyxBQUF3QyxxQ0FBc0IsVUFBQSxBQUFDLFlBQWUsQUFDNUU7QUFDQTs7U0FBTyxJQUFBLEFBQUksbUJBQVgsQUFBTyxBQUF1QixBQUMvQjtBQUhEOztJLEFBS00sNEJBQ0o7eUJBQUEsQUFBWSxjQUFaLEFBQTBCLGdCQUExQixBQUEwQyxNQUFNOzBCQUM5Qzs7U0FBQSxBQUFLLGVBQUwsQUFBb0IsQUFDcEI7U0FBQSxBQUFLLGlCQUFMLEFBQXNCLEFBRXRCOztTQUFBLEFBQUssT0FBTCxBQUFZLEFBQ1o7U0FBQSxBQUFLLFdBQUwsQUFBZ0IsQUFDakI7Ozs7O3dCLEFBRUcsTUFBTSxBQUNSO2FBQU8sS0FBQSxBQUFLLGFBQUwsQUFBa0IsSUFBSSxLQUF0QixBQUEyQixNQUFsQyxBQUFPLEFBQWlDLEFBQ3pDOzs7OzZCQUVRLEFBQ1A7YUFBTyxLQUFQLEFBQVksQUFDYjs7Ozs4QixBQUVTLE9BQU8sQUFDZjthQUFPLEVBQUEsQUFBRSxVQUFGLEFBQVksT0FBTyxFQUFBLEFBQUUsSUFBRixBQUFNLE9BQU8sS0FBQSxBQUFLLElBQUwsQUFBUyxLQUFoRCxBQUFPLEFBQW1CLEFBQWEsQUFBYyxBQUN0RDs7Ozt3QixBQUVHLE0sQUFBTSxPQUFPLEFBQ2Y7V0FBQSxBQUFLLGFBQUwsQUFBa0IsSUFBSSxLQUF0QixBQUEyQixNQUEzQixBQUFpQyxNQUFqQyxBQUF1QyxBQUN2QztXQUFBLEFBQUssZ0JBQUwsQUFBcUIsTUFBckIsQUFBMkIsQUFDNUI7Ozs7MEIsQUFFSyxPQUFPO2tCQUNYOztVQUFJLEVBQUUsaUJBQU4sQUFBSSxBQUFtQixRQUFRLEFBQzdCO2dCQUFRLENBQVIsQUFBUSxBQUFDLEFBQ1Y7QUFFRDs7UUFBQSxBQUFFLE9BQUYsQUFBUyxLQUFLLFVBQUEsQUFBQyxNQUFTLEFBQ3RCO2NBQUEsQUFBSyxhQUFMLEFBQWtCLE1BQU0sTUFBeEIsQUFBNkIsTUFBN0IsQUFBbUMsQUFDbkM7Y0FBQSxBQUFLLGdCQUFMLEFBQXFCLE1BQXJCLEFBQTJCLEFBQzVCO0FBSEQsQUFJRDs7OzswQixBQUVLLE8sQUFBTyxTQUFTO21CQUNwQjs7VUFBSSxFQUFFLGlCQUFOLEFBQUksQUFBbUIsUUFBUSxBQUM3QjtnQkFBUSxDQUFSLEFBQVEsQUFBQyxBQUNWO0FBRUQ7O1FBQUEsQUFBRSxPQUFGLEFBQVMsS0FBSyxVQUFBLEFBQUMsTUFBUyxBQUN0QjtlQUFBLEFBQUssU0FBTCxBQUFjLEtBQUssT0FBQSxBQUFLLGVBQUwsQUFBb0IsT0FBcEIsQUFBMkIsTUFBM0IsQUFBaUMsU0FBUyxPQUFBLEFBQUssSUFBbEUsQUFBbUIsQUFBMEMsQUFBUyxBQUN2RTtBQUZELEFBR0Q7Ozs7a0MsQUFFYSxTQUFTLEFBQ3JCO1VBQUksS0FBQSxBQUFLLFNBQUwsQUFBYyxXQUFsQixBQUE2QixHQUFHLEFBQzlCO0FBQ0Q7QUFDRDtVQUFNLGNBQU4sQUFBb0IsQUFFcEI7O1FBQUEsQUFBRSxLQUFLLEtBQVAsQUFBWSxVQUFVLHVCQUFlLEFBQ25DO1lBQUksWUFBQSxBQUFZLFlBQWhCLEFBQTRCLFNBQVMsQUFDbkM7c0JBQUEsQUFBWSxLQUFaLEFBQWlCLEFBQ2xCO0FBQ0Y7QUFKRCxBQU1BOzthQUFPLEtBQUEsQUFBSyxXQUFaLEFBQXVCLEFBQ3hCOzs7O29DLEFBRWUsYSxBQUFhLFVBQVU7bUJBQ3JDOztRQUFBLEFBQUUsS0FBSyxLQUFQLEFBQVksVUFBVSxtQkFBVyxBQUMvQjtZQUFJLFFBQUEsQUFBUSxhQUFSLEFBQXFCLGFBQXpCLEFBQUksQUFBa0MsV0FBVyxBQUMvQztjQUFNLHdCQUF3QixPQUFBLEFBQUssYUFBTCxBQUFrQixJQUFJLE9BQXRCLEFBQTJCLE1BQU0sUUFBL0QsQUFBOEIsQUFBeUMsQUFDdkU7a0JBQUEsQUFBUSxPQUFSLEFBQWUsYUFBZixBQUE0QixBQUM3QjtBQUNGO0FBTEQsQUFNRDs7Ozs7OztJLEFBR0csbUNBQ0o7Z0NBQUEsQUFBWSxjQUFaLEFBQTBCLGdCQUFnQjswQkFDeEM7O1NBQUEsQUFBSyxlQUFMLEFBQW9CLEFBQ3BCO1NBQUEsQUFBSyxpQkFBTCxBQUFzQixBQUN2Qjs7Ozs7NkJBRWlCO1VBQVgsQUFBVywyRUFBSixBQUFJLEFBQ2hCOzthQUFPLElBQUEsQUFBSSxjQUFjLEtBQWxCLEFBQXVCLGNBQWMsS0FBckMsQUFBMEMsZ0JBQWpELEFBQU8sQUFBMEQsQUFDbEU7Ozs7Ozs7QUFHSCxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFFBQWhDLEFBQXdDLDJEQUF3QixVQUFBLEFBQUMsY0FBRCxBQUFlLGdCQUFtQixBQUNoRztBQUNBOztTQUFPLElBQUEsQUFBSSxxQkFBSixBQUF5QixjQUFoQyxBQUFPLEFBQXVDLEFBQy9DO0FBSEQ7O0ksQUFLTSxzQkFDSjttQkFBQSxBQUFZLFdBQVosQUFBdUIsU0FBbUM7UUFBMUIsQUFBMEIsbUZBQVgsQUFBVzs7MEJBQ3hEOztTQUFBLEFBQUssWUFBTCxBQUFpQixBQUNqQjtTQUFBLEFBQUssVUFBTCxBQUFlLEFBQ2Y7U0FBQSxBQUFLLGVBQWUsRUFBQSxBQUFFLFVBQXRCLEFBQW9CLEFBQVksQUFDakM7Ozs7O2tDLEFBRWEsTUFBTSxBQUNsQjthQUFPLEtBQUEsQUFBSyxNQUFaLEFBQU8sQUFBVyxBQUNuQjs7OztpQyxBQUVZLGEsQUFBYSxVQUFVLEFBQ2xDO0FBQ0E7VUFBSSxLQUFBLEFBQUssY0FBVCxBQUF1QixhQUFhLEFBQ2xDO2VBQU8sQ0FBQyxRQUFBLEFBQVEsT0FBTyxLQUFmLEFBQW9CLGNBQTVCLEFBQVEsQUFBa0MsQUFDM0M7QUFFRDs7VUFBTTtjQUNFLEtBRE0sQUFDRCxBQUNYO2dCQUFRLEtBQUEsQUFBSyxjQUFjLEtBRmYsQUFFSixBQUF3QixBQUNoQztlQUFPLEtBSFQsQUFBYyxBQUdBLEFBR2Q7QUFOYyxBQUNaOztVQUtJO2NBQVMsQUFDUCxBQUNOO2dCQUFRLEtBQUEsQUFBSyxjQUZBLEFBRUwsQUFBbUIsQUFDM0I7ZUFIRixBQUFlLEFBR04sQUFHVDtBQU5lLEFBQ2I7O1VBS0ksZUFBZSxLQUFBLEFBQUssSUFBSSxPQUFBLEFBQU8sT0FBaEIsQUFBdUIsUUFBUSxNQUFBLEFBQU0sT0FBMUQsQUFBcUIsQUFBNEMsQUFDakU7V0FBSyxJQUFJLGFBQVQsQUFBc0IsR0FBRyxhQUF6QixBQUFzQyxjQUF0QyxBQUFvRCxjQUFjLEFBQ2hFO1lBQUksTUFBQSxBQUFNLE9BQU4sQUFBYSxnQkFBZ0IsT0FBQSxBQUFPLE9BQXhDLEFBQWlDLEFBQWMsYUFBYSxBQUMxRDtpQkFBQSxBQUFPLEFBQ1I7QUFDRjtBQUVEOztBQUVBOztVQUFNLHlCQUF5QixPQUFBLEFBQU8sT0FBUCxBQUFjLFNBQVMsTUFBQSxBQUFNLE9BQTVELEFBQW1FLEFBRW5FOztVQUFBLEFBQUksd0JBQXdCLEFBQzFCO1lBQU0sZUFBZSxPQUFBLEFBQU8sT0FBUCxBQUFjLE1BQU0sTUFBQSxBQUFNLE9BQTFCLEFBQWlDLFFBQWpDLEFBQXlDLEtBQTlELEFBQXFCLEFBQThDLEFBQ25FO1lBQU0sNEJBQTRCLEVBQUEsQUFBRSxJQUFJLE1BQU4sQUFBWSxPQUE5QyxBQUFrQyxBQUFtQixBQUNyRDtlQUFPLENBQUMsUUFBQSxBQUFRLE9BQVIsQUFBZSwyQkFBMkIsT0FBbEQsQUFBUSxBQUFpRCxBQUMxRDtBQUpELGFBSU8sQUFDTDtZQUFNLGdCQUFlLE1BQUEsQUFBTSxPQUFOLEFBQWEsTUFBTSxPQUFBLEFBQU8sT0FBMUIsQUFBaUMsUUFBakMsQUFBeUMsS0FBOUQsQUFBcUIsQUFBOEMsQUFDbkU7WUFBTSxzQkFBc0IsRUFBQSxBQUFFLElBQUksT0FBTixBQUFhLE9BQXpDLEFBQTRCLEFBQW9CLEFBQ2hEO2VBQU8sQ0FBQyxRQUFBLEFBQVEsT0FBTyxNQUFmLEFBQXFCLE9BQTdCLEFBQVEsQUFBNEIsQUFDckM7QUFDRjs7OzsyQixBQUVNLGEsQUFBYSxVQUFVLEFBQzVCO1dBQUEsQUFBSyxRQUFMLEFBQWEsYUFBYixBQUEwQixVQUFVLEtBQXBDLEFBQXlDLEFBQ3pDO1dBQUEsQUFBSyxlQUFlLEVBQUEsQUFBRSxVQUF0QixBQUFvQixBQUFZLEFBQ2pDOzs7Ozs7O0ksQUFHRzs7Ozs7OzsyQixBQUNHLFcsQUFBVyxTQUFtQztVQUExQixBQUEwQixtRkFBWCxBQUFXLEFBQ25EOzthQUFPLElBQUEsQUFBSSxRQUFKLEFBQVksV0FBWixBQUF1QixTQUE5QixBQUFPLEFBQWdDLEFBQ3hDOzs7Ozs7O0FBR0gsUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxRQUFoQyxBQUF3QyxrQkFBa0IsWUFBTSxBQUM5RDtTQUFPLElBQVAsQUFBTyxBQUFJLEFBQ1o7QUFGRDs7QUFJQSxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFNBQWhDLEFBQXlDLDBCQUFTLFVBQUEsQUFBUyxjQUFjLEFBQ3ZFO0FBQ0E7O01BQU0sU0FBTixBQUFlLEFBQ2Y7TUFBTSxhQUFOLEFBQW1CLEFBQ25CO01BQU0sT0FBTixBQUFhLEFBQ2I7TUFBTSxtQkFBTixBQUF5QixBQUN6QjtNQUFNLFFBQU4sQUFBYyxBQUNkO01BQU0sUUFBTixBQUFjLEFBQ2Q7TUFBSSxZQUFKLEFBQWdCLEFBRWhCOztNQUFNO0FBQVcsd0NBQUEsQUFFRixNQUZFLEFBRUksUUFBUSxBQUN6QjtZQUFBLEFBQU0sUUFBTixBQUFjLEFBQ2Q7WUFBQSxBQUFNLE1BQU4sQUFBWSxRQUFRLElBQUEsQUFBSSxPQUFPLE1BQUEsQUFBTSxNQUFOLEFBQVksTUFBdkIsQUFBNkIsUUFBakQsQUFBb0IsQUFBcUMsQUFDekQ7YUFBTyxFQUFBLEFBQUUsT0FBTyxFQUFFLEtBQUssS0FBaEIsQUFBUyxBQUFZLGdCQUE1QixBQUFPLEFBQXFDLEFBQzdDO0FBTmMsQUFRZjtBQVJlLGdEQUFBLEFBUUUsTUFSRixBQVFRLFFBQVEsQUFDN0I7YUFBQSxBQUFPLFFBQVEsRUFBQSxBQUFFLE9BQU8sRUFBQyxNQUFWLEFBQVMsUUFBeEIsQUFBZSxBQUFpQixBQUNoQzthQUFPLEVBQUEsQUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFoQixBQUFTLEFBQVksb0JBQTVCLEFBQU8sQUFBeUMsQUFDakQ7QUFYYyxBQWFmO0FBYmUsa0RBQUEsQUFhRyxNQWJILEFBYVMsSUFBSSxBQUMxQjtpQkFBQSxBQUFXLFFBQVgsQUFBbUIsQUFDbkI7YUFBTyxFQUFBLEFBQUUsT0FBTyxFQUFFLEtBQUssS0FBaEIsQUFBUyxBQUFZLHFCQUE1QixBQUFPLEFBQTBDLEFBQ2xEO0FBaEJjLEFBa0JmO0FBbEJlLHNDQUFBLEFBa0JILFNBQXNCO1VBQWIsQUFBYSw2RUFBSixBQUFJLEFBQ2hDOztVQUFNO3FCQUNTLEtBQUEsQUFBSyxtQkFBTCxBQUF3QixTQUR2QixBQUNELEFBQWlDLEFBQzlDO2lCQUZGLEFBQWdCLEFBS2hCO0FBTGdCLEFBQ2Q7O1dBSUYsQUFBSyxLQUFLLEVBQUEsQUFBRSxPQUFGLEFBQVMsU0FBbkIsQUFBVSxBQUFrQixBQUM1QjthQUFPLEVBQUEsQUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFoQixBQUFTLEFBQVksZUFBNUIsQUFBTyxBQUFvQyxBQUM1QztBQTFCYyxBQTRCZjtBQTVCZSx3REE0Qm1CO3lDQUFYLEFBQVcsNkRBQVg7QUFBVyxxQ0FBQTtBQUNoQzs7UUFBQSxBQUFFLFFBQUYsQUFBVSxXQUFXLFVBQUEsQUFBQyxPQUFVLEFBQzlCO1lBQUksQ0FBQyxpQkFBQSxBQUFpQixTQUF0QixBQUFLLEFBQTBCLFFBQVEsQUFDckM7MkJBQUEsQUFBaUIsS0FBakIsQUFBc0IsQUFDdkI7QUFDRjtBQUpELEFBS0Q7QUFsQ2MsQUFvQ2Y7QUFwQ2Usd0NBQUEsQUFvQ0YsTUFBTSxBQUNqQjtrQkFBQSxBQUFZLEFBQ2I7QUF0Q2MsQUF3Q2Y7QUF4Q2Usb0RBQUEsQUF3Q0ksWUF4Q0osQUF3Q2dCLFFBQVEsQUFDckM7VUFBSSxhQUFKLEFBQ0E7bUJBQWEsS0FBQSxBQUFLLDhCQUFsQixBQUFhLEFBQW1DLEFBQ2hEO21CQUFhLEtBQUEsQUFBSyw2QkFBbEIsQUFBYSxBQUFrQyxBQUUvQzs7VUFBTSxhQUFOLEFBQW1CLEFBQ25CO1VBQUksV0FBSixBQUFlLEFBRWY7O1VBQUksQ0FBQyxPQUFMLEFBQVksY0FBYyxBQUN4Qjt5QkFBQSxBQUFlLFdBQ2hCO0FBRUQ7O1VBQU0sWUFBTixBQUFrQixBQUVsQjs7YUFBTyxDQUFDLFFBQVEsV0FBQSxBQUFXLEtBQXBCLEFBQVMsQUFBZ0IsaUJBQWhDLEFBQWlELE1BQU0sQUFDckQ7WUFBTSxRQUFRLE9BQU8sTUFBckIsQUFBYyxBQUFPLEFBQU0sQUFDM0I7a0JBQUEsQUFBVSxLQUFWLEFBQWUsQUFDZjttQkFBVyxTQUFBLEFBQVMsUUFBUSxNQUFqQixBQUFpQixBQUFNLFVBQVEsTUFBTSxNQUFOLEFBQVksTUFBWixBQUFrQixNQUFqRCxBQUF1RCxTQUFsRSxBQUNEO0FBRUQ7O2VBQUEsQUFBUyxRQUFULEFBQWlCLEtBQWpCLEFBQXNCLEFBRXRCOzs7ZUFDUyxJQUFBLEFBQUksT0FBSixBQUFXLFVBRGIsQUFDRSxBQUFxQixBQUM1QjtnQkFGRixBQUFPLEFBRUcsQUFFWDtBQUpRLEFBQ0w7QUEvRFcsQUFvRWY7QUFwRWUsd0VBQUEsQUFvRWMsS0FBSyxBQUNoQztVQUFJLElBQUEsQUFBSSxNQUFSLEFBQUksQUFBVSxRQUFRLEFBQ3BCO2VBQU8sSUFBQSxBQUFJLFFBQUosQUFBWSxPQUFuQixBQUFPLEFBQW1CLEFBQzNCO0FBQ0Q7YUFBQSxBQUFVLE1BQ1g7QUF6RWMsQUEyRWY7QUEzRWUsMEVBQUEsQUEyRWUsS0FBSyxBQUNqQzthQUFPLElBQUEsQUFBSSxRQUFKLEFBQVksaUNBQW5CLEFBQU8sQUFBNkMsQUFDckQ7QUE3RWMsQUErRWY7QUEvRWUseURBQUEsQUErRVYsV0EvRVUsQUErRUMsV0EvRUQsQUErRVksSUFBSSxBQUM3QjtBQUVBOztBQUNBO0FBQ0E7QUFFQTs7QUFFQTs7UUFBQSxBQUFFLE1BQUYsQUFBUSxZQUFZLFVBQUEsQUFBQyxRQUFELEFBQVMsWUFBVDtlQUNsQixXQUFBLEFBQVcsY0FBYyxVQUFBLEFBQVMsTUFBTSxBQUN0QztjQUFJLENBQUosQUFBSyxNQUFNLEFBQUU7bUJBQUEsQUFBTyxBQUFLO0FBQ3pCO2NBQU0sU0FBUyxFQUFDLFNBQWhCLEFBQWUsQUFBVSxBQUN6QjtpQkFBTyxVQUFBLEFBQVUsT0FBVixBQUFpQixRQUFqQixBQUF5QixJQUFoQyxBQUFPLEFBQTZCLEFBQ3JDO0FBTGlCO0FBQXBCLEFBUUE7O1VBQUksY0FBSixBQUFrQixBQUVsQjs7VUFBTTt5QkFBVSxBQUNHLEFBQ2pCO3VCQUFlLEdBRkQsQUFFQyxBQUFHLEFBRWxCOztBQUpjLDhCQUFBLEFBSVIsWUFBWTsyQ0FBQTttQ0FBQTtnQ0FBQTs7Y0FDaEI7a0NBQWtCLE1BQUEsQUFBTSxLQUF4QixBQUFrQixBQUFXLHdJQUFPO2tCQUF6QixBQUF5QixhQUNsQzs7a0JBQUksYUFBSixBQUNBO2tCQUFJLENBQUMsUUFBUSxJQUFBLEFBQUksWUFBSixBQUFnQixNQUFoQixBQUFzQixLQUEvQixBQUFTLEFBQTJCLGlCQUF4QyxBQUF5RCxNQUFNLEFBQzdEO3VCQUFPLEVBQUMsS0FBRCxLQUFNLFlBQWIsQUFBTyxBQUFrQixBQUMxQjtBQUNGO0FBTmU7d0JBQUE7aUNBQUE7OEJBQUE7b0JBQUE7Z0JBQUE7b0VBQUE7MkJBQUE7QUFBQTtzQkFBQTtzQ0FBQTtzQkFBQTtBQUFBO0FBQUE7QUFPaEI7O2lCQUFBLEFBQU8sQUFDUjtBQVphLEFBY2Q7QUFkYywwQ0FBQSxBQWNGLE9BQStCO2NBQXhCLEFBQXdCLGlGQUFYLEFBQVcsQUFDekM7O2NBQU0sV0FBVyxLQUFBLEFBQUssbUJBQXRCLEFBQWlCLEFBQXdCLEFBQ3pDO2NBQU0sT0FBTyxLQUFBLEFBQUssZ0JBQWxCLEFBQWEsQUFBcUIsQUFDbEM7dUJBQWEsS0FBQSxBQUFLLGtCQUFsQixBQUFhLEFBQXVCLEFBQ3BDO2lCQUFPLGFBQUEsQUFBYSxRQUFiLEFBQXFCLFlBQXJCLEFBQWlDLE1BQXhDLEFBQU8sQUFBdUMsQUFDL0M7QUFuQmEsQUFxQmQ7QUFyQmMsc0RBQUEsQUFxQkksWUFBWSxBQUM1QjtjQUFJLENBQUosQUFBSyxZQUFZLEFBQUU7eUJBQWEsVUFBYixBQUFhLEFBQVUsQUFBVztBQUNyRDtjQUFNLE9BQU8sRUFBQSxBQUFFLE1BQWYsQUFBYSxBQUFRLEFBQ3JCO2NBQU0sVUFBTixBQUFnQixBQUVoQjs7WUFBQSxBQUFFLFFBQUYsQUFBVSxNQUFNLFVBQUEsQUFBQyxPQUFELEFBQVEsS0FBUSxBQUM5QjtnQkFBSSxZQUFZLEVBQUEsQUFBRSxRQUFGLEFBQVUsUUFBUSxFQUFFLGFBQXBDLEFBQWdCLEFBQWtCLEFBQWUsQUFDakQ7Z0JBQUksQ0FBSixBQUFLLFdBQVcsQUFBRTswQkFBQSxBQUFZLEFBQU07QUFFcEM7O2dCQUFNLGdCQUFnQixPQUFBLEFBQU8sYUFBYSxFQUFBLEFBQUUsSUFBSSxPQUFOLEFBQU0sQUFBTyxZQUFqQyxBQUFvQixBQUF5QixVQUFuRSxBQUE2RSxBQUM3RTtnQkFBSSxDQUFDLE9BQUQsQUFBQyxBQUFPLGNBQWUsTUFBQSxBQUFNLGVBQU4sQUFBcUIsTUFBckIsQUFBMkIsS0FBdEQsQUFBMkIsQUFBZ0MsUUFBUyxBQUVsRTs7a0JBQU0sWUFBWSxPQUFBLEFBQU8sYUFBYSxPQUFBLEFBQU8sV0FBM0IsQUFBc0MsT0FBeEQsQUFBK0QsQUFDL0Q7a0JBQU0sZ0JBQWdCLFlBQVksTUFBWixBQUFZLEFBQU0sYUFBeEMsQUFBcUQsQUFDckQ7a0JBQU0sa0JBQWtCLGdCQUFnQixjQUFoQixBQUE4QixTQUF0RCxBQUErRCxBQUUvRDs7a0JBQUEsQUFBSSxpQkFBaUIsQUFDbkI7d0JBQVEsVUFBQSxBQUFVLE9BQVYsQUFBaUIsaUJBQWpCLEFBQWtDLE1BQU0sRUFBQyxPQUFqRCxBQUFRLEFBQXdDLEFBQVEsQUFDekQ7QUFFRDs7a0JBQU0sMEJBQTBCLE9BQUEsQUFBTyxhQUFhLE9BQUEsQUFBTyxXQUEzQixBQUFzQyxZQUF0RSxBQUFrRixBQUNsRjtrQkFBTSxVQUFVLDJCQUFoQixBQUEyQyxBQUUzQzs7MkJBQUEsQUFBYSxJQUFiLEFBQWlCLFNBQWpCLEFBQTBCLFNBQTFCLEFBQW1DLEFBQ3BDO0FBQ0Y7QUFwQkQsQUFzQkE7O2lCQUFBLEFBQU8sQUFDUjtBQWpEYSxBQW1EZDtBQW5EYyx3REFBQSxBQW1ESyxPQUFPLEFBQ3hCO2NBQU0sT0FBTixBQUFhLEFBRWI7O1lBQUEsQUFBRSxRQUFRLE1BQUEsQUFBTSxJQUFoQixBQUFvQixPQUFPLFVBQUEsQUFBQyxPQUFELEFBQVEsS0FBUSxBQUN6Qzt5QkFBQSxBQUFhLElBQWIsQUFBaUIsTUFBakIsQUFBdUIsS0FBTSxRQUFBLEFBQU8sOENBQVAsQUFBTyxZQUFQLEFBQWlCLFdBQVcsRUFBQSxBQUFFLFVBQTlCLEFBQTRCLEFBQVksU0FBckUsQUFBOEUsQUFDL0U7QUFGRCxBQUlBOztpQkFBQSxBQUFPLEFBQ1I7QUEzRGEsQUE2RGQ7QUE3RGMsa0RBQUEsQUE2REUsT0FBTyxBQUNyQjtjQUFNLE9BQU4sQUFBYSxBQUNiO2NBQU0sYUFBYSxNQUFBLEFBQU0sSUFBTixBQUFVLFlBQTdCLEFBQXlDLEFBRXpDOztjQUFJLFdBQUEsQUFBVyxXQUFmLEFBQTBCLEdBQUcsQUFBRTttQkFBQSxBQUFPLEFBQUs7QUFFM0M7O2VBQUssSUFBSSxJQUFKLEFBQVEsR0FBRyxNQUFNLFdBQUEsQUFBVyxTQUE1QixBQUFtQyxHQUFHLE1BQU0sS0FBakQsQUFBc0QsS0FBSyxNQUFNLEtBQU4sQUFBVyxNQUFNLEtBQTVFLEFBQWlGLEtBQUssTUFBQSxBQUFNLE1BQTVGLEFBQWtHLEtBQUssQUFDckc7Z0JBQU0sUUFBUSxNQUFBLEFBQU0sSUFBTixBQUFVLFlBQVYsQUFBc0IsT0FBcEMsQUFBYyxBQUE2QixBQUMzQztnQkFBSSxRQUFRLE1BQUEsQUFBTSxXQUFXLElBQTdCLEFBQVksQUFBbUIsQUFFL0I7O2dCQUFJLE1BQU0sTUFBTixBQUFZLE1BQWhCLEFBQXNCLFFBQVEsQUFBRTtzQkFBUSxVQUFBLEFBQVUsT0FBTyxNQUFNLE1BQU4sQUFBWSxNQUE3QixBQUFtQyxRQUFuQyxBQUEyQyxNQUFNLEVBQUMsT0FBMUQsQUFBUSxBQUFpRCxBQUFRLEFBQVU7QUFFM0c7O3lCQUFBLEFBQWEsSUFBYixBQUFpQixNQUFPLE1BQUEsQUFBTSxhQUFhLE1BQTNDLEFBQWlELE1BQWpELEFBQXdELEFBQ3pEO0FBRUQ7O2lCQUFBLEFBQU8sQUFDUjtBQTdFYSxBQStFZDtBQS9FYyxnREErRUUsQUFDZDtpQkFBQSxBQUFPLEFBQ1I7QUFqRmEsQUFtRmQ7QUFuRmMsNENBQUEsQUFtRkQsTUFBTSxBQUNqQjtpQkFBTyxXQUFQLEFBQU8sQUFBVyxBQUNuQjtBQXJGYSxBQXVGZDtBQXZGYyxrREFBQSxBQXVGRSxNQUFpQjtjQUFYLEFBQVcsMkVBQUosQUFBSSxBQUMvQjs7aUJBQU8sV0FBQSxBQUFXLE1BQWxCLEFBQU8sQUFBaUIsQUFDekI7QUF6RmEsQUEyRmQ7QUEzRmMsd0JBQUEsQUEyRlgsTUFBaUI7Y0FBWCxBQUFXLDJFQUFKLEFBQUksQUFDbEI7O2lCQUFPLFVBQUEsQUFBVSxJQUFJLEtBQUEsQUFBSyxnQkFBTCxBQUFxQixNQUExQyxBQUFPLEFBQWMsQUFBMkIsQUFDakQ7QUE3RmEsQUErRmQ7QUEvRmMsNERBK0ZRLEFBQ3BCO2lCQUFBLEFBQU8sQUFDUjtBQWpHYSxBQW1HZDtBQW5HYyxzREFtR0ssQUFDakI7d0JBQUEsQUFBYyxBQUNmO0FBckdhLEFBdUdkO0FBdkdjLGtEQXVHZTs2Q0FBWCxBQUFXLDZEQUFYO0FBQVcseUNBQUE7QUFDM0I7O3dCQUFjLFlBQUEsQUFBWSxPQUExQixBQUFjLEFBQW1CLEFBQ2xDO0FBekdhLEFBMkdkO0FBM0djLGtEQTJHRyxBQUNmO2lCQUFBLEFBQU8sQUFDUjtBQTdHYSxBQStHZDtBQS9HYyxzREFBQSxBQStHSSxVQS9HSixBQStHYyxTQUFTLEFBQ25DO2VBQUEsQUFBSyxnQkFBTCxBQUFxQixZQUFyQixBQUFpQyxBQUNsQztBQWpIYSxBQW1IZDtBQW5IYyxzREFBQSxBQW1ISSxVQUFVLEFBQzFCO2lCQUFPLEtBQUEsQUFBSyxnQkFBWixBQUFPLEFBQXFCLEFBQzdCO0FBckhhLEFBdUhkO0FBdkhjLDREQUFBLEFBdUhPLFVBQVUsQUFDN0I7aUJBQU8sS0FBQSxBQUFLLGdCQUFaLEFBQU8sQUFBcUIsQUFDN0I7QUF6SGEsQUEySGQ7QUEzSGMsc0VBQUEsQUEySFksVUEzSFosQUEySHNCLHVCQUF1QixBQUN6RDtjQUFNLGlCQUFpQixLQUFBLEFBQUssa0JBQTVCLEFBQXVCLEFBQXVCLEFBRTlDOztjQUFJLENBQUosQUFBSyxnQkFBZ0IsQUFDbkI7bUJBQUEsQUFBTyxBQUNSO0FBRUQ7O2lCQUFPLGlDQUFBLEFBQWlDLFNBQ3RDLHNCQUFBLEFBQXNCLEtBQUssZUFEdEIsQUFDTCxBQUEwQyxRQUMxQyxlQUFBLEFBQWUsU0FGakIsQUFFMEIsQUFDM0I7QUFySWEsQUF1SWQ7QUF2SWMsb0NBQUEsQUF1SUwsT0FBTyxBQUNkO2NBQUksQ0FBSixBQUFLLE9BQU8sQUFDVjtpQkFBQSxBQUFLLGdCQUFnQixHQUFyQixBQUFxQixBQUFHLEFBQ3pCO0FBRkQsaUJBRU8sQUFDTDtpQkFBQSxBQUFLLGNBQUwsQUFBbUIsQUFDcEI7QUFDRDtpQkFBQSxBQUFPLEFBQ1I7QUE5SWEsQUFnSmQ7QUFoSmMsb0NBZ0pKLEFBQ1I7aUJBQUEsQUFBTyxBQUNSO0FBbEphLEFBb0pkO0FBcEpjLDBEQW9KTyxBQUNuQjtpQkFBQSxBQUFPLEFBQ1I7QUF0SmEsQUF3SmQ7QUF4SmMsd0NBd0pGLEFBQ1Y7aUJBQU8sS0FBQSxBQUFLLGNBQVosQUFBMEIsQUFDM0I7QUExSkgsQUFBZ0IsQUE2SmhCO0FBN0pnQixBQUNkOzthQTRKRixBQUFPLEFBQ1I7QUFoUUgsQUFBaUIsQUFtUWpCO0FBblFpQixBQUVmOztXQWlRRixBQUFTLGFBQVQsQUFBc0IsYUFBWSxPQUFELEFBQVEsT0FBTyxTQUFRLEFBQUMsU0FBUyxpQkFBQTthQUFTLFNBQVQsQUFBUyxBQUFTO0FBQXBGLEFBQWlDLEFBQXVCLEFBQ3hELEtBRHdELENBQXZCO1dBQ2pDLEFBQVMsYUFBVCxBQUFzQixTQUFTLEVBQUMsT0FBaEMsQUFBK0IsQUFBUSxBQUN2QztXQUFBLEFBQVMsYUFBVCxBQUFzQixPQUFPLEVBQUMsT0FBOUIsQUFBNkIsQUFBUSxBQUNyQztXQUFBLEFBQVMsYUFBVCxBQUFzQixVQUFTLE9BQUQsQUFBUSxNQUFNLFNBQVEsQUFBQyxTQUFTLGlCQUFBO2FBQVMsTUFBQSxBQUFNLE1BQWYsQUFBUyxBQUFZO0FBQW5GLEFBQThCLEFBQXNCLEFBRXBELEtBRm9ELENBQXRCOztTQUU5QixBQUFPLEFBQ1I7QUFuUkQ7O0ksQUFxUk07Ozs7Ozs7a0QsQUFDQyxzQkFBc0IsQUFDekI7QUFDQTs7YUFBTyxxQkFBUCxBQUFPLEFBQXFCLEFBQzdCOzs7Ozs7O0FBR0gsUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxTQUFoQyxBQUF5QyxTQUFTLElBQWxELEFBQWtELEFBQUk7O0FBRXRELFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWYsQUFBZ0MsU0FBaEMsQUFBeUMsZ0JBQWdCLFlBQVksQUFDbkU7TUFBTSxRQUQ2RCxBQUNuRSxBQUFjOztNQURxRCxBQUc3RCxtQkFDSjtrQkFBQSxBQUFZLE1BQVosQUFBa0IsVUFBVTs0QkFDMUI7O1dBQUEsQUFBSyxPQUFMLEFBQVksQUFDWjtXQUFBLEFBQUssV0FBTCxBQUFnQixBQUNoQjtVQUFJLEVBQUUsS0FBQSxBQUFLLG9CQUFYLEFBQUksQUFBMkIsUUFBUSxBQUNyQzthQUFBLEFBQUssV0FBVyxDQUFDLEtBQWpCLEFBQWdCLEFBQU0sQUFDdkI7QUFDRjtBQVZnRTs7O1dBQUE7b0NBWW5ELEFBQ1o7ZUFBTyxLQUFQLEFBQVksQUFDYjtBQWRnRTtBQUFBOztXQUFBO0FBaUJuRTs7O0FBQU8sd0JBQUEsQUFFQSxNQUZBLEFBRU0sUUFBUSxBQUVqQjs7ZUFBQSxBQUFTLHlCQUFULEFBQWtDLFVBQWxDLEFBQTRDLHFCQUFxQixBQUMvRDtZQUFNLFNBRHlELEFBQy9ELEFBQWU7eUNBRGdEO2lDQUFBOzhCQUFBOztZQUUvRDtnQ0FBc0IsTUFBQSxBQUFNLEtBQTVCLEFBQXNCLEFBQVcsK0lBQWM7Z0JBQXBDLEFBQW9DLGlCQUM3Qzs7Z0JBQUksRUFBRSxRQUFBLEFBQVEseUJBQWQsQUFBSSxBQUFtQyxRQUFRLEFBQzdDO3NCQUFBLEFBQVEsZ0JBQWdCLENBQUMsUUFBekIsQUFBd0IsQUFBUyxBQUNsQztBQUNEO21CQUFBLEFBQU8sS0FBSyxRQUFBLEFBQVEsZ0JBQWdCLFFBQUEsQUFBUSxjQUFSLEFBQXNCLE9BQTFELEFBQW9DLEFBQTZCLEFBQ2xFO0FBUDhEO3NCQUFBOytCQUFBOzRCQUFBO2tCQUFBO2NBQUE7a0VBQUE7eUJBQUE7QUFBQTtvQkFBQTtvQ0FBQTtvQkFBQTtBQUFBO0FBQUE7QUFRL0Q7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O2VBQUEsQUFBUyxtQkFBVCxBQUE0QixVQUE1QixBQUFzQyxlQUFlLEFBQ25EO1lBQU0sU0FENkMsQUFDbkQsQUFBZTt5Q0FEb0M7aUNBQUE7OEJBQUE7O1lBRW5EO2dDQUFzQixNQUFBLEFBQU0sS0FBNUIsQUFBc0IsQUFBVywrSUFBYztnQkFBcEMsQUFBb0MsaUJBQzdDOztnQkFBSSxFQUFFLGFBQU4sQUFBSSxBQUFlLFVBQVUsQUFDM0I7c0JBQUEsQUFBUSxVQUFSLEFBQWtCLEFBQ25CO0FBQ0Q7bUJBQUEsQUFBTyxLQUFLLEVBQUEsQUFBRSxTQUFTLFFBQVgsQUFBbUIsU0FBL0IsQUFBWSxBQUE0QixBQUN6QztBQVBrRDtzQkFBQTsrQkFBQTs0QkFBQTtrQkFBQTtjQUFBO2tFQUFBO3lCQUFBO0FBQUE7b0JBQUE7b0NBQUE7b0JBQUE7QUFBQTtBQUFBO0FBUW5EOztlQUFBLEFBQU8sQUFDUjtBQUVEOztlQUFBLEFBQVMsa0JBQVQsQUFBMkIsYUFBYSxBQUN0QztZQUFNLG9CQUFvQixDQUN4QixFQUFDLE1BQUQsQUFBTyxtQ0FBbUMsZUFEbEIsQUFDeEIsQUFBeUQsK0JBQ3pELEVBQUMsTUFBRCxBQUFPLGlDQUFpQyxlQUZoQixBQUV4QixBQUF1RCw2QkFDdkQsRUFBQyxNQUFELEFBQU8sd0JBQXdCLGVBSFAsQUFHeEIsQUFBOEMsb0JBQzlDLEVBQUMsTUFBRCxBQUFPLDBCQUEwQixlQUxHLEFBQ3RDLEFBQTBCLEFBSXhCLEFBQWdEOzswQ0FMWjtrQ0FBQTsrQkFBQTs7WUFRdEM7aUNBQTBCLE1BQUEsQUFBTSxLQUFoQyxBQUEwQixBQUFXLDBKQUFvQjtnQkFBOUMsQUFBOEMsc0JBQ3ZEOztnQkFBSSxZQUFBLEFBQVksUUFBaEIsQUFBd0IsUUFBUSxBQUM5QjtrQ0FBQSxBQUFvQixhQUFhLFlBQWpDLEFBQTZDLGVBQWUsT0FBTyxZQUFuRSxBQUE0RCxBQUFtQixBQUNoRjtBQUNGO0FBWnFDO3NCQUFBO2dDQUFBOzZCQUFBO2tCQUFBO2NBQUE7b0VBQUE7MEJBQUE7QUFBQTtvQkFBQTtxQ0FBQTtvQkFBQTtBQUFBO0FBQUE7QUFjdEM7O1lBQUkseUJBQUosQUFBNkIsUUFBUSxBQUNuQzttQ0FBQSxBQUF5QixhQUFhLE9BQXRDLEFBQXNDLEFBQU8sQUFDOUM7QUFFRDs7WUFBSSxtQkFBSixBQUF1QixRQUFRLEFBQzdCO2lCQUFPLG1CQUFBLEFBQW1CLGFBQWEsT0FBdkMsQUFBTyxBQUFnQyxBQUFPLEFBQy9DO0FBQ0Y7QUFFRDs7ZUFBQSxBQUFTLG9CQUFULEFBQTZCLFVBQTdCLEFBQXVDLFdBQXZDLEFBQWtELGNBQWMsQUFDOUQ7WUFBTSxTQUR3RCxBQUM5RCxBQUFlOzBDQUQrQztrQ0FBQTsrQkFBQTs7WUFFOUQ7aUNBQXNCLE1BQUEsQUFBTSxLQUE1QixBQUFzQixBQUFXLG9KQUFjO2dCQUFwQyxBQUFvQyxrQkFDN0M7O2dCQUFJLFlBQUosQUFDQTtnQkFBSSxFQUFFLGFBQU4sQUFBSSxBQUFlLFVBQVUsQUFDM0I7cUJBQU8sUUFBQSxBQUFRLGFBQWYsQUFBNEIsQUFDN0I7QUFDRDttQkFBQSxBQUFPLEtBQVAsQUFBWSxBQUNiO0FBUjZEO3NCQUFBO2dDQUFBOzZCQUFBO2tCQUFBO2NBQUE7b0VBQUE7MEJBQUE7QUFBQTtvQkFBQTtxQ0FBQTtvQkFBQTtBQUFBO0FBQUE7QUFTOUQ7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O1VBQUksY0FBSixBQUFrQixBQUNsQjtVQUFJLGNBQUosQUFBa0IsUUFBUSxBQUN4QjtzQkFBYyxPQUFkLEFBQWMsQUFBTyxBQUN0QjtBQUZELGFBRU8sQUFDTDtzQkFBZSxrQkFBRCxBQUFtQixRQUFuQixBQUE0QixTQUFTLENBQW5ELEFBQW1ELEFBQUMsQUFDckQ7QUFFRDs7VUFBSSxFQUFFLFlBQUEsQUFBWSxTQUFsQixBQUFJLEFBQXVCLElBQUksQUFDN0I7Y0FBTSxJQUFBLEFBQUksZ0VBQUosQUFBaUUsT0FBdkUsQUFDRDtBQUVEOzt3QkFBQSxBQUFrQixBQUNsQjthQUFPLE1BQUEsQUFBTSxRQUFRLElBQUEsQUFBSSxLQUFKLEFBQVMsTUFBOUIsQUFBcUIsQUFBZSxBQUNyQztBQTFFSSxBQTRFTDtBQTVFSywwQkE0RUUsQUFDTDs7QUFBTyxrQ0FBQSxBQUNHLE1BQU0sQUFDWjtpQkFBTyxNQUFQLEFBQU8sQUFBTSxBQUNkO0FBSEgsQUFBTyxBQUtSO0FBTFEsQUFDTDtBQTlFTixBQUFPLEFBb0ZSO0FBcEZRLEFBRUw7QUFuQkoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInLCBbJ25nQW5pbWF0ZSddKS5ydW4oZnVuY3Rpb24gKFN0YXRlLCBSb3V0ZSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCBPYmplY3RIZWxwZXIsIFBlbmRpbmdWaWV3Q291bnRlcikge1xuICBcIm5nSW5qZWN0XCI7XG5cbiAgbGV0IG9sZFVybCA9IHVuZGVmaW5lZDtcbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChSb3V0ZS5pc1JlYWR5KCkpIHtcbiAgICAgIFJvdXRlLnNldFJlYWR5KGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKGUsIG5ld1VybCkge1xuICAgIC8vIFdvcmstYXJvdW5kIGZvciBBbmd1bGFySlMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9pc3N1ZXMvODM2OFxuICAgIGxldCBkYXRhO1xuICAgIGlmIChuZXdVcmwgPT09IG9sZFVybCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9sZFVybCA9IG5ld1VybDtcblxuICAgIFBlbmRpbmdWaWV3Q291bnRlci5yZXNldCgpO1xuICAgIGNvbnN0IG1hdGNoID0gUm91dGUubWF0Y2goJGxvY2F0aW9uLnBhdGgoKSk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBSb3V0ZS5leHRyYWN0RGF0YShtYXRjaCk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkc1RvVW5zZXQgPSBPYmplY3RIZWxwZXIubm90SW4oU3RhdGUubGlzdCwgZGF0YSk7XG4gICAgZmllbGRzVG9VbnNldCA9IF8uZGlmZmVyZW5jZShmaWVsZHNUb1Vuc2V0LCBSb3V0ZS5nZXRQZXJzaXN0ZW50U3RhdGVzKCkuY29uY2F0KFJvdXRlLmdldEZsYXNoU3RhdGVzKCkpKTtcblxuICAgIGNvbnN0IGV2ZW50RGF0YSA9IHt1bnNldHRpbmc6IGZpZWxkc1RvVW5zZXQsIHNldHRpbmc6IGRhdGF9O1xuXG4gICAgJHJvb3RTY29wZS4kZW1pdCgnYmlja2VyX3JvdXRlci5iZWZvcmVTdGF0ZUNoYW5nZScsIGV2ZW50RGF0YSk7XG5cbiAgICBpZiAoKGV2ZW50RGF0YS51bnNldHRpbmcpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgU3RhdGUudW5zZXQoZXZlbnREYXRhLnVuc2V0dGluZyk7XG4gICAgfVxuXG4gICAgXy5mb3JFYWNoKGV2ZW50RGF0YS5zZXR0aW5nLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgUm91dGUucmVzZXRGbGFzaFN0YXRlcygpO1xuICAgIFJvdXRlLnNldFJlYWR5KHRydWUpO1xuICB9KTtcbn0pO1xuXHJcbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ09iamVjdEhlbHBlcicsIHtcbiAgZ2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV07XG4gIH0sXG5cbiAgc2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBpZiAocGFyZW50W3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFyZW50W3NlZ21lbnRdID0ge307XG4gICAgICB9XG5cbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV0gPSB2YWx1ZTtcbiAgfSxcblxuICB1bnNldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG5cbiAgICBpZiAocGFyZW50W2tleV0gPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBkZWxldGUgcGFyZW50W2tleV07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgLy8gUmVjdXJzaXZlbHkgcmV0dXJuIHRoZSBwcm9wZXJ0aWVzIGluIGEgdGhhdCBhcmVuJ3QgaW4gYlxuICBub3RJbihhLCBiLCBwcmVmaXggPSAnJykge1xuICAgIGxldCBub3RJbiA9IFtdO1xuICAgIHByZWZpeCA9IHByZWZpeC5sZW5ndGggPiAwID8gYCR7cHJlZml4fS5gIDogJyc7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKE9iamVjdC5rZXlzKGEpKSkge1xuICAgICAgY29uc3QgdGhpc1BhdGggPSBgJHtwcmVmaXh9JHtrZXl9YDtcblxuICAgICAgaWYgKGJba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vdEluLnB1c2godGhpc1BhdGgpO1xuXG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgYVtrZXldID09PSAnb2JqZWN0JykgJiYgKCEoYVtrZXldIGluc3RhbmNlb2YgQXJyYXkpKSkge1xuICAgICAgICBub3RJbiA9IG5vdEluLmNvbmNhdCh0aGlzLm5vdEluKGFba2V5XSwgYltrZXldLCB0aGlzUGF0aCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub3RJbjtcbiAgfSxcblxuICBkZWZhdWx0KG92ZXJyaWRlcywgLi4uZGVmYXVsdFNldHMpIHtcbiAgICBsZXQgZGVmYXVsdFNldCwgdmFsdWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBpZiAoZGVmYXVsdFNldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBkZWZhdWx0U2V0ID0gZGVmYXVsdFNldHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRTZXQgPSB0aGlzLmRlZmF1bHQoLi4uQXJyYXkuZnJvbShkZWZhdWx0U2V0cyB8fCBbXSkpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRTZXQpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFNldFtrZXldO1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiBvdmVycmlkZXNba2V5XSA9PT0gXCJvYmplY3RcIikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmRlZmF1bHQob3ZlcnJpZGVzW2tleV0sIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3ZlcnJpZGVzKSB7XG4gICAgICB2YWx1ZSA9IG92ZXJyaWRlc1trZXldO1xuICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSB8fCB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxuXHJcbi8vIFVzYWdlOlxuLy9cbi8vIElmIHlvdSB3YW50IHRvIGFkZCB0aGUgY2xhc3MgXCJhY3RpdmVcIiB0byBhbiBhbmNob3IgZWxlbWVudCB3aGVuIHRoZSBcIm1haW5cIiB2aWV3IGhhcyBhIGJpbmRpbmdcbi8vIHdpdGggdGhlIG5hbWUgXCJteUJpbmRpbmdcIiByZW5kZXJlZCB3aXRoaW4gaXRcbi8vXG4vLyA8YSByb3V0ZS1jbGFzcz1cInsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6ICdteUJpbmRpbmcnIH1cIj5BbmNob3IgdGV4dDwvYT5cbi8vXG4vLyBZb3UgY2FuIGFsc28gdXNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHRoZSBiaW5kaW5nIG5hbWUsIGJ1dCB0byBkbyBzbyB5b3UgaGF2ZSB0byBwcm92aWRlIGEgbWV0aG9kXG4vLyBvbiB5b3VyIGNvbnRyb2xsZXIgd2hpY2ggcmV0dXJucyB0aGUgcm91dGUgY2xhc3MgZGVmaW5pdGlvbiBvYmplY3QsIGJlY2F1c2UgQW5ndWxhckpTIGV4cHJlc3Npb25zXG4vLyBkb24ndCBzdXBwb3J0IGlubGluZSByZWd1bGFyIGV4cHJlc3Npb25zXG4vL1xuLy8gY2xhc3MgTXlDb250cm9sbGVyIHtcbi8vICBnZXRSb3V0ZUNsYXNzT2JqZWN0KCkge1xuLy8gICAgcmV0dXJuIHsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6IC9teUJpbmQvIH1cbi8vICB9XG4vLyB9XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCIkY3RybC5nZXRSb3V0ZUNsYXNzT2JqZWN0KClcIj5BbmNob3IgdGV4dDwvYT5cbi8vXG5cbmZ1bmN0aW9uIHJvdXRlQ2xhc3NGYWN0b3J5KFJvdXRlKSB7XG4gICduZ0luamVjdCdcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goKCkgPT4ge1xuICAgICAgICBjb25zdCByb3V0ZUNsYXNzRGVmaW5pdGlvbiA9IHNjb3BlLiRldmFsKGlBdHRyc1sncm91dGVDbGFzcyddKVxuXG4gICAgICAgIGlmICghUm91dGUubWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZShyb3V0ZUNsYXNzRGVmaW5pdGlvbi52aWV3TmFtZSwgcm91dGVDbGFzc0RlZmluaXRpb24uYmluZGluZ05hbWUpKSB7XG4gICAgICAgICAgaWYgKGlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5hZGRDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVDbGFzcycsIHJvdXRlQ2xhc3NGYWN0b3J5KTtcblxyXG5mdW5jdGlvbiByb3V0ZUhyZWZGYWN0b3J5IChSb3V0ZSwgJGxvY2F0aW9uLCAkdGltZW91dCkge1xuICAnbmdJbmplY3QnXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHNjb3BlOiB0cnVlLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgaWYgKGlBdHRycy5pZ25vcmVIcmVmID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlFbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsZXQgdXJsID0gaUVsZW1lbnQuYXR0cignaHJlZicpO1xuXG4gICAgICAgIGlmICghUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXiMvLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmwpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdCA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICBjb25zdCB3cml0ZXIgPSBvYmplY3Rbd3JpdGVyTmFtZV07XG4gICAgICBzY29wZVtgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gd3JpdGVyO1xuICAgIH1cblxuICAgIHJldHVybiBzY29wZS4kd2F0Y2goaUF0dHJzLnJvdXRlSHJlZiwgKG5ld1VybCkgPT4ge1xuICAgICAgbGV0IHVybDtcbiAgICAgIGlmIChSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICB1cmwgPSBuZXdVcmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwgPSBgIyR7bmV3VXJsfWA7XG4gICAgICB9XG4gICAgICByZXR1cm4gaUVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgfSk7XG4gIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVIcmVmJywgcm91dGVIcmVmRmFjdG9yeSk7XG5cclxuLy8gQFRPRE8gbm9uZSBvZiB0aGUgYW5pbWF0aW9uIGNvZGUgaW4gdGhpcyBkaXJlY3RpdmUgaGFzIGJlZW4gdGVzdGVkLiBOb3Qgc3VyZSBpZiBpdCBjYW4gYmUgYXQgdGhpcyBzdGFnZSBUaGlzIG5lZWRzIGZ1cnRoZXIgaW52ZXN0aWdhdGlvbi5cbi8vIEBUT0RPIHRoaXMgY29kZSBkb2VzIHRvbyBtdWNoLCBpdCBzaG91bGQgYmUgcmVmYWN0b3JlZC5cblxuZnVuY3Rpb24gcm91dGVWaWV3RmFjdG9yeSgkbG9nLCAkY29tcGlsZSwgJGNvbnRyb2xsZXIsIFZpZXdCaW5kaW5ncywgJHEsIFN0YXRlLCAkcm9vdFNjb3BlLCAkYW5pbWF0ZSwgJHRpbWVvdXQsICRpbmplY3RvciwgUGVuZGluZ1ZpZXdDb3VudGVyLCAkdGVtcGxhdGVSZXF1ZXN0LCBSb3V0ZSkge1xuICAnbmdpbmplY3QnO1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IGZhbHNlLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGU6ICc8ZGl2PjwvZGl2PicsXG4gICAgbGluayAodmlld0RpcmVjdGl2ZVNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBsZXQgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgIGxldCB2aWV3U2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICBjb25zdCB2aWV3ID0gVmlld0JpbmRpbmdzLmdldFZpZXcoaUF0dHJzLm5hbWUpO1xuICAgICAgY29uc3QgYmluZGluZ3MgPSB2aWV3LmdldEJpbmRpbmdzKCk7XG5cbiAgICAgIGlFbGVtZW50LmFkZENsYXNzKCduZy1oaWRlJyk7XG5cbiAgICAgIGxldCBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nID0gYmluZGluZyA9PiBfLmNsb25lRGVlcChTdGF0ZS5nZXRTdWJzZXQoZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyhiaW5kaW5nKSkpO1xuXG4gICAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBmaWVsZCkge1xuICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgZmllbGQgPSAnY29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzb3VyY2UgPSBiaW5kaW5nW2ZpZWxkXSA/ICRpbmplY3Rvci5nZXQoYCR7YmluZGluZ1tmaWVsZF19RGlyZWN0aXZlYClbMF0gOiBiaW5kaW5nO1xuICAgICAgICByZXR1cm4gXy5kZWZhdWx0cyhfLnBpY2soc291cmNlLCBbJ2NvbnRyb2xsZXInLCAndGVtcGxhdGVVcmwnLCAnY29udHJvbGxlckFzJ10pLCB7Y29udHJvbGxlckFzOiAnJGN0cmwnfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW107XG5cbiAgICAgICAgZm9yIChsZXQgcmVxdWlyZW1lbnQgb2YgQXJyYXkuZnJvbShyZXF1aXJlZFN0YXRlKSkge1xuICAgICAgICAgIGxldCBuZWdhdGVSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoJyEnID09PSByZXF1aXJlbWVudC5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIHJlcXVpcmVtZW50ID0gcmVxdWlyZW1lbnQuc2xpY2UoMSk7XG4gICAgICAgICAgICBuZWdhdGVSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBlbGVtZW50ID0gU3RhdGUuZ2V0KHJlcXVpcmVtZW50KTtcblxuICAgICAgICAgIC8vIFJldHVybiBmYWxzZSBpZiBlbGVtZW50IGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGlmICgoZWxlbWVudCA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPbmx5IGNoZWNrIHZhbHVlIG9mIGVsZW1lbnQgaWYgaXQgaXMgZGVmaW5lZFxuICAgICAgICAgIGlmIChuZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSAhZWxlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpbmRpbmcuY2FuQWN0aXZhdGUpIHtcbiAgICAgICAgICBpZiAoISRpbmplY3Rvci5pbnZva2UoYmluZGluZy5jYW5BY3RpdmF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWFuYWdlVmlldyhlbGVtZW50LCBiaW5kaW5ncykge1xuICAgICAgICBjb25zdCBtYXRjaGluZ0JpbmRpbmcgPSBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpO1xuXG4gICAgICAgIGlmICghbWF0Y2hpbmdCaW5kaW5nKSB7XG4gICAgICAgICAgaWYgKHZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveVZpZXcoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIFJvdXRlLmRlbGV0ZUN1cnJlbnRCaW5kaW5nKHZpZXcubmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nKG1hdGNoaW5nQmluZGluZyk7XG4gICAgICAgIGlmICgobWF0Y2hpbmdCaW5kaW5nID09PSBwcmV2aW91c0JpbmRpbmcpICYmIGFuZ3VsYXIuZXF1YWxzKHByZXZpb3VzQm91bmRTdGF0ZSwgbmV3U3RhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gbWF0Y2hpbmdCaW5kaW5nO1xuICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgICAgICBQZW5kaW5nVmlld0NvdW50ZXIuaW5jcmVhc2UoKTtcblxuICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZykudGhlbihmdW5jdGlvbiAoaGFzUmVzb2x2aW5nVGVtcGxhdGUpIHtcbiAgICAgICAgICAvLyBAVE9ETzogTWFnaWMgbnVtYmVyXG4gICAgICAgICAgY29uc3QgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24gPSBoYXNSZXNvbHZpbmdUZW1wbGF0ZSA/IDMwMCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmICghdmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkYW5pbWF0ZS5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykge1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShiaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZXN0cm95VmlldyhlbGVtZW50KSB7XG4gICAgICAgIGlmICh2aWV3Q3JlYXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgZWxlbWVudC5jaGlsZHJlbigpLmVxKDApLnJlbW92ZSgpO1xuICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY3JlYXRlVmlldyhlbGVtZW50LCBiaW5kaW5nLCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgY29uc3QgdGltZVN0YXJ0ZWRNYWluVmlldyA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcpO1xuXG4gICAgICAgIGNvbnN0IG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24gPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgIGlmIChnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpICE9PSBiaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmlld0NyZWF0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgY29uc3QgcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPSBEYXRlLm5vdygpIC0gdGltZVN0YXJ0ZWRNYWluVmlldztcblxuICAgICAgICAgIGNvbnN0IGluamVjdE1haW5UZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGdpdmUgdGhlIHZpZXcgdGltZSB0byBwcm9wZXJseSBpbml0aWFsaXNlXG4gICAgICAgICAgICAgIC8vIGJlZm9yZSBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIHRoZSBpbnRpYWxWaWV3c0xvYWRlZCBldmVudFxuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSA9IE1hdGgubWF4KDAsIG1pbmltdW1EZWxheSAtIHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA8IG1pbmltdW1EZWxheSkge1xuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+IGluamVjdE1haW5UZW1wbGF0ZSgpXG4gICAgICAgICAgICAgICwgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0TWFpblRlbXBsYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUmVzb2x1dGlvbkZhaWx1cmUgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJGxvZy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgUm91dGUuc2V0Q3VycmVudEJpbmRpbmcodmlldy5uYW1lLCBiaW5kaW5nKVxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt0ZW1wbGF0ZTogJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLCBkZXBlbmRlbmNpZXM6IHJlc29sdmUoYmluZGluZyl9O1xuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24sIG9uUmVzb2x1dGlvbkZhaWx1cmUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwgfHwgIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIHJldHVybiAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKCRyb290U2NvcGUuJG5ldygpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGJpbmRpbmcuZXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5lcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ2Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgdGVtcGxhdGVGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG4gICAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgICAgYmluZGluZ0NvbXBvbmVudEZpZWxkID0gJ2Vycm9yQ29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWJpbmRpbmdbYmluZGluZ0NvbXBvbmVudEZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpO1xuICAgICAgICBjb25zdCBhcmdzID0ge2RlcGVuZGVuY2llczoge2Vycm9yfX07XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGFyZ3MudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKSB7XG4gICAgICAgIGNvbnN0IHtkZXBlbmRlbmNpZXN9ID0gYXJncztcbiAgICAgICAgY29uc3Qge3RlbXBsYXRlfSA9IGFyZ3M7XG5cbiAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0gXy5tZXJnZShkZXBlbmRlbmNpZXMsIHskc2NvcGU6IHZpZXdTY29wZSwgJGVsZW1lbnQ6IGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKX0pO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2Fscy4kc2NvcGVbY29tcG9uZW50LmNvbnRyb2xsZXJBc10gPSAkY29udHJvbGxlcihjb21wb25lbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9ICdGYWlsZWQgdG8gc2VyaWFsaXplIGVycm9yIG9iamVjdCBmb3IgbG9nZ2luZyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRsb2cuZXJyb3IoYEZhaWxlZCBpbnN0YW50aWF0aW5nIGNvbnRyb2xsZXIgZm9yIHZpZXcgJHt2aWV3fTogJHtlcnJvck1lc3NhZ2V9YCk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlID0gZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHt9KTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCBkZXBlbmRlbmN5TmFtZSBpbiBiaW5kaW5nLnJlc29sdmUpIHtcbiAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5RmFjdG9yeSA9IGJpbmRpbmcucmVzb2x2ZVtkZXBlbmRlbmN5TmFtZV07XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRpbmplY3Rvci5pbnZva2UoZGVwZW5kZW5jeUZhY3RvcnkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRxLnJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcgPSBiaW5kaW5nID0+IF8udW5pb24oYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdLCBiaW5kaW5nLndhdGNoZWRTdGF0ZSB8fCBbXSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0cmlwTmVnYXRpb25QcmVmaXgoc3RyKSB7XG4gICAgICAgIGlmIChzdHIuY2hhckF0KDApID09PSAnIScpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnN1YnN0cigxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbVZpZXcgPSB2aWV3ID0+IF8uZmxhdHRlbihfLm1hcCh2aWV3LmdldEJpbmRpbmdzKCksIGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcpKTtcblxuICAgICAgY29uc3QgZ2V0RmllbGRzVG9XYXRjaCA9IHZpZXcgPT4gXy51bmlxKF8ubWFwKGdldFN0YXRlRmllbGRzRnJvbVZpZXcodmlldyksIHN0cmlwTmVnYXRpb25QcmVmaXgpKTtcblxuICAgICAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzVG9XYXRjaCh2aWV3KTtcblxuICAgICAgcmV0dXJuIFJvdXRlLndoZW5SZWFkeSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRyeSB0byBzdGFydCB0aGUgYmFsbCByb2xsaW5nIGluIGNhc2UgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgYW5kIHdlIGNhbiBjcmVhdGUgdGhlIHZpZXcgaW1tZWRpYXRlbHlcbiAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBEb24ndCBib3RoZXIgcHV0dGluZyBpbiBhIHdhdGNoZXIgaWYgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgdGhhdCB3aWxsIGV2ZXIgdHJpZ2dlciBhIGNoYW5nZSBldmVudFxuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXRlV2F0Y2hlciA9IGZ1bmN0aW9uIChjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgaWYgKHZpZXdNYW5hZ2VtZW50UGVuZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZmluaXNoIHRoZSBkaWdlc3QgY3ljbGUgYmVmb3JlIGJ1aWxkaW5nIHRoZSB2aWV3LCB3aGljaCBzaG91bGRcbiAgICAgICAgICAvLyBwcmV2ZW50IHVzIGZyb20gcmUtcmVuZGVyaW5nIGEgdmlldyBtdWx0aXBsZSB0aW1lcyBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzIG9mIHRoZSBzYW1lIHN0YXRlIGRlcGVuZGVuY3lcbiAgICAgICAgICAvLyBnZXQgY2hhbmdlZCB3aXRoIHJlcGVhdGVkIFN0YXRlLnNldCBjYWxsc1xuICAgICAgICAgIHJldHVybiAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICByZXR1cm4gdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgU3RhdGUud2F0Y2goZmllbGRzLCBzdGF0ZVdhdGNoZXIpO1xuXG4gICAgICAgIHZpZXdEaXJlY3RpdmVTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4gU3RhdGUucmVtb3ZlV2F0Y2hlcihzdGF0ZVdhdGNoZXIpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgndmlldycsIHJvdXRlVmlld0ZhY3RvcnkpO1xuXHJcbmNsYXNzIFBlbmRpbmdWaWV3Q291bnRlciB7XG4gIGNvbnN0cnVjdG9yKCRyb290U2NvcGUpIHtcbiAgICB0aGlzLiRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gIH1cblxuICBpbmNyZWFzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudCArPSAxO1xuICB9XG5cbiAgZGVjcmVhc2UoKSB7XG4gICAgdGhpcy5jb3VudCA9IE1hdGgubWF4KDAsIHRoaXMuY291bnQgLSAxKTtcbiAgICBpZiAodGhpcy5jb3VudCA9PT0gMCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCkge1xuICAgICAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmluaXRpYWxWaWV3c0xvYWRlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuY3VycmVudFZpZXdzTG9hZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdQZW5kaW5nVmlld0NvdW50ZXInLCAoJHJvb3RTY29wZSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFBlbmRpbmdWaWV3Q291bnRlcigkcm9vdFNjb3BlKTtcbn0pO1xuXHJcbmNsYXNzIFdhdGNoYWJsZUxpc3Qge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5LCBsaXN0KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuXG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLndhdGNoZXJzID0gW107XG4gIH1cblxuICBnZXQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgfVxuXG4gIGdldEFsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0O1xuICB9XG5cbiAgZ2V0U3Vic2V0KHBhdGhzKSB7XG4gICAgcmV0dXJuIF8uemlwT2JqZWN0KHBhdGhzLCBfLm1hcChwYXRocywgdGhpcy5nZXQuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIuc2V0KHRoaXMubGlzdCwgcGF0aCwgdmFsdWUpO1xuICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIHVuc2V0KHBhdGhzKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLk9iamVjdEhlbHBlci51bnNldCh0aGlzLmxpc3QsIHBhdGgpO1xuICAgICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdhdGNoKHBhdGhzLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLndhdGNoZXJzLnB1c2godGhpcy5XYXRjaGVyRmFjdG9yeS5jcmVhdGUocGF0aCwgaGFuZGxlciwgdGhpcy5nZXQocGF0aCkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZVdhdGNoZXIod2F0Y2hlcikge1xuICAgIGlmICh0aGlzLndhdGNoZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdXYXRjaGVycyA9IFtdO1xuXG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHRoaXNXYXRjaGVyID0+IHtcbiAgICAgIGlmICh0aGlzV2F0Y2hlci5oYW5kbGVyICE9PSB3YXRjaGVyKSB7XG4gICAgICAgIG5ld1dhdGNoZXJzLnB1c2godGhpc1dhdGNoZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMud2F0Y2hlcnMgPSBuZXdXYXRjaGVycztcbiAgfVxuXG4gIF9ub3RpZnlXYXRjaGVycyhjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgd2F0Y2hlciA9PiB7XG4gICAgICBpZiAod2F0Y2hlci5zaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGggPSB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCB3YXRjaGVyLndhdGNoUGF0aCk7XG4gICAgICAgIHdhdGNoZXIubm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3RGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcbiAgfVxuXG4gIGNyZWF0ZShsaXN0ID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3QodGhpcy5PYmplY3RIZWxwZXIsIHRoaXMuV2F0Y2hlckZhY3RvcnksIGxpc3QpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hhYmxlTGlzdEZhY3RvcnknLCAoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3RGYWN0b3J5KE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpO1xufSk7XG5cclxuY2xhc3MgV2F0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy53YXRjaFBhdGggPSB3YXRjaFBhdGg7XG4gICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKGluaXRpYWxWYWx1ZSk7XG4gIH1cblxuICBfdG9rZW5pemVQYXRoKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLicpO1xuICB9XG5cbiAgc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIC8vIE5CIHNob3J0IGNpcmN1aXQgbG9naWMgaW4gdGhlIHNpbXBsZSBjYXNlXG4gICAgaWYgKHRoaXMud2F0Y2hQYXRoID09PSBjaGFuZ2VkUGF0aCkge1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh0aGlzLmN1cnJlbnRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0IHdhdGNoID0ge1xuICAgICAgcGF0aDogdGhpcy53YXRjaFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aCh0aGlzLndhdGNoUGF0aCksXG4gICAgICB2YWx1ZTogdGhpcy5jdXJyZW50VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgY2hhbmdlID0ge1xuICAgICAgcGF0aDogY2hhbmdlZFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aChjaGFuZ2VkUGF0aCksXG4gICAgICB2YWx1ZTogbmV3VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgbWluaW11bUxlbnRoID0gTWF0aC5taW4oY2hhbmdlLnRva2Vucy5sZW5ndGgsIHdhdGNoLnRva2Vucy5sZW5ndGgpO1xuICAgIGZvciAobGV0IHRva2VuSW5kZXggPSAwOyB0b2tlbkluZGV4IDwgbWluaW11bUxlbnRoOyB0b2tlbkluZGV4KyspIHtcbiAgICAgIGlmICh3YXRjaC50b2tlbnNbdG9rZW5JbmRleF0gIT09IGNoYW5nZS50b2tlbnNbdG9rZW5JbmRleF0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5CIGlmIHdlIGdldCBoZXJlIHRoZW4gYWxsIGNvbW1vbiB0b2tlbnMgbWF0Y2hcblxuICAgIGNvbnN0IGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQgPSBjaGFuZ2UudG9rZW5zLmxlbmd0aCA+IHdhdGNoLnRva2Vucy5sZW5ndGg7XG5cbiAgICBpZiAoY2hhbmdlUGF0aElzRGVzY2VuZGFudCkge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gY2hhbmdlLnRva2Vucy5zbGljZSh3YXRjaC50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoID0gXy5nZXQod2F0Y2gudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGgsIGNoYW5nZS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHdhdGNoLnRva2Vucy5zbGljZShjaGFuZ2UudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoUGF0aCA9IF8uZ2V0KGNoYW5nZS52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMod2F0Y2gudmFsdWUsIG5ld1ZhbHVlQXRXYXRjaFBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICB0aGlzLmhhbmRsZXIoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCB0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChuZXdWYWx1ZSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hlckZhY3Rvcnkge1xuICBjcmVhdGUod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoZXIod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hlckZhY3RvcnknLCAoKSA9PiB7XG4gIHJldHVybiBuZXcgV2F0Y2hlckZhY3RvcnkoKTtcbn0pO1xuXHJcbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1JvdXRlJywgZnVuY3Rpb24oT2JqZWN0SGVscGVyKSB7XG4gIFwibmdJbmplY3RcIjtcbiAgY29uc3QgdG9rZW5zID0ge307XG4gIGNvbnN0IHVybFdyaXRlcnMgPSBbXTtcbiAgY29uc3QgdXJscyA9IFtdO1xuICBjb25zdCBwZXJzaXN0ZW50U3RhdGVzID0gW107XG4gIGNvbnN0IHJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHR5cGVzID0ge307XG4gIGxldCBodG1sNU1vZGUgPSBmYWxzZTtcblxuICBjb25zdCBwcm92aWRlciA9IHtcblxuICAgIHJlZ2lzdGVyVHlwZShuYW1lLCBjb25maWcpIHtcbiAgICAgIHR5cGVzW25hbWVdID0gY29uZmlnO1xuICAgICAgdHlwZXNbbmFtZV0ucmVnZXggPSBuZXcgUmVnRXhwKHR5cGVzW25hbWVdLnJlZ2V4LnNvdXJjZSwgJ2knKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclR5cGUgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsVG9rZW4obmFtZSwgY29uZmlnKSB7XG4gICAgICB0b2tlbnNbbmFtZV0gPSBfLmV4dGVuZCh7bmFtZX0sIGNvbmZpZyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxUb2tlbiB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxXcml0ZXIobmFtZSwgZm4pIHtcbiAgICAgIHVybFdyaXRlcnNbbmFtZV0gPSBmbjtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFdyaXRlciB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmwocGF0dGVybiwgY29uZmlnID0ge30pIHtcbiAgICAgIGNvbnN0IHVybERhdGEgPSB7XG4gICAgICAgIGNvbXBpbGVkVXJsOiB0aGlzLl9jb21waWxlVXJsUGF0dGVybihwYXR0ZXJuLCBjb25maWcpLFxuICAgICAgICBwYXR0ZXJuXG4gICAgICB9O1xuXG4gICAgICB1cmxzLnB1c2goXy5leHRlbmQodXJsRGF0YSwgY29uZmlnKSk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmwgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHNldFBlcnNpc3RlbnRTdGF0ZXMoLi4uc3RhdGVMaXN0KSB7XG4gICAgICBfLmZvckVhY2goc3RhdGVMaXN0LCAoc3RhdGUpID0+IHtcbiAgICAgICAgaWYgKCFwZXJzaXN0ZW50U3RhdGVzLmluY2x1ZGVzKHN0YXRlKSkge1xuICAgICAgICAgIHBlcnNpc3RlbnRTdGF0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRIdG1sNU1vZGUobW9kZSkge1xuICAgICAgaHRtbDVNb2RlID0gbW9kZTtcbiAgICB9LFxuXG4gICAgX2NvbXBpbGVVcmxQYXR0ZXJuKHVybFBhdHRlcm4sIGNvbmZpZykge1xuICAgICAgbGV0IG1hdGNoO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnModXJsUGF0dGVybik7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHVybFBhdHRlcm4pO1xuXG4gICAgICBjb25zdCB0b2tlblJlZ2V4ID0gL1xceyhbQS1aYS16XFwuXzAtOV0rKVxcfS9nO1xuICAgICAgbGV0IHVybFJlZ2V4ID0gdXJsUGF0dGVybjtcblxuICAgICAgaWYgKCFjb25maWcucGFydGlhbE1hdGNoKSB7XG4gICAgICAgIHVybFJlZ2V4ID0gYF4ke3VybFJlZ2V4fSRgO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b2tlbkxpc3QgPSBbXTtcblxuICAgICAgd2hpbGUgKChtYXRjaCA9IHRva2VuUmVnZXguZXhlYyh1cmxQYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbbWF0Y2hbMV1dO1xuICAgICAgICB0b2tlbkxpc3QucHVzaCh0b2tlbik7XG4gICAgICAgIHVybFJlZ2V4ID0gdXJsUmVnZXgucmVwbGFjZShtYXRjaFswXSwgYCgke3R5cGVzW3Rva2VuLnR5cGVdLnJlZ2V4LnNvdXJjZX0pYCk7XG4gICAgICB9XG5cbiAgICAgIHVybFJlZ2V4LnJlcGxhY2UoJy4nLCAnXFxcXC4nKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyksXG4gICAgICAgIHRva2VuczogdG9rZW5MaXN0XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBfZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHN0cikge1xuICAgICAgaWYgKHN0ci5tYXRjaCgvXFwvJC8pKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwvJC8sICcvPycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGAke3N0cn0vP2A7XG4gICAgfSxcblxuICAgIF9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFwoXFwpXFwqXFwrXFw/XFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gICAgfSxcblxuICAgICRnZXQoJGxvY2F0aW9uLCAkaW5qZWN0b3IsICRxKSB7XG4gICAgICAnbmdJbmplY3QnO1xuXG4gICAgICAvLyBXaGVuIGdldHRpbmcgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHNlcnZpY2UgKG9ubHkgZG9uZSBvbmNlKSwgd2UgbmVlZCB0byBpdGVyYXRlIG92ZXIgdGhlIHVybFdyaXRlcnMgYW5kIHR1cm5cbiAgICAgIC8vIHRoZW0gaW50byBtZXRob2RzIHRoYXQgaW52b2tlIHRoZSBSRUFMIHVybFdyaXRlciwgYnV0IHByb3ZpZGluZyBkZXBlbmRlbmN5IGluamVjdGlvbiB0byBpdCwgd2hpbGUgYWxzb1xuICAgICAgLy8gZ2l2aW5nIGl0IHRoZSBkYXRhIHRoYXQgdGhlIGNhbGxlZSBwYXNzZXMgaW4uXG5cbiAgICAgIC8vIFRoZSByZWFzb24gd2UgaGF2ZSB0byBkbyB0aGlzIGhlcmUgaXMgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGUgJGluamVjdG9yIGJhY2sgaW4gdGhlIHJvdXRlUHJvdmlkZXIuXG5cbiAgICAgIF8uZm9ySW4odXJsV3JpdGVycywgKHdyaXRlciwgd3JpdGVyTmFtZSkgPT5cbiAgICAgICAgdXJsV3JpdGVyc1t3cml0ZXJOYW1lXSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBpZiAoIWRhdGEpIHsgZGF0YSA9IHt9OyB9XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0ge1VybERhdGE6IGRhdGF9O1xuICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKHdyaXRlciwge30sIGxvY2Fscyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGxldCBmbGFzaFN0YXRlcyA9IFtdO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0ge1xuICAgICAgICBjdXJyZW50QmluZGluZ3M6IHt9LFxuICAgICAgICByZWFkeURlZmVycmVkOiAkcS5kZWZlcigpLFxuXG4gICAgICAgIG1hdGNoKHVybFRvTWF0Y2gpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHVybCBvZiBBcnJheS5mcm9tKHVybHMpKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gdXJsLmNvbXBpbGVkVXJsLnJlZ2V4LmV4ZWModXJsVG9NYXRjaCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7dXJsLCByZWdleE1hdGNoOiBtYXRjaH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REYXRhKG1hdGNoLCBzZWFyY2hEYXRhID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB0aGlzLmV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCk7XG4gICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuZXh0cmFjdFBhdGhEYXRhKG1hdGNoKTtcbiAgICAgICAgICBzZWFyY2hEYXRhID0gdGhpcy5leHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKTtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0SGVscGVyLmRlZmF1bHQoc2VhcmNoRGF0YSwgcGF0aCwgZGVmYXVsdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpIHtcbiAgICAgICAgICBpZiAoIXNlYXJjaERhdGEpIHsgc2VhcmNoRGF0YSA9ICRsb2NhdGlvbi5zZWFyY2goKTsgfVxuICAgICAgICAgIGNvbnN0IGRhdGEgPSBfLmNsb25lKHNlYXJjaERhdGEpO1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChkYXRhLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhcmdldEtleSA9IF8uZmluZEtleSh0b2tlbnMsIHsgc2VhcmNoQWxpYXM6IGtleSB9KTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0S2V5KSB7IHRhcmdldEtleSA9IGtleTsgfVxuXG4gICAgICAgICAgICBjb25zdCB0b2tlblR5cGVOYW1lID0gdG9rZW5zW3RhcmdldEtleV0gPyBfLmdldCh0b2tlbnNbdGFyZ2V0S2V5XSwgJ3R5cGUnKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICghdG9rZW5zW3RhcmdldEtleV0gfHwgKHR5cGVzW3Rva2VuVHlwZU5hbWVdLnJlZ2V4LnRlc3QodmFsdWUpKSkge1xuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0udHlwZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdHlwZVRva2VuVHlwZSA9IHRva2VuVHlwZSA/IHR5cGVzW3Rva2VuVHlwZV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZVBhcnNlZCA9IHR5cGVUb2tlblR5cGUgPyB0eXBlVG9rZW5UeXBlLnBhcnNlciA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICBpZiAodG9rZW5UeXBlUGFyc2VkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHRva2VuVHlwZVBhcnNlZCwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnN0YXRlUGF0aCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgZGF0YUtleSA9IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoIHx8IHRhcmdldEtleTtcblxuICAgICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KG5ld0RhdGEsIGRhdGFLZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChtYXRjaC51cmwuc3RhdGUsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsIGtleSwgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyBfLmNsb25lRGVlcCh2YWx1ZSkgOiB2YWx1ZSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFBhdGhEYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICAgIGNvbnN0IHBhdGhUb2tlbnMgPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zO1xuXG4gICAgICAgICAgaWYgKHBhdGhUb2tlbnMubGVuZ3RoID09PSAwKSB7IHJldHVybiB7fTsgfVxuXG4gICAgICAgICAgZm9yIChsZXQgbiA9IDAsIGVuZCA9IHBhdGhUb2tlbnMubGVuZ3RoLTEsIGFzYyA9IDAgPD0gZW5kOyBhc2MgPyBuIDw9IGVuZCA6IG4gPj0gZW5kOyBhc2MgPyBuKysgOiBuLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2Vuc1tuXTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG1hdGNoLnJlZ2V4TWF0Y2hbbisxXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlcikgeyB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7IH1cblxuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCAodG9rZW4uc3RhdGVQYXRoIHx8IHRva2VuLm5hbWUpLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVycygpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVycztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXIobmFtZSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXShkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnbyhuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gJGxvY2F0aW9uLnVybCh0aGlzLmludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGVyc2lzdGVudFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gcGVyc2lzdGVudFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkRmxhc2hTdGF0ZXMoLi4ubmV3U3RhdGVzKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBmbGFzaFN0YXRlcy5jb25jYXQobmV3U3RhdGVzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gZmxhc2hTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUsIGJpbmRpbmcpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV0gPSBiaW5kaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZSh2aWV3TmFtZSwgYmluZGluZ05hbWVFeHByZXNzaW9uKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudEJpbmRpbmcgPSB0aGlzLmdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKVxuXG4gICAgICAgICAgaWYgKCFjdXJyZW50QmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGJpbmRpbmdOYW1lRXhwcmVzc2lvbiBpbnN0YW5jZW9mIFJlZ0V4cCA/XG4gICAgICAgICAgICBiaW5kaW5nTmFtZUV4cHJlc3Npb24udGVzdChjdXJyZW50QmluZGluZy5uYW1lKSA6XG4gICAgICAgICAgICBjdXJyZW50QmluZGluZy5uYW1lID09PSBiaW5kaW5nTmFtZUV4cHJlc3Npb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UmVhZHkocmVhZHkpIHtcbiAgICAgICAgICBpZiAoIXJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNSZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNIdG1sNU1vZGVFbmFibGVkKCkge1xuICAgICAgICAgIHJldHVybiBodG1sNU1vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2hlblJlYWR5KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5RGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICB9O1xuXG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbnVtZXJpYycsIHtyZWdleDogL1xcZCsvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiBwYXJzZUludCh0b2tlbildfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYWxwaGEnLCB7cmVnZXg6IC9bYS16QS1aXSsvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYW55Jywge3JlZ2V4OiAvLisvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbGlzdCcsIHtyZWdleDogLy4rLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gdG9rZW4uc3BsaXQoJywnKV19KTtcblxuICByZXR1cm4gcHJvdmlkZXI7XG59KTtcblxyXG5jbGFzcyBTdGF0ZVByb3ZpZGVyIHtcbiAgJGdldChXYXRjaGFibGVMaXN0RmFjdG9yeSkge1xuICAgICduZ0luamVjdCc7XG4gICAgcmV0dXJuIFdhdGNoYWJsZUxpc3RGYWN0b3J5LmNyZWF0ZSgpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1N0YXRlJywgbmV3IFN0YXRlUHJvdmlkZXIpO1xuXHJcbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1ZpZXdCaW5kaW5ncycsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3Qgdmlld3MgPSBbXTtcblxuICBjbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBiaW5kaW5ncykge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICAgIGlmICghKHRoaXMuYmluZGluZ3MgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IFt0aGlzLmJpbmRpbmdzXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRCaW5kaW5ncygpIHtcbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICBiaW5kKG5hbWUsIGNvbmZpZykge1xuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vblJlcXVpcmVkU3RhdGUoYmluZGluZ3MsIGNvbW1vblJlcXVpcmVkU3RhdGUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGlmICghKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgYmluZGluZy5yZXF1aXJlZFN0YXRlID0gW2JpbmRpbmcucmVxdWlyZWRTdGF0ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZS5jb25jYXQoY29tbW9uUmVxdWlyZWRTdGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVzb2x2ZShiaW5kaW5ncywgY29tbW9uUmVzb2x2ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoJ3Jlc29sdmUnIGluIGJpbmRpbmcpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlc29sdmUgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goXy5kZWZhdWx0cyhiaW5kaW5nLnJlc29sdmUsIGNvbW1vblJlc29sdmUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vbkZpZWxkcyhuZXdCaW5kaW5ncykge1xuICAgICAgICBjb25zdCBiYXNpY0NvbW1vbkZpZWxkcyA9IFtcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yQ29tcG9uZW50Jywgb3ZlcnJpZGVGaWVsZDogJ2Vycm9yQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25FcnJvclRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ2Vycm9yVGVtcGxhdGVVcmwnfVxuICAgICAgICBdO1xuXG4gICAgICAgIGZvciAoY29uc3QgY29tbW9uRmllbGQgb2YgQXJyYXkuZnJvbShiYXNpY0NvbW1vbkZpZWxkcykpIHtcbiAgICAgICAgICBpZiAoY29tbW9uRmllbGQubmFtZSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIGRlZmF1bHRCaW5kaW5nRmllbGQobmV3QmluZGluZ3MsIGNvbW1vbkZpZWxkLm92ZXJyaWRlRmllbGQsIGNvbmZpZ1tjb21tb25GaWVsZC5uYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXF1aXJlZFN0YXRlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICBhcHBseUNvbW1vblJlcXVpcmVkU3RhdGUobmV3QmluZGluZ3MsIGNvbmZpZ1snY29tbW9uUmVxdWlyZWRTdGF0ZSddKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29tbW9uUmVzb2x2ZScgaW4gY29uZmlnKSB7XG4gICAgICAgICAgcmV0dXJuIGFwcGx5Q29tbW9uUmVzb2x2ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXNvbHZlJ10pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlZmF1bHRCaW5kaW5nRmllbGQoYmluZGluZ3MsIGZpZWxkTmFtZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBsZXQgaXRlbTtcbiAgICAgICAgICBpZiAoIShmaWVsZE5hbWUgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBiaW5kaW5nW2ZpZWxkTmFtZV0gPSBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGxldCBuZXdCaW5kaW5ncyA9IFtdO1xuICAgICAgaWYgKCdiaW5kaW5ncycgaW4gY29uZmlnKSB7XG4gICAgICAgIG5ld0JpbmRpbmdzID0gY29uZmlnWydiaW5kaW5ncyddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSAoY29uZmlnIGluc3RhbmNlb2YgQXJyYXkpID8gY29uZmlnIDogW2NvbmZpZ107XG4gICAgICB9XG5cbiAgICAgIGlmICghKG5ld0JpbmRpbmdzLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjYWxsIHRvIFZpZXdCaW5kaW5nc1Byb3ZpZGVyLmJpbmQgZm9yIG5hbWUgJyR7bmFtZX0nYCk7XG4gICAgICB9XG5cbiAgICAgIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKTtcbiAgICAgIHJldHVybiB2aWV3c1tuYW1lXSA9IG5ldyBWaWV3KG5hbWUsIG5ld0JpbmRpbmdzKTtcbiAgICB9LFxuXG4gICAgJGdldCgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldFZpZXcodmlldykge1xuICAgICAgICAgIHJldHVybiB2aWV3c1t2aWV3XTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59KTtcbiJdfQ==
