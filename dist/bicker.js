(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

routeViewFactory.$inject = ["$log", "$compile", "$controller", "ViewBindings", "$q", "State", "$rootScope", "$animate", "$timeout", "$injector", "PendingViewCounter", "PermissionDeniedError", "$templateRequest", "Route"];
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

angular.module('bicker_router').constant('PermissionDeniedError', Symbol('PermissionDeniedError'));

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

function routeViewFactory($log, $compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, PermissionDeniedError, $templateRequest, Route) {
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
        $log.log('Available bindings');
        $log.log(bindings);
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

        var resolveIsPermitted = function resolveIsPermitted(binding) {
          if (binding.isPermitted) {
            return $injector.invoke(binding.isPermitted) ? $q.resolve(true) : $q.reject(PermissionDeniedError);
          }

          return $q.resolve(true);
        };

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
        var promises = {
          template: $templateRequest(component.templateUrl),
          dependencies: resolve(binding),
          isPermitted: resolveIsPermitted(binding)
        };
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
        $log.log(error === PermissionDeniedError);
        if (error === PermissionDeniedError && binding.resolvingPermissionDeniedTemplateUrl) {
          return showBasicTemplate(element, binding, 'resolvingPermissionDeniedTemplateUrl');
        } else if (error === PermissionDeniedError && binding.resolvingPermissionDeniedComponent) {
          return showErrorComponent(error, element, binding, 'resolvingPermissionDeniedComponent');
        } else if (binding.resolvingErrorTemplateUrl) {
          return showBasicTemplate(element, binding, 'resolvingErrorTemplateUrl');
        } else if (binding.resolvingErrorComponent) {
          return showErrorComponent(error, element, binding, 'resolvingErrorComponent');
        }
      }

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
        var basicCommonFields = [{ name: 'commonResolvingTemplateUrl', overrideField: 'resolvingTemplateUrl' }, { name: 'commonResolvingPermissionDeniedTemplateUrl', overrideField: 'resolvingPermissionDeniedTemplateUrl' }, { name: 'commonResolvingPermissionDeniedComponent', overrideField: 'resolvingPermissionDeniedComponent' }, { name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl' }, { name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent' }, { name: 'commonErrorComponent', overrideField: 'errorComponent' }, { name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl' }];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxRQUFBLE1BQUEsQ0FBQSxlQUFBLEVBQWdDLENBQWhDLFdBQWdDLENBQWhDLEVBQUEsR0FBQSxxRkFBbUQsVUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsWUFBQSxFQUFBLGtCQUFBLEVBQWlGO0FBQ2xJOztBQUVBLE1BQUksU0FBSixTQUFBO0FBQ0EsYUFBQSxHQUFBLENBQUEsc0JBQUEsRUFBdUMsWUFBWTtBQUNqRCxRQUFJLE1BQUosT0FBSSxFQUFKLEVBQXFCO0FBQ25CLFlBQUEsUUFBQSxDQUFBLEtBQUE7QUFDRDtBQUhILEdBQUE7O0FBTUEsYUFBQSxHQUFBLENBQUEsd0JBQUEsRUFBeUMsVUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFxQjtBQUM1RDtBQUNBLFFBQUksT0FBQSxLQUFKLENBQUE7QUFDQSxRQUFJLFdBQUosTUFBQSxFQUF1QjtBQUNyQjtBQUNEOztBQUVELGFBQUEsTUFBQTs7QUFFQSx1QkFBQSxLQUFBO0FBQ0EsUUFBTSxRQUFRLE1BQUEsS0FBQSxDQUFZLFVBQTFCLElBQTBCLEVBQVosQ0FBZDs7QUFFQSxRQUFJLENBQUosS0FBQSxFQUFZO0FBQ1YsYUFBQSxFQUFBO0FBREYsS0FBQSxNQUVPO0FBQ0wsYUFBTyxNQUFBLFdBQUEsQ0FBUCxLQUFPLENBQVA7QUFDRDs7QUFFRCxRQUFJLGdCQUFnQixhQUFBLEtBQUEsQ0FBbUIsTUFBbkIsSUFBQSxFQUFwQixJQUFvQixDQUFwQjtBQUNBLG9CQUFnQixFQUFBLFVBQUEsQ0FBQSxhQUFBLEVBQTRCLE1BQUEsbUJBQUEsR0FBQSxNQUFBLENBQW1DLE1BQS9FLGNBQStFLEVBQW5DLENBQTVCLENBQWhCOztBQUVBLFFBQU0sWUFB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S0FBQTtBQUFBLFVBQUEsU0FBQSxJQUFBLEdBK0VFO0FBQ0wsYUFBTztBQUFBLGlCQUFBLFNBQUEsT0FBQSxDQUFBLElBQUEsRUFDUztBQUNaLGlCQUFPLE1BQVAsSUFBTyxDQUFQO0FBQ0Q7QUFISSxPQUFQO0FBS0Q7QUFyRkksR0FBUDtBQWpCRixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInLCBbJ25nQW5pbWF0ZSddKS5ydW4oZnVuY3Rpb24gKFN0YXRlLCBSb3V0ZSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCBPYmplY3RIZWxwZXIsIFBlbmRpbmdWaWV3Q291bnRlcikge1xuICBcIm5nSW5qZWN0XCI7XG5cbiAgbGV0IG9sZFVybCA9IHVuZGVmaW5lZDtcbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChSb3V0ZS5pc1JlYWR5KCkpIHtcbiAgICAgIFJvdXRlLnNldFJlYWR5KGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKGUsIG5ld1VybCkge1xuICAgIC8vIFdvcmstYXJvdW5kIGZvciBBbmd1bGFySlMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9pc3N1ZXMvODM2OFxuICAgIGxldCBkYXRhO1xuICAgIGlmIChuZXdVcmwgPT09IG9sZFVybCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9sZFVybCA9IG5ld1VybDtcblxuICAgIFBlbmRpbmdWaWV3Q291bnRlci5yZXNldCgpO1xuICAgIGNvbnN0IG1hdGNoID0gUm91dGUubWF0Y2goJGxvY2F0aW9uLnBhdGgoKSk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBSb3V0ZS5leHRyYWN0RGF0YShtYXRjaCk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkc1RvVW5zZXQgPSBPYmplY3RIZWxwZXIubm90SW4oU3RhdGUubGlzdCwgZGF0YSk7XG4gICAgZmllbGRzVG9VbnNldCA9IF8uZGlmZmVyZW5jZShmaWVsZHNUb1Vuc2V0LCBSb3V0ZS5nZXRQZXJzaXN0ZW50U3RhdGVzKCkuY29uY2F0KFJvdXRlLmdldEZsYXNoU3RhdGVzKCkpKTtcblxuICAgIGNvbnN0IGV2ZW50RGF0YSA9IHt1bnNldHRpbmc6IGZpZWxkc1RvVW5zZXQsIHNldHRpbmc6IGRhdGF9O1xuICAgICRyb290U2NvcGUuJGVtaXQoJ2JpY2tlcl9yb3V0ZXIuYmVmb3JlU3RhdGVDaGFuZ2UnLCBldmVudERhdGEpO1xuXG4gICAgaWYgKChldmVudERhdGEudW5zZXR0aW5nKS5sZW5ndGggIT09IDApIHtcbiAgICAgIFN0YXRlLnVuc2V0KGV2ZW50RGF0YS51bnNldHRpbmcpO1xuICAgIH1cblxuICAgIF8uZm9yRWFjaChldmVudERhdGEuc2V0dGluZywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIFJvdXRlLnJlc2V0Rmxhc2hTdGF0ZXMoKTtcbiAgICBSb3V0ZS5zZXRSZWFkeSh0cnVlKTtcbiAgfSk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5jb25zdGFudCgnT2JqZWN0SGVscGVyJywge1xuICBnZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XTtcbiAgfSxcblxuICBzZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIGlmIChwYXJlbnRbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJlbnRbc2VnbWVudF0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XSA9IHZhbHVlO1xuICB9LFxuXG4gIHVuc2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cblxuICAgIGlmIChwYXJlbnRba2V5XSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGRlbGV0ZSBwYXJlbnRba2V5XTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICAvLyBSZWN1cnNpdmVseSByZXR1cm4gdGhlIHByb3BlcnRpZXMgaW4gYSB0aGF0IGFyZW4ndCBpbiBiXG4gIG5vdEluKGEsIGIsIHByZWZpeCA9ICcnKSB7XG4gICAgbGV0IG5vdEluID0gW107XG4gICAgcHJlZml4ID0gcHJlZml4Lmxlbmd0aCA+IDAgPyBgJHtwcmVmaXh9LmAgOiAnJztcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIEFycmF5LmZyb20oT2JqZWN0LmtleXMoYSkpKSB7XG4gICAgICBjb25zdCB0aGlzUGF0aCA9IGAke3ByZWZpeH0ke2tleX1gO1xuXG4gICAgICBpZiAoYltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm90SW4ucHVzaCh0aGlzUGF0aCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBhW2tleV0gPT09ICdvYmplY3QnKSAmJiAoIShhW2tleV0gaW5zdGFuY2VvZiBBcnJheSkpKSB7XG4gICAgICAgIG5vdEluID0gbm90SW4uY29uY2F0KHRoaXMubm90SW4oYVtrZXldLCBiW2tleV0sIHRoaXNQYXRoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdEluO1xuICB9LFxuXG4gIGRlZmF1bHQob3ZlcnJpZGVzLCAuLi5kZWZhdWx0U2V0cykge1xuICAgIGxldCBkZWZhdWx0U2V0LCB2YWx1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgIGlmIChkZWZhdWx0U2V0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGRlZmF1bHRTZXQgPSBkZWZhdWx0U2V0c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFNldCA9IHRoaXMuZGVmYXVsdCguLi5BcnJheS5mcm9tKGRlZmF1bHRTZXRzIHx8IFtdKSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGVmYXVsdFNldCkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0U2V0W2tleV07XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIG92ZXJyaWRlc1trZXldID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMuZGVmYXVsdChvdmVycmlkZXNba2V5XSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvdmVycmlkZXMpIHtcbiAgICAgIHZhbHVlID0gb3ZlcnJpZGVzW2tleV07XG4gICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldIHx8IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuXG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuY29uc3RhbnQoJ1Blcm1pc3Npb25EZW5pZWRFcnJvcicsIFN5bWJvbCgnUGVybWlzc2lvbkRlbmllZEVycm9yJykpO1xuXG4vLyBVc2FnZTpcbi8vXG4vLyBJZiB5b3Ugd2FudCB0byBhZGQgdGhlIGNsYXNzIFwiYWN0aXZlXCIgdG8gYW4gYW5jaG9yIGVsZW1lbnQgd2hlbiB0aGUgXCJtYWluXCIgdmlldyBoYXMgYSBiaW5kaW5nXG4vLyB3aXRoIHRoZSBuYW1lIFwibXlCaW5kaW5nXCIgcmVuZGVyZWQgd2l0aGluIGl0XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCJ7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAnbXlCaW5kaW5nJyB9XCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuLy8gWW91IGNhbiBhbHNvIHVzZSByZWd1bGFyIGV4cHJlc3Npb25zIGZvciB0aGUgYmluZGluZyBuYW1lLCBidXQgdG8gZG8gc28geW91IGhhdmUgdG8gcHJvdmlkZSBhIG1ldGhvZFxuLy8gb24geW91ciBjb250cm9sbGVyIHdoaWNoIHJldHVybnMgdGhlIHJvdXRlIGNsYXNzIGRlZmluaXRpb24gb2JqZWN0LCBiZWNhdXNlIEFuZ3VsYXJKUyBleHByZXNzaW9uc1xuLy8gZG9uJ3Qgc3VwcG9ydCBpbmxpbmUgcmVndWxhciBleHByZXNzaW9uc1xuLy9cbi8vIGNsYXNzIE15Q29udHJvbGxlciB7XG4vLyAgZ2V0Um91dGVDbGFzc09iamVjdCgpIHtcbi8vICAgIHJldHVybiB7IGNsYXNzTmFtZTogJ2FjdGl2ZScsIHZpZXdOYW1lOiAnbWFpbicsIGJpbmRpbmdOYW1lOiAvbXlCaW5kLyB9XG4vLyAgfVxuLy8gfVxuLy9cbi8vIDxhIHJvdXRlLWNsYXNzPVwiJGN0cmwuZ2V0Um91dGVDbGFzc09iamVjdCgpXCI+QW5jaG9yIHRleHQ8L2E+XG4vL1xuXG5mdW5jdGlvbiByb3V0ZUNsYXNzRmFjdG9yeShSb3V0ZSkge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIHNjb3BlLiR3YXRjaCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvdXRlQ2xhc3NEZWZpbml0aW9uID0gc2NvcGUuJGV2YWwoaUF0dHJzWydyb3V0ZUNsYXNzJ10pO1xuXG4gICAgICAgIGlmICghUm91dGUubWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZShyb3V0ZUNsYXNzRGVmaW5pdGlvbi52aWV3TmFtZSwgcm91dGVDbGFzc0RlZmluaXRpb24uYmluZGluZ05hbWUpKSB7XG4gICAgICAgICAgaWYgKGlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgaUVsZW1lbnQuYWRkQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVDbGFzcycsIHJvdXRlQ2xhc3NGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVIcmVmRmFjdG9yeSAoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0JztcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgc2NvcGU6IHRydWUsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIGlmIChpQXR0cnMuaWdub3JlSHJlZiA9PT0gdW5kZWZpbmVkICYmIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgIGlFbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgY29uc3QgdXJsUGF0aCA9IGlFbGVtZW50LmF0dHIoJ2hyZWYnKS5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmxQYXRoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvYmplY3QgPSBSb3V0ZS5nZXRVcmxXcml0ZXJzKCk7XG4gICAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IHdyaXRlciA9IG9iamVjdFt3cml0ZXJOYW1lXTtcbiAgICAgICAgc2NvcGVbYCR7d3JpdGVyTmFtZX1VcmxXcml0ZXJgXSA9IHdyaXRlcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNjb3BlLiR3YXRjaChpQXR0cnMucm91dGVIcmVmLCAobmV3VXJsKSA9PiB7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmIChSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICAgIHVybCA9IG5ld1VybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmwgPSBgIyR7bmV3VXJsfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlFbGVtZW50LmF0dHIoJ2hyZWYnLCB1cmwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVIcmVmJywgcm91dGVIcmVmRmFjdG9yeSk7XG5cbmZ1bmN0aW9uIHJvdXRlT25DbGlja0ZhY3RvcnkgKFJvdXRlLCAkbG9jYXRpb24sICR3aW5kb3csICR0aW1lb3V0KSB7XG4gICduZ0luamVjdCc7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuXG4gICAgbGluayAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBjb25zdCBMRUZUX0JVVFRPTiA9IDA7XG4gICAgICBjb25zdCBNSURETEVfQlVUVE9OID0gMTtcblxuICAgICAgaWYgKGVsZW1lbnQuaXMoJ2EnKSkge1xuICAgICAgICBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT09IExFRlRfQlVUVE9OKSB7XG4gICAgICAgICAgICBuYXZpZ2F0ZVRvVXJsKGdldFVybCgpLCBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50Lm1vdXNldXAoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gTUlERExFX0JVVFRPTikge1xuICAgICAgICAgICAgbmF2aWdhdGVUb1VybChnZXRVcmwoKSwgc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG5hdmlnYXRlVG9VcmwoX3VybCwgbmV3V2luZG93ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHVybCA9IF91cmw7XG5cbiAgICAgICAgaWYgKG5ld1dpbmRvdykge1xuICAgICAgICAgIHVybCA9IGAkeyR3aW5kb3cubG9jYXRpb24ub3JpZ2lufS8ke3VybH1gO1xuICAgICAgICAgICR3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIVJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXiMvLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgICR0aW1lb3V0KCgpID0+ICRsb2NhdGlvbi51cmwodXJsKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvdWxkT3Blbk5ld1dpbmRvdyhldmVudCkge1xuICAgICAgICByZXR1cm4gZXZlbnQuYnV0dG9uID09PSBNSURETEVfQlVUVE9OIHx8IChldmVudC5idXR0b24gPT09IExFRlRfQlVUVE9OICYmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0VXJsKCkge1xuICAgICAgICBjb25zdCB1cmxXcml0ZXJzID0gUm91dGUuZ2V0VXJsV3JpdGVycygpO1xuICAgICAgICBjb25zdCBsb2NhbHMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IHdyaXRlck5hbWUgaW4gdXJsV3JpdGVycykge1xuICAgICAgICAgIGxvY2Fsc1tgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gdXJsV3JpdGVyc1t3cml0ZXJOYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHNjb3BlLiRldmFsKGF0dHJzLnJvdXRlT25DbGljaywgXy5hc3NpZ24obG9jYWxzLCBzY29wZSkpO1xuXG4gICAgICAgIHJldHVybiBodG1sNVRoZVVybCh1cmwpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBodG1sNVRoZVVybCh1cmwpIHtcbiAgICAgICAgcmV0dXJuIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpID8gdXJsIDogYCMke3VybH1gO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gYCR7Z2V0VXJsKCl9YDtcbiAgICAgICAgfSwgKG5ld1VybCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuYXR0cignaHJlZicsIG5ld1VybCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlT25DbGljaycsIHJvdXRlT25DbGlja0ZhY3RvcnkpO1xuXG4vLyBAVE9ETyBub25lIG9mIHRoZSBhbmltYXRpb24gY29kZSBpbiB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiB0ZXN0ZWQuIE5vdCBzdXJlIGlmIGl0IGNhbiBiZSBhdCB0aGlzIHN0YWdlIFRoaXMgbmVlZHMgZnVydGhlciBpbnZlc3RpZ2F0aW9uLlxuLy8gQFRPRE8gdGhpcyBjb2RlIGRvZXMgdG9vIG11Y2gsIGl0IHNob3VsZCBiZSByZWZhY3RvcmVkLlxuXG5mdW5jdGlvbiByb3V0ZVZpZXdGYWN0b3J5KCRsb2csICRjb21waWxlLCAkY29udHJvbGxlciwgVmlld0JpbmRpbmdzLCAkcSwgU3RhdGUsICRyb290U2NvcGUsICRhbmltYXRlLCAkdGltZW91dCwgJGluamVjdG9yLCBQZW5kaW5nVmlld0NvdW50ZXIsIFBlcm1pc3Npb25EZW5pZWRFcnJvciwgJHRlbXBsYXRlUmVxdWVzdCwgUm91dGUpIHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiBmYWxzZSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlOiAnPGRpdj48L2Rpdj4nLFxuICAgIGxpbmsgKHZpZXdEaXJlY3RpdmVTY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgbGV0IHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICBsZXQgdmlld1Njb3BlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHZpZXdDb250cm9sbGVyID0ge307IC8vIE5CIHdpbGwgb25seSBiZSBkZWZpbmVkIGZvciBjb21wb25lbnRzXG4gICAgICBsZXQgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG4gICAgICBjb25zdCB2aWV3ID0gVmlld0JpbmRpbmdzLmdldFZpZXcoaUF0dHJzLm5hbWUpO1xuICAgICAgY29uc3QgYmluZGluZ3MgPSB2aWV3LmdldEJpbmRpbmdzKCk7XG5cbiAgICAgIGlFbGVtZW50LmFkZENsYXNzKCduZy1oaWRlJyk7XG5cbiAgICAgIGxldCBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nID0gYmluZGluZyA9PiBfLmNsb25lRGVlcChTdGF0ZS5nZXRTdWJzZXQoZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyhiaW5kaW5nKSkpO1xuXG4gICAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nLCBmaWVsZCkge1xuICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgZmllbGQgPSAnY29tcG9uZW50JztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzb3VyY2UgPSBiaW5kaW5nW2ZpZWxkXSA/ICRpbmplY3Rvci5nZXQoYCR7YmluZGluZ1tmaWVsZF19RGlyZWN0aXZlYClbMF0gOiBiaW5kaW5nO1xuICAgICAgICByZXR1cm4gXy5kZWZhdWx0cyhfLnBpY2soc291cmNlLCBbJ2NvbnRyb2xsZXInLCAndGVtcGxhdGVVcmwnLCAnY29udHJvbGxlckFzJ10pLCB7Y29udHJvbGxlckFzOiAnJGN0cmwnfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSB7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW107XG5cbiAgICAgICAgZm9yIChsZXQgcmVxdWlyZW1lbnQgb2YgQXJyYXkuZnJvbShyZXF1aXJlZFN0YXRlKSkge1xuICAgICAgICAgIGxldCBuZWdhdGVSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoJyEnID09PSByZXF1aXJlbWVudC5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIHJlcXVpcmVtZW50ID0gcmVxdWlyZW1lbnQuc2xpY2UoMSk7XG4gICAgICAgICAgICBuZWdhdGVSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBlbGVtZW50ID0gU3RhdGUuZ2V0KHJlcXVpcmVtZW50KTtcblxuICAgICAgICAgIC8vIFJldHVybiBmYWxzZSBpZiBlbGVtZW50IGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGlmICgoZWxlbWVudCA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPbmx5IGNoZWNrIHZhbHVlIG9mIGVsZW1lbnQgaWYgaXQgaXMgZGVmaW5lZFxuICAgICAgICAgIGlmIChuZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSAhZWxlbWVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJpbmRpbmcuY2FuQWN0aXZhdGUpIHtcbiAgICAgICAgICBpZiAoISRpbmplY3Rvci5pbnZva2UoYmluZGluZy5jYW5BY3RpdmF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWFuYWdlVmlldyhlbGVtZW50LCBiaW5kaW5ncykge1xuICAgICAgICAkbG9nLmxvZygnQXZhaWxhYmxlIGJpbmRpbmdzJyk7XG4gICAgICAgICRsb2cubG9nKGJpbmRpbmdzKTtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdCaW5kaW5nID0gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKTtcblxuICAgICAgICBpZiAoIW1hdGNoaW5nQmluZGluZykge1xuICAgICAgICAgIGlmICh2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3lWaWV3KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBSb3V0ZS5kZWxldGVDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IGdldFN0YXRlRGF0YUZvckJpbmRpbmcobWF0Y2hpbmdCaW5kaW5nKTtcbiAgICAgICAgaWYgKChtYXRjaGluZ0JpbmRpbmcgPT09IHByZXZpb3VzQmluZGluZykgJiYgYW5ndWxhci5lcXVhbHMocHJldmlvdXNCb3VuZFN0YXRlLCBuZXdTdGF0ZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiaW5kaW5nQ2hhbmdlZEV2ZW50RGF0YSA9IHsgdmlld05hbWU6IGlBdHRycy5uYW1lLCBjdXJyZW50QmluZGluZzogbWF0Y2hpbmdCaW5kaW5nIH07XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5iaW5kaW5nQ2hhbmdlZCcsIGJpbmRpbmdDaGFuZ2VkRXZlbnREYXRhKTtcblxuICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSBtYXRjaGluZ0JpbmRpbmc7XG4gICAgICAgIHByZXZpb3VzQm91bmRTdGF0ZSA9IG5ld1N0YXRlO1xuXG4gICAgICAgIFBlbmRpbmdWaWV3Q291bnRlci5pbmNyZWFzZSgpO1xuXG4gICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nVGVtcGxhdGUoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChoYXNSZXNvbHZpbmdUZW1wbGF0ZSkge1xuICAgICAgICAgIC8vIEBUT0RPOiBNYWdpYyBudW1iZXJcbiAgICAgICAgICBjb25zdCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbiA9IGhhc1Jlc29sdmluZ1RlbXBsYXRlID8gMzAwIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgaWYgKCF2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuICRhbmltYXRlLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBjcmVhdGVWaWV3KGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZywgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgaWYgKHZpZXdDb250cm9sbGVyLiRvbkRlc3Ryb3kpIHsgdmlld0NvbnRyb2xsZXIuJG9uRGVzdHJveSgpOyB9XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpIHtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20oYmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVzdHJveVZpZXcoZWxlbWVudCkge1xuICAgICAgICBpZiAodmlld0NyZWF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKS5yZW1vdmUoKTtcbiAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICAgIGlmICh2aWV3Q29udHJvbGxlci4kb25EZXN0cm95KSB7IHZpZXdDb250cm9sbGVyLiRvbkRlc3Ryb3koKTsgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVWaWV3KGVsZW1lbnQsIGJpbmRpbmcsIG1pbmltdW1EZWxheSkge1xuICAgICAgICBjb25zdCB0aW1lU3RhcnRlZE1haW5WaWV3ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZyk7XG5cbiAgICAgICAgY29uc3QgcmVzb2x2ZUlzUGVybWl0dGVkID0gZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgICBpZiAoYmluZGluZy5pc1Blcm1pdHRlZCkge1xuICAgICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5pbnZva2UoYmluZGluZy5pc1Blcm1pdHRlZClcbiAgICAgICAgICAgICAgPyAkcS5yZXNvbHZlKHRydWUpXG4gICAgICAgICAgICAgIDogJHEucmVqZWN0KFBlcm1pc3Npb25EZW5pZWRFcnJvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuICRxLnJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25TdWNjZXNzZnVsUmVzb2x1dGlvbiA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgaWYgKGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncykgIT09IGJpbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2aWV3Q3JlYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICBjb25zdCByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA9IERhdGUubm93KCkgLSB0aW1lU3RhcnRlZE1haW5WaWV3O1xuXG4gICAgICAgICAgY29uc3QgaW5qZWN0TWFpblRlbXBsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2hvd0Vycm9yKGUsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgLy8gV3JhcHBlZCBpbiBhIHRpbWVvdXQgc28gdGhhdCB3ZSBjYW4gZ2l2ZSB0aGUgdmlldyB0aW1lIHRvIHByb3Blcmx5IGluaXRpYWxpc2VcbiAgICAgICAgICAgICAgLy8gYmVmb3JlIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgdGhlIGludGlhbFZpZXdzTG9hZGVkIGV2ZW50XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJpbmRpbmcubWFudWFsQ29tcGxldGlvbikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5ID0gTWF0aC5tYXgoMCwgbWluaW11bURlbGF5IC0gcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUpO1xuXG4gICAgICAgICAgaWYgKHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lIDwgbWluaW11bURlbGF5KSB7XG4gICAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoKCkgPT4gaW5qZWN0TWFpblRlbXBsYXRlKCksIG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluamVjdE1haW5UZW1wbGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblJlc29sdXRpb25GYWlsdXJlID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgICRsb2cuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIFJvdXRlLnNldEN1cnJlbnRCaW5kaW5nKHZpZXcubmFtZSwgYmluZGluZyk7XG4gICAgICAgIGNvbnN0IHByb21pc2VzID0ge1xuICAgICAgICAgIHRlbXBsYXRlOiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCksXG4gICAgICAgICAgZGVwZW5kZW5jaWVzOiByZXNvbHZlKGJpbmRpbmcpLFxuICAgICAgICAgIGlzUGVybWl0dGVkOiByZXNvbHZlSXNQZXJtaXR0ZWQoYmluZGluZylcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uLCBvblJlc29sdXRpb25GYWlsdXJlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsIHx8ICFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICByZXR1cm4gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKSgkcm9vdFNjb3BlLiRuZXcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgJGxvZy5sb2coZXJyb3IgPT09IFBlcm1pc3Npb25EZW5pZWRFcnJvcik7XG4gICAgICAgIGlmIChlcnJvciA9PT0gUGVybWlzc2lvbkRlbmllZEVycm9yICYmIGJpbmRpbmcucmVzb2x2aW5nUGVybWlzc2lvbkRlbmllZFRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdQZXJtaXNzaW9uRGVuaWVkVGVtcGxhdGVVcmwnKTtcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvciA9PT0gUGVybWlzc2lvbkRlbmllZEVycm9yICYmIGJpbmRpbmcucmVzb2x2aW5nUGVybWlzc2lvbkRlbmllZENvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVybiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdQZXJtaXNzaW9uRGVuaWVkQ29tcG9uZW50Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVybiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoYmluZGluZy5lcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLmVycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93RXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAnZXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCB0ZW1wbGF0ZUZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nW3RlbXBsYXRlRmllbGRdKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcbiAgICAgICAgICB2aWV3Q29udHJvbGxlciA9IHt9O1xuICAgICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICAgIGJpbmRpbmdDb21wb25lbnRGaWVsZCA9ICdlcnJvckNvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFiaW5kaW5nW2JpbmRpbmdDb21wb25lbnRGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHtkZXBlbmRlbmNpZXM6IHtlcnJvcn19O1xuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBhcmdzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncykge1xuICAgICAgICBjb25zdCB7ZGVwZW5kZW5jaWVzfSA9IGFyZ3M7XG4gICAgICAgIGNvbnN0IHt0ZW1wbGF0ZX0gPSBhcmdzO1xuXG4gICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuICAgICAgICB2aWV3Q29udHJvbGxlciA9IHt9O1xuXG4gICAgICAgIGlmIChjb21wb25lbnQuY29udHJvbGxlcikge1xuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IF8ubWVyZ2UoZGVwZW5kZW5jaWVzLCB7JHNjb3BlOiB2aWV3U2NvcGUsICRlbGVtZW50OiBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCl9KTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2aWV3Q29udHJvbGxlciA9ICRjb250cm9sbGVyKGNvbXBvbmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICAgICAgbG9jYWxzLiRzY29wZVtjb21wb25lbnQuY29udHJvbGxlckFzXSA9IHZpZXdDb250cm9sbGVyO1xuICAgICAgICAgICAgaWYgKHZpZXdDb250cm9sbGVyLiRvbkluaXQpIHsgdmlld0NvbnRyb2xsZXIuJG9uSW5pdCgpOyB9XG4gICAgICAgICAgfSAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KGVycm9yKSkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gJ0ZhaWxlZCB0byBzZXJpYWxpemUgZXJyb3Igb2JqZWN0IGZvciBsb2dnaW5nJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGxvZy5lcnJvcihgRmFpbGVkIGluc3RhbnRpYXRpbmcgY29udHJvbGxlciBmb3IgdmlldyAke3ZpZXd9OiAke2Vycm9yTWVzc2FnZX1gKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc29sdmUgPSBmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe30pO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVuY3lOYW1lIGluIGJpbmRpbmcucmVzb2x2ZSkge1xuICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lGYWN0b3J5ID0gYmluZGluZy5yZXNvbHZlW2RlcGVuZGVuY3lOYW1lXTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJGluamVjdG9yLmludm9rZShkZXBlbmRlbmN5RmFjdG9yeSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJHEucmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyA9IGJpbmRpbmcgPT4gXy51bmlvbihiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW10sIGJpbmRpbmcud2F0Y2hlZFN0YXRlIHx8IFtdKTtcblxuICAgICAgZnVuY3Rpb24gc3RyaXBOZWdhdGlvblByZWZpeChzdHIpIHtcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoMCkgPT09ICchJykge1xuICAgICAgICAgIHJldHVybiBzdHIuc3Vic3RyKDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyA9IHZpZXcgPT4gXy5mbGF0dGVuKF8ubWFwKHZpZXcuZ2V0QmluZGluZ3MoKSwgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZykpO1xuXG4gICAgICBjb25zdCBnZXRGaWVsZHNUb1dhdGNoID0gdmlldyA9PiBfLnVuaXEoXy5tYXAoZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyh2aWV3KSwgc3RyaXBOZWdhdGlvblByZWZpeCkpO1xuXG4gICAgICBjb25zdCBmaWVsZHMgPSBnZXRGaWVsZHNUb1dhdGNoKHZpZXcpO1xuXG4gICAgICByZXR1cm4gUm91dGUud2hlblJlYWR5KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgLy8gVHJ5IHRvIHN0YXJ0IHRoZSBiYWxsIHJvbGxpbmcgaW4gY2FzZSB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyBhbmQgd2UgY2FuIGNyZWF0ZSB0aGUgdmlldyBpbW1lZGlhdGVseVxuICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIERvbid0IGJvdGhlciBwdXR0aW5nIGluIGEgd2F0Y2hlciBpZiB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgZXZlciB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50XG4gICAgICAgIGlmIChmaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdGVXYXRjaGVyID0gZnVuY3Rpb24gKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAodmlld01hbmFnZW1lbnRQZW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBmaW5pc2ggdGhlIGRpZ2VzdCBjeWNsZSBiZWZvcmUgYnVpbGRpbmcgdGhlIHZpZXcsIHdoaWNoIHNob3VsZFxuICAgICAgICAgIC8vIHByZXZlbnQgdXMgZnJvbSByZS1yZW5kZXJpbmcgYSB2aWV3IG11bHRpcGxlIHRpbWVzIGlmIG11bHRpcGxlIHByb3BlcnRpZXMgb2YgdGhlIHNhbWUgc3RhdGUgZGVwZW5kZW5jeVxuICAgICAgICAgIC8vIGdldCBjaGFuZ2VkIHdpdGggcmVwZWF0ZWQgU3RhdGUuc2V0IGNhbGxzXG4gICAgICAgICAgcmV0dXJuICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHJldHVybiB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBTdGF0ZS53YXRjaChmaWVsZHMsIHN0YXRlV2F0Y2hlcik7XG5cbiAgICAgICAgdmlld0RpcmVjdGl2ZVNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiBTdGF0ZS5yZW1vdmVXYXRjaGVyKHN0YXRlV2F0Y2hlcikpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgndmlldycsIHJvdXRlVmlld0ZhY3RvcnkpO1xuXG5jbGFzcyBQZW5kaW5nVmlld0NvdW50ZXIge1xuICBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy4kcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50O1xuICB9XG5cbiAgaW5jcmVhc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQgKz0gMTtcbiAgfVxuXG4gIGRlY3JlYXNlKCkge1xuICAgIHRoaXMuY291bnQgPSBNYXRoLm1heCgwLCB0aGlzLmNvdW50IC0gMSk7XG4gICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgIGlmICghdGhpcy5pbml0aWFsVmlld3NMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5pbml0aWFsVmlld3NMb2FkZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmN1cnJlbnRWaWV3c0xvYWRlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnUGVuZGluZ1ZpZXdDb3VudGVyJywgKCRyb290U2NvcGUpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBQZW5kaW5nVmlld0NvdW50ZXIoJHJvb3RTY29wZSk7XG59KTtcblxuY2xhc3MgV2F0Y2hhYmxlTGlzdCB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnksIGxpc3QpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG5cbiAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgIHRoaXMud2F0Y2hlcnMgPSBbXTtcbiAgfVxuXG4gIGdldChwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHBhdGgpO1xuICB9XG5cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLmxpc3Q7XG4gIH1cblxuICBnZXRTdWJzZXQocGF0aHMpIHtcbiAgICByZXR1cm4gXy56aXBPYmplY3QocGF0aHMsIF8ubWFwKHBhdGhzLCB0aGlzLmdldC5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBzZXQocGF0aCwgdmFsdWUpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlci5zZXQodGhpcy5saXN0LCBwYXRoLCB2YWx1ZSk7XG4gICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgdW5zZXQocGF0aHMpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMuT2JqZWN0SGVscGVyLnVuc2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gICAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgd2F0Y2gocGF0aHMsIGhhbmRsZXIpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMud2F0Y2hlcnMucHVzaCh0aGlzLldhdGNoZXJGYWN0b3J5LmNyZWF0ZShwYXRoLCBoYW5kbGVyLCB0aGlzLmdldChwYXRoKSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlV2F0Y2hlcih3YXRjaGVyKSB7XG4gICAgaWYgKHRoaXMud2F0Y2hlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld1dhdGNoZXJzID0gW107XG5cbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgdGhpc1dhdGNoZXIgPT4ge1xuICAgICAgaWYgKHRoaXNXYXRjaGVyLmhhbmRsZXIgIT09IHdhdGNoZXIpIHtcbiAgICAgICAgbmV3V2F0Y2hlcnMucHVzaCh0aGlzV2F0Y2hlcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy53YXRjaGVycyA9IG5ld1dhdGNoZXJzO1xuICB9XG5cbiAgX25vdGlmeVdhdGNoZXJzKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB3YXRjaGVyID0+IHtcbiAgICAgIGlmICh3YXRjaGVyLnNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCA9IHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHdhdGNoZXIud2F0Y2hQYXRoKTtcbiAgICAgICAgd2F0Y2hlci5ub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hhYmxlTGlzdEZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuICB9XG5cbiAgY3JlYXRlKGxpc3QgPSB7fSkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdCh0aGlzLk9iamVjdEhlbHBlciwgdGhpcy5XYXRjaGVyRmFjdG9yeSwgbGlzdCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGFibGVMaXN0RmFjdG9yeScsIChPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdEZhY3RvcnkoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSk7XG59KTtcblxuY2xhc3MgV2F0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy53YXRjaFBhdGggPSB3YXRjaFBhdGg7XG4gICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKGluaXRpYWxWYWx1ZSk7XG4gIH1cblxuICBfdG9rZW5pemVQYXRoKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLicpO1xuICB9XG5cbiAgc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIC8vIE5CIHNob3J0IGNpcmN1aXQgbG9naWMgaW4gdGhlIHNpbXBsZSBjYXNlXG4gICAgaWYgKHRoaXMud2F0Y2hQYXRoID09PSBjaGFuZ2VkUGF0aCkge1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh0aGlzLmN1cnJlbnRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0IHdhdGNoID0ge1xuICAgICAgcGF0aDogdGhpcy53YXRjaFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aCh0aGlzLndhdGNoUGF0aCksXG4gICAgICB2YWx1ZTogdGhpcy5jdXJyZW50VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgY2hhbmdlID0ge1xuICAgICAgcGF0aDogY2hhbmdlZFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aChjaGFuZ2VkUGF0aCksXG4gICAgICB2YWx1ZTogbmV3VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgbWluaW11bUxlbnRoID0gTWF0aC5taW4oY2hhbmdlLnRva2Vucy5sZW5ndGgsIHdhdGNoLnRva2Vucy5sZW5ndGgpO1xuICAgIGZvciAobGV0IHRva2VuSW5kZXggPSAwOyB0b2tlbkluZGV4IDwgbWluaW11bUxlbnRoOyB0b2tlbkluZGV4KyspIHtcbiAgICAgIGlmICh3YXRjaC50b2tlbnNbdG9rZW5JbmRleF0gIT09IGNoYW5nZS50b2tlbnNbdG9rZW5JbmRleF0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5CIGlmIHdlIGdldCBoZXJlIHRoZW4gYWxsIGNvbW1vbiB0b2tlbnMgbWF0Y2hcblxuICAgIGNvbnN0IGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQgPSBjaGFuZ2UudG9rZW5zLmxlbmd0aCA+IHdhdGNoLnRva2Vucy5sZW5ndGg7XG5cbiAgICBpZiAoY2hhbmdlUGF0aElzRGVzY2VuZGFudCkge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gY2hhbmdlLnRva2Vucy5zbGljZSh3YXRjaC50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoID0gXy5nZXQod2F0Y2gudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGgsIGNoYW5nZS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHdhdGNoLnRva2Vucy5zbGljZShjaGFuZ2UudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoUGF0aCA9IF8uZ2V0KGNoYW5nZS52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMod2F0Y2gudmFsdWUsIG5ld1ZhbHVlQXRXYXRjaFBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICB0aGlzLmhhbmRsZXIoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCB0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChuZXdWYWx1ZSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hlckZhY3Rvcnkge1xuICBjcmVhdGUod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoZXIod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hlckZhY3RvcnknLCAoKSA9PiB7XG4gIHJldHVybiBuZXcgV2F0Y2hlckZhY3RvcnkoKTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdSb3V0ZScsIGZ1bmN0aW9uKE9iamVjdEhlbHBlcikge1xuICBcIm5nSW5qZWN0XCI7XG4gIGNvbnN0IHRva2VucyA9IHt9O1xuICBjb25zdCB1cmxXcml0ZXJzID0gW107XG4gIGNvbnN0IHVybHMgPSBbXTtcbiAgY29uc3QgcGVyc2lzdGVudFN0YXRlcyA9IFtdO1xuICBjb25zdCByZWFkeSA9IGZhbHNlO1xuICBjb25zdCB0eXBlcyA9IHt9O1xuICBsZXQgaHRtbDVNb2RlID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvdmlkZXIgPSB7XG5cbiAgICByZWdpc3RlclR5cGUobmFtZSwgY29uZmlnKSB7XG4gICAgICB0eXBlc1tuYW1lXSA9IGNvbmZpZztcbiAgICAgIHR5cGVzW25hbWVdLnJlZ2V4ID0gbmV3IFJlZ0V4cCh0eXBlc1tuYW1lXS5yZWdleC5zb3VyY2UsICdpJyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJUeXBlIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFRva2VuKG5hbWUsIGNvbmZpZykge1xuICAgICAgdG9rZW5zW25hbWVdID0gXy5leHRlbmQoe25hbWV9LCBjb25maWcpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsVG9rZW4gfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsV3JpdGVyKG5hbWUsIGZuKSB7XG4gICAgICB1cmxXcml0ZXJzW25hbWVdID0gZm47XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxXcml0ZXIgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsKHBhdHRlcm4sIGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25zdCB1cmxEYXRhID0ge1xuICAgICAgICBjb21waWxlZFVybDogdGhpcy5fY29tcGlsZVVybFBhdHRlcm4ocGF0dGVybiwgY29uZmlnKSxcbiAgICAgICAgcGF0dGVyblxuICAgICAgfTtcblxuICAgICAgdXJscy5wdXNoKF8uZXh0ZW5kKHVybERhdGEsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBzZXRQZXJzaXN0ZW50U3RhdGVzKC4uLnN0YXRlTGlzdCkge1xuICAgICAgXy5mb3JFYWNoKHN0YXRlTGlzdCwgKHN0YXRlKSA9PiB7XG4gICAgICAgIGlmICghXy5pbmNsdWRlcyhwZXJzaXN0ZW50U3RhdGVzLCBzdGF0ZSkpIHtcbiAgICAgICAgICBwZXJzaXN0ZW50U3RhdGVzLnB1c2goc3RhdGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0SHRtbDVNb2RlKG1vZGUpIHtcbiAgICAgIGh0bWw1TW9kZSA9IG1vZGU7XG4gICAgfSxcblxuICAgIF9jb21waWxlVXJsUGF0dGVybih1cmxQYXR0ZXJuLCBjb25maWcpIHtcbiAgICAgIGxldCBtYXRjaDtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHVybFBhdHRlcm4pO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2Vuc3VyZU9wdGlvbmFsVHJhaWxpbmdTbGFzaCh1cmxQYXR0ZXJuKTtcblxuICAgICAgY29uc3QgdG9rZW5SZWdleCA9IC9cXHsoW0EtWmEtelxcLl8wLTldKylcXH0vZztcbiAgICAgIGxldCB1cmxSZWdleCA9IHVybFBhdHRlcm47XG5cbiAgICAgIGlmICghY29uZmlnLnBhcnRpYWxNYXRjaCkge1xuICAgICAgICB1cmxSZWdleCA9IGBeJHt1cmxSZWdleH0kYDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG9rZW5MaXN0ID0gW107XG5cbiAgICAgIHdoaWxlICgobWF0Y2ggPSB0b2tlblJlZ2V4LmV4ZWModXJsUGF0dGVybikpICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW21hdGNoWzFdXTtcbiAgICAgICAgdG9rZW5MaXN0LnB1c2godG9rZW4pO1xuICAgICAgICB1cmxSZWdleCA9IHVybFJlZ2V4LnJlcGxhY2UobWF0Y2hbMF0sIGAoJHt0eXBlc1t0b2tlbi50eXBlXS5yZWdleC5zb3VyY2V9KWApO1xuICAgICAgfVxuXG4gICAgICB1cmxSZWdleC5yZXBsYWNlKCcuJywgJ1xcXFwuJyk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKHVybFJlZ2V4LCAnaScpLFxuICAgICAgICB0b2tlbnM6IHRva2VuTGlzdFxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2Vuc3VyZU9wdGlvbmFsVHJhaWxpbmdTbGFzaChzdHIpIHtcbiAgICAgIGlmIChzdHIubWF0Y2goL1xcLyQvKSkge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcLyQvLCAnLz8nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgJHtzdHJ9Lz9gO1xuICAgIH0sXG5cbiAgICBfZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyhzdHIpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xcKFxcKVxcKlxcK1xcP1xcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCRsb2NhdGlvbiwgJGluamVjdG9yLCAkcSkge1xuICAgICAgJ25nSW5qZWN0JztcblxuICAgICAgLy8gV2hlbiBnZXR0aW5nIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlIChvbmx5IGRvbmUgb25jZSksIHdlIG5lZWQgdG8gaXRlcmF0ZSBvdmVyIHRoZSB1cmxXcml0ZXJzIGFuZCB0dXJuXG4gICAgICAvLyB0aGVtIGludG8gbWV0aG9kcyB0aGF0IGludm9rZSB0aGUgUkVBTCB1cmxXcml0ZXIsIGJ1dCBwcm92aWRpbmcgZGVwZW5kZW5jeSBpbmplY3Rpb24gdG8gaXQsIHdoaWxlIGFsc29cbiAgICAgIC8vIGdpdmluZyBpdCB0aGUgZGF0YSB0aGF0IHRoZSBjYWxsZWUgcGFzc2VzIGluLlxuXG4gICAgICAvLyBUaGUgcmVhc29uIHdlIGhhdmUgdG8gZG8gdGhpcyBoZXJlIGlzIGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhlICRpbmplY3RvciBiYWNrIGluIHRoZSByb3V0ZVByb3ZpZGVyLlxuXG4gICAgICBfLmZvckluKHVybFdyaXRlcnMsICh3cml0ZXIsIHdyaXRlck5hbWUpID0+XG4gICAgICAgIHVybFdyaXRlcnNbd3JpdGVyTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgaWYgKCFkYXRhKSB7IGRhdGEgPSB7fTsgfVxuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IHtVcmxEYXRhOiBkYXRhfTtcbiAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmludm9rZSh3cml0ZXIsIHt9LCBsb2NhbHMpO1xuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICBsZXQgZmxhc2hTdGF0ZXMgPSBbXTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IHtcbiAgICAgICAgY3VycmVudEJpbmRpbmdzOiB7fSxcbiAgICAgICAgcmVhZHlEZWZlcnJlZDogJHEuZGVmZXIoKSxcblxuICAgICAgICBtYXRjaCh1cmxUb01hdGNoKSB7XG4gICAgICAgICAgZm9yIChjb25zdCB1cmwgb2YgQXJyYXkuZnJvbSh1cmxzKSkge1xuICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHVybC5jb21waWxlZFVybC5yZWdleC5leGVjKHVybFRvTWF0Y2gpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4ge3VybCwgcmVnZXhNYXRjaDogbWF0Y2h9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0RGF0YShtYXRjaCwgc2VhcmNoRGF0YSA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IGRlZmF1bHRzID0gdGhpcy5leHRyYWN0RGVmYXVsdERhdGEobWF0Y2gpO1xuICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmV4dHJhY3RQYXRoRGF0YShtYXRjaCk7XG4gICAgICAgICAgc2VhcmNoRGF0YSA9IHRoaXMuZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdEhlbHBlci5kZWZhdWx0KHNlYXJjaERhdGEsIHBhdGgsIGRlZmF1bHRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKSB7XG4gICAgICAgICAgaWYgKCFzZWFyY2hEYXRhKSB7IHNlYXJjaERhdGEgPSAkbG9jYXRpb24uc2VhcmNoKCk7IH1cbiAgICAgICAgICBjb25zdCBkYXRhID0gXy5jbG9uZShzZWFyY2hEYXRhKTtcbiAgICAgICAgICBjb25zdCBuZXdEYXRhID0ge307XG5cbiAgICAgICAgICBfLmZvckVhY2goZGF0YSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRLZXkgPSBfLmZpbmRLZXkodG9rZW5zLCB7IHNlYXJjaEFsaWFzOiBrZXkgfSk7XG4gICAgICAgICAgICBpZiAoIXRhcmdldEtleSkgeyB0YXJnZXRLZXkgPSBrZXk7IH1cblxuICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlTmFtZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gXy5nZXQodG9rZW5zW3RhcmdldEtleV0sICd0eXBlJykgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoIXRva2Vuc1t0YXJnZXRLZXldIHx8ICh0eXBlc1t0b2tlblR5cGVOYW1lXS5yZWdleC50ZXN0KHZhbHVlKSkpIHtcblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblR5cGUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnR5cGUgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHR5cGVUb2tlblR5cGUgPSB0b2tlblR5cGUgPyB0eXBlc1t0b2tlblR5cGVdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0b2tlblR5cGVQYXJzZWQgPSB0eXBlVG9rZW5UeXBlID8gdHlwZVRva2VuVHlwZS5wYXJzZXIgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgaWYgKHRva2VuVHlwZVBhcnNlZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0b2tlblR5cGVQYXJzZWQsIG51bGwsIHt0b2tlbjogdmFsdWV9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS5zdGF0ZVBhdGggOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IGRhdGFLZXkgPSB0b2tlblRhcmdldEtleVN0YXRlUGF0aCB8fCB0YXJnZXRLZXk7XG5cbiAgICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChuZXdEYXRhLCBkYXRhS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0RGVmYXVsdERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICAgICAgICBfLmZvckVhY2gobWF0Y2gudXJsLnN0YXRlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCBrZXksICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnID8gXy5jbG9uZURlZXAodmFsdWUpIDogdmFsdWUpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RQYXRoRGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgICBjb25zdCBwYXRoVG9rZW5zID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2VucztcblxuICAgICAgICAgIGlmIChwYXRoVG9rZW5zLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4ge307IH1cblxuICAgICAgICAgIGZvciAobGV0IG4gPSAwLCBlbmQgPSBwYXRoVG9rZW5zLmxlbmd0aC0xLCBhc2MgPSAwIDw9IGVuZDsgYXNjID8gbiA8PSBlbmQgOiBuID49IGVuZDsgYXNjID8gbisrIDogbi0tKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnNbbl07XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBtYXRjaC5yZWdleE1hdGNoW24rMV07XG5cbiAgICAgICAgICAgIGlmICh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIpIHsgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlciwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pOyB9XG5cbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwgKHRva2VuLnN0YXRlUGF0aCB8fCB0b2tlbi5uYW1lKSwgdmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcnMoKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVyKG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbnZva2VVcmxXcml0ZXIobmFtZSwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV0oZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ28obmFtZSwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgcmV0dXJuICRsb2NhdGlvbi51cmwodGhpcy5pbnZva2VVcmxXcml0ZXIobmFtZSwgZGF0YSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFBlcnNpc3RlbnRTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIHBlcnNpc3RlbnRTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZEZsYXNoU3RhdGVzKC4uLm5ld1N0YXRlcykge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gZmxhc2hTdGF0ZXMuY29uY2F0KG5ld1N0YXRlcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIGZsYXNoU3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lLCBiaW5kaW5nKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdID0gYmluZGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVsZXRlQ3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1hdGNoZXNDdXJyZW50QmluZGluZ05hbWUodmlld05hbWUsIGJpbmRpbmdOYW1lRXhwcmVzc2lvbikge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRCaW5kaW5nID0gdGhpcy5nZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSk7XG5cbiAgICAgICAgICBpZiAoIWN1cnJlbnRCaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGJpbmRpbmdOYW1lRXhwcmVzc2lvbiBpbnN0YW5jZW9mIFJlZ0V4cCA/XG4gICAgICAgICAgICBiaW5kaW5nTmFtZUV4cHJlc3Npb24udGVzdChjdXJyZW50QmluZGluZy5uYW1lKSA6XG4gICAgICAgICAgICBjdXJyZW50QmluZGluZy5uYW1lID09PSBiaW5kaW5nTmFtZUV4cHJlc3Npb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UmVhZHkocmVhZHkpIHtcbiAgICAgICAgICBpZiAoIXJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNSZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNIdG1sNU1vZGVFbmFibGVkKCkge1xuICAgICAgICAgIHJldHVybiBodG1sNU1vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2hlblJlYWR5KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5RGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICB9O1xuXG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbnVtZXJpYycsIHtyZWdleDogL1xcZCsvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiBwYXJzZUludCh0b2tlbildfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYWxwaGEnLCB7cmVnZXg6IC9bYS16QS1aXSsvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYW55Jywge3JlZ2V4OiAvLisvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbGlzdCcsIHtyZWdleDogLy4rLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gdG9rZW4uc3BsaXQoJywnKV19KTtcblxuICByZXR1cm4gcHJvdmlkZXI7XG59KTtcblxuY2xhc3MgU3RhdGVQcm92aWRlciB7XG4gICRnZXQoV2F0Y2hhYmxlTGlzdEZhY3RvcnkpIHtcbiAgICAnbmdJbmplY3QnO1xuICAgIHJldHVybiBXYXRjaGFibGVMaXN0RmFjdG9yeS5jcmVhdGUoKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdTdGF0ZScsIG5ldyBTdGF0ZVByb3ZpZGVyKTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignVmlld0JpbmRpbmdzJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCB2aWV3cyA9IFtdO1xuXG4gIGNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJpbmRpbmdzKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgaWYgKCEodGhpcy5iaW5kaW5ncyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0gW3RoaXMuYmluZGluZ3NdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEJpbmRpbmdzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3M7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIGJpbmQobmFtZSwgY29uZmlnKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShiaW5kaW5ncywgY29tbW9uUmVxdWlyZWRTdGF0ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoYmluZGluZy5yZXF1aXJlZFN0YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBbYmluZGluZy5yZXF1aXJlZFN0YXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goYmluZGluZy5yZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlLmNvbmNhdChjb21tb25SZXF1aXJlZFN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXNvbHZlKGJpbmRpbmdzLCBjb21tb25SZXNvbHZlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoISgncmVzb2x2ZScgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVzb2x2ZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChfLmRlZmF1bHRzKGJpbmRpbmcucmVzb2x2ZSwgY29tbW9uUmVzb2x2ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJhc2ljQ29tbW9uRmllbGRzID0gW1xuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nVGVtcGxhdGVVcmwnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ1Blcm1pc3Npb25EZW5pZWRUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdQZXJtaXNzaW9uRGVuaWVkVGVtcGxhdGVVcmwnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ1Blcm1pc3Npb25EZW5pZWRDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAncmVzb2x2aW5nUGVybWlzc2lvbkRlbmllZENvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JUZW1wbGF0ZVVybCd9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCBjb21tb25GaWVsZCBvZiBBcnJheS5mcm9tKGJhc2ljQ29tbW9uRmllbGRzKSkge1xuICAgICAgICAgIGlmIChjb21tb25GaWVsZC5uYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgZGVmYXVsdEJpbmRpbmdGaWVsZChuZXdCaW5kaW5ncywgY29tbW9uRmllbGQub3ZlcnJpZGVGaWVsZCwgY29uZmlnW2NvbW1vbkZpZWxkLm5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlcXVpcmVkU3RhdGUnIGluIGNvbmZpZykge1xuICAgICAgICAgIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXF1aXJlZFN0YXRlJ10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXNvbHZlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb21tb25SZXNvbHZlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlc29sdmUnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdEJpbmRpbmdGaWVsZChiaW5kaW5ncywgZmllbGROYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgIGlmICghKGZpZWxkTmFtZSBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgaXRlbSA9IGJpbmRpbmdbZmllbGROYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
