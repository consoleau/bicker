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

    setTimeout(function () {
      var routeChangeSuccessEventData = { 'bindings': Route.getCurrentBindings() };
      $rootScope.$broadcast('bicker_router.routeChangeSuccess', routeChangeSuccessEventData);
    }, 1);
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
        getCurrentBindings: function getCurrentBindings() {
          return this.currentBindings;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFpQixDQUFoQyxBQUFnQyxBQUFDLGNBQWpDLEFBQStDLHdGQUFJLFVBQUEsQUFBVSxPQUFWLEFBQWlCLE9BQWpCLEFBQXdCLFdBQXhCLEFBQW1DLFlBQW5DLEFBQStDLGNBQS9DLEFBQTZELG9CQUFvQixBQUNsSTtBQUVBOztNQUFJLFNBQUosQUFBYSxBQUNiO2FBQUEsQUFBVyxJQUFYLEFBQWUsd0JBQXdCLFlBQVksQUFDakQ7UUFBSSxNQUFKLEFBQUksQUFBTSxXQUFXLEFBQ25CO1lBQUEsQUFBTSxTQUFOLEFBQWUsQUFDaEI7QUFDRjtBQUpELEFBTUE7O2FBQUEsQUFBVyxJQUFYLEFBQWUsMEJBQTBCLFVBQUEsQUFBVSxHQUFWLEFBQWEsUUFBUSxBQUM1RDtBQUNBO1FBQUksWUFBSixBQUNBO1FBQUksV0FBSixBQUFlLFFBQVEsQUFDckI7QUFDRDtBQUVEOzthQUFBLEFBQVMsQUFFVDs7dUJBQUEsQUFBbUIsQUFDbkI7UUFBTSxRQUFRLE1BQUEsQUFBTSxNQUFNLFVBQTFCLEFBQWMsQUFBWSxBQUFVLEFBRXBDOztRQUFJLENBQUosQUFBSyxPQUFPLEFBQ1Y7YUFBQSxBQUFPLEFBQ1I7QUFGRCxXQUVPLEFBQ0w7YUFBTyxNQUFBLEFBQU0sWUFBYixBQUFPLEFBQWtCLEFBQzFCO0FBRUQ7O1FBQUksZ0JBQWdCLGFBQUEsQUFBYSxNQUFNLE1BQW5CLEFBQXlCLE1BQTdDLEFBQW9CLEFBQStCLEFBQ25EO29CQUFnQixFQUFBLEFBQUUsV0FBRixBQUFhLGVBQWUsTUFBQSxBQUFNLHNCQUFOLEFBQTRCLE9BQU8sTUFBL0UsQUFBZ0IsQUFBNEIsQUFBbUMsQUFBTSxBQUVyRjs7UUFBTSxZ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LEFBQWtELGNBQWMsQUFDOUQ7WUFBTSxTQUR3RCxBQUM5RCxBQUFlOzBDQUQrQztrQ0FBQTsrQkFBQTs7WUFFOUQ7aUNBQXNCLE1BQUEsQUFBTSxLQUE1QixBQUFzQixBQUFXLG9KQUFjO2dCQUFwQyxBQUFvQyxrQkFDN0M7O2dCQUFJLFlBQUosQUFDQTtnQkFBSSxFQUFFLGFBQU4sQUFBSSxBQUFlLFVBQVUsQUFDM0I7cUJBQU8sUUFBQSxBQUFRLGFBQWYsQUFBNEIsQUFDN0I7QUFDRDttQkFBQSxBQUFPLEtBQVAsQUFBWSxBQUNiO0FBUjZEO3NCQUFBO2dDQUFBOzZCQUFBO2tCQUFBO2NBQUE7b0VBQUE7MEJBQUE7QUFBQTtvQkFBQTtxQ0FBQTtvQkFBQTtBQUFBO0FBQUE7QUFTOUQ7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O1VBQUksY0FBSixBQUFrQixBQUNsQjtVQUFJLGNBQUosQUFBa0IsUUFBUSxBQUN4QjtzQkFBYyxPQUFkLEFBQWMsQUFBTyxBQUN0QjtBQUZELGFBRU8sQUFDTDtzQkFBZSxrQkFBRCxBQUFtQixRQUFuQixBQUE0QixTQUFTLENBQW5ELEFBQW1ELEFBQUMsQUFDckQ7QUFFRDs7VUFBSSxFQUFFLFlBQUEsQUFBWSxTQUFsQixBQUFJLEFBQXVCLElBQUksQUFDN0I7Y0FBTSxJQUFBLEFBQUksZ0VBQUosQUFBaUUsT0FBdkUsQUFDRDtBQUVEOzt3QkFBQSxBQUFrQixBQUNsQjthQUFPLE1BQUEsQUFBTSxRQUFRLElBQUEsQUFBSSxLQUFKLEFBQVMsTUFBOUIsQUFBcUIsQUFBZSxBQUNyQztBQTFFSSxBQTRFTDtBQTVFSywwQkE0RUUsQUFDTDs7QUFBTyxrQ0FBQSxBQUNHLE1BQU0sQUFDWjtpQkFBTyxNQUFQLEFBQU8sQUFBTSxBQUNkO0FBSEgsQUFBTyxBQUtSO0FBTFEsQUFDTDtBQTlFTixBQUFPLEFBb0ZSO0FBcEZRLEFBRUw7QUFuQkoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInLCBbJ25nQW5pbWF0ZSddKS5ydW4oZnVuY3Rpb24gKFN0YXRlLCBSb3V0ZSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCBPYmplY3RIZWxwZXIsIFBlbmRpbmdWaWV3Q291bnRlcikge1xuICBcIm5nSW5qZWN0XCI7XG5cbiAgbGV0IG9sZFVybCA9IHVuZGVmaW5lZDtcbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChSb3V0ZS5pc1JlYWR5KCkpIHtcbiAgICAgIFJvdXRlLnNldFJlYWR5KGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKGUsIG5ld1VybCkge1xuICAgIC8vIFdvcmstYXJvdW5kIGZvciBBbmd1bGFySlMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9pc3N1ZXMvODM2OFxuICAgIGxldCBkYXRhO1xuICAgIGlmIChuZXdVcmwgPT09IG9sZFVybCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9sZFVybCA9IG5ld1VybDtcblxuICAgIFBlbmRpbmdWaWV3Q291bnRlci5yZXNldCgpO1xuICAgIGNvbnN0IG1hdGNoID0gUm91dGUubWF0Y2goJGxvY2F0aW9uLnBhdGgoKSk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBSb3V0ZS5leHRyYWN0RGF0YShtYXRjaCk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkc1RvVW5zZXQgPSBPYmplY3RIZWxwZXIubm90SW4oU3RhdGUubGlzdCwgZGF0YSk7XG4gICAgZmllbGRzVG9VbnNldCA9IF8uZGlmZmVyZW5jZShmaWVsZHNUb1Vuc2V0LCBSb3V0ZS5nZXRQZXJzaXN0ZW50U3RhdGVzKCkuY29uY2F0KFJvdXRlLmdldEZsYXNoU3RhdGVzKCkpKTtcblxuICAgIGNvbnN0IGV2ZW50RGF0YSA9IHt1bnNldHRpbmc6IGZpZWxkc1RvVW5zZXQsIHNldHRpbmc6IGRhdGF9O1xuICAgICRyb290U2NvcGUuJGVtaXQoJ2JpY2tlcl9yb3V0ZXIuYmVmb3JlU3RhdGVDaGFuZ2UnLCBldmVudERhdGEpO1xuXG4gICAgaWYgKChldmVudERhdGEudW5zZXR0aW5nKS5sZW5ndGggIT09IDApIHtcbiAgICAgIFN0YXRlLnVuc2V0KGV2ZW50RGF0YS51bnNldHRpbmcpO1xuICAgIH1cblxuICAgIF8uZm9yRWFjaChldmVudERhdGEuc2V0dGluZywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIFJvdXRlLnJlc2V0Rmxhc2hTdGF0ZXMoKTtcbiAgICBSb3V0ZS5zZXRSZWFkeSh0cnVlKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3Qgcm91dGVDaGFuZ2VTdWNjZXNzRXZlbnREYXRhID0geydiaW5kaW5ncyc6IFJvdXRlLmdldEN1cnJlbnRCaW5kaW5ncygpfTtcbiAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5yb3V0ZUNoYW5nZVN1Y2Nlc3MnLCByb3V0ZUNoYW5nZVN1Y2Nlc3NFdmVudERhdGEpO1xuICAgIH0sIDEpXG4gIH0pO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ09iamVjdEhlbHBlcicsIHtcbiAgZ2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV07XG4gIH0sXG5cbiAgc2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBpZiAocGFyZW50W3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFyZW50W3NlZ21lbnRdID0ge307XG4gICAgICB9XG5cbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV0gPSB2YWx1ZTtcbiAgfSxcblxuICB1bnNldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG5cbiAgICBpZiAocGFyZW50W2tleV0gPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBkZWxldGUgcGFyZW50W2tleV07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgLy8gUmVjdXJzaXZlbHkgcmV0dXJuIHRoZSBwcm9wZXJ0aWVzIGluIGEgdGhhdCBhcmVuJ3QgaW4gYlxuICBub3RJbihhLCBiLCBwcmVmaXggPSAnJykge1xuICAgIGxldCBub3RJbiA9IFtdO1xuICAgIHByZWZpeCA9IHByZWZpeC5sZW5ndGggPiAwID8gYCR7cHJlZml4fS5gIDogJyc7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKE9iamVjdC5rZXlzKGEpKSkge1xuICAgICAgY29uc3QgdGhpc1BhdGggPSBgJHtwcmVmaXh9JHtrZXl9YDtcblxuICAgICAgaWYgKGJba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vdEluLnB1c2godGhpc1BhdGgpO1xuXG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgYVtrZXldID09PSAnb2JqZWN0JykgJiYgKCEoYVtrZXldIGluc3RhbmNlb2YgQXJyYXkpKSkge1xuICAgICAgICBub3RJbiA9IG5vdEluLmNvbmNhdCh0aGlzLm5vdEluKGFba2V5XSwgYltrZXldLCB0aGlzUGF0aCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub3RJbjtcbiAgfSxcblxuICBkZWZhdWx0KG92ZXJyaWRlcywgLi4uZGVmYXVsdFNldHMpIHtcbiAgICBsZXQgZGVmYXVsdFNldCwgdmFsdWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBpZiAoZGVmYXVsdFNldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBkZWZhdWx0U2V0ID0gZGVmYXVsdFNldHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRTZXQgPSB0aGlzLmRlZmF1bHQoLi4uQXJyYXkuZnJvbShkZWZhdWx0U2V0cyB8fCBbXSkpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRTZXQpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFNldFtrZXldO1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiBvdmVycmlkZXNba2V5XSA9PT0gXCJvYmplY3RcIikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmRlZmF1bHQob3ZlcnJpZGVzW2tleV0sIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3ZlcnJpZGVzKSB7XG4gICAgICB2YWx1ZSA9IG92ZXJyaWRlc1trZXldO1xuICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSB8fCB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxuXG4vLyBVc2FnZTpcbi8vXG4vLyBJZiB5b3Ugd2FudCB0byBhZGQgdGhlIGNsYXNzIFwiYWN0aXZlXCIgdG8gYW4gYW5jaG9yIGVsZW1lbnQgd2hlbiB0aGUgXCJtYWluXCIgdmlldyBoYXMgYSBiaW5kaW5nXG4vLyB3aXRoIHRoZSBuYW1lIFwibXlCaW5kaW5nXCIgcmVuZGVyZWQgd2l0aGluIGl0XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCJ7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAnbXlCaW5kaW5nJyB9XCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuLy8gWW91IGNhbiBhbHNvIHVzZSByZWd1bGFyIGV4cHJlc3Npb25zIGZvciB0aGUgYmluZGluZyBuYW1lLCBidXQgdG8gZG8gc28geW91IGhhdmUgdG8gcHJvdmlkZSBhIG1ldGhvZFxuLy8gb24geW91ciBjb250cm9sbGVyIHdoaWNoIHJldHVybnMgdGhlIHJvdXRlIGNsYXNzIGRlZmluaXRpb24gb2JqZWN0LCBiZWNhdXNlIEFuZ3VsYXJKUyBleHByZXNzaW9uc1xuLy8gZG9uJ3Qgc3VwcG9ydCBpbmxpbmUgcmVndWxhciBleHByZXNzaW9uc1xuLy9cbi8vIGNsYXNzIE15Q29udHJvbGxlciB7XG4vLyAgZ2V0Um91dGVDbGFzc09iamVjdCgpIHtcbi8vICAgIHJldHVybiB7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAvbXlCaW5kLyB9XG4vLyAgfVxuLy8gfVxuLy9cbi8vIDxhIHJvdXRlLWNsYXNzPVwiJGN0cmwuZ2V0Um91dGVDbGFzc09iamVjdCgpXCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuXG5mdW5jdGlvbiByb3V0ZUNsYXNzRmFjdG9yeShSb3V0ZSkge1xuICAnbmdJbmplY3QnXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBsaW5rIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgc2NvcGUuJHdhdGNoKCgpID0+IHtcbiAgICAgICAgY29uc3Qgcm91dGVDbGFzc0RlZmluaXRpb24gPSBzY29wZS4kZXZhbChpQXR0cnNbJ3JvdXRlQ2xhc3MnXSlcblxuICAgICAgICBpZiAoIVJvdXRlLm1hdGNoZXNDdXJyZW50QmluZGluZ05hbWUocm91dGVDbGFzc0RlZmluaXRpb24udmlld05hbWUsIHJvdXRlQ2xhc3NEZWZpbml0aW9uLmJpbmRpbmdOYW1lKSkge1xuICAgICAgICAgIGlmIChpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5yZW1vdmVDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghaUVsZW1lbnQuaGFzQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgaUVsZW1lbnQuYWRkQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlQ2xhc3MnLCByb3V0ZUNsYXNzRmFjdG9yeSk7XG5cbmZ1bmN0aW9uIHJvdXRlSHJlZkZhY3RvcnkgKFJvdXRlLCAkbG9jYXRpb24sICR0aW1lb3V0KSB7XG4gICduZ0luamVjdCdcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgc2NvcGU6IHRydWUsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGlmIChpQXR0cnMuaWdub3JlSHJlZiA9PT0gdW5kZWZpbmVkICYmIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgIGlFbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHVybFBhdGggPSBpRWxlbWVudC5hdHRyKCdocmVmJykucmVwbGFjZSgvXiMvLCAnJyk7XG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmxQYXRoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvYmplY3QgPSBSb3V0ZS5nZXRVcmxXcml0ZXJzKCk7XG4gICAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IHdyaXRlciA9IG9iamVjdFt3cml0ZXJOYW1lXTtcbiAgICAgICAgc2NvcGVbYCR7d3JpdGVyTmFtZX1VcmxXcml0ZXJgXSA9IHdyaXRlcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNjb3BlLiR3YXRjaChpQXR0cnMucm91dGVIcmVmLCAobmV3VXJsKSA9PiB7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmIChSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgIHVybCA9IG5ld1VybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmwgPSBgIyR7bmV3VXJsfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlFbGVtZW50LmF0dHIoJ2hyZWYnLCB1cmwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZUhyZWYnLCByb3V0ZUhyZWZGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVPbkNsaWNrRmFjdG9yeSAoUm91dGUsICRsb2NhdGlvbiwgJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0J1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcblxuICAgIGxpbmsgKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgY29uc3QgTEVGVF9CVVRUT04gPSAwO1xuICAgICAgY29uc3QgTUlERExFX0JVVFRPTiA9IDE7XG5cbiAgICAgIGlmIChlbGVtZW50LmlzKCdhJykpIHtcbiAgICAgICAgYWRkV2F0Y2hUaGF0VXBkYXRlc0hyZWZBdHRyaWJ1dGUoKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGljaygoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09PSBMRUZUX0JVVFRPTikge1xuICAgICAgICAgICAgbmF2aWdhdGVUb1VybChnZXRVcmwoKSwgc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5tb3VzZXVwKChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT09IE1JRERMRV9CVVRUT04pIHtcbiAgICAgICAgICAgIG5hdmlnYXRlVG9VcmwoZ2V0VXJsKCksIHNob3VsZE9wZW5OZXdXaW5kb3coZXZlbnQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBuYXZpZ2F0ZVRvVXJsKF91cmwsIG5ld1dpbmRvdyA9IGZhbHNlKSB7XG4gICAgICAgIGxldCB1cmwgPSBfdXJsO1xuXG4gICAgICAgIGlmIChuZXdXaW5kb3cpIHtcbiAgICAgICAgICB1cmwgPSBgJHskd2luZG93LmxvY2F0aW9uLm9yaWdpbn0vJHt1cmx9YDtcbiAgICAgICAgICAkd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL14jLywgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkdGltZW91dCgoKSA9PiAkbG9jYXRpb24udXJsKHVybCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3VsZE9wZW5OZXdXaW5kb3coZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50LmJ1dHRvbiA9PT0gTUlERExFX0JVVFRPTiB8fCAoZXZlbnQuYnV0dG9uID09PSBMRUZUX0JVVFRPTiAmJiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFVybCgpIHtcbiAgICAgICAgY29uc3QgdXJsV3JpdGVycyA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICAgICAgY29uc3QgbG9jYWxzID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCB3cml0ZXJOYW1lIGluIHVybFdyaXRlcnMpIHtcbiAgICAgICAgICBsb2NhbHNbYCR7d3JpdGVyTmFtZX1VcmxXcml0ZXJgXSA9IHVybFdyaXRlcnNbd3JpdGVyTmFtZV07XG4gICAgICB9XG5cbiAgICAgICAgbGV0IHVybCA9IHNjb3BlLiRldmFsKGF0dHJzLnJvdXRlT25DbGljaywgXy5hc3NpZ24obG9jYWxzLCBzY29wZSkpO1xuXG4gICAgICAgIHJldHVybiBodG1sNVRoZVVybCh1cmwpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBodG1sNVRoZVVybCh1cmwpIHtcbiAgICAgICAgcmV0dXJuIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpID8gdXJsIDogYCMke3VybH1gO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Z2V0VXJsKCl9YFxuICAgICAgICB9LCAobmV3VXJsKSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5hdHRyKCdocmVmJywgbmV3VXJsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZU9uQ2xpY2snLCByb3V0ZU9uQ2xpY2tGYWN0b3J5KTtcblxuLy8gQFRPRE8gbm9uZSBvZiB0aGUgYW5pbWF0aW9uIGNvZGUgaW4gdGhpcyBkaXJlY3RpdmUgaGFzIGJlZW4gdGVzdGVkLiBOb3Qgc3VyZSBpZiBpdCBjYW4gYmUgYXQgdGhpcyBzdGFnZSBUaGlzIG5lZWRzIGZ1cnRoZXIgaW52ZXN0aWdhdGlvbi5cbi8vIEBUT0RPIHRoaXMgY29kZSBkb2VzIHRvbyBtdWNoLCBpdCBzaG91bGQgYmUgcmVmYWN0b3JlZC5cblxuZnVuY3Rpb24gcm91dGVWaWV3RmFjdG9yeSgkbG9nLCAkY29tcGlsZSwgJGNvbnRyb2xsZXIsIFZpZXdCaW5kaW5ncywgJHEsIFN0YXRlLCAkcm9vdFNjb3BlLCAkYW5pbWF0ZSwgJHRpbWVvdXQsICRpbmplY3RvciwgUGVuZGluZ1ZpZXdDb3VudGVyLCAkdGVtcGxhdGVSZXF1ZXN0LCBSb3V0ZSkge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IGZhbHNlLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGU6ICc8ZGl2PjwvZGl2PicsXG4gICAgbGluayAodmlld0RpcmVjdGl2ZVNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBsZXQgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgIGxldCB2aWV3U2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICBjb25zdCB2aWV3ID0gVmlld0JpbmRpbmdzLmdldFZpZXcoaUF0dHJzLm5hbWUpO1xuICAgICAgY29uc3QgYmluZGluZ3MgPSB2aWV3LmdldEJpbmRpbmdzKCk7XG5cbiAgICAgIGlFbGVtZW50LmFkZENsYXNzKCduZy1oaWRlJyk7XG5cbiAgICAgIGxldCBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nID0gYmluZGluZyA9PiBfLmNsb25lRGVlcChTdGF0ZS5nZXRTdWJzZXQoZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyhiaW5kaW5nKSkpO1xuXG4gICAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBmaWVsZCkge1xuICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgZmllbGQgPSAnY29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzb3VyY2UgPSBiaW5kaW5nW2ZpZWxkXSA/ICRpbmplY3Rvci5nZXQoYCR7YmluZGluZ1tmaWVsZF19RGlyZWN0aXZlYClbMF0gOiBiaW5kaW5nO1xuICAgICAgICByZXR1cm4gXy5kZWZhdWx0cyhfLnBpY2soc291cmNlLCBbJ2NvbnRyb2xsZXInLCAndGVtcGxhdGVVcmwnLCAnY29udHJvbGxlckFzJ10pLCB7Y29udHJvbGxlckFzOiAnJGN0cmwnfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW107XG5cbiAgICAgICAgZm9yIChsZXQgcmVxdWlyZW1lbnQgb2YgQXJyYXkuZnJvbShyZXF1aXJlZFN0YXRlKSkge1xuICAgICAgICAgIGxldCBuZWdhdGVSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoJyEnID09PSByZXF1aXJlbWVudC5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIHJlcXVpcmVtZW50ID0gcmVxdWlyZW1lbnQuc2xpY2UoMSk7XG4gICAgICAgICAgICBuZWdhdGVSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBlbGVtZW50ID0gU3RhdGUuZ2V0KHJlcXVpcmVtZW50KTtcblxuICAgICAgICAgIC8vIFJldHVybiBmYWxzZSBpZiBlbGVtZW50IGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGlmICgoZWxlbWVudCA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPbmx5IGNoZWNrIHZhbHVlIG9mIGVsZW1lbnQgaWYgaXQgaXMgZGVmaW5lZFxuICAgICAgICAgIGlmIChuZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSAhZWxlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpbmRpbmcuY2FuQWN0aXZhdGUpIHtcbiAgICAgICAgICBpZiAoISRpbmplY3Rvci5pbnZva2UoYmluZGluZy5jYW5BY3RpdmF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWFuYWdlVmlldyhlbGVtZW50LCBiaW5kaW5ncykge1xuICAgICAgICBjb25zdCBtYXRjaGluZ0JpbmRpbmcgPSBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpO1xuXG4gICAgICAgIGlmICghbWF0Y2hpbmdCaW5kaW5nKSB7XG4gICAgICAgICAgaWYgKHZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5hZGRDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gZGVzdHJveVZpZXcoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIFJvdXRlLmRlbGV0ZUN1cnJlbnRCaW5kaW5nKHZpZXcubmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nKG1hdGNoaW5nQmluZGluZyk7XG4gICAgICAgIGlmICgobWF0Y2hpbmdCaW5kaW5nID09PSBwcmV2aW91c0JpbmRpbmcpICYmIGFuZ3VsYXIuZXF1YWxzKHByZXZpb3VzQm91bmRTdGF0ZSwgbmV3U3RhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gbWF0Y2hpbmdCaW5kaW5nO1xuICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgICAgICBQZW5kaW5nVmlld0NvdW50ZXIuaW5jcmVhc2UoKTtcblxuICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZykudGhlbihmdW5jdGlvbiAoaGFzUmVzb2x2aW5nVGVtcGxhdGUpIHtcbiAgICAgICAgICAvLyBAVE9ETzogTWFnaWMgbnVtYmVyXG4gICAgICAgICAgY29uc3QgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24gPSBoYXNSZXNvbHZpbmdUZW1wbGF0ZSA/IDMwMCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmICghdmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkYW5pbWF0ZS5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykge1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShiaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gYmluZGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZXN0cm95VmlldyhlbGVtZW50KSB7XG4gICAgICAgIGlmICh2aWV3Q3JlYXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgZWxlbWVudC5jaGlsZHJlbigpLmVxKDApLnJlbW92ZSgpO1xuICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY3JlYXRlVmlldyhlbGVtZW50LCBiaW5kaW5nLCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgY29uc3QgdGltZVN0YXJ0ZWRNYWluVmlldyA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcpO1xuXG4gICAgICAgIGNvbnN0IG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24gPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgIGlmIChnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpICE9PSBiaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmlld0NyZWF0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgY29uc3QgcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPSBEYXRlLm5vdygpIC0gdGltZVN0YXJ0ZWRNYWluVmlldztcblxuICAgICAgICAgIGNvbnN0IGluamVjdE1haW5UZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGdpdmUgdGhlIHZpZXcgdGltZSB0byBwcm9wZXJseSBpbml0aWFsaXNlXG4gICAgICAgICAgICAgIC8vIGJlZm9yZSBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIHRoZSBpbnRpYWxWaWV3c0xvYWRlZCBldmVudFxuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSA9IE1hdGgubWF4KDAsIG1pbmltdW1EZWxheSAtIHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA8IG1pbmltdW1EZWxheSkge1xuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+IGluamVjdE1haW5UZW1wbGF0ZSgpXG4gICAgICAgICAgICAgICwgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0TWFpblRlbXBsYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUmVzb2x1dGlvbkZhaWx1cmUgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJGxvZy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgUm91dGUuc2V0Q3VycmVudEJpbmRpbmcodmlldy5uYW1lLCBiaW5kaW5nKVxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt0ZW1wbGF0ZTogJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLCBkZXBlbmRlbmNpZXM6IHJlc29sdmUoYmluZGluZyl9O1xuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24sIG9uUmVzb2x1dGlvbkZhaWx1cmUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwgfHwgIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIHJldHVybiAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpKCRyb290U2NvcGUuJG5ldygpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JDb21wb25lbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAncmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgbGV0IHJldHVyblZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKGJpbmRpbmcuZXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5lcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ2Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgdGVtcGxhdGVGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG4gICAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgICAgYmluZGluZ0NvbXBvbmVudEZpZWxkID0gJ2Vycm9yQ29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWJpbmRpbmdbYmluZGluZ0NvbXBvbmVudEZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpO1xuICAgICAgICBjb25zdCBhcmdzID0ge2RlcGVuZGVuY2llczoge2Vycm9yfX07XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGFyZ3MudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKSB7XG4gICAgICAgIGNvbnN0IHtkZXBlbmRlbmNpZXN9ID0gYXJncztcbiAgICAgICAgY29uc3Qge3RlbXBsYXRlfSA9IGFyZ3M7XG5cbiAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0gXy5tZXJnZShkZXBlbmRlbmNpZXMsIHskc2NvcGU6IHZpZXdTY29wZSwgJGVsZW1lbnQ6IGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKX0pO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2Fscy4kc2NvcGVbY29tcG9uZW50LmNvbnRyb2xsZXJBc10gPSAkY29udHJvbGxlcihjb21wb25lbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShlcnJvcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3I7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9ICdGYWlsZWQgdG8gc2VyaWFsaXplIGVycm9yIG9iamVjdCBmb3IgbG9nZ2luZyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRsb2cuZXJyb3IoYEZhaWxlZCBpbnN0YW50aWF0aW5nIGNvbnRyb2xsZXIgZm9yIHZpZXcgJHt2aWV3fTogJHtlcnJvck1lc3NhZ2V9YCk7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlID0gZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHt9KTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCBkZXBlbmRlbmN5TmFtZSBpbiBiaW5kaW5nLnJlc29sdmUpIHtcbiAgICAgICAgICBjb25zdCBkZXBlbmRlbmN5RmFjdG9yeSA9IGJpbmRpbmcucmVzb2x2ZVtkZXBlbmRlbmN5TmFtZV07XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRpbmplY3Rvci5pbnZva2UoZGVwZW5kZW5jeUZhY3RvcnkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHByb21pc2VzW2RlcGVuZGVuY3lOYW1lXSA9ICRxLnJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcgPSBiaW5kaW5nID0+IF8udW5pb24oYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdLCBiaW5kaW5nLndhdGNoZWRTdGF0ZSB8fCBbXSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0cmlwTmVnYXRpb25QcmVmaXgoc3RyKSB7XG4gICAgICAgIGlmIChzdHIuY2hhckF0KDApID09PSAnIScpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnN1YnN0cigxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRmllbGRzRnJvbVZpZXcgPSB2aWV3ID0+IF8uZmxhdHRlbihfLm1hcCh2aWV3LmdldEJpbmRpbmdzKCksIGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcpKTtcblxuICAgICAgY29uc3QgZ2V0RmllbGRzVG9XYXRjaCA9IHZpZXcgPT4gXy51bmlxKF8ubWFwKGdldFN0YXRlRmllbGRzRnJvbVZpZXcodmlldyksIHN0cmlwTmVnYXRpb25QcmVmaXgpKTtcblxuICAgICAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzVG9XYXRjaCh2aWV3KTtcblxuICAgICAgcmV0dXJuIFJvdXRlLndoZW5SZWFkeSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRyeSB0byBzdGFydCB0aGUgYmFsbCByb2xsaW5nIGluIGNhc2UgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgYW5kIHdlIGNhbiBjcmVhdGUgdGhlIHZpZXcgaW1tZWRpYXRlbHlcbiAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcblxuICAgICAgICAvLyBEb24ndCBib3RoZXIgcHV0dGluZyBpbiBhIHdhdGNoZXIgaWYgdGhlcmUncyBubyBkZXBlbmRlbmNpZXMgdGhhdCB3aWxsIGV2ZXIgdHJpZ2dlciBhIGNoYW5nZSBldmVudFxuICAgICAgICBpZiAoZmllbGRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXRlV2F0Y2hlciA9IGZ1bmN0aW9uIChjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgaWYgKHZpZXdNYW5hZ2VtZW50UGVuZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZmluaXNoIHRoZSBkaWdlc3QgY3ljbGUgYmVmb3JlIGJ1aWxkaW5nIHRoZSB2aWV3LCB3aGljaCBzaG91bGRcbiAgICAgICAgICAvLyBwcmV2ZW50IHVzIGZyb20gcmUtcmVuZGVyaW5nIGEgdmlldyBtdWx0aXBsZSB0aW1lcyBpZiBtdWx0aXBsZSBwcm9wZXJ0aWVzIG9mIHRoZSBzYW1lIHN0YXRlIGRlcGVuZGVuY3lcbiAgICAgICAgICAvLyBnZXQgY2hhbmdlZCB3aXRoIHJlcGVhdGVkIFN0YXRlLnNldCBjYWxsc1xuICAgICAgICAgIHJldHVybiAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgICAgICByZXR1cm4gdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgU3RhdGUud2F0Y2goZmllbGRzLCBzdGF0ZVdhdGNoZXIpO1xuXG4gICAgICAgIHZpZXdEaXJlY3RpdmVTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4gU3RhdGUucmVtb3ZlV2F0Y2hlcihzdGF0ZVdhdGNoZXIpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgndmlldycsIHJvdXRlVmlld0ZhY3RvcnkpO1xuXG5jbGFzcyBQZW5kaW5nVmlld0NvdW50ZXIge1xuICBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy4kcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50O1xuICB9XG5cbiAgaW5jcmVhc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQgKz0gMTtcbiAgfVxuXG4gIGRlY3JlYXNlKCkge1xuICAgIHRoaXMuY291bnQgPSBNYXRoLm1heCgwLCB0aGlzLmNvdW50IC0gMSk7XG4gICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgIGlmICghdGhpcy5pbml0aWFsVmlld3NMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5pbml0aWFsVmlld3NMb2FkZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmN1cnJlbnRWaWV3c0xvYWRlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnUGVuZGluZ1ZpZXdDb3VudGVyJywgKCRyb290U2NvcGUpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBQZW5kaW5nVmlld0NvdW50ZXIoJHJvb3RTY29wZSk7XG59KTtcblxuY2xhc3MgV2F0Y2hhYmxlTGlzdCB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnksIGxpc3QpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG5cbiAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgIHRoaXMud2F0Y2hlcnMgPSBbXTtcbiAgfVxuXG4gIGdldChwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHBhdGgpO1xuICB9XG5cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLmxpc3Q7XG4gIH1cblxuICBnZXRTdWJzZXQocGF0aHMpIHtcbiAgICByZXR1cm4gXy56aXBPYmplY3QocGF0aHMsIF8ubWFwKHBhdGhzLCB0aGlzLmdldC5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBzZXQocGF0aCwgdmFsdWUpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlci5zZXQodGhpcy5saXN0LCBwYXRoLCB2YWx1ZSk7XG4gICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgdW5zZXQocGF0aHMpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMuT2JqZWN0SGVscGVyLnVuc2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gICAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgd2F0Y2gocGF0aHMsIGhhbmRsZXIpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMud2F0Y2hlcnMucHVzaCh0aGlzLldhdGNoZXJGYWN0b3J5LmNyZWF0ZShwYXRoLCBoYW5kbGVyLCB0aGlzLmdldChwYXRoKSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlV2F0Y2hlcih3YXRjaGVyKSB7XG4gICAgaWYgKHRoaXMud2F0Y2hlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld1dhdGNoZXJzID0gW107XG5cbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgdGhpc1dhdGNoZXIgPT4ge1xuICAgICAgaWYgKHRoaXNXYXRjaGVyLmhhbmRsZXIgIT09IHdhdGNoZXIpIHtcbiAgICAgICAgbmV3V2F0Y2hlcnMucHVzaCh0aGlzV2F0Y2hlcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy53YXRjaGVycyA9IG5ld1dhdGNoZXJzO1xuICB9XG5cbiAgX25vdGlmeVdhdGNoZXJzKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB3YXRjaGVyID0+IHtcbiAgICAgIGlmICh3YXRjaGVyLnNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCA9IHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHdhdGNoZXIud2F0Y2hQYXRoKTtcbiAgICAgICAgd2F0Y2hlci5ub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hhYmxlTGlzdEZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuICB9XG5cbiAgY3JlYXRlKGxpc3QgPSB7fSkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdCh0aGlzLk9iamVjdEhlbHBlciwgdGhpcy5XYXRjaGVyRmFjdG9yeSwgbGlzdCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGFibGVMaXN0RmFjdG9yeScsIChPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdEZhY3RvcnkoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSk7XG59KTtcblxuY2xhc3MgV2F0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy53YXRjaFBhdGggPSB3YXRjaFBhdGg7XG4gICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKGluaXRpYWxWYWx1ZSk7XG4gIH1cblxuICBfdG9rZW5pemVQYXRoKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLicpO1xuICB9XG5cbiAgc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIC8vIE5CIHNob3J0IGNpcmN1aXQgbG9naWMgaW4gdGhlIHNpbXBsZSBjYXNlXG4gICAgaWYgKHRoaXMud2F0Y2hQYXRoID09PSBjaGFuZ2VkUGF0aCkge1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh0aGlzLmN1cnJlbnRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0IHdhdGNoID0ge1xuICAgICAgcGF0aDogdGhpcy53YXRjaFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aCh0aGlzLndhdGNoUGF0aCksXG4gICAgICB2YWx1ZTogdGhpcy5jdXJyZW50VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgY2hhbmdlID0ge1xuICAgICAgcGF0aDogY2hhbmdlZFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aChjaGFuZ2VkUGF0aCksXG4gICAgICB2YWx1ZTogbmV3VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgbWluaW11bUxlbnRoID0gTWF0aC5taW4oY2hhbmdlLnRva2Vucy5sZW5ndGgsIHdhdGNoLnRva2Vucy5sZW5ndGgpO1xuICAgIGZvciAobGV0IHRva2VuSW5kZXggPSAwOyB0b2tlbkluZGV4IDwgbWluaW11bUxlbnRoOyB0b2tlbkluZGV4KyspIHtcbiAgICAgIGlmICh3YXRjaC50b2tlbnNbdG9rZW5JbmRleF0gIT09IGNoYW5nZS50b2tlbnNbdG9rZW5JbmRleF0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5CIGlmIHdlIGdldCBoZXJlIHRoZW4gYWxsIGNvbW1vbiB0b2tlbnMgbWF0Y2hcblxuICAgIGNvbnN0IGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQgPSBjaGFuZ2UudG9rZW5zLmxlbmd0aCA+IHdhdGNoLnRva2Vucy5sZW5ndGg7XG5cbiAgICBpZiAoY2hhbmdlUGF0aElzRGVzY2VuZGFudCkge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gY2hhbmdlLnRva2Vucy5zbGljZSh3YXRjaC50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoID0gXy5nZXQod2F0Y2gudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGgsIGNoYW5nZS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHdhdGNoLnRva2Vucy5zbGljZShjaGFuZ2UudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoUGF0aCA9IF8uZ2V0KGNoYW5nZS52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMod2F0Y2gudmFsdWUsIG5ld1ZhbHVlQXRXYXRjaFBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICB0aGlzLmhhbmRsZXIoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCB0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChuZXdWYWx1ZSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hlckZhY3Rvcnkge1xuICBjcmVhdGUod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoZXIod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hlckZhY3RvcnknLCAoKSA9PiB7XG4gIHJldHVybiBuZXcgV2F0Y2hlckZhY3RvcnkoKTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdSb3V0ZScsIGZ1bmN0aW9uKE9iamVjdEhlbHBlcikge1xuICBcIm5nSW5qZWN0XCI7XG4gIGNvbnN0IHRva2VucyA9IHt9O1xuICBjb25zdCB1cmxXcml0ZXJzID0gW107XG4gIGNvbnN0IHVybHMgPSBbXTtcbiAgY29uc3QgcGVyc2lzdGVudFN0YXRlcyA9IFtdO1xuICBjb25zdCByZWFkeSA9IGZhbHNlO1xuICBjb25zdCB0eXBlcyA9IHt9O1xuICBsZXQgaHRtbDVNb2RlID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvdmlkZXIgPSB7XG5cbiAgICByZWdpc3RlclR5cGUobmFtZSwgY29uZmlnKSB7XG4gICAgICB0eXBlc1tuYW1lXSA9IGNvbmZpZztcbiAgICAgIHR5cGVzW25hbWVdLnJlZ2V4ID0gbmV3IFJlZ0V4cCh0eXBlc1tuYW1lXS5yZWdleC5zb3VyY2UsICdpJyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJUeXBlIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFRva2VuKG5hbWUsIGNvbmZpZykge1xuICAgICAgdG9rZW5zW25hbWVdID0gXy5leHRlbmQoe25hbWV9LCBjb25maWcpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsVG9rZW4gfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsV3JpdGVyKG5hbWUsIGZuKSB7XG4gICAgICB1cmxXcml0ZXJzW25hbWVdID0gZm47XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxXcml0ZXIgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsKHBhdHRlcm4sIGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25zdCB1cmxEYXRhID0ge1xuICAgICAgICBjb21waWxlZFVybDogdGhpcy5fY29tcGlsZVVybFBhdHRlcm4ocGF0dGVybiwgY29uZmlnKSxcbiAgICAgICAgcGF0dGVyblxuICAgICAgfTtcblxuICAgICAgdXJscy5wdXNoKF8uZXh0ZW5kKHVybERhdGEsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBzZXRQZXJzaXN0ZW50U3RhdGVzKC4uLnN0YXRlTGlzdCkge1xuICAgICAgXy5mb3JFYWNoKHN0YXRlTGlzdCwgKHN0YXRlKSA9PiB7XG4gICAgICAgIGlmICghcGVyc2lzdGVudFN0YXRlcy5pbmNsdWRlcyhzdGF0ZSkpIHtcbiAgICAgICAgICBwZXJzaXN0ZW50U3RhdGVzLnB1c2goc3RhdGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0SHRtbDVNb2RlKG1vZGUpIHtcbiAgICAgIGh0bWw1TW9kZSA9IG1vZGU7XG4gICAgfSxcblxuICAgIF9jb21waWxlVXJsUGF0dGVybih1cmxQYXR0ZXJuLCBjb25maWcpIHtcbiAgICAgIGxldCBtYXRjaDtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHVybFBhdHRlcm4pO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2Vuc3VyZU9wdGlvbmFsVHJhaWxpbmdTbGFzaCh1cmxQYXR0ZXJuKTtcblxuICAgICAgY29uc3QgdG9rZW5SZWdleCA9IC9cXHsoW0EtWmEtelxcLl8wLTldKylcXH0vZztcbiAgICAgIGxldCB1cmxSZWdleCA9IHVybFBhdHRlcm47XG5cbiAgICAgIGlmICghY29uZmlnLnBhcnRpYWxNYXRjaCkge1xuICAgICAgICB1cmxSZWdleCA9IGBeJHt1cmxSZWdleH0kYDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG9rZW5MaXN0ID0gW107XG5cbiAgICAgIHdoaWxlICgobWF0Y2ggPSB0b2tlblJlZ2V4LmV4ZWModXJsUGF0dGVybikpICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW21hdGNoWzFdXTtcbiAgICAgICAgdG9rZW5MaXN0LnB1c2godG9rZW4pO1xuICAgICAgICB1cmxSZWdleCA9IHVybFJlZ2V4LnJlcGxhY2UobWF0Y2hbMF0sIGAoJHt0eXBlc1t0b2tlbi50eXBlXS5yZWdleC5zb3VyY2V9KWApO1xuICAgICAgfVxuXG4gICAgICB1cmxSZWdleC5yZXBsYWNlKCcuJywgJ1xcXFwuJyk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKHVybFJlZ2V4LCAnaScpLFxuICAgICAgICB0b2tlbnM6IHRva2VuTGlzdFxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2Vuc3VyZU9wdGlvbmFsVHJhaWxpbmdTbGFzaChzdHIpIHtcbiAgICAgIGlmIChzdHIubWF0Y2goL1xcLyQvKSkge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcLyQvLCAnLz8nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgJHtzdHJ9Lz9gO1xuICAgIH0sXG5cbiAgICBfZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyhzdHIpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xcKFxcKVxcKlxcK1xcP1xcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCRsb2NhdGlvbiwgJGluamVjdG9yLCAkcSkge1xuICAgICAgJ25nSW5qZWN0JztcblxuICAgICAgLy8gV2hlbiBnZXR0aW5nIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlIChvbmx5IGRvbmUgb25jZSksIHdlIG5lZWQgdG8gaXRlcmF0ZSBvdmVyIHRoZSB1cmxXcml0ZXJzIGFuZCB0dXJuXG4gICAgICAvLyB0aGVtIGludG8gbWV0aG9kcyB0aGF0IGludm9rZSB0aGUgUkVBTCB1cmxXcml0ZXIsIGJ1dCBwcm92aWRpbmcgZGVwZW5kZW5jeSBpbmplY3Rpb24gdG8gaXQsIHdoaWxlIGFsc29cbiAgICAgIC8vIGdpdmluZyBpdCB0aGUgZGF0YSB0aGF0IHRoZSBjYWxsZWUgcGFzc2VzIGluLlxuXG4gICAgICAvLyBUaGUgcmVhc29uIHdlIGhhdmUgdG8gZG8gdGhpcyBoZXJlIGlzIGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhlICRpbmplY3RvciBiYWNrIGluIHRoZSByb3V0ZVByb3ZpZGVyLlxuXG4gICAgICBfLmZvckluKHVybFdyaXRlcnMsICh3cml0ZXIsIHdyaXRlck5hbWUpID0+XG4gICAgICAgIHVybFdyaXRlcnNbd3JpdGVyTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgaWYgKCFkYXRhKSB7IGRhdGEgPSB7fTsgfVxuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IHtVcmxEYXRhOiBkYXRhfTtcbiAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmludm9rZSh3cml0ZXIsIHt9LCBsb2NhbHMpO1xuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICBsZXQgZmxhc2hTdGF0ZXMgPSBbXTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IHtcbiAgICAgICAgY3VycmVudEJpbmRpbmdzOiB7fSxcbiAgICAgICAgcmVhZHlEZWZlcnJlZDogJHEuZGVmZXIoKSxcblxuICAgICAgICBtYXRjaCh1cmxUb01hdGNoKSB7XG4gICAgICAgICAgZm9yIChjb25zdCB1cmwgb2YgQXJyYXkuZnJvbSh1cmxzKSkge1xuICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHVybC5jb21waWxlZFVybC5yZWdleC5leGVjKHVybFRvTWF0Y2gpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4ge3VybCwgcmVnZXhNYXRjaDogbWF0Y2h9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0RGF0YShtYXRjaCwgc2VhcmNoRGF0YSA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IGRlZmF1bHRzID0gdGhpcy5leHRyYWN0RGVmYXVsdERhdGEobWF0Y2gpO1xuICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmV4dHJhY3RQYXRoRGF0YShtYXRjaCk7XG4gICAgICAgICAgc2VhcmNoRGF0YSA9IHRoaXMuZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdEhlbHBlci5kZWZhdWx0KHNlYXJjaERhdGEsIHBhdGgsIGRlZmF1bHRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKSB7XG4gICAgICAgICAgaWYgKCFzZWFyY2hEYXRhKSB7IHNlYXJjaERhdGEgPSAkbG9jYXRpb24uc2VhcmNoKCk7IH1cbiAgICAgICAgICBjb25zdCBkYXRhID0gXy5jbG9uZShzZWFyY2hEYXRhKTtcbiAgICAgICAgICBjb25zdCBuZXdEYXRhID0ge307XG5cbiAgICAgICAgICBfLmZvckVhY2goZGF0YSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRLZXkgPSBfLmZpbmRLZXkodG9rZW5zLCB7IHNlYXJjaEFsaWFzOiBrZXkgfSk7XG4gICAgICAgICAgICBpZiAoIXRhcmdldEtleSkgeyB0YXJnZXRLZXkgPSBrZXk7IH1cblxuICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlTmFtZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gXy5nZXQodG9rZW5zW3RhcmdldEtleV0sICd0eXBlJykgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoIXRva2Vuc1t0YXJnZXRLZXldIHx8ICh0eXBlc1t0b2tlblR5cGVOYW1lXS5yZWdleC50ZXN0KHZhbHVlKSkpIHtcblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblR5cGUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnR5cGUgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHR5cGVUb2tlblR5cGUgPSB0b2tlblR5cGUgPyB0eXBlc1t0b2tlblR5cGVdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0b2tlblR5cGVQYXJzZWQgPSB0eXBlVG9rZW5UeXBlID8gdHlwZVRva2VuVHlwZS5wYXJzZXIgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgaWYgKHRva2VuVHlwZVBhcnNlZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0b2tlblR5cGVQYXJzZWQsIG51bGwsIHt0b2tlbjogdmFsdWV9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS5zdGF0ZVBhdGggOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IGRhdGFLZXkgPSB0b2tlblRhcmdldEtleVN0YXRlUGF0aCB8fCB0YXJnZXRLZXk7XG5cbiAgICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChuZXdEYXRhLCBkYXRhS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0RGVmYXVsdERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICAgICAgICBfLmZvckVhY2gobWF0Y2gudXJsLnN0YXRlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCBrZXksICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnID8gXy5jbG9uZURlZXAodmFsdWUpIDogdmFsdWUpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RQYXRoRGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgICBjb25zdCBwYXRoVG9rZW5zID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2VucztcblxuICAgICAgICAgIGlmIChwYXRoVG9rZW5zLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4ge307IH1cblxuICAgICAgICAgIGZvciAobGV0IG4gPSAwLCBlbmQgPSBwYXRoVG9rZW5zLmxlbmd0aC0xLCBhc2MgPSAwIDw9IGVuZDsgYXNjID8gbiA8PSBlbmQgOiBuID49IGVuZDsgYXNjID8gbisrIDogbi0tKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnNbbl07XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBtYXRjaC5yZWdleE1hdGNoW24rMV07XG5cbiAgICAgICAgICAgIGlmICh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIpIHsgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlciwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pOyB9XG5cbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwgKHRva2VuLnN0YXRlUGF0aCB8fCB0b2tlbi5uYW1lKSwgdmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcnMoKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVyKG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbnZva2VVcmxXcml0ZXIobmFtZSwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV0oZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ28obmFtZSwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgcmV0dXJuICRsb2NhdGlvbi51cmwodGhpcy5pbnZva2VVcmxXcml0ZXIobmFtZSwgZGF0YSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFBlcnNpc3RlbnRTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIHBlcnNpc3RlbnRTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZEZsYXNoU3RhdGVzKC4uLm5ld1N0YXRlcykge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gZmxhc2hTdGF0ZXMuY29uY2F0KG5ld1N0YXRlcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIGZsYXNoU3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lLCBiaW5kaW5nKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdID0gYmluZGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDdXJyZW50QmluZGluZ3MoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJpbmRpbmdzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZSh2aWV3TmFtZSwgYmluZGluZ05hbWVFeHByZXNzaW9uKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudEJpbmRpbmcgPSB0aGlzLmdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKVxuXG4gICAgICAgICAgaWYgKCFjdXJyZW50QmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGJpbmRpbmdOYW1lRXhwcmVzc2lvbiBpbnN0YW5jZW9mIFJlZ0V4cCA/XG4gICAgICAgICAgICBiaW5kaW5nTmFtZUV4cHJlc3Npb24udGVzdChjdXJyZW50QmluZGluZy5uYW1lKSA6XG4gICAgICAgICAgICBjdXJyZW50QmluZGluZy5uYW1lID09PSBiaW5kaW5nTmFtZUV4cHJlc3Npb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UmVhZHkocmVhZHkpIHtcbiAgICAgICAgICBpZiAoIXJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNSZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNIdG1sNU1vZGVFbmFibGVkKCkge1xuICAgICAgICAgIHJldHVybiBodG1sNU1vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2hlblJlYWR5KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5RGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICB9O1xuXG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbnVtZXJpYycsIHtyZWdleDogL1xcZCsvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiBwYXJzZUludCh0b2tlbildfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYWxwaGEnLCB7cmVnZXg6IC9bYS16QS1aXSsvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYW55Jywge3JlZ2V4OiAvLisvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbGlzdCcsIHtyZWdleDogLy4rLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gdG9rZW4uc3BsaXQoJywnKV19KTtcblxuICByZXR1cm4gcHJvdmlkZXI7XG59KTtcblxuY2xhc3MgU3RhdGVQcm92aWRlciB7XG4gICRnZXQoV2F0Y2hhYmxlTGlzdEZhY3RvcnkpIHtcbiAgICAnbmdJbmplY3QnO1xuICAgIHJldHVybiBXYXRjaGFibGVMaXN0RmFjdG9yeS5jcmVhdGUoKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdTdGF0ZScsIG5ldyBTdGF0ZVByb3ZpZGVyKTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignVmlld0JpbmRpbmdzJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCB2aWV3cyA9IFtdO1xuXG4gIGNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJpbmRpbmdzKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgaWYgKCEodGhpcy5iaW5kaW5ncyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0gW3RoaXMuYmluZGluZ3NdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEJpbmRpbmdzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3M7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIGJpbmQobmFtZSwgY29uZmlnKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShiaW5kaW5ncywgY29tbW9uUmVxdWlyZWRTdGF0ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoYmluZGluZy5yZXF1aXJlZFN0YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBbYmluZGluZy5yZXF1aXJlZFN0YXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goYmluZGluZy5yZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlLmNvbmNhdChjb21tb25SZXF1aXJlZFN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXNvbHZlKGJpbmRpbmdzLCBjb21tb25SZXNvbHZlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoISgncmVzb2x2ZScgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVzb2x2ZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChfLmRlZmF1bHRzKGJpbmRpbmcucmVzb2x2ZSwgY29tbW9uUmVzb2x2ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJhc2ljQ29tbW9uRmllbGRzID0gW1xuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JUZW1wbGF0ZVVybCd9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCBjb21tb25GaWVsZCBvZiBBcnJheS5mcm9tKGJhc2ljQ29tbW9uRmllbGRzKSkge1xuICAgICAgICAgIGlmIChjb21tb25GaWVsZC5uYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgZGVmYXVsdEJpbmRpbmdGaWVsZChuZXdCaW5kaW5ncywgY29tbW9uRmllbGQub3ZlcnJpZGVGaWVsZCwgY29uZmlnW2NvbW1vbkZpZWxkLm5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlcXVpcmVkU3RhdGUnIGluIGNvbmZpZykge1xuICAgICAgICAgIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXF1aXJlZFN0YXRlJ10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXNvbHZlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb21tb25SZXNvbHZlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlc29sdmUnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdEJpbmRpbmdGaWVsZChiaW5kaW5ncywgZmllbGROYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgIGlmICghKGZpZWxkTmFtZSBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgaXRlbSA9IGJpbmRpbmdbZmllbGROYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
