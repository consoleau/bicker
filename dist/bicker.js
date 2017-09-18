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

    setTimeout(function () {
      var eventData = { 'viewName': Route.getCurrentViewName() };
      $rootScope.$emit('bicker_router.$locationChangeSuccess', eventData);
    }, 1);

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
        getCurrentViewName: function getCurrentViewName() {
          if (this.currentBindings['main.content']) {
            return this.currentBindings['main.content'].name;
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFpQixDQUFoQyxBQUFnQyxBQUFDLGNBQWpDLEFBQStDLHdGQUFJLFVBQUEsQUFBVSxPQUFWLEFBQWlCLE9BQWpCLEFBQXdCLFdBQXhCLEFBQW1DLFlBQW5DLEFBQStDLGNBQS9DLEFBQTZELG9CQUFvQixBQUNsSTtBQUVBOztNQUFJLFNBQUosQUFBYSxBQUNiO2FBQUEsQUFBVyxJQUFYLEFBQWUsd0JBQXdCLFlBQVksQUFDakQ7UUFBSSxNQUFKLEFBQUksQUFBTSxXQUFXLEFBQ25CO1lBQUEsQUFBTSxTQUFOLEFBQWUsQUFDaEI7QUFDRjtBQUpELEFBTUE7O2FBQUEsQUFBVyxJQUFYLEFBQWUsMEJBQTBCLFVBQUEsQUFBVSxHQUFWLEFBQWEsUUFBUSxBQUU1RDs7ZUFBVyxZQUFXLEFBQ3BCO1VBQU0sWUFBWSxFQUFDLFlBQVksTUFBL0IsQUFBa0IsQUFBYSxBQUFNLEFBQ3JDO2lCQUFBLEFBQVcsTUFBWCxBQUFpQix3Q0FBakIsQUFBeUQsQUFDMUQ7QUFIRCxPQUFBLEFBR0csQUFFSDs7QUFDQTtRQUFJLFlBQUosQUFDQTtRQUFJLFdBQUosQUFBZSxRQUFRLEFBQ3JCO0FBQ0Q7QUFFRDs7YUFBQSxBQUFTLEFBRVQ7O3VCQUFBLEFBQW1CLEFBQ25CO1FBQU0sUUFBUSxNQUFBLEFBQU0sTUFBTSxVQUExQixBQUFjLEFBQVksQUFBVSxBQUVwQzs7UUFBSSxDQUFKLEFBQUssT0FBTyxBQUNWO2FBQUEsQUFBTyxBQUNSO0FBRkQsV0FFTyxBQUNMO2FBQU8sTUFBQSxBQUFNLFlBQWIsQUFBTyxBQUFrQixBQUMxQjtBQUVEOztRQUFJLGdCQUFnQixhQUFBLEFBQWEsTUFBTSxNQUFuQixBQUF5QixNQUE3QyxBQUFvQixBQUErQixBQUNuRDtvQkFBZ0IsRUFBQSxBQUFFLFdBQUYsQUFBYSxlQUFlLE1BQUEsQUFBTSxzQkFBTixBQUE0QixPQUFPLE1BQS9FLEFBQWdCLEFBQTRCLEFBQW1DLEFBQU0sQUFFckY7O1FBQU0sWUFBWSxFQUFDLFdBQUQsQUFBWSxlQUFlLFNBQTdDLEFBQWtCLEFBQW9DLEFBRXREOztlQUFBLEFBQVcsTUFBWCxBQUFpQixtQ0FBakIsQUFBb0QsQUFFcEQ7O1FBQUssVUFBRCxBQUFXLFVBQVgsQUFBc0IsV0FBMUIsQUFBcUMsR0FBRyxBQUN0QztZQUFBLEFBQU0sTUFBTSxVQUFaLEFBQXNCLEFBQ3ZCO0FBRUQ7O01BQUEsQUFBRSxRQUFRLFVBQVYsQUFBb0IsU0FBUyxVQUFBLEFBQUMsT0FBRCxBQUFRLEtBQVEsQUFDM0M7WUFBQSxBQUFNLElBQU4sQUFBVSxLQUFWLEFBQWUsQUFDaEI7QUFGRCxBQUlBOztVQUFBLEFBQU0sQUFDTjtVQUFBLEFBQU0sU0FBTixBQUFlLEFBQ2hCO0FBekNELEFBMENEO0FBcEREOztBQXNEQSxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFNBQWhDLEFBQXlDO0FBQWdCLG9CQUFBLEFBQ25ELFFBRG1ELEFBQzNDLE1BQU0sQUFDaEI7UUFBSSxTQUFKLEFBQWEsSUFBSSxBQUFFO2FBQUEsQUFBTyxBQUFTO0FBQ25DO1FBQU0sU0FBUyxLQUFBLEFBQUssTUFBcEIsQUFBZSxBQUFXLEFBQzFCO1FBQU0sTUFBTSxPQUFaLEFBQVksQUFBTyxBQUNuQjtRQUFJLFNBSlksQUFJaEIsQUFBYTs7b0NBSkc7NEJBQUE7eUJBQUE7O1FBTWhCOzJCQUFBLEFBQXNCLG9JQUFRO1lBQW5CLEFBQW1CLGdCQUM1Qjs7aUJBQVMsT0FBVCxBQUFTLEFBQU8sQUFDaEI7WUFBSSxXQUFKLEFBQWUsV0FBVyxBQUFFO2lCQUFBLEFBQU8sQUFBWTtBQUNoRDtBQVRlO2tCQUFBOzBCQUFBO3VCQUFBO2NBQUE7VUFBQTs0REFBQTtvQkFBQTtBQUFBO2dCQUFBOytCQUFBO2dCQUFBO0FBQUE7QUFBQTtBQVdoQjs7V0FBTyxPQUFQLEFBQU8sQUFBTyxBQUNmO0FBYnNELEFBZXZEO0FBZnVELG9CQUFBLEFBZW5ELFFBZm1ELEFBZTNDLE1BZjJDLEFBZXJDLE9BQU8sQUFDdkI7UUFBTSxTQUFTLEtBQUEsQUFBSyxNQUFwQixBQUFlLEFBQVcsQUFDMUI7UUFBTSxNQUFNLE9BQVosQUFBWSxBQUFPLEFBQ25CO1FBQUksU0FIbUIsQUFHdkIsQUFBYTs7cUNBSFU7NkJBQUE7MEJBQUE7O1FBS3ZCOzRCQUFBLEFBQXNCLHlJQUFRO1lBQW5CLEFBQW1CLGlCQUM1Qjs7WUFBSSxPQUFBLEFBQU8sYUFBWCxBQUF3QixXQUFXLEFBQ2pDO2lCQUFBLEFBQU8sV0FBUCxBQUFrQixBQUNuQjtBQUVEOztpQkFBUyxPQUFULEFBQVMsQUFBTyxBQUNqQjtBQVhzQjtrQkFBQTsyQkFBQTt3QkFBQTtjQUFBO1VBQUE7OERBQUE7cUJBQUE7QUFBQTtnQkFBQTtnQ0FBQTtnQkFBQTtBQUFBO0FBQUE7QUFhdkI7O1dBQU8sT0FBQSxBQUFPLE9BQWQsQUFBcUIsQUFDdEI7QUE3QnNELEFBK0J2RDtBQS9CdUQsd0JBQUEsQUErQmpELFFBL0JpRCxBQStCekMsTUFBTSxBQUNsQjtRQUFJLFNBQUosQUFBYSxJQUFJLEFBQUU7YUFBQSxBQUFPLEFBQVM7QUFDbkM7UUFBTSxTQUFTLEtBQUEsQUFBSyxNQUFwQixBQUFlLEFBQVcsQUFDMUI7UUFBTSxNQUFNLE9BQVosQUFBWSxBQUFPLEFBQ25CO1FBQUksU0FKYyxBQUlsQixBQUFhOztxQ0FKSzs2QkFBQTswQkFBQTs7UUFNbEI7NEJBQUEsQUFBc0IseUlBQVE7WUFBbkIsQUFBbUIsaUJBQzVCOztpQkFBUyxPQUFULEFBQVMsQUFBTyxBQUNoQjtZQUFJLFdBQUosQUFBZSxXQUFXLEFBQUU7aUJBQUEsQUFBTyxBQUFRO0FBQzVDO0FBVGlCO2tCQUFBOzJCQUFBO3dCQUFBO2NBQUE7VUFBQTs4REFBQTtxQkFBQTtBQUFBO2dCQUFBO2dDQUFBO2dCQUFBO0FBQUE7QUFBQTtBQVdsQjs7UUFBSSxPQUFBLEFBQU8sU0FBWCxBQUFvQixXQUFXLEFBQUU7YUFBQSxBQUFPLEFBQVE7QUFDaEQ7V0FBTyxPQUFQLEFBQU8sQUFBTyxBQUNkO1dBQUEsQUFBTyxBQUNSO0FBN0NzRCxBQStDdkQ7O0FBQ0E7QUFoRHVELHdCQUFBLEFBZ0RqRCxHQWhEaUQsQUFnRDlDLEdBQWdCO1FBQWIsQUFBYSw2RUFBSixBQUFJLEFBQ3ZCOztRQUFJLFFBQUosQUFBWSxBQUNaO2FBQVMsT0FBQSxBQUFPLFNBQVAsQUFBZ0IsSUFBaEIsQUFBdUIsZUFGVCxBQUV2QixBQUE0Qzs7cUNBRnJCOzZCQUFBOzBCQUFBOztRQUl2Qjs0QkFBa0IsTUFBQSxBQUFNLEtBQUssT0FBQSxBQUFPLEtBQXBDLEFBQWtCLEFBQVcsQUFBWSxzSUFBSztZQUFuQyxBQUFtQyxhQUM1Qzs7WUFBTSxnQkFBQSxBQUFjLFNBQXBCLEFBQTZCLEFBRTdCOztZQUFJLEVBQUEsQUFBRSxTQUFOLEFBQWUsV0FBVyxBQUN4QjtnQkFBQSxBQUFNLEtBQU4sQUFBVyxBQUVaO0FBSEQsZUFHTyxJQUFLLFFBQU8sRUFBUCxBQUFPLEFBQUUsVUFBVixBQUFtQixZQUFjLEVBQUUsRUFBQSxBQUFFLGdCQUF6QyxBQUFxQyxBQUFvQixRQUFTLEFBQ3ZFO2tCQUFRLE1BQUEsQUFBTSxPQUFPLEtBQUEsQUFBSyxNQUFNLEVBQVgsQUFBVyxBQUFFLE1BQU0sRUFBbkIsQUFBbUIsQUFBRSxNQUExQyxBQUFRLEFBQWEsQUFBMkIsQUFDakQ7QUFDRjtBQWJzQjtrQkFBQTsyQkFBQTt3QkFBQTtjQUFBO1VBQUE7OERBQUE7cUJBQUE7QUFBQTtnQkFBQTtnQ0FBQTtnQkFBQTtBQUFBO0FBQUE7QUFldkI7O1dBQUEsQUFBTyxBQUNSO0FBaEVzRCxBQWtFdkQ7QUFsRXVELDZCQUFBLEFBa0UvQyxXQUEyQixBQUNqQztRQUFJLGtCQUFKO1FBQWdCLGFBQWhCLEFBQ0E7UUFBTSxTQUYyQixBQUVqQyxBQUFlOztzQ0FGSyxBQUFhLDZFQUFiO0FBQWEsd0NBQUE7QUFJakM7O1FBQUksWUFBQSxBQUFZLFdBQWhCLEFBQTJCLEdBQUcsQUFDNUI7bUJBQWEsWUFBYixBQUFhLEFBQVksQUFDMUI7QUFGRCxXQUVPLEFBQ0w7bUJBQWEsS0FBQSxBQUFLLHVDQUFXLE1BQUEsQUFBTSxLQUFLLGVBQXhDLEFBQWEsQUFBZ0IsQUFBMEIsQUFDeEQ7QUFFRDs7U0FBSyxJQUFMLEFBQVcsT0FBWCxBQUFrQixZQUFZLEFBQzVCO2NBQVEsV0FBUixBQUFRLEFBQVcsQUFDbkI7VUFBSSxpQkFBSixBQUFxQixPQUFPLEFBQzFCO2VBQUEsQUFBTyxPQUFPLFVBQUEsQUFBVSxRQUF4QixBQUFnQyxBQUNqQztBQUZELGlCQUVZLFFBQUEsQUFBTyw4Q0FBUCxBQUFPLFlBQVIsQUFBa0IsWUFBYyxRQUFPLFVBQVAsQUFBTyxBQUFVLFVBQXJELEFBQThELFVBQVcsQUFDOUU7ZUFBQSxBQUFPLE9BQU8sS0FBQSxBQUFLLFFBQVEsVUFBYixBQUFhLEFBQVUsTUFBckMsQUFBYyxBQUE2QixBQUM1QztBQUZNLE9BQUEsTUFFQSxBQUNMO2VBQUEsQUFBTyxPQUFPLFVBQUEsQUFBVSxRQUF4QixBQUFnQyxBQUNqQztBQUNGO0FBRUQ7O1NBQUssSUFBTCxBQUFXLFNBQVgsQUFBa0IsV0FBVyxBQUMzQjtjQUFRLFVBQVIsQUFBUSxBQUFVLEFBQ2xCO2FBQUEsQUFBTyxTQUFPLE9BQUEsQUFBTyxVQUFyQixBQUE2QixBQUM5QjtBQUVEOztXQUFBLEFBQU8sQUFDUjtBQTdGSCxBQUF5RDtBQUFBLEFBQ3ZEOztBQWdHRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFBLEFBQVMsa0JBQVQsQUFBMkIsT0FBTyxBQUNoQztBQUNBOzs7Y0FBTyxBQUNLLEFBQ1Y7QUFGSyx3QkFBQSxBQUVDLE9BRkQsQUFFUSxVQUZSLEFBRWtCLFFBQVEsQUFDN0I7WUFBQSxBQUFNLE9BQU8sWUFBTSxBQUNqQjtZQUFNLHVCQUF1QixNQUFBLEFBQU0sTUFBTSxPQUF6QyxBQUE2QixBQUFZLEFBQU8sQUFFaEQ7O1lBQUksQ0FBQyxNQUFBLEFBQU0sMEJBQTBCLHFCQUFoQyxBQUFxRCxVQUFVLHFCQUFwRSxBQUFLLEFBQW9GLGNBQWMsQUFDckc7Y0FBSSxTQUFBLEFBQVMsU0FBUyxxQkFBdEIsQUFBSSxBQUF1QyxZQUFZLEFBQ3JEO3FCQUFBLEFBQVMsWUFBWSxxQkFBckIsQUFBMEMsQUFDM0M7QUFDRjtBQUpELGVBSU8sQUFDTDtjQUFJLENBQUMsU0FBQSxBQUFTLFNBQVMscUJBQXZCLEFBQUssQUFBdUMsWUFBWSxBQUN0RDtxQkFBQSxBQUFTLFNBQVMscUJBQWxCLEFBQXVDLEFBQ3hDO0FBQ0Y7QUFDRjtBQVpELEFBYUQ7QUFoQkgsQUFBTyxBQWtCUjtBQWxCUSxBQUNMOzs7QUFtQkosUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxVQUFoQyxBQUEwQyxjQUExQyxBQUF3RDs7QUFFeEQsU0FBQSxBQUFTLGlCQUFULEFBQTJCLE9BQTNCLEFBQWtDLFdBQWxDLEFBQTZDLFVBQVUsQUFDckQ7QUFFQTs7O2NBQU8sQUFDSyxBQUNWO1dBRkssQUFFRSxBQUNQO0FBSEssd0JBQUEsQUFHQyxPQUhELEFBR1EsVUFIUixBQUdrQixRQUFRLEFBQzdCO1VBQUksT0FBQSxBQUFPLGVBQVAsQUFBc0IsYUFBYSxNQUF2QyxBQUF1QyxBQUFNLHNCQUFzQixBQUNqRTtpQkFBQSxBQUFTLE1BQU0sVUFBQSxBQUFDLE9BQVUsQUFDdEI7Z0JBQUEsQUFBTSxBQUNOO2NBQU0sVUFBVSxTQUFBLEFBQVMsS0FBVCxBQUFjLFFBQWQsQUFBc0IsUUFBdEIsQUFBOEIsTUFBOUMsQUFBZ0IsQUFBb0MsQUFDcEQ7MEJBQWdCLFlBQUE7bUJBQU0sVUFBQSxBQUFVLElBQWhCLEFBQU0sQUFBYztBQUFwQyxBQUFPLEFBQ1YsV0FEVTtBQUhYLEFBS0Q7QUFFRDs7VUFBTSxTQUFTLE1BQWYsQUFBZSxBQUFNLEFBQ3JCO1dBQUssSUFBTCxBQUFXLGNBQVgsQUFBeUIsUUFBUSxBQUMvQjtZQUFNLFNBQVMsT0FBZixBQUFlLEFBQU8sQUFDdEI7Y0FBQSxBQUFTLDRCQUFULEFBQWtDLEFBQ25DO0FBRUQ7O21CQUFPLEFBQU0sT0FBTyxPQUFiLEFBQW9CLFdBQVcsVUFBQSxBQUFDLFFBQVcsQUFDaEQ7WUFBSSxXQUFKLEFBQ0E7WUFBSSxNQUFKLEFBQUksQUFBTSxzQkFBc0IsQUFDOUI7Z0JBQUEsQUFBTSxBQUNQO0FBRkQsZUFFTyxBQUNMO3NCQUFBLEFBQVUsQUFDWDtBQUNEO2VBQU8sU0FBQSxBQUFTLEtBQVQsQUFBYyxRQUFyQixBQUFPLEFBQXNCLEFBQzlCO0FBUkQsQUFBTyxBQVNSLE9BVFE7QUFsQlgsQUFBTyxBQTZCUjtBQTdCUSxBQUNMOzs7QUE4QkosUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxVQUFoQyxBQUEwQyxhQUExQyxBQUF1RDs7QUFFdkQsU0FBQSxBQUFTLG9CQUFULEFBQThCLE9BQTlCLEFBQXFDLFdBQXJDLEFBQWdELFNBQWhELEFBQXlELFVBQVUsQUFDakU7QUFFQTs7O2NBQU8sQUFDSyxBQUVWOztBQUhLLHdCQUFBLEFBR0MsT0FIRCxBQUdRLFNBSFIsQUFHaUIsT0FBTyxBQUMzQjtVQUFNLGNBQU4sQUFBb0IsQUFDcEI7VUFBTSxnQkFBTixBQUFzQixBQUV0Qjs7VUFBSSxRQUFBLEFBQVEsR0FBWixBQUFJLEFBQVcsTUFBTSxBQUNuQjtBQUVEO0FBSEQsYUFHTyxBQUNMO2dCQUFBLEFBQVEsTUFBTSxVQUFBLEFBQUMsT0FBVSxBQUN2QjtjQUFJLE1BQUEsQUFBTSxXQUFWLEFBQXFCLGFBQWEsQUFDaEM7MEJBQUEsQUFBYyxVQUFVLG9CQUF4QixBQUF3QixBQUFvQixBQUM3QztBQUNGO0FBSkQsQUFNQTs7Z0JBQUEsQUFBUSxRQUFRLFVBQUEsQUFBQyxPQUFVLEFBQ3pCO2NBQUksTUFBQSxBQUFNLFdBQVYsQUFBcUIsZUFBZSxBQUNsQzswQkFBQSxBQUFjLFVBQVUsb0JBQXhCLEFBQXdCLEFBQW9CLEFBQzdDO0FBQ0Y7QUFKRCxBQUtEO0FBRUQ7O2VBQUEsQUFBUyxjQUFULEFBQXVCLE1BQXlCO1lBQW5CLEFBQW1CLGdGQUFQLEFBQU8sQUFDOUM7O1lBQUksTUFBSixBQUFVLEFBRVY7O1lBQUEsQUFBSSxXQUFXLEFBQ2I7Z0JBQVMsUUFBQSxBQUFRLFNBQWpCLEFBQTBCLGVBQTFCLEFBQW9DLEFBQ3BDO2tCQUFBLEFBQVEsS0FBUixBQUFhLEtBQWIsQUFBa0IsQUFDbkI7QUFIRCxlQUdPLEFBQ0w7Y0FBSSxDQUFDLE1BQUwsQUFBSyxBQUFNLHNCQUFzQixBQUMvQjtrQkFBTSxJQUFBLEFBQUksUUFBSixBQUFZLE1BQWxCLEFBQU0sQUFBa0IsQUFDekI7QUFDRDttQkFBUyxZQUFBO21CQUFNLFVBQUEsQUFBVSxJQUFoQixBQUFNLEFBQWM7QUFBN0IsQUFDRDtBQUNGO0FBRUQ7O2VBQUEsQUFBUyxvQkFBVCxBQUE2QixPQUFPLEFBQ2xDO2VBQU8sTUFBQSxBQUFNLFdBQU4sQUFBaUIsaUJBQWtCLE1BQUEsQUFBTSxXQUFOLEFBQWlCLGdCQUFnQixNQUFBLEFBQU0sV0FBVyxNQUE1RixBQUEwQyxBQUF3RCxBQUNuRztBQUVEOztlQUFBLEFBQVMsU0FBUyxBQUNoQjtZQUFNLGFBQWEsTUFBbkIsQUFBbUIsQUFBTSxBQUN6QjtZQUFNLFNBQU4sQUFBZSxBQUVmOzthQUFLLElBQUwsQUFBVyxjQUFYLEFBQXlCLFlBQVksQUFDbkM7aUJBQUEsQUFBVSw0QkFBeUIsV0FBbkMsQUFBbUMsQUFBVyxBQUNqRDtBQUVDOztZQUFJLE1BQU0sTUFBQSxBQUFNLE1BQU0sTUFBWixBQUFrQixjQUFjLEVBQUEsQUFBRSxPQUFGLEFBQVMsUUFBbkQsQUFBVSxBQUFnQyxBQUFpQixBQUUzRDs7ZUFBTyxZQUFQLEFBQU8sQUFBWSxBQUNwQjtBQUVEOztlQUFBLEFBQVMsWUFBVCxBQUFxQixLQUFLLEFBQ3hCO2VBQU8sTUFBQSxBQUFNLHVCQUFOLEFBQTZCLFlBQXBDLEFBQThDLEFBQy9DO0FBRUQ7O2VBQUEsQUFBUyxtQ0FBbUMsQUFDMUM7Y0FBQSxBQUFNLE9BQU8sWUFBWSxBQUN2QjtzQkFBQSxBQUFVLEFBQ1g7QUFGRCxXQUVHLFVBQUEsQUFBQyxRQUFXLEFBQ2I7a0JBQUEsQUFBUSxLQUFSLEFBQWEsUUFBYixBQUFxQixBQUN0QjtBQUpELEFBS0Q7QUFDRjtBQWxFSCxBQUFPLEFBb0VSO0FBcEVRLEFBQ0w7OztBQXFFSixRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFVBQWhDLEFBQTBDLGdCQUExQyxBQUEwRDs7QUFFMUQ7QUFDQTs7QUFFQSxTQUFBLEFBQVMsaUJBQVQsQUFBMEIsTUFBMUIsQUFBZ0MsVUFBaEMsQUFBMEMsYUFBMUMsQUFBdUQsY0FBdkQsQUFBcUUsSUFBckUsQUFBeUUsT0FBekUsQUFBZ0YsWUFBaEYsQUFBNEYsVUFBNUYsQUFBc0csVUFBdEcsQUFBZ0gsV0FBaEgsQUFBMkgsb0JBQTNILEFBQStJLGtCQUEvSSxBQUFpSyxPQUFPLEFBQ3RLO0FBQ0E7OztjQUFPLEFBQ0ssQUFDVjtXQUZLLEFBRUUsQUFDUDthQUhLLEFBR0ksQUFDVDtjQUpLLEFBSUssQUFDVjtBQUxLLHdCQUFBLEFBS0Msb0JBTEQsQUFLcUIsVUFMckIsQUFLK0IsUUFBUSxBQUMxQztVQUFJLGNBQUosQUFBa0IsQUFDbEI7VUFBSSxZQUFKLEFBQWdCLEFBQ2hCO1VBQUksd0JBQUosQUFBNEIsQUFDNUI7VUFBTSxPQUFPLGFBQUEsQUFBYSxRQUFRLE9BQWxDLEFBQWEsQUFBNEIsQUFDekM7VUFBTSxXQUFXLEtBQWpCLEFBQWlCLEFBQUssQUFFdEI7O2VBQUEsQUFBUyxTQUFULEFBQWtCLEFBRWxCOztVQUFJLHFCQUFKLEFBQXlCLEFBQ3pCO1VBQUksa0JBQUosQUFBc0IsQUFFdEI7O1VBQU0seUJBQXlCLFNBQXpCLEFBQXlCLGdDQUFBO2VBQVcsRUFBQSxBQUFFLFVBQVUsTUFBQSxBQUFNLFVBQVUsMEJBQXZDLEFBQVcsQUFBWSxBQUFnQixBQUEwQjtBQUFoRyxBQUVBOztlQUFBLEFBQVMsd0JBQVQsQUFBaUMsU0FBakMsQUFBMEMsT0FBTyxBQUMvQztZQUFJLENBQUosQUFBSyxPQUFPLEFBQ1Y7a0JBQUEsQUFBUSxBQUNUO0FBQ0Q7WUFBTSxTQUFTLFFBQUEsQUFBUSxTQUFTLFVBQUEsQUFBVSxJQUFPLFFBQWpCLEFBQWlCLEFBQVEsc0JBQTFDLEFBQWlCLEFBQTRDLEtBQTVFLEFBQWlGLEFBQ2pGO2VBQU8sRUFBQSxBQUFFLFNBQVMsRUFBQSxBQUFFLEtBQUYsQUFBTyxRQUFRLENBQUEsQUFBQyxjQUFELEFBQWUsZUFBekMsQUFBVyxBQUFlLEFBQThCLGtCQUFrQixFQUFDLGNBQWxGLEFBQU8sQUFBMEUsQUFBZSxBQUNqRztBQUVEOztlQUFBLEFBQVMsZ0JBQVQsQUFBeUIsU0FBUyxBQUNoQztZQUFNLGdCQUFnQixRQUFBLEFBQVEsaUJBREUsQUFDaEMsQUFBK0M7O3lDQURmO2lDQUFBOzhCQUFBOztZQUdoQztnQ0FBd0IsTUFBQSxBQUFNLEtBQTlCLEFBQXdCLEFBQVcsaUpBQWdCO2dCQUExQyxBQUEwQyxxQkFDakQ7O2dCQUFJLGVBQUosQUFBbUIsQUFDbkI7Z0JBQUksUUFBUSxZQUFBLEFBQVksT0FBeEIsQUFBWSxBQUFtQixJQUFJLEFBQ2pDOzRCQUFjLFlBQUEsQUFBWSxNQUExQixBQUFjLEFBQWtCLEFBQ2hDOzZCQUFBLEFBQWUsQUFDaEI7QUFFRDs7Z0JBQUksVUFBVSxNQUFBLEFBQU0sSUFBcEIsQUFBYyxBQUFVLEFBRXhCOztBQUNBO2dCQUFLLFlBQUwsQUFBaUIsTUFBTyxBQUN0QjtxQkFBQSxBQUFPLEFBQ1I7QUFFRDs7QUFDQTtnQkFBQSxBQUFJLGNBQWMsQUFDaEI7d0JBQVUsQ0FBVixBQUFXLEFBQ1o7QUFDRDtnQkFBSSxDQUFKLEFBQUssU0FBUyxBQUNaO3FCQUFBLEFBQU8sQUFDUjtBQUNGO0FBeEIrQjtzQkFBQTsrQkFBQTs0QkFBQTtrQkFBQTtjQUFBO2tFQUFBO3lCQUFBO0FBQUE7b0JBQUE7b0NBQUE7b0JBQUE7QUFBQTtBQUFBO0FBMEJoQzs7WUFBSSxRQUFKLEFBQVksYUFBYSxBQUN2QjtjQUFJLENBQUMsVUFBQSxBQUFVLE9BQU8sUUFBdEIsQUFBSyxBQUF5QixjQUFjLEFBQzFDO21CQUFBLEFBQU8sQUFDUjtBQUNGO0FBRUQ7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O2VBQUEsQUFBUyxXQUFULEFBQW9CLFNBQXBCLEFBQTZCLFVBQVUsQUFDckM7WUFBTSxrQkFBa0IsbUJBQXhCLEFBQXdCLEFBQW1CLEFBRTNDOztZQUFJLENBQUosQUFBSyxpQkFBaUIsQUFDcEI7Y0FBQSxBQUFJLGFBQWEsQUFDZjtxQkFBQSxBQUFTLFNBQVQsQUFBa0IsU0FBbEIsQUFBMkIsV0FBM0IsQUFBc0MsS0FBSyxZQUFNLEFBQy9DO3FCQUFPLFlBQVAsQUFBTyxBQUFZLEFBQ3BCO0FBRkQsQUFHQTtpQ0FBQSxBQUFxQixBQUNyQjs4QkFBQSxBQUFrQixBQUNsQjtrQkFBQSxBQUFNLHFCQUFxQixLQUEzQixBQUFnQyxBQUNqQztBQUNEO0FBQ0Q7QUFFRDs7WUFBTSxXQUFXLHVCQUFqQixBQUFpQixBQUF1QixBQUN4QztZQUFLLG9CQUFELEFBQXFCLG1CQUFvQixRQUFBLEFBQVEsT0FBUixBQUFlLG9CQUE1RCxBQUE2QyxBQUFtQyxXQUFXLEFBQ3pGO0FBQ0Q7QUFFRDs7MEJBQUEsQUFBa0IsQUFDbEI7NkJBQUEsQUFBcUIsQUFFckI7OzJCQUFBLEFBQW1CLEFBRW5COztxQ0FBTyxBQUFzQixTQUF0QixBQUErQixpQkFBL0IsQUFBZ0QsS0FBSyxVQUFBLEFBQVUsc0JBQXNCLEFBQzFGO0FBQ0E7Y0FBTSxnQ0FBZ0MsdUJBQUEsQUFBdUIsTUFBN0QsQUFBbUUsQUFFbkU7O2NBQUksQ0FBSixBQUFLLGFBQWEsQUFDaEI7NEJBQU8sQUFBUyxZQUFULEFBQXFCLFNBQXJCLEFBQThCLFdBQTlCLEFBQXlDLEtBQUssWUFBTSxBQUN6RDtxQkFBTyxXQUFBLEFBQVcsU0FBWCxBQUFvQixpQkFBM0IsQUFBTyxBQUFxQyxBQUM3QztBQUZELEFBQU8sQUFHUixhQUhRO0FBRFQsaUJBSU8sQUFDTDtzQkFBQSxBQUFVLEFBQ1Y7bUJBQU8sV0FBQSxBQUFXLFNBQVgsQUFBb0IsaUJBQTNCLEFBQU8sQUFBcUMsQUFDN0M7QUFDRjtBQVpELEFBQU8sQUFhUixTQWJRO0FBZVQ7O2VBQUEsQUFBUyxtQkFBVCxBQUE0QixVQUFVO3lDQUFBO2lDQUFBOzhCQUFBOztZQUNwQztnQ0FBc0IsTUFBQSxBQUFNLEtBQTVCLEFBQXNCLEFBQVcsNElBQVc7Z0JBQWpDLEFBQWlDLGlCQUMxQzs7Z0JBQUksZ0JBQUosQUFBSSxBQUFnQixVQUFVLEFBQzVCO3FCQUFBLEFBQU8sQUFDUjtBQUNGO0FBTG1DO3NCQUFBOytCQUFBOzRCQUFBO2tCQUFBO2NBQUE7a0VBQUE7eUJBQUE7QUFBQTtvQkFBQTtvQ0FBQTtvQkFBQTtBQUFBO0FBQUE7QUFPcEM7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O2VBQUEsQUFBUyxZQUFULEFBQXFCLFNBQVMsQUFDNUI7WUFBSSxnQkFBSixBQUFvQixPQUFPLEFBQ3pCO0FBQ0Q7QUFDRDtzQkFBQSxBQUFjLEFBQ2Q7Z0JBQUEsQUFBUSxXQUFSLEFBQW1CLEdBQW5CLEFBQXNCLEdBQXRCLEFBQXlCLEFBQ3pCO2tCQUFBLEFBQVUsQUFDWDtBQUVEOztlQUFBLEFBQVMsV0FBVCxBQUFvQixTQUFwQixBQUE2QixTQUE3QixBQUFzQyxjQUFjLEFBQ2xEO1lBQU0sc0JBQXNCLEtBQTVCLEFBQTRCLEFBQUssQUFDakM7WUFBTSxZQUFZLHdCQUFsQixBQUFrQixBQUF3QixBQUUxQzs7WUFBTSx5QkFBeUIsU0FBekIsQUFBeUIsdUJBQUEsQUFBVSxNQUFNLEFBQzdDO2NBQUksbUJBQUEsQUFBbUIsY0FBdkIsQUFBcUMsU0FBUyxBQUM1QztBQUNEO0FBRUQ7O3dCQUFBLEFBQWMsQUFFZDs7Y0FBTSw2QkFBNkIsS0FBQSxBQUFLLFFBQXhDLEFBQWdELEFBRWhEOztjQUFNLHFCQUFxQixTQUFyQixBQUFxQixxQkFBWSxBQUNyQztnQkFBSSxBQUNGO3FCQUFPLGdCQUFBLEFBQWdCLFNBQWhCLEFBQXlCLFdBQWhDLEFBQU8sQUFBb0MsQUFDNUM7QUFGRCxjQUVFLE9BQUEsQUFBTyxHQUFHLEFBQ1Y7cUJBQU8sVUFBQSxBQUFVLEdBQVYsQUFBYSxTQUFwQixBQUFPLEFBQXNCLEFBQzlCO0FBSkQsc0JBSVUsQUFDUjtBQUNBO0FBQ0E7dUJBQVMsWUFBWSxBQUNuQjtvQkFBSSxDQUFDLFFBQUwsQUFBYSxrQkFBa0IsQUFDN0I7eUJBQU8sbUJBQVAsQUFBTyxBQUFtQixBQUMzQjtBQUNGO0FBSkQsQUFLRDtBQUNGO0FBZEQsQUFnQkE7O2NBQU0sNkJBQTZCLEtBQUEsQUFBSyxJQUFMLEFBQVMsR0FBRyxlQUEvQyxBQUFtQyxBQUEyQixBQUU5RDs7Y0FBSSw2QkFBSixBQUFpQyxjQUFjLEFBQzdDOzRCQUFnQixZQUFBO3FCQUFBLEFBQU07QUFBZixhQUFBLEVBQVAsQUFBTyxBQUNILEFBQ0w7QUFIRCxpQkFHTyxBQUNMO21CQUFBLEFBQU8sQUFDUjtBQUNGO0FBakNELEFBbUNBOztZQUFNLHNCQUFzQixTQUF0QixBQUFzQixvQkFBQSxBQUFVLE9BQU8sQUFDM0M7bUJBQVMsWUFBWSxBQUNuQjtnQkFBSSxDQUFDLFFBQUwsQUFBYSxrQkFBa0IsQUFDN0I7cUJBQU8sbUJBQVAsQUFBTyxBQUFtQixBQUMzQjtBQUNGO0FBSkQsQUFLQTtlQUFBLEFBQUssTUFBTCxBQUFXLEFBQ1g7aUJBQU8sbUJBQUEsQUFBbUIsT0FBbkIsQUFBMEIsU0FBakMsQUFBTyxBQUFtQyxBQUMzQztBQVJELEFBVUE7O2NBQUEsQUFBTSxrQkFBa0IsS0FBeEIsQUFBNkIsTUFBN0IsQUFBbUMsQUFDbkM7WUFBTSxXQUFXLEVBQUMsVUFBVSxpQkFBaUIsVUFBNUIsQUFBVyxBQUEyQixjQUFjLGNBQWMsUUFBbkYsQUFBaUIsQUFBa0UsQUFBUSxBQUMzRjtlQUFPLEdBQUEsQUFBRyxJQUFILEFBQU8sVUFBUCxBQUFpQixLQUFqQixBQUFzQix3QkFBN0IsQUFBTyxBQUE4QyxBQUN0RDtBQUVEOztlQUFBLEFBQVMsc0JBQVQsQUFBK0IsU0FBL0IsQUFBd0MsU0FBUyxBQUMvQztZQUFJLENBQUMsUUFBRCxBQUFTLHdCQUF3QixDQUFDLFFBQWxDLEFBQTBDLFdBQVksT0FBQSxBQUFPLEtBQUssUUFBWixBQUFvQixTQUFwQixBQUE2QixXQUF2RixBQUFrRyxHQUFJLEFBQ3BHO2NBQU0sV0FBVyxHQUFqQixBQUFpQixBQUFHLEFBQ3BCO21CQUFBLEFBQVMsUUFBVCxBQUFpQixBQUNqQjtpQkFBTyxTQUFQLEFBQWdCLEFBQ2pCO0FBRUQ7O2dDQUF3QixRQUFqQixBQUF5QixzQkFBekIsQUFBK0MsS0FBSyxVQUFBLEFBQVUsVUFBVSxBQUM3RTtrQkFBQSxBQUFRLEtBQVIsQUFBYSxBQUNiO2lCQUFPLFNBQVMsUUFBVCxBQUFTLEFBQVEsWUFBWSxXQUFwQyxBQUFPLEFBQTZCLEFBQVcsQUFDaEQ7QUFIRCxBQUFPLEFBSVIsU0FKUTtBQU1UOztlQUFBLEFBQVMsbUJBQVQsQUFBNEIsT0FBNUIsQUFBbUMsU0FBbkMsQUFBNEMsU0FBUyxBQUNuRDtZQUFJLFFBQUosQUFBWSwyQkFBMkIsQUFDckM7aUJBQU8sMkJBQUEsQUFBMkIsU0FBbEMsQUFBTyxBQUFvQyxBQUM1QztBQUZELGVBRU8sSUFBSSxRQUFKLEFBQVkseUJBQXlCLEFBQzFDO2lCQUFPLG1CQUFBLEFBQW1CLE9BQW5CLEFBQTBCLFNBQTFCLEFBQW1DLFNBQTFDLEFBQU8sQUFBNEMsQUFDcEQ7QUFDRjtBQUVEOztVQUFNLDZCQUE2QixTQUE3QixBQUE2QiwyQkFBQSxBQUFDLFNBQUQsQUFBVSxTQUFWO2VBQXNCLGtCQUFBLEFBQWtCLFNBQWxCLEFBQTJCLFNBQWpELEFBQXNCLEFBQW9DO0FBQTdGLEFBRUE7O2VBQUEsQUFBUyxVQUFULEFBQW1CLE9BQW5CLEFBQTBCLFNBQTFCLEFBQW1DLFNBQVMsQUFDMUM7WUFBSSxjQUFKLEFBQWtCLEFBQ2xCO1lBQUksUUFBSixBQUFZLGtCQUFrQixBQUM1Qjt3QkFBYyxrQkFBQSxBQUFrQixTQUFoQyxBQUFjLEFBQTJCLEFBQzFDO0FBRkQsZUFFTyxJQUFJLFFBQUosQUFBWSxnQkFBZ0IsQUFDakM7d0JBQWMsbUJBQUEsQUFBbUIsT0FBbkIsQUFBMEIsU0FBeEMsQUFBYyxBQUFtQyxBQUNsRDtBQUVEOztpQkFBUyxZQUFZLEFBQ25CO2NBQUksQ0FBQyxRQUFMLEFBQWEsa0JBQWtCLEFBQzdCO21CQUFPLG1CQUFQLEFBQU8sQUFBbUIsQUFDM0I7QUFDRjtBQUpELEFBS0E7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7VUFBTSxvQkFBb0IsU0FBcEIsQUFBb0Isa0JBQUEsQUFBQyxTQUFELEFBQVUsU0FBVjtlQUFzQixrQkFBQSxBQUFrQixTQUFsQixBQUEyQixTQUFqRCxBQUFzQixBQUFvQztBQUFwRixBQUVBOztlQUFBLEFBQVMsa0JBQVQsQUFBMkIsU0FBM0IsQUFBb0MsU0FBcEMsQUFBNkMsZUFBZSxBQUMxRDtZQUFJLENBQUMsUUFBTCxBQUFLLEFBQVEsZ0JBQWdCLEFBQzNCO0FBQ0Q7QUFDRDtnQ0FBd0IsUUFBakIsQUFBaUIsQUFBUSxnQkFBekIsQUFBeUMsS0FBSyxVQUFBLEFBQVUsVUFBVSxBQUN2RTtrQkFBQSxBQUFRLEtBQVIsQUFBYSxBQUNiO2NBQU0sT0FBTyxTQUFTLFFBQXRCLEFBQWEsQUFBUyxBQUFRLEFBQzlCO3NCQUFZLG1CQUFaLEFBQVksQUFBbUIsQUFDL0I7aUJBQU8sS0FBUCxBQUFPLEFBQUssQUFDYjtBQUxELEFBQU8sQUFNUixTQU5RO0FBUVQ7O2VBQUEsQUFBUyxtQkFBVCxBQUE0QixPQUE1QixBQUFtQyxTQUFuQyxBQUE0QyxTQUE1QyxBQUFxRCx1QkFBdUIsQUFDMUU7WUFBSSxDQUFKLEFBQUssdUJBQXVCLEFBQzFCO2tDQUFBLEFBQXdCLEFBQ3pCO0FBQ0Q7WUFBSSxDQUFDLFFBQUwsQUFBSyxBQUFRLHdCQUF3QixBQUNuQztBQUNEO0FBQ0Q7WUFBTSxZQUFZLHdCQUFBLEFBQXdCLFNBQTFDLEFBQWtCLEFBQWlDLEFBQ25EO1lBQU0sT0FBTyxFQUFDLGNBQWMsRUFBQyxPQUE3QixBQUFhLEFBQWUsQUFFNUI7O2dDQUF3QixVQUFqQixBQUEyQixhQUEzQixBQUF3QyxLQUFLLFVBQUEsQUFBVSxVQUFVLEFBQ3RFO2VBQUEsQUFBSyxXQUFMLEFBQWdCLEFBQ2hCO2lCQUFPLGdCQUFBLEFBQWdCLFNBQWhCLEFBQXlCLFdBQWhDLEFBQU8sQUFBb0MsQUFDNUM7QUFIRCxBQUFPLEFBSVIsU0FKUTtBQU1UOztlQUFBLEFBQVMsZ0JBQVQsQUFBeUIsU0FBekIsQUFBa0MsV0FBbEMsQUFBNkMsTUFBTTtZQUFBLEFBQzFDLGVBRDBDLEFBQzFCLEtBRDBCLEFBQzFDO1lBRDBDLEFBRTFDLFdBRjBDLEFBRTlCLEtBRjhCLEFBRTFDLEFBRVA7O2dCQUFBLEFBQVEsS0FBUixBQUFhLEFBQ2I7WUFBTSxPQUFPLFNBQVMsUUFBdEIsQUFBYSxBQUFTLEFBQVEsQUFDOUI7b0JBQVksbUJBQVosQUFBWSxBQUFtQixBQUUvQjs7WUFBSSxVQUFKLEFBQWMsWUFBWSxBQUN4QjtjQUFNLFNBQVMsRUFBQSxBQUFFLE1BQUYsQUFBUSxjQUFjLEVBQUMsUUFBRCxBQUFTLFdBQVcsVUFBVSxRQUFBLEFBQVEsV0FBUixBQUFtQixHQUF0RixBQUFlLEFBQXNCLEFBQThCLEFBQXNCLEFBRXpGOztjQUFJLEFBQ0Y7bUJBQUEsQUFBTyxPQUFPLFVBQWQsQUFBd0IsZ0JBQWdCLFlBQVksVUFBWixBQUFzQixZQUE5RCxBQUF3QyxBQUFrQyxBQUMzRTtBQUZELFlBR0EsT0FBQSxBQUFPLE9BQU8sQUFDWjtnQkFBSSxvQkFBSixBQUVBOztnQkFBSSxBQUNGO2tCQUFJLEVBQUEsQUFBRSxTQUFOLEFBQUksQUFBVyxRQUFRLEFBQ3JCOytCQUFlLEtBQUEsQUFBSyxVQUFwQixBQUFlLEFBQWUsQUFDL0I7QUFGRCxxQkFFTyxBQUNMOytCQUFBLEFBQWUsQUFDaEI7QUFFRjtBQVBELGNBT0UsT0FBQSxBQUFPLFdBQVcsQUFDbEI7NkJBQUEsQUFBZSxBQUNoQjtBQUVEOztpQkFBQSxBQUFLLG9EQUFMLEFBQXVELGNBQXZELEFBQWdFLEFBQ2hFO2tCQUFBLEFBQU0sQUFDUDtBQUNGO0FBRUQ7O2VBQU8sS0FBUCxBQUFPLEFBQUssQUFDYjtBQUVEOztVQUFNLFVBQVUsU0FBVixBQUFVLFFBQUEsQUFBVSxTQUFTLEFBQ2pDO1lBQUksQ0FBQyxRQUFELEFBQVMsV0FBWSxPQUFBLEFBQU8sS0FBSyxRQUFaLEFBQW9CLFNBQXBCLEFBQTZCLFdBQXRELEFBQWlFLEdBQUksQUFDbkU7Y0FBTSxXQUFXLEdBQWpCLEFBQWlCLEFBQUcsQUFDcEI7bUJBQUEsQUFBUyxRQUFULEFBQWlCLEFBQ2pCO2lCQUFPLFNBQVAsQUFBZ0IsQUFDakI7QUFFRDs7WUFBTSxXQUFOLEFBQWlCLEFBRWpCOzthQUFLLElBQUwsQUFBVyxrQkFBa0IsUUFBN0IsQUFBcUMsU0FBUyxBQUM1QztjQUFNLG9CQUFvQixRQUFBLEFBQVEsUUFBbEMsQUFBMEIsQUFBZ0IsQUFDMUM7Y0FBSSxBQUNGO3FCQUFBLEFBQVMsa0JBQWtCLFVBQUEsQUFBVSxPQUFyQyxBQUEyQixBQUFpQixBQUM3QztBQUZELFlBRUUsT0FBQSxBQUFPLEdBQUcsQUFDVjtxQkFBQSxBQUFTLGtCQUFrQixHQUFBLEFBQUcsT0FBOUIsQUFBMkIsQUFBVSxBQUN0QztBQUNGO0FBRUQ7O2VBQU8sR0FBQSxBQUFHLElBQVYsQUFBTyxBQUFPLEFBQ2Y7QUFuQkQsQUFxQkE7O1VBQU0sNEJBQTRCLFNBQTVCLEFBQTRCLG1DQUFBO2VBQVcsRUFBQSxBQUFFLE1BQU0sUUFBQSxBQUFRLGlCQUFoQixBQUFpQyxJQUFJLFFBQUEsQUFBUSxnQkFBeEQsQUFBVyxBQUE2RDtBQUExRyxBQUVBOztlQUFBLEFBQVMsb0JBQVQsQUFBNkIsS0FBSyxBQUNoQztZQUFJLElBQUEsQUFBSSxPQUFKLEFBQVcsT0FBZixBQUFzQixLQUFLLEFBQ3pCO2lCQUFPLElBQUEsQUFBSSxPQUFYLEFBQU8sQUFBVyxBQUNuQjtBQUZELGVBRU8sQUFDTDtpQkFBQSxBQUFPLEFBQ1I7QUFDRjtBQUVEOztVQUFNLHlCQUF5QixTQUF6QixBQUF5Qiw2QkFBQTtlQUFRLEVBQUEsQUFBRSxRQUFRLEVBQUEsQUFBRSxJQUFJLEtBQU4sQUFBTSxBQUFLLGVBQTdCLEFBQVEsQUFBVSxBQUEwQjtBQUEzRSxBQUVBOztVQUFNLG1CQUFtQixTQUFuQixBQUFtQix1QkFBQTtlQUFRLEVBQUEsQUFBRSxLQUFLLEVBQUEsQUFBRSxJQUFJLHVCQUFOLEFBQU0sQUFBdUIsT0FBNUMsQUFBUSxBQUFPLEFBQW9DO0FBQTVFLEFBRUE7O1VBQU0sU0FBUyxpQkFBZixBQUFlLEFBQWlCLEFBRWhDOzttQkFBTyxBQUFNLFlBQU4sQUFBa0IsS0FBSyxZQUFZLEFBQ3hDO2dDQUFBLEFBQXdCLEFBRXhCOztBQUNBO21CQUFBLEFBQVcsVUFBWCxBQUFxQixBQUNyQjtnQ0FBQSxBQUF3QixBQUV4Qjs7QUFDQTtZQUFJLE9BQUEsQUFBTyxXQUFYLEFBQXNCLEdBQUcsQUFDdkI7QUFDRDtBQUVEOztZQUFNLGVBQWUsU0FBZixBQUFlLGFBQUEsQUFBVSxhQUFWLEFBQXVCLFVBQXZCLEFBQWlDLFVBQVUsQUFDOUQ7Y0FBQSxBQUFJLHVCQUF1QixBQUN6QjtBQUNEO0FBQ0Q7a0NBQUEsQUFBd0IsQUFFeEI7O0FBQ0E7QUFDQTtBQUNBOzBCQUFnQixZQUFZLEFBQzFCO3VCQUFBLEFBQVcsVUFBWCxBQUFxQixBQUNyQjttQkFBTyx3QkFBUCxBQUErQixBQUNoQztBQUhELEFBQU8sQUFJUixXQUpRO0FBVFQsQUFlQTs7Y0FBQSxBQUFNLE1BQU4sQUFBWSxRQUFaLEFBQW9CLEFBRXBCOzsyQkFBQSxBQUFtQixJQUFuQixBQUF1QixZQUFZLFlBQUE7aUJBQU0sTUFBQSxBQUFNLGNBQVosQUFBTSxBQUFvQjtBQUE3RCxBQUNEO0FBOUJELEFBQU8sQUErQlIsT0EvQlE7QUE3VFgsQUFBTyxBQThWUjtBQTlWUSxBQUNMOzs7QUErVkosUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxVQUFoQyxBQUEwQyxRQUExQyxBQUFrRDs7SSxBQUU1QyxpQ0FDSjs4QkFBQSxBQUFZLFlBQVk7MEJBQ3RCOztTQUFBLEFBQUssYUFBTCxBQUFrQixBQUNsQjtTQUFBLEFBQUssUUFBTCxBQUFhLEFBQ2I7U0FBQSxBQUFLLHFCQUFMLEFBQTBCLEFBQzNCOzs7OzswQkFFSyxBQUNKO2FBQU8sS0FBUCxBQUFZLEFBQ2I7Ozs7K0JBRVUsQUFDVDthQUFPLEtBQUEsQUFBSyxTQUFaLEFBQXFCLEFBQ3RCOzs7OytCQUVVLEFBQ1Q7V0FBQSxBQUFLLFFBQVEsS0FBQSxBQUFLLElBQUwsQUFBUyxHQUFHLEtBQUEsQUFBSyxRQUE5QixBQUFhLEFBQXlCLEFBQ3RDO1VBQUksS0FBQSxBQUFLLFVBQVQsQUFBbUIsR0FBRyxBQUNwQjtZQUFJLENBQUMsS0FBTCxBQUFVLG9CQUFvQixBQUM1QjtlQUFBLEFBQUsscUJBQUwsQUFBMEIsQUFDMUI7ZUFBQSxBQUFLLFdBQUwsQUFBZ0IsV0FBaEIsQUFBMkIsQUFDNUI7QUFIRCxlQUdPLEFBQ0w7ZUFBQSxBQUFLLFdBQUwsQUFBZ0IsV0FBaEIsQUFBMkIsQUFDNUI7QUFDRjtBQUNGOzs7OzRCQUVPLEFBQ047V0FBQSxBQUFLLFFBQUwsQUFBYSxBQUNiO2FBQU8sS0FBQSxBQUFLLHFCQUFaLEFBQWlDLEFBQ2xDOzs7Ozs7O0FBR0gsUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxRQUFoQyxBQUF3QyxxQ0FBc0IsVUFBQSxBQUFDLFlBQWUsQUFDNUU7QUFDQTs7U0FBTyxJQUFBLEFBQUksbUJBQVgsQUFBTyxBQUF1QixBQUMvQjtBQUhEOztJLEFBS00sNEJBQ0o7eUJBQUEsQUFBWSxjQUFaLEFBQTBCLGdCQUExQixBQUEwQyxNQUFNOzBCQUM5Qzs7U0FBQSxBQUFLLGVBQUwsQUFBb0IsQUFDcEI7U0FBQSxBQUFLLGlCQUFMLEFBQXNCLEFBRXRCOztTQUFBLEFBQUssT0FBTCxBQUFZLEFBQ1o7U0FBQSxBQUFLLFdBQUwsQUFBZ0IsQUFDakI7Ozs7O3dCLEFBRUcsTUFBTSxBQUNSO2FBQU8sS0FBQSxBQUFLLGFBQUwsQUFBa0IsSUFBSSxLQUF0QixBQUEyQixNQUFsQyxBQUFPLEFBQWlDLEFBQ3pDOzs7OzZCQUVRLEFBQ1A7YUFBTyxLQUFQLEFBQVksQUFDYjs7Ozs4QixBQUVTLE9BQU8sQUFDZjthQUFPLEVBQUEsQUFBRSxVQUFGLEFBQVksT0FBTyxFQUFBLEFBQUUsSUFBRixBQUFNLE9BQU8sS0FBQSxBQUFLLElBQUwsQUFBUyxLQUFoRCxBQUFPLEFBQW1CLEFBQWEsQUFBYyxBQUN0RDs7Ozt3QixBQUVHLE0sQUFBTSxPQUFPLEFBQ2Y7V0FBQSxBQUFLLGFBQUwsQUFBa0IsSUFBSSxLQUF0QixBQUEyQixNQUEzQixBQUFpQyxNQUFqQyxBQUF1QyxBQUN2QztXQUFBLEFBQUssZ0JBQUwsQUFBcUIsTUFBckIsQUFBMkIsQUFDNUI7Ozs7MEIsQUFFSyxPQUFPO2tCQUNYOztVQUFJLEVBQUUsaUJBQU4sQUFBSSxBQUFtQixRQUFRLEFBQzdCO2dCQUFRLENBQVIsQUFBUSxBQUFDLEFBQ1Y7QUFFRDs7UUFBQSxBQUFFLE9BQUYsQUFBUyxLQUFLLFVBQUEsQUFBQyxNQUFTLEFBQ3RCO2NBQUEsQUFBSyxhQUFMLEFBQWtCLE1BQU0sTUFBeEIsQUFBNkIsTUFBN0IsQUFBbUMsQUFDbkM7Y0FBQSxBQUFLLGdCQUFMLEFBQXFCLE1BQXJCLEFBQTJCLEFBQzVCO0FBSEQsQUFJRDs7OzswQixBQUVLLE8sQUFBTyxTQUFTO21CQUNwQjs7VUFBSSxFQUFFLGlCQUFOLEFBQUksQUFBbUIsUUFBUSxBQUM3QjtnQkFBUSxDQUFSLEFBQVEsQUFBQyxBQUNWO0FBRUQ7O1FBQUEsQUFBRSxPQUFGLEFBQVMsS0FBSyxVQUFBLEFBQUMsTUFBUyxBQUN0QjtlQUFBLEFBQUssU0FBTCxBQUFjLEtBQUssT0FBQSxBQUFLLGVBQUwsQUFBb0IsT0FBcEIsQUFBMkIsTUFBM0IsQUFBaUMsU0FBUyxPQUFBLEFBQUssSUFBbEUsQUFBbUIsQUFBMEMsQUFBUyxBQUN2RTtBQUZELEFBR0Q7Ozs7a0MsQUFFYSxTQUFTLEFBQ3JCO1VBQUksS0FBQSxBQUFLLFNBQUwsQUFBYyxXQUFsQixBQUE2QixHQUFHLEFBQzlCO0FBQ0Q7QUFDRDtVQUFNLGNBQU4sQUFBb0IsQUFFcEI7O1FBQUEsQUFBRSxLQUFLLEtBQVAsQUFBWSxVQUFVLHVCQUFlLEFBQ25DO1lBQUksWUFBQSxBQUFZLFlBQWhCLEFBQTRCLFNBQVMsQUFDbkM7c0JBQUEsQUFBWSxLQUFaLEFBQWlCLEFBQ2xCO0FBQ0Y7QUFKRCxBQU1BOzthQUFPLEtBQUEsQUFBSyxXQUFaLEFBQXVCLEFBQ3hCOzs7O29DLEFBRWUsYSxBQUFhLFVBQVU7bUJBQ3JDOztRQUFBLEFBQUUsS0FBSyxLQUFQLEFBQVksVUFBVSxtQkFBVyxBQUMvQjtZQUFJLFFBQUEsQUFBUSxhQUFSLEFBQXFCLGFBQXpCLEFBQUksQUFBa0MsV0FBVyxBQUMvQztjQUFNLHdCQUF3QixPQUFBLEFBQUssYUFBTCxBQUFrQixJQUFJLE9BQXRCLEFBQTJCLE1BQU0sUUFBL0QsQUFBOEIsQUFBeUMsQUFDdkU7a0JBQUEsQUFBUSxPQUFSLEFBQWUsYUFBZixBQUE0QixBQUM3QjtBQUNGO0FBTEQsQUFNRDs7Ozs7OztJLEFBR0csbUNBQ0o7Z0NBQUEsQUFBWSxjQUFaLEFBQTBCLGdCQUFnQjswQkFDeEM7O1NBQUEsQUFBSyxlQUFMLEFBQW9CLEFBQ3BCO1NBQUEsQUFBSyxpQkFBTCxBQUFzQixBQUN2Qjs7Ozs7NkJBRWlCO1VBQVgsQUFBVywyRUFBSixBQUFJLEFBQ2hCOzthQUFPLElBQUEsQUFBSSxjQUFjLEtBQWxCLEFBQXVCLGNBQWMsS0FBckMsQUFBMEMsZ0JBQWpELEFBQU8sQUFBMEQsQUFDbEU7Ozs7Ozs7QUFHSCxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFFBQWhDLEFBQXdDLDJEQUF3QixVQUFBLEFBQUMsY0FBRCxBQUFlLGdCQUFtQixBQUNoRztBQUNBOztTQUFPLElBQUEsQUFBSSxxQkFBSixBQUF5QixjQUFoQyxBQUFPLEFBQXVDLEFBQy9DO0FBSEQ7O0ksQUFLTSxzQkFDSjttQkFBQSxBQUFZLFdBQVosQUFBdUIsU0FBbUM7UUFBMUIsQUFBMEIsbUZBQVgsQUFBVzs7MEJBQ3hEOztTQUFBLEFBQUssWUFBTCxBQUFpQixBQUNqQjtTQUFBLEFBQUssVUFBTCxBQUFlLEFBQ2Y7U0FBQSxBQUFLLGVBQWUsRUFBQSxBQUFFLFVBQXRCLEFBQW9CLEFBQVksQUFDakM7Ozs7O2tDLEFBRWEsTUFBTSxBQUNsQjthQUFPLEtBQUEsQUFBSyxNQUFaLEFBQU8sQUFBVyxBQUNuQjs7OztpQyxBQUVZLGEsQUFBYSxVQUFVLEFBQ2xDO0FBQ0E7VUFBSSxLQUFBLEFBQUssY0FBVCxBQUF1QixhQUFhLEFBQ2xDO2VBQU8sQ0FBQyxRQUFBLEFBQVEsT0FBTyxLQUFmLEFBQW9CLGNBQTVCLEFBQVEsQUFBa0MsQUFDM0M7QUFFRDs7VUFBTTtjQUNFLEtBRE0sQUFDRCxBQUNYO2dCQUFRLEtBQUEsQUFBSyxjQUFjLEtBRmYsQUFFSixBQUF3QixBQUNoQztlQUFPLEtBSFQsQUFBYyxBQUdBLEFBR2Q7QUFOYyxBQUNaOztVQUtJO2NBQVMsQUFDUCxBQUNOO2dCQUFRLEtBQUEsQUFBSyxjQUZBLEFBRUwsQUFBbUIsQUFDM0I7ZUFIRixBQUFlLEFBR04sQUFHVDtBQU5lLEFBQ2I7O1VBS0ksZUFBZSxLQUFBLEFBQUssSUFBSSxPQUFBLEFBQU8sT0FBaEIsQUFBdUIsUUFBUSxNQUFBLEFBQU0sT0FBMUQsQUFBcUIsQUFBNEMsQUFDakU7V0FBSyxJQUFJLGFBQVQsQUFBc0IsR0FBRyxhQUF6QixBQUFzQyxjQUF0QyxBQUFvRCxjQUFjLEFBQ2hFO1lBQUksTUFBQSxBQUFNLE9BQU4sQUFBYSxnQkFBZ0IsT0FBQSxBQUFPLE9BQXhDLEFBQWlDLEFBQWMsYUFBYSxBQUMxRDtpQkFBQSxBQUFPLEFBQ1I7QUFDRjtBQUVEOztBQUVBOztVQUFNLHlCQUF5QixPQUFBLEFBQU8sT0FBUCxBQUFjLFNBQVMsTUFBQSxBQUFNLE9BQTVELEFBQW1FLEFBRW5FOztVQUFBLEFBQUksd0JBQXdCLEFBQzFCO1lBQU0sZUFBZSxPQUFBLEFBQU8sT0FBUCxBQUFjLE1BQU0sTUFBQSxBQUFNLE9BQTFCLEFBQWlDLFFBQWpDLEFBQXlDLEtBQTlELEFBQXFCLEFBQThDLEFBQ25FO1lBQU0sNEJBQTRCLEVBQUEsQUFBRSxJQUFJLE1BQU4sQUFBWSxPQUE5QyxBQUFrQyxBQUFtQixBQUNyRDtlQUFPLENBQUMsUUFBQSxBQUFRLE9BQVIsQUFBZSwyQkFBMkIsT0FBbEQsQUFBUSxBQUFpRCxBQUMxRDtBQUpELGFBSU8sQUFDTDtZQUFNLGdCQUFlLE1BQUEsQUFBTSxPQUFOLEFBQWEsTUFBTSxPQUFBLEFBQU8sT0FBMUIsQUFBaUMsUUFBakMsQUFBeUMsS0FBOUQsQUFBcUIsQUFBOEMsQUFDbkU7WUFBTSxzQkFBc0IsRUFBQSxBQUFFLElBQUksT0FBTixBQUFhLE9BQXpDLEFBQTRCLEFBQW9CLEFBQ2hEO2VBQU8sQ0FBQyxRQUFBLEFBQVEsT0FBTyxNQUFmLEFBQXFCLE9BQTdCLEFBQVEsQUFBNEIsQUFDckM7QUFDRjs7OzsyQixBQUVNLGEsQUFBYSxVQUFVLEFBQzVCO1dBQUEsQUFBSyxRQUFMLEFBQWEsYUFBYixBQUEwQixVQUFVLEtBQXBDLEFBQXlDLEFBQ3pDO1dBQUEsQUFBSyxlQUFlLEVBQUEsQUFBRSxVQUF0QixBQUFvQixBQUFZLEFBQ2pDOzs7Ozs7O0ksQUFHRzs7Ozs7OzsyQixBQUNHLFcsQUFBVyxTQUFtQztVQUExQixBQUEwQixtRkFBWCxBQUFXLEFBQ25EOzthQUFPLElBQUEsQUFBSSxRQUFKLEFBQVksV0FBWixBQUF1QixTQUE5QixBQUFPLEFBQWdDLEFBQ3hDOzs7Ozs7O0FBR0gsUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxRQUFoQyxBQUF3QyxrQkFBa0IsWUFBTSxBQUM5RDtTQUFPLElBQVAsQUFBTyxBQUFJLEFBQ1o7QUFGRDs7QUFJQSxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFNBQWhDLEFBQXlDLDBCQUFTLFVBQUEsQUFBUyxjQUFjLEFBQ3ZFO0FBQ0E7O01BQU0sU0FBTixBQUFlLEFBQ2Y7TUFBTSxhQUFOLEFBQW1CLEFBQ25CO01BQU0sT0FBTixBQUFhLEFBQ2I7TUFBTSxtQkFBTixBQUF5QixBQUN6QjtNQUFNLFFBQU4sQUFBYyxBQUNkO01BQU0sUUFBTixBQUFjLEFBQ2Q7TUFBSSxZQUFKLEFBQWdCLEFBRWhCOztNQUFNO0FBQVcsd0NBQUEsQUFFRixNQUZFLEFBRUksUUFBUSxBQUN6QjtZQUFBLEFBQU0sUUFBTixBQUFjLEFBQ2Q7WUFBQSxBQUFNLE1BQU4sQUFBWSxRQUFRLElBQUEsQUFBSSxPQUFPLE1BQUEsQUFBTSxNQUFOLEFBQVksTUFBdkIsQUFBNkIsUUFBakQsQUFBb0IsQUFBcUMsQUFDekQ7YUFBTyxFQUFBLEFBQUUsT0FBTyxFQUFFLEtBQUssS0FBaEIsQUFBUyxBQUFZLGdCQUE1QixBQUFPLEFBQXFDLEFBQzdDO0FBTmMsQUFRZjtBQVJlLGdEQUFBLEFBUUUsTUFSRixBQVFRLFFBQVEsQUFDN0I7YUFBQSxBQUFPLFFBQVEsRUFBQSxBQUFFLE9BQU8sRUFBQyxNQUFWLEFBQVMsUUFBeEIsQUFBZSxBQUFpQixBQUNoQzthQUFPLEVBQUEsQUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFoQixBQUFTLEFBQVksb0JBQTVCLEFBQU8sQUFBeUMsQUFDakQ7QUFYYyxBQWFmO0FBYmUsa0RBQUEsQUFhRyxNQWJILEFBYVMsSUFBSSxBQUMxQjtpQkFBQSxBQUFXLFFBQVgsQUFBbUIsQUFDbkI7YUFBTyxFQUFBLEFBQUUsT0FBTyxFQUFFLEtBQUssS0FBaEIsQUFBUyxBQUFZLHFCQUE1QixBQUFPLEFBQTBDLEFBQ2xEO0FBaEJjLEFBa0JmO0FBbEJlLHNDQUFBLEFBa0JILFNBQXNCO1VBQWIsQUFBYSw2RUFBSixBQUFJLEFBQ2hDOztVQUFNO3FCQUNTLEtBQUEsQUFBSyxtQkFBTCxBQUF3QixTQUR2QixBQUNELEFBQWlDLEFBQzlDO2lCQUZGLEFBQWdCLEFBS2hCO0FBTGdCLEFBQ2Q7O1dBSUYsQUFBSyxLQUFLLEVBQUEsQUFBRSxPQUFGLEFBQVMsU0FBbkIsQUFBVSxBQUFrQixBQUM1QjthQUFPLEVBQUEsQUFBRSxPQUFPLEVBQUUsS0FBSyxLQUFoQixBQUFTLEFBQVksZUFBNUIsQUFBTyxBQUFvQyxBQUM1QztBQTFCYyxBQTRCZjtBQTVCZSx3REE0Qm1CO3lDQUFYLEFBQVcsNkRBQVg7QUFBVyxxQ0FBQTtBQUNoQzs7UUFBQSxBQUFFLFFBQUYsQUFBVSxXQUFXLFVBQUEsQUFBQyxPQUFVLEFBQzlCO1lBQUksQ0FBQyxpQkFBQSxBQUFpQixTQUF0QixBQUFLLEFBQTBCLFFBQVEsQUFDckM7MkJBQUEsQUFBaUIsS0FBakIsQUFBc0IsQUFDdkI7QUFDRjtBQUpELEFBS0Q7QUFsQ2MsQUFvQ2Y7QUFwQ2Usd0NBQUEsQUFvQ0YsTUFBTSxBQUNqQjtrQkFBQSxBQUFZLEFBQ2I7QUF0Q2MsQUF3Q2Y7QUF4Q2Usb0RBQUEsQUF3Q0ksWUF4Q0osQUF3Q2dCLFFBQVEsQUFDckM7VUFBSSxhQUFKLEFBQ0E7bUJBQWEsS0FBQSxBQUFLLDhCQUFsQixBQUFhLEFBQW1DLEFBQ2hEO21CQUFhLEtBQUEsQUFBSyw2QkFBbEIsQUFBYSxBQUFrQyxBQUUvQzs7VUFBTSxhQUFOLEFBQW1CLEFBQ25CO1VBQUksV0FBSixBQUFlLEFBRWY7O1VBQUksQ0FBQyxPQUFMLEFBQVksY0FBYyxBQUN4Qjt5QkFBQSxBQUFlLFdBQ2hCO0FBRUQ7O1VBQU0sWUFBTixBQUFrQixBQUVsQjs7YUFBTyxDQUFDLFFBQVEsV0FBQSxBQUFXLEtBQXBCLEFBQVMsQUFBZ0IsaUJBQWhDLEFBQWlELE1BQU0sQUFDckQ7WUFBTSxRQUFRLE9BQU8sTUFBckIsQUFBYyxBQUFPLEFBQU0sQUFDM0I7a0JBQUEsQUFBVSxLQUFWLEFBQWUsQUFDZjttQkFBVyxTQUFBLEFBQVMsUUFBUSxNQUFqQixBQUFpQixBQUFNLFVBQVEsTUFBTSxNQUFOLEFBQVksTUFBWixBQUFrQixNQUFqRCxBQUF1RCxTQUFsRSxBQUNEO0FBRUQ7O2VBQUEsQUFBUyxRQUFULEFBQWlCLEtBQWpCLEFBQXNCLEFBRXRCOzs7ZUFDUyxJQUFBLEFBQUksT0FBSixBQUFXLFVBRGIsQUFDRSxBQUFxQixBQUM1QjtnQkFGRixBQUFPLEFBRUcsQUFFWDtBQUpRLEFBQ0w7QUEvRFcsQUFvRWY7QUFwRWUsd0VBQUEsQUFvRWMsS0FBSyxBQUNoQztVQUFJLElBQUEsQUFBSSxNQUFSLEFBQUksQUFBVSxRQUFRLEFBQ3BCO2VBQU8sSUFBQSxBQUFJLFFBQUosQUFBWSxPQUFuQixBQUFPLEFBQW1CLEFBQzNCO0FBQ0Q7YUFBQSxBQUFVLE1BQ1g7QUF6RWMsQUEyRWY7QUEzRWUsMEVBQUEsQUEyRWUsS0FBSyxBQUNqQzthQUFPLElBQUEsQUFBSSxRQUFKLEFBQVksaUNBQW5CLEFBQU8sQUFBNkMsQUFDckQ7QUE3RWMsQUErRWY7QUEvRWUseURBQUEsQUErRVYsV0EvRVUsQUErRUMsV0EvRUQsQUErRVksSUFBSSxBQUM3QjtBQUVBOztBQUNBO0FBQ0E7QUFFQTs7QUFFQTs7UUFBQSxBQUFFLE1BQUYsQUFBUSxZQUFZLFVBQUEsQUFBQyxRQUFELEFBQVMsWUFBVDtlQUNsQixXQUFBLEFBQVcsY0FBYyxVQUFBLEFBQVMsTUFBTSxBQUN0QztjQUFJLENBQUosQUFBSyxNQUFNLEFBQUU7bUJBQUEsQUFBTyxBQUFLO0FBQ3pCO2NBQU0sU0FBUyxFQUFDLFNBQWhCLEFBQWUsQUFBVSxBQUN6QjtpQkFBTyxVQUFBLEFBQVUsT0FBVixBQUFpQixRQUFqQixBQUF5QixJQUFoQyxBQUFPLEFBQTZCLEFBQ3JDO0FBTGlCO0FBQXBCLEFBUUE7O1VBQUksY0FBSixBQUFrQixBQUVsQjs7VUFBTTt5QkFBVSxBQUNHLEFBQ2pCO3VCQUFlLEdBRkQsQUFFQyxBQUFHLEFBRWxCOztBQUpjLDhCQUFBLEFBSVIsWUFBWTsyQ0FBQTttQ0FBQTtnQ0FBQTs7Y0FDaEI7a0NBQWtCLE1BQUEsQUFBTSxLQUF4QixBQUFrQixBQUFXLHdJQUFPO2tCQUF6QixBQUF5QixhQUNsQzs7a0JBQUksYUFBSixBQUNBO2tCQUFJLENBQUMsUUFBUSxJQUFBLEFBQUksWUFBSixBQUFnQixNQUFoQixBQUFzQixLQUEvQixBQUFTLEFBQTJCLGlCQUF4QyxBQUF5RCxNQUFNLEFBQzdEO3VCQUFPLEVBQUMsS0FBRCxLQUFNLFlBQWIsQUFBTyxBQUFrQixBQUMxQjtBQUNGO0FBTmU7d0JBQUE7aUNBQUE7OEJBQUE7b0JBQUE7Z0JBQUE7b0VBQUE7MkJBQUE7QUFBQTtzQkFBQTtzQ0FBQTtzQkFBQTtBQUFBO0FBQUE7QUFPaEI7O2lCQUFBLEFBQU8sQUFDUjtBQVphLEFBY2Q7QUFkYywwQ0FBQSxBQWNGLE9BQStCO2NBQXhCLEFBQXdCLGlGQUFYLEFBQVcsQUFDekM7O2NBQU0sV0FBVyxLQUFBLEFBQUssbUJBQXRCLEFBQWlCLEFBQXdCLEFBQ3pDO2NBQU0sT0FBTyxLQUFBLEFBQUssZ0JBQWxCLEFBQWEsQUFBcUIsQUFDbEM7dUJBQWEsS0FBQSxBQUFLLGtCQUFsQixBQUFhLEFBQXVCLEFBQ3BDO2lCQUFPLGFBQUEsQUFBYSxRQUFiLEFBQXFCLFlBQXJCLEFBQWlDLE1BQXhDLEFBQU8sQUFBdUMsQUFDL0M7QUFuQmEsQUFxQmQ7QUFyQmMsc0RBQUEsQUFxQkksWUFBWSxBQUM1QjtjQUFJLENBQUosQUFBSyxZQUFZLEFBQUU7eUJBQWEsVUFBYixBQUFhLEFBQVUsQUFBVztBQUNyRDtjQUFNLE9BQU8sRUFBQSxBQUFFLE1BQWYsQUFBYSxBQUFRLEFBQ3JCO2NBQU0sVUFBTixBQUFnQixBQUVoQjs7WUFBQSxBQUFFLFFBQUYsQUFBVSxNQUFNLFVBQUEsQUFBQyxPQUFELEFBQVEsS0FBUSxBQUM5QjtnQkFBSSxZQUFZLEVBQUEsQUFBRSxRQUFGLEFBQVUsUUFBUSxFQUFFLGFBQXBDLEFBQWdCLEFBQWtCLEFBQWUsQUFDakQ7Z0JBQUksQ0FBSixBQUFLLFdBQVcsQUFBRTswQkFBQSxBQUFZLEFBQU07QUFFcEM7O2dCQUFNLGdCQUFnQixPQUFBLEFBQU8sYUFBYSxFQUFBLEFBQUUsSUFBSSxPQUFOLEFBQU0sQUFBTyxZQUFqQyxBQUFvQixBQUF5QixVQUFuRSxBQUE2RSxBQUM3RTtnQkFBSSxDQUFDLE9BQUQsQUFBQyxBQUFPLGNBQWUsTUFBQSxBQUFNLGVBQU4sQUFBcUIsTUFBckIsQUFBMkIsS0FBdEQsQUFBMkIsQUFBZ0MsUUFBUyxBQUVsRTs7a0JBQU0sWUFBWSxPQUFBLEFBQU8sYUFBYSxPQUFBLEFBQU8sV0FBM0IsQUFBc0MsT0FBeEQsQUFBK0QsQUFDL0Q7a0JBQU0sZ0JBQWdCLFlBQVksTUFBWixBQUFZLEFBQU0sYUFBeEMsQUFBcUQsQUFDckQ7a0JBQU0sa0JBQWtCLGdCQUFnQixjQUFoQixBQUE4QixTQUF0RCxBQUErRCxBQUUvRDs7a0JBQUEsQUFBSSxpQkFBaUIsQUFDbkI7d0JBQVEsVUFBQSxBQUFVLE9BQVYsQUFBaUIsaUJBQWpCLEFBQWtDLE1BQU0sRUFBQyxPQUFqRCxBQUFRLEFBQXdDLEFBQVEsQUFDekQ7QUFFRDs7a0JBQU0sMEJBQTBCLE9BQUEsQUFBTyxhQUFhLE9BQUEsQUFBTyxXQUEzQixBQUFzQyxZQUF0RSxBQUFrRixBQUNsRjtrQkFBTSxVQUFVLDJCQUFoQixBQUEyQyxBQUUzQzs7MkJBQUEsQUFBYSxJQUFiLEFBQWlCLFNBQWpCLEFBQTBCLFNBQTFCLEFBQW1DLEFBQ3BDO0FBQ0Y7QUFwQkQsQUFzQkE7O2lCQUFBLEFBQU8sQUFDUjtBQWpEYSxBQW1EZDtBQW5EYyx3REFBQSxBQW1ESyxPQUFPLEFBQ3hCO2NBQU0sT0FBTixBQUFhLEFBRWI7O1lBQUEsQUFBRSxRQUFRLE1BQUEsQUFBTSxJQUFoQixBQUFvQixPQUFPLFVBQUEsQUFBQyxPQUFELEFBQVEsS0FBUSxBQUN6Qzt5QkFBQSxBQUFhLElBQWIsQUFBaUIsTUFBakIsQUFBdUIsS0FBTSxRQUFBLEFBQU8sOENBQVAsQUFBTyxZQUFQLEFBQWlCLFdBQVcsRUFBQSxBQUFFLFVBQTlCLEFBQTRCLEFBQVksU0FBckUsQUFBOEUsQUFDL0U7QUFGRCxBQUlBOztpQkFBQSxBQUFPLEFBQ1I7QUEzRGEsQUE2RGQ7QUE3RGMsa0RBQUEsQUE2REUsT0FBTyxBQUNyQjtjQUFNLE9BQU4sQUFBYSxBQUNiO2NBQU0sYUFBYSxNQUFBLEFBQU0sSUFBTixBQUFVLFlBQTdCLEFBQXlDLEFBRXpDOztjQUFJLFdBQUEsQUFBVyxXQUFmLEFBQTBCLEdBQUcsQUFBRTttQkFBQSxBQUFPLEFBQUs7QUFFM0M7O2VBQUssSUFBSSxJQUFKLEFBQVEsR0FBRyxNQUFNLFdBQUEsQUFBVyxTQUE1QixBQUFtQyxHQUFHLE1BQU0sS0FBakQsQUFBc0QsS0FBSyxNQUFNLEtBQU4sQUFBVyxNQUFNLEtBQTVFLEFBQWlGLEtBQUssTUFBQSxBQUFNLE1BQTVGLEFBQWtHLEtBQUssQUFDckc7Z0JBQU0sUUFBUSxNQUFBLEFBQU0sSUFBTixBQUFVLFlBQVYsQUFBc0IsT0FBcEMsQUFBYyxBQUE2QixBQUMzQztnQkFBSSxRQUFRLE1BQUEsQUFBTSxXQUFXLElBQTdCLEFBQVksQUFBbUIsQUFFL0I7O2dCQUFJLE1BQU0sTUFBTixBQUFZLE1BQWhCLEFBQXNCLFFBQVEsQUFBRTtzQkFBUSxVQUFBLEFBQVUsT0FBTyxNQUFNLE1BQU4sQUFBWSxNQUE3QixBQUFtQyxRQUFuQyxBQUEyQyxNQUFNLEVBQUMsT0FBMUQsQUFBUSxBQUFpRCxBQUFRLEFBQVU7QUFFM0c7O3lCQUFBLEFBQWEsSUFBYixBQUFpQixNQUFPLE1BQUEsQUFBTSxhQUFhLE1BQTNDLEFBQWlELE1BQWpELEFBQXdELEFBQ3pEO0FBRUQ7O2lCQUFBLEFBQU8sQUFDUjtBQTdFYSxBQStFZDtBQS9FYyxnREErRUUsQUFDZDtpQkFBQSxBQUFPLEFBQ1I7QUFqRmEsQUFtRmQ7QUFuRmMsNENBQUEsQUFtRkQsTUFBTSxBQUNqQjtpQkFBTyxXQUFQLEFBQU8sQUFBVyxBQUNuQjtBQXJGYSxBQXVGZDtBQXZGYyxrREFBQSxBQXVGRSxNQUFpQjtjQUFYLEFBQVcsMkVBQUosQUFBSSxBQUMvQjs7aUJBQU8sV0FBQSxBQUFXLE1BQWxCLEFBQU8sQUFBaUIsQUFDekI7QUF6RmEsQUEyRmQ7QUEzRmMsd0JBQUEsQUEyRlgsTUFBaUI7Y0FBWCxBQUFXLDJFQUFKLEFBQUksQUFDbEI7O2lCQUFPLFVBQUEsQUFBVSxJQUFJLEtBQUEsQUFBSyxnQkFBTCxBQUFxQixNQUExQyxBQUFPLEFBQWMsQUFBMkIsQUFDakQ7QUE3RmEsQUErRmQ7QUEvRmMsNERBK0ZRLEFBQ3BCO2lCQUFBLEFBQU8sQUFDUjtBQWpHYSxBQW1HZDtBQW5HYyxzREFtR0ssQUFDakI7d0JBQUEsQUFBYyxBQUNmO0FBckdhLEFBdUdkO0FBdkdjLGtEQXVHZTs2Q0FBWCxBQUFXLDZEQUFYO0FBQVcseUNBQUE7QUFDM0I7O3dCQUFjLFlBQUEsQUFBWSxPQUExQixBQUFjLEFBQW1CLEFBQ2xDO0FBekdhLEFBMkdkO0FBM0djLGtEQTJHRyxBQUNmO2lCQUFBLEFBQU8sQUFDUjtBQTdHYSxBQStHZDtBQS9HYyxzREFBQSxBQStHSSxVQS9HSixBQStHYyxTQUFTLEFBQ25DO2VBQUEsQUFBSyxnQkFBTCxBQUFxQixZQUFyQixBQUFpQyxBQUNsQztBQWpIYSxBQW1IZDtBQW5IYywwREFtSE8sQUFDbkI7Y0FBSSxLQUFBLEFBQUssZ0JBQVQsQUFBSSxBQUFxQixpQkFBaUIsQUFDeEM7bUJBQU8sS0FBQSxBQUFLLGdCQUFMLEFBQXFCLGdCQUE1QixBQUE0QyxBQUM3QztBQUNGO0FBdkhhLEFBeUhkO0FBekhjLHNEQUFBLEFBeUhJLFVBQVUsQUFDMUI7aUJBQU8sS0FBQSxBQUFLLGdCQUFaLEFBQU8sQUFBcUIsQUFDN0I7QUEzSGEsQUE2SGQ7QUE3SGMsNERBQUEsQUE2SE8sVUFBVSxBQUM3QjtpQkFBTyxLQUFBLEFBQUssZ0JBQVosQUFBTyxBQUFxQixBQUM3QjtBQS9IYSxBQWlJZDtBQWpJYyxzRUFBQSxBQWlJWSxVQWpJWixBQWlJc0IsdUJBQXVCLEFBQ3pEO2NBQU0saUJBQWlCLEtBQUEsQUFBSyxrQkFBNUIsQUFBdUIsQUFBdUIsQUFFOUM7O2NBQUksQ0FBSixBQUFLLGdCQUFnQixBQUNuQjttQkFBQSxBQUFPLEFBQ1I7QUFFRDs7aUJBQU8saUNBQUEsQUFBaUMsU0FDdEMsc0JBQUEsQUFBc0IsS0FBSyxlQUR0QixBQUNMLEFBQTBDLFFBQzFDLGVBQUEsQUFBZSxTQUZqQixBQUUwQixBQUMzQjtBQTNJYSxBQTZJZDtBQTdJYyxvQ0FBQSxBQTZJTCxPQUFPLEFBQ2Q7Y0FBSSxDQUFKLEFBQUssT0FBTyxBQUNWO2lCQUFBLEFBQUssZ0JBQWdCLEdBQXJCLEFBQXFCLEFBQUcsQUFDekI7QUFGRCxpQkFFTyxBQUNMO2lCQUFBLEFBQUssY0FBTCxBQUFtQixBQUNwQjtBQUNEO2lCQUFBLEFBQU8sQUFDUjtBQXBKYSxBQXNKZDtBQXRKYyxvQ0FzSkosQUFDUjtpQkFBQSxBQUFPLEFBQ1I7QUF4SmEsQUEwSmQ7QUExSmMsMERBMEpPLEFBQ25CO2lCQUFBLEFBQU8sQUFDUjtBQTVKYSxBQThKZDtBQTlKYyx3Q0E4SkYsQUFDVjtpQkFBTyxLQUFBLEFBQUssY0FBWixBQUEwQixBQUMzQjtBQWhLSCxBQUFnQixBQW1LaEI7QUFuS2dCLEFBQ2Q7O2FBa0tGLEFBQU8sQUFDUjtBQXRRSCxBQUFpQixBQXlRakI7QUF6UWlCLEFBRWY7O1dBdVFGLEFBQVMsYUFBVCxBQUFzQixhQUFZLE9BQUQsQUFBUSxPQUFPLFNBQVEsQUFBQyxTQUFTLGlCQUFBO2FBQVMsU0FBVCxBQUFTLEFBQVM7QUFBcEYsQUFBaUMsQUFBdUIsQUFDeEQsS0FEd0QsQ0FBdkI7V0FDakMsQUFBUyxhQUFULEFBQXNCLFNBQVMsRUFBQyxPQUFoQyxBQUErQixBQUFRLEFBQ3ZDO1dBQUEsQUFBUyxhQUFULEFBQXNCLE9BQU8sRUFBQyxPQUE5QixBQUE2QixBQUFRLEFBQ3JDO1dBQUEsQUFBUyxhQUFULEFBQXNCLFVBQVMsT0FBRCxBQUFRLE1BQU0sU0FBUSxBQUFDLFNBQVMsaUJBQUE7YUFBUyxNQUFBLEFBQU0sTUFBZixBQUFTLEFBQVk7QUFBbkYsQUFBOEIsQUFBc0IsQUFFcEQsS0FGb0QsQ0FBdEI7O1NBRTlCLEFBQU8sQUFDUjtBQXpSRDs7SSxBQTJSTTs7Ozs7OztrRCxBQUNDLHNCQUFzQixBQUN6QjtBQUNBOzthQUFPLHFCQUFQLEFBQU8sQUFBcUIsQUFDN0I7Ozs7Ozs7QUFHSCxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFmLEFBQWdDLFNBQWhDLEFBQXlDLFNBQVMsSUFBbEQsQUFBa0QsQUFBSTs7QUFFdEQsUUFBQSxBQUFRLE9BQVIsQUFBZSxpQkFBZixBQUFnQyxTQUFoQyxBQUF5QyxnQkFBZ0IsWUFBWSxBQUNuRTtNQUFNLFFBRDZELEFBQ25FLEFBQWM7O01BRHFELEFBRzdELG1CQUNKO2tCQUFBLEFBQVksTUFBWixBQUFrQixVQUFVOzRCQUMxQjs7V0FBQSxBQUFLLE9BQUwsQUFBWSxBQUNaO1dBQUEsQUFBSyxXQUFMLEFBQWdCLEFBQ2hCO1VBQUksRUFBRSxLQUFBLEFBQUssb0JBQVgsQUFBSSxBQUEyQixRQUFRLEFBQ3JDO2FBQUEsQUFBSyxXQUFXLENBQUMsS0FBakIsQUFBZ0IsQUFBTSxBQUN2QjtBQUNGO0FBVmdFOzs7V0FBQTtvQ0FZbkQsQUFDWjtlQUFPLEtBQVAsQUFBWSxBQUNiO0FBZGdFO0FBQUE7O1dBQUE7QUFpQm5FOzs7QUFBTyx3QkFBQSxBQUVBLE1BRkEsQUFFTSxRQUFRLEFBRWpCOztlQUFBLEFBQVMseUJBQVQsQUFBa0MsVUFBbEMsQUFBNEMscUJBQXFCLEFBQy9EO1lBQU0sU0FEeUQsQUFDL0QsQUFBZTt5Q0FEZ0Q7aUNBQUE7OEJBQUE7O1lBRS9EO2dDQUFzQixNQUFBLEFBQU0sS0FBNUIsQUFBc0IsQUFBVywrSUFBYztnQkFBcEMsQUFBb0MsaUJBQzdDOztnQkFBSSxFQUFFLFFBQUEsQUFBUSx5QkFBZCxBQUFJLEFBQW1DLFFBQVEsQUFDN0M7c0JBQUEsQUFBUSxnQkFBZ0IsQ0FBQyxRQUF6QixBQUF3QixBQUFTLEFBQ2xDO0FBQ0Q7bUJBQUEsQUFBTyxLQUFLLFFBQUEsQUFBUSxnQkFBZ0IsUUFBQSxBQUFRLGNBQVIsQUFBc0IsT0FBMUQsQUFBb0MsQUFBNkIsQUFDbEU7QUFQOEQ7c0JBQUE7K0JBQUE7NEJBQUE7a0JBQUE7Y0FBQTtrRUFBQTt5QkFBQTtBQUFBO29CQUFBO29DQUFBO29CQUFBO0FBQUE7QUFBQTtBQVEvRDs7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7ZUFBQSxBQUFTLG1CQUFULEFBQTRCLFVBQTVCLEFBQXNDLGVBQWUsQUFDbkQ7WUFBTSxTQUQ2QyxBQUNuRCxBQUFlO3lDQURvQztpQ0FBQTs4QkFBQTs7WUFFbkQ7Z0NBQXNCLE1BQUEsQUFBTSxLQUE1QixBQUFzQixBQUFXLCtJQUFjO2dCQUFwQyxBQUFvQyxpQkFDN0M7O2dCQUFJLEVBQUUsYUFBTixBQUFJLEFBQWUsVUFBVSxBQUMzQjtzQkFBQSxBQUFRLFVBQVIsQUFBa0IsQUFDbkI7QUFDRDttQkFBQSxBQUFPLEtBQUssRUFBQSxBQUFFLFNBQVMsUUFBWCxBQUFtQixTQUEvQixBQUFZLEFBQTRCLEFBQ3pDO0FBUGtEO3NCQUFBOytCQUFBOzRCQUFBO2tCQUFBO2NBQUE7a0VBQUE7eUJBQUE7QUFBQTtvQkFBQTtvQ0FBQTtvQkFBQTtBQUFBO0FBQUE7QUFRbkQ7O2VBQUEsQUFBTyxBQUNSO0FBRUQ7O2VBQUEsQUFBUyxrQkFBVCxBQUEyQixhQUFhLEFBQ3RDO1lBQU0sb0JBQW9CLENBQ3hCLEVBQUMsTUFBRCxBQUFPLG1DQUFtQyxlQURsQixBQUN4QixBQUF5RCwrQkFDekQsRUFBQyxNQUFELEFBQU8saUNBQWlDLGVBRmhCLEFBRXhCLEFBQXVELDZCQUN2RCxFQUFDLE1BQUQsQUFBTyx3QkFBd0IsZUFIUCxBQUd4QixBQUE4QyxvQkFDOUMsRUFBQyxNQUFELEFBQU8sMEJBQTBCLGVBTEcsQUFDdEMsQUFBMEIsQUFJeEIsQUFBZ0Q7OzBDQUxaO2tDQUFBOytCQUFBOztZQVF0QztpQ0FBMEIsTUFBQSxBQUFNLEtBQWhDLEFBQTBCLEFBQVcsMEpBQW9CO2dCQUE5QyxBQUE4QyxzQkFDdkQ7O2dCQUFJLFlBQUEsQUFBWSxRQUFoQixBQUF3QixRQUFRLEFBQzlCO2tDQUFBLEFBQW9CLGFBQWEsWUFBakMsQUFBNkMsZUFBZSxPQUFPLFlBQW5FLEFBQTRELEFBQW1CLEFBQ2hGO0FBQ0Y7QUFacUM7c0JBQUE7Z0NBQUE7NkJBQUE7a0JBQUE7Y0FBQTtvRUFBQTswQkFBQTtBQUFBO29CQUFBO3FDQUFBO29CQUFBO0FBQUE7QUFBQTtBQWN0Qzs7WUFBSSx5QkFBSixBQUE2QixRQUFRLEFBQ25DO21DQUFBLEFBQXlCLGFBQWEsT0FBdEMsQUFBc0MsQUFBTyxBQUM5QztBQUVEOztZQUFJLG1CQUFKLEFBQXVCLFFBQVEsQUFDN0I7aUJBQU8sbUJBQUEsQUFBbUIsYUFBYSxPQUF2QyxBQUFPLEFBQWdDLEFBQU8sQUFDL0M7QUFDRjtBQUVEOztlQUFBLEFBQVMsb0JBQVQsQUFBNkIsVUFBN0IsQUFBdUMsV0FBdkMsQUFBa0QsY0FBYyxBQUM5RDtZQUFNLFNBRHdELEFBQzlELEFBQWU7MENBRCtDO2tDQUFBOytCQUFBOztZQUU5RDtpQ0FBc0IsTUFBQSxBQUFNLEtBQTVCLEFBQXNCLEFBQVcsb0pBQWM7Z0JBQXBDLEFBQW9DLGtCQUM3Qzs7Z0JBQUksWUFBSixBQUNBO2dCQUFJLEVBQUUsYUFBTixBQUFJLEFBQWUsVUFBVSxBQUMzQjtxQkFBTyxRQUFBLEFBQVEsYUFBZixBQUE0QixBQUM3QjtBQUNEO21CQUFBLEFBQU8sS0FBUCxBQUFZLEFBQ2I7QUFSNkQ7c0JBQUE7Z0NBQUE7NkJBQUE7a0JBQUE7Y0FBQTtvRUFBQTswQkFBQTtBQUFBO29CQUFBO3FDQUFBO29CQUFBO0FBQUE7QUFBQTtBQVM5RDs7ZUFBQSxBQUFPLEFBQ1I7QUFFRDs7VUFBSSxjQUFKLEFBQWtCLEFBQ2xCO1VBQUksY0FBSixBQUFrQixRQUFRLEFBQ3hCO3NCQUFjLE9BQWQsQUFBYyxBQUFPLEFBQ3RCO0FBRkQsYUFFTyxBQUNMO3NCQUFlLGtCQUFELEFBQW1CLFFBQW5CLEFBQTRCLFNBQVMsQ0FBbkQsQUFBbUQsQUFBQyxBQUNyRDtBQUVEOztVQUFJLEVBQUUsWUFBQSxBQUFZLFNBQWxCLEFBQUksQUFBdUIsSUFBSSxBQUM3QjtjQUFNLElBQUEsQUFBSSxnRUFBSixBQUFpRSxPQUF2RSxBQUNEO0FBRUQ7O3dCQUFBLEFBQWtCLEFBQ2xCO2FBQU8sTUFBQSxBQUFNLFFBQVEsSUFBQSxBQUFJLEtBQUosQUFBUyxNQUE5QixBQUFxQixBQUFlLEFBQ3JDO0FBMUVJLEFBNEVMO0FBNUVLLDBCQTRFRSxBQUNMOztBQUFPLGtDQUFBLEFBQ0csTUFBTSxBQUNaO2lCQUFPLE1BQVAsQUFBTyxBQUFNLEFBQ2Q7QUFISCxBQUFPLEFBS1I7QUFMUSxBQUNMO0FBOUVOLEFBQU8sQUFvRlI7QUFwRlEsQUFFTDtBQW5CSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJhbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicsIFsnbmdBbmltYXRlJ10pLnJ1bihmdW5jdGlvbiAoU3RhdGUsIFJvdXRlLCAkbG9jYXRpb24sICRyb290U2NvcGUsIE9iamVjdEhlbHBlciwgUGVuZGluZ1ZpZXdDb3VudGVyKSB7XG4gIFwibmdJbmplY3RcIjtcblxuICBsZXQgb2xkVXJsID0gdW5kZWZpbmVkO1xuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJvdXRlLmlzUmVhZHkoKSkge1xuICAgICAgUm91dGUuc2V0UmVhZHkoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZSwgbmV3VXJsKSB7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZXZlbnREYXRhID0geyd2aWV3TmFtZSc6IFJvdXRlLmdldEN1cnJlbnRWaWV3TmFtZSgpfTtcbiAgICAgICRyb290U2NvcGUuJGVtaXQoJ2JpY2tlcl9yb3V0ZXIuJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGV2ZW50RGF0YSk7XG4gICAgfSwgMSlcblxuICAgIC8vIFdvcmstYXJvdW5kIGZvciBBbmd1bGFySlMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9pc3N1ZXMvODM2OFxuICAgIGxldCBkYXRhO1xuICAgIGlmIChuZXdVcmwgPT09IG9sZFVybCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9sZFVybCA9IG5ld1VybDtcblxuICAgIFBlbmRpbmdWaWV3Q291bnRlci5yZXNldCgpO1xuICAgIGNvbnN0IG1hdGNoID0gUm91dGUubWF0Y2goJGxvY2F0aW9uLnBhdGgoKSk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBSb3V0ZS5leHRyYWN0RGF0YShtYXRjaCk7XG4gICAgfVxuXG4gICAgbGV0IGZpZWxkc1RvVW5zZXQgPSBPYmplY3RIZWxwZXIubm90SW4oU3RhdGUubGlzdCwgZGF0YSk7XG4gICAgZmllbGRzVG9VbnNldCA9IF8uZGlmZmVyZW5jZShmaWVsZHNUb1Vuc2V0LCBSb3V0ZS5nZXRQZXJzaXN0ZW50U3RhdGVzKCkuY29uY2F0KFJvdXRlLmdldEZsYXNoU3RhdGVzKCkpKTtcblxuICAgIGNvbnN0IGV2ZW50RGF0YSA9IHt1bnNldHRpbmc6IGZpZWxkc1RvVW5zZXQsIHNldHRpbmc6IGRhdGF9O1xuXG4gICAgJHJvb3RTY29wZS4kZW1pdCgnYmlja2VyX3JvdXRlci5iZWZvcmVTdGF0ZUNoYW5nZScsIGV2ZW50RGF0YSk7XG5cbiAgICBpZiAoKGV2ZW50RGF0YS51bnNldHRpbmcpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgU3RhdGUudW5zZXQoZXZlbnREYXRhLnVuc2V0dGluZyk7XG4gICAgfVxuXG4gICAgXy5mb3JFYWNoKGV2ZW50RGF0YS5zZXR0aW5nLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgU3RhdGUuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgUm91dGUucmVzZXRGbGFzaFN0YXRlcygpO1xuICAgIFJvdXRlLnNldFJlYWR5KHRydWUpO1xuICB9KTtcbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmNvbnN0YW50KCdPYmplY3RIZWxwZXInLCB7XG4gIGdldChvYmplY3QsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJycpIHsgcmV0dXJuIG9iamVjdDsgfVxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIHBhcmVudCA9IHBhcmVudFtzZWdtZW50XTtcbiAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudFtrZXldO1xuICB9LFxuXG4gIHNldChvYmplY3QsIHBhdGgsIHZhbHVlKSB7XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgaWYgKHBhcmVudFtzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhcmVudFtzZWdtZW50XSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudFtrZXldID0gdmFsdWU7XG4gIH0sXG5cbiAgdW5zZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudFtrZXldID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgZGVsZXRlIHBhcmVudFtrZXldO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIC8vIFJlY3Vyc2l2ZWx5IHJldHVybiB0aGUgcHJvcGVydGllcyBpbiBhIHRoYXQgYXJlbid0IGluIGJcbiAgbm90SW4oYSwgYiwgcHJlZml4ID0gJycpIHtcbiAgICBsZXQgbm90SW4gPSBbXTtcbiAgICBwcmVmaXggPSBwcmVmaXgubGVuZ3RoID4gMCA/IGAke3ByZWZpeH0uYCA6ICcnO1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgQXJyYXkuZnJvbShPYmplY3Qua2V5cyhhKSkpIHtcbiAgICAgIGNvbnN0IHRoaXNQYXRoID0gYCR7cHJlZml4fSR7a2V5fWA7XG5cbiAgICAgIGlmIChiW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBub3RJbi5wdXNoKHRoaXNQYXRoKTtcblxuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIGFba2V5XSA9PT0gJ29iamVjdCcpICYmICghKGFba2V5XSBpbnN0YW5jZW9mIEFycmF5KSkpIHtcbiAgICAgICAgbm90SW4gPSBub3RJbi5jb25jYXQodGhpcy5ub3RJbihhW2tleV0sIGJba2V5XSwgdGhpc1BhdGgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm90SW47XG4gIH0sXG5cbiAgZGVmYXVsdChvdmVycmlkZXMsIC4uLmRlZmF1bHRTZXRzKSB7XG4gICAgbGV0IGRlZmF1bHRTZXQsIHZhbHVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgaWYgKGRlZmF1bHRTZXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZGVmYXVsdFNldCA9IGRlZmF1bHRTZXRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZhdWx0U2V0ID0gdGhpcy5kZWZhdWx0KC4uLkFycmF5LmZyb20oZGVmYXVsdFNldHMgfHwgW10pKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkZWZhdWx0U2V0KSB7XG4gICAgICB2YWx1ZSA9IGRlZmF1bHRTZXRba2V5XTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV0gfHwgdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2Ygb3ZlcnJpZGVzW2tleV0gPT09IFwib2JqZWN0XCIpKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy5kZWZhdWx0KG92ZXJyaWRlc1trZXldLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIG92ZXJyaWRlcykge1xuICAgICAgdmFsdWUgPSBvdmVycmlkZXNba2V5XTtcbiAgICAgIHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gfHwgdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG5cblxuLy8gVXNhZ2U6XG4vL1xuLy8gSWYgeW91IHdhbnQgdG8gYWRkIHRoZSBjbGFzcyBcImFjdGl2ZVwiIHRvIGFuIGFuY2hvciBlbGVtZW50IHdoZW4gdGhlIFwibWFpblwiIHZpZXcgaGFzIGEgYmluZGluZ1xuLy8gd2l0aCB0aGUgbmFtZSBcIm15QmluZGluZ1wiIHJlbmRlcmVkIHdpdGhpbiBpdFxuLy9cbi8vIDxhIHJvdXRlLWNsYXNzPVwieyBjbGFzc05hbWU6ICdhY3RpdmUnLCB2aWV3TmFtZTogJ21haW4nLCBiaW5kaW5nTmFtZTogJ215QmluZGluZycgfVwiPkFuY2hvciB0ZXh0PC9hPlxuLy9cbi8vIFlvdSBjYW4gYWxzbyB1c2UgcmVndWxhciBleHByZXNzaW9ucyBmb3IgdGhlIGJpbmRpbmcgbmFtZSwgYnV0IHRvIGRvIHNvIHlvdSBoYXZlIHRvIHByb3ZpZGUgYSBtZXRob2Rcbi8vIG9uIHlvdXIgY29udHJvbGxlciB3aGljaCByZXR1cm5zIHRoZSByb3V0ZSBjbGFzcyBkZWZpbml0aW9uIG9iamVjdCwgYmVjYXVzZSBBbmd1bGFySlMgZXhwcmVzc2lvbnNcbi8vIGRvbid0IHN1cHBvcnQgaW5saW5lIHJlZ3VsYXIgZXhwcmVzc2lvbnNcbi8vXG4vLyBjbGFzcyBNeUNvbnRyb2xsZXIge1xuLy8gIGdldFJvdXRlQ2xhc3NPYmplY3QoKSB7XG4vLyAgICByZXR1cm4geyBjbGFzc05hbWU6ICdhY3RpdmUnLCB2aWV3TmFtZTogJ21haW4nLCBiaW5kaW5nTmFtZTogL215QmluZC8gfVxuLy8gIH1cbi8vIH1cbi8vXG4vLyA8YSByb3V0ZS1jbGFzcz1cIiRjdHJsLmdldFJvdXRlQ2xhc3NPYmplY3QoKVwiPkFuY2hvciB0ZXh0PC9hPlxuLy9cblxuZnVuY3Rpb24gcm91dGVDbGFzc0ZhY3RvcnkoUm91dGUpIHtcbiAgJ25nSW5qZWN0J1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgbGluayAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgIHNjb3BlLiR3YXRjaCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJvdXRlQ2xhc3NEZWZpbml0aW9uID0gc2NvcGUuJGV2YWwoaUF0dHJzWydyb3V0ZUNsYXNzJ10pXG5cbiAgICAgICAgaWYgKCFSb3V0ZS5tYXRjaGVzQ3VycmVudEJpbmRpbmdOYW1lKHJvdXRlQ2xhc3NEZWZpbml0aW9uLnZpZXdOYW1lLCByb3V0ZUNsYXNzRGVmaW5pdGlvbi5iaW5kaW5nTmFtZSkpIHtcbiAgICAgICAgICBpZiAoaUVsZW1lbnQuaGFzQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgaUVsZW1lbnQucmVtb3ZlQ2xhc3Mocm91dGVDbGFzc0RlZmluaXRpb24uY2xhc3NOYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIWlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LmFkZENsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZGlyZWN0aXZlKCdyb3V0ZUNsYXNzJywgcm91dGVDbGFzc0ZhY3RvcnkpO1xuXG5mdW5jdGlvbiByb3V0ZUhyZWZGYWN0b3J5IChSb3V0ZSwgJGxvY2F0aW9uLCAkdGltZW91dCkge1xuICAnbmdJbmplY3QnXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHNjb3BlOiB0cnVlLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBpZiAoaUF0dHJzLmlnbm9yZUhyZWYgPT09IHVuZGVmaW5lZCAmJiBSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSkge1xuICAgICAgICBpRWxlbWVudC5jbGljaygoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCB1cmxQYXRoID0gaUVsZW1lbnQuYXR0cignaHJlZicpLnJlcGxhY2UoL14jLywgJycpO1xuICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KCgpID0+ICRsb2NhdGlvbi51cmwodXJsUGF0aCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2JqZWN0ID0gUm91dGUuZ2V0VXJsV3JpdGVycygpO1xuICAgICAgZm9yIChjb25zdCB3cml0ZXJOYW1lIGluIG9iamVjdCkge1xuICAgICAgICBjb25zdCB3cml0ZXIgPSBvYmplY3Rbd3JpdGVyTmFtZV07XG4gICAgICAgIHNjb3BlW2Ake3dyaXRlck5hbWV9VXJsV3JpdGVyYF0gPSB3cml0ZXI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzY29wZS4kd2F0Y2goaUF0dHJzLnJvdXRlSHJlZiwgKG5ld1VybCkgPT4ge1xuICAgICAgICBsZXQgdXJsO1xuICAgICAgICBpZiAoUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICB1cmwgPSBuZXdVcmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXJsID0gYCMke25ld1VybH1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpRWxlbWVudC5hdHRyKCdocmVmJywgdXJsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVIcmVmJywgcm91dGVIcmVmRmFjdG9yeSk7XG5cbmZ1bmN0aW9uIHJvdXRlT25DbGlja0ZhY3RvcnkgKFJvdXRlLCAkbG9jYXRpb24sICR3aW5kb3csICR0aW1lb3V0KSB7XG4gICduZ0luamVjdCdcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG5cbiAgICBsaW5rIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIGNvbnN0IExFRlRfQlVUVE9OID0gMDtcbiAgICAgIGNvbnN0IE1JRERMRV9CVVRUT04gPSAxO1xuXG4gICAgICBpZiAoZWxlbWVudC5pcygnYScpKSB7XG4gICAgICAgIGFkZFdhdGNoVGhhdFVwZGF0ZXNIcmVmQXR0cmlidXRlKCk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuY2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gTEVGVF9CVVRUT04pIHtcbiAgICAgICAgICAgIG5hdmlnYXRlVG9VcmwoZ2V0VXJsKCksIHNob3VsZE9wZW5OZXdXaW5kb3coZXZlbnQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQubW91c2V1cCgoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09PSBNSURETEVfQlVUVE9OKSB7XG4gICAgICAgICAgICBuYXZpZ2F0ZVRvVXJsKGdldFVybCgpLCBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbmF2aWdhdGVUb1VybChfdXJsLCBuZXdXaW5kb3cgPSBmYWxzZSkge1xuICAgICAgICBsZXQgdXJsID0gX3VybDtcblxuICAgICAgICBpZiAobmV3V2luZG93KSB7XG4gICAgICAgICAgdXJsID0gYCR7JHdpbmRvdy5sb2NhdGlvbi5vcmlnaW59LyR7dXJsfWA7XG4gICAgICAgICAgJHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmwpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBldmVudC5idXR0b24gPT09IE1JRERMRV9CVVRUT04gfHwgKGV2ZW50LmJ1dHRvbiA9PT0gTEVGVF9CVVRUT04gJiYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRVcmwoKSB7XG4gICAgICAgIGNvbnN0IHVybFdyaXRlcnMgPSBSb3V0ZS5nZXRVcmxXcml0ZXJzKCk7XG4gICAgICAgIGNvbnN0IGxvY2FscyA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiB1cmxXcml0ZXJzKSB7XG4gICAgICAgICAgbG9jYWxzW2Ake3dyaXRlck5hbWV9VXJsV3JpdGVyYF0gPSB1cmxXcml0ZXJzW3dyaXRlck5hbWVdO1xuICAgICAgfVxuXG4gICAgICAgIGxldCB1cmwgPSBzY29wZS4kZXZhbChhdHRycy5yb3V0ZU9uQ2xpY2ssIF8uYXNzaWduKGxvY2Fscywgc2NvcGUpKTtcblxuICAgICAgICByZXR1cm4gaHRtbDVUaGVVcmwodXJsKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaHRtbDVUaGVVcmwodXJsKSB7XG4gICAgICAgIHJldHVybiBSb3V0ZS5pc0h0bWw1TW9kZUVuYWJsZWQoKSA/IHVybCA6IGAjJHt1cmx9YDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYWRkV2F0Y2hUaGF0VXBkYXRlc0hyZWZBdHRyaWJ1dGUoKSB7XG4gICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGAke2dldFVybCgpfWBcbiAgICAgICAgfSwgKG5ld1VybCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuYXR0cignaHJlZicsIG5ld1VybCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVPbkNsaWNrJywgcm91dGVPbkNsaWNrRmFjdG9yeSk7XG5cbi8vIEBUT0RPIG5vbmUgb2YgdGhlIGFuaW1hdGlvbiBjb2RlIGluIHRoaXMgZGlyZWN0aXZlIGhhcyBiZWVuIHRlc3RlZC4gTm90IHN1cmUgaWYgaXQgY2FuIGJlIGF0IHRoaXMgc3RhZ2UgVGhpcyBuZWVkcyBmdXJ0aGVyIGludmVzdGlnYXRpb24uXG4vLyBAVE9ETyB0aGlzIGNvZGUgZG9lcyB0b28gbXVjaCwgaXQgc2hvdWxkIGJlIHJlZmFjdG9yZWQuXG5cbmZ1bmN0aW9uIHJvdXRlVmlld0ZhY3RvcnkoJGxvZywgJGNvbXBpbGUsICRjb250cm9sbGVyLCBWaWV3QmluZGluZ3MsICRxLCBTdGF0ZSwgJHJvb3RTY29wZSwgJGFuaW1hdGUsICR0aW1lb3V0LCAkaW5qZWN0b3IsIFBlbmRpbmdWaWV3Q291bnRlciwgJHRlbXBsYXRlUmVxdWVzdCwgUm91dGUpIHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiBmYWxzZSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlOiAnPGRpdj48L2Rpdj4nLFxuICAgIGxpbmsgKHZpZXdEaXJlY3RpdmVTY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgbGV0IHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICBsZXQgdmlld1Njb3BlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgY29uc3QgdmlldyA9IFZpZXdCaW5kaW5ncy5nZXRWaWV3KGlBdHRycy5uYW1lKTtcbiAgICAgIGNvbnN0IGJpbmRpbmdzID0gdmlldy5nZXRCaW5kaW5ncygpO1xuXG4gICAgICBpRWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXG4gICAgICBsZXQgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVEYXRhRm9yQmluZGluZyA9IGJpbmRpbmcgPT4gXy5jbG9uZURlZXAoU3RhdGUuZ2V0U3Vic2V0KGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcoYmluZGluZykpKTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgZmllbGQpIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgIGZpZWxkID0gJ2NvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlID0gYmluZGluZ1tmaWVsZF0gPyAkaW5qZWN0b3IuZ2V0KGAke2JpbmRpbmdbZmllbGRdfURpcmVjdGl2ZWApWzBdIDogYmluZGluZztcbiAgICAgICAgcmV0dXJuIF8uZGVmYXVsdHMoXy5waWNrKHNvdXJjZSwgWydjb250cm9sbGVyJywgJ3RlbXBsYXRlVXJsJywgJ2NvbnRyb2xsZXJBcyddKSwge2NvbnRyb2xsZXJBczogJyRjdHJsJ30pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNSZXF1aXJlZERhdGEoYmluZGluZykge1xuICAgICAgICBjb25zdCByZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdO1xuXG4gICAgICAgIGZvciAobGV0IHJlcXVpcmVtZW50IG9mIEFycmF5LmZyb20ocmVxdWlyZWRTdGF0ZSkpIHtcbiAgICAgICAgICBsZXQgbmVnYXRlUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCchJyA9PT0gcmVxdWlyZW1lbnQuY2hhckF0KDApKSB7XG4gICAgICAgICAgICByZXF1aXJlbWVudCA9IHJlcXVpcmVtZW50LnNsaWNlKDEpO1xuICAgICAgICAgICAgbmVnYXRlUmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgZWxlbWVudCA9IFN0YXRlLmdldChyZXF1aXJlbWVudCk7XG5cbiAgICAgICAgICAvLyBSZXR1cm4gZmFsc2UgaWYgZWxlbWVudCBpcyB1bmRlZmluZWRcbiAgICAgICAgICBpZiAoKGVsZW1lbnQgPT09IG51bGwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT25seSBjaGVjayB2YWx1ZSBvZiBlbGVtZW50IGlmIGl0IGlzIGRlZmluZWRcbiAgICAgICAgICBpZiAobmVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gIWVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiaW5kaW5nLmNhbkFjdGl2YXRlKSB7XG4gICAgICAgICAgaWYgKCEkaW5qZWN0b3IuaW52b2tlKGJpbmRpbmcuY2FuQWN0aXZhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1hbmFnZVZpZXcoZWxlbWVudCwgYmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdCaW5kaW5nID0gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKTtcblxuICAgICAgICBpZiAoIW1hdGNoaW5nQmluZGluZykge1xuICAgICAgICAgIGlmICh2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3lWaWV3KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBSb3V0ZS5kZWxldGVDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1N0YXRlID0gZ2V0U3RhdGVEYXRhRm9yQmluZGluZyhtYXRjaGluZ0JpbmRpbmcpO1xuICAgICAgICBpZiAoKG1hdGNoaW5nQmluZGluZyA9PT0gcHJldmlvdXNCaW5kaW5nKSAmJiBhbmd1bGFyLmVxdWFscyhwcmV2aW91c0JvdW5kU3RhdGUsIG5ld1N0YXRlKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZpb3VzQmluZGluZyA9IG1hdGNoaW5nQmluZGluZztcbiAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gbmV3U3RhdGU7XG5cbiAgICAgICAgUGVuZGluZ1ZpZXdDb3VudGVyLmluY3JlYXNlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKGhhc1Jlc29sdmluZ1RlbXBsYXRlKSB7XG4gICAgICAgICAgLy8gQFRPRE86IE1hZ2ljIG51bWJlclxuICAgICAgICAgIGNvbnN0IGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uID0gaGFzUmVzb2x2aW5nVGVtcGxhdGUgPyAzMDAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBpZiAoIXZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGFuaW1hdGUucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpIHtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20oYmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVzdHJveVZpZXcoZWxlbWVudCkge1xuICAgICAgICBpZiAodmlld0NyZWF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKS5yZW1vdmUoKTtcbiAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXcoZWxlbWVudCwgYmluZGluZywgbWluaW11bURlbGF5KSB7XG4gICAgICAgIGNvbnN0IHRpbWVTdGFydGVkTWFpblZpZXcgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nKTtcblxuICAgICAgICBjb25zdCBvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgICBpZiAoZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSAhPT0gYmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZpZXdDcmVhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGNvbnN0IHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lID0gRGF0ZS5ub3coKSAtIHRpbWVTdGFydGVkTWFpblZpZXc7XG5cbiAgICAgICAgICBjb25zdCBpbmplY3RNYWluVGVtcGxhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzaG93RXJyb3IoZSwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBnaXZlIHRoZSB2aWV3IHRpbWUgdG8gcHJvcGVybHkgaW5pdGlhbGlzZVxuICAgICAgICAgICAgICAvLyBiZWZvcmUgcG90ZW50aWFsbHkgdHJpZ2dlcmluZyB0aGUgaW50aWFsVmlld3NMb2FkZWQgZXZlbnRcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkgPSBNYXRoLm1heCgwLCBtaW5pbXVtRGVsYXkgLSByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSk7XG5cbiAgICAgICAgICBpZiAocmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiBpbmplY3RNYWluVGVtcGxhdGUoKVxuICAgICAgICAgICAgICAsIG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluamVjdE1haW5UZW1wbGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblJlc29sdXRpb25GYWlsdXJlID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgICRsb2cuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIFJvdXRlLnNldEN1cnJlbnRCaW5kaW5nKHZpZXcubmFtZSwgYmluZGluZylcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7dGVtcGxhdGU6ICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKSwgZGVwZW5kZW5jaWVzOiByZXNvbHZlKGJpbmRpbmcpfTtcbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uLCBvblJlc29sdXRpb25GYWlsdXJlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsIHx8ICFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICByZXR1cm4gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKSgkcm9vdFNjb3BlLiRuZXcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLnJlc29sdmluZ0Vycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd1Jlc29sdmluZ0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGxldCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChiaW5kaW5nLmVycm9yVGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcuZXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNob3dFcnJvclRlbXBsYXRlID0gKGVsZW1lbnQsIGJpbmRpbmcpID0+IHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdlcnJvclRlbXBsYXRlVXJsJyk7XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsIHRlbXBsYXRlRmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nW3RlbXBsYXRlRmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuICAgICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICAgIGJpbmRpbmdDb21wb25lbnRGaWVsZCA9ICdlcnJvckNvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFiaW5kaW5nW2JpbmRpbmdDb21wb25lbnRGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHtkZXBlbmRlbmNpZXM6IHtlcnJvcn19O1xuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBhcmdzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncykge1xuICAgICAgICBjb25zdCB7ZGVwZW5kZW5jaWVzfSA9IGFyZ3M7XG4gICAgICAgIGNvbnN0IHt0ZW1wbGF0ZX0gPSBhcmdzO1xuXG4gICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQuY29udHJvbGxlcikge1xuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IF8ubWVyZ2UoZGVwZW5kZW5jaWVzLCB7JHNjb3BlOiB2aWV3U2NvcGUsICRlbGVtZW50OiBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCl9KTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbHMuJHNjb3BlW2NvbXBvbmVudC5jb250cm9sbGVyQXNdID0gJGNvbnRyb2xsZXIoY29tcG9uZW50LmNvbnRyb2xsZXIsIGxvY2Fscyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSAnRmFpbGVkIHRvIHNlcmlhbGl6ZSBlcnJvciBvYmplY3QgZm9yIGxvZ2dpbmcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkbG9nLmVycm9yKGBGYWlsZWQgaW5zdGFudGlhdGluZyBjb250cm9sbGVyIGZvciB2aWV3ICR7dmlld306ICR7ZXJyb3JNZXNzYWdlfWApO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZSA9IGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7fSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgZGVwZW5kZW5jeU5hbWUgaW4gYmluZGluZy5yZXNvbHZlKSB7XG4gICAgICAgICAgY29uc3QgZGVwZW5kZW5jeUZhY3RvcnkgPSBiaW5kaW5nLnJlc29sdmVbZGVwZW5kZW5jeU5hbWVdO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkaW5qZWN0b3IuaW52b2tlKGRlcGVuZGVuY3lGYWN0b3J5KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkcS5yZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcyk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nID0gYmluZGluZyA9PiBfLnVuaW9uKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXSwgYmluZGluZy53YXRjaGVkU3RhdGUgfHwgW10pO1xuXG4gICAgICBmdW5jdGlvbiBzdHJpcE5lZ2F0aW9uUHJlZml4KHN0cikge1xuICAgICAgICBpZiAoc3RyLmNoYXJBdCgwKSA9PT0gJyEnKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3ID0gdmlldyA9PiBfLmZsYXR0ZW4oXy5tYXAodmlldy5nZXRCaW5kaW5ncygpLCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKSk7XG5cbiAgICAgIGNvbnN0IGdldEZpZWxkc1RvV2F0Y2ggPSB2aWV3ID0+IF8udW5pcShfLm1hcChnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3KHZpZXcpLCBzdHJpcE5lZ2F0aW9uUHJlZml4KSk7XG5cbiAgICAgIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc1RvV2F0Y2godmlldyk7XG5cbiAgICAgIHJldHVybiBSb3V0ZS53aGVuUmVhZHkoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAvLyBUcnkgdG8gc3RhcnQgdGhlIGJhbGwgcm9sbGluZyBpbiBjYXNlIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIGFuZCB3ZSBjYW4gY3JlYXRlIHRoZSB2aWV3IGltbWVkaWF0ZWx5XG4gICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gRG9uJ3QgYm90aGVyIHB1dHRpbmcgaW4gYSB3YXRjaGVyIGlmIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBldmVyIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgaWYgKGZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0ZVdhdGNoZXIgPSBmdW5jdGlvbiAoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgIGlmICh2aWV3TWFuYWdlbWVudFBlbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGZpbmlzaCB0aGUgZGlnZXN0IGN5Y2xlIGJlZm9yZSBidWlsZGluZyB0aGUgdmlldywgd2hpY2ggc2hvdWxkXG4gICAgICAgICAgLy8gcHJldmVudCB1cyBmcm9tIHJlLXJlbmRlcmluZyBhIHZpZXcgbXVsdGlwbGUgdGltZXMgaWYgbXVsdGlwbGUgcHJvcGVydGllcyBvZiB0aGUgc2FtZSBzdGF0ZSBkZXBlbmRlbmN5XG4gICAgICAgICAgLy8gZ2V0IGNoYW5nZWQgd2l0aCByZXBlYXRlZCBTdGF0ZS5zZXQgY2FsbHNcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIFN0YXRlLndhdGNoKGZpZWxkcywgc3RhdGVXYXRjaGVyKTtcblxuICAgICAgICB2aWV3RGlyZWN0aXZlU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IFN0YXRlLnJlbW92ZVdhdGNoZXIoc3RhdGVXYXRjaGVyKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3ZpZXcnLCByb3V0ZVZpZXdGYWN0b3J5KTtcblxuY2xhc3MgUGVuZGluZ1ZpZXdDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoJHJvb3RTY29wZSkge1xuICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgfVxuXG4gIGluY3JlYXNlKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50ICs9IDE7XG4gIH1cblxuICBkZWNyZWFzZSgpIHtcbiAgICB0aGlzLmNvdW50ID0gTWF0aC5tYXgoMCwgdGhpcy5jb3VudCAtIDEpO1xuICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuaW5pdGlhbFZpZXdzTG9hZGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5jdXJyZW50Vmlld3NMb2FkZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1BlbmRpbmdWaWV3Q291bnRlcicsICgkcm9vdFNjb3BlKSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgUGVuZGluZ1ZpZXdDb3VudGVyKCRyb290U2NvcGUpO1xufSk7XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3Qge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5LCBsaXN0KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuXG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLndhdGNoZXJzID0gW107XG4gIH1cblxuICBnZXQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgfVxuXG4gIGdldEFsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0O1xuICB9XG5cbiAgZ2V0U3Vic2V0KHBhdGhzKSB7XG4gICAgcmV0dXJuIF8uemlwT2JqZWN0KHBhdGhzLCBfLm1hcChwYXRocywgdGhpcy5nZXQuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIuc2V0KHRoaXMubGlzdCwgcGF0aCwgdmFsdWUpO1xuICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIHVuc2V0KHBhdGhzKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLk9iamVjdEhlbHBlci51bnNldCh0aGlzLmxpc3QsIHBhdGgpO1xuICAgICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdhdGNoKHBhdGhzLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLndhdGNoZXJzLnB1c2godGhpcy5XYXRjaGVyRmFjdG9yeS5jcmVhdGUocGF0aCwgaGFuZGxlciwgdGhpcy5nZXQocGF0aCkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZVdhdGNoZXIod2F0Y2hlcikge1xuICAgIGlmICh0aGlzLndhdGNoZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdXYXRjaGVycyA9IFtdO1xuXG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHRoaXNXYXRjaGVyID0+IHtcbiAgICAgIGlmICh0aGlzV2F0Y2hlci5oYW5kbGVyICE9PSB3YXRjaGVyKSB7XG4gICAgICAgIG5ld1dhdGNoZXJzLnB1c2godGhpc1dhdGNoZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMud2F0Y2hlcnMgPSBuZXdXYXRjaGVycztcbiAgfVxuXG4gIF9ub3RpZnlXYXRjaGVycyhjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgd2F0Y2hlciA9PiB7XG4gICAgICBpZiAod2F0Y2hlci5zaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGggPSB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCB3YXRjaGVyLndhdGNoUGF0aCk7XG4gICAgICAgIHdhdGNoZXIubm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3RGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcbiAgfVxuXG4gIGNyZWF0ZShsaXN0ID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3QodGhpcy5PYmplY3RIZWxwZXIsIHRoaXMuV2F0Y2hlckZhY3RvcnksIGxpc3QpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hhYmxlTGlzdEZhY3RvcnknLCAoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3RGYWN0b3J5KE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpO1xufSk7XG5cbmNsYXNzIFdhdGNoZXIge1xuICBjb25zdHJ1Y3Rvcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHRoaXMud2F0Y2hQYXRoID0gd2F0Y2hQYXRoO1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChpbml0aWFsVmFsdWUpO1xuICB9XG5cbiAgX3Rva2VuaXplUGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKTtcbiAgfVxuXG4gIHNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICAvLyBOQiBzaG9ydCBjaXJjdWl0IGxvZ2ljIGluIHRoZSBzaW1wbGUgY2FzZVxuICAgIGlmICh0aGlzLndhdGNoUGF0aCA9PT0gY2hhbmdlZFBhdGgpIHtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHModGhpcy5jdXJyZW50VmFsdWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXRjaCA9IHtcbiAgICAgIHBhdGg6IHRoaXMud2F0Y2hQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgodGhpcy53YXRjaFBhdGgpLFxuICAgICAgdmFsdWU6IHRoaXMuY3VycmVudFZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IGNoYW5nZSA9IHtcbiAgICAgIHBhdGg6IGNoYW5nZWRQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgoY2hhbmdlZFBhdGgpLFxuICAgICAgdmFsdWU6IG5ld1ZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IG1pbmltdW1MZW50aCA9IE1hdGgubWluKGNoYW5nZS50b2tlbnMubGVuZ3RoLCB3YXRjaC50b2tlbnMubGVuZ3RoKTtcbiAgICBmb3IgKGxldCB0b2tlbkluZGV4ID0gMDsgdG9rZW5JbmRleCA8IG1pbmltdW1MZW50aDsgdG9rZW5JbmRleCsrKSB7XG4gICAgICBpZiAod2F0Y2gudG9rZW5zW3Rva2VuSW5kZXhdICE9PSBjaGFuZ2UudG9rZW5zW3Rva2VuSW5kZXhdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOQiBpZiB3ZSBnZXQgaGVyZSB0aGVuIGFsbCBjb21tb24gdG9rZW5zIG1hdGNoXG5cbiAgICBjb25zdCBjaGFuZ2VQYXRoSXNEZXNjZW5kYW50ID0gY2hhbmdlLnRva2Vucy5sZW5ndGggPiB3YXRjaC50b2tlbnMubGVuZ3RoO1xuXG4gICAgaWYgKGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQpIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGNoYW5nZS50b2tlbnMuc2xpY2Uod2F0Y2gudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCA9IF8uZ2V0KHdhdGNoLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyhjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoLCBjaGFuZ2UudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSB3YXRjaC50b2tlbnMuc2xpY2UoY2hhbmdlLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaFBhdGggPSBfLmdldChjaGFuZ2UudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHdhdGNoLnZhbHVlLCBuZXdWYWx1ZUF0V2F0Y2hQYXRoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5oYW5kbGVyKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgdGhpcy5jdXJyZW50VmFsdWUpO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAobmV3VmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoZXJGYWN0b3J5IHtcbiAgY3JlYXRlKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGVyKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoZXJGYWN0b3J5JywgKCkgPT4ge1xuICByZXR1cm4gbmV3IFdhdGNoZXJGYWN0b3J5KCk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignUm91dGUnLCBmdW5jdGlvbihPYmplY3RIZWxwZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuICBjb25zdCB0b2tlbnMgPSB7fTtcbiAgY29uc3QgdXJsV3JpdGVycyA9IFtdO1xuICBjb25zdCB1cmxzID0gW107XG4gIGNvbnN0IHBlcnNpc3RlbnRTdGF0ZXMgPSBbXTtcbiAgY29uc3QgcmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgdHlwZXMgPSB7fTtcbiAgbGV0IGh0bWw1TW9kZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3ZpZGVyID0ge1xuXG4gICAgcmVnaXN0ZXJUeXBlKG5hbWUsIGNvbmZpZykge1xuICAgICAgdHlwZXNbbmFtZV0gPSBjb25maWc7XG4gICAgICB0eXBlc1tuYW1lXS5yZWdleCA9IG5ldyBSZWdFeHAodHlwZXNbbmFtZV0ucmVnZXguc291cmNlLCAnaScpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVHlwZSB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxUb2tlbihuYW1lLCBjb25maWcpIHtcbiAgICAgIHRva2Vuc1tuYW1lXSA9IF8uZXh0ZW5kKHtuYW1lfSwgY29uZmlnKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFRva2VuIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFdyaXRlcihuYW1lLCBmbikge1xuICAgICAgdXJsV3JpdGVyc1tuYW1lXSA9IGZuO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsV3JpdGVyIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybChwYXR0ZXJuLCBjb25maWcgPSB7fSkge1xuICAgICAgY29uc3QgdXJsRGF0YSA9IHtcbiAgICAgICAgY29tcGlsZWRVcmw6IHRoaXMuX2NvbXBpbGVVcmxQYXR0ZXJuKHBhdHRlcm4sIGNvbmZpZyksXG4gICAgICAgIHBhdHRlcm5cbiAgICAgIH07XG5cbiAgICAgIHVybHMucHVzaChfLmV4dGVuZCh1cmxEYXRhLCBjb25maWcpKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybCB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGVyc2lzdGVudFN0YXRlcyguLi5zdGF0ZUxpc3QpIHtcbiAgICAgIF8uZm9yRWFjaChzdGF0ZUxpc3QsIChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIXBlcnNpc3RlbnRTdGF0ZXMuaW5jbHVkZXMoc3RhdGUpKSB7XG4gICAgICAgICAgcGVyc2lzdGVudFN0YXRlcy5wdXNoKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldEh0bWw1TW9kZShtb2RlKSB7XG4gICAgICBodG1sNU1vZGUgPSBtb2RlO1xuICAgIH0sXG5cbiAgICBfY29tcGlsZVVybFBhdHRlcm4odXJsUGF0dGVybiwgY29uZmlnKSB7XG4gICAgICBsZXQgbWF0Y2g7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyh1cmxQYXR0ZXJuKTtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2godXJsUGF0dGVybik7XG5cbiAgICAgIGNvbnN0IHRva2VuUmVnZXggPSAvXFx7KFtBLVphLXpcXC5fMC05XSspXFx9L2c7XG4gICAgICBsZXQgdXJsUmVnZXggPSB1cmxQYXR0ZXJuO1xuXG4gICAgICBpZiAoIWNvbmZpZy5wYXJ0aWFsTWF0Y2gpIHtcbiAgICAgICAgdXJsUmVnZXggPSBgXiR7dXJsUmVnZXh9JGA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRva2VuTGlzdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKG1hdGNoID0gdG9rZW5SZWdleC5leGVjKHVybFBhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1ttYXRjaFsxXV07XG4gICAgICAgIHRva2VuTGlzdC5wdXNoKHRva2VuKTtcbiAgICAgICAgdXJsUmVnZXggPSB1cmxSZWdleC5yZXBsYWNlKG1hdGNoWzBdLCBgKCR7dHlwZXNbdG9rZW4udHlwZV0ucmVnZXguc291cmNlfSlgKTtcbiAgICAgIH1cblxuICAgICAgdXJsUmVnZXgucmVwbGFjZSgnLicsICdcXFxcLicpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCh1cmxSZWdleCwgJ2knKSxcbiAgICAgICAgdG9rZW5zOiB0b2tlbkxpc3RcbiAgICAgIH07XG4gICAgfSxcblxuICAgIF9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2goc3RyKSB7XG4gICAgICBpZiAoc3RyLm1hdGNoKC9cXC8kLykpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXC8kLywgJy8/Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCR7c3RyfS8/YDtcbiAgICB9LFxuXG4gICAgX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXChcXClcXCpcXCtcXD9cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICB9LFxuXG4gICAgJGdldCgkbG9jYXRpb24sICRpbmplY3RvciwgJHEpIHtcbiAgICAgICduZ0luamVjdCc7XG5cbiAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc2VydmljZSAob25seSBkb25lIG9uY2UpLCB3ZSBuZWVkIHRvIGl0ZXJhdGUgb3ZlciB0aGUgdXJsV3JpdGVycyBhbmQgdHVyblxuICAgICAgLy8gdGhlbSBpbnRvIG1ldGhvZHMgdGhhdCBpbnZva2UgdGhlIFJFQUwgdXJsV3JpdGVyLCBidXQgcHJvdmlkaW5nIGRlcGVuZGVuY3kgaW5qZWN0aW9uIHRvIGl0LCB3aGlsZSBhbHNvXG4gICAgICAvLyBnaXZpbmcgaXQgdGhlIGRhdGEgdGhhdCB0aGUgY2FsbGVlIHBhc3NlcyBpbi5cblxuICAgICAgLy8gVGhlIHJlYXNvbiB3ZSBoYXZlIHRvIGRvIHRoaXMgaGVyZSBpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoZSAkaW5qZWN0b3IgYmFjayBpbiB0aGUgcm91dGVQcm92aWRlci5cblxuICAgICAgXy5mb3JJbih1cmxXcml0ZXJzLCAod3JpdGVyLCB3cml0ZXJOYW1lKSA9PlxuICAgICAgICB1cmxXcml0ZXJzW3dyaXRlck5hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmICghZGF0YSkgeyBkYXRhID0ge307IH1cbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSB7VXJsRGF0YTogZGF0YX07XG4gICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5pbnZva2Uod3JpdGVyLCB7fSwgbG9jYWxzKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgbGV0IGZsYXNoU3RhdGVzID0gW107XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgIGN1cnJlbnRCaW5kaW5nczoge30sXG4gICAgICAgIHJlYWR5RGVmZXJyZWQ6ICRxLmRlZmVyKCksXG5cbiAgICAgICAgbWF0Y2godXJsVG9NYXRjaCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdXJsIG9mIEFycmF5LmZyb20odXJscykpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSB1cmwuY29tcGlsZWRVcmwucmVnZXguZXhlYyh1cmxUb01hdGNoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHt1cmwsIHJlZ2V4TWF0Y2g6IG1hdGNofTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERhdGEobWF0Y2gsIHNlYXJjaERhdGEgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMuZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKTtcbiAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5leHRyYWN0UGF0aERhdGEobWF0Y2gpO1xuICAgICAgICAgIHNlYXJjaERhdGEgPSB0aGlzLmV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpO1xuICAgICAgICAgIHJldHVybiBPYmplY3RIZWxwZXIuZGVmYXVsdChzZWFyY2hEYXRhLCBwYXRoLCBkZWZhdWx0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSkge1xuICAgICAgICAgIGlmICghc2VhcmNoRGF0YSkgeyBzZWFyY2hEYXRhID0gJGxvY2F0aW9uLnNlYXJjaCgpOyB9XG4gICAgICAgICAgY29uc3QgZGF0YSA9IF8uY2xvbmUoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKGRhdGEsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0S2V5ID0gXy5maW5kS2V5KHRva2VucywgeyBzZWFyY2hBbGlhczoga2V5IH0pO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRLZXkpIHsgdGFyZ2V0S2V5ID0ga2V5OyB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZU5hbWUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IF8uZ2V0KHRva2Vuc1t0YXJnZXRLZXldLCAndHlwZScpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCF0b2tlbnNbdGFyZ2V0S2V5XSB8fCAodHlwZXNbdG9rZW5UeXBlTmFtZV0ucmVnZXgudGVzdCh2YWx1ZSkpKSB7XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS50eXBlIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0eXBlVG9rZW5UeXBlID0gdG9rZW5UeXBlID8gdHlwZXNbdG9rZW5UeXBlXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlUGFyc2VkID0gdHlwZVRva2VuVHlwZSA/IHR5cGVUb2tlblR5cGUucGFyc2VyIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgIGlmICh0b2tlblR5cGVQYXJzZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodG9rZW5UeXBlUGFyc2VkLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblRhcmdldEtleVN0YXRlUGF0aCA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0uc3RhdGVQYXRoIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCBkYXRhS2V5ID0gdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggfHwgdGFyZ2V0S2V5O1xuXG4gICAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQobmV3RGF0YSwgZGF0YUtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKG1hdGNoLnVybC5zdGF0ZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwga2V5LCAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IF8uY2xvbmVEZWVwKHZhbHVlKSA6IHZhbHVlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0UGF0aERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICAgY29uc3QgcGF0aFRva2VucyA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnM7XG5cbiAgICAgICAgICBpZiAocGF0aFRva2Vucy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHt9OyB9XG5cbiAgICAgICAgICBmb3IgKGxldCBuID0gMCwgZW5kID0gcGF0aFRva2Vucy5sZW5ndGgtMSwgYXNjID0gMCA8PSBlbmQ7IGFzYyA/IG4gPD0gZW5kIDogbiA+PSBlbmQ7IGFzYyA/IG4rKyA6IG4tLSkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zW25dO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbWF0Y2gucmVnZXhNYXRjaFtuKzFdO1xuXG4gICAgICAgICAgICBpZiAodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyKSB7IHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIsIG51bGwsIHt0b2tlbjogdmFsdWV9KTsgfVxuXG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsICh0b2tlbi5zdGF0ZVBhdGggfHwgdG9rZW4ubmFtZSksIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXJzKCkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcihuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdvKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiAkbG9jYXRpb24udXJsKHRoaXMuaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRQZXJzaXN0ZW50U3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBwZXJzaXN0ZW50U3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBbXTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRGbGFzaFN0YXRlcyguLi5uZXdTdGF0ZXMpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IGZsYXNoU3RhdGVzLmNvbmNhdChuZXdTdGF0ZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBmbGFzaFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSwgYmluZGluZykge1xuICAgICAgICAgIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXSA9IGJpbmRpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Q3VycmVudFZpZXdOYW1lKCkge1xuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRCaW5kaW5nc1snbWFpbi5jb250ZW50J10pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCaW5kaW5nc1snbWFpbi5jb250ZW50J10ubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlbGV0ZUN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBtYXRjaGVzQ3VycmVudEJpbmRpbmdOYW1lKHZpZXdOYW1lLCBiaW5kaW5nTmFtZUV4cHJlc3Npb24pIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50QmluZGluZyA9IHRoaXMuZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpXG5cbiAgICAgICAgICBpZiAoIWN1cnJlbnRCaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gYmluZGluZ05hbWVFeHByZXNzaW9uIGluc3RhbmNlb2YgUmVnRXhwID9cbiAgICAgICAgICAgIGJpbmRpbmdOYW1lRXhwcmVzc2lvbi50ZXN0KGN1cnJlbnRCaW5kaW5nLm5hbWUpIDpcbiAgICAgICAgICAgIGN1cnJlbnRCaW5kaW5nLm5hbWUgPT09IGJpbmRpbmdOYW1lRXhwcmVzc2lvbjtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZWFkeShyZWFkeSkge1xuICAgICAgICAgIGlmICghcmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1JlYWR5KCkge1xuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0h0bWw1TW9kZUVuYWJsZWQoKSB7XG4gICAgICAgICAgcmV0dXJuIGh0bWw1TW9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICB3aGVuUmVhZHkoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHlEZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdudW1lcmljJywge3JlZ2V4OiAvXFxkKy8sIHBhcnNlcjogWyd0b2tlbicsIHRva2VuID0+IHBhcnNlSW50KHRva2VuKV19KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbHBoYScsIHtyZWdleDogL1thLXpBLVpdKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbnknLCB7cmVnZXg6IC8uKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdsaXN0Jywge3JlZ2V4OiAvLisvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiB0b2tlbi5zcGxpdCgnLCcpXX0pO1xuXG4gIHJldHVybiBwcm92aWRlcjtcbn0pO1xuXG5jbGFzcyBTdGF0ZVByb3ZpZGVyIHtcbiAgJGdldChXYXRjaGFibGVMaXN0RmFjdG9yeSkge1xuICAgICduZ0luamVjdCc7XG4gICAgcmV0dXJuIFdhdGNoYWJsZUxpc3RGYWN0b3J5LmNyZWF0ZSgpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1N0YXRlJywgbmV3IFN0YXRlUHJvdmlkZXIpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdWaWV3QmluZGluZ3MnLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHZpZXdzID0gW107XG5cbiAgY2xhc3MgVmlldyB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgYmluZGluZ3MpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XG4gICAgICBpZiAoISh0aGlzLmJpbmRpbmdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBbdGhpcy5iaW5kaW5nc107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QmluZGluZ3MoKSB7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuXG4gICAgYmluZChuYW1lLCBjb25maWcpIHtcblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKGJpbmRpbmdzLCBjb21tb25SZXF1aXJlZFN0YXRlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoIShiaW5kaW5nLnJlcXVpcmVkU3RhdGUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IFtiaW5kaW5nLnJlcXVpcmVkU3RhdGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUuY29uY2F0KGNvbW1vblJlcXVpcmVkU3RhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vblJlc29sdmUoYmluZGluZ3MsIGNvbW1vblJlc29sdmUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGlmICghKCdyZXNvbHZlJyBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgYmluZGluZy5yZXNvbHZlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKF8uZGVmYXVsdHMoYmluZGluZy5yZXNvbHZlLCBjb21tb25SZXNvbHZlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgYmFzaWNDb21tb25GaWVsZHMgPSBbXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ0Vycm9yQ29tcG9uZW50Jywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25FcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvclRlbXBsYXRlVXJsJ31cbiAgICAgICAgXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNvbW1vbkZpZWxkIG9mIEFycmF5LmZyb20oYmFzaWNDb21tb25GaWVsZHMpKSB7XG4gICAgICAgICAgaWYgKGNvbW1vbkZpZWxkLm5hbWUgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBkZWZhdWx0QmluZGluZ0ZpZWxkKG5ld0JpbmRpbmdzLCBjb21tb25GaWVsZC5vdmVycmlkZUZpZWxkLCBjb25maWdbY29tbW9uRmllbGQubmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29tbW9uUmVxdWlyZWRTdGF0ZScgaW4gY29uZmlnKSB7XG4gICAgICAgICAgYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlcXVpcmVkU3RhdGUnXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlc29sdmUnIGluIGNvbmZpZykge1xuICAgICAgICAgIHJldHVybiBhcHBseUNvbW1vblJlc29sdmUobmV3QmluZGluZ3MsIGNvbmZpZ1snY29tbW9uUmVzb2x2ZSddKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZWZhdWx0QmluZGluZ0ZpZWxkKGJpbmRpbmdzLCBmaWVsZE5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgICAgaWYgKCEoZmllbGROYW1lIGluIGJpbmRpbmcpKSB7XG4gICAgICAgICAgICBpdGVtID0gYmluZGluZ1tmaWVsZE5hbWVdID0gZGVmYXVsdFZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3QmluZGluZ3MgPSBbXTtcbiAgICAgIGlmICgnYmluZGluZ3MnIGluIGNvbmZpZykge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IGNvbmZpZ1snYmluZGluZ3MnXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0JpbmRpbmdzID0gKGNvbmZpZyBpbnN0YW5jZW9mIEFycmF5KSA/IGNvbmZpZyA6IFtjb25maWddO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShuZXdCaW5kaW5ncy5sZW5ndGggPiAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY2FsbCB0byBWaWV3QmluZGluZ3NQcm92aWRlci5iaW5kIGZvciBuYW1lICcke25hbWV9J2ApO1xuICAgICAgfVxuXG4gICAgICBhcHBseUNvbW1vbkZpZWxkcyhuZXdCaW5kaW5ncyk7XG4gICAgICByZXR1cm4gdmlld3NbbmFtZV0gPSBuZXcgVmlldyhuYW1lLCBuZXdCaW5kaW5ncyk7XG4gICAgfSxcblxuICAgICRnZXQoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXRWaWV3KHZpZXcpIHtcbiAgICAgICAgICByZXR1cm4gdmlld3Nbdmlld107XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
