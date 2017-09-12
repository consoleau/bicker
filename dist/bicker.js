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
    scope: true,

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
          console.log('oh hai thar');
          return scope.$eval(attrs.routeOnClick);
        }, function (newUrl) {
          var url = void 0;
          if (newUrl) {
            url = html5TheUrl(newUrl);
          } else {
            url = getUrl();
          }
          element.attr('href', url);
        });

        // return scope.$watch(attrs.routeOnClick, (newUrl) => {
        //   let url;
        //   if (newUrl) {
        //     url = html5TheUrl(newUrl);
        //   } else {
        //     url = getUrl();
        //   }
        //   return element.attr('href', url);
        // });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2JpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSxRQUFBLEFBQVEsT0FBUixBQUFlLGlCQUFpQixDQUFoQyxBQUFnQyxBQUFDLGNBQWpDLEFBQStDLHdGQUFJLFVBQUEsQUFBVSxPQUFWLEFBQWlCLE9BQWpCLEFBQXdCLFdBQXhCLEFBQW1DLFlBQW5DLEFBQStDLGNBQS9DLEFBQTZELG9CQUFvQixBQUNsSTtBQUVBOztNQUFJLFNBQUosQUFBYSxBQUNiO2FBQUEsQUFBVyxJQUFYLEFBQWUsd0JBQXdCLFlBQVksQUFDakQ7UUFBSSxNQUFKLEFBQUksQUFBTSxXQUFXLEFBQ25CO1lBQUEsQUFBTSxTQUFOLEFBQWUsQUFDaEI7QUFDRjtBQUpELEFBTUE7O2FBQUEsQUFBVyxJQUFYLEFBQWUsMEJBQTBCLFVBQUEsQUFBVSxHQUFWLEFBQWEsUUFBUSxBQUM1RDtBQUNBO1FBQUksWUFBSixBQUNBO1FBQUksV0FBSixBQUFlLFFBQVEsQUFDckI7QUFDRDtBQUVEOzthQUFBLEFBQVMsQUFFVDs7dUJBQUEsQUFBbUIsQUFDbkI7UUFBTSxRQUFRLE1BQUEsQUFBTSxNQUFNLFVBQTFCLEFBQWMsQUFBWSxBQUFVLEFBRXBDOztRQUFJLENBQUosQUFBSyxPQUFPLEFBQ1Y7YUFBQSxBQUFPLEFBQ1I7QUFGRCxXQUVPLEFBQ0w7YUFBTyxNQUFBLEFBQU0sWUFBYixBQUFPLEFBQWtCLEFBQzFCO0FBRUQ7O1FBQUksZ0JBQWdCLGFBQUEsQUFBYSxNQUFNLE1BQW5CLEFBQXlCLE1BQTdDLEFBQW9CLEFBQStCLEFBQ25EO29CQUFnQixFQUFBLEFBQUUsV0FBRixBQUFhLGVBQWUsTUFBQSxBQUFNLHNCQUFOLEFBQTRCLE9BQU8sTUFBL0UsQUFBZ0IsQUFBNEIsQUFBbUMsQUFBTSxBQUVyRjs7UUFBTSxZ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ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJywgWyduZ0FuaW1hdGUnXSkucnVuKGZ1bmN0aW9uIChTdGF0ZSwgUm91dGUsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgT2JqZWN0SGVscGVyLCBQZW5kaW5nVmlld0NvdW50ZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuXG4gIGxldCBvbGRVcmwgPSB1bmRlZmluZWQ7XG4gICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoUm91dGUuaXNSZWFkeSgpKSB7XG4gICAgICBSb3V0ZS5zZXRSZWFkeShmYWxzZSk7XG4gICAgfVxuICB9KTtcblxuICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uIChlLCBuZXdVcmwpIHtcbiAgICAvLyBXb3JrLWFyb3VuZCBmb3IgQW5ndWxhckpTIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvaXNzdWVzLzgzNjhcbiAgICBsZXQgZGF0YTtcbiAgICBpZiAobmV3VXJsID09PSBvbGRVcmwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvbGRVcmwgPSBuZXdVcmw7XG5cbiAgICBQZW5kaW5nVmlld0NvdW50ZXIucmVzZXQoKTtcbiAgICBjb25zdCBtYXRjaCA9IFJvdXRlLm1hdGNoKCRsb2NhdGlvbi5wYXRoKCkpO1xuXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gUm91dGUuZXh0cmFjdERhdGEobWF0Y2gpO1xuICAgIH1cblxuICAgIGxldCBmaWVsZHNUb1Vuc2V0ID0gT2JqZWN0SGVscGVyLm5vdEluKFN0YXRlLmxpc3QsIGRhdGEpO1xuICAgIGZpZWxkc1RvVW5zZXQgPSBfLmRpZmZlcmVuY2UoZmllbGRzVG9VbnNldCwgUm91dGUuZ2V0UGVyc2lzdGVudFN0YXRlcygpLmNvbmNhdChSb3V0ZS5nZXRGbGFzaFN0YXRlcygpKSk7XG5cbiAgICBjb25zdCBldmVudERhdGEgPSB7dW5zZXR0aW5nOiBmaWVsZHNUb1Vuc2V0LCBzZXR0aW5nOiBkYXRhfTtcblxuICAgICRyb290U2NvcGUuJGVtaXQoJ2JpY2tlcl9yb3V0ZXIuYmVmb3JlU3RhdGVDaGFuZ2UnLCBldmVudERhdGEpO1xuXG4gICAgaWYgKChldmVudERhdGEudW5zZXR0aW5nKS5sZW5ndGggIT09IDApIHtcbiAgICAgIFN0YXRlLnVuc2V0KGV2ZW50RGF0YS51bnNldHRpbmcpO1xuICAgIH1cblxuICAgIF8uZm9yRWFjaChldmVudERhdGEuc2V0dGluZywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIFN0YXRlLnNldChrZXksIHZhbHVlKTtcbiAgICB9KTtcblxuICAgIFJvdXRlLnJlc2V0Rmxhc2hTdGF0ZXMoKTtcbiAgICBSb3V0ZS5zZXRSZWFkeSh0cnVlKTtcbiAgfSk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5jb25zdGFudCgnT2JqZWN0SGVscGVyJywge1xuICBnZXQob2JqZWN0LCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcnKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgICBjb25zdCBwaWVjZXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgY29uc3Qga2V5ID0gcGllY2VzLnBvcCgpO1xuICAgIGxldCBwYXJlbnQgPSBvYmplY3Q7XG5cbiAgICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGllY2VzKSB7XG4gICAgICBwYXJlbnQgPSBwYXJlbnRbc2VnbWVudF07XG4gICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XTtcbiAgfSxcblxuICBzZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBjb25zdCBrZXkgPSBwaWVjZXMucG9wKCk7XG4gICAgbGV0IHBhcmVudCA9IG9iamVjdDtcblxuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBwaWVjZXMpIHtcbiAgICAgIGlmIChwYXJlbnRbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJlbnRbc2VnbWVudF0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnRba2V5XSA9IHZhbHVlO1xuICB9LFxuXG4gIHVuc2V0KG9iamVjdCwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnJykgeyByZXR1cm4gb2JqZWN0OyB9XG4gICAgY29uc3QgcGllY2VzID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGtleSA9IHBpZWNlcy5wb3AoKTtcbiAgICBsZXQgcGFyZW50ID0gb2JqZWN0O1xuXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBpZWNlcykge1xuICAgICAgcGFyZW50ID0gcGFyZW50W3NlZ21lbnRdO1xuICAgICAgaWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cblxuICAgIGlmIChwYXJlbnRba2V5XSA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGRlbGV0ZSBwYXJlbnRba2V5XTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICAvLyBSZWN1cnNpdmVseSByZXR1cm4gdGhlIHByb3BlcnRpZXMgaW4gYSB0aGF0IGFyZW4ndCBpbiBiXG4gIG5vdEluKGEsIGIsIHByZWZpeCA9ICcnKSB7XG4gICAgbGV0IG5vdEluID0gW107XG4gICAgcHJlZml4ID0gcHJlZml4Lmxlbmd0aCA+IDAgPyBgJHtwcmVmaXh9LmAgOiAnJztcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIEFycmF5LmZyb20oT2JqZWN0LmtleXMoYSkpKSB7XG4gICAgICBjb25zdCB0aGlzUGF0aCA9IGAke3ByZWZpeH0ke2tleX1gO1xuXG4gICAgICBpZiAoYltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm90SW4ucHVzaCh0aGlzUGF0aCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBhW2tleV0gPT09ICdvYmplY3QnKSAmJiAoIShhW2tleV0gaW5zdGFuY2VvZiBBcnJheSkpKSB7XG4gICAgICAgIG5vdEluID0gbm90SW4uY29uY2F0KHRoaXMubm90SW4oYVtrZXldLCBiW2tleV0sIHRoaXNQYXRoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdEluO1xuICB9LFxuXG4gIGRlZmF1bHQob3ZlcnJpZGVzLCAuLi5kZWZhdWx0U2V0cykge1xuICAgIGxldCBkZWZhdWx0U2V0LCB2YWx1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgIGlmIChkZWZhdWx0U2V0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGRlZmF1bHRTZXQgPSBkZWZhdWx0U2V0c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVmYXVsdFNldCA9IHRoaXMuZGVmYXVsdCguLi5BcnJheS5mcm9tKGRlZmF1bHRTZXRzIHx8IFtdKSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGVmYXVsdFNldCkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0U2V0W2tleV07XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldIHx8IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmICgodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIG92ZXJyaWRlc1trZXldID09PSBcIm9iamVjdFwiKSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMuZGVmYXVsdChvdmVycmlkZXNba2V5XSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvdmVycmlkZXNba2V5XSB8fCB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvdmVycmlkZXMpIHtcbiAgICAgIHZhbHVlID0gb3ZlcnJpZGVzW2tleV07XG4gICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldIHx8IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuXG5cbi8vIFVzYWdlOlxuLy9cbi8vIElmIHlvdSB3YW50IHRvIGFkZCB0aGUgY2xhc3MgXCJhY3RpdmVcIiB0byBhbiBhbmNob3IgZWxlbWVudCB3aGVuIHRoZSBcIm1haW5cIiB2aWV3IGhhcyBhIGJpbmRpbmdcbi8vIHdpdGggdGhlIG5hbWUgXCJteUJpbmRpbmdcIiByZW5kZXJlZCB3aXRoaW4gaXRcbi8vXG4vLyA8YSByb3V0ZS1jbGFzcz1cInsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6ICdteUJpbmRpbmcnIH1cIj5BbmNob3IgdGV4dDwvYT5cbi8vXG4vLyBZb3UgY2FuIGFsc28gdXNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgZm9yIHRoZSBiaW5kaW5nIG5hbWUsIGJ1dCB0byBkbyBzbyB5b3UgaGF2ZSB0byBwcm92aWRlIGEgbWV0aG9kXG4vLyBvbiB5b3VyIGNvbnRyb2xsZXIgd2hpY2ggcmV0dXJucyB0aGUgcm91dGUgY2xhc3MgZGVmaW5pdGlvbiBvYmplY3QsIGJlY2F1c2UgQW5ndWxhckpTIGV4cHJlc3Npb25zXG4vLyBkb24ndCBzdXBwb3J0IGlubGluZSByZWd1bGFyIGV4cHJlc3Npb25zXG4vL1xuLy8gY2xhc3MgTXlDb250cm9sbGVyIHtcbi8vICBnZXRSb3V0ZUNsYXNzT2JqZWN0KCkge1xuLy8gICAgcmV0dXJuIHsgY2xhc3NOYW1lOiAnYWN0aXZlJywgdmlld05hbWU6ICdtYWluJywgYmluZGluZ05hbWU6IC9teUJpbmQvIH1cbi8vICB9XG4vLyB9XG4vL1xuLy8gPGEgcm91dGUtY2xhc3M9XCIkY3RybC5nZXRSb3V0ZUNsYXNzT2JqZWN0KClcIj5BbmNob3IgdGV4dDwvYT5cbi8vXG5cbmZ1bmN0aW9uIHJvdXRlQ2xhc3NGYWN0b3J5KFJvdXRlKSB7XG4gICduZ0luamVjdCdcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGxpbmsgKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG4gICAgICBzY29wZS4kd2F0Y2goKCkgPT4ge1xuICAgICAgICBjb25zdCByb3V0ZUNsYXNzRGVmaW5pdGlvbiA9IHNjb3BlLiRldmFsKGlBdHRyc1sncm91dGVDbGFzcyddKVxuXG4gICAgICAgIGlmICghUm91dGUubWF0Y2hlc0N1cnJlbnRCaW5kaW5nTmFtZShyb3V0ZUNsYXNzRGVmaW5pdGlvbi52aWV3TmFtZSwgcm91dGVDbGFzc0RlZmluaXRpb24uYmluZGluZ05hbWUpKSB7XG4gICAgICAgICAgaWYgKGlFbGVtZW50Lmhhc0NsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgIGlFbGVtZW50LnJlbW92ZUNsYXNzKHJvdXRlQ2xhc3NEZWZpbml0aW9uLmNsYXNzTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFpRWxlbWVudC5oYXNDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICBpRWxlbWVudC5hZGRDbGFzcyhyb3V0ZUNsYXNzRGVmaW5pdGlvbi5jbGFzc05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVDbGFzcycsIHJvdXRlQ2xhc3NGYWN0b3J5KTtcblxuZnVuY3Rpb24gcm91dGVIcmVmRmFjdG9yeSAoUm91dGUsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcbiAgJ25nSW5qZWN0J1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBzY29wZTogdHJ1ZSxcbiAgICBsaW5rIChzY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgaWYgKGlBdHRycy5pZ25vcmVIcmVmID09PSB1bmRlZmluZWQgJiYgUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgaUVsZW1lbnQuY2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgdXJsUGF0aCA9IGlFbGVtZW50LmF0dHIoJ2hyZWYnKS5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiAkbG9jYXRpb24udXJsKHVybFBhdGgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IFJvdXRlLmdldFVybFdyaXRlcnMoKTtcbiAgICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgY29uc3Qgd3JpdGVyID0gb2JqZWN0W3dyaXRlck5hbWVdO1xuICAgICAgICBzY29wZVtgJHt3cml0ZXJOYW1lfVVybFdyaXRlcmBdID0gd3JpdGVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2NvcGUuJHdhdGNoKGlBdHRycy5yb3V0ZUhyZWYsIChuZXdVcmwpID0+IHtcbiAgICAgICAgbGV0IHVybDtcbiAgICAgICAgaWYgKFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpKSB7XG4gICAgICAgICAgdXJsID0gbmV3VXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVybCA9IGAjJHtuZXdVcmx9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaUVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3JvdXRlSHJlZicsIHJvdXRlSHJlZkZhY3RvcnkpO1xuXG5mdW5jdGlvbiByb3V0ZU9uQ2xpY2tGYWN0b3J5IChSb3V0ZSwgJGxvY2F0aW9uLCAkd2luZG93LCAkdGltZW91dCkge1xuICAnbmdJbmplY3QnXG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHNjb3BlOiB0cnVlLFxuXG4gICAgbGluayAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBjb25zdCBMRUZUX0JVVFRPTiA9IDA7XG4gICAgICBjb25zdCBNSURETEVfQlVUVE9OID0gMTtcblxuICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ0EnIHx8IGVsZW1lbnRbMF0udGFnTmFtZSA9PT0gJ0EnKSB7XG4gICAgICAgIGFkZFdhdGNoVGhhdFVwZGF0ZXNIcmVmQXR0cmlidXRlKCk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuY2xpY2soKGV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gTEVGVF9CVVRUT04pIHtcbiAgICAgICAgICAgIG5hdmlnYXRlVG9VcmwoZ2V0VXJsKCksIHNob3VsZE9wZW5OZXdXaW5kb3coZXZlbnQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQubW91c2V1cCgoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09PSBNSURETEVfQlVUVE9OKSB7XG4gICAgICAgICAgICBuYXZpZ2F0ZVRvVXJsKGdldFVybCgpLCBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbmF2aWdhdGVUb1VybChfdXJsLCBuZXdXaW5kb3cgPSBmYWxzZSkge1xuICAgICAgICBsZXQgdXJsID0gX3VybDtcblxuICAgICAgICBpZiAobmV3V2luZG93KSB7XG4gICAgICAgICAgdXJsID0gYCR7JHdpbmRvdy5sb2NhdGlvbi5vcmlnaW59LyR7dXJsfWA7XG4gICAgICAgICAgJHdpbmRvdy5vcGVuKHVybCwgJ19ibGFuaycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghUm91dGUuaXNIdG1sNU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eIy8sICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHRpbWVvdXQoKCkgPT4gJGxvY2F0aW9uLnVybCh1cmwpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG91bGRPcGVuTmV3V2luZG93KGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBldmVudC5idXR0b24gPT09IE1JRERMRV9CVVRUT04gfHwgKGV2ZW50LmJ1dHRvbiA9PT0gTEVGVF9CVVRUT04gJiYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRVcmwoKSB7XG4gICAgICAgIGNvbnN0IHVybFdyaXRlcnMgPSBSb3V0ZS5nZXRVcmxXcml0ZXJzKCk7XG4gICAgICAgIGNvbnN0IGxvY2FscyA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3Qgd3JpdGVyTmFtZSBpbiB1cmxXcml0ZXJzKSB7XG4gICAgICAgICAgbG9jYWxzW2Ake3dyaXRlck5hbWV9VXJsV3JpdGVyYF0gPSB1cmxXcml0ZXJzW3dyaXRlck5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHVybCA9IHNjb3BlLiRldmFsKGF0dHJzLnJvdXRlT25DbGljaywgXy5hc3NpZ24obG9jYWxzLCBzY29wZSkpO1xuXG4gICAgICAgIHJldHVybiBodG1sNVRoZVVybCh1cmwpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBodG1sNVRoZVVybCh1cmwpIHtcbiAgICAgICAgcmV0dXJuIFJvdXRlLmlzSHRtbDVNb2RlRW5hYmxlZCgpID8gdXJsIDogYCMke3VybH1gO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRXYXRjaFRoYXRVcGRhdGVzSHJlZkF0dHJpYnV0ZSgpIHtcblxuICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdvaCBoYWkgdGhhcicpXG4gICAgICAgICAgcmV0dXJuIHNjb3BlLiRldmFsKGF0dHJzLnJvdXRlT25DbGljaylcbiAgICAgICAgfSwgKG5ld1VybCkgPT4ge1xuICAgICAgICAgIGxldCB1cmw7XG4gICAgICAgICAgaWYgKG5ld1VybCkge1xuICAgICAgICAgICAgdXJsID0gaHRtbDVUaGVVcmwobmV3VXJsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXJsID0gZ2V0VXJsKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJldHVybiBzY29wZS4kd2F0Y2goYXR0cnMucm91dGVPbkNsaWNrLCAobmV3VXJsKSA9PiB7XG4gICAgICAgIC8vICAgbGV0IHVybDtcbiAgICAgICAgLy8gICBpZiAobmV3VXJsKSB7XG4gICAgICAgIC8vICAgICB1cmwgPSBodG1sNVRoZVVybChuZXdVcmwpO1xuICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICB1cmwgPSBnZXRVcmwoKTtcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vICAgcmV0dXJuIGVsZW1lbnQuYXR0cignaHJlZicsIHVybCk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmRpcmVjdGl2ZSgncm91dGVPbkNsaWNrJywgcm91dGVPbkNsaWNrRmFjdG9yeSk7XG5cbi8vIEBUT0RPIG5vbmUgb2YgdGhlIGFuaW1hdGlvbiBjb2RlIGluIHRoaXMgZGlyZWN0aXZlIGhhcyBiZWVuIHRlc3RlZC4gTm90IHN1cmUgaWYgaXQgY2FuIGJlIGF0IHRoaXMgc3RhZ2UgVGhpcyBuZWVkcyBmdXJ0aGVyIGludmVzdGlnYXRpb24uXG4vLyBAVE9ETyB0aGlzIGNvZGUgZG9lcyB0b28gbXVjaCwgaXQgc2hvdWxkIGJlIHJlZmFjdG9yZWQuXG5cbmZ1bmN0aW9uIHJvdXRlVmlld0ZhY3RvcnkoJGxvZywgJGNvbXBpbGUsICRjb250cm9sbGVyLCBWaWV3QmluZGluZ3MsICRxLCBTdGF0ZSwgJHJvb3RTY29wZSwgJGFuaW1hdGUsICR0aW1lb3V0LCAkaW5qZWN0b3IsIFBlbmRpbmdWaWV3Q291bnRlciwgJHRlbXBsYXRlUmVxdWVzdCwgUm91dGUpIHtcbiAgJ25nSW5qZWN0JztcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiBmYWxzZSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlOiAnPGRpdj48L2Rpdj4nLFxuICAgIGxpbmsgKHZpZXdEaXJlY3RpdmVTY29wZSwgaUVsZW1lbnQsIGlBdHRycykge1xuICAgICAgbGV0IHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICBsZXQgdmlld1Njb3BlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgY29uc3QgdmlldyA9IFZpZXdCaW5kaW5ncy5nZXRWaWV3KGlBdHRycy5uYW1lKTtcbiAgICAgIGNvbnN0IGJpbmRpbmdzID0gdmlldy5nZXRCaW5kaW5ncygpO1xuXG4gICAgICBpRWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXG4gICAgICBsZXQgcHJldmlvdXNCb3VuZFN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IHByZXZpb3VzQmluZGluZyA9IHVuZGVmaW5lZDtcblxuICAgICAgY29uc3QgZ2V0U3RhdGVEYXRhRm9yQmluZGluZyA9IGJpbmRpbmcgPT4gXy5jbG9uZURlZXAoU3RhdGUuZ2V0U3Vic2V0KGdldFN0YXRlRmllbGRzRnJvbUJpbmRpbmcoYmluZGluZykpKTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgZmllbGQpIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgIGZpZWxkID0gJ2NvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc291cmNlID0gYmluZGluZ1tmaWVsZF0gPyAkaW5qZWN0b3IuZ2V0KGAke2JpbmRpbmdbZmllbGRdfURpcmVjdGl2ZWApWzBdIDogYmluZGluZztcbiAgICAgICAgcmV0dXJuIF8uZGVmYXVsdHMoXy5waWNrKHNvdXJjZSwgWydjb250cm9sbGVyJywgJ3RlbXBsYXRlVXJsJywgJ2NvbnRyb2xsZXJBcyddKSwge2NvbnRyb2xsZXJBczogJyRjdHJsJ30pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNSZXF1aXJlZERhdGEoYmluZGluZykge1xuICAgICAgICBjb25zdCByZXF1aXJlZFN0YXRlID0gYmluZGluZy5yZXF1aXJlZFN0YXRlIHx8IFtdO1xuXG4gICAgICAgIGZvciAobGV0IHJlcXVpcmVtZW50IG9mIEFycmF5LmZyb20ocmVxdWlyZWRTdGF0ZSkpIHtcbiAgICAgICAgICBsZXQgbmVnYXRlUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCchJyA9PT0gcmVxdWlyZW1lbnQuY2hhckF0KDApKSB7XG4gICAgICAgICAgICByZXF1aXJlbWVudCA9IHJlcXVpcmVtZW50LnNsaWNlKDEpO1xuICAgICAgICAgICAgbmVnYXRlUmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgZWxlbWVudCA9IFN0YXRlLmdldChyZXF1aXJlbWVudCk7XG5cbiAgICAgICAgICAvLyBSZXR1cm4gZmFsc2UgaWYgZWxlbWVudCBpcyB1bmRlZmluZWRcbiAgICAgICAgICBpZiAoKGVsZW1lbnQgPT09IG51bGwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT25seSBjaGVjayB2YWx1ZSBvZiBlbGVtZW50IGlmIGl0IGlzIGRlZmluZWRcbiAgICAgICAgICBpZiAobmVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gIWVsZW1lbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiaW5kaW5nLmNhbkFjdGl2YXRlKSB7XG4gICAgICAgICAgaWYgKCEkaW5qZWN0b3IuaW52b2tlKGJpbmRpbmcuY2FuQWN0aXZhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1hbmFnZVZpZXcoZWxlbWVudCwgYmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdCaW5kaW5nID0gZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKTtcblxuICAgICAgICBpZiAoIW1hdGNoaW5nQmluZGluZykge1xuICAgICAgICAgIGlmICh2aWV3Q3JlYXRlZCkge1xuICAgICAgICAgICAgJGFuaW1hdGUuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlc3Ryb3lWaWV3KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c0JvdW5kU3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBwcmV2aW91c0JpbmRpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBSb3V0ZS5kZWxldGVDdXJyZW50QmluZGluZyh2aWV3Lm5hbWUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1N0YXRlID0gZ2V0U3RhdGVEYXRhRm9yQmluZGluZyhtYXRjaGluZ0JpbmRpbmcpO1xuICAgICAgICBpZiAoKG1hdGNoaW5nQmluZGluZyA9PT0gcHJldmlvdXNCaW5kaW5nKSAmJiBhbmd1bGFyLmVxdWFscyhwcmV2aW91c0JvdW5kU3RhdGUsIG5ld1N0YXRlKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHByZXZpb3VzQmluZGluZyA9IG1hdGNoaW5nQmluZGluZztcbiAgICAgICAgcHJldmlvdXNCb3VuZFN0YXRlID0gbmV3U3RhdGU7XG5cbiAgICAgICAgUGVuZGluZ1ZpZXdDb3VudGVyLmluY3JlYXNlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNob3dSZXNvbHZpbmdUZW1wbGF0ZShlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKGhhc1Jlc29sdmluZ1RlbXBsYXRlKSB7XG4gICAgICAgICAgLy8gQFRPRE86IE1hZ2ljIG51bWJlclxuICAgICAgICAgIGNvbnN0IGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uID0gaGFzUmVzb2x2aW5nVGVtcGxhdGUgPyAzMDAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBpZiAoIXZpZXdDcmVhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGFuaW1hdGUucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLWhpZGUnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoZWxlbWVudCwgbWF0Y2hpbmdCaW5kaW5nLCBkZWxheUZvclJlYWxUZW1wbGF0ZUluc2VydGlvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlVmlldyhlbGVtZW50LCBtYXRjaGluZ0JpbmRpbmcsIGRlbGF5Rm9yUmVhbFRlbXBsYXRlSW5zZXJ0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRNYXRjaGluZ0JpbmRpbmcoYmluZGluZ3MpIHtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20oYmluZGluZ3MpKSB7XG4gICAgICAgICAgaWYgKGhhc1JlcXVpcmVkRGF0YShiaW5kaW5nKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVzdHJveVZpZXcoZWxlbWVudCkge1xuICAgICAgICBpZiAodmlld0NyZWF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZpZXdDcmVhdGVkID0gZmFsc2U7XG4gICAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5lcSgwKS5yZW1vdmUoKTtcbiAgICAgICAgdmlld1Njb3BlLiRkZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXcoZWxlbWVudCwgYmluZGluZywgbWluaW11bURlbGF5KSB7XG4gICAgICAgIGNvbnN0IHRpbWVTdGFydGVkTWFpblZpZXcgPSBEYXRlLm5vdygpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBnZXRDb21wb25lbnRGcm9tQmluZGluZyhiaW5kaW5nKTtcblxuICAgICAgICBjb25zdCBvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgICBpZiAoZ2V0TWF0Y2hpbmdCaW5kaW5nKGJpbmRpbmdzKSAhPT0gYmluZGluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZpZXdDcmVhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGNvbnN0IHJlc29sdmluZ1RlbXBsYXRlU2hvd25UaW1lID0gRGF0ZS5ub3coKSAtIHRpbWVTdGFydGVkTWFpblZpZXc7XG5cbiAgICAgICAgICBjb25zdCBpbmplY3RNYWluVGVtcGxhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzaG93RXJyb3IoZSwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAvLyBXcmFwcGVkIGluIGEgdGltZW91dCBzbyB0aGF0IHdlIGNhbiBnaXZlIHRoZSB2aWV3IHRpbWUgdG8gcHJvcGVybHkgaW5pdGlhbGlzZVxuICAgICAgICAgICAgICAvLyBiZWZvcmUgcG90ZW50aWFsbHkgdHJpZ2dlcmluZyB0aGUgaW50aWFsVmlld3NMb2FkZWQgZXZlbnRcbiAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghYmluZGluZy5tYW51YWxDb21wbGV0aW9uKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gUGVuZGluZ1ZpZXdDb3VudGVyLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgbWFpblRlbXBsYXRlSW5qZWN0aW9uRGVsYXkgPSBNYXRoLm1heCgwLCBtaW5pbXVtRGVsYXkgLSByZXNvbHZpbmdUZW1wbGF0ZVNob3duVGltZSk7XG5cbiAgICAgICAgICBpZiAocmVzb2x2aW5nVGVtcGxhdGVTaG93blRpbWUgPCBtaW5pbXVtRGVsYXkpIHtcbiAgICAgICAgICAgIHJldHVybiAkdGltZW91dCgoKSA9PiBpbmplY3RNYWluVGVtcGxhdGUoKVxuICAgICAgICAgICAgICAsIG1haW5UZW1wbGF0ZUluamVjdGlvbkRlbGF5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluamVjdE1haW5UZW1wbGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblJlc29sdXRpb25GYWlsdXJlID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFBlbmRpbmdWaWV3Q291bnRlci5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgICRsb2cuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIFJvdXRlLnNldEN1cnJlbnRCaW5kaW5nKHZpZXcubmFtZSwgYmluZGluZylcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB7dGVtcGxhdGU6ICR0ZW1wbGF0ZVJlcXVlc3QoY29tcG9uZW50LnRlbXBsYXRlVXJsKSwgZGVwZW5kZW5jaWVzOiByZXNvbHZlKGJpbmRpbmcpfTtcbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihvblN1Y2Nlc3NmdWxSZXNvbHV0aW9uLCBvblJlc29sdXRpb25GYWlsdXJlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hvd1Jlc29sdmluZ1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nLnJlc29sdmluZ1RlbXBsYXRlVXJsIHx8ICFiaW5kaW5nLnJlc29sdmUgfHwgKE9iamVjdC5rZXlzKGJpbmRpbmcucmVzb2x2ZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmcucmVzb2x2aW5nVGVtcGxhdGVVcmwpLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICByZXR1cm4gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKSgkcm9vdFNjb3BlLiRuZXcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93UmVzb2x2aW5nRXJyb3IoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICAgICAgaWYgKGJpbmRpbmcucmVzb2x2aW5nRXJyb3JUZW1wbGF0ZVVybCkge1xuICAgICAgICAgIHJldHVybiBzaG93UmVzb2x2aW5nRXJyb3JUZW1wbGF0ZShlbGVtZW50LCBiaW5kaW5nKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaW5kaW5nLnJlc29sdmluZ0Vycm9yQ29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd1Jlc29sdmluZ0Vycm9yVGVtcGxhdGUgPSAoZWxlbWVudCwgYmluZGluZykgPT4gc2hvd0Jhc2ljVGVtcGxhdGUoZWxlbWVudCwgYmluZGluZywgJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnKTtcblxuICAgICAgZnVuY3Rpb24gc2hvd0Vycm9yKGVycm9yLCBlbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgICAgIGxldCByZXR1cm5WYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChiaW5kaW5nLmVycm9yVGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvclRlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcpO1xuICAgICAgICB9IGVsc2UgaWYgKGJpbmRpbmcuZXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IHNob3dFcnJvckNvbXBvbmVudChlcnJvciwgZWxlbWVudCwgYmluZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFiaW5kaW5nLm1hbnVhbENvbXBsZXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBQZW5kaW5nVmlld0NvdW50ZXIuZGVjcmVhc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNob3dFcnJvclRlbXBsYXRlID0gKGVsZW1lbnQsIGJpbmRpbmcpID0+IHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsICdlcnJvclRlbXBsYXRlVXJsJyk7XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dCYXNpY1RlbXBsYXRlKGVsZW1lbnQsIGJpbmRpbmcsIHRlbXBsYXRlRmllbGQpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nW3RlbXBsYXRlRmllbGRdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGJpbmRpbmdbdGVtcGxhdGVGaWVsZF0pLnRoZW4oZnVuY3Rpb24gKHRlbXBsYXRlKSB7XG4gICAgICAgICAgZWxlbWVudC5odG1sKHRlbXBsYXRlKTtcbiAgICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKTtcbiAgICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuICAgICAgICAgIHJldHVybiBsaW5rKHZpZXdTY29wZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaG93RXJyb3JDb21wb25lbnQoZXJyb3IsIGVsZW1lbnQsIGJpbmRpbmcsIGJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICBpZiAoIWJpbmRpbmdDb21wb25lbnRGaWVsZCkge1xuICAgICAgICAgIGJpbmRpbmdDb21wb25lbnRGaWVsZCA9ICdlcnJvckNvbXBvbmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFiaW5kaW5nW2JpbmRpbmdDb21wb25lbnRGaWVsZF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50RnJvbUJpbmRpbmcoYmluZGluZywgYmluZGluZ0NvbXBvbmVudEZpZWxkKTtcbiAgICAgICAgY29uc3QgYXJncyA9IHtkZXBlbmRlbmNpZXM6IHtlcnJvcn19O1xuXG4gICAgICAgIHJldHVybiAkdGVtcGxhdGVSZXF1ZXN0KGNvbXBvbmVudC50ZW1wbGF0ZVVybCkudGhlbihmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICAgICAgICBhcmdzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlckNvbXBvbmVudChlbGVtZW50LCBjb21wb25lbnQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGVsZW1lbnQsIGNvbXBvbmVudCwgYXJncykge1xuICAgICAgICBjb25zdCB7ZGVwZW5kZW5jaWVzfSA9IGFyZ3M7XG4gICAgICAgIGNvbnN0IHt0ZW1wbGF0ZX0gPSBhcmdzO1xuXG4gICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSk7XG4gICAgICAgIGNvbnN0IGxpbmsgPSAkY29tcGlsZShlbGVtZW50LmNvbnRlbnRzKCkpO1xuICAgICAgICB2aWV3U2NvcGUgPSB2aWV3RGlyZWN0aXZlU2NvcGUuJG5ldygpO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQuY29udHJvbGxlcikge1xuICAgICAgICAgIGNvbnN0IGxvY2FscyA9IF8ubWVyZ2UoZGVwZW5kZW5jaWVzLCB7JHNjb3BlOiB2aWV3U2NvcGUsICRlbGVtZW50OiBlbGVtZW50LmNoaWxkcmVuKCkuZXEoMCl9KTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbHMuJHNjb3BlW2NvbXBvbmVudC5jb250cm9sbGVyQXNdID0gJGNvbnRyb2xsZXIoY29tcG9uZW50LmNvbnRyb2xsZXIsIGxvY2Fscyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGpzb25FcnJvcikge1xuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSAnRmFpbGVkIHRvIHNlcmlhbGl6ZSBlcnJvciBvYmplY3QgZm9yIGxvZ2dpbmcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkbG9nLmVycm9yKGBGYWlsZWQgaW5zdGFudGlhdGluZyBjb250cm9sbGVyIGZvciB2aWV3ICR7dmlld306ICR7ZXJyb3JNZXNzYWdlfWApO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmsodmlld1Njb3BlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZSA9IGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgIGlmICghYmluZGluZy5yZXNvbHZlIHx8IChPYmplY3Qua2V5cyhiaW5kaW5nLnJlc29sdmUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7fSk7XG4gICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9taXNlcyA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgZGVwZW5kZW5jeU5hbWUgaW4gYmluZGluZy5yZXNvbHZlKSB7XG4gICAgICAgICAgY29uc3QgZGVwZW5kZW5jeUZhY3RvcnkgPSBiaW5kaW5nLnJlc29sdmVbZGVwZW5kZW5jeU5hbWVdO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkaW5qZWN0b3IuaW52b2tlKGRlcGVuZGVuY3lGYWN0b3J5KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBlbmRlbmN5TmFtZV0gPSAkcS5yZWplY3QoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcyk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nID0gYmluZGluZyA9PiBfLnVuaW9uKGJpbmRpbmcucmVxdWlyZWRTdGF0ZSB8fCBbXSwgYmluZGluZy53YXRjaGVkU3RhdGUgfHwgW10pO1xuXG4gICAgICBmdW5jdGlvbiBzdHJpcE5lZ2F0aW9uUHJlZml4KHN0cikge1xuICAgICAgICBpZiAoc3RyLmNoYXJBdCgwKSA9PT0gJyEnKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3ID0gdmlldyA9PiBfLmZsYXR0ZW4oXy5tYXAodmlldy5nZXRCaW5kaW5ncygpLCBnZXRTdGF0ZUZpZWxkc0Zyb21CaW5kaW5nKSk7XG5cbiAgICAgIGNvbnN0IGdldEZpZWxkc1RvV2F0Y2ggPSB2aWV3ID0+IF8udW5pcShfLm1hcChnZXRTdGF0ZUZpZWxkc0Zyb21WaWV3KHZpZXcpLCBzdHJpcE5lZ2F0aW9uUHJlZml4KSk7XG5cbiAgICAgIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkc1RvV2F0Y2godmlldyk7XG5cbiAgICAgIHJldHVybiBSb3V0ZS53aGVuUmVhZHkoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAvLyBUcnkgdG8gc3RhcnQgdGhlIGJhbGwgcm9sbGluZyBpbiBjYXNlIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIGFuZCB3ZSBjYW4gY3JlYXRlIHRoZSB2aWV3IGltbWVkaWF0ZWx5XG4gICAgICAgIG1hbmFnZVZpZXcoaUVsZW1lbnQsIGJpbmRpbmdzKTtcbiAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gRG9uJ3QgYm90aGVyIHB1dHRpbmcgaW4gYSB3YXRjaGVyIGlmIHRoZXJlJ3Mgbm8gZGVwZW5kZW5jaWVzIHRoYXQgd2lsbCBldmVyIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgaWYgKGZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0ZVdhdGNoZXIgPSBmdW5jdGlvbiAoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgIGlmICh2aWV3TWFuYWdlbWVudFBlbmRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmlld01hbmFnZW1lbnRQZW5kaW5nID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIFdyYXBwZWQgaW4gYSB0aW1lb3V0IHNvIHRoYXQgd2UgY2FuIGZpbmlzaCB0aGUgZGlnZXN0IGN5Y2xlIGJlZm9yZSBidWlsZGluZyB0aGUgdmlldywgd2hpY2ggc2hvdWxkXG4gICAgICAgICAgLy8gcHJldmVudCB1cyBmcm9tIHJlLXJlbmRlcmluZyBhIHZpZXcgbXVsdGlwbGUgdGltZXMgaWYgbXVsdGlwbGUgcHJvcGVydGllcyBvZiB0aGUgc2FtZSBzdGF0ZSBkZXBlbmRlbmN5XG4gICAgICAgICAgLy8gZ2V0IGNoYW5nZWQgd2l0aCByZXBlYXRlZCBTdGF0ZS5zZXQgY2FsbHNcbiAgICAgICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWFuYWdlVmlldyhpRWxlbWVudCwgYmluZGluZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHZpZXdNYW5hZ2VtZW50UGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIFN0YXRlLndhdGNoKGZpZWxkcywgc3RhdGVXYXRjaGVyKTtcblxuICAgICAgICB2aWV3RGlyZWN0aXZlU2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IFN0YXRlLnJlbW92ZVdhdGNoZXIoc3RhdGVXYXRjaGVyKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5kaXJlY3RpdmUoJ3ZpZXcnLCByb3V0ZVZpZXdGYWN0b3J5KTtcblxuY2xhc3MgUGVuZGluZ1ZpZXdDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoJHJvb3RTY29wZSkge1xuICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgfVxuXG4gIGluY3JlYXNlKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50ICs9IDE7XG4gIH1cblxuICBkZWNyZWFzZSgpIHtcbiAgICB0aGlzLmNvdW50ID0gTWF0aC5tYXgoMCwgdGhpcy5jb3VudCAtIDEpO1xuICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFZpZXdzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JpY2tlcl9yb3V0ZXIuaW5pdGlhbFZpZXdzTG9hZGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmlja2VyX3JvdXRlci5jdXJyZW50Vmlld3NMb2FkZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsVmlld3NMb2FkZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1BlbmRpbmdWaWV3Q291bnRlcicsICgkcm9vdFNjb3BlKSA9PiB7XG4gICduZ0luamVjdCc7XG4gIHJldHVybiBuZXcgUGVuZGluZ1ZpZXdDb3VudGVyKCRyb290U2NvcGUpO1xufSk7XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3Qge1xuICBjb25zdHJ1Y3RvcihPYmplY3RIZWxwZXIsIFdhdGNoZXJGYWN0b3J5LCBsaXN0KSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIgPSBPYmplY3RIZWxwZXI7XG4gICAgdGhpcy5XYXRjaGVyRmFjdG9yeSA9IFdhdGNoZXJGYWN0b3J5O1xuXG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLndhdGNoZXJzID0gW107XG4gIH1cblxuICBnZXQocGF0aCkge1xuICAgIHJldHVybiB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCBwYXRoKTtcbiAgfVxuXG4gIGdldEFsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0O1xuICB9XG5cbiAgZ2V0U3Vic2V0KHBhdGhzKSB7XG4gICAgcmV0dXJuIF8uemlwT2JqZWN0KHBhdGhzLCBfLm1hcChwYXRocywgdGhpcy5nZXQuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgdGhpcy5PYmplY3RIZWxwZXIuc2V0KHRoaXMubGlzdCwgcGF0aCwgdmFsdWUpO1xuICAgIHRoaXMuX25vdGlmeVdhdGNoZXJzKHBhdGgsIHZhbHVlKTtcbiAgfVxuXG4gIHVuc2V0KHBhdGhzKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLk9iamVjdEhlbHBlci51bnNldCh0aGlzLmxpc3QsIHBhdGgpO1xuICAgICAgdGhpcy5fbm90aWZ5V2F0Y2hlcnMocGF0aCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdhdGNoKHBhdGhzLCBoYW5kbGVyKSB7XG4gICAgaWYgKCEocGF0aHMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHBhdGhzID0gW3BhdGhzXTtcbiAgICB9XG5cbiAgICBfKHBhdGhzKS5lYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLndhdGNoZXJzLnB1c2godGhpcy5XYXRjaGVyRmFjdG9yeS5jcmVhdGUocGF0aCwgaGFuZGxlciwgdGhpcy5nZXQocGF0aCkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZVdhdGNoZXIod2F0Y2hlcikge1xuICAgIGlmICh0aGlzLndhdGNoZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdXYXRjaGVycyA9IFtdO1xuXG4gICAgXy5lYWNoKHRoaXMud2F0Y2hlcnMsIHRoaXNXYXRjaGVyID0+IHtcbiAgICAgIGlmICh0aGlzV2F0Y2hlci5oYW5kbGVyICE9PSB3YXRjaGVyKSB7XG4gICAgICAgIG5ld1dhdGNoZXJzLnB1c2godGhpc1dhdGNoZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMud2F0Y2hlcnMgPSBuZXdXYXRjaGVycztcbiAgfVxuXG4gIF9ub3RpZnlXYXRjaGVycyhjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICBfLmVhY2godGhpcy53YXRjaGVycywgd2F0Y2hlciA9PiB7XG4gICAgICBpZiAod2F0Y2hlci5zaG91bGROb3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGggPSB0aGlzLk9iamVjdEhlbHBlci5nZXQodGhpcy5saXN0LCB3YXRjaGVyLndhdGNoUGF0aCk7XG4gICAgICAgIHdhdGNoZXIubm90aWZ5KGNoYW5nZWRQYXRoLCBuZXdWYWx1ZUF0V2F0Y2hlZFBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoYWJsZUxpc3RGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkge1xuICAgIHRoaXMuT2JqZWN0SGVscGVyID0gT2JqZWN0SGVscGVyO1xuICAgIHRoaXMuV2F0Y2hlckZhY3RvcnkgPSBXYXRjaGVyRmFjdG9yeTtcbiAgfVxuXG4gIGNyZWF0ZShsaXN0ID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3QodGhpcy5PYmplY3RIZWxwZXIsIHRoaXMuV2F0Y2hlckZhY3RvcnksIGxpc3QpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykuZmFjdG9yeSgnV2F0Y2hhYmxlTGlzdEZhY3RvcnknLCAoT2JqZWN0SGVscGVyLCBXYXRjaGVyRmFjdG9yeSkgPT4ge1xuICAnbmdJbmplY3QnO1xuICByZXR1cm4gbmV3IFdhdGNoYWJsZUxpc3RGYWN0b3J5KE9iamVjdEhlbHBlciwgV2F0Y2hlckZhY3RvcnkpO1xufSk7XG5cbmNsYXNzIFdhdGNoZXIge1xuICBjb25zdHJ1Y3Rvcih3YXRjaFBhdGgsIGhhbmRsZXIsIGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZCkge1xuICAgIHRoaXMud2F0Y2hQYXRoID0gd2F0Y2hQYXRoO1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBfLmNsb25lRGVlcChpbml0aWFsVmFsdWUpO1xuICB9XG5cbiAgX3Rva2VuaXplUGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJy4nKTtcbiAgfVxuXG4gIHNob3VsZE5vdGlmeShjaGFuZ2VkUGF0aCwgbmV3VmFsdWUpIHtcbiAgICAvLyBOQiBzaG9ydCBjaXJjdWl0IGxvZ2ljIGluIHRoZSBzaW1wbGUgY2FzZVxuICAgIGlmICh0aGlzLndhdGNoUGF0aCA9PT0gY2hhbmdlZFBhdGgpIHtcbiAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHModGhpcy5jdXJyZW50VmFsdWUsIG5ld1ZhbHVlKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXRjaCA9IHtcbiAgICAgIHBhdGg6IHRoaXMud2F0Y2hQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgodGhpcy53YXRjaFBhdGgpLFxuICAgICAgdmFsdWU6IHRoaXMuY3VycmVudFZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IGNoYW5nZSA9IHtcbiAgICAgIHBhdGg6IGNoYW5nZWRQYXRoLFxuICAgICAgdG9rZW5zOiB0aGlzLl90b2tlbml6ZVBhdGgoY2hhbmdlZFBhdGgpLFxuICAgICAgdmFsdWU6IG5ld1ZhbHVlXG4gICAgfTtcblxuICAgIGNvbnN0IG1pbmltdW1MZW50aCA9IE1hdGgubWluKGNoYW5nZS50b2tlbnMubGVuZ3RoLCB3YXRjaC50b2tlbnMubGVuZ3RoKTtcbiAgICBmb3IgKGxldCB0b2tlbkluZGV4ID0gMDsgdG9rZW5JbmRleCA8IG1pbmltdW1MZW50aDsgdG9rZW5JbmRleCsrKSB7XG4gICAgICBpZiAod2F0Y2gudG9rZW5zW3Rva2VuSW5kZXhdICE9PSBjaGFuZ2UudG9rZW5zW3Rva2VuSW5kZXhdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOQiBpZiB3ZSBnZXQgaGVyZSB0aGVuIGFsbCBjb21tb24gdG9rZW5zIG1hdGNoXG5cbiAgICBjb25zdCBjaGFuZ2VQYXRoSXNEZXNjZW5kYW50ID0gY2hhbmdlLnRva2Vucy5sZW5ndGggPiB3YXRjaC50b2tlbnMubGVuZ3RoO1xuXG4gICAgaWYgKGNoYW5nZVBhdGhJc0Rlc2NlbmRhbnQpIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGNoYW5nZS50b2tlbnMuc2xpY2Uod2F0Y2gudG9rZW5zLmxlbmd0aCkuam9pbignLicpO1xuICAgICAgY29uc3QgY3VycmVudFZhbHVlQXRDaGFuZ2VkUGF0aCA9IF8uZ2V0KHdhdGNoLnZhbHVlLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyhjdXJyZW50VmFsdWVBdENoYW5nZWRQYXRoLCBjaGFuZ2UudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSB3YXRjaC50b2tlbnMuc2xpY2UoY2hhbmdlLnRva2Vucy5sZW5ndGgpLmpvaW4oJy4nKTtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlQXRXYXRjaFBhdGggPSBfLmdldChjaGFuZ2UudmFsdWUsIHJlbGF0aXZlUGF0aCk7XG4gICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKHdhdGNoLnZhbHVlLCBuZXdWYWx1ZUF0V2F0Y2hQYXRoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnkoY2hhbmdlZFBhdGgsIG5ld1ZhbHVlKSB7XG4gICAgdGhpcy5oYW5kbGVyKGNoYW5nZWRQYXRoLCBuZXdWYWx1ZSwgdGhpcy5jdXJyZW50VmFsdWUpO1xuICAgIHRoaXMuY3VycmVudFZhbHVlID0gXy5jbG9uZURlZXAobmV3VmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIFdhdGNoZXJGYWN0b3J5IHtcbiAgY3JlYXRlKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlID0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG5ldyBXYXRjaGVyKHdhdGNoUGF0aCwgaGFuZGxlciwgaW5pdGlhbFZhbHVlKTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLmZhY3RvcnkoJ1dhdGNoZXJGYWN0b3J5JywgKCkgPT4ge1xuICByZXR1cm4gbmV3IFdhdGNoZXJGYWN0b3J5KCk7XG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2JpY2tlcl9yb3V0ZXInKS5wcm92aWRlcignUm91dGUnLCBmdW5jdGlvbihPYmplY3RIZWxwZXIpIHtcbiAgXCJuZ0luamVjdFwiO1xuICBjb25zdCB0b2tlbnMgPSB7fTtcbiAgY29uc3QgdXJsV3JpdGVycyA9IFtdO1xuICBjb25zdCB1cmxzID0gW107XG4gIGNvbnN0IHBlcnNpc3RlbnRTdGF0ZXMgPSBbXTtcbiAgY29uc3QgcmVhZHkgPSBmYWxzZTtcbiAgY29uc3QgdHlwZXMgPSB7fTtcbiAgbGV0IGh0bWw1TW9kZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3ZpZGVyID0ge1xuXG4gICAgcmVnaXN0ZXJUeXBlKG5hbWUsIGNvbmZpZykge1xuICAgICAgdHlwZXNbbmFtZV0gPSBjb25maWc7XG4gICAgICB0eXBlc1tuYW1lXS5yZWdleCA9IG5ldyBSZWdFeHAodHlwZXNbbmFtZV0ucmVnZXguc291cmNlLCAnaScpO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVHlwZSB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJVcmxUb2tlbihuYW1lLCBjb25maWcpIHtcbiAgICAgIHRva2Vuc1tuYW1lXSA9IF8uZXh0ZW5kKHtuYW1lfSwgY29uZmlnKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybFRva2VuIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybFdyaXRlcihuYW1lLCBmbikge1xuICAgICAgdXJsV3JpdGVyc1tuYW1lXSA9IGZuO1xuICAgICAgcmV0dXJuIF8uZXh0ZW5kKHsgYW5kOiB0aGlzLnJlZ2lzdGVyVXJsV3JpdGVyIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICByZWdpc3RlclVybChwYXR0ZXJuLCBjb25maWcgPSB7fSkge1xuICAgICAgY29uc3QgdXJsRGF0YSA9IHtcbiAgICAgICAgY29tcGlsZWRVcmw6IHRoaXMuX2NvbXBpbGVVcmxQYXR0ZXJuKHBhdHRlcm4sIGNvbmZpZyksXG4gICAgICAgIHBhdHRlcm5cbiAgICAgIH07XG5cbiAgICAgIHVybHMucHVzaChfLmV4dGVuZCh1cmxEYXRhLCBjb25maWcpKTtcbiAgICAgIHJldHVybiBfLmV4dGVuZCh7IGFuZDogdGhpcy5yZWdpc3RlclVybCB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgc2V0UGVyc2lzdGVudFN0YXRlcyguLi5zdGF0ZUxpc3QpIHtcbiAgICAgIF8uZm9yRWFjaChzdGF0ZUxpc3QsIChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIXBlcnNpc3RlbnRTdGF0ZXMuaW5jbHVkZXMoc3RhdGUpKSB7XG4gICAgICAgICAgcGVyc2lzdGVudFN0YXRlcy5wdXNoKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldEh0bWw1TW9kZShtb2RlKSB7XG4gICAgICBodG1sNU1vZGUgPSBtb2RlO1xuICAgIH0sXG5cbiAgICBfY29tcGlsZVVybFBhdHRlcm4odXJsUGF0dGVybiwgY29uZmlnKSB7XG4gICAgICBsZXQgbWF0Y2g7XG4gICAgICB1cmxQYXR0ZXJuID0gdGhpcy5fZXNjYXBlUmVnZXhTcGVjaWFsQ2hhcmFjdGVycyh1cmxQYXR0ZXJuKTtcbiAgICAgIHVybFBhdHRlcm4gPSB0aGlzLl9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2godXJsUGF0dGVybik7XG5cbiAgICAgIGNvbnN0IHRva2VuUmVnZXggPSAvXFx7KFtBLVphLXpcXC5fMC05XSspXFx9L2c7XG4gICAgICBsZXQgdXJsUmVnZXggPSB1cmxQYXR0ZXJuO1xuXG4gICAgICBpZiAoIWNvbmZpZy5wYXJ0aWFsTWF0Y2gpIHtcbiAgICAgICAgdXJsUmVnZXggPSBgXiR7dXJsUmVnZXh9JGA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRva2VuTGlzdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKG1hdGNoID0gdG9rZW5SZWdleC5leGVjKHVybFBhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1ttYXRjaFsxXV07XG4gICAgICAgIHRva2VuTGlzdC5wdXNoKHRva2VuKTtcbiAgICAgICAgdXJsUmVnZXggPSB1cmxSZWdleC5yZXBsYWNlKG1hdGNoWzBdLCBgKCR7dHlwZXNbdG9rZW4udHlwZV0ucmVnZXguc291cmNlfSlgKTtcbiAgICAgIH1cblxuICAgICAgdXJsUmVnZXgucmVwbGFjZSgnLicsICdcXFxcLicpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCh1cmxSZWdleCwgJ2knKSxcbiAgICAgICAgdG9rZW5zOiB0b2tlbkxpc3RcbiAgICAgIH07XG4gICAgfSxcblxuICAgIF9lbnN1cmVPcHRpb25hbFRyYWlsaW5nU2xhc2goc3RyKSB7XG4gICAgICBpZiAoc3RyLm1hdGNoKC9cXC8kLykpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXC8kLywgJy8/Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYCR7c3RyfS8/YDtcbiAgICB9LFxuXG4gICAgX2VzY2FwZVJlZ2V4U3BlY2lhbENoYXJhY3RlcnMoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXChcXClcXCpcXCtcXD9cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICB9LFxuXG4gICAgJGdldCgkbG9jYXRpb24sICRpbmplY3RvciwgJHEpIHtcbiAgICAgICduZ0luamVjdCc7XG5cbiAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgc2VydmljZSAob25seSBkb25lIG9uY2UpLCB3ZSBuZWVkIHRvIGl0ZXJhdGUgb3ZlciB0aGUgdXJsV3JpdGVycyBhbmQgdHVyblxuICAgICAgLy8gdGhlbSBpbnRvIG1ldGhvZHMgdGhhdCBpbnZva2UgdGhlIFJFQUwgdXJsV3JpdGVyLCBidXQgcHJvdmlkaW5nIGRlcGVuZGVuY3kgaW5qZWN0aW9uIHRvIGl0LCB3aGlsZSBhbHNvXG4gICAgICAvLyBnaXZpbmcgaXQgdGhlIGRhdGEgdGhhdCB0aGUgY2FsbGVlIHBhc3NlcyBpbi5cblxuICAgICAgLy8gVGhlIHJlYXNvbiB3ZSBoYXZlIHRvIGRvIHRoaXMgaGVyZSBpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoZSAkaW5qZWN0b3IgYmFjayBpbiB0aGUgcm91dGVQcm92aWRlci5cblxuICAgICAgXy5mb3JJbih1cmxXcml0ZXJzLCAod3JpdGVyLCB3cml0ZXJOYW1lKSA9PlxuICAgICAgICB1cmxXcml0ZXJzW3dyaXRlck5hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmICghZGF0YSkgeyBkYXRhID0ge307IH1cbiAgICAgICAgICBjb25zdCBsb2NhbHMgPSB7VXJsRGF0YTogZGF0YX07XG4gICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5pbnZva2Uod3JpdGVyLCB7fSwgbG9jYWxzKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgbGV0IGZsYXNoU3RhdGVzID0gW107XG5cbiAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgIGN1cnJlbnRCaW5kaW5nczoge30sXG4gICAgICAgIHJlYWR5RGVmZXJyZWQ6ICRxLmRlZmVyKCksXG5cbiAgICAgICAgbWF0Y2godXJsVG9NYXRjaCkge1xuICAgICAgICAgIGZvciAoY29uc3QgdXJsIG9mIEFycmF5LmZyb20odXJscykpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSB1cmwuY29tcGlsZWRVcmwucmVnZXguZXhlYyh1cmxUb01hdGNoKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHt1cmwsIHJlZ2V4TWF0Y2g6IG1hdGNofTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERhdGEobWF0Y2gsIHNlYXJjaERhdGEgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMuZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKTtcbiAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5leHRyYWN0UGF0aERhdGEobWF0Y2gpO1xuICAgICAgICAgIHNlYXJjaERhdGEgPSB0aGlzLmV4dHJhY3RTZWFyY2hEYXRhKHNlYXJjaERhdGEpO1xuICAgICAgICAgIHJldHVybiBPYmplY3RIZWxwZXIuZGVmYXVsdChzZWFyY2hEYXRhLCBwYXRoLCBkZWZhdWx0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdFNlYXJjaERhdGEoc2VhcmNoRGF0YSkge1xuICAgICAgICAgIGlmICghc2VhcmNoRGF0YSkgeyBzZWFyY2hEYXRhID0gJGxvY2F0aW9uLnNlYXJjaCgpOyB9XG4gICAgICAgICAgY29uc3QgZGF0YSA9IF8uY2xvbmUoc2VhcmNoRGF0YSk7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKGRhdGEsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0S2V5ID0gXy5maW5kS2V5KHRva2VucywgeyBzZWFyY2hBbGlhczoga2V5IH0pO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRLZXkpIHsgdGFyZ2V0S2V5ID0ga2V5OyB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuVHlwZU5hbWUgPSB0b2tlbnNbdGFyZ2V0S2V5XSA/IF8uZ2V0KHRva2Vuc1t0YXJnZXRLZXldLCAndHlwZScpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCF0b2tlbnNbdGFyZ2V0S2V5XSB8fCAodHlwZXNbdG9rZW5UeXBlTmFtZV0ucmVnZXgudGVzdCh2YWx1ZSkpKSB7XG5cbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlID0gdG9rZW5zW3RhcmdldEtleV0gPyB0b2tlbnNbdGFyZ2V0S2V5XS50eXBlIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCB0eXBlVG9rZW5UeXBlID0gdG9rZW5UeXBlID8gdHlwZXNbdG9rZW5UeXBlXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgY29uc3QgdG9rZW5UeXBlUGFyc2VkID0gdHlwZVRva2VuVHlwZSA/IHR5cGVUb2tlblR5cGUucGFyc2VyIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgIGlmICh0b2tlblR5cGVQYXJzZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICRpbmplY3Rvci5pbnZva2UodG9rZW5UeXBlUGFyc2VkLCBudWxsLCB7dG9rZW46IHZhbHVlfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCB0b2tlblRhcmdldEtleVN0YXRlUGF0aCA9IHRva2Vuc1t0YXJnZXRLZXldID8gdG9rZW5zW3RhcmdldEtleV0uc3RhdGVQYXRoIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICBjb25zdCBkYXRhS2V5ID0gdG9rZW5UYXJnZXRLZXlTdGF0ZVBhdGggfHwgdGFyZ2V0S2V5O1xuXG4gICAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQobmV3RGF0YSwgZGF0YUtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG5ld0RhdGE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0cmFjdERlZmF1bHREYXRhKG1hdGNoKSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgXy5mb3JFYWNoKG1hdGNoLnVybC5zdGF0ZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIE9iamVjdEhlbHBlci5zZXQoZGF0YSwga2V5LCAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IF8uY2xvbmVEZWVwKHZhbHVlKSA6IHZhbHVlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBleHRyYWN0UGF0aERhdGEobWF0Y2gpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgICAgY29uc3QgcGF0aFRva2VucyA9IG1hdGNoLnVybC5jb21waWxlZFVybC50b2tlbnM7XG5cbiAgICAgICAgICBpZiAocGF0aFRva2Vucy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHt9OyB9XG5cbiAgICAgICAgICBmb3IgKGxldCBuID0gMCwgZW5kID0gcGF0aFRva2Vucy5sZW5ndGgtMSwgYXNjID0gMCA8PSBlbmQ7IGFzYyA/IG4gPD0gZW5kIDogbiA+PSBlbmQ7IGFzYyA/IG4rKyA6IG4tLSkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBtYXRjaC51cmwuY29tcGlsZWRVcmwudG9rZW5zW25dO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbWF0Y2gucmVnZXhNYXRjaFtuKzFdO1xuXG4gICAgICAgICAgICBpZiAodHlwZXNbdG9rZW4udHlwZV0ucGFyc2VyKSB7IHZhbHVlID0gJGluamVjdG9yLmludm9rZSh0eXBlc1t0b2tlbi50eXBlXS5wYXJzZXIsIG51bGwsIHt0b2tlbjogdmFsdWV9KTsgfVxuXG4gICAgICAgICAgICBPYmplY3RIZWxwZXIuc2V0KGRhdGEsICh0b2tlbi5zdGF0ZVBhdGggfHwgdG9rZW4ubmFtZSksIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRVcmxXcml0ZXJzKCkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVybFdyaXRlcihuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIHVybFdyaXRlcnNbbmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiB1cmxXcml0ZXJzW25hbWVdKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdvKG5hbWUsIGRhdGEgPSB7fSkge1xuICAgICAgICAgIHJldHVybiAkbG9jYXRpb24udXJsKHRoaXMuaW52b2tlVXJsV3JpdGVyKG5hbWUsIGRhdGEpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRQZXJzaXN0ZW50U3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBwZXJzaXN0ZW50U3RhdGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2V0Rmxhc2hTdGF0ZXMoKSB7XG4gICAgICAgICAgZmxhc2hTdGF0ZXMgPSBbXTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRGbGFzaFN0YXRlcyguLi5uZXdTdGF0ZXMpIHtcbiAgICAgICAgICBmbGFzaFN0YXRlcyA9IGZsYXNoU3RhdGVzLmNvbmNhdChuZXdTdGF0ZXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEZsYXNoU3RhdGVzKCkge1xuICAgICAgICAgIHJldHVybiBmbGFzaFN0YXRlcztcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRDdXJyZW50QmluZGluZyh2aWV3TmFtZSwgYmluZGluZykge1xuICAgICAgICAgIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXSA9IGJpbmRpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QmluZGluZ3Nbdmlld05hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlbGV0ZUN1cnJlbnRCaW5kaW5nKHZpZXdOYW1lKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuY3VycmVudEJpbmRpbmdzW3ZpZXdOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBtYXRjaGVzQ3VycmVudEJpbmRpbmdOYW1lKHZpZXdOYW1lLCBiaW5kaW5nTmFtZUV4cHJlc3Npb24pIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50QmluZGluZyA9IHRoaXMuZ2V0Q3VycmVudEJpbmRpbmcodmlld05hbWUpXG5cbiAgICAgICAgICBpZiAoIWN1cnJlbnRCaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gYmluZGluZ05hbWVFeHByZXNzaW9uIGluc3RhbmNlb2YgUmVnRXhwID9cbiAgICAgICAgICAgIGJpbmRpbmdOYW1lRXhwcmVzc2lvbi50ZXN0KGN1cnJlbnRCaW5kaW5nLm5hbWUpIDpcbiAgICAgICAgICAgIGN1cnJlbnRCaW5kaW5nLm5hbWUgPT09IGJpbmRpbmdOYW1lRXhwcmVzc2lvbjtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRSZWFkeShyZWFkeSkge1xuICAgICAgICAgIGlmICghcmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVhZHlEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1JlYWR5KCkge1xuICAgICAgICAgIHJldHVybiByZWFkeTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0h0bWw1TW9kZUVuYWJsZWQoKSB7XG4gICAgICAgICAgcmV0dXJuIGh0bWw1TW9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICB3aGVuUmVhZHkoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHlEZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdudW1lcmljJywge3JlZ2V4OiAvXFxkKy8sIHBhcnNlcjogWyd0b2tlbicsIHRva2VuID0+IHBhcnNlSW50KHRva2VuKV19KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbHBoYScsIHtyZWdleDogL1thLXpBLVpdKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdhbnknLCB7cmVnZXg6IC8uKy99KTtcbiAgcHJvdmlkZXIucmVnaXN0ZXJUeXBlKCdsaXN0Jywge3JlZ2V4OiAvLisvLCBwYXJzZXI6IFsndG9rZW4nLCB0b2tlbiA9PiB0b2tlbi5zcGxpdCgnLCcpXX0pO1xuXG4gIHJldHVybiBwcm92aWRlcjtcbn0pO1xuXG5jbGFzcyBTdGF0ZVByb3ZpZGVyIHtcbiAgJGdldChXYXRjaGFibGVMaXN0RmFjdG9yeSkge1xuICAgICduZ0luamVjdCc7XG4gICAgcmV0dXJuIFdhdGNoYWJsZUxpc3RGYWN0b3J5LmNyZWF0ZSgpO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCdiaWNrZXJfcm91dGVyJykucHJvdmlkZXIoJ1N0YXRlJywgbmV3IFN0YXRlUHJvdmlkZXIpO1xuXG5hbmd1bGFyLm1vZHVsZSgnYmlja2VyX3JvdXRlcicpLnByb3ZpZGVyKCdWaWV3QmluZGluZ3MnLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHZpZXdzID0gW107XG5cbiAgY2xhc3MgVmlldyB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgYmluZGluZ3MpIHtcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XG4gICAgICBpZiAoISh0aGlzLmJpbmRpbmdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBbdGhpcy5iaW5kaW5nc107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QmluZGluZ3MoKSB7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5ncztcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuXG4gICAgYmluZChuYW1lLCBjb25maWcpIHtcblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKGJpbmRpbmdzLCBjb21tb25SZXF1aXJlZFN0YXRlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmcgb2YgQXJyYXkuZnJvbShuZXdCaW5kaW5ncykpIHtcbiAgICAgICAgICBpZiAoIShiaW5kaW5nLnJlcXVpcmVkU3RhdGUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIGJpbmRpbmcucmVxdWlyZWRTdGF0ZSA9IFtiaW5kaW5nLnJlcXVpcmVkU3RhdGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChiaW5kaW5nLnJlcXVpcmVkU3RhdGUgPSBiaW5kaW5nLnJlcXVpcmVkU3RhdGUuY29uY2F0KGNvbW1vblJlcXVpcmVkU3RhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUNvbW1vblJlc29sdmUoYmluZGluZ3MsIGNvbW1vblJlc29sdmUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmluZGluZyBvZiBBcnJheS5mcm9tKG5ld0JpbmRpbmdzKSkge1xuICAgICAgICAgIGlmICghKCdyZXNvbHZlJyBpbiBiaW5kaW5nKSkge1xuICAgICAgICAgICAgYmluZGluZy5yZXNvbHZlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKF8uZGVmYXVsdHMoYmluZGluZy5yZXNvbHZlLCBjb21tb25SZXNvbHZlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXBwbHlDb21tb25GaWVsZHMobmV3QmluZGluZ3MpIHtcbiAgICAgICAgY29uc3QgYmFzaWNDb21tb25GaWVsZHMgPSBbXG4gICAgICAgICAge25hbWU6ICdjb21tb25SZXNvbHZpbmdFcnJvclRlbXBsYXRlVXJsJywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yVGVtcGxhdGVVcmwnfSxcbiAgICAgICAgICB7bmFtZTogJ2NvbW1vblJlc29sdmluZ0Vycm9yQ29tcG9uZW50Jywgb3ZlcnJpZGVGaWVsZDogJ3Jlc29sdmluZ0Vycm9yQ29tcG9uZW50J30sXG4gICAgICAgICAge25hbWU6ICdjb21tb25FcnJvckNvbXBvbmVudCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvckNvbXBvbmVudCd9LFxuICAgICAgICAgIHtuYW1lOiAnY29tbW9uRXJyb3JUZW1wbGF0ZVVybCcsIG92ZXJyaWRlRmllbGQ6ICdlcnJvclRlbXBsYXRlVXJsJ31cbiAgICAgICAgXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNvbW1vbkZpZWxkIG9mIEFycmF5LmZyb20oYmFzaWNDb21tb25GaWVsZHMpKSB7XG4gICAgICAgICAgaWYgKGNvbW1vbkZpZWxkLm5hbWUgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBkZWZhdWx0QmluZGluZ0ZpZWxkKG5ld0JpbmRpbmdzLCBjb21tb25GaWVsZC5vdmVycmlkZUZpZWxkLCBjb25maWdbY29tbW9uRmllbGQubmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgnY29tbW9uUmVxdWlyZWRTdGF0ZScgaW4gY29uZmlnKSB7XG4gICAgICAgICAgYXBwbHlDb21tb25SZXF1aXJlZFN0YXRlKG5ld0JpbmRpbmdzLCBjb25maWdbJ2NvbW1vblJlcXVpcmVkU3RhdGUnXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ2NvbW1vblJlc29sdmUnIGluIGNvbmZpZykge1xuICAgICAgICAgIHJldHVybiBhcHBseUNvbW1vblJlc29sdmUobmV3QmluZGluZ3MsIGNvbmZpZ1snY29tbW9uUmVzb2x2ZSddKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZWZhdWx0QmluZGluZ0ZpZWxkKGJpbmRpbmdzLCBmaWVsZE5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBiaW5kaW5nIG9mIEFycmF5LmZyb20obmV3QmluZGluZ3MpKSB7XG4gICAgICAgICAgbGV0IGl0ZW07XG4gICAgICAgICAgaWYgKCEoZmllbGROYW1lIGluIGJpbmRpbmcpKSB7XG4gICAgICAgICAgICBpdGVtID0gYmluZGluZ1tmaWVsZE5hbWVdID0gZGVmYXVsdFZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3QmluZGluZ3MgPSBbXTtcbiAgICAgIGlmICgnYmluZGluZ3MnIGluIGNvbmZpZykge1xuICAgICAgICBuZXdCaW5kaW5ncyA9IGNvbmZpZ1snYmluZGluZ3MnXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0JpbmRpbmdzID0gKGNvbmZpZyBpbnN0YW5jZW9mIEFycmF5KSA/IGNvbmZpZyA6IFtjb25maWddO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShuZXdCaW5kaW5ncy5sZW5ndGggPiAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY2FsbCB0byBWaWV3QmluZGluZ3NQcm92aWRlci5iaW5kIGZvciBuYW1lICcke25hbWV9J2ApO1xuICAgICAgfVxuXG4gICAgICBhcHBseUNvbW1vbkZpZWxkcyhuZXdCaW5kaW5ncyk7XG4gICAgICByZXR1cm4gdmlld3NbbmFtZV0gPSBuZXcgVmlldyhuYW1lLCBuZXdCaW5kaW5ncyk7XG4gICAgfSxcblxuICAgICRnZXQoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXRWaWV3KHZpZXcpIHtcbiAgICAgICAgICByZXR1cm4gdmlld3Nbdmlld107XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
