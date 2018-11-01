(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

routeViewFactory.$inject = ["$log", "$compile", "$controller", "ViewBindings", "$q", "State", "$rootScope", "$animate", "$timeout", "$injector", "PendingViewCounter", "$templateRequest", "Route"];
routeOnClickFactory.$inject = ["Route", "$location", "$window", "$timeout"];
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
        } else if (!iElement.hasClass(routeClassDefinition.className)) {
          iElement.addClass(routeClassDefinition.className);
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

function routeOnClickFactory(Route, $location, $window, $timeout) {
  'ngInject';

  return {
    restrict: 'A',

    link: function link(scope, element, attrs) {
      var LEFT_BUTTON = 0;
      var MIDDLE_BUTTON = 1;

      if (element.is('a')) {
        addWatchThatUpdatesHrefAttribute();
      } else {
        element.click(function (event) {
          if (event.button === LEFT_BUTTON) {
            navigateToUrl(getUrl(), shouldOpenNewWindow(event));
          }
        });

        element.mouseup(function (event) {
          if (event.button === MIDDLE_BUTTON) {
            navigateToUrl(getUrl(), shouldOpenNewWindow(event));
          }
        });
      }

      function navigateToUrl(_url) {
        var newWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var url = _url;

        if (newWindow) {
          url = $window.location.origin + '/' + url;
          $window.open(url, '_blank');
        } else {
          if (!Route.isHtml5ModeEnabled()) {
            url = url.replace(/^#/, '');
          }
          $timeout(function () {
            return $location.url(url);
          });
        }
      }

      function shouldOpenNewWindow(event) {
        return event.button === MIDDLE_BUTTON || event.button === LEFT_BUTTON && (event.ctrlKey || event.metaKey);
      }

      function getUrl() {
        var urlWriters = Route.getUrlWriters();
        var locals = {};

        for (var writerName in urlWriters) {
          locals[writerName + 'UrlWriter'] = urlWriters[writerName];
        }

        var url = scope.$eval(attrs.routeOnClick, _.assign(locals, scope));

        return html5TheUrl(url);
      }

      function html5TheUrl(url) {
        return Route.isHtml5ModeEnabled() ? url : '#' + url;
      }

      function addWatchThatUpdatesHrefAttribute() {
        scope.$watch(function () {
          return '' + getUrl();
        }, function (newUrl) {
          element.attr('href', newUrl);
        });
      }
    }
  };
}

angular.module('bicker_router').directive('routeOnClick', routeOnClickFactory);

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
      var viewController = {}; // NB will only be defined for components
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

        var bindingChangedEventData = { viewName: iAttrs.name, currentBinding: matchingBinding };
        $rootScope.$broadcast('bicker_router.bindingChanged', bindingChangedEventData);

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
            if (viewController.$onDestroy) {
              viewController.$onDestroy();
            }
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
        if (viewController.$onDestroy) {
          viewController.$onDestroy();
        }
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
          viewController = {};
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
        viewController = {};

        if (component.controller) {
          var locals = _.merge(dependencies, { $scope: viewScope, $element: element.children().eq(0) });

          try {
            viewController = $controller(component.controller, locals);
            locals.$scope[component.controllerAs] = viewController;
            if (viewController.$onInit) {
              viewController.$onInit();
            }
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
        if (!_.includes(persistentStates, state)) {
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
        var basicCommonFields = [{ name: 'commonResolvingTemplateUrl', overrideField: 'resolvingTemplateUrl' }, { name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl' }, { name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent' }, { name: 'commonErrorComponent', overrideField: 'errorComponent' }, { name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl' }];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFpQixDQUFoQyxBQUFnQyxBQUFDLGNBQWpDLEFBQStDLHdGQUFJLFVBQUEsQUFBVSxPQUFWLEFBQWlCLE9BQWpCLEFBQXdCLFdBQXhCLEFBQW1DLFlBQW5DLEFBQStDLGNBQS9DLEFBQTZELG9CQUFvQixBQUNsSTtBQUVBOztNQUFJLFNBQUosQUFBYSxBQUNiO2FBQUEsQUFBVyxJQUFYLEFBQWUsd0JBQXdCLFlBQVksQUFDakQ7UUFBSSxNQUFKLEFBQUksQUFBTSxXQUFXLEFBQ25CO1lBQUEsQUFBTSxTQUFOLEFBQWUsQUFDaEI7QUFDRjtBQUpELEFBTUE7O2FBQUEsQUFBVyxJQUFYLEFBQWUsMEJBQTBCLFVBQUEsQUFBVSxHQUFWLEFBQWEsUUFBUSxBQUM1RDtBQUNBO1FBQUksWUFBSixBQUNBO1FBQUksV0FBSixBQUFlLFFBQVEsQUFDckI7QUFDRDtBQUVEOzthQUFBLEFBQVMsQUFFVDs7dUJBQUEsQUFBbUIsQUFDbkI7UUFBTSxRQUFRLE1BQUEsQUFBTSxNQUFNLFVBQTFCLEFBQWMsQUFBWSxBQUFVLEFBRXBDOztRQUFJLENBQUosQUFBSyxPQUFPLEFBQ1Y7YUFBQSxBQUFPLEFBQ1I7QUFGRCxXQUVPLEFBQ0w7YUFBTyxNQUFBLEFBQU0sWUFBYixBQUFPLEFBQWtCLEFBQzFCO0FBRUQ7O1FBQUksZ0JBQWdCLGFBQUEsQUFBYSxNQUFNLE1BQW5CLEFBQXlCLE1BQTdDLEFBQW9CLEFBQStCLEFBQ25EO29CQUFnQixFQUFBLEFBQUUsV0FBRixBQUFhLGVBQWUsTUFBQSxBQUFNLHNCQUFOLEFBQTRCLE9BQU8sTUFBL0UsQUFBZ0IsQUFBNEIsQUFBbUMsQUFBTSxBQUVyRjs7UUFBTSxZ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RUw7QUE3RUssMEJBNkVFLEFBQ0w7O0FBQU8sa0NBQUEsQUFDRyxNQUFNLEFBQ1o7aUJBQU8sTUFBUCxBQUFPLEFBQU0sQUFDZDtBQUhILEFBQU8sQUFLUjtBQUxRLEFBQ0w7QUEvRU4sQUFBTyxBQXFGUjtBQXJGUSxBQUVMO0FBbkJKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJywgWyduZ0FuaW1hdGUnXSkucnVuKGZ1bmN0aW9uIChTdGF0ZSwgUm91dGUsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgT2JqZWN0SGVscGVyLCBQZW5kaW5nVmlld0NvdW50ZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuXG4gIGxldCBvbGRVcmwgPSB1bmRlZmluZWQ7XG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoUm91dGUuaXNSZWFkeSgpKSB7XG4gICAgICBSb3V0ZS5zZXRSZWFkeShmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uIChlLCBuZXdVcmwpIHtcbiAgICAvLyBXb3JrLWFyb3VuZCBmb3IgQW5ndWxhckpTIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvaXNzdWVzLzgzNjhcbiAgICBsZXQgZGF0YTtcbiAgICBpZiAobmV3VXJsID09PSBvbGRVcmwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvbGRVcmwgPSBuZXdVcmw7XG5cbiAgICBQZW5kaW5nVmlld0NvdW50ZXIucmVzZXQoKTtcbiAgICBjb25zdCBtYXRjaCA9IFJvdXRlLm1hdGNoKCRsb2NhdGlvbi5wYXRoKCkpO1xuXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gUm91dGUuZXh0cmFjdERhdGEobWF0Y2gpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHNUb1Vuc2V0ID0gT2JqZWN0SGVscGVyLm5vdEluKFN0YXRlLmxpc3QsIGRhdGEpO1xuICAgIGZpZWxkc1RvVW5zZXQgPSBfLmRpZmZlcmVuY2UoZmllbGRzVG9VbnNldCwgUm91dGUuZ2V0UGVyc2lzdGVudFN0YXRlcygpLmNvbmNhdChSb3V0ZS5nZXRGbGFzaFN0YXRlcygpKSk7XG5cbiAgICBjb25zdCBldmVudERhdGEgPSB7dW5zZXR0aW5nOiBmaWVsZHNUb1Vuc2V0LCBzZXR0aW5nOiBkYXRhfTtcbiAgICAkcm9vdFNjb3BlLiRlbWl0KCdiaWNrZXJfcm91dGVyLmJlZm9yZVN0YXRlQ2hhbmdlJywgZXZlbnREYXRhKTtcblxuICAgIGlmICgoZXZlbnREYXRhLnVuc2V0dGluZykubGVuZ3RoICE9PSAwKSB7XG4gICAgICBTdGF0ZS51bnNldChldmVudERhdGEudW5zZXR0aW5nKTtcbiAgICB9XG5cbiAgICBfLmZvckVhY2goZXZlbnREYXRhLnNldHRpbmcsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBTdGF0ZS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBSb3V0ZS5yZXNldEZsYXNoU3RhdGVzKCk7XG4gICAgUm91dGUuc2V0UmVhZHkodHJ1ZSk7XG4gIH0pO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ09iamVjdEhlbHBlcicsIHtcbiAgZ2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV07XG4gIH0sXG5cbiAgc2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBpZiAocGFyZW50W3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFyZW50W3NlZ21lbnRdID0ge307XG4gICAgICB9XG5cbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV0gPSB2YWx1ZTtcbiAgfSxcblxuICB1bnNldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG5cbiAgICBpZiAocGFyZW50W2tleV0gPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBkZWxldGUgcGFyZW50W2tleV07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgLy8gUmVjdXJzaXZlbHkgcmV0dXJuIHRoZSBwcm9wZXJ0aWVzIGluIGEgdGhhdCBhcmVuJ3QgaW4gYlxuICBub3RJbihhLCBiLCBwcmVmaXggPSAnJykge1xuICAgIGxldCBub3RJbiA9IFtdO1xuICAgIHByZWZpeCA9IHByZWZpeC5sZW5ndGggPiAwID8gYCR7cHJlZml4fS5gIDogJyc7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKE9iamVjdC5rZXlzKGEpKSkge1xuICAgICAgY29uc3QgdGhpc1BhdGggPSBgJHtwcmVmaXh9JHtrZXl9YDtcblxuICAgICAgaWYgKGJba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vdEluLnB1c2godGhpc1BhdGgpO1xuXG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgYVtrZXldID09PSAnb2JqZWN0JykgJiYgKCEoYVtrZXldIGluc3RhbmNlb2YgQXJyYXkpKSkge1xuICAgICAgICBub3RJbiA9IG5vdEluLmNvbmNhdCh0aGlzLm5vdEluKGFba2V5XSwgYltrZXldLCB0aGlzUGF0aCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub3RJbjtcbiAgfSxcblxuICBkZWZhdWx0KG92ZXJyaWRlcywgLi4uZGVmYXVsdFNldHMpIHtcbiAgICBsZXQgZGVmYXVsdFNldCwgdmFsdWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBpZiAoZGVmYXVsdFNldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBkZWZhdWx0U2V0ID0gZGVmYXVsdFNldHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRTZXQgPSB0aGlzLmRlZmF1bHQoLi4uQXJyYXkuZnJvbShkZWZhdWx0U2V0cyB8fCBbXSkpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRTZXQpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFNldFtrZXldO1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiBvdmVycmlkZXNba2V5XSA9PT0gXCJvYmplY3RcIikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmRlZmF1bHQob3ZlcnJpZGVzW2tleV0sIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3ZlcnJpZGVzKSB7XG4gICAgICB2YWx1ZSA9IG92ZXJyaWRlc1trZXldO1xuICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSB8fCB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxuXG4vLyBVc2FnZTpcbi8vXG4vLyBJZiB5b3Ugd2FudCB0byBhZGQgdGhlIGNsYXNzIFwiYWN0aXZlXCIgdG8gYW4gYW5jaG9yIGVsZW1lbnQgd2hlbiB0aGUgXCJtYWluXCIgdmlldyBoYXMgYSBiaW5kaW5nXG4vLyB3aXRoIHRoZSBuYW1lIFwibXlCaW5kaW5nXCIgcmVuZGVyZWQgd2l0aGluIGl0XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCJ7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAnbXlCaW5kaW5nJyB9XCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuLy8gWW91IGNhbiBhbHNvIHVzZSByZWd1bGFyIGV4cHJlc3Npb25zIGZvciB0aGUgYmluZGluZyBuYW1lLCBidXQgdG8gZG8gc28geW91IGhhdmUgdG8gcHJvdmlkZSBhIG1ldGhvZFxuLy8gb24geW91ciBjb250cm9sbGVyIHdoaWNoIHJldHVybnMgdGhlIHJvdXRlIGNsYXNzIGRlZmluaXRpb24gb2JqZWN0LCBiZWNhdXNlIEFuZ3VsYXJKUyBleHByZXNzaW9uc1xuLy8gZG9uJ3Qgc3VwcG9ydCBpbmxpbmUgcmVndWxhciBleHByZXNzaW9uc1xuLy9cbi8vIGNsYXNzIE15Q29udHJvbGxlciB7XG4vLyAgZ2V0Um91dGVDbGFzc09iamVjdCgpIHtcbi8vICAgIHJldHVybiB7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAvbXlCaW5kLyB9XG4vLyAgfVxuLy8gfVxuLy9cbi8vIDxhIHJvdXRlLWNsYXNzPVwiJGN0cmwuZ2V0Um91dGVDbGFzc09iamVjdCgpXCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuXG5mdW5jdGlvbiByb3V0ZUNsYXNzRmFjdG9yeShSb3V0ZSkge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIHNjb3BlLiR3YXRjaCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvdXRlQ2xhc3NEZWZpbml0aW9uID0gc2NvcGUuJGV2YWwoaUF0dHJzWydyb3V0ZUNsYXNzJ10pO1xuXG4gICAgICAgIGlmICghUm91dGUubWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZShyb3V0ZUNsYXNzRGVmaW5pdGlvbi52aWV3TmFtZSwgcm91dGVDbGFzc0RlZmluaXRpb24uYmluZGluZ05hbWUpKSB7XG4gICAgICAgICAgaWYgKGlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgaUVsZW1lbnQuYWRkQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVDbGFzcycsIHJvdXRlQ2xhc3NGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVIcmVmRmFjdG9yeSAoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0JztcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgc2NvcGU6IHRydWUsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGlmIChpQXR0cnMuaWdub3JlSHJlZiA9PT0gdW5kZWZpbmVkICYmIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgIGlFbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgY29uc3QgdXJsUGF0aCA9IGlFbGVtZW50LmF0dHIoJ2hyZWYnKS5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmxQYXRoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvYmplY3QgPSBSb3V0ZS5nZXRVcmxXcml0ZXJzKCk7XG4gICAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IHdyaXRlciA9IG9iamVjdFt3cml0ZXJOYW1lXTtcbiAgICAgICAgc2NvcGVbYCR7d3JpdGVyTmFtZX1VcmxXcml0ZXJgXSA9IHdyaXRlcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNjb3BlLiR3YXRjaChpQXR0cnMucm91dGVIcmVmLCAobmV3VXJsKSA9PiB7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmIChSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgIHVybCA9IG5ld1VybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmwgPSBgIyR7bmV3VXJsfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlFbGVtZW50LmF0dHIoJ2hyZWYnLCB1cmwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVIcmVmJywgcm91dGVIcmVmRmFjdG9yeSk7XG5cbmZ1bmN0aW9uIHJvdXRlT25DbGlja0ZhY3RvcnkgKFJvdXRlLCAkbG9jYXRpb24sICR3aW5kb3csICR0aW1lb3V0KSB7XG4gICduZ0luamVjdCc7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuXG4gICAgbGluayAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBjb25zdCBMRUZUX0JVVFRPTiA9IDA7XG4gICAgICBjb25zdCBNSURETEVfQlVUVE9OID0gMTtcblxuICAgICAgaWYgKGVsZW1lbnQuaXMoJ2EnKSkge1xuICAgICAgICBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT09IExFRlRfQlVUVE9OKSB7XG4gICAgICAgICAgICBuYXZpZ2F0ZVRvVXJsKGdldFVybCgpLCBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50Lm1vdXNldXAoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gTUlERExFX0JVVFRPTikge1xuICAgICAgICAgICAgbmF2aWdhdGVUb1VybChnZXRVcmwoKSwgc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG5hdmlnYXRlVG9VcmwoX3VybCwgbmV3V2luZG93ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHVybCA9IF91cmw7XG5cbiAgICAgICAgaWYgKG5ld1dpbmRvdykge1xuICAgICAgICAgIHVybCA9IGAkeyR3aW5kb3cubG9jYXRpb24ub3JpZ2lufS8ke3VybH1gO1xuICAgICAgICAgICR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIVJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXiMvLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgICR0aW1lb3V0KCgpID0+ICRsb2NhdGlvbi51cmwodXJsKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkge1xuICAgICAgICByZXR1cm4gZXZlbnQuYnV0dG9uID09PSBNSURETEVfQlVUVE9OIHx8IChldmVudC5idXR0b24gPT09IExFRlRfQlVUVE9OICYmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0VXJsKCkge1xuICAgICAgICBjb25zdCB1cmxXcml0ZXJzID0gUm91dGUuZ2V0VXJsV3JpdGVycygpO1xuICAgICAgICBjb25zdCBsb2NhbHMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gdXJsV3JpdGVycykge1xuICAgICAgICAgIGxvY2Fsc1tgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gdXJsV3JpdGVyc1t3cml0ZXJOYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHNjb3BlLiRldmFsKGF0dHJzLnJvdXRlT25DbGljaywgXy5hc3NpZ24obG9jYWxzLCBzY29wZSkpO1xuXG4gICAgICAgIHJldHVybiBodG1sNVRoZVVybCh1cmwpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBodG1sNVRoZVVybCh1cmwpIHtcbiAgICAgICAgcmV0dXJuIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpID8gdXJsIDogYCMke3VybH1gO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Z2V0VXJsKCl9YDtcbiAgICAgICAgfSwgKG5ld1VybCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuYXR0cignaHJlZicsIG5ld1VybCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlT25DbGljaycsIHJvdXRlT25DbGlja0ZhY3RvcnkpO1xuXG4vLyBAVE9ETyBub25lIG9mIHRoZSBhbmltYXRpb24gY29kZSBpbiB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiB0ZXN0ZWQuIE5vdCBzdXJlIGlmIGl0IGNhbiBiZSBhdCB0aGlzIHN0YWdlIFRoaXMgbmVlZHMgZnVydGhlciBpbnZlc3RpZ2F0aW9uLlxuLy8gQFRPRE8gdGhpcyBjb2RlIGRvZXMgdG9vIG11Y2gsIGl0IHNob3VsZCBiZSByZWZhY3RvcmVkLlxuXG5mdW5jdGlvbiByb3V0ZVZpZXdGYWN0b3J5KCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsICR0ZW1wbGF0ZVJlcXVlc3QsIFJvdXRlKSB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZTogZmFsc2UsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXY+PC9kaXY+JyxcbiAgICBsaW5rICh2aWV3RGlyZWN0aXZlU2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGxldCB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgbGV0IHZpZXdTY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCB2aWV3Q29udHJvbGxlciA9IHt9OyAvLyBOQiB3aWxsIG9ubHkgYmUgZGVmaW5lZCBmb3IgY29tcG9uZW50c1xuICAgICAgbGV0IHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgY29uc3QgdmlldyA9IFZpZXdCaW5kaW5ncy5nZXRWaWV3KGlBdHRycy5uYW1lKTtcbiAgICAgIGNvbnN0IGJpbmRpbmdzID0gdmlldy5nZXRCaW5kaW5ncygpO1xuXG4gICAgICBpRWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXG4gICAgICBsZXQgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVEYXRhRm9yQmluZGluZyA9IGJpbmRpbmcgPT4gXy5jbG9uZURlZXAoU3RhdGUuZ2V0U3Vic2V0KGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcoYmluZGluZykpKTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgZmllbGQpIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgIGZpZWxkID0gJ2NvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlID0gYmluZGluZ1tmaWVsZF0gPyAkaW5qZWN0b3IuZ2V0KGAke2JpbmRpbmdbZmllbGRdfURpcmVjdGl2ZWApWzBdIDogYmluZGluZztcbiAgICAgICAgcmV0dXJuIF8uZGVmYXVsdHMoXy5waWNrKHNvdXJjZSwgWydjb250cm9sbGVyJywgJ3RlbXBsYXRlVXJsJywgJ2NvbnRyb2xsZXJBcyddKSwge2NvbnRyb2xsZXJBczogJyRjdHJsJ30pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNSZXF1aXJlZERhdGEoYmluZGluZykge1xuICAgICAgICBjb25zdCByZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdO1xuXG4gICAgICAgIGZvciAobGV0IHJlcXVpcmVtZW50IG9mIEFycmF5LmZyb20ocmVxdWlyZWRTdGF0ZSkpIHtcbiAgICAgICAgICBsZXQgbmVnYXRlUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCchJyA9PT0gcmVxdWlyZW1lbnQuY2hhckF0KDApKSB7XG4gICAgICAgICAgICByZXF1aXJlbWVudCA9IHJlcXVpcmVtZW50LnNsaWNlKDEpO1xuICAgICAgICAgICAgbmVnYXRlUmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgZWxlbWVudCA9IFN0YXRlLmdldChyZXF1aXJlbWVudCk7XG5cbiAgICAgICAgICAvLyBSZXR1cm4gZmFsc2UgaWYgZWxlbWVudCBpcyB1bmRlZmluZWRcbiAgICAgICAgICBpZiAoKGVsZW1lbnQgPT09IG51bGwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT25seSBjaGVjayB2YWx1ZSBvZiBlbGVtZW50IGlmIGl0IGlzIGRlZmluZWRcbiAgICAgICAgICBpZiAobmVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gIWVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiaW5kaW5nLmNhbkFjdGl2YXRlKSB7XG4gICAgICAgICAgaWYgKCEkaW5qZWN0b3IuaW52b2tlKGJpbmRpbmcuY2FuQWN0aXZhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1hbmFnZVZpZXcoZWxlbWVudCwgYmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdCaW5kaW5nID0gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKTtcblxuICAgICAgICBpZiAoIW1hdGNoaW5nQmluZGluZykge1xuICAgICAgICAgIGlmICh2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3lWaWV3KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBSb3V0ZS5kZWxldGVDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IGdldFN0YXRlRGF0YUZvckJpbmRpbmcobWF0Y2hpbmdCaW5kaW5nKTtcbiAgICAgICAgaWYgKChtYXRjaGluZ0JpbmRpbmcgPT09IHByZXZpb3VzQmluZGluZykgJiYgYW5ndWxhci5lcXVhbHMocHJldmlvdXNCb3VuZFN0YXRlLCBuZXdTdGF0ZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiaW5kaW5nQ2hhbmdlZEV2ZW50RGF0YSA9IHsgdmlld05hbWU6IGlBdHRycy5uYW1lLCBjdXJyZW50QmluZGluZzogbWF0Y2hpbmdCaW5kaW5nIH07XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5iaW5kaW5nQ2hhbmdlZCcsIGJpbmRpbmdDaGFuZ2VkRXZlbnREYXRhKTtcblxuICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSBtYXRjaGluZ0JpbmRpbmc7XG4gICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IG5ld1N0YXRlO1xuXG4gICAgICAgIFBlbmRpbmdWaWV3Q291bnRlci5pbmNyZWFzZSgpO1xuXG4gICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChoYXNSZXNvbHZpbmdUZW1wbGF0ZSkge1xuICAgICAgICAgIC8vIEBUT0RPOiBNYWdpYyBudW1iZXJcbiAgICAgICAgICBjb25zdCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbiA9IGhhc1Jlc29sdmluZ1RlbXBsYXRlID8gMzAwIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgaWYgKCF2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuICRhbmltYXRlLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgaWYgKHZpZXdDb250cm9sbGVyLiRvbkRlc3Ryb3kpIHsgdmlld0NvbnRyb2xsZXIuJG9uRGVzdHJveSgpOyB9XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpIHtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20oYmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVzdHJveVZpZXcoZWxlbWVudCkge1xuICAgICAgICBpZiAodmlld0NyZWF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKS5yZW1vdmUoKTtcbiAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICAgIGlmICh2aWV3Q29udHJvbGxlci4kb25EZXN0cm95KSB7IHZpZXdDb250cm9sbGVyLiRvbkRlc3Ryb3koKTsgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVWaWV3KGVsZW1lbnQsIGJpbmRpbmcsIG1pbmltdW1EZWxheSkge1xuICAgICAgICBjb25zdCB0aW1lU3RhcnRlZE1haW5WaWV3ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZyk7XG5cbiAgICAgICAgY29uc3Qgb25TdWNjZXNzZnVsUmVzb2x1dGlvbiA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgaWYgKGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykgIT09IGJpbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2aWV3Q3JlYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICBjb25zdCByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA9IERhdGUubm93KCkgLSB0aW1lU3RhcnRlZE1haW5WaWV3O1xuXG4gICAgICAgICAgY29uc3QgaW5qZWN0TWFpblRlbXBsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yKGUsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZ2l2ZSB0aGUgdmlldyB0aW1lIHRvIHByb3Blcmx5IGluaXRpYWxpc2VcbiAgICAgICAgICAgICAgLy8gYmVmb3JlIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgdGhlIGludGlhbFZpZXdzTG9hZGVkIGV2ZW50XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5ID0gTWF0aC5tYXgoMCwgbWluaW11bURlbGF5IC0gcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lIDwgbWluaW11bURlbGF5KSB7XG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gaW5qZWN0TWFpblRlbXBsYXRlKClcbiAgICAgICAgICAgICAgLCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmplY3RNYWluVGVtcGxhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25SZXNvbHV0aW9uRmFpbHVyZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkbG9nLmVycm9yKGVycm9yKTtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfTtcblxuICAgICAgICBSb3V0ZS5zZXRDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUsIGJpbmRpbmcpO1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt0ZW1wbGF0ZTogJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLCBkZXBlbmRlbmNpZXM6IHJlc29sdmUoYmluZGluZyl9O1xuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24sIG9uUmVzb2x1dGlvbkZhaWx1cmUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwgfHwgIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIHJldHVybiAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKCRyb290U2NvcGUuJG5ldygpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGJpbmRpbmcuZXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5lcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ2Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgdGVtcGxhdGVGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG4gICAgICAgICAgdmlld0NvbnRyb2xsZXIgPSB7fTtcbiAgICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgICBiaW5kaW5nQ29tcG9uZW50RmllbGQgPSAnZXJyb3JDb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYmluZGluZ1tiaW5kaW5nQ29tcG9uZW50RmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB7ZGVwZW5kZW5jaWVzOiB7ZXJyb3J9fTtcblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgYXJncy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpIHtcbiAgICAgICAgY29uc3Qge2RlcGVuZGVuY2llc30gPSBhcmdzO1xuICAgICAgICBjb25zdCB7dGVtcGxhdGV9ID0gYXJncztcblxuICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcbiAgICAgICAgdmlld0NvbnRyb2xsZXIgPSB7fTtcblxuICAgICAgICBpZiAoY29tcG9uZW50LmNvbnRyb2xsZXIpIHtcbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSBfLm1lcmdlKGRlcGVuZGVuY2llcywgeyRzY29wZTogdmlld1Njb3BlLCAkZWxlbWVudDogZWxlbWVudC5jaGlsZHJlbigpLmVxKDApfSk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmlld0NvbnRyb2xsZXIgPSAkY29udHJvbGxlcihjb21wb25lbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgICAgIGxvY2Fscy4kc2NvcGVbY29tcG9uZW50LmNvbnRyb2xsZXJBc10gPSB2aWV3Q29udHJvbGxlcjtcbiAgICAgICAgICAgIGlmICh2aWV3Q29udHJvbGxlci4kb25Jbml0KSB7IHZpZXdDb250cm9sbGVyLiRvbkluaXQoKTsgfVxuICAgICAgICAgIH0gICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9ICdGYWlsZWQgdG8gc2VyaWFsaXplIGVycm9yIG9iamVjdCBmb3IgbG9nZ2luZyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRsb2cuZXJyb3IoYEZhaWxlZCBpbnN0YW50aWF0aW5nIGNvbnRyb2xsZXIgZm9yIHZpZXcgJHt2aWV3fTogJHtlcnJvck1lc3NhZ2V9YCk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlID0gZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHt9KTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCBkZXBlbmRlbmN5TmFtZSBpbiBiaW5kaW5nLnJlc29sdmUpIHtcbiAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5RmFjdG9yeSA9IGJpbmRpbmcucmVzb2x2ZVtkZXBlbmRlbmN5TmFtZV07XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRpbmplY3Rvci5pbnZva2UoZGVwZW5kZW5jeUZhY3RvcnkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRxLnJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcgPSBiaW5kaW5nID0+IF8udW5pb24oYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdLCBiaW5kaW5nLndhdGNoZWRTdGF0ZSB8fCBbXSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0cmlwTmVnYXRpb25QcmVmaXgoc3RyKSB7XG4gICAgICAgIGlmIChzdHIuY2hhckF0KDApID09PSAnIScpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnN1YnN0cigxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbVZpZXcgPSB2aWV3ID0+IF8uZmxhdHRlbihfLm1hcCh2aWV3LmdldEJpbmRpbmdzKCksIGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcpKTtcblxuICAgICAgY29uc3QgZ2V0RmllbGRzVG9XYXRjaCA9IHZpZXcgPT4gXy51bmlxKF8ubWFwKGdldFN0YXRlRmllbGRzRnJvbVZpZXcodmlldyksIHN0cmlwTmVnYXRpb25QcmVmaXgpKTtcblxuICAgICAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzVG9XYXRjaCh2aWV3KTtcblxuICAgICAgcmV0dXJuIFJvdXRlLndoZW5SZWFkeSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRyeSB0byBzdGFydCB0aGUgYmFsbCByb2xsaW5nIGluIGNhc2UgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgYW5kIHdlIGNhbiBjcmVhdGUgdGhlIHZpZXcgaW1tZWRpYXRlbHlcbiAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBEb24ndCBib3RoZXIgcHV0dGluZyBpbiBhIHdhdGNoZXIgaWYgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgdGhhdCB3aWxsIGV2ZXIgdHJpZ2dlciBhIGNoYW5nZSBldmVudFxuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXRlV2F0Y2hlciA9IGZ1bmN0aW9uIChjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgaWYgKHZpZXdNYW5hZ2VtZW50UGVuZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZmluaXNoIHRoZSBkaWdlc3QgY3ljbGUgYmVmb3JlIGJ1aWxkaW5nIHRoZSB2aWV3LCB3aGljaCBzaG91bGRcbiAgICAgICAgICAvLyBwcmV2ZW50IHVzIGZyb20gcmUtcmVuZGVyaW5nIGEgdmlldyBtdWx0aXBsZSB0aW1lcyBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzIG9mIHRoZSBzYW1lIHN0YXRlIGRlcGVuZGVuY3lcbiAgICAgICAgICAvLyBnZXQgY2hhbmdlZCB3aXRoIHJlcGVhdGVkIFN0YXRlLnNldCBjYWxsc1xuICAgICAgICAgIHJldHVybiAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICByZXR1cm4gdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgU3RhdGUud2F0Y2goZmllbGRzLCBzdGF0ZVdhdGNoZXIpO1xuXG4gICAgICAgIHZpZXdEaXJlY3RpdmVTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4gU3RhdGUucmVtb3ZlV2F0Y2hlcihzdGF0ZVdhdGNoZXIpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3ZpZXcnLCByb3V0ZVZpZXdGYWN0b3J5KTtcblxuY2xhc3MgUGVuZGluZ1ZpZXdDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoJHJvb3RTY29wZSkge1xuICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgfVxuXG4gIGluY3JlYXNlKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50ICs9IDE7XG4gIH1cblxuICBkZWNyZWFzZSgpIHtcbiAgICB0aGlzLmNvdW50ID0gTWF0aC5tYXgoMCwgdGhpcy5jb3VudCAtIDEpO1xuICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuaW5pdGlhbFZpZXdzTG9hZGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5jdXJyZW50Vmlld3NMb2FkZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1BlbmRpbmdWaWV3Q291bnRlcicsICgkcm9vdFNjb3BlKSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgUGVuZGluZ1ZpZXdDb3VudGVyKCRyb290U2NvcGUpO1xufSk7XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3Qge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5LCBsaXN0KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuXG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLndhdGNoZXJzID0gW107XG4gIH1cblxuICBnZXQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgfVxuXG4gIGdldEFsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0O1xuICB9XG5cbiAgZ2V0U3Vic2V0KHBhdGhzKSB7XG4gICAgcmV0dXJuIF8uemlwT2JqZWN0KHBhdGhzLCBfLm1hcChwYXRocywgdGhpcy5nZXQuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIuc2V0KHRoaXMubGlzdCwgcGF0aCwgdmFsdWUpO1xuICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIHVuc2V0KHBhdGhzKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLk9iamVjdEhlbHBlci51bnNldCh0aGlzLmxpc3QsIHBhdGgpO1xuICAgICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdhdGNoKHBhdGhzLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLndhdGNoZXJzLnB1c2godGhpcy5XYXRjaGVyRmFjdG9yeS5jcmVhdGUocGF0aCwgaGFuZGxlciwgdGhpcy5nZXQocGF0aCkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZVdhdGNoZXIod2F0Y2hlcikge1xuICAgIGlmICh0aGlzLndhdGNoZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdXYXRjaGVycyA9IFtdO1xuXG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHRoaXNXYXRjaGVyID0+IHtcbiAgICAgIGlmICh0aGlzV2F0Y2hlci5oYW5kbGVyICE9PSB3YXRjaGVyKSB7XG4gICAgICAgIG5ld1dhdGNoZXJzLnB1c2godGhpc1dhdGNoZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMud2F0Y2hlcnMgPSBuZXdXYXRjaGVycztcbiAgfVxuXG4gIF9ub3RpZnlXYXRjaGVycyhjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgd2F0Y2hlciA9PiB7XG4gICAgICBpZiAod2F0Y2hlci5zaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGggPSB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCB3YXRjaGVyLndhdGNoUGF0aCk7XG4gICAgICAgIHdhdGNoZXIubm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3RGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcbiAgfVxuXG4gIGNyZWF0ZShsaXN0ID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3QodGhpcy5PYmplY3RIZWxwZXIsIHRoaXMuV2F0Y2hlckZhY3RvcnksIGxpc3QpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hhYmxlTGlzdEZhY3RvcnknLCAoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3RGYWN0b3J5KE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpO1xufSk7XG5cbmNsYXNzIFdhdGNoZXIge1xuICBjb25zdHJ1Y3Rvcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHRoaXMud2F0Y2hQYXRoID0gd2F0Y2hQYXRoO1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChpbml0aWFsVmFsdWUpO1xuICB9XG5cbiAgX3Rva2VuaXplUGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKTtcbiAgfVxuXG4gIHNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICAvLyBOQiBzaG9ydCBjaXJjdWl0IGxvZ2ljIGluIHRoZSBzaW1wbGUgY2FzZVxuICAgIGlmICh0aGlzLndhdGNoUGF0aCA9PT0gY2hhbmdlZFBhdGgpIHtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHModGhpcy5jdXJyZW50VmFsdWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXRjaCA9IHtcbiAgICAgIHBhdGg6IHRoaXMud2F0Y2hQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgodGhpcy53YXRjaFBhdGgpLFxuICAgICAgdmFsdWU6IHRoaXMuY3VycmVudFZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IGNoYW5nZSA9IHtcbiAgICAgIHBhdGg6IGNoYW5nZWRQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgoY2hhbmdlZFBhdGgpLFxuICAgICAgdmFsdWU6IG5ld1ZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IG1pbmltdW1MZW50aCA9IE1hdGgubWluKGNoYW5nZS50b2tlbnMubGVuZ3RoLCB3YXRjaC50b2tlbnMubGVuZ3RoKTtcbiAgICBmb3IgKGxldCB0b2tlbkluZGV4ID0gMDsgdG9rZW5JbmRleCA8IG1pbmltdW1MZW50aDsgdG9rZW5JbmRleCsrKSB7XG4gICAgICBpZiAod2F0Y2gudG9rZW5zW3Rva2VuSW5kZXhdICE9PSBjaGFuZ2UudG9rZW5zW3Rva2VuSW5kZXhdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOQiBpZiB3ZSBnZXQgaGVyZSB0aGVuIGFsbCBjb21tb24gdG9rZW5zIG1hdGNoXG5cbiAgICBjb25zdCBjaGFuZ2VQYXRoSXNEZXNjZW5kYW50ID0gY2hhbmdlLnRva2Vucy5sZW5ndGggPiB3YXRjaC50b2tlbnMubGVuZ3RoO1xuXG4gICAgaWYgKGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQpIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGNoYW5nZS50b2tlbnMuc2xpY2Uod2F0Y2gudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCA9IF8uZ2V0KHdhdGNoLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyhjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoLCBjaGFuZ2UudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSB3YXRjaC50b2tlbnMuc2xpY2UoY2hhbmdlLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaFBhdGggPSBfLmdldChjaGFuZ2UudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHdhdGNoLnZhbHVlLCBuZXdWYWx1ZUF0V2F0Y2hQYXRoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5oYW5kbGVyKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgdGhpcy5jdXJyZW50VmFsdWUpO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAobmV3VmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoZXJGYWN0b3J5IHtcbiAgY3JlYXRlKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGVyKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoZXJGYWN0b3J5JywgKCkgPT4ge1xuICByZXR1cm4gbmV3IFdhdGNoZXJGYWN0b3J5KCk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignUm91dGUnLCBmdW5jdGlvbihPYmplY3RIZWxwZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuICBjb25zdCB0b2tlbnMgPSB7fTtcbiAgY29uc3QgdXJsV3JpdGVycyA9IFtdO1xuICBjb25zdCB1cmxzID0gW107XG4gIGNvbnN0IHBlcnNpc3RlbnRTdGF0ZXMgPSBbXTtcbiAgY29uc3QgcmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgdHlwZXMgPSB7fTtcbiAgbGV0IGh0bWw1TW9kZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3ZpZGVyID0ge1xuXG4gICAgcmVnaXN0ZXJUeXBlKG5hbWUsIGNvbmZpZykge1xuICAgICAgdHlwZXNbbmFtZV0gPSBjb25maWc7XG4gICAgICB0eXBlc1tuYW1lXS5yZWdleCA9IG5ldyBSZWdFeHAodHlwZXNbbmFtZV0ucmVnZXguc291cmNlLCAnaScpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVHlwZSB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxUb2tlbihuYW1lLCBjb25maWcpIHtcbiAgICAgIHRva2Vuc1tuYW1lXSA9IF8uZXh0ZW5kKHtuYW1lfSwgY29uZmlnKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFRva2VuIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFdyaXRlcihuYW1lLCBmbikge1xuICAgICAgdXJsV3JpdGVyc1tuYW1lXSA9IGZuO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsV3JpdGVyIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybChwYXR0ZXJuLCBjb25maWcgPSB7fSkge1xuICAgICAgY29uc3QgdXJsRGF0YSA9IHtcbiAgICAgICAgY29tcGlsZWRVcmw6IHRoaXMuX2NvbXBpbGVVcmxQYXR0ZXJuKHBhdHRlcm4sIGNvbmZpZyksXG4gICAgICAgIHBhdHRlcm5cbiAgICAgIH07XG5cbiAgICAgIHVybHMucHVzaChfLmV4dGVuZCh1cmxEYXRhLCBjb25maWcpKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybCB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGVyc2lzdGVudFN0YXRlcyguLi5zdGF0ZUxpc3QpIHtcbiAgICAgIF8uZm9yRWFjaChzdGF0ZUxpc3QsIChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIV8uaW5jbHVkZXMocGVyc2lzdGVudFN0YXRlcywgc3RhdGUpKSB7XG4gICAgICAgICAgcGVyc2lzdGVudFN0YXRlcy5wdXNoKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldEh0bWw1TW9kZShtb2RlKSB7XG4gICAgICBodG1sNU1vZGUgPSBtb2RlO1xuICAgIH0sXG5cbiAgICBfY29tcGlsZVVybFBhdHRlcm4odXJsUGF0dGVybiwgY29uZmlnKSB7XG4gICAgICBsZXQgbWF0Y2g7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyh1cmxQYXR0ZXJuKTtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2godXJsUGF0dGVybik7XG5cbiAgICAgIGNvbnN0IHRva2VuUmVnZXggPSAvXFx7KFtBLVphLXpcXC5fMC05XSspXFx9L2c7XG4gICAgICBsZXQgdXJsUmVnZXggPSB1cmxQYXR0ZXJuO1xuXG4gICAgICBpZiAoIWNvbmZpZy5wYXJ0aWFsTWF0Y2gpIHtcbiAgICAgICAgdXJsUmVnZXggPSBgXiR7dXJsUmVnZXh9JGA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRva2VuTGlzdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKG1hdGNoID0gdG9rZW5SZWdleC5leGVjKHVybFBhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1ttYXRjaFsxXV07XG4gICAgICAgIHRva2VuTGlzdC5wdXNoKHRva2VuKTtcbiAgICAgICAgdXJsUmVnZXggPSB1cmxSZWdleC5yZXBsYWNlKG1hdGNoWzBdLCBgKCR7dHlwZXNbdG9rZW4udHlwZV0ucmVnZXguc291cmNlfSlgKTtcbiAgICAgIH1cblxuICAgICAgdXJsUmVnZXgucmVwbGFjZSgnLicsICdcXFxcLicpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCh1cmxSZWdleCwgJ2knKSxcbiAgICAgICAgdG9rZW5zOiB0b2tlbkxpc3RcbiAgICAgIH07XG4gICAgfSxcblxuICAgIF9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2goc3RyKSB7XG4gICAgICBpZiAoc3RyLm1hdGNoKC9cXC8kLykpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXC8kLywgJy8/Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCR7c3RyfS8/YDtcbiAgICB9LFxuXG4gICAgX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXChcXClcXCpcXCtcXD9cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICB9LFxuXG4gICAgJGdldCgkbG9jYXRpb24sICRpbmplY3RvciwgJHEpIHtcbiAgICAgICduZ0luamVjdCc7XG5cbiAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc2VydmljZSAob25seSBkb25lIG9uY2UpLCB3ZSBuZWVkIHRvIGl0ZXJhdGUgb3ZlciB0aGUgdXJsV3JpdGVycyBhbmQgdHVyblxuICAgICAgLy8gdGhlbSBpbnRvIG1ldGhvZHMgdGhhdCBpbnZva2UgdGhlIFJFQUwgdXJsV3JpdGVyLCBidXQgcHJvdmlkaW5nIGRlcGVuZGVuY3kgaW5qZWN0aW9uIHRvIGl0LCB3aGlsZSBhbHNvXG4gICAgICAvLyBnaXZpbmcgaXQgdGhlIGRhdGEgdGhhdCB0aGUgY2FsbGVlIHBhc3NlcyBpbi5cblxuICAgICAgLy8gVGhlIHJlYXNvbiB3ZSBoYXZlIHRvIGRvIHRoaXMgaGVyZSBpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoZSAkaW5qZWN0b3IgYmFjayBpbiB0aGUgcm91dGVQcm92aWRlci5cblxuICAgICAgXy5mb3JJbih1cmxXcml0ZXJzLCAod3JpdGVyLCB3cml0ZXJOYW1lKSA9PlxuICAgICAgICB1cmxXcml0ZXJzW3dyaXRlck5hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmICghZGF0YSkgeyBkYXRhID0ge307IH1cbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSB7VXJsRGF0YTogZGF0YX07XG4gICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5pbnZva2Uod3JpdGVyLCB7fSwgbG9jYWxzKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgbGV0IGZsYXNoU3RhdGVzID0gW107XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgIGN1cnJlbnRCaW5kaW5nczoge30sXG4gICAgICAgIHJlYWR5RGVmZXJyZWQ6ICRxLmRlZmVyKCksXG5cbiAgICAgICAgbWF0Y2godXJsVG9NYXRjaCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdXJsIG9mIEFycmF5LmZyb20odXJscykpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSB1cmwuY29tcGlsZWRVcmwucmVnZXguZXhlYyh1cmxUb01hdGNoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHt1cmwsIHJlZ2V4TWF0Y2g6IG1hdGNofTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERhdGEobWF0Y2gsIHNlYXJjaERhdGEgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMuZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKTtcbiAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5leHRyYWN0UGF0aERhdGEobWF0Y2gpO1xuICAgICAgICAgIHNlYXJjaERhdGEgPSB0aGlzLmV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpO1xuICAgICAgICAgIHJldHVybiBPYmplY3RIZWxwZXIuZGVmYXVsdChzZWFyY2hEYXRhLCBwYXRoLCBkZWZhdWx0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSkge1xuICAgICAgICAgIGlmICghc2VhcmNoRGF0YSkgeyBzZWFyY2hEYXRhID0gJGxvY2F0aW9uLnNlYXJjaCgpOyB9XG4gICAgICAgICAgY29uc3QgZGF0YSA9IF8uY2xvbmUoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKGRhdGEsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0S2V5ID0gXy5maW5kS2V5KHRva2VucywgeyBzZWFyY2hBbGlhczoga2V5IH0pO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRLZXkpIHsgdGFyZ2V0S2V5ID0ga2V5OyB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZU5hbWUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IF8uZ2V0KHRva2Vuc1t0YXJnZXRLZXldLCAndHlwZScpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCF0b2tlbnNbdGFyZ2V0S2V5XSB8fCAodHlwZXNbdG9rZW5UeXBlTmFtZV0ucmVnZXgudGVzdCh2YWx1ZSkpKSB7XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS50eXBlIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0eXBlVG9rZW5UeXBlID0gdG9rZW5UeXBlID8gdHlwZXNbdG9rZW5UeXBlXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlUGFyc2VkID0gdHlwZVRva2VuVHlwZSA/IHR5cGVUb2tlblR5cGUucGFyc2VyIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgIGlmICh0b2tlblR5cGVQYXJzZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodG9rZW5UeXBlUGFyc2VkLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblRhcmdldEtleVN0YXRlUGF0aCA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0uc3RhdGVQYXRoIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCBkYXRhS2V5ID0gdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggfHwgdGFyZ2V0S2V5O1xuXG4gICAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQobmV3RGF0YSwgZGF0YUtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKG1hdGNoLnVybC5zdGF0ZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwga2V5LCAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IF8uY2xvbmVEZWVwKHZhbHVlKSA6IHZhbHVlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0UGF0aERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICAgY29uc3QgcGF0aFRva2VucyA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnM7XG5cbiAgICAgICAgICBpZiAocGF0aFRva2Vucy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHt9OyB9XG5cbiAgICAgICAgICBmb3IgKGxldCBuID0gMCwgZW5kID0gcGF0aFRva2Vucy5sZW5ndGgtMSwgYXNjID0gMCA8PSBlbmQ7IGFzYyA/IG4gPD0gZW5kIDogbiA+PSBlbmQ7IGFzYyA/IG4rKyA6IG4tLSkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zW25dO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbWF0Y2gucmVnZXhNYXRjaFtuKzFdO1xuXG4gICAgICAgICAgICBpZiAodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyKSB7IHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIsIG51bGwsIHt0b2tlbjogdmFsdWV9KTsgfVxuXG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsICh0b2tlbi5zdGF0ZVBhdGggfHwgdG9rZW4ubmFtZSksIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXJzKCkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcihuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdvKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiAkbG9jYXRpb24udXJsKHRoaXMuaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRQZXJzaXN0ZW50U3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBwZXJzaXN0ZW50U3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBbXTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRGbGFzaFN0YXRlcyguLi5uZXdTdGF0ZXMpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IGZsYXNoU3RhdGVzLmNvbmNhdChuZXdTdGF0ZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBmbGFzaFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSwgYmluZGluZykge1xuICAgICAgICAgIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXSA9IGJpbmRpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlbGV0ZUN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBtYXRjaGVzQ3VycmVudEJpbmRpbmdOYW1lKHZpZXdOYW1lLCBiaW5kaW5nTmFtZUV4cHJlc3Npb24pIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50QmluZGluZyA9IHRoaXMuZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpO1xuXG4gICAgICAgICAgaWYgKCFjdXJyZW50QmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBiaW5kaW5nTmFtZUV4cHJlc3Npb24gaW5zdGFuY2VvZiBSZWdFeHAgP1xuICAgICAgICAgICAgYmluZGluZ05hbWVFeHByZXNzaW9uLnRlc3QoY3VycmVudEJpbmRpbmcubmFtZSkgOlxuICAgICAgICAgICAgY3VycmVudEJpbmRpbmcubmFtZSA9PT0gYmluZGluZ05hbWVFeHByZXNzaW9uO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFJlYWR5KHJlYWR5KSB7XG4gICAgICAgICAgaWYgKCFyZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5yZWFkeURlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWFkeURlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlYWR5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzUmVhZHkoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlYWR5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzSHRtbDVNb2RlRW5hYmxlZCgpIHtcbiAgICAgICAgICByZXR1cm4gaHRtbDVNb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdoZW5SZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkeURlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH1cbiAgfTtcblxuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ251bWVyaWMnLCB7cmVnZXg6IC9cXGQrLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gcGFyc2VJbnQodG9rZW4pXX0pO1xuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ2FscGhhJywge3JlZ2V4OiAvW2EtekEtWl0rL30pO1xuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ2FueScsIHtyZWdleDogLy4rL30pO1xuICBwcm92aWRlci5yZWdpc3RlclR5cGUoJ2xpc3QnLCB7cmVnZXg6IC8uKy8sIHBhcnNlcjogWyd0b2tlbicsIHRva2VuID0+IHRva2VuLnNwbGl0KCcsJyldfSk7XG5cbiAgcmV0dXJuIHByb3ZpZGVyO1xufSk7XG5cbmNsYXNzIFN0YXRlUHJvdmlkZXIge1xuICAkZ2V0KFdhdGNoYWJsZUxpc3RGYWN0b3J5KSB7XG4gICAgJ25nSW5qZWN0JztcbiAgICByZXR1cm4gV2F0Y2hhYmxlTGlzdEZhY3RvcnkuY3JlYXRlKCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignU3RhdGUnLCBuZXcgU3RhdGVQcm92aWRlcik7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1ZpZXdCaW5kaW5ncycsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3Qgdmlld3MgPSBbXTtcblxuICBjbGFzcyBWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBiaW5kaW5ncykge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICAgIGlmICghKHRoaXMuYmluZGluZ3MgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IFt0aGlzLmJpbmRpbmdzXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRCaW5kaW5ncygpIHtcbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG5cbiAgICBiaW5kKG5hbWUsIGNvbmZpZykge1xuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vblJlcXVpcmVkU3RhdGUoYmluZGluZ3MsIGNvbW1vblJlcXVpcmVkU3RhdGUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGlmICghKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgYmluZGluZy5yZXF1aXJlZFN0YXRlID0gW2JpbmRpbmcucmVxdWlyZWRTdGF0ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZS5jb25jYXQoY29tbW9uUmVxdWlyZWRTdGF0ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVzb2x2ZShiaW5kaW5ncywgY29tbW9uUmVzb2x2ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoJ3Jlc29sdmUnIGluIGJpbmRpbmcpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlc29sdmUgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goXy5kZWZhdWx0cyhiaW5kaW5nLnJlc29sdmUsIGNvbW1vblJlc29sdmUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vbkZpZWxkcyhuZXdCaW5kaW5ncykge1xuICAgICAgICBjb25zdCBiYXNpY0NvbW1vbkZpZWxkcyA9IFtcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ1RlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ1RlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ0Vycm9yQ29tcG9uZW50Jywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25FcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvclRlbXBsYXRlVXJsJ31cbiAgICAgICAgXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNvbW1vbkZpZWxkIG9mIEFycmF5LmZyb20oYmFzaWNDb21tb25GaWVsZHMpKSB7XG4gICAgICAgICAgaWYgKGNvbW1vbkZpZWxkLm5hbWUgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBkZWZhdWx0QmluZGluZ0ZpZWxkKG5ld0JpbmRpbmdzLCBjb21tb25GaWVsZC5vdmVycmlkZUZpZWxkLCBjb25maWdbY29tbW9uRmllbGQubmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29tbW9uUmVxdWlyZWRTdGF0ZScgaW4gY29uZmlnKSB7XG4gICAgICAgICAgYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlcXVpcmVkU3RhdGUnXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlc29sdmUnIGluIGNvbmZpZykge1xuICAgICAgICAgIHJldHVybiBhcHBseUNvbW1vblJlc29sdmUobmV3QmluZGluZ3MsIGNvbmZpZ1snY29tbW9uUmVzb2x2ZSddKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZWZhdWx0QmluZGluZ0ZpZWxkKGJpbmRpbmdzLCBmaWVsZE5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgICAgaWYgKCEoZmllbGROYW1lIGluIGJpbmRpbmcpKSB7XG4gICAgICAgICAgICBpdGVtID0gYmluZGluZ1tmaWVsZE5hbWVdID0gZGVmYXVsdFZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3QmluZGluZ3MgPSBbXTtcbiAgICAgIGlmICgnYmluZGluZ3MnIGluIGNvbmZpZykge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IGNvbmZpZ1snYmluZGluZ3MnXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0JpbmRpbmdzID0gKGNvbmZpZyBpbnN0YW5jZW9mIEFycmF5KSA/IGNvbmZpZyA6IFtjb25maWddO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShuZXdCaW5kaW5ncy5sZW5ndGggPiAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY2FsbCB0byBWaWV3QmluZGluZ3NQcm92aWRlci5iaW5kIGZvciBuYW1lICcke25hbWV9J2ApO1xuICAgICAgfVxuXG4gICAgICBhcHBseUNvbW1vbkZpZWxkcyhuZXdCaW5kaW5ncyk7XG4gICAgICByZXR1cm4gdmlld3NbbmFtZV0gPSBuZXcgVmlldyhuYW1lLCBuZXdCaW5kaW5ncyk7XG4gICAgfSxcblxuICAgICRnZXQoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXRWaWV3KHZpZXcpIHtcbiAgICAgICAgICByZXR1cm4gdmlld3Nbdmlld107XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
