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
            var fullUrl = $window.location.protocol + "//" + $window.location.host + urlPath;
            $window.open(fullUrl, '_blank');
          } else {
            if (!Route.isHtml5ModeEnabled()) {
              urlPath = urlPath.replace(/^#/, '');
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWlCLENBQWhDLEFBQWdDLEFBQUMsY0FBakMsQUFBK0Msd0ZBQUksVUFBQSxBQUFVLE9BQVYsQUFBaUIsT0FBakIsQUFBd0IsV0FBeEIsQUFBbUMsWUFBbkMsQUFBK0MsY0FBL0MsQUFBNkQsb0JBQW9CLEFBQ2xJO0FBRUE7O01BQUksU0FBSixBQUFhLEFBQ2I7YUFBQSxBQUFXLElBQVgsQUFBZSx3QkFBd0IsWUFBWSxBQUNqRDtRQUFJLE1BQUosQUFBSSxBQUFNLFdBQVcsQUFDbkI7WUFBQSxBQUFNLFNBQU4sQUFBZSxBQUNoQjtBQUNGO0FBSkQsQUFNQTs7YUFBQSxBQUFXLElBQVgsQUFBZSwwQkFBMEIsVUFBQSxBQUFVLEdBQVYsQUFBYSxRQUFRLEFBQzVEO0FBQ0E7UUFBSSxZQUFKLEFBQ0E7UUFBSSxXQUFKLEFBQWUsUUFBUSxBQUNyQjtBQUNEO0FBRUQ7O2FBQUEsQUFBUyxBQUVUOzt1QkFBQSxBQUFtQixBQUNuQjtRQUFNLFFBQVEsTUFBQSxBQUFNLE1BQU0sVUFBMUIsQUFBYyxBQUFZLEFBQVUsQUFFcEM7O1FBQUksQ0FBSixBQUFLLE9BQU8sQUFDVjthQUFBLEFBQU8sQUFDUjtBQUZELFdBRU8sQUFDTDthQUFPLE1BQUEsQUFBTSxZQUFiLEFBQU8sQUFBa0IsQUFDMUI7QUFFRDs7UUFBSSxnQkFBZ0IsYUFBQSxBQUFhLE1BQU0sTUFBbkIsQUFBeUIsTUFBN0MsQUFBb0IsQUFBK0IsQUFDbkQ7b0JBQWdCLEVBQUEsQUFBRSxXQUFGLEFBQWEsZUFBZSxNQUFBLEFBQU0sc0JBQU4sQUFBNEIsT0FBTyxNQUEvRSxBQUFnQixBQUE0QixBQUFtQyxBQUFNLEFBRXJGOztRQUFNLFlB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ckM7QUExRUksQUE0RUw7QUE1RUssMEJBNEVFLEFBQ0w7O0FBQU8sa0NBQUEsQUFDRyxNQUFNLEFBQ1o7aUJBQU8sTUFBUCxBQUFPLEFBQU0sQUFDZDtBQUhILEFBQU8sQUFLUjtBQUxRLEFBQ0w7QUE5RU4sQUFBTyxBQW9GUjtBQXBGUSxBQUVMO0FBbkJKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJywgWyduZ0FuaW1hdGUnXSkucnVuKGZ1bmN0aW9uIChTdGF0ZSwgUm91dGUsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgT2JqZWN0SGVscGVyLCBQZW5kaW5nVmlld0NvdW50ZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuXG4gIGxldCBvbGRVcmwgPSB1bmRlZmluZWQ7XG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoUm91dGUuaXNSZWFkeSgpKSB7XG4gICAgICBSb3V0ZS5zZXRSZWFkeShmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uIChlLCBuZXdVcmwpIHtcbiAgICAvLyBXb3JrLWFyb3VuZCBmb3IgQW5ndWxhckpTIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvaXNzdWVzLzgzNjhcbiAgICBsZXQgZGF0YTtcbiAgICBpZiAobmV3VXJsID09PSBvbGRVcmwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvbGRVcmwgPSBuZXdVcmw7XG5cbiAgICBQZW5kaW5nVmlld0NvdW50ZXIucmVzZXQoKTtcbiAgICBjb25zdCBtYXRjaCA9IFJvdXRlLm1hdGNoKCRsb2NhdGlvbi5wYXRoKCkpO1xuXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gUm91dGUuZXh0cmFjdERhdGEobWF0Y2gpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHNUb1Vuc2V0ID0gT2JqZWN0SGVscGVyLm5vdEluKFN0YXRlLmxpc3QsIGRhdGEpO1xuICAgIGZpZWxkc1RvVW5zZXQgPSBfLmRpZmZlcmVuY2UoZmllbGRzVG9VbnNldCwgUm91dGUuZ2V0UGVyc2lzdGVudFN0YXRlcygpLmNvbmNhdChSb3V0ZS5nZXRGbGFzaFN0YXRlcygpKSk7XG5cbiAgICBjb25zdCBldmVudERhdGEgPSB7dW5zZXR0aW5nOiBmaWVsZHNUb1Vuc2V0LCBzZXR0aW5nOiBkYXRhfTtcblxuICAgICRyb290U2NvcGUuJGVtaXQoJ2JpY2tlcl9yb3V0ZXIuYmVmb3JlU3RhdGVDaGFuZ2UnLCBldmVudERhdGEpO1xuXG4gICAgaWYgKChldmVudERhdGEudW5zZXR0aW5nKS5sZW5ndGggIT09IDApIHtcbiAgICAgIFN0YXRlLnVuc2V0KGV2ZW50RGF0YS51bnNldHRpbmcpO1xuICAgIH1cblxuICAgIF8uZm9yRWFjaChldmVudERhdGEuc2V0dGluZywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIFJvdXRlLnJlc2V0Rmxhc2hTdGF0ZXMoKTtcbiAgICBSb3V0ZS5zZXRSZWFkeSh0cnVlKTtcbiAgfSk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5jb25zdGFudCgnT2JqZWN0SGVscGVyJywge1xuICBnZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XTtcbiAgfSxcblxuICBzZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIGlmIChwYXJlbnRbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJlbnRbc2VnbWVudF0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XSA9IHZhbHVlO1xuICB9LFxuXG4gIHVuc2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cblxuICAgIGlmIChwYXJlbnRba2V5XSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGRlbGV0ZSBwYXJlbnRba2V5XTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICAvLyBSZWN1cnNpdmVseSByZXR1cm4gdGhlIHByb3BlcnRpZXMgaW4gYSB0aGF0IGFyZW4ndCBpbiBiXG4gIG5vdEluKGEsIGIsIHByZWZpeCA9ICcnKSB7XG4gICAgbGV0IG5vdEluID0gW107XG4gICAgcHJlZml4ID0gcHJlZml4Lmxlbmd0aCA+IDAgPyBgJHtwcmVmaXh9LmAgOiAnJztcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIEFycmF5LmZyb20oT2JqZWN0LmtleXMoYSkpKSB7XG4gICAgICBjb25zdCB0aGlzUGF0aCA9IGAke3ByZWZpeH0ke2tleX1gO1xuXG4gICAgICBpZiAoYltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm90SW4ucHVzaCh0aGlzUGF0aCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBhW2tleV0gPT09ICdvYmplY3QnKSAmJiAoIShhW2tleV0gaW5zdGFuY2VvZiBBcnJheSkpKSB7XG4gICAgICAgIG5vdEluID0gbm90SW4uY29uY2F0KHRoaXMubm90SW4oYVtrZXldLCBiW2tleV0sIHRoaXNQYXRoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdEluO1xuICB9LFxuXG4gIGRlZmF1bHQob3ZlcnJpZGVzLCAuLi5kZWZhdWx0U2V0cykge1xuICAgIGxldCBkZWZhdWx0U2V0LCB2YWx1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgIGlmIChkZWZhdWx0U2V0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGRlZmF1bHRTZXQgPSBkZWZhdWx0U2V0c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFNldCA9IHRoaXMuZGVmYXVsdCguLi5BcnJheS5mcm9tKGRlZmF1bHRTZXRzIHx8IFtdKSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGVmYXVsdFNldCkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0U2V0W2tleV07XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIG92ZXJyaWRlc1trZXldID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMuZGVmYXVsdChvdmVycmlkZXNba2V5XSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvdmVycmlkZXMpIHtcbiAgICAgIHZhbHVlID0gb3ZlcnJpZGVzW2tleV07XG4gICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldIHx8IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuXG5cbi8vIFVzYWdlOlxuLy9cbi8vIElmIHlvdSB3YW50IHRvIGFkZCB0aGUgY2xhc3MgXCJhY3RpdmVcIiB0byBhbiBhbmNob3IgZWxlbWVudCB3aGVuIHRoZSBcIm1haW5cIiB2aWV3IGhhcyBhIGJpbmRpbmdcbi8vIHdpdGggdGhlIG5hbWUgXCJteUJpbmRpbmdcIiByZW5kZXJlZCB3aXRoaW4gaXRcbi8vXG4vLyA8YSByb3V0ZS1jbGFzcz1cInsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6ICdteUJpbmRpbmcnIH1cIj5BbmNob3IgdGV4dDwvYT5cbi8vXG4vLyBZb3UgY2FuIGFsc28gdXNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHRoZSBiaW5kaW5nIG5hbWUsIGJ1dCB0byBkbyBzbyB5b3UgaGF2ZSB0byBwcm92aWRlIGEgbWV0aG9kXG4vLyBvbiB5b3VyIGNvbnRyb2xsZXIgd2hpY2ggcmV0dXJucyB0aGUgcm91dGUgY2xhc3MgZGVmaW5pdGlvbiBvYmplY3QsIGJlY2F1c2UgQW5ndWxhckpTIGV4cHJlc3Npb25zXG4vLyBkb24ndCBzdXBwb3J0IGlubGluZSByZWd1bGFyIGV4cHJlc3Npb25zXG4vL1xuLy8gY2xhc3MgTXlDb250cm9sbGVyIHtcbi8vICBnZXRSb3V0ZUNsYXNzT2JqZWN0KCkge1xuLy8gICAgcmV0dXJuIHsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6IC9teUJpbmQvIH1cbi8vICB9XG4vLyB9XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCIkY3RybC5nZXRSb3V0ZUNsYXNzT2JqZWN0KClcIj5BbmNob3IgdGV4dDwvYT5cbi8vXG5cbmZ1bmN0aW9uIHJvdXRlQ2xhc3NGYWN0b3J5KFJvdXRlKSB7XG4gICduZ0luamVjdCdcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goKCkgPT4ge1xuICAgICAgICBjb25zdCByb3V0ZUNsYXNzRGVmaW5pdGlvbiA9IHNjb3BlLiRldmFsKGlBdHRyc1sncm91dGVDbGFzcyddKVxuXG4gICAgICAgIGlmICghUm91dGUubWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZShyb3V0ZUNsYXNzRGVmaW5pdGlvbi52aWV3TmFtZSwgcm91dGVDbGFzc0RlZmluaXRpb24uYmluZGluZ05hbWUpKSB7XG4gICAgICAgICAgaWYgKGlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5hZGRDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVDbGFzcycsIHJvdXRlQ2xhc3NGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVIcmVmRmFjdG9yeSAoUm91dGUsICR3aW5kb3csICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0J1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBzY29wZTogdHJ1ZSxcbiAgICBsaW5rIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgIGlmIChpQXR0cnMuaWdub3JlSHJlZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpRWxlbWVudC5jbGljaygoZXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IHVybFBhdGggPSBpRWxlbWVudC5hdHRyKCdocmVmJyk7XG5cbiAgICAgICAgaWYgKGV2ZW50Lm1ldGFLZXkpIHtcbiAgICAgICAgICBjb25zdCBmdWxsVXJsID0gJHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArICR3aW5kb3cubG9jYXRpb24uaG9zdCArIHVybFBhdGg7XG4gICAgICAgICAgJHdpbmRvdy5vcGVuKGZ1bGxVcmwsJ19ibGFuaycpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgICAgdXJsUGF0aCA9IHVybFBhdGgucmVwbGFjZSgvXiMvLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiAkbG9jYXRpb24udXJsKHVybFBhdGgpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0ID0gUm91dGUuZ2V0VXJsV3JpdGVycygpO1xuICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgIGNvbnN0IHdyaXRlciA9IG9iamVjdFt3cml0ZXJOYW1lXTtcbiAgICAgIHNjb3BlW2Ake3dyaXRlck5hbWV9VXJsV3JpdGVyYF0gPSB3cml0ZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjb3BlLiR3YXRjaChpQXR0cnMucm91dGVIcmVmLCAobmV3VXJsKSA9PiB7XG4gICAgICBsZXQgdXJsO1xuICAgICAgaWYgKFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgIHVybCA9IG5ld1VybDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybCA9IGAjJHtuZXdVcmx9YDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpRWxlbWVudC5hdHRyKCdocmVmJywgdXJsKTtcbiAgICB9KTtcbiAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZUhyZWYnLCByb3V0ZUhyZWZGYWN0b3J5KTtcblxuLy8gQFRPRE8gbm9uZSBvZiB0aGUgYW5pbWF0aW9uIGNvZGUgaW4gdGhpcyBkaXJlY3RpdmUgaGFzIGJlZW4gdGVzdGVkLiBOb3Qgc3VyZSBpZiBpdCBjYW4gYmUgYXQgdGhpcyBzdGFnZSBUaGlzIG5lZWRzIGZ1cnRoZXIgaW52ZXN0aWdhdGlvbi5cbi8vIEBUT0RPIHRoaXMgY29kZSBkb2VzIHRvbyBtdWNoLCBpdCBzaG91bGQgYmUgcmVmYWN0b3JlZC5cblxuZnVuY3Rpb24gcm91dGVWaWV3RmFjdG9yeSgkbG9nLCAkY29tcGlsZSwgJGNvbnRyb2xsZXIsIFZpZXdCaW5kaW5ncywgJHEsIFN0YXRlLCAkcm9vdFNjb3BlLCAkYW5pbWF0ZSwgJHRpbWVvdXQsICRpbmplY3RvciwgUGVuZGluZ1ZpZXdDb3VudGVyLCAkdGVtcGxhdGVSZXF1ZXN0LCBSb3V0ZSkge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IGZhbHNlLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGU6ICc8ZGl2PjwvZGl2PicsXG4gICAgbGluayAodmlld0RpcmVjdGl2ZVNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBsZXQgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgIGxldCB2aWV3U2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICBjb25zdCB2aWV3ID0gVmlld0JpbmRpbmdzLmdldFZpZXcoaUF0dHJzLm5hbWUpO1xuICAgICAgY29uc3QgYmluZGluZ3MgPSB2aWV3LmdldEJpbmRpbmdzKCk7XG5cbiAgICAgIGlFbGVtZW50LmFkZENsYXNzKCduZy1oaWRlJyk7XG5cbiAgICAgIGxldCBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nID0gYmluZGluZyA9PiBfLmNsb25lRGVlcChTdGF0ZS5nZXRTdWJzZXQoZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyhiaW5kaW5nKSkpO1xuXG4gICAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBmaWVsZCkge1xuICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgZmllbGQgPSAnY29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzb3VyY2UgPSBiaW5kaW5nW2ZpZWxkXSA/ICRpbmplY3Rvci5nZXQoYCR7YmluZGluZ1tmaWVsZF19RGlyZWN0aXZlYClbMF0gOiBiaW5kaW5nO1xuICAgICAgICByZXR1cm4gXy5kZWZhdWx0cyhfLnBpY2soc291cmNlLCBbJ2NvbnRyb2xsZXInLCAndGVtcGxhdGVVcmwnLCAnY29udHJvbGxlckFzJ10pLCB7Y29udHJvbGxlckFzOiAnJGN0cmwnfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW107XG5cbiAgICAgICAgZm9yIChsZXQgcmVxdWlyZW1lbnQgb2YgQXJyYXkuZnJvbShyZXF1aXJlZFN0YXRlKSkge1xuICAgICAgICAgIGxldCBuZWdhdGVSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoJyEnID09PSByZXF1aXJlbWVudC5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIHJlcXVpcmVtZW50ID0gcmVxdWlyZW1lbnQuc2xpY2UoMSk7XG4gICAgICAgICAgICBuZWdhdGVSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBlbGVtZW50ID0gU3RhdGUuZ2V0KHJlcXVpcmVtZW50KTtcblxuICAgICAgICAgIC8vIFJldHVybiBmYWxzZSBpZiBlbGVtZW50IGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGlmICgoZWxlbWVudCA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPbmx5IGNoZWNrIHZhbHVlIG9mIGVsZW1lbnQgaWYgaXQgaXMgZGVmaW5lZFxuICAgICAgICAgIGlmIChuZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSAhZWxlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpbmRpbmcuY2FuQWN0aXZhdGUpIHtcbiAgICAgICAgICBpZiAoISRpbmplY3Rvci5pbnZva2UoYmluZGluZy5jYW5BY3RpdmF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWFuYWdlVmlldyhlbGVtZW50LCBiaW5kaW5ncykge1xuICAgICAgICBjb25zdCBtYXRjaGluZ0JpbmRpbmcgPSBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpO1xuXG4gICAgICAgIGlmICghbWF0Y2hpbmdCaW5kaW5nKSB7XG4gICAgICAgICAgaWYgKHZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveVZpZXcoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIFJvdXRlLmRlbGV0ZUN1cnJlbnRCaW5kaW5nKHZpZXcubmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nKG1hdGNoaW5nQmluZGluZyk7XG4gICAgICAgIGlmICgobWF0Y2hpbmdCaW5kaW5nID09PSBwcmV2aW91c0JpbmRpbmcpICYmIGFuZ3VsYXIuZXF1YWxzKHByZXZpb3VzQm91bmRTdGF0ZSwgbmV3U3RhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gbWF0Y2hpbmdCaW5kaW5nO1xuICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgICAgICBQZW5kaW5nVmlld0NvdW50ZXIuaW5jcmVhc2UoKTtcblxuICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZykudGhlbihmdW5jdGlvbiAoaGFzUmVzb2x2aW5nVGVtcGxhdGUpIHtcbiAgICAgICAgICAvLyBAVE9ETzogTWFnaWMgbnVtYmVyXG4gICAgICAgICAgY29uc3QgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24gPSBoYXNSZXNvbHZpbmdUZW1wbGF0ZSA/IDMwMCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmICghdmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkYW5pbWF0ZS5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykge1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShiaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZXN0cm95VmlldyhlbGVtZW50KSB7XG4gICAgICAgIGlmICh2aWV3Q3JlYXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgZWxlbWVudC5jaGlsZHJlbigpLmVxKDApLnJlbW92ZSgpO1xuICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY3JlYXRlVmlldyhlbGVtZW50LCBiaW5kaW5nLCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgY29uc3QgdGltZVN0YXJ0ZWRNYWluVmlldyA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcpO1xuXG4gICAgICAgIGNvbnN0IG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24gPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgIGlmIChnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpICE9PSBiaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmlld0NyZWF0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgY29uc3QgcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPSBEYXRlLm5vdygpIC0gdGltZVN0YXJ0ZWRNYWluVmlldztcblxuICAgICAgICAgIGNvbnN0IGluamVjdE1haW5UZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGdpdmUgdGhlIHZpZXcgdGltZSB0byBwcm9wZXJseSBpbml0aWFsaXNlXG4gICAgICAgICAgICAgIC8vIGJlZm9yZSBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIHRoZSBpbnRpYWxWaWV3c0xvYWRlZCBldmVudFxuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSA9IE1hdGgubWF4KDAsIG1pbmltdW1EZWxheSAtIHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA8IG1pbmltdW1EZWxheSkge1xuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+IGluamVjdE1haW5UZW1wbGF0ZSgpXG4gICAgICAgICAgICAgICwgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0TWFpblRlbXBsYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUmVzb2x1dGlvbkZhaWx1cmUgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJGxvZy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgUm91dGUuc2V0Q3VycmVudEJpbmRpbmcodmlldy5uYW1lLCBiaW5kaW5nKVxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt0ZW1wbGF0ZTogJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLCBkZXBlbmRlbmNpZXM6IHJlc29sdmUoYmluZGluZyl9O1xuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24sIG9uUmVzb2x1dGlvbkZhaWx1cmUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwgfHwgIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIHJldHVybiAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKCRyb290U2NvcGUuJG5ldygpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGJpbmRpbmcuZXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5lcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ2Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgdGVtcGxhdGVGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG4gICAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgICAgYmluZGluZ0NvbXBvbmVudEZpZWxkID0gJ2Vycm9yQ29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWJpbmRpbmdbYmluZGluZ0NvbXBvbmVudEZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpO1xuICAgICAgICBjb25zdCBhcmdzID0ge2RlcGVuZGVuY2llczoge2Vycm9yfX07XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGFyZ3MudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKSB7XG4gICAgICAgIGNvbnN0IHtkZXBlbmRlbmNpZXN9ID0gYXJncztcbiAgICAgICAgY29uc3Qge3RlbXBsYXRlfSA9IGFyZ3M7XG5cbiAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0gXy5tZXJnZShkZXBlbmRlbmNpZXMsIHskc2NvcGU6IHZpZXdTY29wZSwgJGVsZW1lbnQ6IGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKX0pO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2Fscy4kc2NvcGVbY29tcG9uZW50LmNvbnRyb2xsZXJBc10gPSAkY29udHJvbGxlcihjb21wb25lbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9ICdGYWlsZWQgdG8gc2VyaWFsaXplIGVycm9yIG9iamVjdCBmb3IgbG9nZ2luZyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRsb2cuZXJyb3IoYEZhaWxlZCBpbnN0YW50aWF0aW5nIGNvbnRyb2xsZXIgZm9yIHZpZXcgJHt2aWV3fTogJHtlcnJvck1lc3NhZ2V9YCk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlID0gZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHt9KTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCBkZXBlbmRlbmN5TmFtZSBpbiBiaW5kaW5nLnJlc29sdmUpIHtcbiAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5RmFjdG9yeSA9IGJpbmRpbmcucmVzb2x2ZVtkZXBlbmRlbmN5TmFtZV07XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRpbmplY3Rvci5pbnZva2UoZGVwZW5kZW5jeUZhY3RvcnkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRxLnJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcgPSBiaW5kaW5nID0+IF8udW5pb24oYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdLCBiaW5kaW5nLndhdGNoZWRTdGF0ZSB8fCBbXSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0cmlwTmVnYXRpb25QcmVmaXgoc3RyKSB7XG4gICAgICAgIGlmIChzdHIuY2hhckF0KDApID09PSAnIScpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnN1YnN0cigxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbVZpZXcgPSB2aWV3ID0+IF8uZmxhdHRlbihfLm1hcCh2aWV3LmdldEJpbmRpbmdzKCksIGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcpKTtcblxuICAgICAgY29uc3QgZ2V0RmllbGRzVG9XYXRjaCA9IHZpZXcgPT4gXy51bmlxKF8ubWFwKGdldFN0YXRlRmllbGRzRnJvbVZpZXcodmlldyksIHN0cmlwTmVnYXRpb25QcmVmaXgpKTtcblxuICAgICAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzVG9XYXRjaCh2aWV3KTtcblxuICAgICAgcmV0dXJuIFJvdXRlLndoZW5SZWFkeSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRyeSB0byBzdGFydCB0aGUgYmFsbCByb2xsaW5nIGluIGNhc2UgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgYW5kIHdlIGNhbiBjcmVhdGUgdGhlIHZpZXcgaW1tZWRpYXRlbHlcbiAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBEb24ndCBib3RoZXIgcHV0dGluZyBpbiBhIHdhdGNoZXIgaWYgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgdGhhdCB3aWxsIGV2ZXIgdHJpZ2dlciBhIGNoYW5nZSBldmVudFxuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXRlV2F0Y2hlciA9IGZ1bmN0aW9uIChjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgaWYgKHZpZXdNYW5hZ2VtZW50UGVuZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZmluaXNoIHRoZSBkaWdlc3QgY3ljbGUgYmVmb3JlIGJ1aWxkaW5nIHRoZSB2aWV3LCB3aGljaCBzaG91bGRcbiAgICAgICAgICAvLyBwcmV2ZW50IHVzIGZyb20gcmUtcmVuZGVyaW5nIGEgdmlldyBtdWx0aXBsZSB0aW1lcyBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzIG9mIHRoZSBzYW1lIHN0YXRlIGRlcGVuZGVuY3lcbiAgICAgICAgICAvLyBnZXQgY2hhbmdlZCB3aXRoIHJlcGVhdGVkIFN0YXRlLnNldCBjYWxsc1xuICAgICAgICAgIHJldHVybiAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICByZXR1cm4gdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgU3RhdGUud2F0Y2goZmllbGRzLCBzdGF0ZVdhdGNoZXIpO1xuXG4gICAgICAgIHZpZXdEaXJlY3RpdmVTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4gU3RhdGUucmVtb3ZlV2F0Y2hlcihzdGF0ZVdhdGNoZXIpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgndmlldycsIHJvdXRlVmlld0ZhY3RvcnkpO1xuXG5jbGFzcyBQZW5kaW5nVmlld0NvdW50ZXIge1xuICBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy4kcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50O1xuICB9XG5cbiAgaW5jcmVhc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQgKz0gMTtcbiAgfVxuXG4gIGRlY3JlYXNlKCkge1xuICAgIHRoaXMuY291bnQgPSBNYXRoLm1heCgwLCB0aGlzLmNvdW50IC0gMSk7XG4gICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgIGlmICghdGhpcy5pbml0aWFsVmlld3NMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5pbml0aWFsVmlld3NMb2FkZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmN1cnJlbnRWaWV3c0xvYWRlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnUGVuZGluZ1ZpZXdDb3VudGVyJywgKCRyb290U2NvcGUpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBQZW5kaW5nVmlld0NvdW50ZXIoJHJvb3RTY29wZSk7XG59KTtcblxuY2xhc3MgV2F0Y2hhYmxlTGlzdCB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnksIGxpc3QpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG5cbiAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgIHRoaXMud2F0Y2hlcnMgPSBbXTtcbiAgfVxuXG4gIGdldChwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHBhdGgpO1xuICB9XG5cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLmxpc3Q7XG4gIH1cblxuICBnZXRTdWJzZXQocGF0aHMpIHtcbiAgICByZXR1cm4gXy56aXBPYmplY3QocGF0aHMsIF8ubWFwKHBhdGhzLCB0aGlzLmdldC5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBzZXQocGF0aCwgdmFsdWUpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlci5zZXQodGhpcy5saXN0LCBwYXRoLCB2YWx1ZSk7XG4gICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgdW5zZXQocGF0aHMpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMuT2JqZWN0SGVscGVyLnVuc2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gICAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgd2F0Y2gocGF0aHMsIGhhbmRsZXIpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMud2F0Y2hlcnMucHVzaCh0aGlzLldhdGNoZXJGYWN0b3J5LmNyZWF0ZShwYXRoLCBoYW5kbGVyLCB0aGlzLmdldChwYXRoKSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlV2F0Y2hlcih3YXRjaGVyKSB7XG4gICAgaWYgKHRoaXMud2F0Y2hlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld1dhdGNoZXJzID0gW107XG5cbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgdGhpc1dhdGNoZXIgPT4ge1xuICAgICAgaWYgKHRoaXNXYXRjaGVyLmhhbmRsZXIgIT09IHdhdGNoZXIpIHtcbiAgICAgICAgbmV3V2F0Y2hlcnMucHVzaCh0aGlzV2F0Y2hlcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy53YXRjaGVycyA9IG5ld1dhdGNoZXJzO1xuICB9XG5cbiAgX25vdGlmeVdhdGNoZXJzKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB3YXRjaGVyID0+IHtcbiAgICAgIGlmICh3YXRjaGVyLnNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCA9IHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHdhdGNoZXIud2F0Y2hQYXRoKTtcbiAgICAgICAgd2F0Y2hlci5ub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hhYmxlTGlzdEZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuICB9XG5cbiAgY3JlYXRlKGxpc3QgPSB7fSkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdCh0aGlzLk9iamVjdEhlbHBlciwgdGhpcy5XYXRjaGVyRmFjdG9yeSwgbGlzdCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGFibGVMaXN0RmFjdG9yeScsIChPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdEZhY3RvcnkoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSk7XG59KTtcblxuY2xhc3MgV2F0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy53YXRjaFBhdGggPSB3YXRjaFBhdGg7XG4gICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKGluaXRpYWxWYWx1ZSk7XG4gIH1cblxuICBfdG9rZW5pemVQYXRoKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLicpO1xuICB9XG5cbiAgc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIC8vIE5CIHNob3J0IGNpcmN1aXQgbG9naWMgaW4gdGhlIHNpbXBsZSBjYXNlXG4gICAgaWYgKHRoaXMud2F0Y2hQYXRoID09PSBjaGFuZ2VkUGF0aCkge1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh0aGlzLmN1cnJlbnRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0IHdhdGNoID0ge1xuICAgICAgcGF0aDogdGhpcy53YXRjaFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aCh0aGlzLndhdGNoUGF0aCksXG4gICAgICB2YWx1ZTogdGhpcy5jdXJyZW50VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgY2hhbmdlID0ge1xuICAgICAgcGF0aDogY2hhbmdlZFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aChjaGFuZ2VkUGF0aCksXG4gICAgICB2YWx1ZTogbmV3VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgbWluaW11bUxlbnRoID0gTWF0aC5taW4oY2hhbmdlLnRva2Vucy5sZW5ndGgsIHdhdGNoLnRva2Vucy5sZW5ndGgpO1xuICAgIGZvciAobGV0IHRva2VuSW5kZXggPSAwOyB0b2tlbkluZGV4IDwgbWluaW11bUxlbnRoOyB0b2tlbkluZGV4KyspIHtcbiAgICAgIGlmICh3YXRjaC50b2tlbnNbdG9rZW5JbmRleF0gIT09IGNoYW5nZS50b2tlbnNbdG9rZW5JbmRleF0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5CIGlmIHdlIGdldCBoZXJlIHRoZW4gYWxsIGNvbW1vbiB0b2tlbnMgbWF0Y2hcblxuICAgIGNvbnN0IGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQgPSBjaGFuZ2UudG9rZW5zLmxlbmd0aCA+IHdhdGNoLnRva2Vucy5sZW5ndGg7XG5cbiAgICBpZiAoY2hhbmdlUGF0aElzRGVzY2VuZGFudCkge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gY2hhbmdlLnRva2Vucy5zbGljZSh3YXRjaC50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoID0gXy5nZXQod2F0Y2gudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGgsIGNoYW5nZS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHdhdGNoLnRva2Vucy5zbGljZShjaGFuZ2UudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoUGF0aCA9IF8uZ2V0KGNoYW5nZS52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMod2F0Y2gudmFsdWUsIG5ld1ZhbHVlQXRXYXRjaFBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICB0aGlzLmhhbmRsZXIoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCB0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChuZXdWYWx1ZSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hlckZhY3Rvcnkge1xuICBjcmVhdGUod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoZXIod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hlckZhY3RvcnknLCAoKSA9PiB7XG4gIHJldHVybiBuZXcgV2F0Y2hlckZhY3RvcnkoKTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdSb3V0ZScsIGZ1bmN0aW9uKE9iamVjdEhlbHBlcikge1xuICBcIm5nSW5qZWN0XCI7XG4gIGNvbnN0IHRva2VucyA9IHt9O1xuICBjb25zdCB1cmxXcml0ZXJzID0gW107XG4gIGNvbnN0IHVybHMgPSBbXTtcbiAgY29uc3QgcGVyc2lzdGVudFN0YXRlcyA9IFtdO1xuICBjb25zdCByZWFkeSA9IGZhbHNlO1xuICBjb25zdCB0eXBlcyA9IHt9O1xuICBsZXQgaHRtbDVNb2RlID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvdmlkZXIgPSB7XG5cbiAgICByZWdpc3RlclR5cGUobmFtZSwgY29uZmlnKSB7XG4gICAgICB0eXBlc1tuYW1lXSA9IGNvbmZpZztcbiAgICAgIHR5cGVzW25hbWVdLnJlZ2V4ID0gbmV3IFJlZ0V4cCh0eXBlc1tuYW1lXS5yZWdleC5zb3VyY2UsICdpJyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJUeXBlIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFRva2VuKG5hbWUsIGNvbmZpZykge1xuICAgICAgdG9rZW5zW25hbWVdID0gXy5leHRlbmQoe25hbWV9LCBjb25maWcpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsVG9rZW4gfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsV3JpdGVyKG5hbWUsIGZuKSB7XG4gICAgICB1cmxXcml0ZXJzW25hbWVdID0gZm47XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxXcml0ZXIgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsKHBhdHRlcm4sIGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25zdCB1cmxEYXRhID0ge1xuICAgICAgICBjb21waWxlZFVybDogdGhpcy5fY29tcGlsZVVybFBhdHRlcm4ocGF0dGVybiwgY29uZmlnKSxcbiAgICAgICAgcGF0dGVyblxuICAgICAgfTtcblxuICAgICAgdXJscy5wdXNoKF8uZXh0ZW5kKHVybERhdGEsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBzZXRQZXJzaXN0ZW50U3RhdGVzKC4uLnN0YXRlTGlzdCkge1xuICAgICAgXy5mb3JFYWNoKHN0YXRlTGlzdCwgKHN0YXRlKSA9PiB7XG4gICAgICAgIGlmICghcGVyc2lzdGVudFN0YXRlcy5pbmNsdWRlcyhzdGF0ZSkpIHtcbiAgICAgICAgICBwZXJzaXN0ZW50U3RhdGVzLnB1c2goc3RhdGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0SHRtbDVNb2RlKG1vZGUpIHtcbiAgICAgIGh0bWw1TW9kZSA9IG1vZGU7XG4gICAgfSxcblxuICAgIF9jb21waWxlVXJsUGF0dGVybih1cmxQYXR0ZXJuLCBjb25maWcpIHtcbiAgICAgIGxldCBtYXRjaDtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHVybFBhdHRlcm4pO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2Vuc3VyZU9wdGlvbmFsVHJhaWxpbmdTbGFzaCh1cmxQYXR0ZXJuKTtcblxuICAgICAgY29uc3QgdG9rZW5SZWdleCA9IC9cXHsoW0EtWmEtelxcLl8wLTldKylcXH0vZztcbiAgICAgIGxldCB1cmxSZWdleCA9IHVybFBhdHRlcm47XG5cbiAgICAgIGlmICghY29uZmlnLnBhcnRpYWxNYXRjaCkge1xuICAgICAgICB1cmxSZWdleCA9IGBeJHt1cmxSZWdleH0kYDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG9rZW5MaXN0ID0gW107XG5cbiAgICAgIHdoaWxlICgobWF0Y2ggPSB0b2tlblJlZ2V4LmV4ZWModXJsUGF0dGVybikpICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW21hdGNoWzFdXTtcbiAgICAgICAgdG9rZW5MaXN0LnB1c2godG9rZW4pO1xuICAgICAgICB1cmxSZWdleCA9IHVybFJlZ2V4LnJlcGxhY2UobWF0Y2hbMF0sIGAoJHt0eXBlc1t0b2tlbi50eXBlXS5yZWdleC5zb3VyY2V9KWApO1xuICAgICAgfVxuXG4gICAgICB1cmxSZWdleC5yZXBsYWNlKCcuJywgJ1xcXFwuJyk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKHVybFJlZ2V4LCAnaScpLFxuICAgICAgICB0b2tlbnM6IHRva2VuTGlzdFxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2Vuc3VyZU9wdGlvbmFsVHJhaWxpbmdTbGFzaChzdHIpIHtcbiAgICAgIGlmIChzdHIubWF0Y2goL1xcLyQvKSkge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcLyQvLCAnLz8nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgJHtzdHJ9Lz9gO1xuICAgIH0sXG5cbiAgICBfZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyhzdHIpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xcKFxcKVxcKlxcK1xcP1xcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCRsb2NhdGlvbiwgJGluamVjdG9yLCAkcSkge1xuICAgICAgJ25nSW5qZWN0JztcblxuICAgICAgLy8gV2hlbiBnZXR0aW5nIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlIChvbmx5IGRvbmUgb25jZSksIHdlIG5lZWQgdG8gaXRlcmF0ZSBvdmVyIHRoZSB1cmxXcml0ZXJzIGFuZCB0dXJuXG4gICAgICAvLyB0aGVtIGludG8gbWV0aG9kcyB0aGF0IGludm9rZSB0aGUgUkVBTCB1cmxXcml0ZXIsIGJ1dCBwcm92aWRpbmcgZGVwZW5kZW5jeSBpbmplY3Rpb24gdG8gaXQsIHdoaWxlIGFsc29cbiAgICAgIC8vIGdpdmluZyBpdCB0aGUgZGF0YSB0aGF0IHRoZSBjYWxsZWUgcGFzc2VzIGluLlxuXG4gICAgICAvLyBUaGUgcmVhc29uIHdlIGhhdmUgdG8gZG8gdGhpcyBoZXJlIGlzIGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhlICRpbmplY3RvciBiYWNrIGluIHRoZSByb3V0ZVByb3ZpZGVyLlxuXG4gICAgICBfLmZvckluKHVybFdyaXRlcnMsICh3cml0ZXIsIHdyaXRlck5hbWUpID0+XG4gICAgICAgIHVybFdyaXRlcnNbd3JpdGVyTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgaWYgKCFkYXRhKSB7IGRhdGEgPSB7fTsgfVxuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IHtVcmxEYXRhOiBkYXRhfTtcbiAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmludm9rZSh3cml0ZXIsIHt9LCBsb2NhbHMpO1xuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICBsZXQgZmxhc2hTdGF0ZXMgPSBbXTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IHtcbiAgICAgICAgY3VycmVudEJpbmRpbmdzOiB7fSxcbiAgICAgICAgcmVhZHlEZWZlcnJlZDogJHEuZGVmZXIoKSxcblxuICAgICAgICBtYXRjaCh1cmxUb01hdGNoKSB7XG4gICAgICAgICAgZm9yIChjb25zdCB1cmwgb2YgQXJyYXkuZnJvbSh1cmxzKSkge1xuICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHVybC5jb21waWxlZFVybC5yZWdleC5leGVjKHVybFRvTWF0Y2gpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4ge3VybCwgcmVnZXhNYXRjaDogbWF0Y2h9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0RGF0YShtYXRjaCwgc2VhcmNoRGF0YSA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IGRlZmF1bHRzID0gdGhpcy5leHRyYWN0RGVmYXVsdERhdGEobWF0Y2gpO1xuICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmV4dHJhY3RQYXRoRGF0YShtYXRjaCk7XG4gICAgICAgICAgc2VhcmNoRGF0YSA9IHRoaXMuZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdEhlbHBlci5kZWZhdWx0KHNlYXJjaERhdGEsIHBhdGgsIGRlZmF1bHRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKSB7XG4gICAgICAgICAgaWYgKCFzZWFyY2hEYXRhKSB7IHNlYXJjaERhdGEgPSAkbG9jYXRpb24uc2VhcmNoKCk7IH1cbiAgICAgICAgICBjb25zdCBkYXRhID0gXy5jbG9uZShzZWFyY2hEYXRhKTtcbiAgICAgICAgICBjb25zdCBuZXdEYXRhID0ge307XG5cbiAgICAgICAgICBfLmZvckVhY2goZGF0YSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRLZXkgPSBfLmZpbmRLZXkodG9rZW5zLCB7IHNlYXJjaEFsaWFzOiBrZXkgfSk7XG4gICAgICAgICAgICBpZiAoIXRhcmdldEtleSkgeyB0YXJnZXRLZXkgPSBrZXk7IH1cblxuICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlTmFtZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gXy5nZXQodG9rZW5zW3RhcmdldEtleV0sICd0eXBlJykgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoIXRva2Vuc1t0YXJnZXRLZXldIHx8ICh0eXBlc1t0b2tlblR5cGVOYW1lXS5yZWdleC50ZXN0KHZhbHVlKSkpIHtcblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblR5cGUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnR5cGUgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHR5cGVUb2tlblR5cGUgPSB0b2tlblR5cGUgPyB0eXBlc1t0b2tlblR5cGVdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0b2tlblR5cGVQYXJzZWQgPSB0eXBlVG9rZW5UeXBlID8gdHlwZVRva2VuVHlwZS5wYXJzZXIgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgaWYgKHRva2VuVHlwZVBhcnNlZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0b2tlblR5cGVQYXJzZWQsIG51bGwsIHt0b2tlbjogdmFsdWV9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS5zdGF0ZVBhdGggOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IGRhdGFLZXkgPSB0b2tlblRhcmdldEtleVN0YXRlUGF0aCB8fCB0YXJnZXRLZXk7XG5cbiAgICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChuZXdEYXRhLCBkYXRhS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0RGVmYXVsdERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICAgICAgICBfLmZvckVhY2gobWF0Y2gudXJsLnN0YXRlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCBrZXksICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnID8gXy5jbG9uZURlZXAodmFsdWUpIDogdmFsdWUpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RQYXRoRGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgICBjb25zdCBwYXRoVG9rZW5zID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2VucztcblxuICAgICAgICAgIGlmIChwYXRoVG9rZW5zLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4ge307IH1cblxuICAgICAgICAgIGZvciAobGV0IG4gPSAwLCBlbmQgPSBwYXRoVG9rZW5zLmxlbmd0aC0xLCBhc2MgPSAwIDw9IGVuZDsgYXNjID8gbiA8PSBlbmQgOiBuID49IGVuZDsgYXNjID8gbisrIDogbi0tKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnNbbl07XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBtYXRjaC5yZWdleE1hdGNoW24rMV07XG5cbiAgICAgICAgICAgIGlmICh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIpIHsgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlciwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pOyB9XG5cbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwgKHRva2VuLnN0YXRlUGF0aCB8fCB0b2tlbi5uYW1lKSwgdmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcnMoKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVyKG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbnZva2VVcmxXcml0ZXIobmFtZSwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV0oZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ28obmFtZSwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgcmV0dXJuICRsb2NhdGlvbi51cmwodGhpcy5pbnZva2VVcmxXcml0ZXIobmFtZSwgZGF0YSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFBlcnNpc3RlbnRTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIHBlcnNpc3RlbnRTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZEZsYXNoU3RhdGVzKC4uLm5ld1N0YXRlcykge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gZmxhc2hTdGF0ZXMuY29uY2F0KG5ld1N0YXRlcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIGZsYXNoU3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lLCBiaW5kaW5nKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdID0gYmluZGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVsZXRlQ3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1hdGNoZXNDdXJyZW50QmluZGluZ05hbWUodmlld05hbWUsIGJpbmRpbmdOYW1lRXhwcmVzc2lvbikge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRCaW5kaW5nID0gdGhpcy5nZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSlcblxuICAgICAgICAgIGlmICghY3VycmVudEJpbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBiaW5kaW5nTmFtZUV4cHJlc3Npb24gaW5zdGFuY2VvZiBSZWdFeHAgP1xuICAgICAgICAgICAgYmluZGluZ05hbWVFeHByZXNzaW9uLnRlc3QoY3VycmVudEJpbmRpbmcubmFtZSkgOlxuICAgICAgICAgICAgY3VycmVudEJpbmRpbmcubmFtZSA9PT0gYmluZGluZ05hbWVFeHByZXNzaW9uO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFJlYWR5KHJlYWR5KSB7XG4gICAgICAgICAgaWYgKCFyZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5yZWFkeURlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWFkeURlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlYWR5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzUmVhZHkoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlYWR5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzSHRtbDVNb2RlRW5hYmxlZCgpIHtcbiAgICAgICAgICByZXR1cm4gaHRtbDVNb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdoZW5SZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkeURlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH1cbiAgfTtcblxuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ251bWVyaWMnLCB7cmVnZXg6IC9cXGQrLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gcGFyc2VJbnQodG9rZW4pXX0pO1xuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ2FscGhhJywge3JlZ2V4OiAvW2EtekEtWl0rL30pO1xuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ2FueScsIHtyZWdleDogLy4rL30pO1xuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ2xpc3QnLCB7cmVnZXg6IC8uKy8sIHBhcnNlcjogWyd0b2tlbicsIHRva2VuID0+IHRva2VuLnNwbGl0KCcsJyldfSk7XG5cbiAgcmV0dXJuIHByb3ZpZGVyO1xufSk7XG5cbmNsYXNzIFN0YXRlUHJvdmlkZXIge1xuICAkZ2V0KFdhdGNoYWJsZUxpc3RGYWN0b3J5KSB7XG4gICAgJ25nSW5qZWN0JztcbiAgICByZXR1cm4gV2F0Y2hhYmxlTGlzdEZhY3RvcnkuY3JlYXRlKCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignU3RhdGUnLCBuZXcgU3RhdGVQcm92aWRlcik7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1ZpZXdCaW5kaW5ncycsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3Qgdmlld3MgPSBbXTtcblxuICBjbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBiaW5kaW5ncykge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICAgIGlmICghKHRoaXMuYmluZGluZ3MgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IFt0aGlzLmJpbmRpbmdzXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRCaW5kaW5ncygpIHtcbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICBiaW5kKG5hbWUsIGNvbmZpZykge1xuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vblJlcXVpcmVkU3RhdGUoYmluZGluZ3MsIGNvbW1vblJlcXVpcmVkU3RhdGUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGlmICghKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgYmluZGluZy5yZXF1aXJlZFN0YXRlID0gW2JpbmRpbmcucmVxdWlyZWRTdGF0ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZS5jb25jYXQoY29tbW9uUmVxdWlyZWRTdGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVzb2x2ZShiaW5kaW5ncywgY29tbW9uUmVzb2x2ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoJ3Jlc29sdmUnIGluIGJpbmRpbmcpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlc29sdmUgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goXy5kZWZhdWx0cyhiaW5kaW5nLnJlc29sdmUsIGNvbW1vblJlc29sdmUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vbkZpZWxkcyhuZXdCaW5kaW5ncykge1xuICAgICAgICBjb25zdCBiYXNpY0NvbW1vbkZpZWxkcyA9IFtcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yQ29tcG9uZW50Jywgb3ZlcnJpZGVGaWVsZDogJ2Vycm9yQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25FcnJvclRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ2Vycm9yVGVtcGxhdGVVcmwnfVxuICAgICAgICBdO1xuXG4gICAgICAgIGZvciAoY29uc3QgY29tbW9uRmllbGQgb2YgQXJyYXkuZnJvbShiYXNpY0NvbW1vbkZpZWxkcykpIHtcbiAgICAgICAgICBpZiAoY29tbW9uRmllbGQubmFtZSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIGRlZmF1bHRCaW5kaW5nRmllbGQobmV3QmluZGluZ3MsIGNvbW1vbkZpZWxkLm92ZXJyaWRlRmllbGQsIGNvbmZpZ1tjb21tb25GaWVsZC5uYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXF1aXJlZFN0YXRlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICBhcHBseUNvbW1vblJlcXVpcmVkU3RhdGUobmV3QmluZGluZ3MsIGNvbmZpZ1snY29tbW9uUmVxdWlyZWRTdGF0ZSddKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29tbW9uUmVzb2x2ZScgaW4gY29uZmlnKSB7XG4gICAgICAgICAgcmV0dXJuIGFwcGx5Q29tbW9uUmVzb2x2ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXNvbHZlJ10pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlZmF1bHRCaW5kaW5nRmllbGQoYmluZGluZ3MsIGZpZWxkTmFtZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBsZXQgaXRlbTtcbiAgICAgICAgICBpZiAoIShmaWVsZE5hbWUgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBiaW5kaW5nW2ZpZWxkTmFtZV0gPSBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGxldCBuZXdCaW5kaW5ncyA9IFtdO1xuICAgICAgaWYgKCdiaW5kaW5ncycgaW4gY29uZmlnKSB7XG4gICAgICAgIG5ld0JpbmRpbmdzID0gY29uZmlnWydiaW5kaW5ncyddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSAoY29uZmlnIGluc3RhbmNlb2YgQXJyYXkpID8gY29uZmlnIDogW2NvbmZpZ107XG4gICAgICB9XG5cbiAgICAgIGlmICghKG5ld0JpbmRpbmdzLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjYWxsIHRvIFZpZXdCaW5kaW5nc1Byb3ZpZGVyLmJpbmQgZm9yIG5hbWUgJyR7bmFtZX0nYCk7XG4gICAgICB9XG5cbiAgICAgIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKTtcbiAgICAgIHJldHVybiB2aWV3c1tuYW1lXSA9IG5ldyBWaWV3KG5hbWUsIG5ld0JpbmRpbmdzKTtcbiAgICB9LFxuXG4gICAgJGdldCgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldFZpZXcodmlldykge1xuICAgICAgICAgIHJldHVybiB2aWV3c1t2aWV3XTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59KTtcbiJdfQ==
