(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxRQUFBLE1BQUEsQ0FBQSxlQUFBLEVBQWdDLENBQWhDLFdBQWdDLENBQWhDLEVBQUEsR0FBQSxxRkFBbUQsVUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsWUFBQSxFQUFBLGtCQUFBLEVBQWlGO0FBQ2xJOztBQUVBLE1BQUksU0FBSixTQUFBO0FBQ0EsYUFBQSxHQUFBLENBQUEsc0JBQUEsRUFBdUMsWUFBWTtBQUNqRCxRQUFJLE1BQUosT0FBSSxFQUFKLEVBQXFCO0FBQ25CLFlBQUEsUUFBQSxDQUFBLEtBQUE7QUFDRDtBQUhILEdBQUE7O0FBTUEsYUFBQSxHQUFBLENBQUEsd0JBQUEsRUFBeUMsVUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFxQjtBQUM1RDtBQUNBLFFBQUksT0FBQSxLQUFKLENBQUE7QUFDQSxRQUFJLFdBQUosTUFBQSxFQUF1QjtBQUNyQjtBQUNEOztBQUVELGFBQUEsTUFBQTs7QUFFQSx1QkFBQSxLQUFBO0FBQ0EsUUFBTSxRQUFRLE1BQUEsS0FBQSxDQUFZLFVBQTFCLElBQTBCLEVBQVosQ0FBZDs7QUFFQSxRQUFJLENBQUosS0FBQSxFQUFZO0FBQ1YsYUFBQSxFQUFBO0FBREYsS0FBQSxNQUVPO0FBQ0wsYUFBTyxNQUFBLFdBQUEsQ0FBUCxLQUFPLENBQVA7QUFDRDs7QUFFRCxRQUFJLGdCQUFnQixhQUFBLEtBQUEsQ0FBbUIsTUFBbkIsSUFBQSxFQUFwQixJQUFvQixDQUFwQjtBQUNBLG9CQUFnQixFQUFBLFVBQUEsQ0FBQSxhQUFBLEVBQTRCLE1BQUEsbUJBQUEsR0FBQSxNQUFBLENBQW1DLE1BQS9FLGNBQStFLEVBQW5DLENBQTVCLENBQWhCOztBQUVBLFFBQU0sWUFB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QWQ7QUFERixPQUFBLE1BRU87QUFDTCxzQkFBZSxrQkFBRCxLQUFDLEdBQUQsTUFBQyxHQUFvQyxDQUFuRCxNQUFtRCxDQUFuRDtBQUNEOztBQUVELFVBQUksRUFBRSxZQUFBLE1BQUEsR0FBTixDQUFJLENBQUosRUFBK0I7QUFDN0IsY0FBTSxJQUFBLEtBQUEsQ0FBQSwwREFBQSxJQUFBLEdBQU4sSUFBTSxDQUFOO0FBQ0Q7O0FBRUQsd0JBQUEsV0FBQTtBQUNBLGFBQU8sTUFBQSxJQUFBLElBQWMsSUFBQSxJQUFBLENBQUEsSUFBQSxFQUFyQixXQUFxQixDQUFyQjtBQTFFRyxLQUFBO0FBQUEsVUFBQSxTQUFBLElBQUEsR0E2RUU7QUFDTCxhQUFPO0FBQUEsaUJBQUEsU0FBQSxPQUFBLENBQUEsSUFBQSxFQUNTO0FBQ1osaUJBQU8sTUFBUCxJQUFPLENBQVA7QUFDRDtBQUhJLE9BQVA7QUFLRDtBQW5GSSxHQUFQO0FBakJGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJhbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicsIFsnbmdBbmltYXRlJ10pLnJ1bihmdW5jdGlvbiAoU3RhdGUsIFJvdXRlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE9iamVjdEhlbHBlciwgUGVuZGluZ1ZpZXdDb3VudGVyKSB7XG4gIFwibmdJbmplY3RcIjtcblxuICBsZXQgb2xkVXJsID0gdW5kZWZpbmVkO1xuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJvdXRlLmlzUmVhZHkoKSkge1xuICAgICAgUm91dGUuc2V0UmVhZHkoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZSwgbmV3VXJsKSB7XG4gICAgLy8gV29yay1hcm91bmQgZm9yIEFuZ3VsYXJKUyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2lzc3Vlcy84MzY4XG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKG5ld1VybCA9PT0gb2xkVXJsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2xkVXJsID0gbmV3VXJsO1xuXG4gICAgUGVuZGluZ1ZpZXdDb3VudGVyLnJlc2V0KCk7XG4gICAgY29uc3QgbWF0Y2ggPSBSb3V0ZS5tYXRjaCgkbG9jYXRpb24ucGF0aCgpKTtcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IFJvdXRlLmV4dHJhY3REYXRhKG1hdGNoKTtcbiAgICB9XG5cbiAgICBsZXQgZmllbGRzVG9VbnNldCA9IE9iamVjdEhlbHBlci5ub3RJbihTdGF0ZS5saXN0LCBkYXRhKTtcbiAgICBmaWVsZHNUb1Vuc2V0ID0gXy5kaWZmZXJlbmNlKGZpZWxkc1RvVW5zZXQsIFJvdXRlLmdldFBlcnNpc3RlbnRTdGF0ZXMoKS5jb25jYXQoUm91dGUuZ2V0Rmxhc2hTdGF0ZXMoKSkpO1xuXG4gICAgY29uc3QgZXZlbnREYXRhID0ge3Vuc2V0dGluZzogZmllbGRzVG9VbnNldCwgc2V0dGluZzogZGF0YX07XG4gICAgJHJvb3RTY29wZS4kZW1pdCgnYmlja2VyX3JvdXRlci5iZWZvcmVTdGF0ZUNoYW5nZScsIGV2ZW50RGF0YSk7XG5cbiAgICBpZiAoKGV2ZW50RGF0YS51bnNldHRpbmcpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgU3RhdGUudW5zZXQoZXZlbnREYXRhLnVuc2V0dGluZyk7XG4gICAgfVxuXG4gICAgXy5mb3JFYWNoKGV2ZW50RGF0YS5zZXR0aW5nLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgUm91dGUucmVzZXRGbGFzaFN0YXRlcygpO1xuICAgIFJvdXRlLnNldFJlYWR5KHRydWUpO1xuICB9KTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmNvbnN0YW50KCdPYmplY3RIZWxwZXInLCB7XG4gIGdldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudFtrZXldO1xuICB9LFxuXG4gIHNldChvYmplY3QsIHBhdGgsIHZhbHVlKSB7XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgaWYgKHBhcmVudFtzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhcmVudFtzZWdtZW50XSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudFtrZXldID0gdmFsdWU7XG4gIH0sXG5cbiAgdW5zZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudFtrZXldID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgZGVsZXRlIHBhcmVudFtrZXldO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIC8vIFJlY3Vyc2l2ZWx5IHJldHVybiB0aGUgcHJvcGVydGllcyBpbiBhIHRoYXQgYXJlbid0IGluIGJcbiAgbm90SW4oYSwgYiwgcHJlZml4ID0gJycpIHtcbiAgICBsZXQgbm90SW4gPSBbXTtcbiAgICBwcmVmaXggPSBwcmVmaXgubGVuZ3RoID4gMCA/IGAke3ByZWZpeH0uYCA6ICcnO1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgQXJyYXkuZnJvbShPYmplY3Qua2V5cyhhKSkpIHtcbiAgICAgIGNvbnN0IHRoaXNQYXRoID0gYCR7cHJlZml4fSR7a2V5fWA7XG5cbiAgICAgIGlmIChiW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub3RJbi5wdXNoKHRoaXNQYXRoKTtcblxuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIGFba2V5XSA9PT0gJ29iamVjdCcpICYmICghKGFba2V5XSBpbnN0YW5jZW9mIEFycmF5KSkpIHtcbiAgICAgICAgbm90SW4gPSBub3RJbi5jb25jYXQodGhpcy5ub3RJbihhW2tleV0sIGJba2V5XSwgdGhpc1BhdGgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm90SW47XG4gIH0sXG5cbiAgZGVmYXVsdChvdmVycmlkZXMsIC4uLmRlZmF1bHRTZXRzKSB7XG4gICAgbGV0IGRlZmF1bHRTZXQsIHZhbHVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgaWYgKGRlZmF1bHRTZXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZGVmYXVsdFNldCA9IGRlZmF1bHRTZXRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0U2V0ID0gdGhpcy5kZWZhdWx0KC4uLkFycmF5LmZyb20oZGVmYXVsdFNldHMgfHwgW10pKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkZWZhdWx0U2V0KSB7XG4gICAgICB2YWx1ZSA9IGRlZmF1bHRTZXRba2V5XTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb3ZlcnJpZGVzW2tleV0gPT09IFwib2JqZWN0XCIpKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5kZWZhdWx0KG92ZXJyaWRlc1trZXldLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIG92ZXJyaWRlcykge1xuICAgICAgdmFsdWUgPSBvdmVycmlkZXNba2V5XTtcbiAgICAgIHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gfHwgdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG5cblxuLy8gVXNhZ2U6XG4vL1xuLy8gSWYgeW91IHdhbnQgdG8gYWRkIHRoZSBjbGFzcyBcImFjdGl2ZVwiIHRvIGFuIGFuY2hvciBlbGVtZW50IHdoZW4gdGhlIFwibWFpblwiIHZpZXcgaGFzIGEgYmluZGluZ1xuLy8gd2l0aCB0aGUgbmFtZSBcIm15QmluZGluZ1wiIHJlbmRlcmVkIHdpdGhpbiBpdFxuLy9cbi8vIDxhIHJvdXRlLWNsYXNzPVwieyBjbGFzc05hbWU6ICdhY3RpdmUnLCB2aWV3TmFtZTogJ21haW4nLCBiaW5kaW5nTmFtZTogJ215QmluZGluZycgfVwiPkFuY2hvciB0ZXh0PC9hPlxuLy9cbi8vIFlvdSBjYW4gYWxzbyB1c2UgcmVndWxhciBleHByZXNzaW9ucyBmb3IgdGhlIGJpbmRpbmcgbmFtZSwgYnV0IHRvIGRvIHNvIHlvdSBoYXZlIHRvIHByb3ZpZGUgYSBtZXRob2Rcbi8vIG9uIHlvdXIgY29udHJvbGxlciB3aGljaCByZXR1cm5zIHRoZSByb3V0ZSBjbGFzcyBkZWZpbml0aW9uIG9iamVjdCwgYmVjYXVzZSBBbmd1bGFySlMgZXhwcmVzc2lvbnNcbi8vIGRvbid0IHN1cHBvcnQgaW5saW5lIHJlZ3VsYXIgZXhwcmVzc2lvbnNcbi8vXG4vLyBjbGFzcyBNeUNvbnRyb2xsZXIge1xuLy8gIGdldFJvdXRlQ2xhc3NPYmplY3QoKSB7XG4vLyAgICByZXR1cm4geyBjbGFzc05hbWU6ICdhY3RpdmUnLCB2aWV3TmFtZTogJ21haW4nLCBiaW5kaW5nTmFtZTogL215QmluZC8gfVxuLy8gIH1cbi8vIH1cbi8vXG4vLyA8YSByb3V0ZS1jbGFzcz1cIiRjdHJsLmdldFJvdXRlQ2xhc3NPYmplY3QoKVwiPkFuY2hvciB0ZXh0PC9hPlxuLy9cblxuZnVuY3Rpb24gcm91dGVDbGFzc0ZhY3RvcnkoUm91dGUpIHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goKCkgPT4ge1xuICAgICAgICBjb25zdCByb3V0ZUNsYXNzRGVmaW5pdGlvbiA9IHNjb3BlLiRldmFsKGlBdHRyc1sncm91dGVDbGFzcyddKTtcblxuICAgICAgICBpZiAoIVJvdXRlLm1hdGNoZXNDdXJyZW50QmluZGluZ05hbWUocm91dGVDbGFzc0RlZmluaXRpb24udmlld05hbWUsIHJvdXRlQ2xhc3NEZWZpbml0aW9uLmJpbmRpbmdOYW1lKSkge1xuICAgICAgICAgIGlmIChpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5yZW1vdmVDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghaUVsZW1lbnQuaGFzQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKSkge1xuICAgICAgICAgIGlFbGVtZW50LmFkZENsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlQ2xhc3MnLCByb3V0ZUNsYXNzRmFjdG9yeSk7XG5cbmZ1bmN0aW9uIHJvdXRlSHJlZkZhY3RvcnkgKFJvdXRlLCAkbG9jYXRpb24sICR0aW1lb3V0KSB7XG4gICduZ0luamVjdCc7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHNjb3BlOiB0cnVlLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBpZiAoaUF0dHJzLmlnbm9yZUhyZWYgPT09IHVuZGVmaW5lZCAmJiBSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICBpRWxlbWVudC5jbGljaygoZXZlbnQpID0+IHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGNvbnN0IHVybFBhdGggPSBpRWxlbWVudC5hdHRyKCdocmVmJykucmVwbGFjZSgvXiMvLCAnJyk7XG4gICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+ICRsb2NhdGlvbi51cmwodXJsUGF0aCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2JqZWN0ID0gUm91dGUuZ2V0VXJsV3JpdGVycygpO1xuICAgICAgZm9yIChjb25zdCB3cml0ZXJOYW1lIGluIG9iamVjdCkge1xuICAgICAgICBjb25zdCB3cml0ZXIgPSBvYmplY3Rbd3JpdGVyTmFtZV07XG4gICAgICAgIHNjb3BlW2Ake3dyaXRlck5hbWV9VXJsV3JpdGVyYF0gPSB3cml0ZXI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzY29wZS4kd2F0Y2goaUF0dHJzLnJvdXRlSHJlZiwgKG5ld1VybCkgPT4ge1xuICAgICAgICBsZXQgdXJsO1xuICAgICAgICBpZiAoUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICB1cmwgPSBuZXdVcmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsID0gYCMke25ld1VybH1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpRWxlbWVudC5hdHRyKCdocmVmJywgdXJsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlSHJlZicsIHJvdXRlSHJlZkZhY3RvcnkpO1xuXG5mdW5jdGlvbiByb3V0ZU9uQ2xpY2tGYWN0b3J5IChSb3V0ZSwgJGxvY2F0aW9uLCAkd2luZG93LCAkdGltZW91dCkge1xuICAnbmdJbmplY3QnO1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcblxuICAgIGxpbmsgKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgY29uc3QgTEVGVF9CVVRUT04gPSAwO1xuICAgICAgY29uc3QgTUlERExFX0JVVFRPTiA9IDE7XG5cbiAgICAgIGlmIChlbGVtZW50LmlzKCdhJykpIHtcbiAgICAgICAgYWRkV2F0Y2hUaGF0VXBkYXRlc0hyZWZBdHRyaWJ1dGUoKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5jbGljaygoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09PSBMRUZUX0JVVFRPTikge1xuICAgICAgICAgICAgbmF2aWdhdGVUb1VybChnZXRVcmwoKSwgc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5tb3VzZXVwKChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT09IE1JRERMRV9CVVRUT04pIHtcbiAgICAgICAgICAgIG5hdmlnYXRlVG9VcmwoZ2V0VXJsKCksIHNob3VsZE9wZW5OZXdXaW5kb3coZXZlbnQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBuYXZpZ2F0ZVRvVXJsKF91cmwsIG5ld1dpbmRvdyA9IGZhbHNlKSB7XG4gICAgICAgIGxldCB1cmwgPSBfdXJsO1xuXG4gICAgICAgIGlmIChuZXdXaW5kb3cpIHtcbiAgICAgICAgICB1cmwgPSBgJHskd2luZG93LmxvY2F0aW9uLm9yaWdpbn0vJHt1cmx9YDtcbiAgICAgICAgICAkd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL14jLywgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkdGltZW91dCgoKSA9PiAkbG9jYXRpb24udXJsKHVybCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3VsZE9wZW5OZXdXaW5kb3coZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50LmJ1dHRvbiA9PT0gTUlERExFX0JVVFRPTiB8fCAoZXZlbnQuYnV0dG9uID09PSBMRUZUX0JVVFRPTiAmJiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFVybCgpIHtcbiAgICAgICAgY29uc3QgdXJsV3JpdGVycyA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICAgICAgY29uc3QgbG9jYWxzID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCB3cml0ZXJOYW1lIGluIHVybFdyaXRlcnMpIHtcbiAgICAgICAgICBsb2NhbHNbYCR7d3JpdGVyTmFtZX1VcmxXcml0ZXJgXSA9IHVybFdyaXRlcnNbd3JpdGVyTmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmwgPSBzY29wZS4kZXZhbChhdHRycy5yb3V0ZU9uQ2xpY2ssIF8uYXNzaWduKGxvY2Fscywgc2NvcGUpKTtcblxuICAgICAgICByZXR1cm4gaHRtbDVUaGVVcmwodXJsKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaHRtbDVUaGVVcmwodXJsKSB7XG4gICAgICAgIHJldHVybiBSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSA/IHVybCA6IGAjJHt1cmx9YDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYWRkV2F0Y2hUaGF0VXBkYXRlc0hyZWZBdHRyaWJ1dGUoKSB7XG4gICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGAke2dldFVybCgpfWA7XG4gICAgICAgIH0sIChuZXdVcmwpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmF0dHIoJ2hyZWYnLCBuZXdVcmwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZU9uQ2xpY2snLCByb3V0ZU9uQ2xpY2tGYWN0b3J5KTtcblxuLy8gQFRPRE8gbm9uZSBvZiB0aGUgYW5pbWF0aW9uIGNvZGUgaW4gdGhpcyBkaXJlY3RpdmUgaGFzIGJlZW4gdGVzdGVkLiBOb3Qgc3VyZSBpZiBpdCBjYW4gYmUgYXQgdGhpcyBzdGFnZSBUaGlzIG5lZWRzIGZ1cnRoZXIgaW52ZXN0aWdhdGlvbi5cbi8vIEBUT0RPIHRoaXMgY29kZSBkb2VzIHRvbyBtdWNoLCBpdCBzaG91bGQgYmUgcmVmYWN0b3JlZC5cblxuZnVuY3Rpb24gcm91dGVWaWV3RmFjdG9yeSgkbG9nLCAkY29tcGlsZSwgJGNvbnRyb2xsZXIsIFZpZXdCaW5kaW5ncywgJHEsIFN0YXRlLCAkcm9vdFNjb3BlLCAkYW5pbWF0ZSwgJHRpbWVvdXQsICRpbmplY3RvciwgUGVuZGluZ1ZpZXdDb3VudGVyLCAkdGVtcGxhdGVSZXF1ZXN0LCBSb3V0ZSkge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IGZhbHNlLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGU6ICc8ZGl2PjwvZGl2PicsXG4gICAgbGluayAodmlld0RpcmVjdGl2ZVNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBsZXQgdmlld0NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgIGxldCB2aWV3U2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgdmlld0NvbnRyb2xsZXIgPSB7fTsgLy8gTkIgd2lsbCBvbmx5IGJlIGRlZmluZWQgZm9yIGNvbXBvbmVudHNcbiAgICAgIGxldCB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbnN0IHZpZXcgPSBWaWV3QmluZGluZ3MuZ2V0VmlldyhpQXR0cnMubmFtZSk7XG4gICAgICBjb25zdCBiaW5kaW5ncyA9IHZpZXcuZ2V0QmluZGluZ3MoKTtcblxuICAgICAgaUVsZW1lbnQuYWRkQ2xhc3MoJ25nLWhpZGUnKTtcblxuICAgICAgbGV0IHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRGF0YUZvckJpbmRpbmcgPSBiaW5kaW5nID0+IF8uY2xvbmVEZWVwKFN0YXRlLmdldFN1YnNldChnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKGJpbmRpbmcpKSk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGZpZWxkKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9ICdjb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGJpbmRpbmdbZmllbGRdID8gJGluamVjdG9yLmdldChgJHtiaW5kaW5nW2ZpZWxkXX1EaXJlY3RpdmVgKVswXSA6IGJpbmRpbmc7XG4gICAgICAgIHJldHVybiBfLmRlZmF1bHRzKF8ucGljayhzb3VyY2UsIFsnY29udHJvbGxlcicsICd0ZW1wbGF0ZVVybCcsICdjb250cm9sbGVyQXMnXSksIHtjb250cm9sbGVyQXM6ICckY3RybCd9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpIHtcbiAgICAgICAgY29uc3QgcmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXTtcblxuICAgICAgICBmb3IgKGxldCByZXF1aXJlbWVudCBvZiBBcnJheS5mcm9tKHJlcXVpcmVkU3RhdGUpKSB7XG4gICAgICAgICAgbGV0IG5lZ2F0ZVJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgIGlmICgnIScgPT09IHJlcXVpcmVtZW50LmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgcmVxdWlyZW1lbnQgPSByZXF1aXJlbWVudC5zbGljZSgxKTtcbiAgICAgICAgICAgIG5lZ2F0ZVJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGVsZW1lbnQgPSBTdGF0ZS5nZXQocmVxdWlyZW1lbnQpO1xuXG4gICAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGlmIGVsZW1lbnQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgKChlbGVtZW50ID09PSBudWxsKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE9ubHkgY2hlY2sgdmFsdWUgb2YgZWxlbWVudCBpZiBpdCBpcyBkZWZpbmVkXG4gICAgICAgICAgaWYgKG5lZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgZWxlbWVudCA9ICFlbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmluZGluZy5jYW5BY3RpdmF0ZSkge1xuICAgICAgICAgIGlmICghJGluamVjdG9yLmludm9rZShiaW5kaW5nLmNhbkFjdGl2YXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtYW5hZ2VWaWV3KGVsZW1lbnQsIGJpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nQmluZGluZyA9IGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncyk7XG5cbiAgICAgICAgaWYgKCFtYXRjaGluZ0JpbmRpbmcpIHtcbiAgICAgICAgICBpZiAodmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBkZXN0cm95VmlldyhlbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgUm91dGUuZGVsZXRlQ3VycmVudEJpbmRpbmcodmlldy5uYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nKG1hdGNoaW5nQmluZGluZyk7XG4gICAgICAgIGlmICgobWF0Y2hpbmdCaW5kaW5nID09PSBwcmV2aW91c0JpbmRpbmcpICYmIGFuZ3VsYXIuZXF1YWxzKHByZXZpb3VzQm91bmRTdGF0ZSwgbmV3U3RhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmluZGluZ0NoYW5nZWRFdmVudERhdGEgPSB7IHZpZXdOYW1lOiBpQXR0cnMubmFtZSwgY3VycmVudEJpbmRpbmc6IG1hdGNoaW5nQmluZGluZyB9O1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuYmluZGluZ0NoYW5nZWQnLCBiaW5kaW5nQ2hhbmdlZEV2ZW50RGF0YSk7XG5cbiAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gbWF0Y2hpbmdCaW5kaW5nO1xuICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgICAgICBQZW5kaW5nVmlld0NvdW50ZXIuaW5jcmVhc2UoKTtcblxuICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZykudGhlbihmdW5jdGlvbiAoaGFzUmVzb2x2aW5nVGVtcGxhdGUpIHtcbiAgICAgICAgICAvLyBAVE9ETzogTWFnaWMgbnVtYmVyXG4gICAgICAgICAgY29uc3QgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24gPSBoYXNSZXNvbHZpbmdUZW1wbGF0ZSA/IDMwMCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmICghdmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkYW5pbWF0ZS5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIGlmICh2aWV3Q29udHJvbGxlci4kb25EZXN0cm95KSB7IHZpZXdDb250cm9sbGVyLiRvbkRlc3Ryb3koKTsgfVxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSB7XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKGJpbmRpbmdzKSkge1xuICAgICAgICAgIGlmIChoYXNSZXF1aXJlZERhdGEoYmluZGluZykpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lWaWV3KGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHZpZXdDcmVhdGVkID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCkucmVtb3ZlKCk7XG4gICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICBpZiAodmlld0NvbnRyb2xsZXIuJG9uRGVzdHJveSkgeyB2aWV3Q29udHJvbGxlci4kb25EZXN0cm95KCk7IH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY3JlYXRlVmlldyhlbGVtZW50LCBiaW5kaW5nLCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgY29uc3QgdGltZVN0YXJ0ZWRNYWluVmlldyA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcpO1xuXG4gICAgICAgIGNvbnN0IG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24gPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgIGlmIChnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpICE9PSBiaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmlld0NyZWF0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgY29uc3QgcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPSBEYXRlLm5vdygpIC0gdGltZVN0YXJ0ZWRNYWluVmlldztcblxuICAgICAgICAgIGNvbnN0IGluamVjdE1haW5UZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGdpdmUgdGhlIHZpZXcgdGltZSB0byBwcm9wZXJseSBpbml0aWFsaXNlXG4gICAgICAgICAgICAgIC8vIGJlZm9yZSBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIHRoZSBpbnRpYWxWaWV3c0xvYWRlZCBldmVudFxuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSA9IE1hdGgubWF4KDAsIG1pbmltdW1EZWxheSAtIHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA8IG1pbmltdW1EZWxheSkge1xuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+IGluamVjdE1haW5UZW1wbGF0ZSgpXG4gICAgICAgICAgICAgICwgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0TWFpblRlbXBsYXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uUmVzb2x1dGlvbkZhaWx1cmUgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJGxvZy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgUm91dGUuc2V0Q3VycmVudEJpbmRpbmcodmlldy5uYW1lLCBiaW5kaW5nKTtcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7dGVtcGxhdGU6ICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKSwgZGVwZW5kZW5jaWVzOiByZXNvbHZlKGJpbmRpbmcpfTtcbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uLCBvblJlc29sdXRpb25GYWlsdXJlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsIHx8ICFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICByZXR1cm4gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKSgkcm9vdFNjb3BlLiRuZXcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLnJlc29sdmluZ0Vycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd1Jlc29sdmluZ0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGxldCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChiaW5kaW5nLmVycm9yVGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcuZXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNob3dFcnJvclRlbXBsYXRlID0gKGVsZW1lbnQsIGJpbmRpbmcpID0+IHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdlcnJvclRlbXBsYXRlVXJsJyk7XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsIHRlbXBsYXRlRmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nW3RlbXBsYXRlRmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuICAgICAgICAgIHZpZXdDb250cm9sbGVyID0ge307XG4gICAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ0NvbXBvbmVudEZpZWxkKSB7XG4gICAgICAgICAgYmluZGluZ0NvbXBvbmVudEZpZWxkID0gJ2Vycm9yQ29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWJpbmRpbmdbYmluZGluZ0NvbXBvbmVudEZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBiaW5kaW5nQ29tcG9uZW50RmllbGQpO1xuICAgICAgICBjb25zdCBhcmdzID0ge2RlcGVuZGVuY2llczoge2Vycm9yfX07XG5cbiAgICAgICAgcmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGFyZ3MudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKSB7XG4gICAgICAgIGNvbnN0IHtkZXBlbmRlbmNpZXN9ID0gYXJncztcbiAgICAgICAgY29uc3Qge3RlbXBsYXRlfSA9IGFyZ3M7XG5cbiAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgIHZpZXdTY29wZSA9IHZpZXdEaXJlY3RpdmVTY29wZS4kbmV3KCk7XG4gICAgICAgIHZpZXdDb250cm9sbGVyID0ge307XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0gXy5tZXJnZShkZXBlbmRlbmNpZXMsIHskc2NvcGU6IHZpZXdTY29wZSwgJGVsZW1lbnQ6IGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKX0pO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZpZXdDb250cm9sbGVyID0gJGNvbnRyb2xsZXIoY29tcG9uZW50LmNvbnRyb2xsZXIsIGxvY2Fscyk7XG4gICAgICAgICAgICBsb2NhbHMuJHNjb3BlW2NvbXBvbmVudC5jb250cm9sbGVyQXNdID0gdmlld0NvbnRyb2xsZXI7XG4gICAgICAgICAgICBpZiAodmlld0NvbnRyb2xsZXIuJG9uSW5pdCkgeyB2aWV3Q29udHJvbGxlci4kb25Jbml0KCk7IH1cbiAgICAgICAgICB9ICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSAnRmFpbGVkIHRvIHNlcmlhbGl6ZSBlcnJvciBvYmplY3QgZm9yIGxvZ2dpbmcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkbG9nLmVycm9yKGBGYWlsZWQgaW5zdGFudGlhdGluZyBjb250cm9sbGVyIGZvciB2aWV3ICR7dmlld306ICR7ZXJyb3JNZXNzYWdlfWApO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZSA9IGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7fSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgZGVwZW5kZW5jeU5hbWUgaW4gYmluZGluZy5yZXNvbHZlKSB7XG4gICAgICAgICAgY29uc3QgZGVwZW5kZW5jeUZhY3RvcnkgPSBiaW5kaW5nLnJlc29sdmVbZGVwZW5kZW5jeU5hbWVdO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkaW5qZWN0b3IuaW52b2tlKGRlcGVuZGVuY3lGYWN0b3J5KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkcS5yZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcyk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nID0gYmluZGluZyA9PiBfLnVuaW9uKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXSwgYmluZGluZy53YXRjaGVkU3RhdGUgfHwgW10pO1xuXG4gICAgICBmdW5jdGlvbiBzdHJpcE5lZ2F0aW9uUHJlZml4KHN0cikge1xuICAgICAgICBpZiAoc3RyLmNoYXJBdCgwKSA9PT0gJyEnKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3ID0gdmlldyA9PiBfLmZsYXR0ZW4oXy5tYXAodmlldy5nZXRCaW5kaW5ncygpLCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKSk7XG5cbiAgICAgIGNvbnN0IGdldEZpZWxkc1RvV2F0Y2ggPSB2aWV3ID0+IF8udW5pcShfLm1hcChnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3KHZpZXcpLCBzdHJpcE5lZ2F0aW9uUHJlZml4KSk7XG5cbiAgICAgIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc1RvV2F0Y2godmlldyk7XG5cbiAgICAgIHJldHVybiBSb3V0ZS53aGVuUmVhZHkoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAvLyBUcnkgdG8gc3RhcnQgdGhlIGJhbGwgcm9sbGluZyBpbiBjYXNlIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIGFuZCB3ZSBjYW4gY3JlYXRlIHRoZSB2aWV3IGltbWVkaWF0ZWx5XG4gICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gRG9uJ3QgYm90aGVyIHB1dHRpbmcgaW4gYSB3YXRjaGVyIGlmIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBldmVyIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgaWYgKGZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0ZVdhdGNoZXIgPSBmdW5jdGlvbiAoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgIGlmICh2aWV3TWFuYWdlbWVudFBlbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGZpbmlzaCB0aGUgZGlnZXN0IGN5Y2xlIGJlZm9yZSBidWlsZGluZyB0aGUgdmlldywgd2hpY2ggc2hvdWxkXG4gICAgICAgICAgLy8gcHJldmVudCB1cyBmcm9tIHJlLXJlbmRlcmluZyBhIHZpZXcgbXVsdGlwbGUgdGltZXMgaWYgbXVsdGlwbGUgcHJvcGVydGllcyBvZiB0aGUgc2FtZSBzdGF0ZSBkZXBlbmRlbmN5XG4gICAgICAgICAgLy8gZ2V0IGNoYW5nZWQgd2l0aCByZXBlYXRlZCBTdGF0ZS5zZXQgY2FsbHNcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIFN0YXRlLndhdGNoKGZpZWxkcywgc3RhdGVXYXRjaGVyKTtcblxuICAgICAgICB2aWV3RGlyZWN0aXZlU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IFN0YXRlLnJlbW92ZVdhdGNoZXIoc3RhdGVXYXRjaGVyKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCd2aWV3Jywgcm91dGVWaWV3RmFjdG9yeSk7XG5cbmNsYXNzIFBlbmRpbmdWaWV3Q291bnRlciB7XG4gIGNvbnN0cnVjdG9yKCRyb290U2NvcGUpIHtcbiAgICB0aGlzLiRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gIH1cblxuICBpbmNyZWFzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudCArPSAxO1xuICB9XG5cbiAgZGVjcmVhc2UoKSB7XG4gICAgdGhpcy5jb3VudCA9IE1hdGgubWF4KDAsIHRoaXMuY291bnQgLSAxKTtcbiAgICBpZiAodGhpcy5jb3VudCA9PT0gMCkge1xuICAgICAgaWYgKCF0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCkge1xuICAgICAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmluaXRpYWxWaWV3c0xvYWRlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuY3VycmVudFZpZXdzTG9hZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gZmFsc2U7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdQZW5kaW5nVmlld0NvdW50ZXInLCAoJHJvb3RTY29wZSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFBlbmRpbmdWaWV3Q291bnRlcigkcm9vdFNjb3BlKTtcbn0pO1xuXG5jbGFzcyBXYXRjaGFibGVMaXN0IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSwgbGlzdCkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcblxuICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgdGhpcy53YXRjaGVycyA9IFtdO1xuICB9XG5cbiAgZ2V0KHBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gIH1cblxuICBnZXRBbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdDtcbiAgfVxuXG4gIGdldFN1YnNldChwYXRocykge1xuICAgIHJldHVybiBfLnppcE9iamVjdChwYXRocywgXy5tYXAocGF0aHMsIHRoaXMuZ2V0LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIHNldChwYXRoLCB2YWx1ZSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyLnNldCh0aGlzLmxpc3QsIHBhdGgsIHZhbHVlKTtcbiAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB2YWx1ZSk7XG4gIH1cblxuICB1bnNldChwYXRocykge1xuICAgIGlmICghKHBhdGhzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBwYXRocyA9IFtwYXRoc107XG4gICAgfVxuXG4gICAgXyhwYXRocykuZWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy5PYmplY3RIZWxwZXIudW5zZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cblxuICB3YXRjaChwYXRocywgaGFuZGxlcikge1xuICAgIGlmICghKHBhdGhzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBwYXRocyA9IFtwYXRoc107XG4gICAgfVxuXG4gICAgXyhwYXRocykuZWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy53YXRjaGVycy5wdXNoKHRoaXMuV2F0Y2hlckZhY3RvcnkuY3JlYXRlKHBhdGgsIGhhbmRsZXIsIHRoaXMuZ2V0KHBhdGgpKSk7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVXYXRjaGVyKHdhdGNoZXIpIHtcbiAgICBpZiAodGhpcy53YXRjaGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmV3V2F0Y2hlcnMgPSBbXTtcblxuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB0aGlzV2F0Y2hlciA9PiB7XG4gICAgICBpZiAodGhpc1dhdGNoZXIuaGFuZGxlciAhPT0gd2F0Y2hlcikge1xuICAgICAgICBuZXdXYXRjaGVycy5wdXNoKHRoaXNXYXRjaGVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLndhdGNoZXJzID0gbmV3V2F0Y2hlcnM7XG4gIH1cblxuICBfbm90aWZ5V2F0Y2hlcnMoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHdhdGNoZXIgPT4ge1xuICAgICAgaWYgKHdhdGNoZXIuc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoZWRQYXRoID0gdGhpcy5PYmplY3RIZWxwZXIuZ2V0KHRoaXMubGlzdCwgd2F0Y2hlci53YXRjaFBhdGgpO1xuICAgICAgICB3YXRjaGVyLm5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWVBdFdhdGNoZWRQYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGFibGVMaXN0RmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG4gIH1cblxuICBjcmVhdGUobGlzdCA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0KHRoaXMuT2JqZWN0SGVscGVyLCB0aGlzLldhdGNoZXJGYWN0b3J5LCBsaXN0KTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoYWJsZUxpc3RGYWN0b3J5JywgKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBXYXRjaGFibGVMaXN0RmFjdG9yeShPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KTtcbn0pO1xuXG5jbGFzcyBXYXRjaGVyIHtcbiAgY29uc3RydWN0b3Iod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLndhdGNoUGF0aCA9IHdhdGNoUGF0aDtcbiAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAoaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIF90b2tlbml6ZVBhdGgocGF0aCkge1xuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJyk7XG4gIH1cblxuICBzaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgLy8gTkIgc2hvcnQgY2lyY3VpdCBsb2dpYyBpbiB0aGUgc2ltcGxlIGNhc2VcbiAgICBpZiAodGhpcy53YXRjaFBhdGggPT09IGNoYW5nZWRQYXRoKSB7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHRoaXMuY3VycmVudFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2F0Y2ggPSB7XG4gICAgICBwYXRoOiB0aGlzLndhdGNoUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKHRoaXMud2F0Y2hQYXRoKSxcbiAgICAgIHZhbHVlOiB0aGlzLmN1cnJlbnRWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBjaGFuZ2UgPSB7XG4gICAgICBwYXRoOiBjaGFuZ2VkUGF0aCxcbiAgICAgIHRva2VuczogdGhpcy5fdG9rZW5pemVQYXRoKGNoYW5nZWRQYXRoKSxcbiAgICAgIHZhbHVlOiBuZXdWYWx1ZVxuICAgIH07XG5cbiAgICBjb25zdCBtaW5pbXVtTGVudGggPSBNYXRoLm1pbihjaGFuZ2UudG9rZW5zLmxlbmd0aCwgd2F0Y2gudG9rZW5zLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgdG9rZW5JbmRleCA9IDA7IHRva2VuSW5kZXggPCBtaW5pbXVtTGVudGg7IHRva2VuSW5kZXgrKykge1xuICAgICAgaWYgKHdhdGNoLnRva2Vuc1t0b2tlbkluZGV4XSAhPT0gY2hhbmdlLnRva2Vuc1t0b2tlbkluZGV4XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTkIgaWYgd2UgZ2V0IGhlcmUgdGhlbiBhbGwgY29tbW9uIHRva2VucyBtYXRjaFxuXG4gICAgY29uc3QgY2hhbmdlUGF0aElzRGVzY2VuZGFudCA9IGNoYW5nZS50b2tlbnMubGVuZ3RoID4gd2F0Y2gudG9rZW5zLmxlbmd0aDtcblxuICAgIGlmIChjaGFuZ2VQYXRoSXNEZXNjZW5kYW50KSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBjaGFuZ2UudG9rZW5zLnNsaWNlKHdhdGNoLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGggPSBfLmdldCh3YXRjaC52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMoY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCwgY2hhbmdlLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gd2F0Y2gudG9rZW5zLnNsaWNlKGNoYW5nZS50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hQYXRoID0gXy5nZXQoY2hhbmdlLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh3YXRjaC52YWx1ZSwgbmV3VmFsdWVBdFdhdGNoUGF0aCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIHRoaXMuaGFuZGxlcihjaGFuZ2VkUGF0aCwgbmV3VmFsdWUsIHRoaXMuY3VycmVudFZhbHVlKTtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKG5ld1ZhbHVlKTtcbiAgfVxufVxuXG5jbGFzcyBXYXRjaGVyRmFjdG9yeSB7XG4gIGNyZWF0ZSh3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hlcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGVyRmFjdG9yeScsICgpID0+IHtcbiAgcmV0dXJuIG5ldyBXYXRjaGVyRmFjdG9yeSgpO1xufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1JvdXRlJywgZnVuY3Rpb24oT2JqZWN0SGVscGVyKSB7XG4gIFwibmdJbmplY3RcIjtcbiAgY29uc3QgdG9rZW5zID0ge307XG4gIGNvbnN0IHVybFdyaXRlcnMgPSBbXTtcbiAgY29uc3QgdXJscyA9IFtdO1xuICBjb25zdCBwZXJzaXN0ZW50U3RhdGVzID0gW107XG4gIGNvbnN0IHJlYWR5ID0gZmFsc2U7XG4gIGNvbnN0IHR5cGVzID0ge307XG4gIGxldCBodG1sNU1vZGUgPSBmYWxzZTtcblxuICBjb25zdCBwcm92aWRlciA9IHtcblxuICAgIHJlZ2lzdGVyVHlwZShuYW1lLCBjb25maWcpIHtcbiAgICAgIHR5cGVzW25hbWVdID0gY29uZmlnO1xuICAgICAgdHlwZXNbbmFtZV0ucmVnZXggPSBuZXcgUmVnRXhwKHR5cGVzW25hbWVdLnJlZ2V4LnNvdXJjZSwgJ2knKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclR5cGUgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsVG9rZW4obmFtZSwgY29uZmlnKSB7XG4gICAgICB0b2tlbnNbbmFtZV0gPSBfLmV4dGVuZCh7bmFtZX0sIGNvbmZpZyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxUb2tlbiB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxXcml0ZXIobmFtZSwgZm4pIHtcbiAgICAgIHVybFdyaXRlcnNbbmFtZV0gPSBmbjtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFdyaXRlciB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmwocGF0dGVybiwgY29uZmlnID0ge30pIHtcbiAgICAgIGNvbnN0IHVybERhdGEgPSB7XG4gICAgICAgIGNvbXBpbGVkVXJsOiB0aGlzLl9jb21waWxlVXJsUGF0dGVybihwYXR0ZXJuLCBjb25maWcpLFxuICAgICAgICBwYXR0ZXJuXG4gICAgICB9O1xuXG4gICAgICB1cmxzLnB1c2goXy5leHRlbmQodXJsRGF0YSwgY29uZmlnKSk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmwgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHNldFBlcnNpc3RlbnRTdGF0ZXMoLi4uc3RhdGVMaXN0KSB7XG4gICAgICBfLmZvckVhY2goc3RhdGVMaXN0LCAoc3RhdGUpID0+IHtcbiAgICAgICAgaWYgKCFwZXJzaXN0ZW50U3RhdGVzLmluY2x1ZGVzKHN0YXRlKSkge1xuICAgICAgICAgIHBlcnNpc3RlbnRTdGF0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRIdG1sNU1vZGUobW9kZSkge1xuICAgICAgaHRtbDVNb2RlID0gbW9kZTtcbiAgICB9LFxuXG4gICAgX2NvbXBpbGVVcmxQYXR0ZXJuKHVybFBhdHRlcm4sIGNvbmZpZykge1xuICAgICAgbGV0IG1hdGNoO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnModXJsUGF0dGVybik7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHVybFBhdHRlcm4pO1xuXG4gICAgICBjb25zdCB0b2tlblJlZ2V4ID0gL1xceyhbQS1aYS16XFwuXzAtOV0rKVxcfS9nO1xuICAgICAgbGV0IHVybFJlZ2V4ID0gdXJsUGF0dGVybjtcblxuICAgICAgaWYgKCFjb25maWcucGFydGlhbE1hdGNoKSB7XG4gICAgICAgIHVybFJlZ2V4ID0gYF4ke3VybFJlZ2V4fSRgO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b2tlbkxpc3QgPSBbXTtcblxuICAgICAgd2hpbGUgKChtYXRjaCA9IHRva2VuUmVnZXguZXhlYyh1cmxQYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbbWF0Y2hbMV1dO1xuICAgICAgICB0b2tlbkxpc3QucHVzaCh0b2tlbik7XG4gICAgICAgIHVybFJlZ2V4ID0gdXJsUmVnZXgucmVwbGFjZShtYXRjaFswXSwgYCgke3R5cGVzW3Rva2VuLnR5cGVdLnJlZ2V4LnNvdXJjZX0pYCk7XG4gICAgICB9XG5cbiAgICAgIHVybFJlZ2V4LnJlcGxhY2UoJy4nLCAnXFxcXC4nKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAodXJsUmVnZXgsICdpJyksXG4gICAgICAgIHRva2VuczogdG9rZW5MaXN0XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBfZW5zdXJlT3B0aW9uYWxUcmFpbGluZ1NsYXNoKHN0cikge1xuICAgICAgaWYgKHN0ci5tYXRjaCgvXFwvJC8pKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwvJC8sICcvPycpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGAke3N0cn0vP2A7XG4gICAgfSxcblxuICAgIF9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFwoXFwpXFwqXFwrXFw/XFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gICAgfSxcblxuICAgICRnZXQoJGxvY2F0aW9uLCAkaW5qZWN0b3IsICRxKSB7XG4gICAgICAnbmdJbmplY3QnO1xuXG4gICAgICAvLyBXaGVuIGdldHRpbmcgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHNlcnZpY2UgKG9ubHkgZG9uZSBvbmNlKSwgd2UgbmVlZCB0byBpdGVyYXRlIG92ZXIgdGhlIHVybFdyaXRlcnMgYW5kIHR1cm5cbiAgICAgIC8vIHRoZW0gaW50byBtZXRob2RzIHRoYXQgaW52b2tlIHRoZSBSRUFMIHVybFdyaXRlciwgYnV0IHByb3ZpZGluZyBkZXBlbmRlbmN5IGluamVjdGlvbiB0byBpdCwgd2hpbGUgYWxzb1xuICAgICAgLy8gZ2l2aW5nIGl0IHRoZSBkYXRhIHRoYXQgdGhlIGNhbGxlZSBwYXNzZXMgaW4uXG5cbiAgICAgIC8vIFRoZSByZWFzb24gd2UgaGF2ZSB0byBkbyB0aGlzIGhlcmUgaXMgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGUgJGluamVjdG9yIGJhY2sgaW4gdGhlIHJvdXRlUHJvdmlkZXIuXG5cbiAgICAgIF8uZm9ySW4odXJsV3JpdGVycywgKHdyaXRlciwgd3JpdGVyTmFtZSkgPT5cbiAgICAgICAgdXJsV3JpdGVyc1t3cml0ZXJOYW1lXSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBpZiAoIWRhdGEpIHsgZGF0YSA9IHt9OyB9XG4gICAgICAgICAgY29uc3QgbG9jYWxzID0ge1VybERhdGE6IGRhdGF9O1xuICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKHdyaXRlciwge30sIGxvY2Fscyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGxldCBmbGFzaFN0YXRlcyA9IFtdO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0ge1xuICAgICAgICBjdXJyZW50QmluZGluZ3M6IHt9LFxuICAgICAgICByZWFkeURlZmVycmVkOiAkcS5kZWZlcigpLFxuXG4gICAgICAgIG1hdGNoKHVybFRvTWF0Y2gpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHVybCBvZiBBcnJheS5mcm9tKHVybHMpKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gdXJsLmNvbXBpbGVkVXJsLnJlZ2V4LmV4ZWModXJsVG9NYXRjaCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7dXJsLCByZWdleE1hdGNoOiBtYXRjaH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REYXRhKG1hdGNoLCBzZWFyY2hEYXRhID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB0aGlzLmV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCk7XG4gICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuZXh0cmFjdFBhdGhEYXRhKG1hdGNoKTtcbiAgICAgICAgICBzZWFyY2hEYXRhID0gdGhpcy5leHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKTtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0SGVscGVyLmRlZmF1bHQoc2VhcmNoRGF0YSwgcGF0aCwgZGVmYXVsdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpIHtcbiAgICAgICAgICBpZiAoIXNlYXJjaERhdGEpIHsgc2VhcmNoRGF0YSA9ICRsb2NhdGlvbi5zZWFyY2goKTsgfVxuICAgICAgICAgIGNvbnN0IGRhdGEgPSBfLmNsb25lKHNlYXJjaERhdGEpO1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChkYXRhLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhcmdldEtleSA9IF8uZmluZEtleSh0b2tlbnMsIHsgc2VhcmNoQWxpYXM6IGtleSB9KTtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0S2V5KSB7IHRhcmdldEtleSA9IGtleTsgfVxuXG4gICAgICAgICAgICBjb25zdCB0b2tlblR5cGVOYW1lID0gdG9rZW5zW3RhcmdldEtleV0gPyBfLmdldCh0b2tlbnNbdGFyZ2V0S2V5XSwgJ3R5cGUnKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICghdG9rZW5zW3RhcmdldEtleV0gfHwgKHR5cGVzW3Rva2VuVHlwZU5hbWVdLnJlZ2V4LnRlc3QodmFsdWUpKSkge1xuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0udHlwZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdHlwZVRva2VuVHlwZSA9IHRva2VuVHlwZSA/IHR5cGVzW3Rva2VuVHlwZV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZVBhcnNlZCA9IHR5cGVUb2tlblR5cGUgPyB0eXBlVG9rZW5UeXBlLnBhcnNlciA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICBpZiAodG9rZW5UeXBlUGFyc2VkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHRva2VuVHlwZVBhcnNlZCwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnN0YXRlUGF0aCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgZGF0YUtleSA9IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoIHx8IHRhcmdldEtleTtcblxuICAgICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KG5ld0RhdGEsIGRhdGFLZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBuZXdEYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3REZWZhdWx0RGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgICAgICAgIF8uZm9yRWFjaChtYXRjaC51cmwuc3RhdGUsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsIGtleSwgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyBfLmNsb25lRGVlcCh2YWx1ZSkgOiB2YWx1ZSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFBhdGhEYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICAgIGNvbnN0IHBhdGhUb2tlbnMgPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zO1xuXG4gICAgICAgICAgaWYgKHBhdGhUb2tlbnMubGVuZ3RoID09PSAwKSB7IHJldHVybiB7fTsgfVxuXG4gICAgICAgICAgZm9yIChsZXQgbiA9IDAsIGVuZCA9IHBhdGhUb2tlbnMubGVuZ3RoLTEsIGFzYyA9IDAgPD0gZW5kOyBhc2MgPyBuIDw9IGVuZCA6IG4gPj0gZW5kOyBhc2MgPyBuKysgOiBuLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2Vuc1tuXTtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG1hdGNoLnJlZ2V4TWF0Y2hbbisxXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlcikgeyB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7IH1cblxuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCAodG9rZW4uc3RhdGVQYXRoIHx8IHRva2VuLm5hbWUpLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVycygpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVycztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXIobmFtZSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXShkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnbyhuYW1lLCBkYXRhID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gJGxvY2F0aW9uLnVybCh0aGlzLmludm9rZVVybFdyaXRlcihuYW1lLCBkYXRhKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGVyc2lzdGVudFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gcGVyc2lzdGVudFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkRmxhc2hTdGF0ZXMoLi4ubmV3U3RhdGVzKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBmbGFzaFN0YXRlcy5jb25jYXQobmV3U3RhdGVzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICByZXR1cm4gZmxhc2hTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUsIGJpbmRpbmcpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV0gPSBiaW5kaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZSh2aWV3TmFtZSwgYmluZGluZ05hbWVFeHByZXNzaW9uKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudEJpbmRpbmcgPSB0aGlzLmdldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKTtcblxuICAgICAgICAgIGlmICghY3VycmVudEJpbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gYmluZGluZ05hbWVFeHByZXNzaW9uIGluc3RhbmNlb2YgUmVnRXhwID9cbiAgICAgICAgICAgIGJpbmRpbmdOYW1lRXhwcmVzc2lvbi50ZXN0KGN1cnJlbnRCaW5kaW5nLm5hbWUpIDpcbiAgICAgICAgICAgIGN1cnJlbnRCaW5kaW5nLm5hbWUgPT09IGJpbmRpbmdOYW1lRXhwcmVzc2lvbjtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZWFkeShyZWFkeSkge1xuICAgICAgICAgIGlmICghcmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1JlYWR5KCkge1xuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0h0bWw1TW9kZUVuYWJsZWQoKSB7XG4gICAgICAgICAgcmV0dXJuIGh0bWw1TW9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICB3aGVuUmVhZHkoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHlEZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdudW1lcmljJywge3JlZ2V4OiAvXFxkKy8sIHBhcnNlcjogWyd0b2tlbicsIHRva2VuID0+IHBhcnNlSW50KHRva2VuKV19KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbHBoYScsIHtyZWdleDogL1thLXpBLVpdKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbnknLCB7cmVnZXg6IC8uKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdsaXN0Jywge3JlZ2V4OiAvLisvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiB0b2tlbi5zcGxpdCgnLCcpXX0pO1xuXG4gIHJldHVybiBwcm92aWRlcjtcbn0pO1xuXG5jbGFzcyBTdGF0ZVByb3ZpZGVyIHtcbiAgJGdldChXYXRjaGFibGVMaXN0RmFjdG9yeSkge1xuICAgICduZ0luamVjdCc7XG4gICAgcmV0dXJuIFdhdGNoYWJsZUxpc3RGYWN0b3J5LmNyZWF0ZSgpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1N0YXRlJywgbmV3IFN0YXRlUHJvdmlkZXIpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdWaWV3QmluZGluZ3MnLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHZpZXdzID0gW107XG5cbiAgY2xhc3MgVmlldyB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgYmluZGluZ3MpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XG4gICAgICBpZiAoISh0aGlzLmJpbmRpbmdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBbdGhpcy5iaW5kaW5nc107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QmluZGluZ3MoKSB7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuXG4gICAgYmluZChuYW1lLCBjb25maWcpIHtcblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKGJpbmRpbmdzLCBjb21tb25SZXF1aXJlZFN0YXRlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoIShiaW5kaW5nLnJlcXVpcmVkU3RhdGUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IFtiaW5kaW5nLnJlcXVpcmVkU3RhdGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUuY29uY2F0KGNvbW1vblJlcXVpcmVkU3RhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vblJlc29sdmUoYmluZGluZ3MsIGNvbW1vblJlc29sdmUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGlmICghKCdyZXNvbHZlJyBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgYmluZGluZy5yZXNvbHZlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKF8uZGVmYXVsdHMoYmluZGluZy5yZXNvbHZlLCBjb21tb25SZXNvbHZlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgYmFzaWNDb21tb25GaWVsZHMgPSBbXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdUZW1wbGF0ZVVybCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JUZW1wbGF0ZVVybCd9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCBjb21tb25GaWVsZCBvZiBBcnJheS5mcm9tKGJhc2ljQ29tbW9uRmllbGRzKSkge1xuICAgICAgICAgIGlmIChjb21tb25GaWVsZC5uYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgZGVmYXVsdEJpbmRpbmdGaWVsZChuZXdCaW5kaW5ncywgY29tbW9uRmllbGQub3ZlcnJpZGVGaWVsZCwgY29uZmlnW2NvbW1vbkZpZWxkLm5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlcXVpcmVkU3RhdGUnIGluIGNvbmZpZykge1xuICAgICAgICAgIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXF1aXJlZFN0YXRlJ10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXNvbHZlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb21tb25SZXNvbHZlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlc29sdmUnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdEJpbmRpbmdGaWVsZChiaW5kaW5ncywgZmllbGROYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgIGlmICghKGZpZWxkTmFtZSBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgaXRlbSA9IGJpbmRpbmdbZmllbGROYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
