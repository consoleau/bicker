// @TODO none of the animation code in this directive has been tested. Not sure if it can be at this stage This needs further investigation.
// @TODO this code does too much, it should be refactored.

function routeViewFactory($log, $compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, $templateRequest, Route) {
  'ngInject';
  return {
    restrict: 'E',
    scope: false,
    replace: true,
    template: '<div></div>',
    link (viewDirectiveScope, iElement, iAttrs) {
      let viewCreated = false;
      let viewScope = undefined;
      let viewManagementPending = false;
      const view = ViewBindings.getView(iAttrs.name);
      const bindings = view.getBindings();
      let reloading = false

      iElement.addClass('ng-hide');

      let previousBoundState = undefined;
      let previousBinding = undefined;

      const getStateDataForBinding = binding => _.cloneDeep(State.getSubset(getStateFieldsFromBinding(binding)));

      function getComponentFromBinding(binding, field) {
        if (!field) {
          field = 'component';
        }
        const source = binding[field] ? $injector.get(`${binding[field]}Directive`)[0] : binding;
        return _.defaults(_.pick(source, ['controller', 'templateUrl', 'controllerAs']), {controllerAs: '$ctrl'});
      }

      function hasRequiredData(binding) {
        const requiredState = binding.requiredState || [];

        for (let requirement of Array.from(requiredState)) {
          let negateResult = false;
          if ('!' === requirement.charAt(0)) {
            requirement = requirement.slice(1);
            negateResult = true;
          }

          let element = State.get(requirement);

          // Return false if element is undefined
          if ((element === null)) {
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

        if (binding.canActivate) {
          if (!$injector.invoke(binding.canActivate)) {
            return false;
          }
        }

        return true;
      }

      function manageView(element, bindings) {
        const matchingBinding = getMatchingBinding(bindings);

        if (!matchingBinding) {
          if (viewCreated) {
            $animate.addClass(element, 'ng-hide').then(() => {
              return destroyView(element);
            });
            previousBoundState = undefined;
            previousBinding = undefined;
            Route.deleteCurrentBinding(view.name)
          }
          return $q.resolve();
        }

        const newState = getStateDataForBinding(matchingBinding);

        if (!reloading && (matchingBinding === previousBinding) && angular.equals(previousBoundState, newState)) {
          return $q.resolve();
        }

        console.log('reloading state = ', reloading)

        previousBinding = matchingBinding;
        previousBoundState = newState;

        PendingViewCounter.increase();

        return showResolvingTemplate(element, matchingBinding).then(function (hasResolvingTemplate) {
          // @TODO: Magic number
          const delayForRealTemplateInsertion = hasResolvingTemplate ? 300 : undefined;

          if (!viewCreated) {
            return $animate.removeClass(element, 'ng-hide').then(() => {
              return createView(element, matchingBinding, delayForRealTemplateInsertion);
            });
          } else {
            viewScope.$destroy();
            return createView(element, matchingBinding, delayForRealTemplateInsertion);
          }
        });
      }

      function getMatchingBinding(bindings) {
        for (const binding of Array.from(bindings)) {
          if (hasRequiredData(binding)) {
            return binding;
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
        const timeStartedMainView = Date.now();
        const component = getComponentFromBinding(binding);

        const onSuccessfulResolution = function (args) {
          if (getMatchingBinding(bindings) !== binding) {
            return;
          }

          viewCreated = true;

          const resolvingTemplateShownTime = Date.now() - timeStartedMainView;

          const injectMainTemplate = function () {
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

          const mainTemplateInjectionDelay = Math.max(0, minimumDelay - resolvingTemplateShownTime);

          if (resolvingTemplateShownTime < minimumDelay) {
            return $timeout(() => injectMainTemplate()
              , mainTemplateInjectionDelay);
          } else {
            return injectMainTemplate();
          }
        };

        const onResolutionFailure = function (error) {
          $timeout(function () {
            if (!binding.manualCompletion) {
              return PendingViewCounter.decrease();
            }
          });
          $log.error(error);
          return showResolvingError(error, element, binding);
        };

        Route.setCurrentBinding(view.name, binding)
        const promises = {template: $templateRequest(component.templateUrl), dependencies: resolve(binding)};
        return $q.all(promises).then(onSuccessfulResolution, onResolutionFailure);
      }

      function showResolvingTemplate(element, binding) {
        if (!binding.resolvingTemplateUrl || !binding.resolve || (Object.keys(binding.resolve).length === 0)) {
          const deferred = $q.defer();
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

      const showResolvingErrorTemplate = (element, binding) => showBasicTemplate(element, binding, 'resolvingErrorTemplateUrl');

      function showError(error, element, binding) {
        let returnValue = null;
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

      const showErrorTemplate = (element, binding) => showBasicTemplate(element, binding, 'errorTemplateUrl');

      function showBasicTemplate(element, binding, templateField) {
        if (!binding[templateField]) {
          return;
        }
        return $templateRequest(binding[templateField]).then(function (template) {
          element.html(template);
          const link = $compile(element.contents());
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
        const component = getComponentFromBinding(binding, bindingComponentField);
        const args = {dependencies: {error}};

        return $templateRequest(component.templateUrl).then(function (template) {
          args.template = template;
          return renderComponent(element, component, args);
        });
      }

      function renderComponent(element, component, args) {
        const {dependencies} = args;
        const {template} = args;

        element.html(template);
        const link = $compile(element.contents());
        viewScope = viewDirectiveScope.$new();

        if (component.controller) {
          const locals = _.merge(dependencies, {$scope: viewScope, $element: element.children().eq(0)});

          try {
            locals.$scope[component.controllerAs] = $controller(component.controller, locals);
          }
          catch (error) {
            let errorMessage;

            try {
              if (_.isObject(error)) {
                errorMessage = JSON.stringify(error);
              } else {
                errorMessage = error;
              }

            } catch (jsonError) {
              errorMessage = 'Failed to serialize error object for logging';
            }

            $log.error(`Failed instantiating controller for view ${view}: ${errorMessage}`);
            throw error;
          }
        }

        return link(viewScope);
      }

      const resolve = function (binding) {
        if (!binding.resolve || (Object.keys(binding.resolve).length === 0)) {
          const deferred = $q.defer();
          deferred.resolve({});
          return deferred.promise;
        }

        const promises = {};

        for (const dependencyName in binding.resolve) {
          const dependencyFactory = binding.resolve[dependencyName];
          try {
            promises[dependencyName] = $injector.invoke(dependencyFactory);
          } catch (e) {
            promises[dependencyName] = $q.reject(e);
          }
        }

        return $q.all(promises);
      };

      const getStateFieldsFromBinding = binding => _.union(binding.requiredState || [], binding.watchedState || []);

      function stripNegationPrefix(str) {
        if (str.charAt(0) === '!') {
          return str.substr(1);
        } else {
          return str;
        }
      }

      const getStateFieldsFromView = view => _.flatten(_.map(view.getBindings(), getStateFieldsFromBinding));

      const getFieldsToWatch = view => _.uniq(_.map(getStateFieldsFromView(view), stripNegationPrefix));

      const fields = getFieldsToWatch(view);

      return Route.whenReady().then(function () {
        viewManagementPending = true;

        // Try to start the ball rolling in case there's no dependencies and we can create the view immediately
        manageView(iElement, bindings);
        viewManagementPending = false;

        // Don't bother putting in a watcher if there's no dependencies that will ever trigger a change event
        if (fields.length === 0) {
          return;
        }

        const reload = function () {
          if (viewManagementPending) {
            return;
          }

          viewManagementPending = true;

          // Wrapped in a timeout so that we can finish the digest cycle before building the view, which should
          // prevent us from re-rendering a view multiple times if multiple properties of the same state dependency
          // get changed with repeated State.set calls
          return $timeout(function () {
            manageView(iElement, bindings).finally(() => {
              reloading = false;
              viewManagementPending = false;
            });
          });
        };

        State.watch(fields, reload);

        const deregisterForcedReloadListener = $rootScope.$on('bicker_router.forcedReload', function() {
          reloading = true;
          reload();
        })

        viewDirectiveScope.$on('$destroy', () => {
          State.removeWatcher(reload);
          deregisterForcedReloadListener();
        });
      });
    }
  }
}

angular.module('bicker_router').directive('view', routeViewFactory);
