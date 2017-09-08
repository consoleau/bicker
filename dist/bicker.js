(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

routeViewFactory.$inject = ["$log", "$compile", "$controller", "ViewBindings", "$q", "State", "$rootScope", "$animate", "$timeout", "$injector", "PendingViewCounter", "$templateRequest", "Route"];
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
      var reloading = false;

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
          return $q.resolve();
        }

        var newState = getStateDataForBinding(matchingBinding);

        if (!reloading && matchingBinding === previousBinding && angular.equals(previousBoundState, newState)) {
          return $q.resolve();
        }

        console.log('reloading state = ', reloading);

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

        var reload = function reload() {
          if (viewManagementPending) {
            return;
          }

          viewManagementPending = true;

          // Wrapped in a timeout so that we can finish the digest cycle before building the view, which should
          // prevent us from re-rendering a view multiple times if multiple properties of the same state dependency
          // get changed with repeated State.set calls
          return $timeout(function () {
            manageView(iElement, bindings).finally(function () {
              reloading = false;
              viewManagementPending = false;
            });
          });
        };

        State.watch(fields, reload);

        var deregisterForcedReloadListener = $rootScope.$on('bicker_router.forcedReload', function () {
          reloading = true;
          reload();
        });

        viewDirectiveScope.$on('$destroy', function () {
          State.removeWatcher(reload);
          deregisterForcedReloadListener();
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
    $get: ["$location", "$injector", "$q", "$rootScope", function $get($location, $injector, $q, $rootScope) {
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
          var forceReload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

          var currentUrl = $location.url();
          var newUrl = this.invokeUrlWriter(name, data);

          if (currentUrl !== newUrl) {
            return $location.url(newUrl);
          }

          if (forceReload) {
            this.reload();
          }
        },
        reload: function reload() {
          $rootScope.$emit('bicker_router.forcedReload');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWlCLENBQWhDLEFBQWdDLEFBQUMsY0FBakMsQUFBK0Msd0ZBQUksVUFBQSxBQUFVLE9BQVYsQUFBaUIsT0FBakIsQUFBd0IsV0FBeEIsQUFBbUMsWUFBbkMsQUFBK0MsY0FBL0MsQUFBNkQsb0JBQW9CLEFBQ2xJO0FBRUE7O01BQUksU0FBSixBQUFhLEFBQ2I7YUFBQSxBQUFXLElBQVgsQUFBZSx3QkFBd0IsWUFBWSxBQUNqRDtRQUFJLE1BQUosQUFBSSxBQUFNLFdBQVcsQUFDbkI7WUFBQSxBQUFNLFNBQU4sQUFBZSxBQUNoQjtBQUNGO0FBSkQsQUFNQTs7YUFBQSxBQUFXLElBQVgsQUFBZSwwQkFBMEIsVUFBQSxBQUFVLEdBQVYsQUFBYSxRQUFRLEFBQzVEO0FBQ0E7UUFBSSxZQUFKLEFBRUE7O1FBQUksV0FBSixBQUFlLFFBQVEsQUFDckI7QUFDRDtBQUVEOzthQUFBLEFBQVMsQUFFVDs7dUJBQUEsQUFBbUIsQUFDbkI7UUFBTSxRQUFRLE1BQUEsQUFBTSxNQUFNLFVBQTFCLEFBQWMsQUFBWSxBQUFVLEFBRXBDOztRQUFJLENBQUosQUFBSyxPQUFPLEFBQ1Y7YUFBQSxBQUFPLEFBQ1I7QUFGRCxXQUVPLEFBQ0w7YUFBTyxNQUFBLEFBQU0sWUFBYixBQUFPLEFBQWtCLEFBQzFCO0FBRUQ7O1FBQUksZ0JBQWdCLGFBQUEsQUFBYSxNQUFNLE1BQW5CLEFBQXlCLE1BQTdDLEFBQW9CLEFBQStCLEFBQ25EO29CQUFnQixFQUFBLEFBQUUsV0FBRixBQUFhLGVBQWUsTUFBQSxBQUFNLHNCQUFOLEFBQTRCLE9BQU8sTUFBL0UsQUFBZ0IsQUFBNEIsQUFBbUMsQUFBTSxBQUVyRjs7UUFBTSxZQUFZLEVBQUMsV0FBRCxBQUFZLGVBQWUsU0FBN0MsQUFBa0IsQUFBb0MsQUFFdEQ7O2VBQUEsQUFBVyxNQUFYLEFBQWlCLG1DQUFqQixBQUFvRCxBQUVwRDs7UUFBSyxVQUFELEFBQVcsVUFBWCxBQUFzQixXQUExQixBQUFxQyxHQUFHLEFBQ3RDO1lBQUEsQUFBTSxNQUFNLFVBQVosQUFBc0IsQUFDdkI7QUFFRDs7TUFBQSxBQUFFLFFBQVEsVUFBVixBQUFvQixTQUFTLFVBQUEsQUFBQyxPQUFELEFBQVEsS0FBUSxBQUMzQztZQUFBLEFBQU0sSUFBTixBQUFVLEtBQVYsQUFBZSxBQUNoQjtBQUZELEFBSUE7O1VBQUEsQUFBTSxBQUNOO1VBQUEsQUFBTSxTQUFOLEFBQWUsQUFDaEI7QUFwQ0QsQUFxQ0Q7QUEvQ0Q7O0FBaURBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWYsQUFBZ0MsU0FBaEMsQUFBeUM7QUFBZ0Isb0JBQUEsQUFDbkQsUUFEbUQsQUFDM0MsTUFBTSxBQUNoQjtRQUFJLFNBQUosQUFBYSxJQUFJLEFBQUU7YUFBQSxBQUFPLEFBQVM7QUFDbkM7UUFBTSxTQUFTLEtBQUEsQUFBSyxNQUFwQixBQUFlLEFBQVcsQUFDMUI7UUFBTSxNQUFNLE9BQVosQUFBWSxBQUFPLEFBQ25CO1FBQUksU0FKWSxBQUloQixBQUFhOztvQ0FKRzs0QkFBQTt5QkFBQTs7UUFNaEI7MkJBQUEsQUFBc0Isb0lBQVE7WUFBbkIsQUFBbUIsZ0JBQzVCOztpQkFBUyxPQUFULEFBQVMsQUFBTyxBQUNoQjtZQUFJLFdBQUosQUFBZSxXQUFXLEFBQUU7aUJBQUEsQUFBTyxBQUFZO0FBQ2hEO0FBVGU7a0JBQUE7MEJBQUE7dUJBQUE7Y0FBQTtVQUFBOzREQUFBO29CQUFBO0FBQUE7Z0JBQUE7K0JBQUE7Z0JBQUE7QUFBQTtBQUFBO0FBV2hCOztXQUFPLE9BQVAsQUFBTyxBQUFPLEFBQ2Y7QUFic0QsQUFldkQ7QUFmdUQsb0JBQUEsQUFlbkQsUUFmbUQsQUFlM0MsTUFmMkMsQUFlckMsT0FBTyxBQUN2QjtRQUFNLFNBQVMsS0FBQSxBQUFLLE1BQXBCLEFBQWUsQUFBVyxBQUMxQjtRQUFNLE1BQU0sT0FBWixBQUFZLEFBQU8sQUFDbkI7UUFBSSxTQUhtQixBQUd2QixBQUFhOztxQ0FIVTs2QkFBQTswQkFBQTs7UUFLdkI7NEJBQUEsQUFBc0IseUlBQVE7WUFBbkIsQUFBbUIsaUJBQzVCOztZQUFJLE9BQUEsQUFBTyxhQUFYLEFBQXdCLFdBQVcsQUFDakM7aUJBQUEsQUFBTyxXQUFQLEFBQWtCLEFBQ25CO0FBRUQ7O2lCQUFTLE9BQVQsQUFBUyxBQUFPLEFBQ2pCO0FBWHNCO2tCQUFBOzJCQUFBO3dCQUFBO2NBQUE7VUFBQTs4REFBQTtxQkFBQTtBQUFBO2dCQUFBO2dDQUFBO2dCQUFBO0FBQUE7QUFBQTtBQWF2Qjs7V0FBTyxPQUFBLEFBQU8sT0FBZCxBQUFxQixBQUN0QjtBQTdCc0QsQUErQnZEO0FBL0J1RCx3QkFBQSxBQStCakQsUUEvQmlELEFBK0J6QyxNQUFNLEFBQ2xCO1FBQUksU0FBSixBQUFhLElBQUksQUFBRTthQUFBLEFBQU8sQUFBUztBQUNuQztRQUFNLFNBQVMsS0FBQSxBQUFLLE1BQXBCLEFBQWUsQUFBVyxBQUMxQjtRQUFNLE1BQU0sT0FBWixBQUFZLEFBQU8sQUFDbkI7UUFBSSxTQUpjLEFBSWxCLEFBQWE7O3FDQUpLOzZCQUFBOzBCQUFBOztRQU1sQjs0QkFBQSxBQUFzQix5SUFBUTtZQUFuQixBQUFtQixpQkFDNUI7O2lCQUFTLE9BQVQsQUFBUyxBQUFPLEFBQ2hCO1lBQUksV0FBSixBQUFlLFdBQVcsQUFBRTtpQkFBQSxBQUFPLEFBQVE7QUFDNUM7QUFUaUI7a0JBQUE7MkJBQUE7d0JBQUE7Y0FBQTtVQUFBOzhEQUFBO3FCQUFBO0FBQUE7Z0JBQUE7Z0NBQUE7Z0JBQUE7QUFBQTtBQUFBO0FBV2xCOztRQUFJLE9BQUEsQUFBTyxTQUFYLEFBQW9CLFdBQVcsQUFBRTthQUFBLEFBQU8sQUFBUTtBQUNoRDtXQUFPLE9BQVAsQUFBTyxBQUFPLEFBQ2Q7V0FBQSxBQUFPLEFBQ1I7QUE3Q3NELEFBK0N2RDs7QUFDQTtBQWhEdUQsd0JBQUEsQUFnRGpELEdBaERpRCxBQWdEOUMsR0FBZ0I7UUFBYixBQUFhLDZFQUFKLEFBQUksQUFDdkI7O1FBQUksUUFBSixBQUFZLEFBQ1o7YUFBUyxPQUFBLEFBQU8sU0FBUCxBQUFnQixJQUFoQixBQUF1QixlQUZULEFBRXZCLEFBQTRDOztxQ0FGckI7NkJBQUE7MEJBQUE7O1FBSXZCOzRCQUFrQixNQUFBLEFBQU0sS0FBSyxPQUFBLEFBQU8sS0FBcEMsQUFBa0IsQUFBVyxBQUFZLHNJQUFLO1lBQW5DLEFBQW1DLGFBQzVDOztZQUFNLGdCQUFBLEFBQWMsU0FBcEIsQUFBNkIsQUFFN0I7O1lBQUksRUFBQSxBQUFFLFNBQU4sQUFBZSxXQUFXLEFBQ3hCO2dCQUFBLEFBQU0sS0FBTixBQUFXLEFBRVo7QUFIRCxlQUdPLElBQUssUUFBTyxFQUFQLEFBQU8sQUFBRSxVQUFWLEFBQW1CLFlBQWMsRUFBRSxFQUFBLEFBQUUsZ0JBQXpDLEFBQXFDLEFBQW9CLFFBQVMsQUFDdkU7a0JBQVEsTUFBQSxBQUFNLE9BQU8sS0FBQSxBQUFLLE1BQU0sRUFBWCxBQUFXLEFBQUUsTUFBTSxFQUFuQixBQUFtQixBQUFFLE1BQTFDLEFBQVEsQUFBYSxBQUEyQixBQUNqRDtBQUNGO0FBYnNCO2tCQUFBOzJCQUFBO3dCQUFBO2NBQUE7VUFBQTs4REFBQTtxQkFBQTtBQUFBO2dCQUFBO2dDQUFBO2dCQUFBO0FBQUE7QUFBQTtBQWV2Qjs7V0FBQSxBQUFPLEFBQ1I7QUFoRXNELEFBa0V2RDtBQWxFdUQsNkJBQUEsQUFrRS9DLFdBQTJCLEFBQ2pDO1FBQUksa0JBQUo7UUFBZ0IsYUFBaEIsQUFDQTtRQUFNLFNBRjJCLEFBRWpDLEFBQWU7O3NDQUZLLEFBQWEsNkVBQWI7QUFBYSx3Q0FBQTtBQUlqQzs7UUFBSSxZQUFBLEFBQVksV0FBaEIsQUFBMkIsR0FBRyxBQUM1QjttQkFBYSxZQUFiLEFBQWEsQUFBWSxBQUMxQjtBQUZELFdBRU8sQUFDTDttQkFBYSxLQUFBLEFBQUssdUNBQVcsTUFBQSxBQUFNLEtBQUssZUFBeEMsQUFBYSxBQUFnQixBQUEwQixBQUN4RDtBQUVEOztTQUFLLElBQUwsQUFBVyxPQUFYLEFBQWtCLFlBQVksQUFDNUI7Y0FBUSxXQUFSLEFBQVEsQUFBVyxBQUNuQjtVQUFJLGlCQUFKLEFBQXFCLE9BQU8sQUFDMUI7ZUFBQSxBQUFPLE9BQU8sVUFBQSxBQUFVLFFBQXhCLEFBQWdDLEFBQ2pDO0FBRkQsaUJBRVksUUFBQSxBQUFPLDhDQUFQLEFBQU8sWUFBUixBQUFrQixZQUFjLFFBQU8sVUFBUCxBQUFPLEFBQVUsVUFBckQsQUFBOEQsVUFBVyxBQUM5RTtlQUFBLEFBQU8sT0FBTyxLQUFBLEFBQUssUUFBUSxVQUFiLEFBQWEsQUFBVSxNQUFyQyxBQUFjLEFBQTZCLEFBQzVDO0FBRk0sT0FBQSxNQUVBLEFBQ0w7ZUFBQSxBQUFPLE9BQU8sVUFBQSxBQUFVLFFBQXhCLEFBQWdDLEFBQ2pDO0FBQ0Y7QUFFRDs7U0FBSyxJQUFMLEFBQVcsU0FBWCxBQUFrQixXQUFXLEFBQzNCO2NBQVEsVUFBUixBQUFRLEFBQVUsQUFDbEI7YUFBQSxBQUFPLFNBQU8sT0FBQSxBQUFPLFVBQXJCLEFBQTZCLEFBQzlCO0FBRUQ7O1dBQUEsQUFBTyxBQUNSO0FBN0ZILEFBQXlEO0FBQUEsQUFDdkQ7O0FBZ0dGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQUEsQUFBUyxrQkFBVCxBQUEyQixPQUFPLEFBQ2hDO0FBQ0E7OztjQUFPLEFBQ0ssQUFDVjtBQUZLLHdCQUFBLEFBRUMsT0FGRCxBQUVRLFVBRlIsQUFFa0IsUUFBUSxBQUM3QjtZQUFBLEFBQU0sT0FBTyxZQUFNLEFBQ2pCO1lBQU0sdUJBQXVCLE1BQUEsQUFBTSxNQUFNLE9BQXpDLEFBQTZCLEFBQVksQUFBTyxBQUVoRDs7WUFBSSxDQUFDLE1BQUEsQUFBTSwwQkFBMEIscUJBQWhDLEFBQXFELFVBQVUscUJBQXBFLEFBQUssQUFBb0YsY0FBYyxBQUNyRztjQUFJLFNBQUEsQUFBUyxTQUFTLHFCQUF0QixBQUFJLEFBQXVDLFlBQVksQUFDckQ7cUJBQUEsQUFBUyxZQUFZLHFCQUFyQixBQUEwQyxBQUMzQztBQUNGO0FBSkQsZUFJTyxBQUNMO2NBQUksQ0FBQyxTQUFBLEFBQVMsU0FBUyxxQkFBdkIsQUFBSyxBQUF1QyxZQUFZLEFBQ3REO3FCQUFBLEFBQVMsU0FBUyxxQkFBbEIsQUFBdUMsQUFDeEM7QUFDRjtBQUNGO0FBWkQsQUFhRDtBQWhCSCxBQUFPLEFBa0JSO0FBbEJRLEFBQ0w7OztBQW1CSixRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFVBQWhDLEFBQTBDLGNBQTFDLEFBQXdEOztBQUV4RCxTQUFBLEFBQVMsaUJBQVQsQUFBMkIsT0FBM0IsQUFBa0MsV0FBbEMsQUFBNkMsVUFBVSxBQUNyRDtBQUVBOzs7Y0FBTyxBQUNLLEFBQ1Y7V0FGSyxBQUVFLEFBQ1A7QUFISyx3QkFBQSxBQUdDLE9BSEQsQUFHUSxVQUhSLEFBR2tCLFFBQVEsQUFDN0I7VUFBSSxPQUFBLEFBQU8sZUFBUCxBQUFzQixhQUFhLE1BQXZDLEFBQXVDLEFBQU0sc0JBQXNCLEFBQ2pFO2lCQUFBLEFBQVMsTUFBTSxVQUFBLEFBQUMsT0FBVSxBQUN0QjtnQkFBQSxBQUFNLEFBQ047Y0FBTSxVQUFVLFNBQUEsQUFBUyxLQUFULEFBQWMsUUFBZCxBQUFzQixRQUF0QixBQUE4QixNQUE5QyxBQUFnQixBQUFvQyxBQUNwRDswQkFBZ0IsWUFBQTttQkFBTSxVQUFBLEFBQVUsSUFBaEIsQUFBTSxBQUFjO0FBQXBDLEFBQU8sQUFDVixXQURVO0FBSFgsQUFLRDtBQUVEOztVQUFNLFNBQVMsTUFBZixBQUFlLEFBQU0sQUFDckI7V0FBSyxJQUFMLEFBQVcsY0FBWCxBQUF5QixRQUFRLEFBQy9CO1lBQU0sU0FBUyxPQUFmLEFBQWUsQUFBTyxBQUN0QjtjQUFBLEFBQVMsNEJBQVQsQUFBa0MsQUFDbkM7QUFFRDs7bUJBQU8sQUFBTSxPQUFPLE9BQWIsQUFBb0IsV0FBVyxVQUFBLEFBQUMsUUFBVyxBQUNoRDtZQUFJLFdBQUosQUFDQTtZQUFJLE1BQUosQUFBSSxBQUFNLHNCQUFzQixBQUM5QjtnQkFBQSxBQUFNLEFBQ1A7QUFGRCxlQUVPLEFBQ0w7c0JBQUEsQUFBVSxBQUNYO0FBQ0Q7ZUFBTyxTQUFBLEFBQVMsS0FBVCxBQUFjLFFBQXJCLEFBQU8sQUFBc0IsQUFDOUI7QUFSRCxBQUFPLEFBU1IsT0FUUTtBQWxCWCxBQUFPLEFBNkJSO0FBN0JRLEFBQ0w7OztBQThCSixRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFVBQWhDLEFBQTBDLGFBQTFDLEFBQXVEOztBQUV2RDtBQUNBOztBQUVBLFNBQUEsQUFBUyxpQkFBVCxBQUEwQixNQUExQixBQUFnQyxVQUFoQyxBQUEwQyxhQUExQyxBQUF1RCxjQUF2RCxBQUFxRSxJQUFyRSxBQUF5RSxPQUF6RSxBQUFnRixZQUFoRixBQUE0RixVQUE1RixBQUFzRyxVQUF0RyxBQUFnSCxXQUFoSCxBQUEySCxvQkFBM0gsQUFBK0ksa0JBQS9JLEFBQWlLLE9BQU8sQUFDdEs7QUFDQTs7O2NBQU8sQUFDSyxBQUNWO1dBRkssQUFFRSxBQUNQO2FBSEssQUFHSSxBQUNUO2NBSkssQUFJSyxBQUNWO0FBTEssd0JBQUEsQUFLQyxvQkFMRCxBQUtxQixVQUxyQixBQUsrQixRQUFRLEFBQzFDO1VBQUksY0FBSixBQUFrQixBQUNsQjtVQUFJLFlBQUosQUFBZ0IsQUFDaEI7VUFBSSx3QkFBSixBQUE0QixBQUM1QjtVQUFNLE9BQU8sYUFBQSxBQUFhLFFBQVEsT0FBbEMsQUFBYSxBQUE0QixBQUN6QztVQUFNLFdBQVcsS0FBakIsQUFBaUIsQUFBSyxBQUN0QjtVQUFJLFlBQUosQUFBZ0IsQUFFaEI7O2VBQUEsQUFBUyxTQUFULEFBQWtCLEFBRWxCOztVQUFJLHFCQUFKLEFBQXlCLEFBQ3pCO1VBQUksa0JBQUosQUFBc0IsQUFFdEI7O1VBQU0seUJBQXlCLFNBQXpCLEFBQXlCLGdDQUFBO2VBQVcsRUFBQSxBQUFFLFVBQVUsTUFBQSxBQUFNLFVBQVUsMEJBQXZDLEFBQVcsQUFBWSxBQUFnQixBQUEwQjtBQUFoRyxBQUVBOztlQUFBLEFBQVMsd0JBQVQsQUFBaUMsU0FBakMsQUFBMEMsT0FBTyxBQUMvQztZQUFJLENBQUosQUFBSyxPQUFPLEFBQ1Y7a0JBQUEsQUFBUSxBQUNUO0FBQ0Q7WUFBTSxTQUFTLFFBQUEsQUFBUSxTQUFTLFVBQUEsQUFBVSxJQUFPLFFBQWpCLEFBQWlCLEFBQVEsc0JBQTFDLEFBQWlCLEFBQTRDLEtBQTVFLEFBQWlGLEFBQ2pGO2VBQU8sRUFBQSxBQUFFLFNBQVMsRUFBQSxBQUFFLEtBQUYsQUFBTyxRQUFRLENBQUEsQUFBQyxjQUFELEFBQWUsZUFBekMsQUFBVyxBQUFlLEFBQThCLGtCQUFrQixFQUFDLGNBQWxGLEFBQU8sQUFBMEUsQUFBZSxBQUNqRztBQUVEOztlQUFBLEFBQVMsZ0JBQVQsQUFBeUIsU0FBUyxBQUNoQztZQUFNLGdCQUFnQixRQUFBLEFBQVEsaUJBREUsQUFDaEMsQUFBK0M7O3lDQURmO2lDQUFBOzhCQUFBOztZQUdoQztnQ0FBd0IsTUFBQSxBQUFNLEtBQTlCLEFBQXdCLEFBQVcsaUpBQWdCO2dCQUExQyxBQUEwQyxxQkFDakQ7O2dCQUFJLGVBQUosQUFBbUIsQUFDbkI7Z0JBQUksUUFBUSxZQUFBLEFBQVksT0FBeEIsQUFBWSxBQUFtQixJQUFJLEFBQ2pDOzRCQUFjLFlBQUEsQUFBWSxNQUExQixBQUFjLEFBQWtCLEFBQ2hDOzZCQUFBLEFBQWUsQUFDaEI7QUFFRDs7Z0JBQUksVUFBVSxNQUFBLEFBQU0sSUFBcEIsQUFBYyxBQUFVLEFBRXhCOztBQUNBO2dCQUFLLFlBQUwsQUFBaUIsTUFBTyxBQUN0QjtxQkFBQSxBQUFPLEFBQ1I7QUFFRDs7QUFDQTtnQkFBQSxBQUFJLGNBQWMsQUFDaEI7d0JBQVUsQ0FBVixBQUFXLEFBQ1o7QUFDRDtnQkFBSSxDQUFKLEFBQUssU0FBUyxBQUNaO3FCQUFBLEFBQU8sQUFDUjtBQUNGO0FBeEIrQjtzQkFBQTsrQkFBQTs0QkFBQTtrQkFBQTtjQUFBO2tFQUFBO3lCQUFBO0FBQUE7b0JBQUE7b0NBQUE7b0JBQUE7QUFBQTtBQUFBO0FBMEJoQzs7WUFBSSxRQUFKLEFBQVksYUFBYSxBQUN2QjtjQUFJLENBQUMsVUFBQSxBQUFVLE9BQU8sUUFBdEIsQUFBSyxBQUF5QixjQUFjLEFBQzFDO21CQUFBLEFBQU8sQUFDUjtBQUNGO0FBRUQ7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O2VBQUEsQUFBUyxXQUFULEFBQW9CLFNBQXBCLEFBQTZCLFVBQVUsQUFDckM7WUFBTSxrQkFBa0IsbUJBQXhCLEFBQXdCLEFBQW1CLEFBRTNDOztZQUFJLENBQUosQUFBSyxpQkFBaUIsQUFDcEI7Y0FBQSxBQUFJLGFBQWEsQUFDZjtxQkFBQSxBQUFTLFNBQVQsQUFBa0IsU0FBbEIsQUFBMkIsV0FBM0IsQUFBc0MsS0FBSyxZQUFNLEFBQy9DO3FCQUFPLFlBQVAsQUFBTyxBQUFZLEFBQ3BCO0FBRkQsQUFHQTtpQ0FBQSxBQUFxQixBQUNyQjs4QkFBQSxBQUFrQixBQUNsQjtrQkFBQSxBQUFNLHFCQUFxQixLQUEzQixBQUFnQyxBQUNqQztBQUNEO2lCQUFPLEdBQVAsQUFBTyxBQUFHLEFBQ1g7QUFFRDs7WUFBTSxXQUFXLHVCQUFqQixBQUFpQixBQUF1QixBQUV4Qzs7WUFBSSxDQUFBLEFBQUMsYUFBYyxvQkFBZixBQUFtQyxtQkFBb0IsUUFBQSxBQUFRLE9BQVIsQUFBZSxvQkFBMUUsQUFBMkQsQUFBbUMsV0FBVyxBQUN2RztpQkFBTyxHQUFQLEFBQU8sQUFBRyxBQUNYO0FBRUQ7O2dCQUFBLEFBQVEsSUFBUixBQUFZLHNCQUFaLEFBQWtDLEFBRWxDOzswQkFBQSxBQUFrQixBQUNsQjs2QkFBQSxBQUFxQixBQUVyQjs7MkJBQUEsQUFBbUIsQUFFbkI7O3FDQUFPLEFBQXNCLFNBQXRCLEFBQStCLGlCQUEvQixBQUFnRCxLQUFLLFVBQUEsQUFBVSxzQkFBc0IsQUFDMUY7QUFDQTtjQUFNLGdDQUFnQyx1QkFBQSxBQUF1QixNQUE3RCxBQUFtRSxBQUVuRTs7Y0FBSSxDQUFKLEFBQUssYUFBYSxBQUNoQjs0QkFBTyxBQUFTLFlBQVQsQUFBcUIsU0FBckIsQUFBOEIsV0FBOUIsQUFBeUMsS0FBSyxZQUFNLEFBQ3pEO3FCQUFPLFdBQUEsQUFBVyxTQUFYLEFBQW9CLGlCQUEzQixBQUFPLEFBQXFDLEFBQzdDO0FBRkQsQUFBTyxBQUdSLGFBSFE7QUFEVCxpQkFJTyxBQUNMO3NCQUFBLEFBQVUsQUFDVjttQkFBTyxXQUFBLEFBQVcsU0FBWCxBQUFvQixpQkFBM0IsQUFBTyxBQUFxQyxBQUM3QztBQUNGO0FBWkQsQUFBTyxBQWFSLFNBYlE7QUFlVDs7ZUFBQSxBQUFTLG1CQUFULEFBQTRCLFVBQVU7eUNBQUE7aUNBQUE7OEJBQUE7O1lBQ3BDO2dDQUFzQixNQUFBLEFBQU0sS0FBNUIsQUFBc0IsQUFBVyw0SUFBVztnQkFBakMsQUFBaUMsaUJBQzFDOztnQkFBSSxnQkFBSixBQUFJLEFBQWdCLFVBQVUsQUFDNUI7cUJBQUEsQUFBTyxBQUNSO0FBQ0Y7QUFMbUM7c0JBQUE7K0JBQUE7NEJBQUE7a0JBQUE7Y0FBQTtrRUFBQTt5QkFBQTtBQUFBO29CQUFBO29DQUFBO29CQUFBO0FBQUE7QUFBQTtBQU9wQzs7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7ZUFBQSxBQUFTLFlBQVQsQUFBcUIsU0FBUyxBQUM1QjtZQUFJLGdCQUFKLEFBQW9CLE9BQU8sQUFDekI7QUFDRDtBQUNEO3NCQUFBLEFBQWMsQUFDZDtnQkFBQSxBQUFRLFdBQVIsQUFBbUIsR0FBbkIsQUFBc0IsR0FBdEIsQUFBeUIsQUFDekI7a0JBQUEsQUFBVSxBQUNYO0FBRUQ7O2VBQUEsQUFBUyxXQUFULEFBQW9CLFNBQXBCLEFBQTZCLFNBQTdCLEFBQXNDLGNBQWMsQUFDbEQ7WUFBTSxzQkFBc0IsS0FBNUIsQUFBNEIsQUFBSyxBQUNqQztZQUFNLFlBQVksd0JBQWxCLEFBQWtCLEFBQXdCLEFBRTFDOztZQUFNLHlCQUF5QixTQUF6QixBQUF5Qix1QkFBQSxBQUFVLE1BQU0sQUFDN0M7Y0FBSSxtQkFBQSxBQUFtQixjQUF2QixBQUFxQyxTQUFTLEFBQzVDO0FBQ0Q7QUFFRDs7d0JBQUEsQUFBYyxBQUVkOztjQUFNLDZCQUE2QixLQUFBLEFBQUssUUFBeEMsQUFBZ0QsQUFFaEQ7O2NBQU0scUJBQXFCLFNBQXJCLEFBQXFCLHFCQUFZLEFBQ3JDO2dCQUFJLEFBQ0Y7cUJBQU8sZ0JBQUEsQUFBZ0IsU0FBaEIsQUFBeUIsV0FBaEMsQUFBTyxBQUFvQyxBQUM1QztBQUZELGNBRUUsT0FBQSxBQUFPLEdBQUcsQUFDVjtxQkFBTyxVQUFBLEFBQVUsR0FBVixBQUFhLFNBQXBCLEFBQU8sQUFBc0IsQUFDOUI7QUFKRCxzQkFJVSxBQUNSO0FBQ0E7QUFDQTt1QkFBUyxZQUFZLEFBQ25CO29CQUFJLENBQUMsUUFBTCxBQUFhLGtCQUFrQixBQUM3Qjt5QkFBTyxtQkFBUCxBQUFPLEFBQW1CLEFBQzNCO0FBQ0Y7QUFKRCxBQUtEO0FBQ0Y7QUFkRCxBQWdCQTs7Y0FBTSw2QkFBNkIsS0FBQSxBQUFLLElBQUwsQUFBUyxHQUFHLGVBQS9DLEFBQW1DLEFBQTJCLEFBRTlEOztjQUFJLDZCQUFKLEFBQWlDLGNBQWMsQUFDN0M7NEJBQWdCLFlBQUE7cUJBQUEsQUFBTTtBQUFmLGFBQUEsRUFBUCxBQUFPLEFBQ0gsQUFDTDtBQUhELGlCQUdPLEFBQ0w7bUJBQUEsQUFBTyxBQUNSO0FBQ0Y7QUFqQ0QsQUFtQ0E7O1lBQU0sc0JBQXNCLFNBQXRCLEFBQXNCLG9CQUFBLEFBQVUsT0FBTyxBQUMzQzttQkFBUyxZQUFZLEFBQ25CO2dCQUFJLENBQUMsUUFBTCxBQUFhLGtCQUFrQixBQUM3QjtxQkFBTyxtQkFBUCxBQUFPLEFBQW1CLEFBQzNCO0FBQ0Y7QUFKRCxBQUtBO2VBQUEsQUFBSyxNQUFMLEFBQVcsQUFDWDtpQkFBTyxtQkFBQSxBQUFtQixPQUFuQixBQUEwQixTQUFqQyxBQUFPLEFBQW1DLEFBQzNDO0FBUkQsQUFVQTs7Y0FBQSxBQUFNLGtCQUFrQixLQUF4QixBQUE2QixNQUE3QixBQUFtQyxBQUNuQztZQUFNLFdBQVcsRUFBQyxVQUFVLGlCQUFpQixVQUE1QixBQUFXLEFBQTJCLGNBQWMsY0FBYyxRQUFuRixBQUFpQixBQUFrRSxBQUFRLEFBQzNGO2VBQU8sR0FBQSxBQUFHLElBQUgsQUFBTyxVQUFQLEFBQWlCLEtBQWpCLEFBQXNCLHdCQUE3QixBQUFPLEFBQThDLEFBQ3REO0FBRUQ7O2VBQUEsQUFBUyxzQkFBVCxBQUErQixTQUEvQixBQUF3QyxTQUFTLEFBQy9DO1lBQUksQ0FBQyxRQUFELEFBQVMsd0JBQXdCLENBQUMsUUFBbEMsQUFBMEMsV0FBWSxPQUFBLEFBQU8sS0FBSyxRQUFaLEFBQW9CLFNBQXBCLEFBQTZCLFdBQXZGLEFBQWtHLEdBQUksQUFDcEc7Y0FBTSxXQUFXLEdBQWpCLEFBQWlCLEFBQUcsQUFDcEI7bUJBQUEsQUFBUyxRQUFULEFBQWlCLEFBQ2pCO2lCQUFPLFNBQVAsQUFBZ0IsQUFDakI7QUFFRDs7Z0NBQXdCLFFBQWpCLEFBQXlCLHNCQUF6QixBQUErQyxLQUFLLFVBQUEsQUFBVSxVQUFVLEFBQzdFO2tCQUFBLEFBQVEsS0FBUixBQUFhLEFBQ2I7aUJBQU8sU0FBUyxRQUFULEFBQVMsQUFBUSxZQUFZLFdBQXBDLEFBQU8sQUFBNkIsQUFBVyxBQUNoRDtBQUhELEFBQU8sQUFJUixTQUpRO0FBTVQ7O2VBQUEsQUFBUyxtQkFBVCxBQUE0QixPQUE1QixBQUFtQyxTQUFuQyxBQUE0QyxTQUFTLEFBQ25EO1lBQUksUUFBSixBQUFZLDJCQUEyQixBQUNyQztpQkFBTywyQkFBQSxBQUEyQixTQUFsQyxBQUFPLEFBQW9DLEFBQzVDO0FBRkQsZUFFTyxJQUFJLFFBQUosQUFBWSx5QkFBeUIsQUFDMUM7aUJBQU8sbUJBQUEsQUFBbUIsT0FBbkIsQUFBMEIsU0FBMUIsQUFBbUMsU0FBMUMsQUFBTyxBQUE0QyxBQUNwRDtBQUNGO0FBRUQ7O1VBQU0sNkJBQTZCLFNBQTdCLEFBQTZCLDJCQUFBLEFBQUMsU0FBRCxBQUFVLFNBQVY7ZUFBc0Isa0JBQUEsQUFBa0IsU0FBbEIsQUFBMkIsU0FBakQsQUFBc0IsQUFBb0M7QUFBN0YsQUFFQTs7ZUFBQSxBQUFTLFVBQVQsQUFBbUIsT0FBbkIsQUFBMEIsU0FBMUIsQUFBbUMsU0FBUyxBQUMxQztZQUFJLGNBQUosQUFBa0IsQUFDbEI7WUFBSSxRQUFKLEFBQVksa0JBQWtCLEFBQzVCO3dCQUFjLGtCQUFBLEFBQWtCLFNBQWhDLEFBQWMsQUFBMkIsQUFDMUM7QUFGRCxlQUVPLElBQUksUUFBSixBQUFZLGdCQUFnQixBQUNqQzt3QkFBYyxtQkFBQSxBQUFtQixPQUFuQixBQUEwQixTQUF4QyxBQUFjLEFBQW1DLEFBQ2xEO0FBRUQ7O2lCQUFTLFlBQVksQUFDbkI7Y0FBSSxDQUFDLFFBQUwsQUFBYSxrQkFBa0IsQUFDN0I7bUJBQU8sbUJBQVAsQUFBTyxBQUFtQixBQUMzQjtBQUNGO0FBSkQsQUFLQTtlQUFBLEFBQU8sQUFDUjtBQUVEOztVQUFNLG9CQUFvQixTQUFwQixBQUFvQixrQkFBQSxBQUFDLFNBQUQsQUFBVSxTQUFWO2VBQXNCLGtCQUFBLEFBQWtCLFNBQWxCLEFBQTJCLFNBQWpELEFBQXNCLEFBQW9DO0FBQXBGLEFBRUE7O2VBQUEsQUFBUyxrQkFBVCxBQUEyQixTQUEzQixBQUFvQyxTQUFwQyxBQUE2QyxlQUFlLEFBQzFEO1lBQUksQ0FBQyxRQUFMLEFBQUssQUFBUSxnQkFBZ0IsQUFDM0I7QUFDRDtBQUNEO2dDQUF3QixRQUFqQixBQUFpQixBQUFRLGdCQUF6QixBQUF5QyxLQUFLLFVBQUEsQUFBVSxVQUFVLEFBQ3ZFO2tCQUFBLEFBQVEsS0FBUixBQUFhLEFBQ2I7Y0FBTSxPQUFPLFNBQVMsUUFBdEIsQUFBYSxBQUFTLEFBQVEsQUFDOUI7c0JBQVksbUJBQVosQUFBWSxBQUFtQixBQUMvQjtpQkFBTyxLQUFQLEFBQU8sQUFBSyxBQUNiO0FBTEQsQUFBTyxBQU1SLFNBTlE7QUFRVDs7ZUFBQSxBQUFTLG1CQUFULEFBQTRCLE9BQTVCLEFBQW1DLFNBQW5DLEFBQTRDLFNBQTVDLEFBQXFELHVCQUF1QixBQUMxRTtZQUFJLENBQUosQUFBSyx1QkFBdUIsQUFDMUI7a0NBQUEsQUFBd0IsQUFDekI7QUFDRDtZQUFJLENBQUMsUUFBTCxBQUFLLEFBQVEsd0JBQXdCLEFBQ25DO0FBQ0Q7QUFDRDtZQUFNLFlBQVksd0JBQUEsQUFBd0IsU0FBMUMsQUFBa0IsQUFBaUMsQUFDbkQ7WUFBTSxPQUFPLEVBQUMsY0FBYyxFQUFDLE9BQTdCLEFBQWEsQUFBZSxBQUU1Qjs7Z0NBQXdCLFVBQWpCLEFBQTJCLGFBQTNCLEFBQXdDLEtBQUssVUFBQSxBQUFVLFVBQVUsQUFDdEU7ZUFBQSxBQUFLLFdBQUwsQUFBZ0IsQUFDaEI7aUJBQU8sZ0JBQUEsQUFBZ0IsU0FBaEIsQUFBeUIsV0FBaEMsQUFBTyxBQUFvQyxBQUM1QztBQUhELEFBQU8sQUFJUixTQUpRO0FBTVQ7O2VBQUEsQUFBUyxnQkFBVCxBQUF5QixTQUF6QixBQUFrQyxXQUFsQyxBQUE2QyxNQUFNO1lBQUEsQUFDMUMsZUFEMEMsQUFDMUIsS0FEMEIsQUFDMUM7WUFEMEMsQUFFMUMsV0FGMEMsQUFFOUIsS0FGOEIsQUFFMUMsQUFFUDs7Z0JBQUEsQUFBUSxLQUFSLEFBQWEsQUFDYjtZQUFNLE9BQU8sU0FBUyxRQUF0QixBQUFhLEFBQVMsQUFBUSxBQUM5QjtvQkFBWSxtQkFBWixBQUFZLEFBQW1CLEFBRS9COztZQUFJLFVBQUosQUFBYyxZQUFZLEFBQ3hCO2NBQU0sU0FBUyxFQUFBLEFBQUUsTUFBRixBQUFRLGNBQWMsRUFBQyxRQUFELEFBQVMsV0FBVyxVQUFVLFFBQUEsQUFBUSxXQUFSLEFBQW1CLEdBQXRGLEFBQWUsQUFBc0IsQUFBOEIsQUFBc0IsQUFFekY7O2NBQUksQUFDRjttQkFBQSxBQUFPLE9BQU8sVUFBZCxBQUF3QixnQkFBZ0IsWUFBWSxVQUFaLEFBQXNCLFlBQTlELEFBQXdDLEFBQWtDLEFBQzNFO0FBRkQsWUFHQSxPQUFBLEFBQU8sT0FBTyxBQUNaO2dCQUFJLG9CQUFKLEFBRUE7O2dCQUFJLEFBQ0Y7a0JBQUksRUFBQSxBQUFFLFNBQU4sQUFBSSxBQUFXLFFBQVEsQUFDckI7K0JBQWUsS0FBQSxBQUFLLFVBQXBCLEFBQWUsQUFBZSxBQUMvQjtBQUZELHFCQUVPLEFBQ0w7K0JBQUEsQUFBZSxBQUNoQjtBQUVGO0FBUEQsY0FPRSxPQUFBLEFBQU8sV0FBVyxBQUNsQjs2QkFBQSxBQUFlLEFBQ2hCO0FBRUQ7O2lCQUFBLEFBQUssb0RBQUwsQUFBdUQsY0FBdkQsQUFBZ0UsQUFDaEU7a0JBQUEsQUFBTSxBQUNQO0FBQ0Y7QUFFRDs7ZUFBTyxLQUFQLEFBQU8sQUFBSyxBQUNiO0FBRUQ7O1VBQU0sVUFBVSxTQUFWLEFBQVUsUUFBQSxBQUFVLFNBQVMsQUFDakM7WUFBSSxDQUFDLFFBQUQsQUFBUyxXQUFZLE9BQUEsQUFBTyxLQUFLLFFBQVosQUFBb0IsU0FBcEIsQUFBNkIsV0FBdEQsQUFBaUUsR0FBSSxBQUNuRTtjQUFNLFdBQVcsR0FBakIsQUFBaUIsQUFBRyxBQUNwQjttQkFBQSxBQUFTLFFBQVQsQUFBaUIsQUFDakI7aUJBQU8sU0FBUCxBQUFnQixBQUNqQjtBQUVEOztZQUFNLFdBQU4sQUFBaUIsQUFFakI7O2FBQUssSUFBTCxBQUFXLGtCQUFrQixRQUE3QixBQUFxQyxTQUFTLEFBQzVDO2NBQU0sb0JBQW9CLFFBQUEsQUFBUSxRQUFsQyxBQUEwQixBQUFnQixBQUMxQztjQUFJLEFBQ0Y7cUJBQUEsQUFBUyxrQkFBa0IsVUFBQSxBQUFVLE9BQXJDLEFBQTJCLEFBQWlCLEFBQzdDO0FBRkQsWUFFRSxPQUFBLEFBQU8sR0FBRyxBQUNWO3FCQUFBLEFBQVMsa0JBQWtCLEdBQUEsQUFBRyxPQUE5QixBQUEyQixBQUFVLEFBQ3RDO0FBQ0Y7QUFFRDs7ZUFBTyxHQUFBLEFBQUcsSUFBVixBQUFPLEFBQU8sQUFDZjtBQW5CRCxBQXFCQTs7VUFBTSw0QkFBNEIsU0FBNUIsQUFBNEIsbUNBQUE7ZUFBVyxFQUFBLEFBQUUsTUFBTSxRQUFBLEFBQVEsaUJBQWhCLEFBQWlDLElBQUksUUFBQSxBQUFRLGdCQUF4RCxBQUFXLEFBQTZEO0FBQTFHLEFBRUE7O2VBQUEsQUFBUyxvQkFBVCxBQUE2QixLQUFLLEFBQ2hDO1lBQUksSUFBQSxBQUFJLE9BQUosQUFBVyxPQUFmLEFBQXNCLEtBQUssQUFDekI7aUJBQU8sSUFBQSxBQUFJLE9BQVgsQUFBTyxBQUFXLEFBQ25CO0FBRkQsZUFFTyxBQUNMO2lCQUFBLEFBQU8sQUFDUjtBQUNGO0FBRUQ7O1VBQU0seUJBQXlCLFNBQXpCLEFBQXlCLDZCQUFBO2VBQVEsRUFBQSxBQUFFLFFBQVEsRUFBQSxBQUFFLElBQUksS0FBTixBQUFNLEFBQUssZUFBN0IsQUFBUSxBQUFVLEFBQTBCO0FBQTNFLEFBRUE7O1VBQU0sbUJBQW1CLFNBQW5CLEFBQW1CLHVCQUFBO2VBQVEsRUFBQSxBQUFFLEtBQUssRUFBQSxBQUFFLElBQUksdUJBQU4sQUFBTSxBQUF1QixPQUE1QyxBQUFRLEFBQU8sQUFBb0M7QUFBNUUsQUFFQTs7VUFBTSxTQUFTLGlCQUFmLEFBQWUsQUFBaUIsQUFFaEM7O21CQUFPLEFBQU0sWUFBTixBQUFrQixLQUFLLFlBQVksQUFDeEM7Z0NBQUEsQUFBd0IsQUFFeEI7O0FBQ0E7bUJBQUEsQUFBVyxVQUFYLEFBQXFCLEFBQ3JCO2dDQUFBLEFBQXdCLEFBRXhCOztBQUNBO1lBQUksT0FBQSxBQUFPLFdBQVgsQUFBc0IsR0FBRyxBQUN2QjtBQUNEO0FBRUQ7O1lBQU0sU0FBUyxTQUFULEFBQVMsU0FBWSxBQUN6QjtjQUFBLEFBQUksdUJBQXVCLEFBQ3pCO0FBQ0Q7QUFFRDs7a0NBQUEsQUFBd0IsQUFFeEI7O0FBQ0E7QUFDQTtBQUNBOzBCQUFnQixZQUFZLEFBQzFCO3VCQUFBLEFBQVcsVUFBWCxBQUFxQixVQUFyQixBQUErQixRQUFRLFlBQU0sQUFDM0M7MEJBQUEsQUFBWSxBQUNaO3NDQUFBLEFBQXdCLEFBQ3pCO0FBSEQsQUFJRDtBQUxELEFBQU8sQUFNUixXQU5RO0FBVlQsQUFrQkE7O2NBQUEsQUFBTSxNQUFOLEFBQVksUUFBWixBQUFvQixBQUVwQjs7WUFBTSw0Q0FBaUMsQUFBVyxJQUFYLEFBQWUsOEJBQThCLFlBQVcsQUFDN0Y7c0JBQUEsQUFBWSxBQUNaO0FBQ0Q7QUFIRCxBQUF1QyxBQUt2QyxTQUx1Qzs7MkJBS3ZDLEFBQW1CLElBQW5CLEFBQXVCLFlBQVksWUFBTSxBQUN2QztnQkFBQSxBQUFNLGNBQU4sQUFBb0IsQUFDcEI7QUFDRDtBQUhELEFBSUQ7QUF6Q0QsQUFBTyxBQTBDUixPQTFDUTtBQWpVWCxBQUFPLEFBNldSO0FBN1dRLEFBQ0w7OztBQThXSixRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFVBQWhDLEFBQTBDLFFBQTFDLEFBQWtEOztJLEFBRTVDLGlDQUNKOzhCQUFBLEFBQVksWUFBWTswQkFDdEI7O1NBQUEsQUFBSyxhQUFMLEFBQWtCLEFBQ2xCO1NBQUEsQUFBSyxRQUFMLEFBQWEsQUFDYjtTQUFBLEFBQUsscUJBQUwsQUFBMEIsQUFDM0I7Ozs7OzBCQUVLLEFBQ0o7YUFBTyxLQUFQLEFBQVksQUFDYjs7OzsrQkFFVSxBQUNUO2FBQU8sS0FBQSxBQUFLLFNBQVosQUFBcUIsQUFDdEI7Ozs7K0JBRVUsQUFDVDtXQUFBLEFBQUssUUFBUSxLQUFBLEFBQUssSUFBTCxBQUFTLEdBQUcsS0FBQSxBQUFLLFFBQTlCLEFBQWEsQUFBeUIsQUFDdEM7VUFBSSxLQUFBLEFBQUssVUFBVCxBQUFtQixHQUFHLEFBQ3BCO1lBQUksQ0FBQyxLQUFMLEFBQVUsb0JBQW9CLEFBQzVCO2VBQUEsQUFBSyxxQkFBTCxBQUEwQixBQUMxQjtlQUFBLEFBQUssV0FBTCxBQUFnQixXQUFoQixBQUEyQixBQUM1QjtBQUhELGVBR08sQUFDTDtlQUFBLEFBQUssV0FBTCxBQUFnQixXQUFoQixBQUEyQixBQUM1QjtBQUNGO0FBQ0Y7Ozs7NEJBRU8sQUFDTjtXQUFBLEFBQUssUUFBTCxBQUFhLEFBQ2I7YUFBTyxLQUFBLEFBQUsscUJBQVosQUFBaUMsQUFDbEM7Ozs7Ozs7QUFHSCxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFFBQWhDLEFBQXdDLHFDQUFzQixVQUFBLEFBQUMsWUFBZSxBQUM1RTtBQUNBOztTQUFPLElBQUEsQUFBSSxtQkFBWCxBQUFPLEFBQXVCLEFBQy9CO0FBSEQ7O0ksQUFLTSw0QkFDSjt5QkFBQSxBQUFZLGNBQVosQUFBMEIsZ0JBQTFCLEFBQTBDLE1BQU07MEJBQzlDOztTQUFBLEFBQUssZUFBTCxBQUFvQixBQUNwQjtTQUFBLEFBQUssaUJBQUwsQUFBc0IsQUFFdEI7O1NBQUEsQUFBSyxPQUFMLEFBQVksQUFDWjtTQUFBLEFBQUssV0FBTCxBQUFnQixBQUNqQjs7Ozs7d0IsQUFFRyxNQUFNLEFBQ1I7YUFBTyxLQUFBLEFBQUssYUFBTCxBQUFrQixJQUFJLEtBQXRCLEFBQTJCLE1BQWxDLEFBQU8sQUFBaUMsQUFDekM7Ozs7NkJBRVEsQUFDUDthQUFPLEtBQVAsQUFBWSxBQUNiOzs7OzhCLEFBRVMsT0FBTyxBQUNmO2FBQU8sRUFBQSxBQUFFLFVBQUYsQUFBWSxPQUFPLEVBQUEsQUFBRSxJQUFGLEFBQU0sT0FBTyxLQUFBLEFBQUssSUFBTCxBQUFTLEtBQWhELEFBQU8sQUFBbUIsQUFBYSxBQUFjLEFBQ3REOzs7O3dCLEFBRUcsTSxBQUFNLE9BQU8sQUFDZjtXQUFBLEFBQUssYUFBTCxBQUFrQixJQUFJLEtBQXRCLEFBQTJCLE1BQTNCLEFBQWlDLE1BQWpDLEFBQXVDLEFBQ3ZDO1dBQUEsQUFBSyxnQkFBTCxBQUFxQixNQUFyQixBQUEyQixBQUM1Qjs7OzswQixBQUVLLE9BQU87a0JBQ1g7O1VBQUksRUFBRSxpQkFBTixBQUFJLEFBQW1CLFFBQVEsQUFDN0I7Z0JBQVEsQ0FBUixBQUFRLEFBQUMsQUFDVjtBQUVEOztRQUFBLEFBQUUsT0FBRixBQUFTLEtBQUssVUFBQSxBQUFDLE1BQVMsQUFDdEI7Y0FBQSxBQUFLLGFBQUwsQUFBa0IsTUFBTSxNQUF4QixBQUE2QixNQUE3QixBQUFtQyxBQUNuQztjQUFBLEFBQUssZ0JBQUwsQUFBcUIsTUFBckIsQUFBMkIsQUFDNUI7QUFIRCxBQUlEOzs7OzBCLEFBRUssTyxBQUFPLFNBQVM7bUJBQ3BCOztVQUFJLEVBQUUsaUJBQU4sQUFBSSxBQUFtQixRQUFRLEFBQzdCO2dCQUFRLENBQVIsQUFBUSxBQUFDLEFBQ1Y7QUFFRDs7UUFBQSxBQUFFLE9BQUYsQUFBUyxLQUFLLFVBQUEsQUFBQyxNQUFTLEFBQ3RCO2VBQUEsQUFBSyxTQUFMLEFBQWMsS0FBSyxPQUFBLEFBQUssZUFBTCxBQUFvQixPQUFwQixBQUEyQixNQUEzQixBQUFpQyxTQUFTLE9BQUEsQUFBSyxJQUFsRSxBQUFtQixBQUEwQyxBQUFTLEFBQ3ZFO0FBRkQsQUFHRDs7OztrQyxBQUVhLFNBQVMsQUFDckI7VUFBSSxLQUFBLEFBQUssU0FBTCxBQUFjLFdBQWxCLEFBQTZCLEdBQUcsQUFDOUI7QUFDRDtBQUNEO1VBQU0sY0FBTixBQUFvQixBQUVwQjs7UUFBQSxBQUFFLEtBQUssS0FBUCxBQUFZLFVBQVUsdUJBQWUsQUFDbkM7WUFBSSxZQUFBLEFBQVksWUFBaEIsQUFBNEIsU0FBUyxBQUNuQztzQkFBQSxBQUFZLEtBQVosQUFBaUIsQUFDbEI7QUFDRjtBQUpELEFBTUE7O2FBQU8sS0FBQSxBQUFLLFdBQVosQUFBdUIsQUFDeEI7Ozs7b0MsQUFFZSxhLEFBQWEsVUFBVTttQkFDckM7O1FBQUEsQUFBRSxLQUFLLEtBQVAsQUFBWSxVQUFVLG1CQUFXLEFBQy9CO1lBQUksUUFBQSxBQUFRLGFBQVIsQUFBcUIsYUFBekIsQUFBSSxBQUFrQyxXQUFXLEFBQy9DO2NBQU0sd0JBQXdCLE9BQUEsQUFBSyxhQUFMLEFBQWtCLElBQUksT0FBdEIsQUFBMkIsTUFBTSxRQUEvRCxBQUE4QixBQUF5QyxBQUN2RTtrQkFBQSxBQUFRLE9BQVIsQUFBZSxhQUFmLEFBQTRCLEFBQzdCO0FBQ0Y7QUFMRCxBQU1EOzs7Ozs7O0ksQUFHRyxtQ0FDSjtnQ0FBQSxBQUFZLGNBQVosQUFBMEIsZ0JBQWdCOzBCQUN4Qzs7U0FBQSxBQUFLLGVBQUwsQUFBb0IsQUFDcEI7U0FBQSxBQUFLLGlCQUFMLEFBQXNCLEFBQ3ZCOzs7Ozs2QkFFaUI7VUFBWCxBQUFXLDJFQUFKLEFBQUksQUFDaEI7O2FBQU8sSUFBQSxBQUFJLGNBQWMsS0FBbEIsQUFBdUIsY0FBYyxLQUFyQyxBQUEwQyxnQkFBakQsQUFBTyxBQUEwRCxBQUNsRTs7Ozs7OztBQUdILFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWYsQUFBZ0MsUUFBaEMsQUFBd0MsMkRBQXdCLFVBQUEsQUFBQyxjQUFELEFBQWUsZ0JBQW1CLEFBQ2hHO0FBQ0E7O1NBQU8sSUFBQSxBQUFJLHFCQUFKLEFBQXlCLGNBQWhDLEFBQU8sQUFBdUMsQUFDL0M7QUFIRDs7SSxBQUtNLHNCQUNKO21CQUFBLEFBQVksV0FBWixBQUF1QixTQUFtQztRQUExQixBQUEwQixtRkFBWCxBQUFXOzswQkFDeEQ7O1NBQUEsQUFBSyxZQUFMLEFBQWlCLEFBQ2pCO1NBQUEsQUFBSyxVQUFMLEFBQWUsQUFDZjtTQUFBLEFBQUssZUFBZSxFQUFBLEFBQUUsVUFBdEIsQUFBb0IsQUFBWSxBQUNqQzs7Ozs7a0MsQUFFYSxNQUFNLEFBQ2xCO2FBQU8sS0FBQSxBQUFLLE1BQVosQUFBTyxBQUFXLEFBQ25COzs7O2lDLEFBRVksYSxBQUFhLFVBQVUsQUFDbEM7QUFDQTtVQUFJLEtBQUEsQUFBSyxjQUFULEFBQXVCLGFBQWEsQUFDbEM7ZUFBTyxDQUFDLFFBQUEsQUFBUSxPQUFPLEtBQWYsQUFBb0IsY0FBNUIsQUFBUSxBQUFrQyxBQUMzQztBQUVEOztVQUFNO2NBQ0UsS0FETSxBQUNELEFBQ1g7Z0JBQVEsS0FBQSxBQUFLLGNBQWMsS0FGZixBQUVKLEFBQXdCLEFBQ2hDO2VBQU8sS0FIVCxBQUFjLEFBR0EsQUFHZDtBQU5jLEFBQ1o7O1VBS0k7Y0FBUyxBQUNQLEFBQ047Z0JBQVEsS0FBQSxBQUFLLGNBRkEsQUFFTCxBQUFtQixBQUMzQjtlQUhGLEFBQWUsQUFHTixBQUdUO0FBTmUsQUFDYjs7VUFLSSxlQUFlLEtBQUEsQUFBSyxJQUFJLE9BQUEsQUFBTyxPQUFoQixBQUF1QixRQUFRLE1BQUEsQUFBTSxPQUExRCxBQUFxQixBQUE0QyxBQUNqRTtXQUFLLElBQUksYUFBVCxBQUFzQixHQUFHLGFBQXpCLEFBQXNDLGNBQXRDLEFBQW9ELGNBQWMsQUFDaEU7WUFBSSxNQUFBLEFBQU0sT0FBTixBQUFhLGdCQUFnQixPQUFBLEFBQU8sT0FBeEMsQUFBaUMsQUFBYyxhQUFhLEFBQzFEO2lCQUFBLEFBQU8sQUFDUjtBQUNGO0FBRUQ7O0FBRUE7O1VBQU0seUJBQXlCLE9BQUEsQUFBTyxPQUFQLEFBQWMsU0FBUyxNQUFBLEFBQU0sT0FBNUQsQUFBbUUsQUFFbkU7O1VBQUEsQUFBSSx3QkFBd0IsQUFDMUI7WUFBTSxlQUFlLE9BQUEsQUFBTyxPQUFQLEFBQWMsTUFBTSxNQUFBLEFBQU0sT0FBMUIsQUFBaUMsUUFBakMsQUFBeUMsS0FBOUQsQUFBcUIsQUFBOEMsQUFDbkU7WUFBTSw0QkFBNEIsRUFBQSxBQUFFLElBQUksTUFBTixBQUFZLE9BQTlDLEFBQWtDLEFBQW1CLEFBQ3JEO2VBQU8sQ0FBQyxRQUFBLEFBQVEsT0FBUixBQUFlLDJCQUEyQixPQUFsRCxBQUFRLEFBQWlELEFBQzFEO0FBSkQsYUFJTyxBQUNMO1lBQU0sZ0JBQWUsTUFBQSxBQUFNLE9BQU4sQUFBYSxNQUFNLE9BQUEsQUFBTyxPQUExQixBQUFpQyxRQUFqQyxBQUF5QyxLQUE5RCxBQUFxQixBQUE4QyxBQUNuRTtZQUFNLHNCQUFzQixFQUFBLEFBQUUsSUFBSSxPQUFOLEFBQWEsT0FBekMsQUFBNEIsQUFBb0IsQUFDaEQ7ZUFBTyxDQUFDLFFBQUEsQUFBUSxPQUFPLE1BQWYsQUFBcUIsT0FBN0IsQUFBUSxBQUE0QixBQUNyQztBQUNGOzs7OzJCLEFBRU0sYSxBQUFhLFVBQVUsQUFDNUI7V0FBQSxBQUFLLFFBQUwsQUFBYSxhQUFiLEFBQTBCLFVBQVUsS0FBcEMsQUFBeUMsQUFDekM7V0FBQSxBQUFLLGVBQWUsRUFBQSxBQUFFLFVBQXRCLEFBQW9CLEFBQVksQUFDakM7Ozs7Ozs7SSxBQUdHOzs7Ozs7OzJCLEFBQ0csVyxBQUFXLFNBQW1DO1VBQTFCLEFBQTBCLG1GQUFYLEFBQVcsQUFDbkQ7O2FBQU8sSUFBQSxBQUFJLFFBQUosQUFBWSxXQUFaLEFBQXVCLFNBQTlCLEFBQU8sQUFBZ0MsQUFDeEM7Ozs7Ozs7QUFHSCxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFFBQWhDLEFBQXdDLGtCQUFrQixZQUFNLEFBQzlEO1NBQU8sSUFBUCxBQUFPLEFBQUksQUFDWjtBQUZEOztBQUlBLFFBQUEsQUFBUSxPQUFSLEFBQWUsaUJBQWYsQUFBZ0MsU0FBaEMsQUFBeUMsMEJBQVMsVUFBQSxBQUFTLGNBQWMsQUFDdkU7QUFDQTs7TUFBTSxTQUFOLEFBQWUsQUFDZjtNQUFNLGFBQU4sQUFBbUIsQUFDbkI7TUFBTSxPQUFOLEFBQWEsQUFDYjtNQUFNLG1CQUFOLEFBQXlCLEFBQ3pCO01BQU0sUUFBTixBQUFjLEFBQ2Q7TUFBTSxRQUFOLEFBQWMsQUFDZDtNQUFJLFlBQUosQUFBZ0IsQUFFaEI7O01BQU07QUFBVyx3Q0FBQSxBQUVGLE1BRkUsQUFFSSxRQUFRLEFBQ3pCO1lBQUEsQUFBTSxRQUFOLEFBQWMsQUFDZDtZQUFBLEFBQU0sTUFBTixBQUFZLFFBQVEsSUFBQSxBQUFJLE9BQU8sTUFBQSxBQUFNLE1BQU4sQUFBWSxNQUF2QixBQUE2QixRQUFqRCxBQUFvQixBQUFxQyxBQUN6RDthQUFPLEVBQUEsQUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFoQixBQUFTLEFBQVksZ0JBQTVCLEFBQU8sQUFBcUMsQUFDN0M7QUFOYyxBQVFmO0FBUmUsZ0RBQUEsQUFRRSxNQVJGLEFBUVEsUUFBUSxBQUM3QjthQUFBLEFBQU8sUUFBUSxFQUFBLEFBQUUsT0FBTyxFQUFDLE1BQVYsQUFBUyxRQUF4QixBQUFlLEFBQWlCLEFBQ2hDO2FBQU8sRUFBQSxBQUFFLE9BQU8sRUFBRSxLQUFLLEtBQWhCLEFBQVMsQUFBWSxvQkFBNUIsQUFBTyxBQUF5QyxBQUNqRDtBQVhjLEFBYWY7QUFiZSxrREFBQSxBQWFHLE1BYkgsQUFhUyxJQUFJLEFBQzFCO2lCQUFBLEFBQVcsUUFBWCxBQUFtQixBQUNuQjthQUFPLEVBQUEsQUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFoQixBQUFTLEFBQVkscUJBQTVCLEFBQU8sQUFBMEMsQUFDbEQ7QUFoQmMsQUFrQmY7QUFsQmUsc0NBQUEsQUFrQkgsU0FBc0I7VUFBYixBQUFhLDZFQUFKLEFBQUksQUFDaEM7O1VBQU07cUJBQ1MsS0FBQSxBQUFLLG1CQUFMLEFBQXdCLFNBRHZCLEFBQ0QsQUFBaUMsQUFDOUM7aUJBRkYsQUFBZ0IsQUFLaEI7QUFMZ0IsQUFDZDs7V0FJRixBQUFLLEtBQUssRUFBQSxBQUFFLE9BQUYsQUFBUyxTQUFuQixBQUFVLEFBQWtCLEFBQzVCO2FBQU8sRUFBQSxBQUFFLE9BQU8sRUFBRSxLQUFLLEtBQWhCLEFBQVMsQUFBWSxlQUE1QixBQUFPLEFBQW9DLEFBQzVDO0FBMUJjLEFBNEJmO0FBNUJlLHdEQTRCbUI7eUNBQVgsQUFBVyw2REFBWDtBQUFXLHFDQUFBO0FBQ2hDOztRQUFBLEFBQUUsUUFBRixBQUFVLFdBQVcsVUFBQSxBQUFDLE9BQVUsQUFDOUI7WUFBSSxDQUFDLGlCQUFBLEFBQWlCLFNBQXRCLEFBQUssQUFBMEIsUUFBUSxBQUNyQzsyQkFBQSxBQUFpQixLQUFqQixBQUFzQixBQUN2QjtBQUNGO0FBSkQsQUFLRDtBQWxDYyxBQW9DZjtBQXBDZSx3Q0FBQSxBQW9DRixNQUFNLEFBQ2pCO2tCQUFBLEFBQVksQUFDYjtBQXRDYyxBQXdDZjtBQXhDZSxvREFBQSxBQXdDSSxZQXhDSixBQXdDZ0IsUUFBUSxBQUNyQztVQUFJLGFBQUosQUFDQTttQkFBYSxLQUFBLEFBQUssOEJBQWxCLEFBQWEsQUFBbUMsQUFDaEQ7bUJBQWEsS0FBQSxBQUFLLDZCQUFsQixBQUFhLEFBQWtDLEFBRS9DOztVQUFNLGFBQU4sQUFBbUIsQUFDbkI7VUFBSSxXQUFKLEFBQWUsQUFFZjs7VUFBSSxDQUFDLE9BQUwsQUFBWSxjQUFjLEFBQ3hCO3lCQUFBLEFBQWUsV0FDaEI7QUFFRDs7VUFBTSxZQUFOLEFBQWtCLEFBRWxCOzthQUFPLENBQUMsUUFBUSxXQUFBLEFBQVcsS0FBcEIsQUFBUyxBQUFnQixpQkFBaEMsQUFBaUQsTUFBTSxBQUNyRDtZQUFNLFFBQVEsT0FBTyxNQUFyQixBQUFjLEFBQU8sQUFBTSxBQUMzQjtrQkFBQSxBQUFVLEtBQVYsQUFBZSxBQUNmO21CQUFXLFNBQUEsQUFBUyxRQUFRLE1BQWpCLEFBQWlCLEFBQU0sVUFBUSxNQUFNLE1BQU4sQUFBWSxNQUFaLEFBQWtCLE1BQWpELEFBQXVELFNBQWxFLEFBQ0Q7QUFFRDs7ZUFBQSxBQUFTLFFBQVQsQUFBaUIsS0FBakIsQUFBc0IsQUFFdEI7OztlQUNTLElBQUEsQUFBSSxPQUFKLEFBQVcsVUFEYixBQUNFLEFBQXFCLEFBQzVCO2dCQUZGLEFBQU8sQUFFRyxBQUVYO0FBSlEsQUFDTDtBQS9EVyxBQW9FZjtBQXBFZSx3RUFBQSxBQW9FYyxLQUFLLEFBQ2hDO1VBQUksSUFBQSxBQUFJLE1BQVIsQUFBSSxBQUFVLFFBQVEsQUFDcEI7ZUFBTyxJQUFBLEFBQUksUUFBSixBQUFZLE9BQW5CLEFBQU8sQUFBbUIsQUFDM0I7QUFDRDthQUFBLEFBQVUsTUFDWDtBQXpFYyxBQTJFZjtBQTNFZSwwRUFBQSxBQTJFZSxLQUFLLEFBQ2pDO2FBQU8sSUFBQSxBQUFJLFFBQUosQUFBWSxpQ0FBbkIsQUFBTyxBQUE2QyxBQUNyRDtBQTdFYyxBQStFZjtBQS9FZSx1RUFBQSxBQStFVixXQS9FVSxBQStFQyxXQS9FRCxBQStFWSxJQS9FWixBQStFZ0IsWUFBWSxBQUN6QztBQUVBOztBQUNBO0FBQ0E7QUFFQTs7QUFFQTs7UUFBQSxBQUFFLE1BQUYsQUFBUSxZQUFZLFVBQUEsQUFBQyxRQUFELEFBQVMsWUFBVDtlQUNsQixXQUFBLEFBQVcsY0FBYyxVQUFBLEFBQVMsTUFBTSxBQUN0QztjQUFJLENBQUosQUFBSyxNQUFNLEFBQUU7bUJBQUEsQUFBTyxBQUFLO0FBQ3pCO2NBQU0sU0FBUyxFQUFDLFNBQWhCLEFBQWUsQUFBVSxBQUN6QjtpQkFBTyxVQUFBLEFBQVUsT0FBVixBQUFpQixRQUFqQixBQUF5QixJQUFoQyxBQUFPLEFBQTZCLEFBQ3JDO0FBTGlCO0FBQXBCLEFBUUE7O1VBQUksY0FBSixBQUFrQixBQUVsQjs7VUFBTTt5QkFBVSxBQUNHLEFBQ2pCO3VCQUFlLEdBRkQsQUFFQyxBQUFHLEFBRWxCOztBQUpjLDhCQUFBLEFBSVIsWUFBWTsyQ0FBQTttQ0FBQTtnQ0FBQTs7Y0FDaEI7a0NBQWtCLE1BQUEsQUFBTSxLQUF4QixBQUFrQixBQUFXLHdJQUFPO2tCQUF6QixBQUF5QixhQUNsQzs7a0JBQUksYUFBSixBQUNBO2tCQUFJLENBQUMsUUFBUSxJQUFBLEFBQUksWUFBSixBQUFnQixNQUFoQixBQUFzQixLQUEvQixBQUFTLEFBQTJCLGlCQUF4QyxBQUF5RCxNQUFNLEFBQzdEO3VCQUFPLEVBQUMsS0FBRCxLQUFNLFlBQWIsQUFBTyxBQUFrQixBQUMxQjtBQUNGO0FBTmU7d0JBQUE7aUNBQUE7OEJBQUE7b0JBQUE7Z0JBQUE7b0VBQUE7MkJBQUE7QUFBQTtzQkFBQTtzQ0FBQTtzQkFBQTtBQUFBO0FBQUE7QUFPaEI7O2lCQUFBLEFBQU8sQUFDUjtBQVphLEFBY2Q7QUFkYywwQ0FBQSxBQWNGLE9BQStCO2NBQXhCLEFBQXdCLGlGQUFYLEFBQVcsQUFDekM7O2NBQU0sV0FBVyxLQUFBLEFBQUssbUJBQXRCLEFBQWlCLEFBQXdCLEFBQ3pDO2NBQU0sT0FBTyxLQUFBLEFBQUssZ0JBQWxCLEFBQWEsQUFBcUIsQUFDbEM7dUJBQWEsS0FBQSxBQUFLLGtCQUFsQixBQUFhLEFBQXVCLEFBQ3BDO2lCQUFPLGFBQUEsQUFBYSxRQUFiLEFBQXFCLFlBQXJCLEFBQWlDLE1BQXhDLEFBQU8sQUFBdUMsQUFDL0M7QUFuQmEsQUFxQmQ7QUFyQmMsc0RBQUEsQUFxQkksWUFBWSxBQUM1QjtjQUFJLENBQUosQUFBSyxZQUFZLEFBQUU7eUJBQWEsVUFBYixBQUFhLEFBQVUsQUFBVztBQUNyRDtjQUFNLE9BQU8sRUFBQSxBQUFFLE1BQWYsQUFBYSxBQUFRLEFBQ3JCO2NBQU0sVUFBTixBQUFnQixBQUVoQjs7WUFBQSxBQUFFLFFBQUYsQUFBVSxNQUFNLFVBQUEsQUFBQyxPQUFELEFBQVEsS0FBUSxBQUM5QjtnQkFBSSxZQUFZLEVBQUEsQUFBRSxRQUFGLEFBQVUsUUFBUSxFQUFFLGFBQXBDLEFBQWdCLEFBQWtCLEFBQWUsQUFDakQ7Z0JBQUksQ0FBSixBQUFLLFdBQVcsQUFBRTswQkFBQSxBQUFZLEFBQU07QUFFcEM7O2dCQUFNLGdCQUFnQixPQUFBLEFBQU8sYUFBYSxFQUFBLEFBQUUsSUFBSSxPQUFOLEFBQU0sQUFBTyxZQUFqQyxBQUFvQixBQUF5QixVQUFuRSxBQUE2RSxBQUM3RTtnQkFBSSxDQUFDLE9BQUQsQUFBQyxBQUFPLGNBQWUsTUFBQSxBQUFNLGVBQU4sQUFBcUIsTUFBckIsQUFBMkIsS0FBdEQsQUFBMkIsQUFBZ0MsUUFBUyxBQUVsRTs7a0JBQU0sWUFBWSxPQUFBLEFBQU8sYUFBYSxPQUFBLEFBQU8sV0FBM0IsQUFBc0MsT0FBeEQsQUFBK0QsQUFDL0Q7a0JBQU0sZ0JBQWdCLFlBQVksTUFBWixBQUFZLEFBQU0sYUFBeEMsQUFBcUQsQUFDckQ7a0JBQU0sa0JBQWtCLGdCQUFnQixjQUFoQixBQUE4QixTQUF0RCxBQUErRCxBQUUvRDs7a0JBQUEsQUFBSSxpQkFBaUIsQUFDbkI7d0JBQVEsVUFBQSxBQUFVLE9BQVYsQUFBaUIsaUJBQWpCLEFBQWtDLE1BQU0sRUFBQyxPQUFqRCxBQUFRLEFBQXdDLEFBQVEsQUFDekQ7QUFFRDs7a0JBQU0sMEJBQTBCLE9BQUEsQUFBTyxhQUFhLE9BQUEsQUFBTyxXQUEzQixBQUFzQyxZQUF0RSxBQUFrRixBQUNsRjtrQkFBTSxVQUFVLDJCQUFoQixBQUEyQyxBQUUzQzs7MkJBQUEsQUFBYSxJQUFiLEFBQWlCLFNBQWpCLEFBQTBCLFNBQTFCLEFBQW1DLEFBQ3BDO0FBQ0Y7QUFwQkQsQUFzQkE7O2lCQUFBLEFBQU8sQUFDUjtBQWpEYSxBQW1EZDtBQW5EYyx3REFBQSxBQW1ESyxPQUFPLEFBQ3hCO2NBQU0sT0FBTixBQUFhLEFBRWI7O1lBQUEsQUFBRSxRQUFRLE1BQUEsQUFBTSxJQUFoQixBQUFvQixPQUFPLFVBQUEsQUFBQyxPQUFELEFBQVEsS0FBUSxBQUN6Qzt5QkFBQSxBQUFhLElBQWIsQUFBaUIsTUFBakIsQUFBdUIsS0FBTSxRQUFBLEFBQU8sOENBQVAsQUFBTyxZQUFQLEFBQWlCLFdBQVcsRUFBQSxBQUFFLFVBQTlCLEFBQTRCLEFBQVksU0FBckUsQUFBOEUsQUFDL0U7QUFGRCxBQUlBOztpQkFBQSxBQUFPLEFBQ1I7QUEzRGEsQUE2RGQ7QUE3RGMsa0RBQUEsQUE2REUsT0FBTyxBQUNyQjtjQUFNLE9BQU4sQUFBYSxBQUNiO2NBQU0sYUFBYSxNQUFBLEFBQU0sSUFBTixBQUFVLFlBQTdCLEFBQXlDLEFBRXpDOztjQUFJLFdBQUEsQUFBVyxXQUFmLEFBQTBCLEdBQUcsQUFBRTttQkFBQSxBQUFPLEFBQUs7QUFFM0M7O2VBQUssSUFBSSxJQUFKLEFBQVEsR0FBRyxNQUFNLFdBQUEsQUFBVyxTQUE1QixBQUFtQyxHQUFHLE1BQU0sS0FBakQsQUFBc0QsS0FBSyxNQUFNLEtBQU4sQUFBVyxNQUFNLEtBQTVFLEFBQWlGLEtBQUssTUFBQSxBQUFNLE1BQTVGLEFBQWtHLEtBQUssQUFDckc7Z0JBQU0sUUFBUSxNQUFBLEFBQU0sSUFBTixBQUFVLFlBQVYsQUFBc0IsT0FBcEMsQUFBYyxBQUE2QixBQUMzQztnQkFBSSxRQUFRLE1BQUEsQUFBTSxXQUFXLElBQTdCLEFBQVksQUFBbUIsQUFFL0I7O2dCQUFJLE1BQU0sTUFBTixBQUFZLE1BQWhCLEFBQXNCLFFBQVEsQUFBRTtzQkFBUSxVQUFBLEFBQVUsT0FBTyxNQUFNLE1BQU4sQUFBWSxNQUE3QixBQUFtQyxRQUFuQyxBQUEyQyxNQUFNLEVBQUMsT0FBMUQsQUFBUSxBQUFpRCxBQUFRLEFBQVU7QUFFM0c7O3lCQUFBLEFBQWEsSUFBYixBQUFpQixNQUFPLE1BQUEsQUFBTSxhQUFhLE1BQTNDLEFBQWlELE1BQWpELEFBQXdELEFBQ3pEO0FBRUQ7O2lCQUFBLEFBQU8sQUFDUjtBQTdFYSxBQStFZDtBQS9FYyxnREErRUUsQUFDZDtpQkFBQSxBQUFPLEFBQ1I7QUFqRmEsQUFtRmQ7QUFuRmMsNENBQUEsQUFtRkQsTUFBTSxBQUNqQjtpQkFBTyxXQUFQLEFBQU8sQUFBVyxBQUNuQjtBQXJGYSxBQXVGZDtBQXZGYyxrREFBQSxBQXVGRSxNQUFpQjtjQUFYLEFBQVcsMkVBQUosQUFBSSxBQUMvQjs7aUJBQU8sV0FBQSxBQUFXLE1BQWxCLEFBQU8sQUFBaUIsQUFDekI7QUF6RmEsQUEyRmQ7QUEzRmMsd0JBQUEsQUEyRlgsTUFBc0M7Y0FBaEMsQUFBZ0MsMkVBQXpCLEFBQXlCO2NBQXJCLEFBQXFCLGtGQUFQLEFBQU8sQUFDdkM7O2NBQU0sYUFBYSxVQUFuQixBQUFtQixBQUFVLEFBQzdCO2NBQU0sU0FBUyxLQUFBLEFBQUssZ0JBQUwsQUFBcUIsTUFBcEMsQUFBZSxBQUEyQixBQUUxQzs7Y0FBSSxlQUFKLEFBQW1CLFFBQVEsQUFDekI7bUJBQU8sVUFBQSxBQUFVLElBQWpCLEFBQU8sQUFBYyxBQUN0QjtBQUVEOztjQUFBLEFBQUksYUFBYSxBQUNmO2lCQUFBLEFBQUssQUFDTjtBQUNGO0FBdEdhLEFBd0dkO0FBeEdjLGtDQXdHTCxBQUNQO3FCQUFBLEFBQVcsTUFBWCxBQUFpQixBQUNsQjtBQTFHYSxBQTRHZDtBQTVHYyw0REE0R1EsQUFDcEI7aUJBQUEsQUFBTyxBQUNSO0FBOUdhLEFBZ0hkO0FBaEhjLHNEQWdISyxBQUNqQjt3QkFBQSxBQUFjLEFBQ2Y7QUFsSGEsQUFvSGQ7QUFwSGMsa0RBb0hlOzZDQUFYLEFBQVcsNkRBQVg7QUFBVyx5Q0FBQTtBQUMzQjs7d0JBQWMsWUFBQSxBQUFZLE9BQTFCLEFBQWMsQUFBbUIsQUFDbEM7QUF0SGEsQUF3SGQ7QUF4SGMsa0RBd0hHLEFBQ2Y7aUJBQUEsQUFBTyxBQUNSO0FBMUhhLEFBNEhkO0FBNUhjLHNEQUFBLEFBNEhJLFVBNUhKLEFBNEhjLFNBQVMsQUFDbkM7ZUFBQSxBQUFLLGdCQUFMLEFBQXFCLFlBQXJCLEFBQWlDLEFBQ2xDO0FBOUhhLEFBZ0lkO0FBaEljLHNEQUFBLEFBZ0lJLFVBQVUsQUFDMUI7aUJBQU8sS0FBQSxBQUFLLGdCQUFaLEFBQU8sQUFBcUIsQUFDN0I7QUFsSWEsQUFvSWQ7QUFwSWMsNERBQUEsQUFvSU8sVUFBVSxBQUM3QjtpQkFBTyxLQUFBLEFBQUssZ0JBQVosQUFBTyxBQUFxQixBQUM3QjtBQXRJYSxBQXdJZDtBQXhJYyxzRUFBQSxBQXdJWSxVQXhJWixBQXdJc0IsdUJBQXVCLEFBQ3pEO2NBQU0saUJBQWlCLEtBQUEsQUFBSyxrQkFBNUIsQUFBdUIsQUFBdUIsQUFFOUM7O2NBQUksQ0FBSixBQUFLLGdCQUFnQixBQUNuQjttQkFBQSxBQUFPLEFBQ1I7QUFFRDs7aUJBQU8saUNBQUEsQUFBaUMsU0FDdEMsc0JBQUEsQUFBc0IsS0FBSyxlQUR0QixBQUNMLEFBQTBDLFFBQzFDLGVBQUEsQUFBZSxTQUZqQixBQUUwQixBQUMzQjtBQWxKYSxBQW9KZDtBQXBKYyxvQ0FBQSxBQW9KTCxPQUFPLEFBQ2Q7Y0FBSSxDQUFKLEFBQUssT0FBTyxBQUNWO2lCQUFBLEFBQUssZ0JBQWdCLEdBQXJCLEFBQXFCLEFBQUcsQUFDekI7QUFGRCxpQkFFTyxBQUNMO2lCQUFBLEFBQUssY0FBTCxBQUFtQixBQUNwQjtBQUNEO2lCQUFBLEFBQU8sQUFDUjtBQTNKYSxBQTZKZDtBQTdKYyxvQ0E2SkosQUFDUjtpQkFBQSxBQUFPLEFBQ1I7QUEvSmEsQUFpS2Q7QUFqS2MsMERBaUtPLEFBQ25CO2lCQUFBLEFBQU8sQUFDUjtBQW5LYSxBQXFLZDtBQXJLYyx3Q0FxS0YsQUFDVjtpQkFBTyxLQUFBLEFBQUssY0FBWixBQUEwQixBQUMzQjtBQXZLSCxBQUFnQixBQTBLaEI7QUExS2dCLEFBQ2Q7O2FBeUtGLEFBQU8sQUFDUjtBQTdRSCxBQUFpQixBQWdSakI7QUFoUmlCLEFBRWY7O1dBOFFGLEFBQVMsYUFBVCxBQUFzQixhQUFZLE9BQUQsQUFBUSxPQUFPLFNBQVEsQUFBQyxTQUFTLGlCQUFBO2FBQVMsU0FBVCxBQUFTLEFBQVM7QUFBcEYsQUFBaUMsQUFBdUIsQUFDeEQsS0FEd0QsQ0FBdkI7V0FDakMsQUFBUyxhQUFULEFBQXNCLFNBQVMsRUFBQyxPQUFoQyxBQUErQixBQUFRLEFBQ3ZDO1dBQUEsQUFBUyxhQUFULEFBQXNCLE9BQU8sRUFBQyxPQUE5QixBQUE2QixBQUFRLEFBQ3JDO1dBQUEsQUFBUyxhQUFULEFBQXNCLFVBQVMsT0FBRCxBQUFRLE1BQU0sU0FBUSxBQUFDLFNBQVMsaUJBQUE7YUFBUyxNQUFBLEFBQU0sTUFBZixBQUFTLEFBQVk7QUFBbkYsQUFBOEIsQUFBc0IsQUFFcEQsS0FGb0QsQ0FBdEI7O1NBRTlCLEFBQU8sQUFDUjtBQWhTRDs7SSxBQWtTTTs7Ozs7OztrRCxBQUNDLHNCQUFzQixBQUN6QjtBQUNBOzthQUFPLHFCQUFQLEFBQU8sQUFBcUIsQUFDN0I7Ozs7Ozs7QUFHSCxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFNBQWhDLEFBQXlDLFNBQVMsSUFBbEQsQUFBa0QsQUFBSTs7QUFFdEQsUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxTQUFoQyxBQUF5QyxnQkFBZ0IsWUFBWSxBQUNuRTtNQUFNLFFBRDZELEFBQ25FLEFBQWM7O01BRHFELEFBRzdELG1CQUNKO2tCQUFBLEFBQVksTUFBWixBQUFrQixVQUFVOzRCQUMxQjs7V0FBQSxBQUFLLE9BQUwsQUFBWSxBQUNaO1dBQUEsQUFBSyxXQUFMLEFBQWdCLEFBQ2hCO1VBQUksRUFBRSxLQUFBLEFBQUssb0JBQVgsQUFBSSxBQUEyQixRQUFRLEFBQ3JDO2FBQUEsQUFBSyxXQUFXLENBQUMsS0FBakIsQUFBZ0IsQUFBTSxBQUN2QjtBQUNGO0FBVmdFOzs7V0FBQTtvQ0FZbkQsQUFDWjtlQUFPLEtBQVAsQUFBWSxBQUNiO0FBZGdFO0FBQUE7O1dBQUE7QUFpQm5FOzs7QUFBTyx3QkFBQSxBQUVBLE1BRkEsQUFFTSxRQUFRLEFBRWpCOztlQUFBLEFBQVMseUJBQVQsQUFBa0MsVUFBbEMsQUFBNEMscUJBQXFCLEFBQy9EO1lBQU0sU0FEeUQsQUFDL0QsQUFBZTt5Q0FEZ0Q7aUNBQUE7OEJBQUE7O1lBRS9EO2dDQUFzQixNQUFBLEFBQU0sS0FBNUIsQUFBc0IsQUFBVywrSUFBYztnQkFBcEMsQUFBb0MsaUJBQzdDOztnQkFBSSxFQUFFLFFBQUEsQUFBUSx5QkFBZCxBQUFJLEFBQW1DLFFBQVEsQUFDN0M7c0JBQUEsQUFBUSxnQkFBZ0IsQ0FBQyxRQUF6QixBQUF3QixBQUFTLEFBQ2xDO0FBQ0Q7bUJBQUEsQUFBTyxLQUFLLFFBQUEsQUFBUSxnQkFBZ0IsUUFBQSxBQUFRLGNBQVIsQUFBc0IsT0FBMUQsQUFBb0MsQUFBNkIsQUFDbEU7QUFQOEQ7c0JBQUE7K0JBQUE7NEJBQUE7a0JBQUE7Y0FBQTtrRUFBQTt5QkFBQTtBQUFBO29CQUFBO29DQUFBO29CQUFBO0FBQUE7QUFBQTtBQVEvRDs7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7ZUFBQSxBQUFTLG1CQUFULEFBQTRCLFVBQTVCLEFBQXNDLGVBQWUsQUFDbkQ7WUFBTSxTQUQ2QyxBQUNuRCxBQUFlO3lDQURvQztpQ0FBQTs4QkFBQTs7WUFFbkQ7Z0NBQXNCLE1BQUEsQUFBTSxLQUE1QixBQUFzQixBQUFXLCtJQUFjO2dCQUFwQyxBQUFvQyxpQkFDN0M7O2dCQUFJLEVBQUUsYUFBTixBQUFJLEFBQWUsVUFBVSxBQUMzQjtzQkFBQSxBQUFRLFVBQVIsQUFBa0IsQUFDbkI7QUFDRDttQkFBQSxBQUFPLEtBQUssRUFBQSxBQUFFLFNBQVMsUUFBWCxBQUFtQixTQUEvQixBQUFZLEFBQTRCLEFBQ3pDO0FBUGtEO3NCQUFBOytCQUFBOzRCQUFBO2tCQUFBO2NBQUE7a0VBQUE7eUJBQUE7QUFBQTtvQkFBQTtvQ0FBQTtvQkFBQTtBQUFBO0FBQUE7QUFRbkQ7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O2VBQUEsQUFBUyxrQkFBVCxBQUEyQixhQUFhLEFBQ3RDO1lBQU0sb0JBQW9CLENBQ3hCLEVBQUMsTUFBRCxBQUFPLG1DQUFtQyxlQURsQixBQUN4QixBQUF5RCwrQkFDekQsRUFBQyxNQUFELEFBQU8saUNBQWlDLGVBRmhCLEFBRXhCLEFBQXVELDZCQUN2RCxFQUFDLE1BQUQsQUFBTyx3QkFBd0IsZUFIUCxBQUd4QixBQUE4QyxvQkFDOUMsRUFBQyxNQUFELEFBQU8sMEJBQTBCLGVBTEcsQUFDdEMsQUFBMEIsQUFJeEIsQUFBZ0Q7OzBDQUxaO2tDQUFBOytCQUFBOztZQVF0QztpQ0FBMEIsTUFBQSxBQUFNLEtBQWhDLEFBQTBCLEFBQVcsMEpBQW9CO2dCQUE5QyxBQUE4QyxzQkFDdkQ7O2dCQUFJLFlBQUEsQUFBWSxRQUFoQixBQUF3QixRQUFRLEFBQzlCO2tDQUFBLEFBQW9CLGFBQWEsWUFBakMsQUFBNkMsZUFBZSxPQUFPLFlBQW5FLEFBQTRELEFBQW1CLEFBQ2hGO0FBQ0Y7QUFacUM7c0JBQUE7Z0NBQUE7NkJBQUE7a0JBQUE7Y0FBQTtvRUFBQTswQkFBQTtBQUFBO29CQUFBO3FDQUFBO29CQUFBO0FBQUE7QUFBQTtBQWN0Qzs7WUFBSSx5QkFBSixBQUE2QixRQUFRLEFBQ25DO21DQUFBLEFBQXlCLGFBQWEsT0FBdEMsQUFBc0MsQUFBTyxBQUM5QztBQUVEOztZQUFJLG1CQUFKLEFBQXVCLFFBQVEsQUFDN0I7aUJBQU8sbUJBQUEsQUFBbUIsYUFBYSxPQUF2QyxBQUFPLEFBQWdDLEFBQU8sQUFDL0M7QUFDRjtBQUVEOztlQUFBLEFBQVMsb0JBQVQsQUFBNkIsVUFBN0IsQUFBdUMsV0FBdkMsQUFBa0QsY0FBYyxBQUM5RDtZQUFNLFNBRHdELEFBQzlELEFBQWU7MENBRCtDO2tDQUFBOytCQUFBOztZQUU5RDtpQ0FBc0IsTUFBQSxBQUFNLEtBQTVCLEFBQXNCLEFBQVcsb0pBQWM7Z0JBQXBDLEFBQW9DLGtCQUM3Qzs7Z0JBQUksWUFBSixBQUNBO2dCQUFJLEVBQUUsYUFBTixBQUFJLEFBQWUsVUFBVSxBQUMzQjtxQkFBTyxRQUFBLEFBQVEsYUFBZixBQUE0QixBQUM3QjtBQUNEO21CQUFBLEFBQU8sS0FBUCxBQUFZLEFBQ2I7QUFSNkQ7c0JBQUE7Z0NBQUE7NkJBQUE7a0JBQUE7Y0FBQTtvRUFBQTswQkFBQTtBQUFBO29CQUFBO3FDQUFBO29CQUFBO0FBQUE7QUFBQTtBQVM5RDs7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7VUFBSSxjQUFKLEFBQWtCLEFBQ2xCO1VBQUksY0FBSixBQUFrQixRQUFRLEFBQ3hCO3NCQUFjLE9BQWQsQUFBYyxBQUFPLEFBQ3RCO0FBRkQsYUFFTyxBQUNMO3NCQUFlLGtCQUFELEFBQW1CLFFBQW5CLEFBQTRCLFNBQVMsQ0FBbkQsQUFBbUQsQUFBQyxBQUNyRDtBQUVEOztVQUFJLEVBQUUsWUFBQSxBQUFZLFNBQWxCLEFBQUksQUFBdUIsSUFBSSxBQUM3QjtjQUFNLElBQUEsQUFBSSxnRUFBSixBQUFpRSxPQUF2RSxBQUNEO0FBRUQ7O3dCQUFBLEFBQWtCLEFBQ2xCO2FBQU8sTUFBQSxBQUFNLFFBQVEsSUFBQSxBQUFJLEtBQUosQUFBUyxNQUE5QixBQUFxQixBQUFlLEFBQ3JDO0FBMUVJLEFBNEVMO0FBNUVLLDBCQTRFRSxBQUNMOztBQUFPLGtDQUFBLEFBQ0csTUFBTSxBQUNaO2lCQUFPLE1BQVAsQUFBTyxBQUFNLEFBQ2Q7QUFISCxBQUFPLEFBS1I7QUFMUSxBQUNMO0FBOUVOLEFBQU8sQUFvRlI7QUFwRlEsQUFFTDtBQW5CSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJhbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicsIFsnbmdBbmltYXRlJ10pLnJ1bihmdW5jdGlvbiAoU3RhdGUsIFJvdXRlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE9iamVjdEhlbHBlciwgUGVuZGluZ1ZpZXdDb3VudGVyKSB7XG4gIFwibmdJbmplY3RcIjtcblxuICBsZXQgb2xkVXJsID0gdW5kZWZpbmVkO1xuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJvdXRlLmlzUmVhZHkoKSkge1xuICAgICAgUm91dGUuc2V0UmVhZHkoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZSwgbmV3VXJsKSB7XG4gICAgLy8gV29yay1hcm91bmQgZm9yIEFuZ3VsYXJKUyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2lzc3Vlcy84MzY4XG4gICAgbGV0IGRhdGE7XG5cbiAgICBpZiAobmV3VXJsID09PSBvbGRVcmwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvbGRVcmwgPSBuZXdVcmw7XG5cbiAgICBQZW5kaW5nVmlld0NvdW50ZXIucmVzZXQoKTtcbiAgICBjb25zdCBtYXRjaCA9IFJvdXRlLm1hdGNoKCRsb2NhdGlvbi5wYXRoKCkpO1xuXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gUm91dGUuZXh0cmFjdERhdGEobWF0Y2gpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHNUb1Vuc2V0ID0gT2JqZWN0SGVscGVyLm5vdEluKFN0YXRlLmxpc3QsIGRhdGEpO1xuICAgIGZpZWxkc1RvVW5zZXQgPSBfLmRpZmZlcmVuY2UoZmllbGRzVG9VbnNldCwgUm91dGUuZ2V0UGVyc2lzdGVudFN0YXRlcygpLmNvbmNhdChSb3V0ZS5nZXRGbGFzaFN0YXRlcygpKSk7XG5cbiAgICBjb25zdCBldmVudERhdGEgPSB7dW5zZXR0aW5nOiBmaWVsZHNUb1Vuc2V0LCBzZXR0aW5nOiBkYXRhfTtcblxuICAgICRyb290U2NvcGUuJGVtaXQoJ2JpY2tlcl9yb3V0ZXIuYmVmb3JlU3RhdGVDaGFuZ2UnLCBldmVudERhdGEpO1xuXG4gICAgaWYgKChldmVudERhdGEudW5zZXR0aW5nKS5sZW5ndGggIT09IDApIHtcbiAgICAgIFN0YXRlLnVuc2V0KGV2ZW50RGF0YS51bnNldHRpbmcpO1xuICAgIH1cblxuICAgIF8uZm9yRWFjaChldmVudERhdGEuc2V0dGluZywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIFJvdXRlLnJlc2V0Rmxhc2hTdGF0ZXMoKTtcbiAgICBSb3V0ZS5zZXRSZWFkeSh0cnVlKTtcbiAgfSk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5jb25zdGFudCgnT2JqZWN0SGVscGVyJywge1xuICBnZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XTtcbiAgfSxcblxuICBzZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIGlmIChwYXJlbnRbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJlbnRbc2VnbWVudF0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XSA9IHZhbHVlO1xuICB9LFxuXG4gIHVuc2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cblxuICAgIGlmIChwYXJlbnRba2V5XSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGRlbGV0ZSBwYXJlbnRba2V5XTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICAvLyBSZWN1cnNpdmVseSByZXR1cm4gdGhlIHByb3BlcnRpZXMgaW4gYSB0aGF0IGFyZW4ndCBpbiBiXG4gIG5vdEluKGEsIGIsIHByZWZpeCA9ICcnKSB7XG4gICAgbGV0IG5vdEluID0gW107XG4gICAgcHJlZml4ID0gcHJlZml4Lmxlbmd0aCA+IDAgPyBgJHtwcmVmaXh9LmAgOiAnJztcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIEFycmF5LmZyb20oT2JqZWN0LmtleXMoYSkpKSB7XG4gICAgICBjb25zdCB0aGlzUGF0aCA9IGAke3ByZWZpeH0ke2tleX1gO1xuXG4gICAgICBpZiAoYltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm90SW4ucHVzaCh0aGlzUGF0aCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBhW2tleV0gPT09ICdvYmplY3QnKSAmJiAoIShhW2tleV0gaW5zdGFuY2VvZiBBcnJheSkpKSB7XG4gICAgICAgIG5vdEluID0gbm90SW4uY29uY2F0KHRoaXMubm90SW4oYVtrZXldLCBiW2tleV0sIHRoaXNQYXRoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdEluO1xuICB9LFxuXG4gIGRlZmF1bHQob3ZlcnJpZGVzLCAuLi5kZWZhdWx0U2V0cykge1xuICAgIGxldCBkZWZhdWx0U2V0LCB2YWx1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgIGlmIChkZWZhdWx0U2V0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGRlZmF1bHRTZXQgPSBkZWZhdWx0U2V0c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFNldCA9IHRoaXMuZGVmYXVsdCguLi5BcnJheS5mcm9tKGRlZmF1bHRTZXRzIHx8IFtdKSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGVmYXVsdFNldCkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0U2V0W2tleV07XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIG92ZXJyaWRlc1trZXldID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMuZGVmYXVsdChvdmVycmlkZXNba2V5XSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvdmVycmlkZXMpIHtcbiAgICAgIHZhbHVlID0gb3ZlcnJpZGVzW2tleV07XG4gICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldIHx8IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuXG5cbi8vIFVzYWdlOlxuLy9cbi8vIElmIHlvdSB3YW50IHRvIGFkZCB0aGUgY2xhc3MgXCJhY3RpdmVcIiB0byBhbiBhbmNob3IgZWxlbWVudCB3aGVuIHRoZSBcIm1haW5cIiB2aWV3IGhhcyBhIGJpbmRpbmdcbi8vIHdpdGggdGhlIG5hbWUgXCJteUJpbmRpbmdcIiByZW5kZXJlZCB3aXRoaW4gaXRcbi8vXG4vLyA8YSByb3V0ZS1jbGFzcz1cInsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6ICdteUJpbmRpbmcnIH1cIj5BbmNob3IgdGV4dDwvYT5cbi8vXG4vLyBZb3UgY2FuIGFsc28gdXNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHRoZSBiaW5kaW5nIG5hbWUsIGJ1dCB0byBkbyBzbyB5b3UgaGF2ZSB0byBwcm92aWRlIGEgbWV0aG9kXG4vLyBvbiB5b3VyIGNvbnRyb2xsZXIgd2hpY2ggcmV0dXJucyB0aGUgcm91dGUgY2xhc3MgZGVmaW5pdGlvbiBvYmplY3QsIGJlY2F1c2UgQW5ndWxhckpTIGV4cHJlc3Npb25zXG4vLyBkb24ndCBzdXBwb3J0IGlubGluZSByZWd1bGFyIGV4cHJlc3Npb25zXG4vL1xuLy8gY2xhc3MgTXlDb250cm9sbGVyIHtcbi8vICBnZXRSb3V0ZUNsYXNzT2JqZWN0KCkge1xuLy8gICAgcmV0dXJuIHsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6IC9teUJpbmQvIH1cbi8vICB9XG4vLyB9XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCIkY3RybC5nZXRSb3V0ZUNsYXNzT2JqZWN0KClcIj5BbmNob3IgdGV4dDwvYT5cbi8vXG5cbmZ1bmN0aW9uIHJvdXRlQ2xhc3NGYWN0b3J5KFJvdXRlKSB7XG4gICduZ0luamVjdCdcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goKCkgPT4ge1xuICAgICAgICBjb25zdCByb3V0ZUNsYXNzRGVmaW5pdGlvbiA9IHNjb3BlLiRldmFsKGlBdHRyc1sncm91dGVDbGFzcyddKVxuXG4gICAgICAgIGlmICghUm91dGUubWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZShyb3V0ZUNsYXNzRGVmaW5pdGlvbi52aWV3TmFtZSwgcm91dGVDbGFzc0RlZmluaXRpb24uYmluZGluZ05hbWUpKSB7XG4gICAgICAgICAgaWYgKGlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5hZGRDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVDbGFzcycsIHJvdXRlQ2xhc3NGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVIcmVmRmFjdG9yeSAoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0J1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBzY29wZTogdHJ1ZSxcbiAgICBsaW5rIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgaWYgKGlBdHRycy5pZ25vcmVIcmVmID09PSB1bmRlZmluZWQgJiYgUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgaUVsZW1lbnQuY2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgdXJsUGF0aCA9IGlFbGVtZW50LmF0dHIoJ2hyZWYnKS5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiAkbG9jYXRpb24udXJsKHVybFBhdGgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgY29uc3Qgd3JpdGVyID0gb2JqZWN0W3dyaXRlck5hbWVdO1xuICAgICAgICBzY29wZVtgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gd3JpdGVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2NvcGUuJHdhdGNoKGlBdHRycy5yb3V0ZUhyZWYsIChuZXdVcmwpID0+IHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYgKFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgdXJsID0gbmV3VXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybCA9IGAjJHtuZXdVcmx9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaUVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlSHJlZicsIHJvdXRlSHJlZkZhY3RvcnkpO1xuXG4vLyBAVE9ETyBub25lIG9mIHRoZSBhbmltYXRpb24gY29kZSBpbiB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiB0ZXN0ZWQuIE5vdCBzdXJlIGlmIGl0IGNhbiBiZSBhdCB0aGlzIHN0YWdlIFRoaXMgbmVlZHMgZnVydGhlciBpbnZlc3RpZ2F0aW9uLlxuLy8gQFRPRE8gdGhpcyBjb2RlIGRvZXMgdG9vIG11Y2gsIGl0IHNob3VsZCBiZSByZWZhY3RvcmVkLlxuXG5mdW5jdGlvbiByb3V0ZVZpZXdGYWN0b3J5KCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsICR0ZW1wbGF0ZVJlcXVlc3QsIFJvdXRlKSB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZTogZmFsc2UsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXY+PC9kaXY+JyxcbiAgICBsaW5rICh2aWV3RGlyZWN0aXZlU2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGxldCB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgbGV0IHZpZXdTY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHZpZXcgPSBWaWV3QmluZGluZ3MuZ2V0VmlldyhpQXR0cnMubmFtZSk7XG4gICAgICBjb25zdCBiaW5kaW5ncyA9IHZpZXcuZ2V0QmluZGluZ3MoKTtcbiAgICAgIGxldCByZWxvYWRpbmcgPSBmYWxzZVxuXG4gICAgICBpRWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXG4gICAgICBsZXQgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVEYXRhRm9yQmluZGluZyA9IGJpbmRpbmcgPT4gXy5jbG9uZURlZXAoU3RhdGUuZ2V0U3Vic2V0KGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcoYmluZGluZykpKTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgZmllbGQpIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgIGZpZWxkID0gJ2NvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlID0gYmluZGluZ1tmaWVsZF0gPyAkaW5qZWN0b3IuZ2V0KGAke2JpbmRpbmdbZmllbGRdfURpcmVjdGl2ZWApWzBdIDogYmluZGluZztcbiAgICAgICAgcmV0dXJuIF8uZGVmYXVsdHMoXy5waWNrKHNvdXJjZSwgWydjb250cm9sbGVyJywgJ3RlbXBsYXRlVXJsJywgJ2NvbnRyb2xsZXJBcyddKSwge2NvbnRyb2xsZXJBczogJyRjdHJsJ30pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNSZXF1aXJlZERhdGEoYmluZGluZykge1xuICAgICAgICBjb25zdCByZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdO1xuXG4gICAgICAgIGZvciAobGV0IHJlcXVpcmVtZW50IG9mIEFycmF5LmZyb20ocmVxdWlyZWRTdGF0ZSkpIHtcbiAgICAgICAgICBsZXQgbmVnYXRlUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCchJyA9PT0gcmVxdWlyZW1lbnQuY2hhckF0KDApKSB7XG4gICAgICAgICAgICByZXF1aXJlbWVudCA9IHJlcXVpcmVtZW50LnNsaWNlKDEpO1xuICAgICAgICAgICAgbmVnYXRlUmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgZWxlbWVudCA9IFN0YXRlLmdldChyZXF1aXJlbWVudCk7XG5cbiAgICAgICAgICAvLyBSZXR1cm4gZmFsc2UgaWYgZWxlbWVudCBpcyB1bmRlZmluZWRcbiAgICAgICAgICBpZiAoKGVsZW1lbnQgPT09IG51bGwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT25seSBjaGVjayB2YWx1ZSBvZiBlbGVtZW50IGlmIGl0IGlzIGRlZmluZWRcbiAgICAgICAgICBpZiAobmVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gIWVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiaW5kaW5nLmNhbkFjdGl2YXRlKSB7XG4gICAgICAgICAgaWYgKCEkaW5qZWN0b3IuaW52b2tlKGJpbmRpbmcuY2FuQWN0aXZhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1hbmFnZVZpZXcoZWxlbWVudCwgYmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdCaW5kaW5nID0gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKTtcblxuICAgICAgICBpZiAoIW1hdGNoaW5nQmluZGluZykge1xuICAgICAgICAgIGlmICh2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3lWaWV3KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBSb3V0ZS5kZWxldGVDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAkcS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IGdldFN0YXRlRGF0YUZvckJpbmRpbmcobWF0Y2hpbmdCaW5kaW5nKTtcblxuICAgICAgICBpZiAoIXJlbG9hZGluZyAmJiAobWF0Y2hpbmdCaW5kaW5nID09PSBwcmV2aW91c0JpbmRpbmcpICYmIGFuZ3VsYXIuZXF1YWxzKHByZXZpb3VzQm91bmRTdGF0ZSwgbmV3U3RhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuICRxLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWxvYWRpbmcgc3RhdGUgPSAnLCByZWxvYWRpbmcpXG5cbiAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gbWF0Y2hpbmdCaW5kaW5nO1xuICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgICAgICBQZW5kaW5nVmlld0NvdW50ZXIuaW5jcmVhc2UoKTtcblxuICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZykudGhlbihmdW5jdGlvbiAoaGFzUmVzb2x2aW5nVGVtcGxhdGUpIHtcbiAgICAgICAgICAvLyBAVE9ETzogTWFnaWMgbnVtYmVyXG4gICAgICAgICAgY29uc3QgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24gPSBoYXNSZXNvbHZpbmdUZW1wbGF0ZSA/IDMwMCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmICghdmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkYW5pbWF0ZS5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykge1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShiaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZXN0cm95VmlldyhlbGVtZW50KSB7XG4gICAgICAgIGlmICh2aWV3Q3JlYXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgZWxlbWVudC5jaGlsZHJlbigpLmVxKDApLnJlbW92ZSgpO1xuICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY3JlYXRlVmlldyhlbGVtZW50LCBiaW5kaW5nLCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgY29uc3QgdGltZVN0YXJ0ZWRNYWluVmlldyA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcpO1xuXG4gICAgICAgIGNvbnN0IG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24gPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgIGlmIChnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpICE9PSBiaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmlld0NyZWF0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgY29uc3QgcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPSBEYXRlLm5vdygpIC0gdGltZVN0YXJ0ZWRNYWluVmlldztcblxuICAgICAgICAgIGNvbnN0IGluamVjdE1haW5UZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGdpdmUgdGhlIHZpZXcgdGltZSB0byBwcm9wZXJseSBpbml0aWFsaXNlXG4gICAgICAgICAgICAgIC8vIGJlZm9yZSBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIHRoZSBpbnRpYWxWaWV3c0xvYWRlZCBldmVudFxuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSA9IE1hdGgubWF4KDAsIG1pbmltdW1EZWxheSAtIHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA8IG1pbmltdW1EZWxheSkge1xuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+IGluamVjdE1haW5UZW1wbGF0ZSgpXG4gICAgICAgICAgICAgICwgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0TWFpblRlbXBsYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUmVzb2x1dGlvbkZhaWx1cmUgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJGxvZy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgUm91dGUuc2V0Q3VycmVudEJpbmRpbmcodmlldy5uYW1lLCBiaW5kaW5nKVxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt0ZW1wbGF0ZTogJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLCBkZXBlbmRlbmNpZXM6IHJlc29sdmUoYmluZGluZyl9O1xuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24sIG9uUmVzb2x1dGlvbkZhaWx1cmUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwgfHwgIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIHJldHVybiAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKCRyb290U2NvcGUuJG5ldygpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGJpbmRpbmcuZXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5lcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ2Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgdGVtcGxhdGVGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG4gICAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgICAgYmluZGluZ0NvbXBvbmVudEZpZWxkID0gJ2Vycm9yQ29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWJpbmRpbmdbYmluZGluZ0NvbXBvbmVudEZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpO1xuICAgICAgICBjb25zdCBhcmdzID0ge2RlcGVuZGVuY2llczoge2Vycm9yfX07XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGFyZ3MudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKSB7XG4gICAgICAgIGNvbnN0IHtkZXBlbmRlbmNpZXN9ID0gYXJncztcbiAgICAgICAgY29uc3Qge3RlbXBsYXRlfSA9IGFyZ3M7XG5cbiAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0gXy5tZXJnZShkZXBlbmRlbmNpZXMsIHskc2NvcGU6IHZpZXdTY29wZSwgJGVsZW1lbnQ6IGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKX0pO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2Fscy4kc2NvcGVbY29tcG9uZW50LmNvbnRyb2xsZXJBc10gPSAkY29udHJvbGxlcihjb21wb25lbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9ICdGYWlsZWQgdG8gc2VyaWFsaXplIGVycm9yIG9iamVjdCBmb3IgbG9nZ2luZyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRsb2cuZXJyb3IoYEZhaWxlZCBpbnN0YW50aWF0aW5nIGNvbnRyb2xsZXIgZm9yIHZpZXcgJHt2aWV3fTogJHtlcnJvck1lc3NhZ2V9YCk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlID0gZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHt9KTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCBkZXBlbmRlbmN5TmFtZSBpbiBiaW5kaW5nLnJlc29sdmUpIHtcbiAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5RmFjdG9yeSA9IGJpbmRpbmcucmVzb2x2ZVtkZXBlbmRlbmN5TmFtZV07XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRpbmplY3Rvci5pbnZva2UoZGVwZW5kZW5jeUZhY3RvcnkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRxLnJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcgPSBiaW5kaW5nID0+IF8udW5pb24oYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdLCBiaW5kaW5nLndhdGNoZWRTdGF0ZSB8fCBbXSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0cmlwTmVnYXRpb25QcmVmaXgoc3RyKSB7XG4gICAgICAgIGlmIChzdHIuY2hhckF0KDApID09PSAnIScpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnN1YnN0cigxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbVZpZXcgPSB2aWV3ID0+IF8uZmxhdHRlbihfLm1hcCh2aWV3LmdldEJpbmRpbmdzKCksIGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcpKTtcblxuICAgICAgY29uc3QgZ2V0RmllbGRzVG9XYXRjaCA9IHZpZXcgPT4gXy51bmlxKF8ubWFwKGdldFN0YXRlRmllbGRzRnJvbVZpZXcodmlldyksIHN0cmlwTmVnYXRpb25QcmVmaXgpKTtcblxuICAgICAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzVG9XYXRjaCh2aWV3KTtcblxuICAgICAgcmV0dXJuIFJvdXRlLndoZW5SZWFkeSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRyeSB0byBzdGFydCB0aGUgYmFsbCByb2xsaW5nIGluIGNhc2UgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgYW5kIHdlIGNhbiBjcmVhdGUgdGhlIHZpZXcgaW1tZWRpYXRlbHlcbiAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBEb24ndCBib3RoZXIgcHV0dGluZyBpbiBhIHdhdGNoZXIgaWYgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgdGhhdCB3aWxsIGV2ZXIgdHJpZ2dlciBhIGNoYW5nZSBldmVudFxuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodmlld01hbmFnZW1lbnRQZW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGZpbmlzaCB0aGUgZGlnZXN0IGN5Y2xlIGJlZm9yZSBidWlsZGluZyB0aGUgdmlldywgd2hpY2ggc2hvdWxkXG4gICAgICAgICAgLy8gcHJldmVudCB1cyBmcm9tIHJlLXJlbmRlcmluZyBhIHZpZXcgbXVsdGlwbGUgdGltZXMgaWYgbXVsdGlwbGUgcHJvcGVydGllcyBvZiB0aGUgc2FtZSBzdGF0ZSBkZXBlbmRlbmN5XG4gICAgICAgICAgLy8gZ2V0IGNoYW5nZWQgd2l0aCByZXBlYXRlZCBTdGF0ZS5zZXQgY2FsbHNcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgICAgICByZWxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBTdGF0ZS53YXRjaChmaWVsZHMsIHJlbG9hZCk7XG5cbiAgICAgICAgY29uc3QgZGVyZWdpc3RlckZvcmNlZFJlbG9hZExpc3RlbmVyID0gJHJvb3RTY29wZS4kb24oJ2JpY2tlcl9yb3V0ZXIuZm9yY2VkUmVsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVsb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICByZWxvYWQoKTtcbiAgICAgICAgfSlcblxuICAgICAgICB2aWV3RGlyZWN0aXZlU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcbiAgICAgICAgICBTdGF0ZS5yZW1vdmVXYXRjaGVyKHJlbG9hZCk7XG4gICAgICAgICAgZGVyZWdpc3RlckZvcmNlZFJlbG9hZExpc3RlbmVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCd2aWV3Jywgcm91dGVWaWV3RmFjdG9yeSk7XG5cbmNsYXNzIFBlbmRpbmdWaWV3Q291bnRlciB7XG4gIGNvbnN0cnVjdG9yKCRyb290U2NvcGUpIHtcbiAgICB0aGlzLiRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gIH1cblxuICBpbmNyZWFzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudCArPSAxO1xuICB9XG5cbiAgZGVjcmVhc2UoKSB7XG4gICAgdGhpcy5jb3VudCA9IE1hdGgubWF4KDAsIHRoaXMuY291bnQgLSAxKTtcbiAgICBpZiAodGhpcy5jb3VudCA9PT0gMCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCkge1xuICAgICAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmluaXRpYWxWaWV3c0xvYWRlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuY3VycmVudFZpZXdzTG9hZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdQZW5kaW5nVmlld0NvdW50ZXInLCAoJHJvb3RTY29wZSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFBlbmRpbmdWaWV3Q291bnRlcigkcm9vdFNjb3BlKTtcbn0pO1xuXG5jbGFzcyBXYXRjaGFibGVMaXN0IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSwgbGlzdCkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcblxuICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgdGhpcy53YXRjaGVycyA9IFtdO1xuICB9XG5cbiAgZ2V0KHBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gIH1cblxuICBnZXRBbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdDtcbiAgfVxuXG4gIGdldFN1YnNldChwYXRocykge1xuICAgIHJldHVybiBfLnppcE9iamVjdChwYXRocywgXy5tYXAocGF0aHMsIHRoaXMuZ2V0LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIHNldChwYXRoLCB2YWx1ZSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyLnNldCh0aGlzLmxpc3QsIHBhdGgsIHZhbHVlKTtcbiAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB2YWx1ZSk7XG4gIH1cblxuICB1bnNldChwYXRocykge1xuICAgIGlmICghKHBhdGhzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBwYXRocyA9IFtwYXRoc107XG4gICAgfVxuXG4gICAgXyhwYXRocykuZWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy5PYmplY3RIZWxwZXIudW5zZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cblxuICB3YXRjaChwYXRocywgaGFuZGxlcikge1xuICAgIGlmICghKHBhdGhzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBwYXRocyA9IFtwYXRoc107XG4gICAgfVxuXG4gICAgXyhwYXRocykuZWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy53YXRjaGVycy5wdXNoKHRoaXMuV2F0Y2hlckZhY3RvcnkuY3JlYXRlKHBhdGgsIGhhbmRsZXIsIHRoaXMuZ2V0KHBhdGgpKSk7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVXYXRjaGVyKHdhdGNoZXIpIHtcbiAgICBpZiAodGhpcy53YXRjaGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmV3V2F0Y2hlcnMgPSBbXTtcblxuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB0aGlzV2F0Y2hlciA9PiB7XG4gICAgICBpZiAodGhpc1dhdGNoZXIuaGFuZGxlciAhPT0gd2F0Y2hlcikge1xuICAgICAgICBuZXdXYXRjaGVycy5wdXNoKHRoaXNXYXRjaGVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLndhdGNoZXJzID0gbmV3V2F0Y2hlcnM7XG4gIH1cblxuICBfbm90aWZ5V2F0Y2hlcnMoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHdhdGNoZXIgPT4ge1xuICAgICAgaWYgKHdhdGNoZXIuc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoZWRQYXRoID0gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgd2F0Y2hlci53YXRjaFBhdGgpO1xuICAgICAgICB3YXRjaGVyLm5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWVBdFdhdGNoZWRQYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGFibGVMaXN0RmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG4gIH1cblxuICBjcmVhdGUobGlzdCA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0KHRoaXMuT2JqZWN0SGVscGVyLCB0aGlzLldhdGNoZXJGYWN0b3J5LCBsaXN0KTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoYWJsZUxpc3RGYWN0b3J5JywgKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0RmFjdG9yeShPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KTtcbn0pO1xuXG5jbGFzcyBXYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLndhdGNoUGF0aCA9IHdhdGNoUGF0aDtcbiAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAoaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIF90b2tlbml6ZVBhdGgocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJyk7XG4gIH1cblxuICBzaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgLy8gTkIgc2hvcnQgY2lyY3VpdCBsb2dpYyBpbiB0aGUgc2ltcGxlIGNhc2VcbiAgICBpZiAodGhpcy53YXRjaFBhdGggPT09IGNoYW5nZWRQYXRoKSB7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHRoaXMuY3VycmVudFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2F0Y2ggPSB7XG4gICAgICBwYXRoOiB0aGlzLndhdGNoUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKHRoaXMud2F0Y2hQYXRoKSxcbiAgICAgIHZhbHVlOiB0aGlzLmN1cnJlbnRWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBjaGFuZ2UgPSB7XG4gICAgICBwYXRoOiBjaGFuZ2VkUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKGNoYW5nZWRQYXRoKSxcbiAgICAgIHZhbHVlOiBuZXdWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBtaW5pbXVtTGVudGggPSBNYXRoLm1pbihjaGFuZ2UudG9rZW5zLmxlbmd0aCwgd2F0Y2gudG9rZW5zLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgdG9rZW5JbmRleCA9IDA7IHRva2VuSW5kZXggPCBtaW5pbXVtTGVudGg7IHRva2VuSW5kZXgrKykge1xuICAgICAgaWYgKHdhdGNoLnRva2Vuc1t0b2tlbkluZGV4XSAhPT0gY2hhbmdlLnRva2Vuc1t0b2tlbkluZGV4XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTkIgaWYgd2UgZ2V0IGhlcmUgdGhlbiBhbGwgY29tbW9uIHRva2VucyBtYXRjaFxuXG4gICAgY29uc3QgY2hhbmdlUGF0aElzRGVzY2VuZGFudCA9IGNoYW5nZS50b2tlbnMubGVuZ3RoID4gd2F0Y2gudG9rZW5zLmxlbmd0aDtcblxuICAgIGlmIChjaGFuZ2VQYXRoSXNEZXNjZW5kYW50KSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBjaGFuZ2UudG9rZW5zLnNsaWNlKHdhdGNoLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGggPSBfLmdldCh3YXRjaC52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMoY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCwgY2hhbmdlLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gd2F0Y2gudG9rZW5zLnNsaWNlKGNoYW5nZS50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hQYXRoID0gXy5nZXQoY2hhbmdlLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh3YXRjaC52YWx1ZSwgbmV3VmFsdWVBdFdhdGNoUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIHRoaXMuaGFuZGxlcihjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIHRoaXMuY3VycmVudFZhbHVlKTtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKG5ld1ZhbHVlKTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGVyRmFjdG9yeSB7XG4gIGNyZWF0ZSh3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hlcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGVyRmFjdG9yeScsICgpID0+IHtcbiAgcmV0dXJuIG5ldyBXYXRjaGVyRmFjdG9yeSgpO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1JvdXRlJywgZnVuY3Rpb24oT2JqZWN0SGVscGVyKSB7XG4gIFwibmdJbmplY3RcIjtcbiAgY29uc3QgdG9rZW5zID0ge307XG4gIGNvbnN0IHVybFdyaXRlcnMgPSBbXTtcbiAgY29uc3QgdXJscyA9IFtdO1xuICBjb25zdCBwZXJzaXN0ZW50U3RhdGVzID0gW107XG4gIGNvbnN0IHJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHR5cGVzID0ge307XG4gIGxldCBodG1sNU1vZGUgPSBmYWxzZTtcblxuICBjb25zdCBwcm92aWRlciA9IHtcblxuICAgIHJlZ2lzdGVyVHlwZShuYW1lLCBjb25maWcpIHtcbiAgICAgIHR5cGVzW25hbWVdID0gY29uZmlnO1xuICAgICAgdHlwZXNbbmFtZV0ucmVnZXggPSBuZXcgUmVnRXhwKHR5cGVzW25hbWVdLnJlZ2V4LnNvdXJjZSwgJ2knKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclR5cGUgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsVG9rZW4obmFtZSwgY29uZmlnKSB7XG4gICAgICB0b2tlbnNbbmFtZV0gPSBfLmV4dGVuZCh7bmFtZX0sIGNvbmZpZyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxUb2tlbiB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxXcml0ZXIobmFtZSwgZm4pIHtcbiAgICAgIHVybFdyaXRlcnNbbmFtZV0gPSBmbjtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFdyaXRlciB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmwocGF0dGVybiwgY29uZmlnID0ge30pIHtcbiAgICAgIGNvbnN0IHVybERhdGEgPSB7XG4gICAgICAgIGNvbXBpbGVkVXJsOiB0aGlzLl9jb21waWxlVXJsUGF0dGVybihwYXR0ZXJuLCBjb25maWcpLFxuICAgICAgICBwYXR0ZXJuXG4gICAgICB9O1xuXG4gICAgICB1cmxzLnB1c2goXy5leHRlbmQodXJsRGF0YSwgY29uZmlnKSk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmwgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHNldFBlcnNpc3RlbnRTdGF0ZXMoLi4uc3RhdGVMaXN0KSB7XG4gICAgICBfLmZvckVhY2goc3RhdGVMaXN0LCAoc3RhdGUpID0+IHtcbiAgICAgICAgaWYgKCFwZXJzaXN0ZW50U3RhdGVzLmluY2x1ZGVzKHN0YXRlKSkge1xuICAgICAgICAgIHBlcnNpc3RlbnRTdGF0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRIdG1sNU1vZGUobW9kZSkge1xuICAgICAgaHRtbDVNb2RlID0gbW9kZTtcbiAgICB9LFxuXG4gICAgX2NvbXBpbGVVcmxQYXR0ZXJuKHVybFBhdHRlcm4sIGNvbmZpZykge1xuICAgICAgbGV0IG1hdGNoO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnModXJsUGF0dGVybik7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHVybFBhdHRlcm4pO1xuXG4gICAgICBjb25zdCB0b2tlblJlZ2V4ID0gL1xceyhbQS1aYS16XFwuXzAtOV0rKVxcfS9nO1xuICAgICAgbGV0IHVybFJlZ2V4ID0gdXJsUGF0dGVybjtcblxuICAgICAgaWYgKCFjb25maWcucGFydGlhbE1hdGNoKSB7XG4gICAgICAgIHVybFJlZ2V4ID0gYF4ke3VybFJlZ2V4fSRgO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b2tlbkxpc3QgPSBbXTtcblxuICAgICAgd2hpbGUgKChtYXRjaCA9IHRva2VuUmVnZXguZXhlYyh1cmxQYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbbWF0Y2hbMV1dO1xuICAgICAgICB0b2tlbkxpc3QucHVzaCh0b2tlbik7XG4gICAgICAgIHVybFJlZ2V4ID0gdXJsUmVnZXgucmVwbGFjZShtYXRjaFswXSwgYCgke3R5cGVzW3Rva2VuLnR5cGVdLnJlZ2V4LnNvdXJjZX0pYCk7XG4gICAgICB9XG5cbiAgICAgIHVybFJlZ2V4LnJlcGxhY2UoJy4nLCAnXFxcXC4nKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyksXG4gICAgICAgIHRva2VuczogdG9rZW5MaXN0XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBfZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHN0cikge1xuICAgICAgaWYgKHN0ci5tYXRjaCgvXFwvJC8pKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwvJC8sICcvPycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGAke3N0cn0vP2A7XG4gICAgfSxcblxuICAgIF9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFwoXFwpXFwqXFwrXFw/XFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gICAgfSxcblxuICAgICRnZXQoJGxvY2F0aW9uLCAkaW5qZWN0b3IsICRxLCAkcm9vdFNjb3BlKSB7XG4gICAgICAnbmdJbmplY3QnO1xuXG4gICAgICAvLyBXaGVuIGdldHRpbmcgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHNlcnZpY2UgKG9ubHkgZG9uZSBvbmNlKSwgd2UgbmVlZCB0byBpdGVyYXRlIG92ZXIgdGhlIHVybFdyaXRlcnMgYW5kIHR1cm5cbiAgICAgIC8vIHRoZW0gaW50byBtZXRob2RzIHRoYXQgaW52b2tlIHRoZSBSRUFMIHVybFdyaXRlciwgYnV0IHByb3ZpZGluZyBkZXBlbmRlbmN5IGluamVjdGlvbiB0byBpdCwgd2hpbGUgYWxzb1xuICAgICAgLy8gZ2l2aW5nIGl0IHRoZSBkYXRhIHRoYXQgdGhlIGNhbGxlZSBwYXNzZXMgaW4uXG5cbiAgICAgIC8vIFRoZSByZWFzb24gd2UgaGF2ZSB0byBkbyB0aGlzIGhlcmUgaXMgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGUgJGluamVjdG9yIGJhY2sgaW4gdGhlIHJvdXRlUHJvdmlkZXIuXG5cbiAgICAgIF8uZm9ySW4odXJsV3JpdGVycywgKHdyaXRlciwgd3JpdGVyTmFtZSkgPT5cbiAgICAgICAgdXJsV3JpdGVyc1t3cml0ZXJOYW1lXSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBpZiAoIWRhdGEpIHsgZGF0YSA9IHt9OyB9XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0ge1VybERhdGE6IGRhdGF9O1xuICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKHdyaXRlciwge30sIGxvY2Fscyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGxldCBmbGFzaFN0YXRlcyA9IFtdO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0ge1xuICAgICAgICBjdXJyZW50QmluZGluZ3M6IHt9LFxuICAgICAgICByZWFkeURlZmVycmVkOiAkcS5kZWZlcigpLFxuXG4gICAgICAgIG1hdGNoKHVybFRvTWF0Y2gpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHVybCBvZiBBcnJheS5mcm9tKHVybHMpKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gdXJsLmNvbXBpbGVkVXJsLnJlZ2V4LmV4ZWModXJsVG9NYXRjaCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7dXJsLCByZWdleE1hdGNoOiBtYXRjaH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REYXRhKG1hdGNoLCBzZWFyY2hEYXRhID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB0aGlzLmV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCk7XG4gICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuZXh0cmFjdFBhdGhEYXRhKG1hdGNoKTtcbiAgICAgICAgICBzZWFyY2hEYXRhID0gdGhpcy5leHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKTtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0SGVscGVyLmRlZmF1bHQoc2VhcmNoRGF0YSwgcGF0aCwgZGVmYXVsdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpIHtcbiAgICAgICAgICBpZiAoIXNlYXJjaERhdGEpIHsgc2VhcmNoRGF0YSA9ICRsb2NhdGlvbi5zZWFyY2goKTsgfVxuICAgICAgICAgIGNvbnN0IGRhdGEgPSBfLmNsb25lKHNlYXJjaERhdGEpO1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChkYXRhLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhcmdldEtleSA9IF8uZmluZEtleSh0b2tlbnMsIHsgc2VhcmNoQWxpYXM6IGtleSB9KTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0S2V5KSB7IHRhcmdldEtleSA9IGtleTsgfVxuXG4gICAgICAgICAgICBjb25zdCB0b2tlblR5cGVOYW1lID0gdG9rZW5zW3RhcmdldEtleV0gPyBfLmdldCh0b2tlbnNbdGFyZ2V0S2V5XSwgJ3R5cGUnKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICghdG9rZW5zW3RhcmdldEtleV0gfHwgKHR5cGVzW3Rva2VuVHlwZU5hbWVdLnJlZ2V4LnRlc3QodmFsdWUpKSkge1xuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0udHlwZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdHlwZVRva2VuVHlwZSA9IHRva2VuVHlwZSA/IHR5cGVzW3Rva2VuVHlwZV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZVBhcnNlZCA9IHR5cGVUb2tlblR5cGUgPyB0eXBlVG9rZW5UeXBlLnBhcnNlciA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICBpZiAodG9rZW5UeXBlUGFyc2VkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHRva2VuVHlwZVBhcnNlZCwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnN0YXRlUGF0aCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgZGF0YUtleSA9IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoIHx8IHRhcmdldEtleTtcblxuICAgICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KG5ld0RhdGEsIGRhdGFLZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChtYXRjaC51cmwuc3RhdGUsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsIGtleSwgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyBfLmNsb25lRGVlcCh2YWx1ZSkgOiB2YWx1ZSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFBhdGhEYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICAgIGNvbnN0IHBhdGhUb2tlbnMgPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zO1xuXG4gICAgICAgICAgaWYgKHBhdGhUb2tlbnMubGVuZ3RoID09PSAwKSB7IHJldHVybiB7fTsgfVxuXG4gICAgICAgICAgZm9yIChsZXQgbiA9IDAsIGVuZCA9IHBhdGhUb2tlbnMubGVuZ3RoLTEsIGFzYyA9IDAgPD0gZW5kOyBhc2MgPyBuIDw9IGVuZCA6IG4gPj0gZW5kOyBhc2MgPyBuKysgOiBuLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2Vuc1tuXTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG1hdGNoLnJlZ2V4TWF0Y2hbbisxXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlcikgeyB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7IH1cblxuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCAodG9rZW4uc3RhdGVQYXRoIHx8IHRva2VuLm5hbWUpLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVycygpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVycztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXIobmFtZSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXShkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnbyhuYW1lLCBkYXRhID0ge30sIGZvcmNlUmVsb2FkID0gZmFsc2UpIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50VXJsID0gJGxvY2F0aW9uLnVybCgpO1xuICAgICAgICAgIGNvbnN0IG5ld1VybCA9IHRoaXMuaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEpO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRVcmwgIT09IG5ld1VybCkge1xuICAgICAgICAgICAgcmV0dXJuICRsb2NhdGlvbi51cmwobmV3VXJsKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZm9yY2VSZWxvYWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlbG9hZCgpIHtcbiAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdiaWNrZXJfcm91dGVyLmZvcmNlZFJlbG9hZCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFBlcnNpc3RlbnRTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIHBlcnNpc3RlbnRTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZEZsYXNoU3RhdGVzKC4uLm5ld1N0YXRlcykge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gZmxhc2hTdGF0ZXMuY29uY2F0KG5ld1N0YXRlcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIGZsYXNoU3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lLCBiaW5kaW5nKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdID0gYmluZGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVsZXRlQ3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1hdGNoZXNDdXJyZW50QmluZGluZ05hbWUodmlld05hbWUsIGJpbmRpbmdOYW1lRXhwcmVzc2lvbikge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRCaW5kaW5nID0gdGhpcy5nZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSlcblxuICAgICAgICAgIGlmICghY3VycmVudEJpbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBiaW5kaW5nTmFtZUV4cHJlc3Npb24gaW5zdGFuY2VvZiBSZWdFeHAgP1xuICAgICAgICAgICAgYmluZGluZ05hbWVFeHByZXNzaW9uLnRlc3QoY3VycmVudEJpbmRpbmcubmFtZSkgOlxuICAgICAgICAgICAgY3VycmVudEJpbmRpbmcubmFtZSA9PT0gYmluZGluZ05hbWVFeHByZXNzaW9uO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFJlYWR5KHJlYWR5KSB7XG4gICAgICAgICAgaWYgKCFyZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5yZWFkeURlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWFkeURlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlYWR5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzUmVhZHkoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlYWR5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzSHRtbDVNb2RlRW5hYmxlZCgpIHtcbiAgICAgICAgICByZXR1cm4gaHRtbDVNb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdoZW5SZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkeURlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH1cbiAgfTtcblxuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ251bWVyaWMnLCB7cmVnZXg6IC9cXGQrLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gcGFyc2VJbnQodG9rZW4pXX0pO1xuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ2FscGhhJywge3JlZ2V4OiAvW2EtekEtWl0rL30pO1xuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ2FueScsIHtyZWdleDogLy4rL30pO1xuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ2xpc3QnLCB7cmVnZXg6IC8uKy8sIHBhcnNlcjogWyd0b2tlbicsIHRva2VuID0+IHRva2VuLnNwbGl0KCcsJyldfSk7XG5cbiAgcmV0dXJuIHByb3ZpZGVyO1xufSk7XG5cbmNsYXNzIFN0YXRlUHJvdmlkZXIge1xuICAkZ2V0KFdhdGNoYWJsZUxpc3RGYWN0b3J5KSB7XG4gICAgJ25nSW5qZWN0JztcbiAgICByZXR1cm4gV2F0Y2hhYmxlTGlzdEZhY3RvcnkuY3JlYXRlKCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignU3RhdGUnLCBuZXcgU3RhdGVQcm92aWRlcik7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1ZpZXdCaW5kaW5ncycsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3Qgdmlld3MgPSBbXTtcblxuICBjbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBiaW5kaW5ncykge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICAgIGlmICghKHRoaXMuYmluZGluZ3MgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IFt0aGlzLmJpbmRpbmdzXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRCaW5kaW5ncygpIHtcbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICBiaW5kKG5hbWUsIGNvbmZpZykge1xuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vblJlcXVpcmVkU3RhdGUoYmluZGluZ3MsIGNvbW1vblJlcXVpcmVkU3RhdGUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGlmICghKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgYmluZGluZy5yZXF1aXJlZFN0YXRlID0gW2JpbmRpbmcucmVxdWlyZWRTdGF0ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZS5jb25jYXQoY29tbW9uUmVxdWlyZWRTdGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVzb2x2ZShiaW5kaW5ncywgY29tbW9uUmVzb2x2ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoJ3Jlc29sdmUnIGluIGJpbmRpbmcpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlc29sdmUgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goXy5kZWZhdWx0cyhiaW5kaW5nLnJlc29sdmUsIGNvbW1vblJlc29sdmUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vbkZpZWxkcyhuZXdCaW5kaW5ncykge1xuICAgICAgICBjb25zdCBiYXNpY0NvbW1vbkZpZWxkcyA9IFtcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yQ29tcG9uZW50Jywgb3ZlcnJpZGVGaWVsZDogJ2Vycm9yQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25FcnJvclRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ2Vycm9yVGVtcGxhdGVVcmwnfVxuICAgICAgICBdO1xuXG4gICAgICAgIGZvciAoY29uc3QgY29tbW9uRmllbGQgb2YgQXJyYXkuZnJvbShiYXNpY0NvbW1vbkZpZWxkcykpIHtcbiAgICAgICAgICBpZiAoY29tbW9uRmllbGQubmFtZSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIGRlZmF1bHRCaW5kaW5nRmllbGQobmV3QmluZGluZ3MsIGNvbW1vbkZpZWxkLm92ZXJyaWRlRmllbGQsIGNvbmZpZ1tjb21tb25GaWVsZC5uYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXF1aXJlZFN0YXRlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICBhcHBseUNvbW1vblJlcXVpcmVkU3RhdGUobmV3QmluZGluZ3MsIGNvbmZpZ1snY29tbW9uUmVxdWlyZWRTdGF0ZSddKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29tbW9uUmVzb2x2ZScgaW4gY29uZmlnKSB7XG4gICAgICAgICAgcmV0dXJuIGFwcGx5Q29tbW9uUmVzb2x2ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXNvbHZlJ10pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlZmF1bHRCaW5kaW5nRmllbGQoYmluZGluZ3MsIGZpZWxkTmFtZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBsZXQgaXRlbTtcbiAgICAgICAgICBpZiAoIShmaWVsZE5hbWUgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBiaW5kaW5nW2ZpZWxkTmFtZV0gPSBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGxldCBuZXdCaW5kaW5ncyA9IFtdO1xuICAgICAgaWYgKCdiaW5kaW5ncycgaW4gY29uZmlnKSB7XG4gICAgICAgIG5ld0JpbmRpbmdzID0gY29uZmlnWydiaW5kaW5ncyddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSAoY29uZmlnIGluc3RhbmNlb2YgQXJyYXkpID8gY29uZmlnIDogW2NvbmZpZ107XG4gICAgICB9XG5cbiAgICAgIGlmICghKG5ld0JpbmRpbmdzLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjYWxsIHRvIFZpZXdCaW5kaW5nc1Byb3ZpZGVyLmJpbmQgZm9yIG5hbWUgJyR7bmFtZX0nYCk7XG4gICAgICB9XG5cbiAgICAgIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKTtcbiAgICAgIHJldHVybiB2aWV3c1tuYW1lXSA9IG5ldyBWaWV3KG5hbWUsIG5ld0JpbmRpbmdzKTtcbiAgICB9LFxuXG4gICAgJGdldCgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGdldFZpZXcodmlldykge1xuICAgICAgICAgIHJldHVybiB2aWV3c1t2aWV3XTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59KTtcbiJdfQ==
