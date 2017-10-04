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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0XFxiaWNrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBaUIsQ0FBaEMsQUFBZ0MsQUFBQyxjQUFqQyxBQUErQyx3RkFBSSxVQUFBLEFBQVUsT0FBVixBQUFpQixPQUFqQixBQUF3QixXQUF4QixBQUFtQyxZQUFuQyxBQUErQyxjQUEvQyxBQUE2RCxvQkFBb0IsQUFDbEk7QUFFQTs7TUFBSSxTQUFKLEFBQWEsQUFDYjthQUFBLEFBQVcsSUFBWCxBQUFlLHdCQUF3QixZQUFZLEFBQ2pEO1FBQUksTUFBSixBQUFJLEFBQU0sV0FBVyxBQUNuQjtZQUFBLEFBQU0sU0FBTixBQUFlLEFBQ2hCO0FBQ0Y7QUFKRCxBQU1BOzthQUFBLEFBQVcsSUFBWCxBQUFlLDBCQUEwQixVQUFBLEFBQVUsR0FBVixBQUFhLFFBQVEsQUFDNUQ7QUFDQTtRQUFJLFlBQUosQUFDQTtRQUFJLFdBQUosQUFBZSxRQUFRLEFBQ3JCO0FBQ0Q7QUFFRDs7YUFBQSxBQUFTLEFBRVQ7O3VCQUFBLEFBQW1CLEFBQ25CO1FBQU0sUUFBUSxNQUFBLEFBQU0sTUFBTSxVQUExQixBQUFjLEFBQVksQUFBVSxBQUVwQzs7UUFBSSxDQUFKLEFBQUssT0FBTyxBQUNWO2FBQUEsQUFBTyxBQUNSO0FBRkQsV0FFTyxBQUNMO2FBQU8sTUFBQSxBQUFNLFlBQWIsQUFBTyxBQUFrQixBQUMxQjtBQUVEOztRQUFJLGdCQUFnQixhQUFBLEFBQWEsTUFBTSxNQUFuQixBQUF5QixNQUE3QyxBQUFvQixBQUErQixBQUNuRDtvQkFBZ0IsRUFBQSxBQUFFLFdBQUYsQUFBYSxlQUFlLE1BQUEsQUFBTSxzQkFBTixBQUE0QixPQUFPLE1BQS9FLEFBQWdCLEFBQTRCLEFBQW1DLEFBQU0sQUFFckY7O1FBQU0s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TUFBQSxBQUFNLEtBQTVCLEFBQXNCLEFBQVcsb0pBQWM7Z0JBQXBDLEFBQW9DLGtCQUM3Qzs7Z0JBQUksWUFBSixBQUNBO2dCQUFJLEVBQUUsYUFBTixBQUFJLEFBQWUsVUFBVSxBQUMzQjtxQkFBTyxRQUFBLEFBQVEsYUFBZixBQUE0QixBQUM3QjtBQUNEO21CQUFBLEFBQU8sS0FBUCxBQUFZLEFBQ2I7QUFSNkQ7c0JBQUE7Z0NBQUE7NkJBQUE7a0JBQUE7Y0FBQTtvRUFBQTswQkFBQTtBQUFBO29CQUFBO3FDQUFBO29CQUFBO0FBQUE7QUFBQTtBQVM5RDs7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7VUFBSSxjQUFKLEFBQWtCLEFBQ2xCO1VBQUksY0FBSixBQUFrQixRQUFRLEFBQ3hCO3NCQUFjLE9BQWQsQUFBYyxBQUFPLEFBQ3RCO0FBRkQsYUFFTyxBQUNMO3NCQUFlLGtCQUFELEFBQW1CLFFBQW5CLEFBQTRCLFNBQVMsQ0FBbkQsQUFBbUQsQUFBQyxBQUNyRDtBQUVEOztVQUFJLEVBQUUsWUFBQSxBQUFZLFNBQWxCLEFBQUksQUFBdUIsSUFBSSxBQUM3QjtjQUFNLElBQUEsQUFBSSxnRUFBSixBQUFpRSxPQUF2RSxBQUNEO0FBRUQ7O3dCQUFBLEFBQWtCLEFBQ2xCO2FBQU8sTUFBQSxBQUFNLFFBQVEsSUFBQSxBQUFJLEtBQUosQUFBUyxNQUE5QixBQUFxQixBQUFlLEFBQ3JDO0FBMUVJLEFBNEVMO0FBNUVLLDBCQTRFRSxBQUNMOztBQUFPLGtDQUFBLEFBQ0csTUFBTSxBQUNaO2lCQUFPLE1BQVAsQUFBTyxBQUFNLEFBQ2Q7QUFISCxBQUFPLEFBS1I7QUFMUSxBQUNMO0FBOUVOLEFBQU8sQUFvRlI7QUFwRlEsQUFFTDtBQW5CSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJhbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicsIFsnbmdBbmltYXRlJ10pLnJ1bihmdW5jdGlvbiAoU3RhdGUsIFJvdXRlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE9iamVjdEhlbHBlciwgUGVuZGluZ1ZpZXdDb3VudGVyKSB7XG4gIFwibmdJbmplY3RcIjtcblxuICBsZXQgb2xkVXJsID0gdW5kZWZpbmVkO1xuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJvdXRlLmlzUmVhZHkoKSkge1xuICAgICAgUm91dGUuc2V0UmVhZHkoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZSwgbmV3VXJsKSB7XG4gICAgLy8gV29yay1hcm91bmQgZm9yIEFuZ3VsYXJKUyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2lzc3Vlcy84MzY4XG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKG5ld1VybCA9PT0gb2xkVXJsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2xkVXJsID0gbmV3VXJsO1xuXG4gICAgUGVuZGluZ1ZpZXdDb3VudGVyLnJlc2V0KCk7XG4gICAgY29uc3QgbWF0Y2ggPSBSb3V0ZS5tYXRjaCgkbG9jYXRpb24ucGF0aCgpKTtcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IFJvdXRlLmV4dHJhY3REYXRhKG1hdGNoKTtcbiAgICB9XG5cbiAgICBsZXQgZmllbGRzVG9VbnNldCA9IE9iamVjdEhlbHBlci5ub3RJbihTdGF0ZS5saXN0LCBkYXRhKTtcbiAgICBmaWVsZHNUb1Vuc2V0ID0gXy5kaWZmZXJlbmNlKGZpZWxkc1RvVW5zZXQsIFJvdXRlLmdldFBlcnNpc3RlbnRTdGF0ZXMoKS5jb25jYXQoUm91dGUuZ2V0Rmxhc2hTdGF0ZXMoKSkpO1xuXG4gICAgY29uc3QgZXZlbnREYXRhID0ge3Vuc2V0dGluZzogZmllbGRzVG9VbnNldCwgc2V0dGluZzogZGF0YX07XG4gICAgJHJvb3RTY29wZS4kZW1pdCgnYmlja2VyX3JvdXRlci5iZWZvcmVTdGF0ZUNoYW5nZScsIGV2ZW50RGF0YSk7XG5cbiAgICBpZiAoKGV2ZW50RGF0YS51bnNldHRpbmcpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgU3RhdGUudW5zZXQoZXZlbnREYXRhLnVuc2V0dGluZyk7XG4gICAgfVxuXG4gICAgXy5mb3JFYWNoKGV2ZW50RGF0YS5zZXR0aW5nLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgUm91dGUucmVzZXRGbGFzaFN0YXRlcygpO1xuICAgIFJvdXRlLnNldFJlYWR5KHRydWUpO1xuICB9KTtcbn0pO1xuXHJcbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ09iamVjdEhlbHBlcicsIHtcbiAgZ2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV07XG4gIH0sXG5cbiAgc2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBpZiAocGFyZW50W3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFyZW50W3NlZ21lbnRdID0ge307XG4gICAgICB9XG5cbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV0gPSB2YWx1ZTtcbiAgfSxcblxuICB1bnNldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG5cbiAgICBpZiAocGFyZW50W2tleV0gPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBkZWxldGUgcGFyZW50W2tleV07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgLy8gUmVjdXJzaXZlbHkgcmV0dXJuIHRoZSBwcm9wZXJ0aWVzIGluIGEgdGhhdCBhcmVuJ3QgaW4gYlxuICBub3RJbihhLCBiLCBwcmVmaXggPSAnJykge1xuICAgIGxldCBub3RJbiA9IFtdO1xuICAgIHByZWZpeCA9IHByZWZpeC5sZW5ndGggPiAwID8gYCR7cHJlZml4fS5gIDogJyc7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKE9iamVjdC5rZXlzKGEpKSkge1xuICAgICAgY29uc3QgdGhpc1BhdGggPSBgJHtwcmVmaXh9JHtrZXl9YDtcblxuICAgICAgaWYgKGJba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vdEluLnB1c2godGhpc1BhdGgpO1xuXG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgYVtrZXldID09PSAnb2JqZWN0JykgJiYgKCEoYVtrZXldIGluc3RhbmNlb2YgQXJyYXkpKSkge1xuICAgICAgICBub3RJbiA9IG5vdEluLmNvbmNhdCh0aGlzLm5vdEluKGFba2V5XSwgYltrZXldLCB0aGlzUGF0aCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub3RJbjtcbiAgfSxcblxuICBkZWZhdWx0KG92ZXJyaWRlcywgLi4uZGVmYXVsdFNldHMpIHtcbiAgICBsZXQgZGVmYXVsdFNldCwgdmFsdWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBpZiAoZGVmYXVsdFNldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBkZWZhdWx0U2V0ID0gZGVmYXVsdFNldHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRTZXQgPSB0aGlzLmRlZmF1bHQoLi4uQXJyYXkuZnJvbShkZWZhdWx0U2V0cyB8fCBbXSkpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRTZXQpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFNldFtrZXldO1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiBvdmVycmlkZXNba2V5XSA9PT0gXCJvYmplY3RcIikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmRlZmF1bHQob3ZlcnJpZGVzW2tleV0sIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3ZlcnJpZGVzKSB7XG4gICAgICB2YWx1ZSA9IG92ZXJyaWRlc1trZXldO1xuICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSB8fCB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxuXHJcbi8vIFVzYWdlOlxuLy9cbi8vIElmIHlvdSB3YW50IHRvIGFkZCB0aGUgY2xhc3MgXCJhY3RpdmVcIiB0byBhbiBhbmNob3IgZWxlbWVudCB3aGVuIHRoZSBcIm1haW5cIiB2aWV3IGhhcyBhIGJpbmRpbmdcbi8vIHdpdGggdGhlIG5hbWUgXCJteUJpbmRpbmdcIiByZW5kZXJlZCB3aXRoaW4gaXRcbi8vXG4vLyA8YSByb3V0ZS1jbGFzcz1cInsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6ICdteUJpbmRpbmcnIH1cIj5BbmNob3IgdGV4dDwvYT5cbi8vXG4vLyBZb3UgY2FuIGFsc28gdXNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHRoZSBiaW5kaW5nIG5hbWUsIGJ1dCB0byBkbyBzbyB5b3UgaGF2ZSB0byBwcm92aWRlIGEgbWV0aG9kXG4vLyBvbiB5b3VyIGNvbnRyb2xsZXIgd2hpY2ggcmV0dXJucyB0aGUgcm91dGUgY2xhc3MgZGVmaW5pdGlvbiBvYmplY3QsIGJlY2F1c2UgQW5ndWxhckpTIGV4cHJlc3Npb25zXG4vLyBkb24ndCBzdXBwb3J0IGlubGluZSByZWd1bGFyIGV4cHJlc3Npb25zXG4vL1xuLy8gY2xhc3MgTXlDb250cm9sbGVyIHtcbi8vICBnZXRSb3V0ZUNsYXNzT2JqZWN0KCkge1xuLy8gICAgcmV0dXJuIHsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6IC9teUJpbmQvIH1cbi8vICB9XG4vLyB9XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCIkY3RybC5nZXRSb3V0ZUNsYXNzT2JqZWN0KClcIj5BbmNob3IgdGV4dDwvYT5cbi8vXG5cbmZ1bmN0aW9uIHJvdXRlQ2xhc3NGYWN0b3J5KFJvdXRlKSB7XG4gICduZ0luamVjdCdcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goKCkgPT4ge1xuICAgICAgICBjb25zdCByb3V0ZUNsYXNzRGVmaW5pdGlvbiA9IHNjb3BlLiRldmFsKGlBdHRyc1sncm91dGVDbGFzcyddKVxuXG4gICAgICAgIGlmICghUm91dGUubWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZShyb3V0ZUNsYXNzRGVmaW5pdGlvbi52aWV3TmFtZSwgcm91dGVDbGFzc0RlZmluaXRpb24uYmluZGluZ05hbWUpKSB7XG4gICAgICAgICAgaWYgKGlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5hZGRDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVDbGFzcycsIHJvdXRlQ2xhc3NGYWN0b3J5KTtcblxyXG5mdW5jdGlvbiByb3V0ZUhyZWZGYWN0b3J5IChSb3V0ZSwgJGxvY2F0aW9uLCAkdGltZW91dCkge1xuICAnbmdJbmplY3QnXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHNjb3BlOiB0cnVlLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBpZiAoaUF0dHJzLmlnbm9yZUhyZWYgPT09IHVuZGVmaW5lZCAmJiBSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICBpRWxlbWVudC5jbGljaygoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCB1cmxQYXRoID0gaUVsZW1lbnQuYXR0cignaHJlZicpLnJlcGxhY2UoL14jLywgJycpO1xuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+ICRsb2NhdGlvbi51cmwodXJsUGF0aCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2JqZWN0ID0gUm91dGUuZ2V0VXJsV3JpdGVycygpO1xuICAgICAgZm9yIChjb25zdCB3cml0ZXJOYW1lIGluIG9iamVjdCkge1xuICAgICAgICBjb25zdCB3cml0ZXIgPSBvYmplY3Rbd3JpdGVyTmFtZV07XG4gICAgICAgIHNjb3BlW2Ake3dyaXRlck5hbWV9VXJsV3JpdGVyYF0gPSB3cml0ZXI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzY29wZS4kd2F0Y2goaUF0dHJzLnJvdXRlSHJlZiwgKG5ld1VybCkgPT4ge1xuICAgICAgICBsZXQgdXJsO1xuICAgICAgICBpZiAoUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICB1cmwgPSBuZXdVcmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsID0gYCMke25ld1VybH1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpRWxlbWVudC5hdHRyKCdocmVmJywgdXJsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVIcmVmJywgcm91dGVIcmVmRmFjdG9yeSk7XG5cclxuZnVuY3Rpb24gcm91dGVPbkNsaWNrRmFjdG9yeSAoUm91dGUsICRsb2NhdGlvbiwgJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0J1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcblxuICAgIGxpbmsgKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgY29uc3QgTEVGVF9CVVRUT04gPSAwO1xuICAgICAgY29uc3QgTUlERExFX0JVVFRPTiA9IDE7XG5cbiAgICAgIGlmIChlbGVtZW50LmlzKCdhJykpIHtcbiAgICAgICAgYWRkV2F0Y2hUaGF0VXBkYXRlc0hyZWZBdHRyaWJ1dGUoKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGljaygoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09PSBMRUZUX0JVVFRPTikge1xuICAgICAgICAgICAgbmF2aWdhdGVUb1VybChnZXRVcmwoKSwgc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5tb3VzZXVwKChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT09IE1JRERMRV9CVVRUT04pIHtcbiAgICAgICAgICAgIG5hdmlnYXRlVG9VcmwoZ2V0VXJsKCksIHNob3VsZE9wZW5OZXdXaW5kb3coZXZlbnQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBuYXZpZ2F0ZVRvVXJsKF91cmwsIG5ld1dpbmRvdyA9IGZhbHNlKSB7XG4gICAgICAgIGxldCB1cmwgPSBfdXJsO1xuXG4gICAgICAgIGlmIChuZXdXaW5kb3cpIHtcbiAgICAgICAgICB1cmwgPSBgJHskd2luZG93LmxvY2F0aW9uLm9yaWdpbn0vJHt1cmx9YDtcbiAgICAgICAgICAkd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL14jLywgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkdGltZW91dCgoKSA9PiAkbG9jYXRpb24udXJsKHVybCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3VsZE9wZW5OZXdXaW5kb3coZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50LmJ1dHRvbiA9PT0gTUlERExFX0JVVFRPTiB8fCAoZXZlbnQuYnV0dG9uID09PSBMRUZUX0JVVFRPTiAmJiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFVybCgpIHtcbiAgICAgICAgY29uc3QgdXJsV3JpdGVycyA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICAgICAgY29uc3QgbG9jYWxzID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCB3cml0ZXJOYW1lIGluIHVybFdyaXRlcnMpIHtcbiAgICAgICAgICBsb2NhbHNbYCR7d3JpdGVyTmFtZX1VcmxXcml0ZXJgXSA9IHVybFdyaXRlcnNbd3JpdGVyTmFtZV07XG4gICAgICB9XG5cbiAgICAgICAgbGV0IHVybCA9IHNjb3BlLiRldmFsKGF0dHJzLnJvdXRlT25DbGljaywgXy5hc3NpZ24obG9jYWxzLCBzY29wZSkpO1xuXG4gICAgICAgIHJldHVybiBodG1sNVRoZVVybCh1cmwpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBodG1sNVRoZVVybCh1cmwpIHtcbiAgICAgICAgcmV0dXJuIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpID8gdXJsIDogYCMke3VybH1gO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Z2V0VXJsKCl9YFxuICAgICAgICB9LCAobmV3VXJsKSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5hdHRyKCdocmVmJywgbmV3VXJsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZU9uQ2xpY2snLCByb3V0ZU9uQ2xpY2tGYWN0b3J5KTtcblxyXG4vLyBAVE9ETyBub25lIG9mIHRoZSBhbmltYXRpb24gY29kZSBpbiB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiB0ZXN0ZWQuIE5vdCBzdXJlIGlmIGl0IGNhbiBiZSBhdCB0aGlzIHN0YWdlIFRoaXMgbmVlZHMgZnVydGhlciBpbnZlc3RpZ2F0aW9uLlxuLy8gQFRPRE8gdGhpcyBjb2RlIGRvZXMgdG9vIG11Y2gsIGl0IHNob3VsZCBiZSByZWZhY3RvcmVkLlxuXG5mdW5jdGlvbiByb3V0ZVZpZXdGYWN0b3J5KCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsICR0ZW1wbGF0ZVJlcXVlc3QsIFJvdXRlKSB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZTogZmFsc2UsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXY+PC9kaXY+JyxcbiAgICBsaW5rICh2aWV3RGlyZWN0aXZlU2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGxldCB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgbGV0IHZpZXdTY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHZpZXcgPSBWaWV3QmluZGluZ3MuZ2V0VmlldyhpQXR0cnMubmFtZSk7XG4gICAgICBjb25zdCBiaW5kaW5ncyA9IHZpZXcuZ2V0QmluZGluZ3MoKTtcblxuICAgICAgaUVsZW1lbnQuYWRkQ2xhc3MoJ25nLWhpZGUnKTtcblxuICAgICAgbGV0IHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRGF0YUZvckJpbmRpbmcgPSBiaW5kaW5nID0+IF8uY2xvbmVEZWVwKFN0YXRlLmdldFN1YnNldChnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKGJpbmRpbmcpKSk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGZpZWxkKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9ICdjb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGJpbmRpbmdbZmllbGRdID8gJGluamVjdG9yLmdldChgJHtiaW5kaW5nW2ZpZWxkXX1EaXJlY3RpdmVgKVswXSA6IGJpbmRpbmc7XG4gICAgICAgIHJldHVybiBfLmRlZmF1bHRzKF8ucGljayhzb3VyY2UsIFsnY29udHJvbGxlcicsICd0ZW1wbGF0ZVVybCcsICdjb250cm9sbGVyQXMnXSksIHtjb250cm9sbGVyQXM6ICckY3RybCd9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpIHtcbiAgICAgICAgY29uc3QgcmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXTtcblxuICAgICAgICBmb3IgKGxldCByZXF1aXJlbWVudCBvZiBBcnJheS5mcm9tKHJlcXVpcmVkU3RhdGUpKSB7XG4gICAgICAgICAgbGV0IG5lZ2F0ZVJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgIGlmICgnIScgPT09IHJlcXVpcmVtZW50LmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgcmVxdWlyZW1lbnQgPSByZXF1aXJlbWVudC5zbGljZSgxKTtcbiAgICAgICAgICAgIG5lZ2F0ZVJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGVsZW1lbnQgPSBTdGF0ZS5nZXQocmVxdWlyZW1lbnQpO1xuXG4gICAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGlmIGVsZW1lbnQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgKChlbGVtZW50ID09PSBudWxsKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE9ubHkgY2hlY2sgdmFsdWUgb2YgZWxlbWVudCBpZiBpdCBpcyBkZWZpbmVkXG4gICAgICAgICAgaWYgKG5lZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgZWxlbWVudCA9ICFlbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmluZGluZy5jYW5BY3RpdmF0ZSkge1xuICAgICAgICAgIGlmICghJGluamVjdG9yLmludm9rZShiaW5kaW5nLmNhbkFjdGl2YXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtYW5hZ2VWaWV3KGVsZW1lbnQsIGJpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nQmluZGluZyA9IGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncyk7XG5cbiAgICAgICAgaWYgKCFtYXRjaGluZ0JpbmRpbmcpIHtcbiAgICAgICAgICBpZiAodmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBkZXN0cm95VmlldyhlbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgUm91dGUuZGVsZXRlQ3VycmVudEJpbmRpbmcodmlldy5uYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IGdldFN0YXRlRGF0YUZvckJpbmRpbmcobWF0Y2hpbmdCaW5kaW5nKTtcbiAgICAgICAgaWYgKChtYXRjaGluZ0JpbmRpbmcgPT09IHByZXZpb3VzQmluZGluZykgJiYgYW5ndWxhci5lcXVhbHMocHJldmlvdXNCb3VuZFN0YXRlLCBuZXdTdGF0ZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiaW5kaW5nQ2hhbmdlZEV2ZW50RGF0YSA9IHsgdmlld05hbWU6IGlBdHRycy5uYW1lLCBjdXJyZW50QmluZGluZzogbWF0Y2hpbmdCaW5kaW5nIH07XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5iaW5kaW5nQ2hhbmdlZCcsIGJpbmRpbmdDaGFuZ2VkRXZlbnREYXRhKTtcblxuICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSBtYXRjaGluZ0JpbmRpbmc7XG4gICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IG5ld1N0YXRlO1xuXG4gICAgICAgIFBlbmRpbmdWaWV3Q291bnRlci5pbmNyZWFzZSgpO1xuXG4gICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChoYXNSZXNvbHZpbmdUZW1wbGF0ZSkge1xuICAgICAgICAgIC8vIEBUT0RPOiBNYWdpYyBudW1iZXJcbiAgICAgICAgICBjb25zdCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbiA9IGhhc1Jlc29sdmluZ1RlbXBsYXRlID8gMzAwIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgaWYgKCF2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuICRhbmltYXRlLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSB7XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKGJpbmRpbmdzKSkge1xuICAgICAgICAgIGlmIChoYXNSZXF1aXJlZERhdGEoYmluZGluZykpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lWaWV3KGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHZpZXdDcmVhdGVkID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCkucmVtb3ZlKCk7XG4gICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVWaWV3KGVsZW1lbnQsIGJpbmRpbmcsIG1pbmltdW1EZWxheSkge1xuICAgICAgICBjb25zdCB0aW1lU3RhcnRlZE1haW5WaWV3ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZyk7XG5cbiAgICAgICAgY29uc3Qgb25TdWNjZXNzZnVsUmVzb2x1dGlvbiA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgaWYgKGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykgIT09IGJpbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2aWV3Q3JlYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICBjb25zdCByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA9IERhdGUubm93KCkgLSB0aW1lU3RhcnRlZE1haW5WaWV3O1xuXG4gICAgICAgICAgY29uc3QgaW5qZWN0TWFpblRlbXBsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yKGUsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZ2l2ZSB0aGUgdmlldyB0aW1lIHRvIHByb3Blcmx5IGluaXRpYWxpc2VcbiAgICAgICAgICAgICAgLy8gYmVmb3JlIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgdGhlIGludGlhbFZpZXdzTG9hZGVkIGV2ZW50XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5ID0gTWF0aC5tYXgoMCwgbWluaW11bURlbGF5IC0gcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lIDwgbWluaW11bURlbGF5KSB7XG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gaW5qZWN0TWFpblRlbXBsYXRlKClcbiAgICAgICAgICAgICAgLCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmplY3RNYWluVGVtcGxhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25SZXNvbHV0aW9uRmFpbHVyZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkbG9nLmVycm9yKGVycm9yKTtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfTtcblxuICAgICAgICBSb3V0ZS5zZXRDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUsIGJpbmRpbmcpXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge3RlbXBsYXRlOiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCksIGRlcGVuZGVuY2llczogcmVzb2x2ZShiaW5kaW5nKX07XG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4ob25TdWNjZXNzZnVsUmVzb2x1dGlvbiwgb25SZXNvbHV0aW9uRmFpbHVyZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCB8fCAhYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgcmV0dXJuICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoJHJvb3RTY29wZS4kbmV3KCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmIChiaW5kaW5nLnJlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVybiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlID0gKGVsZW1lbnQsIGJpbmRpbmcpID0+IHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJyk7XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoYmluZGluZy5lcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLmVycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93RXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAnZXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCB0ZW1wbGF0ZUZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nW3RlbXBsYXRlRmllbGRdKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcbiAgICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgICBiaW5kaW5nQ29tcG9uZW50RmllbGQgPSAnZXJyb3JDb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYmluZGluZ1tiaW5kaW5nQ29tcG9uZW50RmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB7ZGVwZW5kZW5jaWVzOiB7ZXJyb3J9fTtcblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgYXJncy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpIHtcbiAgICAgICAgY29uc3Qge2RlcGVuZGVuY2llc30gPSBhcmdzO1xuICAgICAgICBjb25zdCB7dGVtcGxhdGV9ID0gYXJncztcblxuICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcblxuICAgICAgICBpZiAoY29tcG9uZW50LmNvbnRyb2xsZXIpIHtcbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSBfLm1lcmdlKGRlcGVuZGVuY2llcywgeyRzY29wZTogdmlld1Njb3BlLCAkZWxlbWVudDogZWxlbWVudC5jaGlsZHJlbigpLmVxKDApfSk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxzLiRzY29wZVtjb21wb25lbnQuY29udHJvbGxlckFzXSA9ICRjb250cm9sbGVyKGNvbXBvbmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KGVycm9yKSkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gJ0ZhaWxlZCB0byBzZXJpYWxpemUgZXJyb3Igb2JqZWN0IGZvciBsb2dnaW5nJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGxvZy5lcnJvcihgRmFpbGVkIGluc3RhbnRpYXRpbmcgY29udHJvbGxlciBmb3IgdmlldyAke3ZpZXd9OiAke2Vycm9yTWVzc2FnZX1gKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc29sdmUgPSBmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe30pO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVuY3lOYW1lIGluIGJpbmRpbmcucmVzb2x2ZSkge1xuICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lGYWN0b3J5ID0gYmluZGluZy5yZXNvbHZlW2RlcGVuZGVuY3lOYW1lXTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJGluamVjdG9yLmludm9rZShkZXBlbmRlbmN5RmFjdG9yeSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJHEucmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyA9IGJpbmRpbmcgPT4gXy51bmlvbihiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW10sIGJpbmRpbmcud2F0Y2hlZFN0YXRlIHx8IFtdKTtcblxuICAgICAgZnVuY3Rpb24gc3RyaXBOZWdhdGlvblByZWZpeChzdHIpIHtcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoMCkgPT09ICchJykge1xuICAgICAgICAgIHJldHVybiBzdHIuc3Vic3RyKDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyA9IHZpZXcgPT4gXy5mbGF0dGVuKF8ubWFwKHZpZXcuZ2V0QmluZGluZ3MoKSwgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZykpO1xuXG4gICAgICBjb25zdCBnZXRGaWVsZHNUb1dhdGNoID0gdmlldyA9PiBfLnVuaXEoXy5tYXAoZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyh2aWV3KSwgc3RyaXBOZWdhdGlvblByZWZpeCkpO1xuXG4gICAgICBjb25zdCBmaWVsZHMgPSBnZXRGaWVsZHNUb1dhdGNoKHZpZXcpO1xuXG4gICAgICByZXR1cm4gUm91dGUud2hlblJlYWR5KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgLy8gVHJ5IHRvIHN0YXJ0IHRoZSBiYWxsIHJvbGxpbmcgaW4gY2FzZSB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyBhbmQgd2UgY2FuIGNyZWF0ZSB0aGUgdmlldyBpbW1lZGlhdGVseVxuICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIERvbid0IGJvdGhlciBwdXR0aW5nIGluIGEgd2F0Y2hlciBpZiB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgZXZlciB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50XG4gICAgICAgIGlmIChmaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdGVXYXRjaGVyID0gZnVuY3Rpb24gKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAodmlld01hbmFnZW1lbnRQZW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBmaW5pc2ggdGhlIGRpZ2VzdCBjeWNsZSBiZWZvcmUgYnVpbGRpbmcgdGhlIHZpZXcsIHdoaWNoIHNob3VsZFxuICAgICAgICAgIC8vIHByZXZlbnQgdXMgZnJvbSByZS1yZW5kZXJpbmcgYSB2aWV3IG11bHRpcGxlIHRpbWVzIGlmIG11bHRpcGxlIHByb3BlcnRpZXMgb2YgdGhlIHNhbWUgc3RhdGUgZGVwZW5kZW5jeVxuICAgICAgICAgIC8vIGdldCBjaGFuZ2VkIHdpdGggcmVwZWF0ZWQgU3RhdGUuc2V0IGNhbGxzXG4gICAgICAgICAgcmV0dXJuICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHJldHVybiB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBTdGF0ZS53YXRjaChmaWVsZHMsIHN0YXRlV2F0Y2hlcik7XG5cbiAgICAgICAgdmlld0RpcmVjdGl2ZVNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiBTdGF0ZS5yZW1vdmVXYXRjaGVyKHN0YXRlV2F0Y2hlcikpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCd2aWV3Jywgcm91dGVWaWV3RmFjdG9yeSk7XG5cclxuY2xhc3MgUGVuZGluZ1ZpZXdDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoJHJvb3RTY29wZSkge1xuICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgfVxuXG4gIGluY3JlYXNlKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50ICs9IDE7XG4gIH1cblxuICBkZWNyZWFzZSgpIHtcbiAgICB0aGlzLmNvdW50ID0gTWF0aC5tYXgoMCwgdGhpcy5jb3VudCAtIDEpO1xuICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuaW5pdGlhbFZpZXdzTG9hZGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5jdXJyZW50Vmlld3NMb2FkZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1BlbmRpbmdWaWV3Q291bnRlcicsICgkcm9vdFNjb3BlKSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgUGVuZGluZ1ZpZXdDb3VudGVyKCRyb290U2NvcGUpO1xufSk7XG5cclxuY2xhc3MgV2F0Y2hhYmxlTGlzdCB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnksIGxpc3QpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG5cbiAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgIHRoaXMud2F0Y2hlcnMgPSBbXTtcbiAgfVxuXG4gIGdldChwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHBhdGgpO1xuICB9XG5cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLmxpc3Q7XG4gIH1cblxuICBnZXRTdWJzZXQocGF0aHMpIHtcbiAgICByZXR1cm4gXy56aXBPYmplY3QocGF0aHMsIF8ubWFwKHBhdGhzLCB0aGlzLmdldC5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBzZXQocGF0aCwgdmFsdWUpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlci5zZXQodGhpcy5saXN0LCBwYXRoLCB2YWx1ZSk7XG4gICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgdW5zZXQocGF0aHMpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMuT2JqZWN0SGVscGVyLnVuc2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gICAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgd2F0Y2gocGF0aHMsIGhhbmRsZXIpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMud2F0Y2hlcnMucHVzaCh0aGlzLldhdGNoZXJGYWN0b3J5LmNyZWF0ZShwYXRoLCBoYW5kbGVyLCB0aGlzLmdldChwYXRoKSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlV2F0Y2hlcih3YXRjaGVyKSB7XG4gICAgaWYgKHRoaXMud2F0Y2hlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld1dhdGNoZXJzID0gW107XG5cbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgdGhpc1dhdGNoZXIgPT4ge1xuICAgICAgaWYgKHRoaXNXYXRjaGVyLmhhbmRsZXIgIT09IHdhdGNoZXIpIHtcbiAgICAgICAgbmV3V2F0Y2hlcnMucHVzaCh0aGlzV2F0Y2hlcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy53YXRjaGVycyA9IG5ld1dhdGNoZXJzO1xuICB9XG5cbiAgX25vdGlmeVdhdGNoZXJzKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB3YXRjaGVyID0+IHtcbiAgICAgIGlmICh3YXRjaGVyLnNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCA9IHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHdhdGNoZXIud2F0Y2hQYXRoKTtcbiAgICAgICAgd2F0Y2hlci5ub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hhYmxlTGlzdEZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuICB9XG5cbiAgY3JlYXRlKGxpc3QgPSB7fSkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdCh0aGlzLk9iamVjdEhlbHBlciwgdGhpcy5XYXRjaGVyRmFjdG9yeSwgbGlzdCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGFibGVMaXN0RmFjdG9yeScsIChPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdEZhY3RvcnkoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSk7XG59KTtcblxyXG5jbGFzcyBXYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLndhdGNoUGF0aCA9IHdhdGNoUGF0aDtcbiAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAoaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIF90b2tlbml6ZVBhdGgocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJyk7XG4gIH1cblxuICBzaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgLy8gTkIgc2hvcnQgY2lyY3VpdCBsb2dpYyBpbiB0aGUgc2ltcGxlIGNhc2VcbiAgICBpZiAodGhpcy53YXRjaFBhdGggPT09IGNoYW5nZWRQYXRoKSB7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHRoaXMuY3VycmVudFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2F0Y2ggPSB7XG4gICAgICBwYXRoOiB0aGlzLndhdGNoUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKHRoaXMud2F0Y2hQYXRoKSxcbiAgICAgIHZhbHVlOiB0aGlzLmN1cnJlbnRWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBjaGFuZ2UgPSB7XG4gICAgICBwYXRoOiBjaGFuZ2VkUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKGNoYW5nZWRQYXRoKSxcbiAgICAgIHZhbHVlOiBuZXdWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBtaW5pbXVtTGVudGggPSBNYXRoLm1pbihjaGFuZ2UudG9rZW5zLmxlbmd0aCwgd2F0Y2gudG9rZW5zLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgdG9rZW5JbmRleCA9IDA7IHRva2VuSW5kZXggPCBtaW5pbXVtTGVudGg7IHRva2VuSW5kZXgrKykge1xuICAgICAgaWYgKHdhdGNoLnRva2Vuc1t0b2tlbkluZGV4XSAhPT0gY2hhbmdlLnRva2Vuc1t0b2tlbkluZGV4XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTkIgaWYgd2UgZ2V0IGhlcmUgdGhlbiBhbGwgY29tbW9uIHRva2VucyBtYXRjaFxuXG4gICAgY29uc3QgY2hhbmdlUGF0aElzRGVzY2VuZGFudCA9IGNoYW5nZS50b2tlbnMubGVuZ3RoID4gd2F0Y2gudG9rZW5zLmxlbmd0aDtcblxuICAgIGlmIChjaGFuZ2VQYXRoSXNEZXNjZW5kYW50KSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBjaGFuZ2UudG9rZW5zLnNsaWNlKHdhdGNoLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGggPSBfLmdldCh3YXRjaC52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMoY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCwgY2hhbmdlLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gd2F0Y2gudG9rZW5zLnNsaWNlKGNoYW5nZS50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hQYXRoID0gXy5nZXQoY2hhbmdlLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh3YXRjaC52YWx1ZSwgbmV3VmFsdWVBdFdhdGNoUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIHRoaXMuaGFuZGxlcihjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIHRoaXMuY3VycmVudFZhbHVlKTtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKG5ld1ZhbHVlKTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGVyRmFjdG9yeSB7XG4gIGNyZWF0ZSh3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hlcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGVyRmFjdG9yeScsICgpID0+IHtcbiAgcmV0dXJuIG5ldyBXYXRjaGVyRmFjdG9yeSgpO1xufSk7XG5cclxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignUm91dGUnLCBmdW5jdGlvbihPYmplY3RIZWxwZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuICBjb25zdCB0b2tlbnMgPSB7fTtcbiAgY29uc3QgdXJsV3JpdGVycyA9IFtdO1xuICBjb25zdCB1cmxzID0gW107XG4gIGNvbnN0IHBlcnNpc3RlbnRTdGF0ZXMgPSBbXTtcbiAgY29uc3QgcmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgdHlwZXMgPSB7fTtcbiAgbGV0IGh0bWw1TW9kZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3ZpZGVyID0ge1xuXG4gICAgcmVnaXN0ZXJUeXBlKG5hbWUsIGNvbmZpZykge1xuICAgICAgdHlwZXNbbmFtZV0gPSBjb25maWc7XG4gICAgICB0eXBlc1tuYW1lXS5yZWdleCA9IG5ldyBSZWdFeHAodHlwZXNbbmFtZV0ucmVnZXguc291cmNlLCAnaScpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVHlwZSB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxUb2tlbihuYW1lLCBjb25maWcpIHtcbiAgICAgIHRva2Vuc1tuYW1lXSA9IF8uZXh0ZW5kKHtuYW1lfSwgY29uZmlnKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFRva2VuIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFdyaXRlcihuYW1lLCBmbikge1xuICAgICAgdXJsV3JpdGVyc1tuYW1lXSA9IGZuO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsV3JpdGVyIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybChwYXR0ZXJuLCBjb25maWcgPSB7fSkge1xuICAgICAgY29uc3QgdXJsRGF0YSA9IHtcbiAgICAgICAgY29tcGlsZWRVcmw6IHRoaXMuX2NvbXBpbGVVcmxQYXR0ZXJuKHBhdHRlcm4sIGNvbmZpZyksXG4gICAgICAgIHBhdHRlcm5cbiAgICAgIH07XG5cbiAgICAgIHVybHMucHVzaChfLmV4dGVuZCh1cmxEYXRhLCBjb25maWcpKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybCB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGVyc2lzdGVudFN0YXRlcyguLi5zdGF0ZUxpc3QpIHtcbiAgICAgIF8uZm9yRWFjaChzdGF0ZUxpc3QsIChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIXBlcnNpc3RlbnRTdGF0ZXMuaW5jbHVkZXMoc3RhdGUpKSB7XG4gICAgICAgICAgcGVyc2lzdGVudFN0YXRlcy5wdXNoKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldEh0bWw1TW9kZShtb2RlKSB7XG4gICAgICBodG1sNU1vZGUgPSBtb2RlO1xuICAgIH0sXG5cbiAgICBfY29tcGlsZVVybFBhdHRlcm4odXJsUGF0dGVybiwgY29uZmlnKSB7XG4gICAgICBsZXQgbWF0Y2g7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyh1cmxQYXR0ZXJuKTtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2godXJsUGF0dGVybik7XG5cbiAgICAgIGNvbnN0IHRva2VuUmVnZXggPSAvXFx7KFtBLVphLXpcXC5fMC05XSspXFx9L2c7XG4gICAgICBsZXQgdXJsUmVnZXggPSB1cmxQYXR0ZXJuO1xuXG4gICAgICBpZiAoIWNvbmZpZy5wYXJ0aWFsTWF0Y2gpIHtcbiAgICAgICAgdXJsUmVnZXggPSBgXiR7dXJsUmVnZXh9JGA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRva2VuTGlzdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKG1hdGNoID0gdG9rZW5SZWdleC5leGVjKHVybFBhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1ttYXRjaFsxXV07XG4gICAgICAgIHRva2VuTGlzdC5wdXNoKHRva2VuKTtcbiAgICAgICAgdXJsUmVnZXggPSB1cmxSZWdleC5yZXBsYWNlKG1hdGNoWzBdLCBgKCR7dHlwZXNbdG9rZW4udHlwZV0ucmVnZXguc291cmNlfSlgKTtcbiAgICAgIH1cblxuICAgICAgdXJsUmVnZXgucmVwbGFjZSgnLicsICdcXFxcLicpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCh1cmxSZWdleCwgJ2knKSxcbiAgICAgICAgdG9rZW5zOiB0b2tlbkxpc3RcbiAgICAgIH07XG4gICAgfSxcblxuICAgIF9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2goc3RyKSB7XG4gICAgICBpZiAoc3RyLm1hdGNoKC9cXC8kLykpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXC8kLywgJy8/Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCR7c3RyfS8/YDtcbiAgICB9LFxuXG4gICAgX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXChcXClcXCpcXCtcXD9cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICB9LFxuXG4gICAgJGdldCgkbG9jYXRpb24sICRpbmplY3RvciwgJHEpIHtcbiAgICAgICduZ0luamVjdCc7XG5cbiAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc2VydmljZSAob25seSBkb25lIG9uY2UpLCB3ZSBuZWVkIHRvIGl0ZXJhdGUgb3ZlciB0aGUgdXJsV3JpdGVycyBhbmQgdHVyblxuICAgICAgLy8gdGhlbSBpbnRvIG1ldGhvZHMgdGhhdCBpbnZva2UgdGhlIFJFQUwgdXJsV3JpdGVyLCBidXQgcHJvdmlkaW5nIGRlcGVuZGVuY3kgaW5qZWN0aW9uIHRvIGl0LCB3aGlsZSBhbHNvXG4gICAgICAvLyBnaXZpbmcgaXQgdGhlIGRhdGEgdGhhdCB0aGUgY2FsbGVlIHBhc3NlcyBpbi5cblxuICAgICAgLy8gVGhlIHJlYXNvbiB3ZSBoYXZlIHRvIGRvIHRoaXMgaGVyZSBpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoZSAkaW5qZWN0b3IgYmFjayBpbiB0aGUgcm91dGVQcm92aWRlci5cblxuICAgICAgXy5mb3JJbih1cmxXcml0ZXJzLCAod3JpdGVyLCB3cml0ZXJOYW1lKSA9PlxuICAgICAgICB1cmxXcml0ZXJzW3dyaXRlck5hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmICghZGF0YSkgeyBkYXRhID0ge307IH1cbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSB7VXJsRGF0YTogZGF0YX07XG4gICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5pbnZva2Uod3JpdGVyLCB7fSwgbG9jYWxzKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgbGV0IGZsYXNoU3RhdGVzID0gW107XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgIGN1cnJlbnRCaW5kaW5nczoge30sXG4gICAgICAgIHJlYWR5RGVmZXJyZWQ6ICRxLmRlZmVyKCksXG5cbiAgICAgICAgbWF0Y2godXJsVG9NYXRjaCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdXJsIG9mIEFycmF5LmZyb20odXJscykpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSB1cmwuY29tcGlsZWRVcmwucmVnZXguZXhlYyh1cmxUb01hdGNoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHt1cmwsIHJlZ2V4TWF0Y2g6IG1hdGNofTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERhdGEobWF0Y2gsIHNlYXJjaERhdGEgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMuZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKTtcbiAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5leHRyYWN0UGF0aERhdGEobWF0Y2gpO1xuICAgICAgICAgIHNlYXJjaERhdGEgPSB0aGlzLmV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpO1xuICAgICAgICAgIHJldHVybiBPYmplY3RIZWxwZXIuZGVmYXVsdChzZWFyY2hEYXRhLCBwYXRoLCBkZWZhdWx0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSkge1xuICAgICAgICAgIGlmICghc2VhcmNoRGF0YSkgeyBzZWFyY2hEYXRhID0gJGxvY2F0aW9uLnNlYXJjaCgpOyB9XG4gICAgICAgICAgY29uc3QgZGF0YSA9IF8uY2xvbmUoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKGRhdGEsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0S2V5ID0gXy5maW5kS2V5KHRva2VucywgeyBzZWFyY2hBbGlhczoga2V5IH0pO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRLZXkpIHsgdGFyZ2V0S2V5ID0ga2V5OyB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZU5hbWUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IF8uZ2V0KHRva2Vuc1t0YXJnZXRLZXldLCAndHlwZScpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCF0b2tlbnNbdGFyZ2V0S2V5XSB8fCAodHlwZXNbdG9rZW5UeXBlTmFtZV0ucmVnZXgudGVzdCh2YWx1ZSkpKSB7XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS50eXBlIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0eXBlVG9rZW5UeXBlID0gdG9rZW5UeXBlID8gdHlwZXNbdG9rZW5UeXBlXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlUGFyc2VkID0gdHlwZVRva2VuVHlwZSA/IHR5cGVUb2tlblR5cGUucGFyc2VyIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgIGlmICh0b2tlblR5cGVQYXJzZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodG9rZW5UeXBlUGFyc2VkLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblRhcmdldEtleVN0YXRlUGF0aCA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0uc3RhdGVQYXRoIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCBkYXRhS2V5ID0gdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggfHwgdGFyZ2V0S2V5O1xuXG4gICAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQobmV3RGF0YSwgZGF0YUtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKG1hdGNoLnVybC5zdGF0ZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwga2V5LCAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IF8uY2xvbmVEZWVwKHZhbHVlKSA6IHZhbHVlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0UGF0aERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICAgY29uc3QgcGF0aFRva2VucyA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnM7XG5cbiAgICAgICAgICBpZiAocGF0aFRva2Vucy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHt9OyB9XG5cbiAgICAgICAgICBmb3IgKGxldCBuID0gMCwgZW5kID0gcGF0aFRva2Vucy5sZW5ndGgtMSwgYXNjID0gMCA8PSBlbmQ7IGFzYyA/IG4gPD0gZW5kIDogbiA+PSBlbmQ7IGFzYyA/IG4rKyA6IG4tLSkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zW25dO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbWF0Y2gucmVnZXhNYXRjaFtuKzFdO1xuXG4gICAgICAgICAgICBpZiAodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyKSB7IHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIsIG51bGwsIHt0b2tlbjogdmFsdWV9KTsgfVxuXG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsICh0b2tlbi5zdGF0ZVBhdGggfHwgdG9rZW4ubmFtZSksIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXJzKCkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcihuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdvKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiAkbG9jYXRpb24udXJsKHRoaXMuaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRQZXJzaXN0ZW50U3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBwZXJzaXN0ZW50U3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBbXTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRGbGFzaFN0YXRlcyguLi5uZXdTdGF0ZXMpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IGZsYXNoU3RhdGVzLmNvbmNhdChuZXdTdGF0ZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBmbGFzaFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSwgYmluZGluZykge1xuICAgICAgICAgIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXSA9IGJpbmRpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlbGV0ZUN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBtYXRjaGVzQ3VycmVudEJpbmRpbmdOYW1lKHZpZXdOYW1lLCBiaW5kaW5nTmFtZUV4cHJlc3Npb24pIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50QmluZGluZyA9IHRoaXMuZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpXG5cbiAgICAgICAgICBpZiAoIWN1cnJlbnRCaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gYmluZGluZ05hbWVFeHByZXNzaW9uIGluc3RhbmNlb2YgUmVnRXhwID9cbiAgICAgICAgICAgIGJpbmRpbmdOYW1lRXhwcmVzc2lvbi50ZXN0KGN1cnJlbnRCaW5kaW5nLm5hbWUpIDpcbiAgICAgICAgICAgIGN1cnJlbnRCaW5kaW5nLm5hbWUgPT09IGJpbmRpbmdOYW1lRXhwcmVzc2lvbjtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZWFkeShyZWFkeSkge1xuICAgICAgICAgIGlmICghcmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1JlYWR5KCkge1xuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0h0bWw1TW9kZUVuYWJsZWQoKSB7XG4gICAgICAgICAgcmV0dXJuIGh0bWw1TW9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICB3aGVuUmVhZHkoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHlEZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdudW1lcmljJywge3JlZ2V4OiAvXFxkKy8sIHBhcnNlcjogWyd0b2tlbicsIHRva2VuID0+IHBhcnNlSW50KHRva2VuKV19KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbHBoYScsIHtyZWdleDogL1thLXpBLVpdKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbnknLCB7cmVnZXg6IC8uKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdsaXN0Jywge3JlZ2V4OiAvLisvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiB0b2tlbi5zcGxpdCgnLCcpXX0pO1xuXG4gIHJldHVybiBwcm92aWRlcjtcbn0pO1xuXHJcbmNsYXNzIFN0YXRlUHJvdmlkZXIge1xuICAkZ2V0KFdhdGNoYWJsZUxpc3RGYWN0b3J5KSB7XG4gICAgJ25nSW5qZWN0JztcbiAgICByZXR1cm4gV2F0Y2hhYmxlTGlzdEZhY3RvcnkuY3JlYXRlKCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignU3RhdGUnLCBuZXcgU3RhdGVQcm92aWRlcik7XG5cclxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignVmlld0JpbmRpbmdzJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCB2aWV3cyA9IFtdO1xuXG4gIGNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJpbmRpbmdzKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgaWYgKCEodGhpcy5iaW5kaW5ncyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0gW3RoaXMuYmluZGluZ3NdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEJpbmRpbmdzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3M7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIGJpbmQobmFtZSwgY29uZmlnKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShiaW5kaW5ncywgY29tbW9uUmVxdWlyZWRTdGF0ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoYmluZGluZy5yZXF1aXJlZFN0YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBbYmluZGluZy5yZXF1aXJlZFN0YXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goYmluZGluZy5yZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlLmNvbmNhdChjb21tb25SZXF1aXJlZFN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXNvbHZlKGJpbmRpbmdzLCBjb21tb25SZXNvbHZlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoISgncmVzb2x2ZScgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVzb2x2ZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChfLmRlZmF1bHRzKGJpbmRpbmcucmVzb2x2ZSwgY29tbW9uUmVzb2x2ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJhc2ljQ29tbW9uRmllbGRzID0gW1xuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JUZW1wbGF0ZVVybCd9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCBjb21tb25GaWVsZCBvZiBBcnJheS5mcm9tKGJhc2ljQ29tbW9uRmllbGRzKSkge1xuICAgICAgICAgIGlmIChjb21tb25GaWVsZC5uYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgZGVmYXVsdEJpbmRpbmdGaWVsZChuZXdCaW5kaW5ncywgY29tbW9uRmllbGQub3ZlcnJpZGVGaWVsZCwgY29uZmlnW2NvbW1vbkZpZWxkLm5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlcXVpcmVkU3RhdGUnIGluIGNvbmZpZykge1xuICAgICAgICAgIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXF1aXJlZFN0YXRlJ10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXNvbHZlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb21tb25SZXNvbHZlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlc29sdmUnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdEJpbmRpbmdGaWVsZChiaW5kaW5ncywgZmllbGROYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgIGlmICghKGZpZWxkTmFtZSBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgaXRlbSA9IGJpbmRpbmdbZmllbGROYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
