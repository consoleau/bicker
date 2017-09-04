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
      if (iAttrs.ignoreHref === undefined) {
        iElement.click(function (event) {
          event.preventDefault();
          var urlPath = iElement.attr('href');

          if (event.metaKey) {
            var fullUrl = $window.location.origin + '/' + urlPath;
            $window.open(fullUrl, '_blank');
          } else {
            urlPath = urlPath.replace(/^#/, '');
            return $timeout(function () {
              return $location.url(urlPath);
            });
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWlCLENBQWhDLEFBQWdDLEFBQUMsY0FBakMsQUFBK0Msd0ZBQUksVUFBQSxBQUFVLE9BQVYsQUFBaUIsT0FBakIsQUFBd0IsV0FBeEIsQUFBbUMsWUFBbkMsQUFBK0MsY0FBL0MsQUFBNkQsb0JBQW9CLEFBQ2xJO0FBRUE7O01BQUksU0FBSixBQUFhLEFBQ2I7YUFBQSxBQUFXLElBQVgsQUFBZSx3QkFBd0IsWUFBWSxBQUNqRDtRQUFJLE1BQUosQUFBSSxBQUFNLFdBQVcsQUFDbkI7WUFBQSxBQUFNLFNBQU4sQUFBZSxBQUNoQjtBQUNGO0FBSkQsQUFNQTs7YUFBQSxBQUFXLElBQVgsQUFBZSwwQkFBMEIsVUFBQSxBQUFVLEdBQVYsQUFBYSxRQUFRLEFBQzVEO0FBQ0E7UUFBSSxZQUFKLEFBQ0E7UUFBSSxXQUFKLEFBQWUsUUFBUSxBQUNyQjtBQUNEO0FBRUQ7O2FBQUEsQUFBUyxBQUVUOzt1QkFBQSxBQUFtQixBQUNuQjtRQUFNLFFBQVEsTUFBQSxBQUFNLE1BQU0sVUFBMUIsQUFBYyxBQUFZLEFBQVUsQUFFcEM7O1FBQUksQ0FBSixBQUFLLE9BQU8sQUFDVjthQUFBLEFBQU8sQUFDUjtBQUZELFdBRU8sQUFDTDthQUFPLE1BQUEsQUFBTSxZQUFiLEFBQU8sQUFBa0IsQUFDMUI7QUFFRDs7UUFBSSxnQkFBZ0IsYUFBQSxBQUFhLE1BQU0sTUFBbkIsQUFBeUIsTUFBN0MsQUFBb0IsQUFBK0IsQUFDbkQ7b0JBQWdCLEVBQUEsQUFBRSxXQUFGLEFBQWEsZUFBZSxNQUFBLEFBQU0sc0JBQU4sQUFBNEIsT0FBTyxNQUEvRSxBQUFnQixBQUE0QixBQUFtQyxBQUFNLEFBRXJGOztRQUFNLFlB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QUFBTyxBQUFNLEFBQ2Q7QUFISCxBQUFPLEFBS1I7QUFMUSxBQUNMO0FBOUVOLEFBQU8sQUFvRlI7QUFwRlEsQUFFTDtBQW5CSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJhbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicsIFsnbmdBbmltYXRlJ10pLnJ1bihmdW5jdGlvbiAoU3RhdGUsIFJvdXRlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE9iamVjdEhlbHBlciwgUGVuZGluZ1ZpZXdDb3VudGVyKSB7XG4gIFwibmdJbmplY3RcIjtcblxuICBsZXQgb2xkVXJsID0gdW5kZWZpbmVkO1xuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJvdXRlLmlzUmVhZHkoKSkge1xuICAgICAgUm91dGUuc2V0UmVhZHkoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZSwgbmV3VXJsKSB7XG4gICAgLy8gV29yay1hcm91bmQgZm9yIEFuZ3VsYXJKUyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2lzc3Vlcy84MzY4XG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKG5ld1VybCA9PT0gb2xkVXJsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2xkVXJsID0gbmV3VXJsO1xuXG4gICAgUGVuZGluZ1ZpZXdDb3VudGVyLnJlc2V0KCk7XG4gICAgY29uc3QgbWF0Y2ggPSBSb3V0ZS5tYXRjaCgkbG9jYXRpb24ucGF0aCgpKTtcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IFJvdXRlLmV4dHJhY3REYXRhKG1hdGNoKTtcbiAgICB9XG5cbiAgICBsZXQgZmllbGRzVG9VbnNldCA9IE9iamVjdEhlbHBlci5ub3RJbihTdGF0ZS5saXN0LCBkYXRhKTtcbiAgICBmaWVsZHNUb1Vuc2V0ID0gXy5kaWZmZXJlbmNlKGZpZWxkc1RvVW5zZXQsIFJvdXRlLmdldFBlcnNpc3RlbnRTdGF0ZXMoKS5jb25jYXQoUm91dGUuZ2V0Rmxhc2hTdGF0ZXMoKSkpO1xuXG4gICAgY29uc3QgZXZlbnREYXRhID0ge3Vuc2V0dGluZzogZmllbGRzVG9VbnNldCwgc2V0dGluZzogZGF0YX07XG5cbiAgICAkcm9vdFNjb3BlLiRlbWl0KCdiaWNrZXJfcm91dGVyLmJlZm9yZVN0YXRlQ2hhbmdlJywgZXZlbnREYXRhKTtcblxuICAgIGlmICgoZXZlbnREYXRhLnVuc2V0dGluZykubGVuZ3RoICE9PSAwKSB7XG4gICAgICBTdGF0ZS51bnNldChldmVudERhdGEudW5zZXR0aW5nKTtcbiAgICB9XG5cbiAgICBfLmZvckVhY2goZXZlbnREYXRhLnNldHRpbmcsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBTdGF0ZS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBSb3V0ZS5yZXNldEZsYXNoU3RhdGVzKCk7XG4gICAgUm91dGUuc2V0UmVhZHkodHJ1ZSk7XG4gIH0pO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ09iamVjdEhlbHBlcicsIHtcbiAgZ2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV07XG4gIH0sXG5cbiAgc2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBpZiAocGFyZW50W3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFyZW50W3NlZ21lbnRdID0ge307XG4gICAgICB9XG5cbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV0gPSB2YWx1ZTtcbiAgfSxcblxuICB1bnNldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG5cbiAgICBpZiAocGFyZW50W2tleV0gPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBkZWxldGUgcGFyZW50W2tleV07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgLy8gUmVjdXJzaXZlbHkgcmV0dXJuIHRoZSBwcm9wZXJ0aWVzIGluIGEgdGhhdCBhcmVuJ3QgaW4gYlxuICBub3RJbihhLCBiLCBwcmVmaXggPSAnJykge1xuICAgIGxldCBub3RJbiA9IFtdO1xuICAgIHByZWZpeCA9IHByZWZpeC5sZW5ndGggPiAwID8gYCR7cHJlZml4fS5gIDogJyc7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKE9iamVjdC5rZXlzKGEpKSkge1xuICAgICAgY29uc3QgdGhpc1BhdGggPSBgJHtwcmVmaXh9JHtrZXl9YDtcblxuICAgICAgaWYgKGJba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vdEluLnB1c2godGhpc1BhdGgpO1xuXG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgYVtrZXldID09PSAnb2JqZWN0JykgJiYgKCEoYVtrZXldIGluc3RhbmNlb2YgQXJyYXkpKSkge1xuICAgICAgICBub3RJbiA9IG5vdEluLmNvbmNhdCh0aGlzLm5vdEluKGFba2V5XSwgYltrZXldLCB0aGlzUGF0aCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub3RJbjtcbiAgfSxcblxuICBkZWZhdWx0KG92ZXJyaWRlcywgLi4uZGVmYXVsdFNldHMpIHtcbiAgICBsZXQgZGVmYXVsdFNldCwgdmFsdWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBpZiAoZGVmYXVsdFNldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBkZWZhdWx0U2V0ID0gZGVmYXVsdFNldHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRTZXQgPSB0aGlzLmRlZmF1bHQoLi4uQXJyYXkuZnJvbShkZWZhdWx0U2V0cyB8fCBbXSkpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRTZXQpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFNldFtrZXldO1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiBvdmVycmlkZXNba2V5XSA9PT0gXCJvYmplY3RcIikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmRlZmF1bHQob3ZlcnJpZGVzW2tleV0sIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3ZlcnJpZGVzKSB7XG4gICAgICB2YWx1ZSA9IG92ZXJyaWRlc1trZXldO1xuICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSB8fCB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxuXG4vLyBVc2FnZTpcbi8vXG4vLyBJZiB5b3Ugd2FudCB0byBhZGQgdGhlIGNsYXNzIFwiYWN0aXZlXCIgdG8gYW4gYW5jaG9yIGVsZW1lbnQgd2hlbiB0aGUgXCJtYWluXCIgdmlldyBoYXMgYSBiaW5kaW5nXG4vLyB3aXRoIHRoZSBuYW1lIFwibXlCaW5kaW5nXCIgcmVuZGVyZWQgd2l0aGluIGl0XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCJ7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAnbXlCaW5kaW5nJyB9XCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuLy8gWW91IGNhbiBhbHNvIHVzZSByZWd1bGFyIGV4cHJlc3Npb25zIGZvciB0aGUgYmluZGluZyBuYW1lLCBidXQgdG8gZG8gc28geW91IGhhdmUgdG8gcHJvdmlkZSBhIG1ldGhvZFxuLy8gb24geW91ciBjb250cm9sbGVyIHdoaWNoIHJldHVybnMgdGhlIHJvdXRlIGNsYXNzIGRlZmluaXRpb24gb2JqZWN0LCBiZWNhdXNlIEFuZ3VsYXJKUyBleHByZXNzaW9uc1xuLy8gZG9uJ3Qgc3VwcG9ydCBpbmxpbmUgcmVndWxhciBleHByZXNzaW9uc1xuLy9cbi8vIGNsYXNzIE15Q29udHJvbGxlciB7XG4vLyAgZ2V0Um91dGVDbGFzc09iamVjdCgpIHtcbi8vICAgIHJldHVybiB7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAvbXlCaW5kLyB9XG4vLyAgfVxuLy8gfVxuLy9cbi8vIDxhIHJvdXRlLWNsYXNzPVwiJGN0cmwuZ2V0Um91dGVDbGFzc09iamVjdCgpXCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuXG5mdW5jdGlvbiByb3V0ZUNsYXNzRmFjdG9yeShSb3V0ZSkge1xuICAnbmdJbmplY3QnXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBsaW5rIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgc2NvcGUuJHdhdGNoKCgpID0+IHtcbiAgICAgICAgY29uc3Qgcm91dGVDbGFzc0RlZmluaXRpb24gPSBzY29wZS4kZXZhbChpQXR0cnNbJ3JvdXRlQ2xhc3MnXSlcblxuICAgICAgICBpZiAoIVJvdXRlLm1hdGNoZXNDdXJyZW50QmluZGluZ05hbWUocm91dGVDbGFzc0RlZmluaXRpb24udmlld05hbWUsIHJvdXRlQ2xhc3NEZWZpbml0aW9uLmJpbmRpbmdOYW1lKSkge1xuICAgICAgICAgIGlmIChpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5yZW1vdmVDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghaUVsZW1lbnQuaGFzQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgaUVsZW1lbnQuYWRkQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlQ2xhc3MnLCByb3V0ZUNsYXNzRmFjdG9yeSk7XG5cbmZ1bmN0aW9uIHJvdXRlSHJlZkZhY3RvcnkgKFJvdXRlLCAkd2luZG93LCAkbG9jYXRpb24sICR0aW1lb3V0KSB7XG4gICduZ0luamVjdCdcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgc2NvcGU6IHRydWUsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICBpZiAoaUF0dHJzLmlnbm9yZUhyZWYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaUVsZW1lbnQuY2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCB1cmxQYXRoID0gaUVsZW1lbnQuYXR0cignaHJlZicpO1xuXG4gICAgICAgIGlmIChldmVudC5tZXRhS2V5KSB7XG4gICAgICAgICAgY29uc3QgZnVsbFVybCA9ICR3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgJy8nICsgdXJsUGF0aDtcbiAgICAgICAgICAkd2luZG93Lm9wZW4oZnVsbFVybCwnX2JsYW5rJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmxQYXRoID0gdXJsUGF0aC5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmxQYXRoKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG9iamVjdCA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICBjb25zdCB3cml0ZXIgPSBvYmplY3Rbd3JpdGVyTmFtZV07XG4gICAgICBzY29wZVtgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gd3JpdGVyO1xuICAgIH1cblxuICAgIHJldHVybiBzY29wZS4kd2F0Y2goaUF0dHJzLnJvdXRlSHJlZiwgKG5ld1VybCkgPT4ge1xuICAgICAgbGV0IHVybDtcbiAgICAgIGlmIChSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICB1cmwgPSBuZXdVcmw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwgPSBgIyR7bmV3VXJsfWA7XG4gICAgICB9XG4gICAgICByZXR1cm4gaUVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgfSk7XG4gIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVIcmVmJywgcm91dGVIcmVmRmFjdG9yeSk7XG5cbi8vIEBUT0RPIG5vbmUgb2YgdGhlIGFuaW1hdGlvbiBjb2RlIGluIHRoaXMgZGlyZWN0aXZlIGhhcyBiZWVuIHRlc3RlZC4gTm90IHN1cmUgaWYgaXQgY2FuIGJlIGF0IHRoaXMgc3RhZ2UgVGhpcyBuZWVkcyBmdXJ0aGVyIGludmVzdGlnYXRpb24uXG4vLyBAVE9ETyB0aGlzIGNvZGUgZG9lcyB0b28gbXVjaCwgaXQgc2hvdWxkIGJlIHJlZmFjdG9yZWQuXG5cbmZ1bmN0aW9uIHJvdXRlVmlld0ZhY3RvcnkoJGxvZywgJGNvbXBpbGUsICRjb250cm9sbGVyLCBWaWV3QmluZGluZ3MsICRxLCBTdGF0ZSwgJHJvb3RTY29wZSwgJGFuaW1hdGUsICR0aW1lb3V0LCAkaW5qZWN0b3IsIFBlbmRpbmdWaWV3Q291bnRlciwgJHRlbXBsYXRlUmVxdWVzdCwgUm91dGUpIHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiBmYWxzZSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlOiAnPGRpdj48L2Rpdj4nLFxuICAgIGxpbmsgKHZpZXdEaXJlY3RpdmVTY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgbGV0IHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICBsZXQgdmlld1Njb3BlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgY29uc3QgdmlldyA9IFZpZXdCaW5kaW5ncy5nZXRWaWV3KGlBdHRycy5uYW1lKTtcbiAgICAgIGNvbnN0IGJpbmRpbmdzID0gdmlldy5nZXRCaW5kaW5ncygpO1xuXG4gICAgICBpRWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXG4gICAgICBsZXQgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVEYXRhRm9yQmluZGluZyA9IGJpbmRpbmcgPT4gXy5jbG9uZURlZXAoU3RhdGUuZ2V0U3Vic2V0KGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcoYmluZGluZykpKTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgZmllbGQpIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgIGZpZWxkID0gJ2NvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlID0gYmluZGluZ1tmaWVsZF0gPyAkaW5qZWN0b3IuZ2V0KGAke2JpbmRpbmdbZmllbGRdfURpcmVjdGl2ZWApWzBdIDogYmluZGluZztcbiAgICAgICAgcmV0dXJuIF8uZGVmYXVsdHMoXy5waWNrKHNvdXJjZSwgWydjb250cm9sbGVyJywgJ3RlbXBsYXRlVXJsJywgJ2NvbnRyb2xsZXJBcyddKSwge2NvbnRyb2xsZXJBczogJyRjdHJsJ30pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNSZXF1aXJlZERhdGEoYmluZGluZykge1xuICAgICAgICBjb25zdCByZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdO1xuXG4gICAgICAgIGZvciAobGV0IHJlcXVpcmVtZW50IG9mIEFycmF5LmZyb20ocmVxdWlyZWRTdGF0ZSkpIHtcbiAgICAgICAgICBsZXQgbmVnYXRlUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCchJyA9PT0gcmVxdWlyZW1lbnQuY2hhckF0KDApKSB7XG4gICAgICAgICAgICByZXF1aXJlbWVudCA9IHJlcXVpcmVtZW50LnNsaWNlKDEpO1xuICAgICAgICAgICAgbmVnYXRlUmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgZWxlbWVudCA9IFN0YXRlLmdldChyZXF1aXJlbWVudCk7XG5cbiAgICAgICAgICAvLyBSZXR1cm4gZmFsc2UgaWYgZWxlbWVudCBpcyB1bmRlZmluZWRcbiAgICAgICAgICBpZiAoKGVsZW1lbnQgPT09IG51bGwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT25seSBjaGVjayB2YWx1ZSBvZiBlbGVtZW50IGlmIGl0IGlzIGRlZmluZWRcbiAgICAgICAgICBpZiAobmVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gIWVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiaW5kaW5nLmNhbkFjdGl2YXRlKSB7XG4gICAgICAgICAgaWYgKCEkaW5qZWN0b3IuaW52b2tlKGJpbmRpbmcuY2FuQWN0aXZhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1hbmFnZVZpZXcoZWxlbWVudCwgYmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdCaW5kaW5nID0gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKTtcblxuICAgICAgICBpZiAoIW1hdGNoaW5nQmluZGluZykge1xuICAgICAgICAgIGlmICh2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3lWaWV3KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBSb3V0ZS5kZWxldGVDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1N0YXRlID0gZ2V0U3RhdGVEYXRhRm9yQmluZGluZyhtYXRjaGluZ0JpbmRpbmcpO1xuICAgICAgICBpZiAoKG1hdGNoaW5nQmluZGluZyA9PT0gcHJldmlvdXNCaW5kaW5nKSAmJiBhbmd1bGFyLmVxdWFscyhwcmV2aW91c0JvdW5kU3RhdGUsIG5ld1N0YXRlKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZpb3VzQmluZGluZyA9IG1hdGNoaW5nQmluZGluZztcbiAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gbmV3U3RhdGU7XG5cbiAgICAgICAgUGVuZGluZ1ZpZXdDb3VudGVyLmluY3JlYXNlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKGhhc1Jlc29sdmluZ1RlbXBsYXRlKSB7XG4gICAgICAgICAgLy8gQFRPRE86IE1hZ2ljIG51bWJlclxuICAgICAgICAgIGNvbnN0IGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uID0gaGFzUmVzb2x2aW5nVGVtcGxhdGUgPyAzMDAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBpZiAoIXZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGFuaW1hdGUucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpIHtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20oYmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVzdHJveVZpZXcoZWxlbWVudCkge1xuICAgICAgICBpZiAodmlld0NyZWF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKS5yZW1vdmUoKTtcbiAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXcoZWxlbWVudCwgYmluZGluZywgbWluaW11bURlbGF5KSB7XG4gICAgICAgIGNvbnN0IHRpbWVTdGFydGVkTWFpblZpZXcgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nKTtcblxuICAgICAgICBjb25zdCBvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgICBpZiAoZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSAhPT0gYmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZpZXdDcmVhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGNvbnN0IHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lID0gRGF0ZS5ub3coKSAtIHRpbWVTdGFydGVkTWFpblZpZXc7XG5cbiAgICAgICAgICBjb25zdCBpbmplY3RNYWluVGVtcGxhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzaG93RXJyb3IoZSwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBnaXZlIHRoZSB2aWV3IHRpbWUgdG8gcHJvcGVybHkgaW5pdGlhbGlzZVxuICAgICAgICAgICAgICAvLyBiZWZvcmUgcG90ZW50aWFsbHkgdHJpZ2dlcmluZyB0aGUgaW50aWFsVmlld3NMb2FkZWQgZXZlbnRcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkgPSBNYXRoLm1heCgwLCBtaW5pbXVtRGVsYXkgLSByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSk7XG5cbiAgICAgICAgICBpZiAocmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiBpbmplY3RNYWluVGVtcGxhdGUoKVxuICAgICAgICAgICAgICAsIG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluamVjdE1haW5UZW1wbGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblJlc29sdXRpb25GYWlsdXJlID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgICRsb2cuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIFJvdXRlLnNldEN1cnJlbnRCaW5kaW5nKHZpZXcubmFtZSwgYmluZGluZylcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7dGVtcGxhdGU6ICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKSwgZGVwZW5kZW5jaWVzOiByZXNvbHZlKGJpbmRpbmcpfTtcbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uLCBvblJlc29sdXRpb25GYWlsdXJlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsIHx8ICFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICByZXR1cm4gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKSgkcm9vdFNjb3BlLiRuZXcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLnJlc29sdmluZ0Vycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd1Jlc29sdmluZ0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGxldCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChiaW5kaW5nLmVycm9yVGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcuZXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNob3dFcnJvclRlbXBsYXRlID0gKGVsZW1lbnQsIGJpbmRpbmcpID0+IHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdlcnJvclRlbXBsYXRlVXJsJyk7XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsIHRlbXBsYXRlRmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nW3RlbXBsYXRlRmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuICAgICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICAgIGJpbmRpbmdDb21wb25lbnRGaWVsZCA9ICdlcnJvckNvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFiaW5kaW5nW2JpbmRpbmdDb21wb25lbnRGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHtkZXBlbmRlbmNpZXM6IHtlcnJvcn19O1xuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBhcmdzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncykge1xuICAgICAgICBjb25zdCB7ZGVwZW5kZW5jaWVzfSA9IGFyZ3M7XG4gICAgICAgIGNvbnN0IHt0ZW1wbGF0ZX0gPSBhcmdzO1xuXG4gICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQuY29udHJvbGxlcikge1xuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IF8ubWVyZ2UoZGVwZW5kZW5jaWVzLCB7JHNjb3BlOiB2aWV3U2NvcGUsICRlbGVtZW50OiBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCl9KTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbHMuJHNjb3BlW2NvbXBvbmVudC5jb250cm9sbGVyQXNdID0gJGNvbnRyb2xsZXIoY29tcG9uZW50LmNvbnRyb2xsZXIsIGxvY2Fscyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSAnRmFpbGVkIHRvIHNlcmlhbGl6ZSBlcnJvciBvYmplY3QgZm9yIGxvZ2dpbmcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkbG9nLmVycm9yKGBGYWlsZWQgaW5zdGFudGlhdGluZyBjb250cm9sbGVyIGZvciB2aWV3ICR7dmlld306ICR7ZXJyb3JNZXNzYWdlfWApO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZSA9IGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7fSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgZGVwZW5kZW5jeU5hbWUgaW4gYmluZGluZy5yZXNvbHZlKSB7XG4gICAgICAgICAgY29uc3QgZGVwZW5kZW5jeUZhY3RvcnkgPSBiaW5kaW5nLnJlc29sdmVbZGVwZW5kZW5jeU5hbWVdO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkaW5qZWN0b3IuaW52b2tlKGRlcGVuZGVuY3lGYWN0b3J5KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkcS5yZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcyk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nID0gYmluZGluZyA9PiBfLnVuaW9uKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXSwgYmluZGluZy53YXRjaGVkU3RhdGUgfHwgW10pO1xuXG4gICAgICBmdW5jdGlvbiBzdHJpcE5lZ2F0aW9uUHJlZml4KHN0cikge1xuICAgICAgICBpZiAoc3RyLmNoYXJBdCgwKSA9PT0gJyEnKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3ID0gdmlldyA9PiBfLmZsYXR0ZW4oXy5tYXAodmlldy5nZXRCaW5kaW5ncygpLCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKSk7XG5cbiAgICAgIGNvbnN0IGdldEZpZWxkc1RvV2F0Y2ggPSB2aWV3ID0+IF8udW5pcShfLm1hcChnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3KHZpZXcpLCBzdHJpcE5lZ2F0aW9uUHJlZml4KSk7XG5cbiAgICAgIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc1RvV2F0Y2godmlldyk7XG5cbiAgICAgIHJldHVybiBSb3V0ZS53aGVuUmVhZHkoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAvLyBUcnkgdG8gc3RhcnQgdGhlIGJhbGwgcm9sbGluZyBpbiBjYXNlIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIGFuZCB3ZSBjYW4gY3JlYXRlIHRoZSB2aWV3IGltbWVkaWF0ZWx5XG4gICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gRG9uJ3QgYm90aGVyIHB1dHRpbmcgaW4gYSB3YXRjaGVyIGlmIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBldmVyIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgaWYgKGZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0ZVdhdGNoZXIgPSBmdW5jdGlvbiAoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgIGlmICh2aWV3TWFuYWdlbWVudFBlbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGZpbmlzaCB0aGUgZGlnZXN0IGN5Y2xlIGJlZm9yZSBidWlsZGluZyB0aGUgdmlldywgd2hpY2ggc2hvdWxkXG4gICAgICAgICAgLy8gcHJldmVudCB1cyBmcm9tIHJlLXJlbmRlcmluZyBhIHZpZXcgbXVsdGlwbGUgdGltZXMgaWYgbXVsdGlwbGUgcHJvcGVydGllcyBvZiB0aGUgc2FtZSBzdGF0ZSBkZXBlbmRlbmN5XG4gICAgICAgICAgLy8gZ2V0IGNoYW5nZWQgd2l0aCByZXBlYXRlZCBTdGF0ZS5zZXQgY2FsbHNcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIFN0YXRlLndhdGNoKGZpZWxkcywgc3RhdGVXYXRjaGVyKTtcblxuICAgICAgICB2aWV3RGlyZWN0aXZlU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IFN0YXRlLnJlbW92ZVdhdGNoZXIoc3RhdGVXYXRjaGVyKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3ZpZXcnLCByb3V0ZVZpZXdGYWN0b3J5KTtcblxuY2xhc3MgUGVuZGluZ1ZpZXdDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoJHJvb3RTY29wZSkge1xuICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgfVxuXG4gIGluY3JlYXNlKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50ICs9IDE7XG4gIH1cblxuICBkZWNyZWFzZSgpIHtcbiAgICB0aGlzLmNvdW50ID0gTWF0aC5tYXgoMCwgdGhpcy5jb3VudCAtIDEpO1xuICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuaW5pdGlhbFZpZXdzTG9hZGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5jdXJyZW50Vmlld3NMb2FkZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1BlbmRpbmdWaWV3Q291bnRlcicsICgkcm9vdFNjb3BlKSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgUGVuZGluZ1ZpZXdDb3VudGVyKCRyb290U2NvcGUpO1xufSk7XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3Qge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5LCBsaXN0KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuXG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLndhdGNoZXJzID0gW107XG4gIH1cblxuICBnZXQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgfVxuXG4gIGdldEFsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0O1xuICB9XG5cbiAgZ2V0U3Vic2V0KHBhdGhzKSB7XG4gICAgcmV0dXJuIF8uemlwT2JqZWN0KHBhdGhzLCBfLm1hcChwYXRocywgdGhpcy5nZXQuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIuc2V0KHRoaXMubGlzdCwgcGF0aCwgdmFsdWUpO1xuICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIHVuc2V0KHBhdGhzKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLk9iamVjdEhlbHBlci51bnNldCh0aGlzLmxpc3QsIHBhdGgpO1xuICAgICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdhdGNoKHBhdGhzLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLndhdGNoZXJzLnB1c2godGhpcy5XYXRjaGVyRmFjdG9yeS5jcmVhdGUocGF0aCwgaGFuZGxlciwgdGhpcy5nZXQocGF0aCkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZVdhdGNoZXIod2F0Y2hlcikge1xuICAgIGlmICh0aGlzLndhdGNoZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdXYXRjaGVycyA9IFtdO1xuXG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHRoaXNXYXRjaGVyID0+IHtcbiAgICAgIGlmICh0aGlzV2F0Y2hlci5oYW5kbGVyICE9PSB3YXRjaGVyKSB7XG4gICAgICAgIG5ld1dhdGNoZXJzLnB1c2godGhpc1dhdGNoZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMud2F0Y2hlcnMgPSBuZXdXYXRjaGVycztcbiAgfVxuXG4gIF9ub3RpZnlXYXRjaGVycyhjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgd2F0Y2hlciA9PiB7XG4gICAgICBpZiAod2F0Y2hlci5zaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGggPSB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCB3YXRjaGVyLndhdGNoUGF0aCk7XG4gICAgICAgIHdhdGNoZXIubm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3RGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcbiAgfVxuXG4gIGNyZWF0ZShsaXN0ID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3QodGhpcy5PYmplY3RIZWxwZXIsIHRoaXMuV2F0Y2hlckZhY3RvcnksIGxpc3QpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hhYmxlTGlzdEZhY3RvcnknLCAoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3RGYWN0b3J5KE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpO1xufSk7XG5cbmNsYXNzIFdhdGNoZXIge1xuICBjb25zdHJ1Y3Rvcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHRoaXMud2F0Y2hQYXRoID0gd2F0Y2hQYXRoO1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChpbml0aWFsVmFsdWUpO1xuICB9XG5cbiAgX3Rva2VuaXplUGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKTtcbiAgfVxuXG4gIHNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICAvLyBOQiBzaG9ydCBjaXJjdWl0IGxvZ2ljIGluIHRoZSBzaW1wbGUgY2FzZVxuICAgIGlmICh0aGlzLndhdGNoUGF0aCA9PT0gY2hhbmdlZFBhdGgpIHtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHModGhpcy5jdXJyZW50VmFsdWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXRjaCA9IHtcbiAgICAgIHBhdGg6IHRoaXMud2F0Y2hQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgodGhpcy53YXRjaFBhdGgpLFxuICAgICAgdmFsdWU6IHRoaXMuY3VycmVudFZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IGNoYW5nZSA9IHtcbiAgICAgIHBhdGg6IGNoYW5nZWRQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgoY2hhbmdlZFBhdGgpLFxuICAgICAgdmFsdWU6IG5ld1ZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IG1pbmltdW1MZW50aCA9IE1hdGgubWluKGNoYW5nZS50b2tlbnMubGVuZ3RoLCB3YXRjaC50b2tlbnMubGVuZ3RoKTtcbiAgICBmb3IgKGxldCB0b2tlbkluZGV4ID0gMDsgdG9rZW5JbmRleCA8IG1pbmltdW1MZW50aDsgdG9rZW5JbmRleCsrKSB7XG4gICAgICBpZiAod2F0Y2gudG9rZW5zW3Rva2VuSW5kZXhdICE9PSBjaGFuZ2UudG9rZW5zW3Rva2VuSW5kZXhdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOQiBpZiB3ZSBnZXQgaGVyZSB0aGVuIGFsbCBjb21tb24gdG9rZW5zIG1hdGNoXG5cbiAgICBjb25zdCBjaGFuZ2VQYXRoSXNEZXNjZW5kYW50ID0gY2hhbmdlLnRva2Vucy5sZW5ndGggPiB3YXRjaC50b2tlbnMubGVuZ3RoO1xuXG4gICAgaWYgKGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQpIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGNoYW5nZS50b2tlbnMuc2xpY2Uod2F0Y2gudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCA9IF8uZ2V0KHdhdGNoLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyhjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoLCBjaGFuZ2UudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSB3YXRjaC50b2tlbnMuc2xpY2UoY2hhbmdlLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaFBhdGggPSBfLmdldChjaGFuZ2UudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHdhdGNoLnZhbHVlLCBuZXdWYWx1ZUF0V2F0Y2hQYXRoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5oYW5kbGVyKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgdGhpcy5jdXJyZW50VmFsdWUpO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAobmV3VmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoZXJGYWN0b3J5IHtcbiAgY3JlYXRlKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGVyKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoZXJGYWN0b3J5JywgKCkgPT4ge1xuICByZXR1cm4gbmV3IFdhdGNoZXJGYWN0b3J5KCk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignUm91dGUnLCBmdW5jdGlvbihPYmplY3RIZWxwZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuICBjb25zdCB0b2tlbnMgPSB7fTtcbiAgY29uc3QgdXJsV3JpdGVycyA9IFtdO1xuICBjb25zdCB1cmxzID0gW107XG4gIGNvbnN0IHBlcnNpc3RlbnRTdGF0ZXMgPSBbXTtcbiAgY29uc3QgcmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgdHlwZXMgPSB7fTtcbiAgbGV0IGh0bWw1TW9kZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3ZpZGVyID0ge1xuXG4gICAgcmVnaXN0ZXJUeXBlKG5hbWUsIGNvbmZpZykge1xuICAgICAgdHlwZXNbbmFtZV0gPSBjb25maWc7XG4gICAgICB0eXBlc1tuYW1lXS5yZWdleCA9IG5ldyBSZWdFeHAodHlwZXNbbmFtZV0ucmVnZXguc291cmNlLCAnaScpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVHlwZSB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxUb2tlbihuYW1lLCBjb25maWcpIHtcbiAgICAgIHRva2Vuc1tuYW1lXSA9IF8uZXh0ZW5kKHtuYW1lfSwgY29uZmlnKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFRva2VuIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFdyaXRlcihuYW1lLCBmbikge1xuICAgICAgdXJsV3JpdGVyc1tuYW1lXSA9IGZuO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsV3JpdGVyIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybChwYXR0ZXJuLCBjb25maWcgPSB7fSkge1xuICAgICAgY29uc3QgdXJsRGF0YSA9IHtcbiAgICAgICAgY29tcGlsZWRVcmw6IHRoaXMuX2NvbXBpbGVVcmxQYXR0ZXJuKHBhdHRlcm4sIGNvbmZpZyksXG4gICAgICAgIHBhdHRlcm5cbiAgICAgIH07XG5cbiAgICAgIHVybHMucHVzaChfLmV4dGVuZCh1cmxEYXRhLCBjb25maWcpKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybCB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGVyc2lzdGVudFN0YXRlcyguLi5zdGF0ZUxpc3QpIHtcbiAgICAgIF8uZm9yRWFjaChzdGF0ZUxpc3QsIChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIXBlcnNpc3RlbnRTdGF0ZXMuaW5jbHVkZXMoc3RhdGUpKSB7XG4gICAgICAgICAgcGVyc2lzdGVudFN0YXRlcy5wdXNoKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldEh0bWw1TW9kZShtb2RlKSB7XG4gICAgICBodG1sNU1vZGUgPSBtb2RlO1xuICAgIH0sXG5cbiAgICBfY29tcGlsZVVybFBhdHRlcm4odXJsUGF0dGVybiwgY29uZmlnKSB7XG4gICAgICBsZXQgbWF0Y2g7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyh1cmxQYXR0ZXJuKTtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2godXJsUGF0dGVybik7XG5cbiAgICAgIGNvbnN0IHRva2VuUmVnZXggPSAvXFx7KFtBLVphLXpcXC5fMC05XSspXFx9L2c7XG4gICAgICBsZXQgdXJsUmVnZXggPSB1cmxQYXR0ZXJuO1xuXG4gICAgICBpZiAoIWNvbmZpZy5wYXJ0aWFsTWF0Y2gpIHtcbiAgICAgICAgdXJsUmVnZXggPSBgXiR7dXJsUmVnZXh9JGA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRva2VuTGlzdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKG1hdGNoID0gdG9rZW5SZWdleC5leGVjKHVybFBhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1ttYXRjaFsxXV07XG4gICAgICAgIHRva2VuTGlzdC5wdXNoKHRva2VuKTtcbiAgICAgICAgdXJsUmVnZXggPSB1cmxSZWdleC5yZXBsYWNlKG1hdGNoWzBdLCBgKCR7dHlwZXNbdG9rZW4udHlwZV0ucmVnZXguc291cmNlfSlgKTtcbiAgICAgIH1cblxuICAgICAgdXJsUmVnZXgucmVwbGFjZSgnLicsICdcXFxcLicpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCh1cmxSZWdleCwgJ2knKSxcbiAgICAgICAgdG9rZW5zOiB0b2tlbkxpc3RcbiAgICAgIH07XG4gICAgfSxcblxuICAgIF9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2goc3RyKSB7XG4gICAgICBpZiAoc3RyLm1hdGNoKC9cXC8kLykpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXC8kLywgJy8/Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCR7c3RyfS8/YDtcbiAgICB9LFxuXG4gICAgX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXChcXClcXCpcXCtcXD9cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICB9LFxuXG4gICAgJGdldCgkbG9jYXRpb24sICRpbmplY3RvciwgJHEpIHtcbiAgICAgICduZ0luamVjdCc7XG5cbiAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc2VydmljZSAob25seSBkb25lIG9uY2UpLCB3ZSBuZWVkIHRvIGl0ZXJhdGUgb3ZlciB0aGUgdXJsV3JpdGVycyBhbmQgdHVyblxuICAgICAgLy8gdGhlbSBpbnRvIG1ldGhvZHMgdGhhdCBpbnZva2UgdGhlIFJFQUwgdXJsV3JpdGVyLCBidXQgcHJvdmlkaW5nIGRlcGVuZGVuY3kgaW5qZWN0aW9uIHRvIGl0LCB3aGlsZSBhbHNvXG4gICAgICAvLyBnaXZpbmcgaXQgdGhlIGRhdGEgdGhhdCB0aGUgY2FsbGVlIHBhc3NlcyBpbi5cblxuICAgICAgLy8gVGhlIHJlYXNvbiB3ZSBoYXZlIHRvIGRvIHRoaXMgaGVyZSBpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoZSAkaW5qZWN0b3IgYmFjayBpbiB0aGUgcm91dGVQcm92aWRlci5cblxuICAgICAgXy5mb3JJbih1cmxXcml0ZXJzLCAod3JpdGVyLCB3cml0ZXJOYW1lKSA9PlxuICAgICAgICB1cmxXcml0ZXJzW3dyaXRlck5hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmICghZGF0YSkgeyBkYXRhID0ge307IH1cbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSB7VXJsRGF0YTogZGF0YX07XG4gICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5pbnZva2Uod3JpdGVyLCB7fSwgbG9jYWxzKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgbGV0IGZsYXNoU3RhdGVzID0gW107XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgIGN1cnJlbnRCaW5kaW5nczoge30sXG4gICAgICAgIHJlYWR5RGVmZXJyZWQ6ICRxLmRlZmVyKCksXG5cbiAgICAgICAgbWF0Y2godXJsVG9NYXRjaCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdXJsIG9mIEFycmF5LmZyb20odXJscykpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSB1cmwuY29tcGlsZWRVcmwucmVnZXguZXhlYyh1cmxUb01hdGNoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHt1cmwsIHJlZ2V4TWF0Y2g6IG1hdGNofTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERhdGEobWF0Y2gsIHNlYXJjaERhdGEgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMuZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKTtcbiAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5leHRyYWN0UGF0aERhdGEobWF0Y2gpO1xuICAgICAgICAgIHNlYXJjaERhdGEgPSB0aGlzLmV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpO1xuICAgICAgICAgIHJldHVybiBPYmplY3RIZWxwZXIuZGVmYXVsdChzZWFyY2hEYXRhLCBwYXRoLCBkZWZhdWx0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSkge1xuICAgICAgICAgIGlmICghc2VhcmNoRGF0YSkgeyBzZWFyY2hEYXRhID0gJGxvY2F0aW9uLnNlYXJjaCgpOyB9XG4gICAgICAgICAgY29uc3QgZGF0YSA9IF8uY2xvbmUoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKGRhdGEsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0S2V5ID0gXy5maW5kS2V5KHRva2VucywgeyBzZWFyY2hBbGlhczoga2V5IH0pO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRLZXkpIHsgdGFyZ2V0S2V5ID0ga2V5OyB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZU5hbWUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IF8uZ2V0KHRva2Vuc1t0YXJnZXRLZXldLCAndHlwZScpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCF0b2tlbnNbdGFyZ2V0S2V5XSB8fCAodHlwZXNbdG9rZW5UeXBlTmFtZV0ucmVnZXgudGVzdCh2YWx1ZSkpKSB7XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS50eXBlIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0eXBlVG9rZW5UeXBlID0gdG9rZW5UeXBlID8gdHlwZXNbdG9rZW5UeXBlXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlUGFyc2VkID0gdHlwZVRva2VuVHlwZSA/IHR5cGVUb2tlblR5cGUucGFyc2VyIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgIGlmICh0b2tlblR5cGVQYXJzZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodG9rZW5UeXBlUGFyc2VkLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblRhcmdldEtleVN0YXRlUGF0aCA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0uc3RhdGVQYXRoIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCBkYXRhS2V5ID0gdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggfHwgdGFyZ2V0S2V5O1xuXG4gICAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQobmV3RGF0YSwgZGF0YUtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKG1hdGNoLnVybC5zdGF0ZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwga2V5LCAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IF8uY2xvbmVEZWVwKHZhbHVlKSA6IHZhbHVlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0UGF0aERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICAgY29uc3QgcGF0aFRva2VucyA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnM7XG5cbiAgICAgICAgICBpZiAocGF0aFRva2Vucy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHt9OyB9XG5cbiAgICAgICAgICBmb3IgKGxldCBuID0gMCwgZW5kID0gcGF0aFRva2Vucy5sZW5ndGgtMSwgYXNjID0gMCA8PSBlbmQ7IGFzYyA/IG4gPD0gZW5kIDogbiA+PSBlbmQ7IGFzYyA/IG4rKyA6IG4tLSkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zW25dO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbWF0Y2gucmVnZXhNYXRjaFtuKzFdO1xuXG4gICAgICAgICAgICBpZiAodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyKSB7IHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIsIG51bGwsIHt0b2tlbjogdmFsdWV9KTsgfVxuXG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsICh0b2tlbi5zdGF0ZVBhdGggfHwgdG9rZW4ubmFtZSksIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXJzKCkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcihuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdvKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiAkbG9jYXRpb24udXJsKHRoaXMuaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRQZXJzaXN0ZW50U3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBwZXJzaXN0ZW50U3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBbXTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRGbGFzaFN0YXRlcyguLi5uZXdTdGF0ZXMpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IGZsYXNoU3RhdGVzLmNvbmNhdChuZXdTdGF0ZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBmbGFzaFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSwgYmluZGluZykge1xuICAgICAgICAgIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXSA9IGJpbmRpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlbGV0ZUN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBtYXRjaGVzQ3VycmVudEJpbmRpbmdOYW1lKHZpZXdOYW1lLCBiaW5kaW5nTmFtZUV4cHJlc3Npb24pIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50QmluZGluZyA9IHRoaXMuZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpXG5cbiAgICAgICAgICBpZiAoIWN1cnJlbnRCaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gYmluZGluZ05hbWVFeHByZXNzaW9uIGluc3RhbmNlb2YgUmVnRXhwID9cbiAgICAgICAgICAgIGJpbmRpbmdOYW1lRXhwcmVzc2lvbi50ZXN0KGN1cnJlbnRCaW5kaW5nLm5hbWUpIDpcbiAgICAgICAgICAgIGN1cnJlbnRCaW5kaW5nLm5hbWUgPT09IGJpbmRpbmdOYW1lRXhwcmVzc2lvbjtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZWFkeShyZWFkeSkge1xuICAgICAgICAgIGlmICghcmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1JlYWR5KCkge1xuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0h0bWw1TW9kZUVuYWJsZWQoKSB7XG4gICAgICAgICAgcmV0dXJuIGh0bWw1TW9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICB3aGVuUmVhZHkoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHlEZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdudW1lcmljJywge3JlZ2V4OiAvXFxkKy8sIHBhcnNlcjogWyd0b2tlbicsIHRva2VuID0+IHBhcnNlSW50KHRva2VuKV19KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbHBoYScsIHtyZWdleDogL1thLXpBLVpdKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbnknLCB7cmVnZXg6IC8uKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdsaXN0Jywge3JlZ2V4OiAvLisvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiB0b2tlbi5zcGxpdCgnLCcpXX0pO1xuXG4gIHJldHVybiBwcm92aWRlcjtcbn0pO1xuXG5jbGFzcyBTdGF0ZVByb3ZpZGVyIHtcbiAgJGdldChXYXRjaGFibGVMaXN0RmFjdG9yeSkge1xuICAgICduZ0luamVjdCc7XG4gICAgcmV0dXJuIFdhdGNoYWJsZUxpc3RGYWN0b3J5LmNyZWF0ZSgpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1N0YXRlJywgbmV3IFN0YXRlUHJvdmlkZXIpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdWaWV3QmluZGluZ3MnLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHZpZXdzID0gW107XG5cbiAgY2xhc3MgVmlldyB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgYmluZGluZ3MpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XG4gICAgICBpZiAoISh0aGlzLmJpbmRpbmdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBbdGhpcy5iaW5kaW5nc107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QmluZGluZ3MoKSB7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuXG4gICAgYmluZChuYW1lLCBjb25maWcpIHtcblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKGJpbmRpbmdzLCBjb21tb25SZXF1aXJlZFN0YXRlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoIShiaW5kaW5nLnJlcXVpcmVkU3RhdGUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IFtiaW5kaW5nLnJlcXVpcmVkU3RhdGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUuY29uY2F0KGNvbW1vblJlcXVpcmVkU3RhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vblJlc29sdmUoYmluZGluZ3MsIGNvbW1vblJlc29sdmUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGlmICghKCdyZXNvbHZlJyBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgYmluZGluZy5yZXNvbHZlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKF8uZGVmYXVsdHMoYmluZGluZy5yZXNvbHZlLCBjb21tb25SZXNvbHZlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgYmFzaWNDb21tb25GaWVsZHMgPSBbXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ0Vycm9yQ29tcG9uZW50Jywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25FcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvclRlbXBsYXRlVXJsJ31cbiAgICAgICAgXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNvbW1vbkZpZWxkIG9mIEFycmF5LmZyb20oYmFzaWNDb21tb25GaWVsZHMpKSB7XG4gICAgICAgICAgaWYgKGNvbW1vbkZpZWxkLm5hbWUgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBkZWZhdWx0QmluZGluZ0ZpZWxkKG5ld0JpbmRpbmdzLCBjb21tb25GaWVsZC5vdmVycmlkZUZpZWxkLCBjb25maWdbY29tbW9uRmllbGQubmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29tbW9uUmVxdWlyZWRTdGF0ZScgaW4gY29uZmlnKSB7XG4gICAgICAgICAgYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlcXVpcmVkU3RhdGUnXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlc29sdmUnIGluIGNvbmZpZykge1xuICAgICAgICAgIHJldHVybiBhcHBseUNvbW1vblJlc29sdmUobmV3QmluZGluZ3MsIGNvbmZpZ1snY29tbW9uUmVzb2x2ZSddKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZWZhdWx0QmluZGluZ0ZpZWxkKGJpbmRpbmdzLCBmaWVsZE5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgICAgaWYgKCEoZmllbGROYW1lIGluIGJpbmRpbmcpKSB7XG4gICAgICAgICAgICBpdGVtID0gYmluZGluZ1tmaWVsZE5hbWVdID0gZGVmYXVsdFZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3QmluZGluZ3MgPSBbXTtcbiAgICAgIGlmICgnYmluZGluZ3MnIGluIGNvbmZpZykge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IGNvbmZpZ1snYmluZGluZ3MnXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0JpbmRpbmdzID0gKGNvbmZpZyBpbnN0YW5jZW9mIEFycmF5KSA/IGNvbmZpZyA6IFtjb25maWddO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShuZXdCaW5kaW5ncy5sZW5ndGggPiAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY2FsbCB0byBWaWV3QmluZGluZ3NQcm92aWRlci5iaW5kIGZvciBuYW1lICcke25hbWV9J2ApO1xuICAgICAgfVxuXG4gICAgICBhcHBseUNvbW1vbkZpZWxkcyhuZXdCaW5kaW5ncyk7XG4gICAgICByZXR1cm4gdmlld3NbbmFtZV0gPSBuZXcgVmlldyhuYW1lLCBuZXdCaW5kaW5ncyk7XG4gICAgfSxcblxuICAgICRnZXQoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXRWaWV3KHZpZXcpIHtcbiAgICAgICAgICByZXR1cm4gdmlld3Nbdmlld107XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
