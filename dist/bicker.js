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

      if (element.tagName === 'A' || element[0].tagName === 'A') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFpQixDQUFoQyxBQUFnQyxBQUFDLGNBQWpDLEFBQStDLHdGQUFJLFVBQUEsQUFBVSxPQUFWLEFBQWlCLE9BQWpCLEFBQXdCLFdBQXhCLEFBQW1DLFlBQW5DLEFBQStDLGNBQS9DLEFBQTZELG9CQUFvQixBQUNsSTtBQUVBOztNQUFJLFNBQUosQUFBYSxBQUNiO2FBQUEsQUFBVyxJQUFYLEFBQWUsd0JBQXdCLFlBQVksQUFDakQ7UUFBSSxNQUFKLEFBQUksQUFBTSxXQUFXLEFBQ25CO1lBQUEsQUFBTSxTQUFOLEFBQWUsQUFDaEI7QUFDRjtBQUpELEFBTUE7O2FBQUEsQUFBVyxJQUFYLEFBQWUsMEJBQTBCLFVBQUEsQUFBVSxHQUFWLEFBQWEsUUFBUSxBQUM1RDtBQUNBO1FBQUksWUFBSixBQUNBO1FBQUksV0FBSixBQUFlLFFBQVEsQUFDckI7QUFDRDtBQUVEOzthQUFBLEFBQVMsQUFFVDs7dUJBQUEsQUFBbUIsQUFDbkI7UUFBTSxRQUFRLE1BQUEsQUFBTSxNQUFNLFVBQTFCLEFBQWMsQUFBWSxBQUFVLEFBRXBDOztRQUFJLENBQUosQUFBSyxPQUFPLEFBQ1Y7YUFBQSxBQUFPLEFBQ1I7QUFGRCxXQUVPLEFBQ0w7YUFBTyxNQUFBLEFBQU0sWUFBYixBQUFPLEFBQWtCLEFBQzFCO0FBRUQ7O1FBQUksZ0JBQWdCLGFBQUEsQUFBYSxNQUFNLE1BQW5CLEFBQXlCLE1BQTdDLEFBQW9CLEFBQStCLEFBQ25EO29CQUFnQixFQUFBLEFBQUUsV0FBRixBQUFhLGVBQWUsTUFBQSxBQUFNLHNCQUFOLEFBQTRCLE9BQU8sTUFBL0UsQUFBZ0IsQUFBNEIsQUFBbUMsQUFBTSxBQUVyRjs7UUFBTSxZ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QUFJLEVBQUUsYUFBTixBQUFJLEFBQWUsVUFBVSxBQUMzQjtxQkFBTyxRQUFBLEFBQVEsYUFBZixBQUE0QixBQUM3QjtBQUNEO21CQUFBLEFBQU8sS0FBUCxBQUFZLEFBQ2I7QUFSNkQ7c0JBQUE7Z0NBQUE7NkJBQUE7a0JBQUE7Y0FBQTtvRUFBQTswQkFBQTtBQUFBO29CQUFBO3FDQUFBO29CQUFBO0FBQUE7QUFBQTtBQVM5RDs7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7VUFBSSxjQUFKLEFBQWtCLEFBQ2xCO1VBQUksY0FBSixBQUFrQixRQUFRLEFBQ3hCO3NCQUFjLE9BQWQsQUFBYyxBQUFPLEFBQ3RCO0FBRkQsYUFFTyxBQUNMO3NCQUFlLGtCQUFELEFBQW1CLFFBQW5CLEFBQTRCLFNBQVMsQ0FBbkQsQUFBbUQsQUFBQyxBQUNyRDtBQUVEOztVQUFJLEVBQUUsWUFBQSxBQUFZLFNBQWxCLEFBQUksQUFBdUIsSUFBSSxBQUM3QjtjQUFNLElBQUEsQUFBSSxnRUFBSixBQUFpRSxPQUF2RSxBQUNEO0FBRUQ7O3dCQUFBLEFBQWtCLEFBQ2xCO2FBQU8sTUFBQSxBQUFNLFFBQVEsSUFBQSxBQUFJLEtBQUosQUFBUyxNQUE5QixBQUFxQixBQUFlLEFBQ3JDO0FBMUVJLEFBNEVMO0FBNUVLLDBCQTRFRSxBQUNMOztBQUFPLGtDQUFBLEFBQ0csTUFBTSxBQUNaO2lCQUFPLE1BQVAsQUFBTyxBQUFNLEFBQ2Q7QUFISCxBQUFPLEFBS1I7QUFMUSxBQUNMO0FBOUVOLEFBQU8sQUFvRlI7QUFwRlEsQUFFTDtBQW5CSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJhbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicsIFsnbmdBbmltYXRlJ10pLnJ1bihmdW5jdGlvbiAoU3RhdGUsIFJvdXRlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE9iamVjdEhlbHBlciwgUGVuZGluZ1ZpZXdDb3VudGVyKSB7XG4gIFwibmdJbmplY3RcIjtcblxuICBsZXQgb2xkVXJsID0gdW5kZWZpbmVkO1xuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJvdXRlLmlzUmVhZHkoKSkge1xuICAgICAgUm91dGUuc2V0UmVhZHkoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZSwgbmV3VXJsKSB7XG4gICAgLy8gV29yay1hcm91bmQgZm9yIEFuZ3VsYXJKUyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2lzc3Vlcy84MzY4XG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKG5ld1VybCA9PT0gb2xkVXJsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2xkVXJsID0gbmV3VXJsO1xuXG4gICAgUGVuZGluZ1ZpZXdDb3VudGVyLnJlc2V0KCk7XG4gICAgY29uc3QgbWF0Y2ggPSBSb3V0ZS5tYXRjaCgkbG9jYXRpb24ucGF0aCgpKTtcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IFJvdXRlLmV4dHJhY3REYXRhKG1hdGNoKTtcbiAgICB9XG5cbiAgICBsZXQgZmllbGRzVG9VbnNldCA9IE9iamVjdEhlbHBlci5ub3RJbihTdGF0ZS5saXN0LCBkYXRhKTtcbiAgICBmaWVsZHNUb1Vuc2V0ID0gXy5kaWZmZXJlbmNlKGZpZWxkc1RvVW5zZXQsIFJvdXRlLmdldFBlcnNpc3RlbnRTdGF0ZXMoKS5jb25jYXQoUm91dGUuZ2V0Rmxhc2hTdGF0ZXMoKSkpO1xuXG4gICAgY29uc3QgZXZlbnREYXRhID0ge3Vuc2V0dGluZzogZmllbGRzVG9VbnNldCwgc2V0dGluZzogZGF0YX07XG5cbiAgICAkcm9vdFNjb3BlLiRlbWl0KCdiaWNrZXJfcm91dGVyLmJlZm9yZVN0YXRlQ2hhbmdlJywgZXZlbnREYXRhKTtcblxuICAgIGlmICgoZXZlbnREYXRhLnVuc2V0dGluZykubGVuZ3RoICE9PSAwKSB7XG4gICAgICBTdGF0ZS51bnNldChldmVudERhdGEudW5zZXR0aW5nKTtcbiAgICB9XG5cbiAgICBfLmZvckVhY2goZXZlbnREYXRhLnNldHRpbmcsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBTdGF0ZS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBSb3V0ZS5yZXNldEZsYXNoU3RhdGVzKCk7XG4gICAgUm91dGUuc2V0UmVhZHkodHJ1ZSk7XG4gIH0pO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ09iamVjdEhlbHBlcicsIHtcbiAgZ2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV07XG4gIH0sXG5cbiAgc2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBpZiAocGFyZW50W3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFyZW50W3NlZ21lbnRdID0ge307XG4gICAgICB9XG5cbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyZW50W2tleV0gPSB2YWx1ZTtcbiAgfSxcblxuICB1bnNldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG5cbiAgICBpZiAocGFyZW50W2tleV0gPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBkZWxldGUgcGFyZW50W2tleV07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgLy8gUmVjdXJzaXZlbHkgcmV0dXJuIHRoZSBwcm9wZXJ0aWVzIGluIGEgdGhhdCBhcmVuJ3QgaW4gYlxuICBub3RJbihhLCBiLCBwcmVmaXggPSAnJykge1xuICAgIGxldCBub3RJbiA9IFtdO1xuICAgIHByZWZpeCA9IHByZWZpeC5sZW5ndGggPiAwID8gYCR7cHJlZml4fS5gIDogJyc7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKE9iamVjdC5rZXlzKGEpKSkge1xuICAgICAgY29uc3QgdGhpc1BhdGggPSBgJHtwcmVmaXh9JHtrZXl9YDtcblxuICAgICAgaWYgKGJba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5vdEluLnB1c2godGhpc1BhdGgpO1xuXG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgYVtrZXldID09PSAnb2JqZWN0JykgJiYgKCEoYVtrZXldIGluc3RhbmNlb2YgQXJyYXkpKSkge1xuICAgICAgICBub3RJbiA9IG5vdEluLmNvbmNhdCh0aGlzLm5vdEluKGFba2V5XSwgYltrZXldLCB0aGlzUGF0aCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub3RJbjtcbiAgfSxcblxuICBkZWZhdWx0KG92ZXJyaWRlcywgLi4uZGVmYXVsdFNldHMpIHtcbiAgICBsZXQgZGVmYXVsdFNldCwgdmFsdWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICBpZiAoZGVmYXVsdFNldHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBkZWZhdWx0U2V0ID0gZGVmYXVsdFNldHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmF1bHRTZXQgPSB0aGlzLmRlZmF1bHQoLi4uQXJyYXkuZnJvbShkZWZhdWx0U2V0cyB8fCBbXSkpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRTZXQpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFNldFtrZXldO1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiBvdmVycmlkZXNba2V5XSA9PT0gXCJvYmplY3RcIikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLmRlZmF1bHQob3ZlcnJpZGVzW2tleV0sIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3ZlcnJpZGVzKSB7XG4gICAgICB2YWx1ZSA9IG92ZXJyaWRlc1trZXldO1xuICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSB8fCB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcblxuXG4vLyBVc2FnZTpcbi8vXG4vLyBJZiB5b3Ugd2FudCB0byBhZGQgdGhlIGNsYXNzIFwiYWN0aXZlXCIgdG8gYW4gYW5jaG9yIGVsZW1lbnQgd2hlbiB0aGUgXCJtYWluXCIgdmlldyBoYXMgYSBiaW5kaW5nXG4vLyB3aXRoIHRoZSBuYW1lIFwibXlCaW5kaW5nXCIgcmVuZGVyZWQgd2l0aGluIGl0XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCJ7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAnbXlCaW5kaW5nJyB9XCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuLy8gWW91IGNhbiBhbHNvIHVzZSByZWd1bGFyIGV4cHJlc3Npb25zIGZvciB0aGUgYmluZGluZyBuYW1lLCBidXQgdG8gZG8gc28geW91IGhhdmUgdG8gcHJvdmlkZSBhIG1ldGhvZFxuLy8gb24geW91ciBjb250cm9sbGVyIHdoaWNoIHJldHVybnMgdGhlIHJvdXRlIGNsYXNzIGRlZmluaXRpb24gb2JqZWN0LCBiZWNhdXNlIEFuZ3VsYXJKUyBleHByZXNzaW9uc1xuLy8gZG9uJ3Qgc3VwcG9ydCBpbmxpbmUgcmVndWxhciBleHByZXNzaW9uc1xuLy9cbi8vIGNsYXNzIE15Q29udHJvbGxlciB7XG4vLyAgZ2V0Um91dGVDbGFzc09iamVjdCgpIHtcbi8vICAgIHJldHVybiB7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAvbXlCaW5kLyB9XG4vLyAgfVxuLy8gfVxuLy9cbi8vIDxhIHJvdXRlLWNsYXNzPVwiJGN0cmwuZ2V0Um91dGVDbGFzc09iamVjdCgpXCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuXG5mdW5jdGlvbiByb3V0ZUNsYXNzRmFjdG9yeShSb3V0ZSkge1xuICAnbmdJbmplY3QnXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBsaW5rIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgc2NvcGUuJHdhdGNoKCgpID0+IHtcbiAgICAgICAgY29uc3Qgcm91dGVDbGFzc0RlZmluaXRpb24gPSBzY29wZS4kZXZhbChpQXR0cnNbJ3JvdXRlQ2xhc3MnXSlcblxuICAgICAgICBpZiAoIVJvdXRlLm1hdGNoZXNDdXJyZW50QmluZGluZ05hbWUocm91dGVDbGFzc0RlZmluaXRpb24udmlld05hbWUsIHJvdXRlQ2xhc3NEZWZpbml0aW9uLmJpbmRpbmdOYW1lKSkge1xuICAgICAgICAgIGlmIChpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5yZW1vdmVDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghaUVsZW1lbnQuaGFzQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgaUVsZW1lbnQuYWRkQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlQ2xhc3MnLCByb3V0ZUNsYXNzRmFjdG9yeSk7XG5cbmZ1bmN0aW9uIHJvdXRlSHJlZkZhY3RvcnkgKFJvdXRlLCAkbG9jYXRpb24sICR0aW1lb3V0KSB7XG4gICduZ0luamVjdCdcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgc2NvcGU6IHRydWUsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGlmIChpQXR0cnMuaWdub3JlSHJlZiA9PT0gdW5kZWZpbmVkICYmIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgIGlFbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHVybFBhdGggPSBpRWxlbWVudC5hdHRyKCdocmVmJykucmVwbGFjZSgvXiMvLCAnJyk7XG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmxQYXRoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvYmplY3QgPSBSb3V0ZS5nZXRVcmxXcml0ZXJzKCk7XG4gICAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IHdyaXRlciA9IG9iamVjdFt3cml0ZXJOYW1lXTtcbiAgICAgICAgc2NvcGVbYCR7d3JpdGVyTmFtZX1VcmxXcml0ZXJgXSA9IHdyaXRlcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNjb3BlLiR3YXRjaChpQXR0cnMucm91dGVIcmVmLCAobmV3VXJsKSA9PiB7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmIChSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgIHVybCA9IG5ld1VybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmwgPSBgIyR7bmV3VXJsfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlFbGVtZW50LmF0dHIoJ2hyZWYnLCB1cmwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZUhyZWYnLCByb3V0ZUhyZWZGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVPbkNsaWNrRmFjdG9yeSAoUm91dGUsICRsb2NhdGlvbiwgJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0J1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcblxuICAgIGxpbmsgKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgY29uc3QgTEVGVF9CVVRUT04gPSAwO1xuICAgICAgY29uc3QgTUlERExFX0JVVFRPTiA9IDE7XG5cbiAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09ICdBJyB8fCBlbGVtZW50WzBdLnRhZ05hbWUgPT09ICdBJykge1xuICAgICAgICBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT09IExFRlRfQlVUVE9OKSB7XG4gICAgICAgICAgICBuYXZpZ2F0ZVRvVXJsKGdldFVybCgpLCBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50Lm1vdXNldXAoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gTUlERExFX0JVVFRPTikge1xuICAgICAgICAgICAgbmF2aWdhdGVUb1VybChnZXRVcmwoKSwgc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG5hdmlnYXRlVG9VcmwoX3VybCwgbmV3V2luZG93ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHVybCA9IF91cmw7XG5cbiAgICAgICAgaWYgKG5ld1dpbmRvdykge1xuICAgICAgICAgIHVybCA9IGAkeyR3aW5kb3cubG9jYXRpb24ub3JpZ2lufS8ke3VybH1gO1xuICAgICAgICAgICR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIVJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXiMvLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgICR0aW1lb3V0KCgpID0+ICRsb2NhdGlvbi51cmwodXJsKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkge1xuICAgICAgICByZXR1cm4gZXZlbnQuYnV0dG9uID09PSBNSURETEVfQlVUVE9OIHx8IChldmVudC5idXR0b24gPT09IExFRlRfQlVUVE9OICYmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0VXJsKCkge1xuICAgICAgICBjb25zdCB1cmxXcml0ZXJzID0gUm91dGUuZ2V0VXJsV3JpdGVycygpO1xuICAgICAgICBjb25zdCBsb2NhbHMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gdXJsV3JpdGVycykge1xuICAgICAgICAgIGxvY2Fsc1tgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gdXJsV3JpdGVyc1t3cml0ZXJOYW1lXTtcbiAgICAgIH1cblxuICAgICAgICBsZXQgdXJsID0gc2NvcGUuJGV2YWwoYXR0cnMucm91dGVPbkNsaWNrLCBfLmFzc2lnbihsb2NhbHMsIHNjb3BlKSk7XG5cbiAgICAgICAgcmV0dXJuIGh0bWw1VGhlVXJsKHVybCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGh0bWw1VGhlVXJsKHVybCkge1xuICAgICAgICByZXR1cm4gUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkgPyB1cmwgOiBgIyR7dXJsfWA7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFkZFdhdGNoVGhhdFVwZGF0ZXNIcmVmQXR0cmlidXRlKCkge1xuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBgJHtnZXRVcmwoKX1gXG4gICAgICAgIH0sIChuZXdVcmwpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmF0dHIoJ2hyZWYnLCBuZXdVcmwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlT25DbGljaycsIHJvdXRlT25DbGlja0ZhY3RvcnkpO1xuXG4vLyBAVE9ETyBub25lIG9mIHRoZSBhbmltYXRpb24gY29kZSBpbiB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiB0ZXN0ZWQuIE5vdCBzdXJlIGlmIGl0IGNhbiBiZSBhdCB0aGlzIHN0YWdlIFRoaXMgbmVlZHMgZnVydGhlciBpbnZlc3RpZ2F0aW9uLlxuLy8gQFRPRE8gdGhpcyBjb2RlIGRvZXMgdG9vIG11Y2gsIGl0IHNob3VsZCBiZSByZWZhY3RvcmVkLlxuXG5mdW5jdGlvbiByb3V0ZVZpZXdGYWN0b3J5KCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsICR0ZW1wbGF0ZVJlcXVlc3QsIFJvdXRlKSB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZTogZmFsc2UsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXY+PC9kaXY+JyxcbiAgICBsaW5rICh2aWV3RGlyZWN0aXZlU2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGxldCB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgbGV0IHZpZXdTY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHZpZXcgPSBWaWV3QmluZGluZ3MuZ2V0VmlldyhpQXR0cnMubmFtZSk7XG4gICAgICBjb25zdCBiaW5kaW5ncyA9IHZpZXcuZ2V0QmluZGluZ3MoKTtcblxuICAgICAgaUVsZW1lbnQuYWRkQ2xhc3MoJ25nLWhpZGUnKTtcblxuICAgICAgbGV0IHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRGF0YUZvckJpbmRpbmcgPSBiaW5kaW5nID0+IF8uY2xvbmVEZWVwKFN0YXRlLmdldFN1YnNldChnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKGJpbmRpbmcpKSk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGZpZWxkKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9ICdjb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGJpbmRpbmdbZmllbGRdID8gJGluamVjdG9yLmdldChgJHtiaW5kaW5nW2ZpZWxkXX1EaXJlY3RpdmVgKVswXSA6IGJpbmRpbmc7XG4gICAgICAgIHJldHVybiBfLmRlZmF1bHRzKF8ucGljayhzb3VyY2UsIFsnY29udHJvbGxlcicsICd0ZW1wbGF0ZVVybCcsICdjb250cm9sbGVyQXMnXSksIHtjb250cm9sbGVyQXM6ICckY3RybCd9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpIHtcbiAgICAgICAgY29uc3QgcmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXTtcblxuICAgICAgICBmb3IgKGxldCByZXF1aXJlbWVudCBvZiBBcnJheS5mcm9tKHJlcXVpcmVkU3RhdGUpKSB7XG4gICAgICAgICAgbGV0IG5lZ2F0ZVJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgIGlmICgnIScgPT09IHJlcXVpcmVtZW50LmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgcmVxdWlyZW1lbnQgPSByZXF1aXJlbWVudC5zbGljZSgxKTtcbiAgICAgICAgICAgIG5lZ2F0ZVJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGVsZW1lbnQgPSBTdGF0ZS5nZXQocmVxdWlyZW1lbnQpO1xuXG4gICAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGlmIGVsZW1lbnQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgKChlbGVtZW50ID09PSBudWxsKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE9ubHkgY2hlY2sgdmFsdWUgb2YgZWxlbWVudCBpZiBpdCBpcyBkZWZpbmVkXG4gICAgICAgICAgaWYgKG5lZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgZWxlbWVudCA9ICFlbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmluZGluZy5jYW5BY3RpdmF0ZSkge1xuICAgICAgICAgIGlmICghJGluamVjdG9yLmludm9rZShiaW5kaW5nLmNhbkFjdGl2YXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtYW5hZ2VWaWV3KGVsZW1lbnQsIGJpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nQmluZGluZyA9IGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncyk7XG5cbiAgICAgICAgaWYgKCFtYXRjaGluZ0JpbmRpbmcpIHtcbiAgICAgICAgICBpZiAodmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBkZXN0cm95VmlldyhlbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgUm91dGUuZGVsZXRlQ3VycmVudEJpbmRpbmcodmlldy5uYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IGdldFN0YXRlRGF0YUZvckJpbmRpbmcobWF0Y2hpbmdCaW5kaW5nKTtcbiAgICAgICAgaWYgKChtYXRjaGluZ0JpbmRpbmcgPT09IHByZXZpb3VzQmluZGluZykgJiYgYW5ndWxhci5lcXVhbHMocHJldmlvdXNCb3VuZFN0YXRlLCBuZXdTdGF0ZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSBtYXRjaGluZ0JpbmRpbmc7XG4gICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IG5ld1N0YXRlO1xuXG4gICAgICAgIFBlbmRpbmdWaWV3Q291bnRlci5pbmNyZWFzZSgpO1xuXG4gICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChoYXNSZXNvbHZpbmdUZW1wbGF0ZSkge1xuICAgICAgICAgIC8vIEBUT0RPOiBNYWdpYyBudW1iZXJcbiAgICAgICAgICBjb25zdCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbiA9IGhhc1Jlc29sdmluZ1RlbXBsYXRlID8gMzAwIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgaWYgKCF2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuICRhbmltYXRlLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSB7XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKGJpbmRpbmdzKSkge1xuICAgICAgICAgIGlmIChoYXNSZXF1aXJlZERhdGEoYmluZGluZykpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lWaWV3KGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHZpZXdDcmVhdGVkID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCkucmVtb3ZlKCk7XG4gICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVWaWV3KGVsZW1lbnQsIGJpbmRpbmcsIG1pbmltdW1EZWxheSkge1xuICAgICAgICBjb25zdCB0aW1lU3RhcnRlZE1haW5WaWV3ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZyk7XG5cbiAgICAgICAgY29uc3Qgb25TdWNjZXNzZnVsUmVzb2x1dGlvbiA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgaWYgKGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykgIT09IGJpbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2aWV3Q3JlYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICBjb25zdCByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA9IERhdGUubm93KCkgLSB0aW1lU3RhcnRlZE1haW5WaWV3O1xuXG4gICAgICAgICAgY29uc3QgaW5qZWN0TWFpblRlbXBsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yKGUsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZ2l2ZSB0aGUgdmlldyB0aW1lIHRvIHByb3Blcmx5IGluaXRpYWxpc2VcbiAgICAgICAgICAgICAgLy8gYmVmb3JlIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgdGhlIGludGlhbFZpZXdzTG9hZGVkIGV2ZW50XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5ID0gTWF0aC5tYXgoMCwgbWluaW11bURlbGF5IC0gcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lIDwgbWluaW11bURlbGF5KSB7XG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gaW5qZWN0TWFpblRlbXBsYXRlKClcbiAgICAgICAgICAgICAgLCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmplY3RNYWluVGVtcGxhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25SZXNvbHV0aW9uRmFpbHVyZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkbG9nLmVycm9yKGVycm9yKTtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfTtcblxuICAgICAgICBSb3V0ZS5zZXRDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUsIGJpbmRpbmcpXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge3RlbXBsYXRlOiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCksIGRlcGVuZGVuY2llczogcmVzb2x2ZShiaW5kaW5nKX07XG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4ob25TdWNjZXNzZnVsUmVzb2x1dGlvbiwgb25SZXNvbHV0aW9uRmFpbHVyZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCB8fCAhYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgcmV0dXJuICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoJHJvb3RTY29wZS4kbmV3KCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmIChiaW5kaW5nLnJlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVybiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNob3dSZXNvbHZpbmdFcnJvclRlbXBsYXRlID0gKGVsZW1lbnQsIGJpbmRpbmcpID0+IHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJyk7XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoYmluZGluZy5lcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLmVycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93RXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAnZXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCB0ZW1wbGF0ZUZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nW3RlbXBsYXRlRmllbGRdKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcbiAgICAgICAgICByZXR1cm4gbGluayh2aWV3U2NvcGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yQ29tcG9uZW50KGVycm9yLCBlbGVtZW50LCBiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nQ29tcG9uZW50RmllbGQpIHtcbiAgICAgICAgICBiaW5kaW5nQ29tcG9uZW50RmllbGQgPSAnZXJyb3JDb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYmluZGluZ1tiaW5kaW5nQ29tcG9uZW50RmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB7ZGVwZW5kZW5jaWVzOiB7ZXJyb3J9fTtcblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgYXJncy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpIHtcbiAgICAgICAgY29uc3Qge2RlcGVuZGVuY2llc30gPSBhcmdzO1xuICAgICAgICBjb25zdCB7dGVtcGxhdGV9ID0gYXJncztcblxuICAgICAgICBlbGVtZW50Lmh0bWwodGVtcGxhdGUpO1xuICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcblxuICAgICAgICBpZiAoY29tcG9uZW50LmNvbnRyb2xsZXIpIHtcbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSBfLm1lcmdlKGRlcGVuZGVuY2llcywgeyRzY29wZTogdmlld1Njb3BlLCAkZWxlbWVudDogZWxlbWVudC5jaGlsZHJlbigpLmVxKDApfSk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxzLiRzY29wZVtjb21wb25lbnQuY29udHJvbGxlckFzXSA9ICRjb250cm9sbGVyKGNvbXBvbmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KGVycm9yKSkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gJ0ZhaWxlZCB0byBzZXJpYWxpemUgZXJyb3Igb2JqZWN0IGZvciBsb2dnaW5nJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGxvZy5lcnJvcihgRmFpbGVkIGluc3RhbnRpYXRpbmcgY29udHJvbGxlciBmb3IgdmlldyAke3ZpZXd9OiAke2Vycm9yTWVzc2FnZX1gKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc29sdmUgPSBmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe30pO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVuY3lOYW1lIGluIGJpbmRpbmcucmVzb2x2ZSkge1xuICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lGYWN0b3J5ID0gYmluZGluZy5yZXNvbHZlW2RlcGVuZGVuY3lOYW1lXTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJGluamVjdG9yLmludm9rZShkZXBlbmRlbmN5RmFjdG9yeSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJHEucmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyA9IGJpbmRpbmcgPT4gXy51bmlvbihiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW10sIGJpbmRpbmcud2F0Y2hlZFN0YXRlIHx8IFtdKTtcblxuICAgICAgZnVuY3Rpb24gc3RyaXBOZWdhdGlvblByZWZpeChzdHIpIHtcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoMCkgPT09ICchJykge1xuICAgICAgICAgIHJldHVybiBzdHIuc3Vic3RyKDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyA9IHZpZXcgPT4gXy5mbGF0dGVuKF8ubWFwKHZpZXcuZ2V0QmluZGluZ3MoKSwgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZykpO1xuXG4gICAgICBjb25zdCBnZXRGaWVsZHNUb1dhdGNoID0gdmlldyA9PiBfLnVuaXEoXy5tYXAoZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyh2aWV3KSwgc3RyaXBOZWdhdGlvblByZWZpeCkpO1xuXG4gICAgICBjb25zdCBmaWVsZHMgPSBnZXRGaWVsZHNUb1dhdGNoKHZpZXcpO1xuXG4gICAgICByZXR1cm4gUm91dGUud2hlblJlYWR5KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgLy8gVHJ5IHRvIHN0YXJ0IHRoZSBiYWxsIHJvbGxpbmcgaW4gY2FzZSB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyBhbmQgd2UgY2FuIGNyZWF0ZSB0aGUgdmlldyBpbW1lZGlhdGVseVxuICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIERvbid0IGJvdGhlciBwdXR0aW5nIGluIGEgd2F0Y2hlciBpZiB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgZXZlciB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50XG4gICAgICAgIGlmIChmaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdGVXYXRjaGVyID0gZnVuY3Rpb24gKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAodmlld01hbmFnZW1lbnRQZW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBmaW5pc2ggdGhlIGRpZ2VzdCBjeWNsZSBiZWZvcmUgYnVpbGRpbmcgdGhlIHZpZXcsIHdoaWNoIHNob3VsZFxuICAgICAgICAgIC8vIHByZXZlbnQgdXMgZnJvbSByZS1yZW5kZXJpbmcgYSB2aWV3IG11bHRpcGxlIHRpbWVzIGlmIG11bHRpcGxlIHByb3BlcnRpZXMgb2YgdGhlIHNhbWUgc3RhdGUgZGVwZW5kZW5jeVxuICAgICAgICAgIC8vIGdldCBjaGFuZ2VkIHdpdGggcmVwZWF0ZWQgU3RhdGUuc2V0IGNhbGxzXG4gICAgICAgICAgcmV0dXJuICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHJldHVybiB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBTdGF0ZS53YXRjaChmaWVsZHMsIHN0YXRlV2F0Y2hlcik7XG5cbiAgICAgICAgdmlld0RpcmVjdGl2ZVNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiBTdGF0ZS5yZW1vdmVXYXRjaGVyKHN0YXRlV2F0Y2hlcikpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCd2aWV3Jywgcm91dGVWaWV3RmFjdG9yeSk7XG5cbmNsYXNzIFBlbmRpbmdWaWV3Q291bnRlciB7XG4gIGNvbnN0cnVjdG9yKCRyb290U2NvcGUpIHtcbiAgICB0aGlzLiRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gIH1cblxuICBpbmNyZWFzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudCArPSAxO1xuICB9XG5cbiAgZGVjcmVhc2UoKSB7XG4gICAgdGhpcy5jb3VudCA9IE1hdGgubWF4KDAsIHRoaXMuY291bnQgLSAxKTtcbiAgICBpZiAodGhpcy5jb3VudCA9PT0gMCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCkge1xuICAgICAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmluaXRpYWxWaWV3c0xvYWRlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuY3VycmVudFZpZXdzTG9hZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdQZW5kaW5nVmlld0NvdW50ZXInLCAoJHJvb3RTY29wZSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFBlbmRpbmdWaWV3Q291bnRlcigkcm9vdFNjb3BlKTtcbn0pO1xuXG5jbGFzcyBXYXRjaGFibGVMaXN0IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSwgbGlzdCkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcblxuICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgdGhpcy53YXRjaGVycyA9IFtdO1xuICB9XG5cbiAgZ2V0KHBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gIH1cblxuICBnZXRBbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdDtcbiAgfVxuXG4gIGdldFN1YnNldChwYXRocykge1xuICAgIHJldHVybiBfLnppcE9iamVjdChwYXRocywgXy5tYXAocGF0aHMsIHRoaXMuZ2V0LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIHNldChwYXRoLCB2YWx1ZSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyLnNldCh0aGlzLmxpc3QsIHBhdGgsIHZhbHVlKTtcbiAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB2YWx1ZSk7XG4gIH1cblxuICB1bnNldChwYXRocykge1xuICAgIGlmICghKHBhdGhzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBwYXRocyA9IFtwYXRoc107XG4gICAgfVxuXG4gICAgXyhwYXRocykuZWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy5PYmplY3RIZWxwZXIudW5zZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cblxuICB3YXRjaChwYXRocywgaGFuZGxlcikge1xuICAgIGlmICghKHBhdGhzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBwYXRocyA9IFtwYXRoc107XG4gICAgfVxuXG4gICAgXyhwYXRocykuZWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy53YXRjaGVycy5wdXNoKHRoaXMuV2F0Y2hlckZhY3RvcnkuY3JlYXRlKHBhdGgsIGhhbmRsZXIsIHRoaXMuZ2V0KHBhdGgpKSk7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVXYXRjaGVyKHdhdGNoZXIpIHtcbiAgICBpZiAodGhpcy53YXRjaGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmV3V2F0Y2hlcnMgPSBbXTtcblxuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB0aGlzV2F0Y2hlciA9PiB7XG4gICAgICBpZiAodGhpc1dhdGNoZXIuaGFuZGxlciAhPT0gd2F0Y2hlcikge1xuICAgICAgICBuZXdXYXRjaGVycy5wdXNoKHRoaXNXYXRjaGVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLndhdGNoZXJzID0gbmV3V2F0Y2hlcnM7XG4gIH1cblxuICBfbm90aWZ5V2F0Y2hlcnMoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHdhdGNoZXIgPT4ge1xuICAgICAgaWYgKHdhdGNoZXIuc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoZWRQYXRoID0gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgd2F0Y2hlci53YXRjaFBhdGgpO1xuICAgICAgICB3YXRjaGVyLm5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWVBdFdhdGNoZWRQYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGFibGVMaXN0RmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG4gIH1cblxuICBjcmVhdGUobGlzdCA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0KHRoaXMuT2JqZWN0SGVscGVyLCB0aGlzLldhdGNoZXJGYWN0b3J5LCBsaXN0KTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoYWJsZUxpc3RGYWN0b3J5JywgKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0RmFjdG9yeShPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KTtcbn0pO1xuXG5jbGFzcyBXYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLndhdGNoUGF0aCA9IHdhdGNoUGF0aDtcbiAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAoaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIF90b2tlbml6ZVBhdGgocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJyk7XG4gIH1cblxuICBzaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgLy8gTkIgc2hvcnQgY2lyY3VpdCBsb2dpYyBpbiB0aGUgc2ltcGxlIGNhc2VcbiAgICBpZiAodGhpcy53YXRjaFBhdGggPT09IGNoYW5nZWRQYXRoKSB7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHRoaXMuY3VycmVudFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2F0Y2ggPSB7XG4gICAgICBwYXRoOiB0aGlzLndhdGNoUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKHRoaXMud2F0Y2hQYXRoKSxcbiAgICAgIHZhbHVlOiB0aGlzLmN1cnJlbnRWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBjaGFuZ2UgPSB7XG4gICAgICBwYXRoOiBjaGFuZ2VkUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKGNoYW5nZWRQYXRoKSxcbiAgICAgIHZhbHVlOiBuZXdWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBtaW5pbXVtTGVudGggPSBNYXRoLm1pbihjaGFuZ2UudG9rZW5zLmxlbmd0aCwgd2F0Y2gudG9rZW5zLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgdG9rZW5JbmRleCA9IDA7IHRva2VuSW5kZXggPCBtaW5pbXVtTGVudGg7IHRva2VuSW5kZXgrKykge1xuICAgICAgaWYgKHdhdGNoLnRva2Vuc1t0b2tlbkluZGV4XSAhPT0gY2hhbmdlLnRva2Vuc1t0b2tlbkluZGV4XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTkIgaWYgd2UgZ2V0IGhlcmUgdGhlbiBhbGwgY29tbW9uIHRva2VucyBtYXRjaFxuXG4gICAgY29uc3QgY2hhbmdlUGF0aElzRGVzY2VuZGFudCA9IGNoYW5nZS50b2tlbnMubGVuZ3RoID4gd2F0Y2gudG9rZW5zLmxlbmd0aDtcblxuICAgIGlmIChjaGFuZ2VQYXRoSXNEZXNjZW5kYW50KSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBjaGFuZ2UudG9rZW5zLnNsaWNlKHdhdGNoLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGggPSBfLmdldCh3YXRjaC52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMoY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCwgY2hhbmdlLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gd2F0Y2gudG9rZW5zLnNsaWNlKGNoYW5nZS50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hQYXRoID0gXy5nZXQoY2hhbmdlLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh3YXRjaC52YWx1ZSwgbmV3VmFsdWVBdFdhdGNoUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIHRoaXMuaGFuZGxlcihjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIHRoaXMuY3VycmVudFZhbHVlKTtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKG5ld1ZhbHVlKTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGVyRmFjdG9yeSB7XG4gIGNyZWF0ZSh3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hlcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGVyRmFjdG9yeScsICgpID0+IHtcbiAgcmV0dXJuIG5ldyBXYXRjaGVyRmFjdG9yeSgpO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1JvdXRlJywgZnVuY3Rpb24oT2JqZWN0SGVscGVyKSB7XG4gIFwibmdJbmplY3RcIjtcbiAgY29uc3QgdG9rZW5zID0ge307XG4gIGNvbnN0IHVybFdyaXRlcnMgPSBbXTtcbiAgY29uc3QgdXJscyA9IFtdO1xuICBjb25zdCBwZXJzaXN0ZW50U3RhdGVzID0gW107XG4gIGNvbnN0IHJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHR5cGVzID0ge307XG4gIGxldCBodG1sNU1vZGUgPSBmYWxzZTtcblxuICBjb25zdCBwcm92aWRlciA9IHtcblxuICAgIHJlZ2lzdGVyVHlwZShuYW1lLCBjb25maWcpIHtcbiAgICAgIHR5cGVzW25hbWVdID0gY29uZmlnO1xuICAgICAgdHlwZXNbbmFtZV0ucmVnZXggPSBuZXcgUmVnRXhwKHR5cGVzW25hbWVdLnJlZ2V4LnNvdXJjZSwgJ2knKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclR5cGUgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsVG9rZW4obmFtZSwgY29uZmlnKSB7XG4gICAgICB0b2tlbnNbbmFtZV0gPSBfLmV4dGVuZCh7bmFtZX0sIGNvbmZpZyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxUb2tlbiB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxXcml0ZXIobmFtZSwgZm4pIHtcbiAgICAgIHVybFdyaXRlcnNbbmFtZV0gPSBmbjtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFdyaXRlciB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmwocGF0dGVybiwgY29uZmlnID0ge30pIHtcbiAgICAgIGNvbnN0IHVybERhdGEgPSB7XG4gICAgICAgIGNvbXBpbGVkVXJsOiB0aGlzLl9jb21waWxlVXJsUGF0dGVybihwYXR0ZXJuLCBjb25maWcpLFxuICAgICAgICBwYXR0ZXJuXG4gICAgICB9O1xuXG4gICAgICB1cmxzLnB1c2goXy5leHRlbmQodXJsRGF0YSwgY29uZmlnKSk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmwgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHNldFBlcnNpc3RlbnRTdGF0ZXMoLi4uc3RhdGVMaXN0KSB7XG4gICAgICBfLmZvckVhY2goc3RhdGVMaXN0LCAoc3RhdGUpID0+IHtcbiAgICAgICAgaWYgKCFwZXJzaXN0ZW50U3RhdGVzLmluY2x1ZGVzKHN0YXRlKSkge1xuICAgICAgICAgIHBlcnNpc3RlbnRTdGF0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRIdG1sNU1vZGUobW9kZSkge1xuICAgICAgaHRtbDVNb2RlID0gbW9kZTtcbiAgICB9LFxuXG4gICAgX2NvbXBpbGVVcmxQYXR0ZXJuKHVybFBhdHRlcm4sIGNvbmZpZykge1xuICAgICAgbGV0IG1hdGNoO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnModXJsUGF0dGVybik7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHVybFBhdHRlcm4pO1xuXG4gICAgICBjb25zdCB0b2tlblJlZ2V4ID0gL1xceyhbQS1aYS16XFwuXzAtOV0rKVxcfS9nO1xuICAgICAgbGV0IHVybFJlZ2V4ID0gdXJsUGF0dGVybjtcblxuICAgICAgaWYgKCFjb25maWcucGFydGlhbE1hdGNoKSB7XG4gICAgICAgIHVybFJlZ2V4ID0gYF4ke3VybFJlZ2V4fSRgO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b2tlbkxpc3QgPSBbXTtcblxuICAgICAgd2hpbGUgKChtYXRjaCA9IHRva2VuUmVnZXguZXhlYyh1cmxQYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbbWF0Y2hbMV1dO1xuICAgICAgICB0b2tlbkxpc3QucHVzaCh0b2tlbik7XG4gICAgICAgIHVybFJlZ2V4ID0gdXJsUmVnZXgucmVwbGFjZShtYXRjaFswXSwgYCgke3R5cGVzW3Rva2VuLnR5cGVdLnJlZ2V4LnNvdXJjZX0pYCk7XG4gICAgICB9XG5cbiAgICAgIHVybFJlZ2V4LnJlcGxhY2UoJy4nLCAnXFxcXC4nKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyksXG4gICAgICAgIHRva2VuczogdG9rZW5MaXN0XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBfZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHN0cikge1xuICAgICAgaWYgKHN0ci5tYXRjaCgvXFwvJC8pKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwvJC8sICcvPycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGAke3N0cn0vP2A7XG4gICAgfSxcblxuICAgIF9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFwoXFwpXFwqXFwrXFw/XFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gICAgfSxcblxuICAgICRnZXQoJGxvY2F0aW9uLCAkaW5qZWN0b3IsICRxKSB7XG4gICAgICAnbmdJbmplY3QnO1xuXG4gICAgICAvLyBXaGVuIGdldHRpbmcgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHNlcnZpY2UgKG9ubHkgZG9uZSBvbmNlKSwgd2UgbmVlZCB0byBpdGVyYXRlIG92ZXIgdGhlIHVybFdyaXRlcnMgYW5kIHR1cm5cbiAgICAgIC8vIHRoZW0gaW50byBtZXRob2RzIHRoYXQgaW52b2tlIHRoZSBSRUFMIHVybFdyaXRlciwgYnV0IHByb3ZpZGluZyBkZXBlbmRlbmN5IGluamVjdGlvbiB0byBpdCwgd2hpbGUgYWxzb1xuICAgICAgLy8gZ2l2aW5nIGl0IHRoZSBkYXRhIHRoYXQgdGhlIGNhbGxlZSBwYXNzZXMgaW4uXG5cbiAgICAgIC8vIFRoZSByZWFzb24gd2UgaGF2ZSB0byBkbyB0aGlzIGhlcmUgaXMgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGUgJGluamVjdG9yIGJhY2sgaW4gdGhlIHJvdXRlUHJvdmlkZXIuXG5cbiAgICAgIF8uZm9ySW4odXJsV3JpdGVycywgKHdyaXRlciwgd3JpdGVyTmFtZSkgPT5cbiAgICAgICAgdXJsV3JpdGVyc1t3cml0ZXJOYW1lXSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBpZiAoIWRhdGEpIHsgZGF0YSA9IHt9OyB9XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0ge1VybERhdGE6IGRhdGF9O1xuICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKHdyaXRlciwge30sIGxvY2Fscyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGxldCBmbGFzaFN0YXRlcyA9IFtdO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0ge1xuICAgICAgICBjdXJyZW50QmluZGluZ3M6IHt9LFxuICAgICAgICByZWFkeURlZmVycmVkOiAkcS5kZWZlcigpLFxuXG4gICAgICAgIG1hdGNoKHVybFRvTWF0Y2gpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHVybCBvZiBBcnJheS5mcm9tKHVybHMpKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gdXJsLmNvbXBpbGVkVXJsLnJlZ2V4LmV4ZWModXJsVG9NYXRjaCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7dXJsLCByZWdleE1hdGNoOiBtYXRjaH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REYXRhKG1hdGNoLCBzZWFyY2hEYXRhID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB0aGlzLmV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCk7XG4gICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuZXh0cmFjdFBhdGhEYXRhKG1hdGNoKTtcbiAgICAgICAgICBzZWFyY2hEYXRhID0gdGhpcy5leHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKTtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0SGVscGVyLmRlZmF1bHQoc2VhcmNoRGF0YSwgcGF0aCwgZGVmYXVsdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpIHtcbiAgICAgICAgICBpZiAoIXNlYXJjaERhdGEpIHsgc2VhcmNoRGF0YSA9ICRsb2NhdGlvbi5zZWFyY2goKTsgfVxuICAgICAgICAgIGNvbnN0IGRhdGEgPSBfLmNsb25lKHNlYXJjaERhdGEpO1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChkYXRhLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhcmdldEtleSA9IF8uZmluZEtleSh0b2tlbnMsIHsgc2VhcmNoQWxpYXM6IGtleSB9KTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0S2V5KSB7IHRhcmdldEtleSA9IGtleTsgfVxuXG4gICAgICAgICAgICBjb25zdCB0b2tlblR5cGVOYW1lID0gdG9rZW5zW3RhcmdldEtleV0gPyBfLmdldCh0b2tlbnNbdGFyZ2V0S2V5XSwgJ3R5cGUnKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICghdG9rZW5zW3RhcmdldEtleV0gfHwgKHR5cGVzW3Rva2VuVHlwZU5hbWVdLnJlZ2V4LnRlc3QodmFsdWUpKSkge1xuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0udHlwZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdHlwZVRva2VuVHlwZSA9IHRva2VuVHlwZSA/IHR5cGVzW3Rva2VuVHlwZV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZVBhcnNlZCA9IHR5cGVUb2tlblR5cGUgPyB0eXBlVG9rZW5UeXBlLnBhcnNlciA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICBpZiAodG9rZW5UeXBlUGFyc2VkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHRva2VuVHlwZVBhcnNlZCwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnN0YXRlUGF0aCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgZGF0YUtleSA9IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoIHx8IHRhcmdldEtleTtcblxuICAgICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KG5ld0RhdGEsIGRhdGFLZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChtYXRjaC51cmwuc3RhdGUsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsIGtleSwgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyBfLmNsb25lRGVlcCh2YWx1ZSkgOiB2YWx1ZSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFBhdGhEYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICAgIGNvbnN0IHBhdGhUb2tlbnMgPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zO1xuXG4gICAgICAgICAgaWYgKHBhdGhUb2tlbnMubGVuZ3RoID09PSAwKSB7IHJldHVybiB7fTsgfVxuXG4gICAgICAgICAgZm9yIChsZXQgbiA9IDAsIGVuZCA9IHBhdGhUb2tlbnMubGVuZ3RoLTEsIGFzYyA9IDAgPD0gZW5kOyBhc2MgPyBuIDw9IGVuZCA6IG4gPj0gZW5kOyBhc2MgPyBuKysgOiBuLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2Vuc1tuXTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG1hdGNoLnJlZ2V4TWF0Y2hbbisxXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlcikgeyB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7IH1cblxuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCAodG9rZW4uc3RhdGVQYXRoIHx8IHRva2VuLm5hbWUpLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVycygpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVycztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXIobmFtZSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXShkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnbyhuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gJGxvY2F0aW9uLnVybCh0aGlzLmludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGVyc2lzdGVudFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gcGVyc2lzdGVudFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkRmxhc2hTdGF0ZXMoLi4ubmV3U3RhdGVzKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBmbGFzaFN0YXRlcy5jb25jYXQobmV3U3RhdGVzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gZmxhc2hTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUsIGJpbmRpbmcpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV0gPSBiaW5kaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZSh2aWV3TmFtZSwgYmluZGluZ05hbWVFeHByZXNzaW9uKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudEJpbmRpbmcgPSB0aGlzLmdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKVxuXG4gICAgICAgICAgaWYgKCFjdXJyZW50QmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGJpbmRpbmdOYW1lRXhwcmVzc2lvbiBpbnN0YW5jZW9mIFJlZ0V4cCA/XG4gICAgICAgICAgICBiaW5kaW5nTmFtZUV4cHJlc3Npb24udGVzdChjdXJyZW50QmluZGluZy5uYW1lKSA6XG4gICAgICAgICAgICBjdXJyZW50QmluZGluZy5uYW1lID09PSBiaW5kaW5nTmFtZUV4cHJlc3Npb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UmVhZHkocmVhZHkpIHtcbiAgICAgICAgICBpZiAoIXJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNSZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNIdG1sNU1vZGVFbmFibGVkKCkge1xuICAgICAgICAgIHJldHVybiBodG1sNU1vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2hlblJlYWR5KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5RGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICB9O1xuXG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbnVtZXJpYycsIHtyZWdleDogL1xcZCsvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiBwYXJzZUludCh0b2tlbildfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYWxwaGEnLCB7cmVnZXg6IC9bYS16QS1aXSsvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYW55Jywge3JlZ2V4OiAvLisvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbGlzdCcsIHtyZWdleDogLy4rLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gdG9rZW4uc3BsaXQoJywnKV19KTtcblxuICByZXR1cm4gcHJvdmlkZXI7XG59KTtcblxuY2xhc3MgU3RhdGVQcm92aWRlciB7XG4gICRnZXQoV2F0Y2hhYmxlTGlzdEZhY3RvcnkpIHtcbiAgICAnbmdJbmplY3QnO1xuICAgIHJldHVybiBXYXRjaGFibGVMaXN0RmFjdG9yeS5jcmVhdGUoKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdTdGF0ZScsIG5ldyBTdGF0ZVByb3ZpZGVyKTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignVmlld0JpbmRpbmdzJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCB2aWV3cyA9IFtdO1xuXG4gIGNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJpbmRpbmdzKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgaWYgKCEodGhpcy5iaW5kaW5ncyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0gW3RoaXMuYmluZGluZ3NdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEJpbmRpbmdzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3M7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIGJpbmQobmFtZSwgY29uZmlnKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShiaW5kaW5ncywgY29tbW9uUmVxdWlyZWRTdGF0ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoYmluZGluZy5yZXF1aXJlZFN0YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBbYmluZGluZy5yZXF1aXJlZFN0YXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goYmluZGluZy5yZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlLmNvbmNhdChjb21tb25SZXF1aXJlZFN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXNvbHZlKGJpbmRpbmdzLCBjb21tb25SZXNvbHZlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoISgncmVzb2x2ZScgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVzb2x2ZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChfLmRlZmF1bHRzKGJpbmRpbmcucmVzb2x2ZSwgY29tbW9uUmVzb2x2ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJhc2ljQ29tbW9uRmllbGRzID0gW1xuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JUZW1wbGF0ZVVybCd9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCBjb21tb25GaWVsZCBvZiBBcnJheS5mcm9tKGJhc2ljQ29tbW9uRmllbGRzKSkge1xuICAgICAgICAgIGlmIChjb21tb25GaWVsZC5uYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgZGVmYXVsdEJpbmRpbmdGaWVsZChuZXdCaW5kaW5ncywgY29tbW9uRmllbGQub3ZlcnJpZGVGaWVsZCwgY29uZmlnW2NvbW1vbkZpZWxkLm5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlcXVpcmVkU3RhdGUnIGluIGNvbmZpZykge1xuICAgICAgICAgIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXF1aXJlZFN0YXRlJ10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXNvbHZlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb21tb25SZXNvbHZlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlc29sdmUnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdEJpbmRpbmdGaWVsZChiaW5kaW5ncywgZmllbGROYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgIGlmICghKGZpZWxkTmFtZSBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgaXRlbSA9IGJpbmRpbmdbZmllbGROYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
