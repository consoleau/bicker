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
        var isAbsoluteUrl = /^(https?:){0,1}\/\/.+/.test(url);
        return Route.isHtml5ModeEnabled() || isAbsoluteUrl ? url : '#' + url;
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
    controller: function controller() {},
    link: function link(viewDirectiveScope, iElement, iAttrs, ctrl) {
      var viewCreated = false;
      var viewScope = undefined;
      var viewController = {}; // NB will only be defined for components
      var viewManagementPending = false;
      var view = ViewBindings.getView(iAttrs.name);
      var bindings = view.getBindings();

      ctrl.viewName = iAttrs.name;

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
        if (error === PermissionDeniedError && binding.permissionDeniedTemplateUrl) {
          return showBasicTemplate(element, binding, 'permissionDeniedTemplateUrl');
        } else if (error === PermissionDeniedError && binding.permissionDeniedComponent) {
          return showErrorComponent(error, element, binding, 'permissionDeniedComponent');
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
        var basicCommonFields = [{ name: 'commonPermissionDeniedTemplateUrl', overrideField: 'permissionDeniedTemplateUrl' }, { name: 'commonPermissionDeniedComponent', overrideField: 'permissionDeniedComponent' }, { name: 'commonResolvingTemplateUrl', overrideField: 'resolvingTemplateUrl' }, { name: 'commonResolvingErrorTemplateUrl', overrideField: 'resolvingErrorTemplateUrl' }, { name: 'commonResolvingErrorComponent', overrideField: 'resolvingErrorComponent' }, { name: 'commonErrorComponent', overrideField: 'errorComponent' }, { name: 'commonErrorTemplateUrl', overrideField: 'errorTemplateUrl' }];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxRQUFBLE1BQUEsQ0FBQSxlQUFBLEVBQWdDLENBQWhDLFdBQWdDLENBQWhDLEVBQUEsR0FBQSxxRkFBbUQsVUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsWUFBQSxFQUFBLGtCQUFBLEVBQWlGO0FBQ2xJOztBQUVBLE1BQUksU0FBSixTQUFBO0FBQ0EsYUFBQSxHQUFBLENBQUEsc0JBQUEsRUFBdUMsWUFBWTtBQUNqRCxRQUFJLE1BQUosT0FBSSxFQUFKLEVBQXFCO0FBQ25CLFlBQUEsUUFBQSxDQUFBLEtBQUE7QUFDRDtBQUhILEdBQUE7O0FBTUEsYUFBQSxHQUFBLENBQUEsd0JBQUEsRUFBeUMsVUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFxQjtBQUM1RDtBQUNBLFFBQUksT0FBQSxLQUFKLENBQUE7QUFDQSxRQUFJLFdBQUosTUFBQSxFQUF1QjtBQUNyQjtBQUNEOztBQUVELGFBQUEsTUFBQTs7QUFFQSx1QkFBQSxLQUFBO0FBQ0EsUUFBTSxRQUFRLE1BQUEsS0FBQSxDQUFZLFVBQTFCLElBQTBCLEVBQVosQ0FBZDs7QUFFQSxRQUFJLENBQUosS0FBQSxFQUFZO0FBQ1YsYUFBQSxFQUFBO0FBREYsS0FBQSxNQUVPO0FBQ0wsYUFBTyxNQUFBLFdBQUEsQ0FBUCxLQUFPLENBQVA7QUFDRDs7QUFFRCxRQUFJLGdCQUFnQixhQUFBLEtBQUEsQ0FBbUIsTUFBbkIsSUFBQSxFQUFwQixJQUFvQixDQUFwQjtBQUNBLG9CQUFnQixFQUFBLFVBQUEsQ0FBQSxhQUFBLEVBQTRCLE1BQUEsbUJBQUEsR0FBQSxNQUFBLENBQW1DLE1BQS9FLGNBQStFLEVBQW5DLENBQTVCLENBQWhCOztBQUVBLFFBQU0sWUFB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QUFBLElBQWMsSUFBQSxJQUFBLENBQUEsSUFBQSxFQUFyQixXQUFxQixDQUFyQjtBQTVFRyxLQUFBO0FBQUEsVUFBQSxTQUFBLElBQUEsR0ErRUU7QUFDTCxhQUFPO0FBQUEsaUJBQUEsU0FBQSxPQUFBLENBQUEsSUFBQSxFQUNTO0FBQ1osaUJBQU8sTUFBUCxJQUFPLENBQVA7QUFDRDtBQUhJLE9BQVA7QUFLRDtBQXJGSSxHQUFQO0FBakJGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJhbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicsIFsnbmdBbmltYXRlJ10pLnJ1bihmdW5jdGlvbiAoU3RhdGUsIFJvdXRlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE9iamVjdEhlbHBlciwgUGVuZGluZ1ZpZXdDb3VudGVyKSB7XG4gIFwibmdJbmplY3RcIjtcblxuICBsZXQgb2xkVXJsID0gdW5kZWZpbmVkO1xuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJvdXRlLmlzUmVhZHkoKSkge1xuICAgICAgUm91dGUuc2V0UmVhZHkoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZSwgbmV3VXJsKSB7XG4gICAgLy8gV29yay1hcm91bmQgZm9yIEFuZ3VsYXJKUyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2lzc3Vlcy84MzY4XG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKG5ld1VybCA9PT0gb2xkVXJsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2xkVXJsID0gbmV3VXJsO1xuXG4gICAgUGVuZGluZ1ZpZXdDb3VudGVyLnJlc2V0KCk7XG4gICAgY29uc3QgbWF0Y2ggPSBSb3V0ZS5tYXRjaCgkbG9jYXRpb24ucGF0aCgpKTtcblxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IFJvdXRlLmV4dHJhY3REYXRhKG1hdGNoKTtcbiAgICB9XG5cbiAgICBsZXQgZmllbGRzVG9VbnNldCA9IE9iamVjdEhlbHBlci5ub3RJbihTdGF0ZS5saXN0LCBkYXRhKTtcbiAgICBmaWVsZHNUb1Vuc2V0ID0gXy5kaWZmZXJlbmNlKGZpZWxkc1RvVW5zZXQsIFJvdXRlLmdldFBlcnNpc3RlbnRTdGF0ZXMoKS5jb25jYXQoUm91dGUuZ2V0Rmxhc2hTdGF0ZXMoKSkpO1xuXG4gICAgY29uc3QgZXZlbnREYXRhID0ge3Vuc2V0dGluZzogZmllbGRzVG9VbnNldCwgc2V0dGluZzogZGF0YX07XG4gICAgJHJvb3RTY29wZS4kZW1pdCgnYmlja2VyX3JvdXRlci5iZWZvcmVTdGF0ZUNoYW5nZScsIGV2ZW50RGF0YSk7XG5cbiAgICBpZiAoKGV2ZW50RGF0YS51bnNldHRpbmcpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgU3RhdGUudW5zZXQoZXZlbnREYXRhLnVuc2V0dGluZyk7XG4gICAgfVxuXG4gICAgXy5mb3JFYWNoKGV2ZW50RGF0YS5zZXR0aW5nLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgUm91dGUucmVzZXRGbGFzaFN0YXRlcygpO1xuICAgIFJvdXRlLnNldFJlYWR5KHRydWUpO1xuICB9KTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmNvbnN0YW50KCdPYmplY3RIZWxwZXInLCB7XG4gIGdldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudFtrZXldO1xuICB9LFxuXG4gIHNldChvYmplY3QsIHBhdGgsIHZhbHVlKSB7XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgaWYgKHBhcmVudFtzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhcmVudFtzZWdtZW50XSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudFtrZXldID0gdmFsdWU7XG4gIH0sXG5cbiAgdW5zZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudFtrZXldID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgZGVsZXRlIHBhcmVudFtrZXldO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIC8vIFJlY3Vyc2l2ZWx5IHJldHVybiB0aGUgcHJvcGVydGllcyBpbiBhIHRoYXQgYXJlbid0IGluIGJcbiAgbm90SW4oYSwgYiwgcHJlZml4ID0gJycpIHtcbiAgICBsZXQgbm90SW4gPSBbXTtcbiAgICBwcmVmaXggPSBwcmVmaXgubGVuZ3RoID4gMCA/IGAke3ByZWZpeH0uYCA6ICcnO1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgQXJyYXkuZnJvbShPYmplY3Qua2V5cyhhKSkpIHtcbiAgICAgIGNvbnN0IHRoaXNQYXRoID0gYCR7cHJlZml4fSR7a2V5fWA7XG5cbiAgICAgIGlmIChiW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub3RJbi5wdXNoKHRoaXNQYXRoKTtcblxuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIGFba2V5XSA9PT0gJ29iamVjdCcpICYmICghKGFba2V5XSBpbnN0YW5jZW9mIEFycmF5KSkpIHtcbiAgICAgICAgbm90SW4gPSBub3RJbi5jb25jYXQodGhpcy5ub3RJbihhW2tleV0sIGJba2V5XSwgdGhpc1BhdGgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm90SW47XG4gIH0sXG5cbiAgZGVmYXVsdChvdmVycmlkZXMsIC4uLmRlZmF1bHRTZXRzKSB7XG4gICAgbGV0IGRlZmF1bHRTZXQsIHZhbHVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgaWYgKGRlZmF1bHRTZXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZGVmYXVsdFNldCA9IGRlZmF1bHRTZXRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0U2V0ID0gdGhpcy5kZWZhdWx0KC4uLkFycmF5LmZyb20oZGVmYXVsdFNldHMgfHwgW10pKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkZWZhdWx0U2V0KSB7XG4gICAgICB2YWx1ZSA9IGRlZmF1bHRTZXRba2V5XTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb3ZlcnJpZGVzW2tleV0gPT09IFwib2JqZWN0XCIpKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5kZWZhdWx0KG92ZXJyaWRlc1trZXldLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIG92ZXJyaWRlcykge1xuICAgICAgdmFsdWUgPSBvdmVycmlkZXNba2V5XTtcbiAgICAgIHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gfHwgdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG5cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5jb25zdGFudCgnUGVybWlzc2lvbkRlbmllZEVycm9yJywgU3ltYm9sKCdQZXJtaXNzaW9uRGVuaWVkRXJyb3InKSk7XG5cbi8vIFVzYWdlOlxuLy9cbi8vIElmIHlvdSB3YW50IHRvIGFkZCB0aGUgY2xhc3MgXCJhY3RpdmVcIiB0byBhbiBhbmNob3IgZWxlbWVudCB3aGVuIHRoZSBcIm1haW5cIiB2aWV3IGhhcyBhIGJpbmRpbmdcbi8vIHdpdGggdGhlIG5hbWUgXCJteUJpbmRpbmdcIiByZW5kZXJlZCB3aXRoaW4gaXRcbi8vXG4vLyA8YSByb3V0ZS1jbGFzcz1cInsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6ICdteUJpbmRpbmcnIH1cIj5BbmNob3IgdGV4dDwvYT5cbi8vXG4vLyBZb3UgY2FuIGFsc28gdXNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHRoZSBiaW5kaW5nIG5hbWUsIGJ1dCB0byBkbyBzbyB5b3UgaGF2ZSB0byBwcm92aWRlIGEgbWV0aG9kXG4vLyBvbiB5b3VyIGNvbnRyb2xsZXIgd2hpY2ggcmV0dXJucyB0aGUgcm91dGUgY2xhc3MgZGVmaW5pdGlvbiBvYmplY3QsIGJlY2F1c2UgQW5ndWxhckpTIGV4cHJlc3Npb25zXG4vLyBkb24ndCBzdXBwb3J0IGlubGluZSByZWd1bGFyIGV4cHJlc3Npb25zXG4vL1xuLy8gY2xhc3MgTXlDb250cm9sbGVyIHtcbi8vICBnZXRSb3V0ZUNsYXNzT2JqZWN0KCkge1xuLy8gICAgcmV0dXJuIHsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6IC9teUJpbmQvIH1cbi8vICB9XG4vLyB9XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCIkY3RybC5nZXRSb3V0ZUNsYXNzT2JqZWN0KClcIj5BbmNob3IgdGV4dDwvYT5cbi8vXG5cbmZ1bmN0aW9uIHJvdXRlQ2xhc3NGYWN0b3J5KFJvdXRlKSB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBsaW5rIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgc2NvcGUuJHdhdGNoKCgpID0+IHtcbiAgICAgICAgY29uc3Qgcm91dGVDbGFzc0RlZmluaXRpb24gPSBzY29wZS4kZXZhbChpQXR0cnNbJ3JvdXRlQ2xhc3MnXSk7XG5cbiAgICAgICAgaWYgKCFSb3V0ZS5tYXRjaGVzQ3VycmVudEJpbmRpbmdOYW1lKHJvdXRlQ2xhc3NEZWZpbml0aW9uLnZpZXdOYW1lLCByb3V0ZUNsYXNzRGVmaW5pdGlvbi5iaW5kaW5nTmFtZSkpIHtcbiAgICAgICAgICBpZiAoaUVsZW1lbnQuaGFzQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgaUVsZW1lbnQucmVtb3ZlQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICBpRWxlbWVudC5hZGRDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZUNsYXNzJywgcm91dGVDbGFzc0ZhY3RvcnkpO1xuXG5mdW5jdGlvbiByb3V0ZUhyZWZGYWN0b3J5IChSb3V0ZSwgJGxvY2F0aW9uLCAkdGltZW91dCkge1xuICAnbmdJbmplY3QnO1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBzY29wZTogdHJ1ZSxcbiAgICBsaW5rIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgaWYgKGlBdHRycy5pZ25vcmVIcmVmID09PSB1bmRlZmluZWQgJiYgUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgaUVsZW1lbnQuY2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBjb25zdCB1cmxQYXRoID0gaUVsZW1lbnQuYXR0cignaHJlZicpLnJlcGxhY2UoL14jLywgJycpO1xuICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiAkbG9jYXRpb24udXJsKHVybFBhdGgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgY29uc3Qgd3JpdGVyID0gb2JqZWN0W3dyaXRlck5hbWVdO1xuICAgICAgICBzY29wZVtgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gd3JpdGVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2NvcGUuJHdhdGNoKGlBdHRycy5yb3V0ZUhyZWYsIChuZXdVcmwpID0+IHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYgKFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgdXJsID0gbmV3VXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybCA9IGAjJHtuZXdVcmx9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaUVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZUhyZWYnLCByb3V0ZUhyZWZGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVPbkNsaWNrRmFjdG9yeSAoUm91dGUsICRsb2NhdGlvbiwgJHdpbmRvdywgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0JztcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG5cbiAgICBsaW5rIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIGNvbnN0IExFRlRfQlVUVE9OID0gMDtcbiAgICAgIGNvbnN0IE1JRERMRV9CVVRUT04gPSAxO1xuXG4gICAgICBpZiAoZWxlbWVudC5pcygnYScpKSB7XG4gICAgICAgIGFkZFdhdGNoVGhhdFVwZGF0ZXNIcmVmQXR0cmlidXRlKCk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuY2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gTEVGVF9CVVRUT04pIHtcbiAgICAgICAgICAgIG5hdmlnYXRlVG9VcmwoZ2V0VXJsKCksIHNob3VsZE9wZW5OZXdXaW5kb3coZXZlbnQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQubW91c2V1cCgoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09PSBNSURETEVfQlVUVE9OKSB7XG4gICAgICAgICAgICBuYXZpZ2F0ZVRvVXJsKGdldFVybCgpLCBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbmF2aWdhdGVUb1VybChfdXJsLCBuZXdXaW5kb3cgPSBmYWxzZSkge1xuICAgICAgICBsZXQgdXJsID0gX3VybDtcblxuICAgICAgICBpZiAobmV3V2luZG93KSB7XG4gICAgICAgICAgdXJsID0gYCR7JHdpbmRvdy5sb2NhdGlvbi5vcmlnaW59LyR7dXJsfWA7XG4gICAgICAgICAgJHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmwpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBldmVudC5idXR0b24gPT09IE1JRERMRV9CVVRUT04gfHwgKGV2ZW50LmJ1dHRvbiA9PT0gTEVGVF9CVVRUT04gJiYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRVcmwoKSB7XG4gICAgICAgIGNvbnN0IHVybFdyaXRlcnMgPSBSb3V0ZS5nZXRVcmxXcml0ZXJzKCk7XG4gICAgICAgIGNvbnN0IGxvY2FscyA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiB1cmxXcml0ZXJzKSB7XG4gICAgICAgICAgbG9jYWxzW2Ake3dyaXRlck5hbWV9VXJsV3JpdGVyYF0gPSB1cmxXcml0ZXJzW3dyaXRlck5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gc2NvcGUuJGV2YWwoYXR0cnMucm91dGVPbkNsaWNrLCBfLmFzc2lnbihsb2NhbHMsIHNjb3BlKSk7XG5cbiAgICAgICAgcmV0dXJuIGh0bWw1VGhlVXJsKHVybCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGh0bWw1VGhlVXJsKHVybCkge1xuICAgICAgICBjb25zdCBpc0Fic29sdXRlVXJsID0gKC9eKGh0dHBzPzopezAsMX1cXC9cXC8uKy8pLnRlc3QodXJsKTtcbiAgICAgICAgcmV0dXJuIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpIHx8IGlzQWJzb2x1dGVVcmwgPyB1cmwgOiBgIyR7dXJsfWA7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFkZFdhdGNoVGhhdFVwZGF0ZXNIcmVmQXR0cmlidXRlKCkge1xuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBgJHtnZXRVcmwoKX1gO1xuICAgICAgICB9LCAobmV3VXJsKSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5hdHRyKCdocmVmJywgbmV3VXJsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVPbkNsaWNrJywgcm91dGVPbkNsaWNrRmFjdG9yeSk7XG5cbi8vIEBUT0RPIG5vbmUgb2YgdGhlIGFuaW1hdGlvbiBjb2RlIGluIHRoaXMgZGlyZWN0aXZlIGhhcyBiZWVuIHRlc3RlZC4gTm90IHN1cmUgaWYgaXQgY2FuIGJlIGF0IHRoaXMgc3RhZ2UgVGhpcyBuZWVkcyBmdXJ0aGVyIGludmVzdGlnYXRpb24uXG4vLyBAVE9ETyB0aGlzIGNvZGUgZG9lcyB0b28gbXVjaCwgaXQgc2hvdWxkIGJlIHJlZmFjdG9yZWQuXG5cbmZ1bmN0aW9uIHJvdXRlVmlld0ZhY3RvcnkoJGxvZywgJGNvbXBpbGUsICRjb250cm9sbGVyLCBWaWV3QmluZGluZ3MsICRxLCBTdGF0ZSwgJHJvb3RTY29wZSwgJGFuaW1hdGUsICR0aW1lb3V0LCAkaW5qZWN0b3IsIFBlbmRpbmdWaWV3Q291bnRlciwgUGVybWlzc2lvbkRlbmllZEVycm9yLCAkdGVtcGxhdGVSZXF1ZXN0LCBSb3V0ZSkge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IGZhbHNlLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGU6ICc8ZGl2PjwvZGl2PicsXG4gICAgY29udHJvbGxlciAoKSB7fSxcbiAgICBsaW5rICh2aWV3RGlyZWN0aXZlU2NvcGUsIGlFbGVtZW50LCBpQXR0cnMsIGN0cmwpIHtcbiAgICAgIGxldCB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgbGV0IHZpZXdTY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCB2aWV3Q29udHJvbGxlciA9IHt9OyAvLyBOQiB3aWxsIG9ubHkgYmUgZGVmaW5lZCBmb3IgY29tcG9uZW50c1xuICAgICAgbGV0IHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgY29uc3QgdmlldyA9IFZpZXdCaW5kaW5ncy5nZXRWaWV3KGlBdHRycy5uYW1lKTtcbiAgICAgIGNvbnN0IGJpbmRpbmdzID0gdmlldy5nZXRCaW5kaW5ncygpO1xuXG4gICAgICBjdHJsLnZpZXdOYW1lID0gaUF0dHJzLm5hbWVcblxuICAgICAgaUVsZW1lbnQuYWRkQ2xhc3MoJ25nLWhpZGUnKTtcblxuICAgICAgbGV0IHByZXZpb3VzQm91bmRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGNvbnN0IGdldFN0YXRlRGF0YUZvckJpbmRpbmcgPSBiaW5kaW5nID0+IF8uY2xvbmVEZWVwKFN0YXRlLmdldFN1YnNldChnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKGJpbmRpbmcpKSk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcsIGZpZWxkKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9ICdjb21wb25lbnQnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGJpbmRpbmdbZmllbGRdID8gJGluamVjdG9yLmdldChgJHtiaW5kaW5nW2ZpZWxkXX1EaXJlY3RpdmVgKVswXSA6IGJpbmRpbmc7XG4gICAgICAgIHJldHVybiBfLmRlZmF1bHRzKF8ucGljayhzb3VyY2UsIFsnY29udHJvbGxlcicsICd0ZW1wbGF0ZVVybCcsICdjb250cm9sbGVyQXMnXSksIHtjb250cm9sbGVyQXM6ICckY3RybCd9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFzUmVxdWlyZWREYXRhKGJpbmRpbmcpIHtcbiAgICAgICAgY29uc3QgcmVxdWlyZWRTdGF0ZSA9IGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXTtcblxuICAgICAgICBmb3IgKGxldCByZXF1aXJlbWVudCBvZiBBcnJheS5mcm9tKHJlcXVpcmVkU3RhdGUpKSB7XG4gICAgICAgICAgbGV0IG5lZ2F0ZVJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgIGlmICgnIScgPT09IHJlcXVpcmVtZW50LmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgcmVxdWlyZW1lbnQgPSByZXF1aXJlbWVudC5zbGljZSgxKTtcbiAgICAgICAgICAgIG5lZ2F0ZVJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGVsZW1lbnQgPSBTdGF0ZS5nZXQocmVxdWlyZW1lbnQpO1xuXG4gICAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGlmIGVsZW1lbnQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgaWYgKChlbGVtZW50ID09PSBudWxsKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE9ubHkgY2hlY2sgdmFsdWUgb2YgZWxlbWVudCBpZiBpdCBpcyBkZWZpbmVkXG4gICAgICAgICAgaWYgKG5lZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgZWxlbWVudCA9ICFlbGVtZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmluZGluZy5jYW5BY3RpdmF0ZSkge1xuICAgICAgICAgIGlmICghJGluamVjdG9yLmludm9rZShiaW5kaW5nLmNhbkFjdGl2YXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtYW5hZ2VWaWV3KGVsZW1lbnQsIGJpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoaW5nQmluZGluZyA9IGdldE1hdGNoaW5nQmluZGluZyhiaW5kaW5ncyk7XG5cbiAgICAgICAgaWYgKCFtYXRjaGluZ0JpbmRpbmcpIHtcbiAgICAgICAgICBpZiAodmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgICRhbmltYXRlLmFkZENsYXNzKGVsZW1lbnQsICduZy1oaWRlJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBkZXN0cm95VmlldyhlbGVtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgUm91dGUuZGVsZXRlQ3VycmVudEJpbmRpbmcodmlldy5uYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSBnZXRTdGF0ZURhdGFGb3JCaW5kaW5nKG1hdGNoaW5nQmluZGluZyk7XG4gICAgICAgIGlmICgobWF0Y2hpbmdCaW5kaW5nID09PSBwcmV2aW91c0JpbmRpbmcpICYmIGFuZ3VsYXIuZXF1YWxzKHByZXZpb3VzQm91bmRTdGF0ZSwgbmV3U3RhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmluZGluZ0NoYW5nZWRFdmVudERhdGEgPSB7IHZpZXdOYW1lOiBpQXR0cnMubmFtZSwgY3VycmVudEJpbmRpbmc6IG1hdGNoaW5nQmluZGluZyB9O1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuYmluZGluZ0NoYW5nZWQnLCBiaW5kaW5nQ2hhbmdlZEV2ZW50RGF0YSk7XG5cbiAgICAgICAgcHJldmlvdXNCaW5kaW5nID0gbWF0Y2hpbmdCaW5kaW5nO1xuICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgICAgICBQZW5kaW5nVmlld0NvdW50ZXIuaW5jcmVhc2UoKTtcblxuICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIG1hdGNoaW5nQmluZGluZykudGhlbihmdW5jdGlvbiAoaGFzUmVzb2x2aW5nVGVtcGxhdGUpIHtcbiAgICAgICAgICAvLyBAVE9ETzogTWFnaWMgbnVtYmVyXG4gICAgICAgICAgY29uc3QgZGVsYXlGb3JSZWFsVGVtcGxhdGVJbnNlcnRpb24gPSBoYXNSZXNvbHZpbmdUZW1wbGF0ZSA/IDMwMCA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmICghdmlld0NyZWF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkYW5pbWF0ZS5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctaGlkZScpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aWV3U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIGlmICh2aWV3Q29udHJvbGxlci4kb25EZXN0cm95KSB7IHZpZXdDb250cm9sbGVyLiRvbkRlc3Ryb3koKTsgfVxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSB7XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKGJpbmRpbmdzKSkge1xuICAgICAgICAgIGlmIChoYXNSZXF1aXJlZERhdGEoYmluZGluZykpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lWaWV3KGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHZpZXdDcmVhdGVkID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2aWV3Q3JlYXRlZCA9IGZhbHNlO1xuICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCkucmVtb3ZlKCk7XG4gICAgICAgIHZpZXdTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICBpZiAodmlld0NvbnRyb2xsZXIuJG9uRGVzdHJveSkgeyB2aWV3Q29udHJvbGxlci4kb25EZXN0cm95KCk7IH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY3JlYXRlVmlldyhlbGVtZW50LCBiaW5kaW5nLCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgY29uc3QgdGltZVN0YXJ0ZWRNYWluVmlldyA9IERhdGUubm93KCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldENvbXBvbmVudEZyb21CaW5kaW5nKGJpbmRpbmcpO1xuXG4gICAgICAgIGNvbnN0IHJlc29sdmVJc1Blcm1pdHRlZCA9IGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgICAgaWYgKGJpbmRpbmcuaXNQZXJtaXR0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKGJpbmRpbmcuaXNQZXJtaXR0ZWQpXG4gICAgICAgICAgICAgID8gJHEucmVzb2x2ZSh0cnVlKVxuICAgICAgICAgICAgICA6ICRxLnJlamVjdChQZXJtaXNzaW9uRGVuaWVkRXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAkcS5yZXNvbHZlKHRydWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uU3VjY2Vzc2Z1bFJlc29sdXRpb24gPSBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgIGlmIChnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpICE9PSBiaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmlld0NyZWF0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgY29uc3QgcmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPSBEYXRlLm5vdygpIC0gdGltZVN0YXJ0ZWRNYWluVmlldztcblxuICAgICAgICAgIGNvbnN0IGluamVjdE1haW5UZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiByZW5kZXJDb21wb25lbnQoZWxlbWVudCwgY29tcG9uZW50LCBhcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGdpdmUgdGhlIHZpZXcgdGltZSB0byBwcm9wZXJseSBpbml0aWFsaXNlXG4gICAgICAgICAgICAgIC8vIGJlZm9yZSBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIHRoZSBpbnRpYWxWaWV3c0xvYWRlZCBldmVudFxuICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBjb25zdCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSA9IE1hdGgubWF4KDAsIG1pbmltdW1EZWxheSAtIHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSA8IG1pbmltdW1EZWxheSkge1xuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+IGluamVjdE1haW5UZW1wbGF0ZSgpLCBtYWluVGVtcGxhdGVJbmplY3Rpb25EZWxheSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmplY3RNYWluVGVtcGxhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25SZXNvbHV0aW9uRmFpbHVyZSA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAkbG9nLmVycm9yKGVycm9yKTtcbiAgICAgICAgICByZXR1cm4gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfTtcblxuICAgICAgICBSb3V0ZS5zZXRDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUsIGJpbmRpbmcpO1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHtcbiAgICAgICAgICB0ZW1wbGF0ZTogJHRlbXBsYXRlUmVxdWVzdChjb21wb25lbnQudGVtcGxhdGVVcmwpLFxuICAgICAgICAgIGRlcGVuZGVuY2llczogcmVzb2x2ZShiaW5kaW5nKSxcbiAgICAgICAgICBpc1Blcm1pdHRlZDogcmVzb2x2ZUlzUGVybWl0dGVkKGJpbmRpbmcpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4ob25TdWNjZXNzZnVsUmVzb2x1dGlvbiwgb25SZXNvbHV0aW9uRmFpbHVyZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZpbmdUZW1wbGF0ZVVybCB8fCAhYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgcmV0dXJuICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoJHJvb3RTY29wZS4kbmV3KCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGlmIChlcnJvciA9PT0gUGVybWlzc2lvbkRlbmllZEVycm9yICYmIGJpbmRpbmcucGVybWlzc2lvbkRlbmllZFRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdwZXJtaXNzaW9uRGVuaWVkVGVtcGxhdGVVcmwnKTtcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvciA9PT0gUGVybWlzc2lvbkRlbmllZEVycm9yICYmIGJpbmRpbmcucGVybWlzc2lvbkRlbmllZENvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVybiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsICdwZXJtaXNzaW9uRGVuaWVkQ29tcG9uZW50Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmluZGluZy5yZXNvbHZpbmdFcnJvckNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVybiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dFcnJvcihlcnJvciwgZWxlbWVudCwgYmluZGluZykge1xuICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoYmluZGluZy5lcnJvclRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLmVycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93RXJyb3JUZW1wbGF0ZSA9IChlbGVtZW50LCBiaW5kaW5nKSA9PiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCAnZXJyb3JUZW1wbGF0ZVVybCcpO1xuXG4gICAgICBmdW5jdGlvbiBzaG93QmFzaWNUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nLCB0ZW1wbGF0ZUZpZWxkKSB7XG4gICAgICAgIGlmICghYmluZGluZ1t0ZW1wbGF0ZUZpZWxkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRlbXBsYXRlUmVxdWVzdChiaW5kaW5nW3RlbXBsYXRlRmllbGRdKS50aGVuKGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgY29uc3QgbGluayA9ICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSk7XG4gICAgICAgICAgdmlld1Njb3BlID0gdmlld0RpcmVjdGl2ZVNjb3BlLiRuZXcoKTtcbiAgICAgICAgICB2aWV3Q29udHJvbGxlciA9IHt9O1xuICAgICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICAgIGJpbmRpbmdDb21wb25lbnRGaWVsZCA9ICdlcnJvckNvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFiaW5kaW5nW2JpbmRpbmdDb21wb25lbnRGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHtkZXBlbmRlbmNpZXM6IHtlcnJvcn19O1xuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBhcmdzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncykge1xuICAgICAgICBjb25zdCB7ZGVwZW5kZW5jaWVzfSA9IGFyZ3M7XG4gICAgICAgIGNvbnN0IHt0ZW1wbGF0ZX0gPSBhcmdzO1xuXG4gICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuICAgICAgICB2aWV3Q29udHJvbGxlciA9IHt9O1xuXG4gICAgICAgIGlmIChjb21wb25lbnQuY29udHJvbGxlcikge1xuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IF8ubWVyZ2UoZGVwZW5kZW5jaWVzLCB7JHNjb3BlOiB2aWV3U2NvcGUsICRlbGVtZW50OiBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCl9KTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2aWV3Q29udHJvbGxlciA9ICRjb250cm9sbGVyKGNvbXBvbmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICAgICAgbG9jYWxzLiRzY29wZVtjb21wb25lbnQuY29udHJvbGxlckFzXSA9IHZpZXdDb250cm9sbGVyO1xuICAgICAgICAgICAgaWYgKHZpZXdDb250cm9sbGVyLiRvbkluaXQpIHsgdmlld0NvbnRyb2xsZXIuJG9uSW5pdCgpOyB9XG4gICAgICAgICAgfSAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2U7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KGVycm9yKSkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGVycm9yKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gJ0ZhaWxlZCB0byBzZXJpYWxpemUgZXJyb3Igb2JqZWN0IGZvciBsb2dnaW5nJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGxvZy5lcnJvcihgRmFpbGVkIGluc3RhbnRpYXRpbmcgY29udHJvbGxlciBmb3IgdmlldyAke3ZpZXd9OiAke2Vycm9yTWVzc2FnZX1gKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc29sdmUgPSBmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICBpZiAoIWJpbmRpbmcucmVzb2x2ZSB8fCAoT2JqZWN0LmtleXMoYmluZGluZy5yZXNvbHZlKS5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgY29uc3QgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe30pO1xuICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVuY3lOYW1lIGluIGJpbmRpbmcucmVzb2x2ZSkge1xuICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lGYWN0b3J5ID0gYmluZGluZy5yZXNvbHZlW2RlcGVuZGVuY3lOYW1lXTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJGluamVjdG9yLmludm9rZShkZXBlbmRlbmN5RmFjdG9yeSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwZW5kZW5jeU5hbWVdID0gJHEucmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZyA9IGJpbmRpbmcgPT4gXy51bmlvbihiaW5kaW5nLnJlcXVpcmVkU3RhdGUgfHwgW10sIGJpbmRpbmcud2F0Y2hlZFN0YXRlIHx8IFtdKTtcblxuICAgICAgZnVuY3Rpb24gc3RyaXBOZWdhdGlvblByZWZpeChzdHIpIHtcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoMCkgPT09ICchJykge1xuICAgICAgICAgIHJldHVybiBzdHIuc3Vic3RyKDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyA9IHZpZXcgPT4gXy5mbGF0dGVuKF8ubWFwKHZpZXcuZ2V0QmluZGluZ3MoKSwgZ2V0U3RhdGVGaWVsZHNGcm9tQmluZGluZykpO1xuXG4gICAgICBjb25zdCBnZXRGaWVsZHNUb1dhdGNoID0gdmlldyA9PiBfLnVuaXEoXy5tYXAoZ2V0U3RhdGVGaWVsZHNGcm9tVmlldyh2aWV3KSwgc3RyaXBOZWdhdGlvblByZWZpeCkpO1xuXG4gICAgICBjb25zdCBmaWVsZHMgPSBnZXRGaWVsZHNUb1dhdGNoKHZpZXcpO1xuXG4gICAgICByZXR1cm4gUm91dGUud2hlblJlYWR5KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgLy8gVHJ5IHRvIHN0YXJ0IHRoZSBiYWxsIHJvbGxpbmcgaW4gY2FzZSB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyBhbmQgd2UgY2FuIGNyZWF0ZSB0aGUgdmlldyBpbW1lZGlhdGVseVxuICAgICAgICBtYW5hZ2VWaWV3KGlFbGVtZW50LCBiaW5kaW5ncyk7XG4gICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIERvbid0IGJvdGhlciBwdXR0aW5nIGluIGEgd2F0Y2hlciBpZiB0aGVyZSdzIG5vIGRlcGVuZGVuY2llcyB0aGF0IHdpbGwgZXZlciB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50XG4gICAgICAgIGlmIChmaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdGVXYXRjaGVyID0gZnVuY3Rpb24gKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgICBpZiAodmlld01hbmFnZW1lbnRQZW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBmaW5pc2ggdGhlIGRpZ2VzdCBjeWNsZSBiZWZvcmUgYnVpbGRpbmcgdGhlIHZpZXcsIHdoaWNoIHNob3VsZFxuICAgICAgICAgIC8vIHByZXZlbnQgdXMgZnJvbSByZS1yZW5kZXJpbmcgYSB2aWV3IG11bHRpcGxlIHRpbWVzIGlmIG11bHRpcGxlIHByb3BlcnRpZXMgb2YgdGhlIHNhbWUgc3RhdGUgZGVwZW5kZW5jeVxuICAgICAgICAgIC8vIGdldCBjaGFuZ2VkIHdpdGggcmVwZWF0ZWQgU3RhdGUuc2V0IGNhbGxzXG4gICAgICAgICAgcmV0dXJuICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgICAgIHJldHVybiB2aWV3TWFuYWdlbWVudFBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBTdGF0ZS53YXRjaChmaWVsZHMsIHN0YXRlV2F0Y2hlcik7XG5cbiAgICAgICAgdmlld0RpcmVjdGl2ZVNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiBTdGF0ZS5yZW1vdmVXYXRjaGVyKHN0YXRlV2F0Y2hlcikpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgndmlldycsIHJvdXRlVmlld0ZhY3RvcnkpO1xuXG5jbGFzcyBQZW5kaW5nVmlld0NvdW50ZXIge1xuICBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy4kcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50O1xuICB9XG5cbiAgaW5jcmVhc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQgKz0gMTtcbiAgfVxuXG4gIGRlY3JlYXNlKCkge1xuICAgIHRoaXMuY291bnQgPSBNYXRoLm1heCgwLCB0aGlzLmNvdW50IC0gMSk7XG4gICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgIGlmICghdGhpcy5pbml0aWFsVmlld3NMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5pbml0aWFsVmlld3NMb2FkZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiaWNrZXJfcm91dGVyLmN1cnJlbnRWaWV3c0xvYWRlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxWaWV3c0xvYWRlZCA9IGZhbHNlO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnUGVuZGluZ1ZpZXdDb3VudGVyJywgKCRyb290U2NvcGUpID0+IHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIG5ldyBQZW5kaW5nVmlld0NvdW50ZXIoJHJvb3RTY29wZSk7XG59KTtcblxuY2xhc3MgV2F0Y2hhYmxlTGlzdCB7XG4gIGNvbnN0cnVjdG9yKE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnksIGxpc3QpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlciA9IE9iamVjdEhlbHBlcjtcbiAgICB0aGlzLldhdGNoZXJGYWN0b3J5ID0gV2F0Y2hlckZhY3Rvcnk7XG5cbiAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgIHRoaXMud2F0Y2hlcnMgPSBbXTtcbiAgfVxuXG4gIGdldChwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHBhdGgpO1xuICB9XG5cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLmxpc3Q7XG4gIH1cblxuICBnZXRTdWJzZXQocGF0aHMpIHtcbiAgICByZXR1cm4gXy56aXBPYmplY3QocGF0aHMsIF8ubWFwKHBhdGhzLCB0aGlzLmdldC5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBzZXQocGF0aCwgdmFsdWUpIHtcbiAgICB0aGlzLk9iamVjdEhlbHBlci5zZXQodGhpcy5saXN0LCBwYXRoLCB2YWx1ZSk7XG4gICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdmFsdWUpO1xuICB9XG5cbiAgdW5zZXQocGF0aHMpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMuT2JqZWN0SGVscGVyLnVuc2V0KHRoaXMubGlzdCwgcGF0aCk7XG4gICAgICB0aGlzLl9ub3RpZnlXYXRjaGVycyhwYXRoLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgd2F0Y2gocGF0aHMsIGhhbmRsZXIpIHtcbiAgICBpZiAoIShwYXRocyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgcGF0aHMgPSBbcGF0aHNdO1xuICAgIH1cblxuICAgIF8ocGF0aHMpLmVhY2goKHBhdGgpID0+IHtcbiAgICAgIHRoaXMud2F0Y2hlcnMucHVzaCh0aGlzLldhdGNoZXJGYWN0b3J5LmNyZWF0ZShwYXRoLCBoYW5kbGVyLCB0aGlzLmdldChwYXRoKSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlV2F0Y2hlcih3YXRjaGVyKSB7XG4gICAgaWYgKHRoaXMud2F0Y2hlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld1dhdGNoZXJzID0gW107XG5cbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgdGhpc1dhdGNoZXIgPT4ge1xuICAgICAgaWYgKHRoaXNXYXRjaGVyLmhhbmRsZXIgIT09IHdhdGNoZXIpIHtcbiAgICAgICAgbmV3V2F0Y2hlcnMucHVzaCh0aGlzV2F0Y2hlcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy53YXRjaGVycyA9IG5ld1dhdGNoZXJzO1xuICB9XG5cbiAgX25vdGlmeVdhdGNoZXJzKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIF8uZWFjaCh0aGlzLndhdGNoZXJzLCB3YXRjaGVyID0+IHtcbiAgICAgIGlmICh3YXRjaGVyLnNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCA9IHRoaXMuT2JqZWN0SGVscGVyLmdldCh0aGlzLmxpc3QsIHdhdGNoZXIud2F0Y2hQYXRoKTtcbiAgICAgICAgd2F0Y2hlci5ub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlQXRXYXRjaGVkUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hhYmxlTGlzdEZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuICB9XG5cbiAgY3JlYXRlKGxpc3QgPSB7fSkge1xuICAgIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdCh0aGlzLk9iamVjdEhlbHBlciwgdGhpcy5XYXRjaGVyRmFjdG9yeSwgbGlzdCk7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5mYWN0b3J5KCdXYXRjaGFibGVMaXN0RmFjdG9yeScsIChPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5KSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgV2F0Y2hhYmxlTGlzdEZhY3RvcnkoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSk7XG59KTtcblxuY2xhc3MgV2F0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy53YXRjaFBhdGggPSB3YXRjaFBhdGg7XG4gICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IF8uY2xvbmVEZWVwKGluaXRpYWxWYWx1ZSk7XG4gIH1cblxuICBfdG9rZW5pemVQYXRoKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLicpO1xuICB9XG5cbiAgc2hvdWxkTm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSkge1xuICAgIC8vIE5CIHNob3J0IGNpcmN1aXQgbG9naWMgaW4gdGhlIHNpbXBsZSBjYXNlXG4gICAgaWYgKHRoaXMud2F0Y2hQYXRoID09PSBjaGFuZ2VkUGF0aCkge1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyh0aGlzLmN1cnJlbnRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0IHdhdGNoID0ge1xuICAgICAgcGF0aDogdGhpcy53YXRjaFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aCh0aGlzLndhdGNoUGF0aCksXG4gICAgICB2YWx1ZTogdGhpcy5jdXJyZW50VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgY2hhbmdlID0ge1xuICAgICAgcGF0aDogY2hhbmdlZFBhdGgsXG4gICAgICB0b2tlbnM6IHRoaXMuX3Rva2VuaXplUGF0aChjaGFuZ2VkUGF0aCksXG4gICAgICB2YWx1ZTogbmV3VmFsdWVcbiAgICB9O1xuXG4gICAgY29uc3QgbWluaW11bUxlbnRoID0gTWF0aC5taW4oY2hhbmdlLnRva2Vucy5sZW5ndGgsIHdhdGNoLnRva2Vucy5sZW5ndGgpO1xuICAgIGZvciAobGV0IHRva2VuSW5kZXggPSAwOyB0b2tlbkluZGV4IDwgbWluaW11bUxlbnRoOyB0b2tlbkluZGV4KyspIHtcbiAgICAgIGlmICh3YXRjaC50b2tlbnNbdG9rZW5JbmRleF0gIT09IGNoYW5nZS50b2tlbnNbdG9rZW5JbmRleF0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5CIGlmIHdlIGdldCBoZXJlIHRoZW4gYWxsIGNvbW1vbiB0b2tlbnMgbWF0Y2hcblxuICAgIGNvbnN0IGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQgPSBjaGFuZ2UudG9rZW5zLmxlbmd0aCA+IHdhdGNoLnRva2Vucy5sZW5ndGg7XG5cbiAgICBpZiAoY2hhbmdlUGF0aElzRGVzY2VuZGFudCkge1xuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gY2hhbmdlLnRva2Vucy5zbGljZSh3YXRjaC50b2tlbnMubGVuZ3RoKS5qb2luKCcuJyk7XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoID0gXy5nZXQod2F0Y2gudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKGN1cnJlbnRWYWx1ZUF0Q2hhbmdlZFBhdGgsIGNoYW5nZS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHdhdGNoLnRva2Vucy5zbGljZShjaGFuZ2UudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgbmV3VmFsdWVBdFdhdGNoUGF0aCA9IF8uZ2V0KGNoYW5nZS52YWx1ZSwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMod2F0Y2gudmFsdWUsIG5ld1ZhbHVlQXRXYXRjaFBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICB0aGlzLmhhbmRsZXIoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCB0aGlzLmN1cnJlbnRWYWx1ZSk7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChuZXdWYWx1ZSk7XG4gIH1cbn1cblxuY2xhc3MgV2F0Y2hlckZhY3Rvcnkge1xuICBjcmVhdGUod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUgPSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoZXIod2F0Y2hQYXRoLCBoYW5kbGVyLCBpbml0aWFsVmFsdWUpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hlckZhY3RvcnknLCAoKSA9PiB7XG4gIHJldHVybiBuZXcgV2F0Y2hlckZhY3RvcnkoKTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdSb3V0ZScsIGZ1bmN0aW9uKE9iamVjdEhlbHBlcikge1xuICBcIm5nSW5qZWN0XCI7XG4gIGNvbnN0IHRva2VucyA9IHt9O1xuICBjb25zdCB1cmxXcml0ZXJzID0gW107XG4gIGNvbnN0IHVybHMgPSBbXTtcbiAgY29uc3QgcGVyc2lzdGVudFN0YXRlcyA9IFtdO1xuICBjb25zdCByZWFkeSA9IGZhbHNlO1xuICBjb25zdCB0eXBlcyA9IHt9O1xuICBsZXQgaHRtbDVNb2RlID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvdmlkZXIgPSB7XG5cbiAgICByZWdpc3RlclR5cGUobmFtZSwgY29uZmlnKSB7XG4gICAgICB0eXBlc1tuYW1lXSA9IGNvbmZpZztcbiAgICAgIHR5cGVzW25hbWVdLnJlZ2V4ID0gbmV3IFJlZ0V4cCh0eXBlc1tuYW1lXS5yZWdleC5zb3VyY2UsICdpJyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJUeXBlIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFRva2VuKG5hbWUsIGNvbmZpZykge1xuICAgICAgdG9rZW5zW25hbWVdID0gXy5leHRlbmQoe25hbWV9LCBjb25maWcpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsVG9rZW4gfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsV3JpdGVyKG5hbWUsIGZuKSB7XG4gICAgICB1cmxXcml0ZXJzW25hbWVdID0gZm47XG4gICAgICByZXR1cm4gXy5leHRlbmQoeyBhbmQ6IHRoaXMucmVnaXN0ZXJVcmxXcml0ZXIgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIHJlZ2lzdGVyVXJsKHBhdHRlcm4sIGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25zdCB1cmxEYXRhID0ge1xuICAgICAgICBjb21waWxlZFVybDogdGhpcy5fY29tcGlsZVVybFBhdHRlcm4ocGF0dGVybiwgY29uZmlnKSxcbiAgICAgICAgcGF0dGVyblxuICAgICAgfTtcblxuICAgICAgdXJscy5wdXNoKF8uZXh0ZW5kKHVybERhdGEsIGNvbmZpZykpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBzZXRQZXJzaXN0ZW50U3RhdGVzKC4uLnN0YXRlTGlzdCkge1xuICAgICAgXy5mb3JFYWNoKHN0YXRlTGlzdCwgKHN0YXRlKSA9PiB7XG4gICAgICAgIGlmICghXy5pbmNsdWRlcyhwZXJzaXN0ZW50U3RhdGVzLCBzdGF0ZSkpIHtcbiAgICAgICAgICBwZXJzaXN0ZW50U3RhdGVzLnB1c2goc3RhdGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2V0SHRtbDVNb2RlKG1vZGUpIHtcbiAgICAgIGh0bWw1TW9kZSA9IG1vZGU7XG4gICAgfSxcblxuICAgIF9jb21waWxlVXJsUGF0dGVybih1cmxQYXR0ZXJuLCBjb25maWcpIHtcbiAgICAgIGxldCBtYXRjaDtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lc2NhcGVSZWdleFNwZWNpYWxDaGFyYWN0ZXJzKHVybFBhdHRlcm4pO1xuICAgICAgdXJsUGF0dGVybiA9IHRoaXMuX2Vuc3VyZU9wdGlvbmFsVHJhaWxpbmdTbGFzaCh1cmxQYXR0ZXJuKTtcblxuICAgICAgY29uc3QgdG9rZW5SZWdleCA9IC9cXHsoW0EtWmEtelxcLl8wLTldKylcXH0vZztcbiAgICAgIGxldCB1cmxSZWdleCA9IHVybFBhdHRlcm47XG5cbiAgICAgIGlmICghY29uZmlnLnBhcnRpYWxNYXRjaCkge1xuICAgICAgICB1cmxSZWdleCA9IGBeJHt1cmxSZWdleH0kYDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG9rZW5MaXN0ID0gW107XG5cbiAgICAgIHdoaWxlICgobWF0Y2ggPSB0b2tlblJlZ2V4LmV4ZWModXJsUGF0dGVybikpICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW21hdGNoWzFdXTtcbiAgICAgICAgdG9rZW5MaXN0LnB1c2godG9rZW4pO1xuICAgICAgICB1cmxSZWdleCA9IHVybFJlZ2V4LnJlcGxhY2UobWF0Y2hbMF0sIGAoJHt0eXBlc1t0b2tlbi50eXBlXS5yZWdleC5zb3VyY2V9KWApO1xuICAgICAgfVxuXG4gICAgICB1cmxSZWdleC5yZXBsYWNlKCcuJywgJ1xcXFwuJyk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKHVybFJlZ2V4LCAnaScpLFxuICAgICAgICB0b2tlbnM6IHRva2VuTGlzdFxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2Vuc3VyZU9wdGlvbmFsVHJhaWxpbmdTbGFzaChzdHIpIHtcbiAgICAgIGlmIChzdHIubWF0Y2goL1xcLyQvKSkge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcLyQvLCAnLz8nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgJHtzdHJ9Lz9gO1xuICAgIH0sXG5cbiAgICBfZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyhzdHIpIHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xcKFxcKVxcKlxcK1xcP1xcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCRsb2NhdGlvbiwgJGluamVjdG9yLCAkcSkge1xuICAgICAgJ25nSW5qZWN0JztcblxuICAgICAgLy8gV2hlbiBnZXR0aW5nIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlIChvbmx5IGRvbmUgb25jZSksIHdlIG5lZWQgdG8gaXRlcmF0ZSBvdmVyIHRoZSB1cmxXcml0ZXJzIGFuZCB0dXJuXG4gICAgICAvLyB0aGVtIGludG8gbWV0aG9kcyB0aGF0IGludm9rZSB0aGUgUkVBTCB1cmxXcml0ZXIsIGJ1dCBwcm92aWRpbmcgZGVwZW5kZW5jeSBpbmplY3Rpb24gdG8gaXQsIHdoaWxlIGFsc29cbiAgICAgIC8vIGdpdmluZyBpdCB0aGUgZGF0YSB0aGF0IHRoZSBjYWxsZWUgcGFzc2VzIGluLlxuXG4gICAgICAvLyBUaGUgcmVhc29uIHdlIGhhdmUgdG8gZG8gdGhpcyBoZXJlIGlzIGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gdGhlICRpbmplY3RvciBiYWNrIGluIHRoZSByb3V0ZVByb3ZpZGVyLlxuXG4gICAgICBfLmZvckluKHVybFdyaXRlcnMsICh3cml0ZXIsIHdyaXRlck5hbWUpID0+XG4gICAgICAgIHVybFdyaXRlcnNbd3JpdGVyTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgaWYgKCFkYXRhKSB7IGRhdGEgPSB7fTsgfVxuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IHtVcmxEYXRhOiBkYXRhfTtcbiAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmludm9rZSh3cml0ZXIsIHt9LCBsb2NhbHMpO1xuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICBsZXQgZmxhc2hTdGF0ZXMgPSBbXTtcblxuICAgICAgY29uc3Qgc2VydmljZSA9IHtcbiAgICAgICAgY3VycmVudEJpbmRpbmdzOiB7fSxcbiAgICAgICAgcmVhZHlEZWZlcnJlZDogJHEuZGVmZXIoKSxcblxuICAgICAgICBtYXRjaCh1cmxUb01hdGNoKSB7XG4gICAgICAgICAgZm9yIChjb25zdCB1cmwgb2YgQXJyYXkuZnJvbSh1cmxzKSkge1xuICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHVybC5jb21waWxlZFVybC5yZWdleC5leGVjKHVybFRvTWF0Y2gpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4ge3VybCwgcmVnZXhNYXRjaDogbWF0Y2h9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0RGF0YShtYXRjaCwgc2VhcmNoRGF0YSA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IGRlZmF1bHRzID0gdGhpcy5leHRyYWN0RGVmYXVsdERhdGEobWF0Y2gpO1xuICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmV4dHJhY3RQYXRoRGF0YShtYXRjaCk7XG4gICAgICAgICAgc2VhcmNoRGF0YSA9IHRoaXMuZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdEhlbHBlci5kZWZhdWx0KHNlYXJjaERhdGEsIHBhdGgsIGRlZmF1bHRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0U2VhcmNoRGF0YShzZWFyY2hEYXRhKSB7XG4gICAgICAgICAgaWYgKCFzZWFyY2hEYXRhKSB7IHNlYXJjaERhdGEgPSAkbG9jYXRpb24uc2VhcmNoKCk7IH1cbiAgICAgICAgICBjb25zdCBkYXRhID0gXy5jbG9uZShzZWFyY2hEYXRhKTtcbiAgICAgICAgICBjb25zdCBuZXdEYXRhID0ge307XG5cbiAgICAgICAgICBfLmZvckVhY2goZGF0YSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRLZXkgPSBfLmZpbmRLZXkodG9rZW5zLCB7IHNlYXJjaEFsaWFzOiBrZXkgfSk7XG4gICAgICAgICAgICBpZiAoIXRhcmdldEtleSkgeyB0YXJnZXRLZXkgPSBrZXk7IH1cblxuICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlTmFtZSA9IHRva2Vuc1t0YXJnZXRLZXldID8gXy5nZXQodG9rZW5zW3RhcmdldEtleV0sICd0eXBlJykgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoIXRva2Vuc1t0YXJnZXRLZXldIHx8ICh0eXBlc1t0b2tlblR5cGVOYW1lXS5yZWdleC50ZXN0KHZhbHVlKSkpIHtcblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblR5cGUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IHRva2Vuc1t0YXJnZXRLZXldLnR5cGUgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IHR5cGVUb2tlblR5cGUgPSB0b2tlblR5cGUgPyB0eXBlc1t0b2tlblR5cGVdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0b2tlblR5cGVQYXJzZWQgPSB0eXBlVG9rZW5UeXBlID8gdHlwZVRva2VuVHlwZS5wYXJzZXIgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgaWYgKHRva2VuVHlwZVBhcnNlZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0b2tlblR5cGVQYXJzZWQsIG51bGwsIHt0b2tlbjogdmFsdWV9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHRva2VuVGFyZ2V0S2V5U3RhdGVQYXRoID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS5zdGF0ZVBhdGggOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGNvbnN0IGRhdGFLZXkgPSB0b2tlblRhcmdldEtleVN0YXRlUGF0aCB8fCB0YXJnZXRLZXk7XG5cbiAgICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChuZXdEYXRhLCBkYXRhS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gbmV3RGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0RGVmYXVsdERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICAgICAgICBfLmZvckVhY2gobWF0Y2gudXJsLnN0YXRlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0SGVscGVyLnNldChkYXRhLCBrZXksICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnID8gXy5jbG9uZURlZXAodmFsdWUpIDogdmFsdWUpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGV4dHJhY3RQYXRoRGF0YShtYXRjaCkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgICBjb25zdCBwYXRoVG9rZW5zID0gbWF0Y2gudXJsLmNvbXBpbGVkVXJsLnRva2VucztcblxuICAgICAgICAgIGlmIChwYXRoVG9rZW5zLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4ge307IH1cblxuICAgICAgICAgIGZvciAobGV0IG4gPSAwLCBlbmQgPSBwYXRoVG9rZW5zLmxlbmd0aC0xLCBhc2MgPSAwIDw9IGVuZDsgYXNjID8gbiA8PSBlbmQgOiBuID49IGVuZDsgYXNjID8gbisrIDogbi0tKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnNbbl07XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBtYXRjaC5yZWdleE1hdGNoW24rMV07XG5cbiAgICAgICAgICAgIGlmICh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIpIHsgdmFsdWUgPSAkaW5qZWN0b3IuaW52b2tlKHR5cGVzW3Rva2VuLnR5cGVdLnBhcnNlciwgbnVsbCwge3Rva2VuOiB2YWx1ZX0pOyB9XG5cbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwgKHRva2VuLnN0YXRlUGF0aCB8fCB0b2tlbi5uYW1lKSwgdmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcnMoKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VXJsV3JpdGVyKG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdXJsV3JpdGVyc1tuYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbnZva2VVcmxXcml0ZXIobmFtZSwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV0oZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ28obmFtZSwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgcmV0dXJuICRsb2NhdGlvbi51cmwodGhpcy5pbnZva2VVcmxXcml0ZXIobmFtZSwgZGF0YSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFBlcnNpc3RlbnRTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIHBlcnNpc3RlbnRTdGF0ZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzZXRGbGFzaFN0YXRlcygpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IFtdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZEZsYXNoU3RhdGVzKC4uLm5ld1N0YXRlcykge1xuICAgICAgICAgIGZsYXNoU3RhdGVzID0gZmxhc2hTdGF0ZXMuY29uY2F0KG5ld1N0YXRlcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIGZsYXNoU3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lLCBiaW5kaW5nKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdID0gYmluZGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCaW5kaW5nc1t2aWV3TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVsZXRlQ3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1hdGNoZXNDdXJyZW50QmluZGluZ05hbWUodmlld05hbWUsIGJpbmRpbmdOYW1lRXhwcmVzc2lvbikge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRCaW5kaW5nID0gdGhpcy5nZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSk7XG5cbiAgICAgICAgICBpZiAoIWN1cnJlbnRCaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGJpbmRpbmdOYW1lRXhwcmVzc2lvbiBpbnN0YW5jZW9mIFJlZ0V4cCA/XG4gICAgICAgICAgICBiaW5kaW5nTmFtZUV4cHJlc3Npb24udGVzdChjdXJyZW50QmluZGluZy5uYW1lKSA6XG4gICAgICAgICAgICBjdXJyZW50QmluZGluZy5uYW1lID09PSBiaW5kaW5nTmFtZUV4cHJlc3Npb247XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UmVhZHkocmVhZHkpIHtcbiAgICAgICAgICBpZiAoIXJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWR5RGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNSZWFkeSgpIHtcbiAgICAgICAgICByZXR1cm4gcmVhZHk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNIdG1sNU1vZGVFbmFibGVkKCkge1xuICAgICAgICAgIHJldHVybiBodG1sNU1vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2hlblJlYWR5KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5RGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfVxuICB9O1xuXG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbnVtZXJpYycsIHtyZWdleDogL1xcZCsvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiBwYXJzZUludCh0b2tlbildfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYWxwaGEnLCB7cmVnZXg6IC9bYS16QS1aXSsvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnYW55Jywge3JlZ2V4OiAvLisvfSk7XG4gIHByb3ZpZGVyLnJlZ2lzdGVyVHlwZSgnbGlzdCcsIHtyZWdleDogLy4rLywgcGFyc2VyOiBbJ3Rva2VuJywgdG9rZW4gPT4gdG9rZW4uc3BsaXQoJywnKV19KTtcblxuICByZXR1cm4gcHJvdmlkZXI7XG59KTtcblxuY2xhc3MgU3RhdGVQcm92aWRlciB7XG4gICRnZXQoV2F0Y2hhYmxlTGlzdEZhY3RvcnkpIHtcbiAgICAnbmdJbmplY3QnO1xuICAgIHJldHVybiBXYXRjaGFibGVMaXN0RmFjdG9yeS5jcmVhdGUoKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdTdGF0ZScsIG5ldyBTdGF0ZVByb3ZpZGVyKTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignVmlld0JpbmRpbmdzJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCB2aWV3cyA9IFtdO1xuXG4gIGNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJpbmRpbmdzKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgICAgaWYgKCEodGhpcy5iaW5kaW5ncyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0gW3RoaXMuYmluZGluZ3NdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEJpbmRpbmdzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3M7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcblxuICAgIGJpbmQobmFtZSwgY29uZmlnKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShiaW5kaW5ncywgY29tbW9uUmVxdWlyZWRTdGF0ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKCEoYmluZGluZy5yZXF1aXJlZFN0YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBbYmluZGluZy5yZXF1aXJlZFN0YXRlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goYmluZGluZy5yZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlLmNvbmNhdChjb21tb25SZXF1aXJlZFN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXNvbHZlKGJpbmRpbmdzLCBjb21tb25SZXNvbHZlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoISgncmVzb2x2ZScgaW4gYmluZGluZykpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVzb2x2ZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChfLmRlZmF1bHRzKGJpbmRpbmcucmVzb2x2ZSwgY29tbW9uUmVzb2x2ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5Q29tbW9uRmllbGRzKG5ld0JpbmRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJhc2ljQ29tbW9uRmllbGRzID0gW1xuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUGVybWlzc2lvbkRlbmllZFRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ3Blcm1pc3Npb25EZW5pZWRUZW1wbGF0ZVVybCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUGVybWlzc2lvbkRlbmllZENvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdwZXJtaXNzaW9uRGVuaWVkQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdUZW1wbGF0ZVVybCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uUmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJ30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdyZXNvbHZpbmdFcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JDb21wb25lbnQnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JDb21wb25lbnQnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vbkVycm9yVGVtcGxhdGVVcmwnLCBvdmVycmlkZUZpZWxkOiAnZXJyb3JUZW1wbGF0ZVVybCd9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCBjb21tb25GaWVsZCBvZiBBcnJheS5mcm9tKGJhc2ljQ29tbW9uRmllbGRzKSkge1xuICAgICAgICAgIGlmIChjb21tb25GaWVsZC5uYW1lIGluIGNvbmZpZykge1xuICAgICAgICAgICAgZGVmYXVsdEJpbmRpbmdGaWVsZChuZXdCaW5kaW5ncywgY29tbW9uRmllbGQub3ZlcnJpZGVGaWVsZCwgY29uZmlnW2NvbW1vbkZpZWxkLm5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlcXVpcmVkU3RhdGUnIGluIGNvbmZpZykge1xuICAgICAgICAgIGFwcGx5Q29tbW9uUmVxdWlyZWRTdGF0ZShuZXdCaW5kaW5ncywgY29uZmlnWydjb21tb25SZXF1aXJlZFN0YXRlJ10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdjb21tb25SZXNvbHZlJyBpbiBjb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb21tb25SZXNvbHZlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlc29sdmUnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdEJpbmRpbmdGaWVsZChiaW5kaW5ncywgZmllbGROYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgIGlmICghKGZpZWxkTmFtZSBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgaXRlbSA9IGJpbmRpbmdbZmllbGROYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0JpbmRpbmdzID0gW107XG4gICAgICBpZiAoJ2JpbmRpbmdzJyBpbiBjb25maWcpIHtcbiAgICAgICAgbmV3QmluZGluZ3MgPSBjb25maWdbJ2JpbmRpbmdzJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IChjb25maWcgaW5zdGFuY2VvZiBBcnJheSkgPyBjb25maWcgOiBbY29uZmlnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3QmluZGluZ3MubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gVmlld0JpbmRpbmdzUHJvdmlkZXIuYmluZCBmb3IgbmFtZSAnJHtuYW1lfSdgKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHZpZXdzW25hbWVdID0gbmV3IFZpZXcobmFtZSwgbmV3QmluZGluZ3MpO1xuICAgIH0sXG5cbiAgICAkZ2V0KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0Vmlldyh2aWV3KSB7XG4gICAgICAgICAgcmV0dXJuIHZpZXdzW3ZpZXddO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
