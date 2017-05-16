describe('View directive', function() {

  beforeEach(function() {
    window.angular.mock.module('bicker_router');
    window.angular.mock.module('ngAnimateMock');
  });

  it('should not load view or controller until state has been checked', function() {
    const controller = jasmine.createSpy();

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url', {state: {stateField: true}});
      $controllerProvider.register('StateVariationActrl', ['$scope', controller]);

      ViewBindingsProvider.bind('viewA', [{
          controller: 'StateVariationActrl',
          templateUrl: 'stateVariationA.html',
          requiredState: ['stateField']
        }
        , {
          controller: 'StateVariationBctrl',
          templateUrl: 'stateVariationB.html'
        }]
      );

      mockLocationNotReady();
      mockTemplateRequest('stateVariationA.html', '<div>state variation A template</div>');

      inject(function($rootScope, $httpBackend) {
        triggerOpeningAnimationCompleteCallbacks();

        $rootScope.$digest(); // resolve the empty resolving template promise
        $httpBackend.verifyNoOutstandingRequest();
      });

      expect(controller, 'controller not called').not.toHaveBeenCalled();
      expect(element.find('#contents').length, '#contents count').toBe(0);
    });
  });

  it('binds a view to the associated template and controller when no required state and URL has been set', function() {
    const controller = jasmine.createSpy();

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      $controllerProvider.register('StateVariationActrl', ['$scope', controller]);

      ViewBindingsProvider.bind('viewA', {
        controller: 'StateVariationActrl',
        templateUrl: 'stateVariationA.html'
      });
    });

    mockLocationSuccess();
    mockTemplateRequest('stateVariationA.html', '<div>state variation A template</div>');

    createView('viewA');
    triggerOpeningAnimationCompleteCallbacks();
    deliverMainTemplate();

    expect(controller).toHaveBeenCalled();
  });

  it('can use a component in place of the controller and templateUrl', function() {
    const controller = jasmine.createSpy();

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $compileProvider) {
      $compileProvider.component('myComponent', {controller, templateUrl: 'stateVariationA.html'});
      ViewBindingsProvider.bind('viewA', {component: 'myComponent'});
    });

    mockLocationSuccess();
    mockTemplateRequest('stateVariationA.html', '<div>state variation A template</div>');

    createView('viewA');
    triggerOpeningAnimationCompleteCallbacks();
    deliverMainTemplate();

    expect(controller).toHaveBeenCalled();
  });

  // NB: This test will blow up if $element is not available because Angular will throw an exception
  it('provides $element to controllers when requested', function() {
    const controller = jasmine.createSpy();

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $compileProvider) {
      $compileProvider.component('myComponent', {controller, templateUrl: 'stateVariationA.html'});
      ViewBindingsProvider.bind('viewA', {component: 'myComponent'});
    });

    mockLocationSuccess();
    mockTemplateRequest('stateVariationA.html', '<div>state variation A template</div>');

    createView('viewA');
    triggerOpeningAnimationCompleteCallbacks();
    deliverMainTemplate();
  });

  it('should assign the controller to scope.$ctrl', function() {
    let controller = function() {
      this.testing = 1234;
    };

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $compileProvider) {
      $compileProvider.component('myComponent', {controller, templateUrl: 'stateVariationA.html'});
      ViewBindingsProvider.bind('viewA', {component: 'myComponent'});
    });

    mockLocationSuccess();
    mockTemplateRequest('stateVariationA.html', '<div>{{$ctrl.testing}}</div>');

    const element = createView('viewA');
    triggerOpeningAnimationCompleteCallbacks();
    deliverMainTemplate();

    expect(element.text()).toEqual('1234');
  });

  it('should allow users to specify the name of the property on scope where the controller will be found via controllerAs', function() {
    let controller = function() {
      this.testing = 1234;
    };

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $compileProvider) {
      $compileProvider.component('myComponent', {controller, controllerAs: 'boop', templateUrl: 'stateVariationA.html'});
      ViewBindingsProvider.bind('viewA', {component: 'myComponent'});
    });

    mockLocationSuccess();
    mockTemplateRequest('stateVariationA.html', '<div>{{boop.testing}}</div>');

    const element = createView('viewA');
    triggerOpeningAnimationCompleteCallbacks();
    deliverMainTemplate();

    expect(element.text()).toEqual('1234');
  });

  it('only binds a view if the required state data matches up to the state of the current page', function() {
    const controller = jasmine.createSpy();

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      $controllerProvider.register('StateVariationActrl', ['$scope', controller]);

      ViewBindingsProvider.bind('viewA', {
        controller: 'StateVariationActrl',
        templateUrl: 'stateVariationA.html',
        requiredState: ['stateField']
      });
    });

    mockLocationSuccess();
    mockTemplateRequest('stateVariationA.html', '<div id="contents"></div>');

    inject(function($rootScope, $httpBackend, State) {
      let element = createView('viewA');
      $httpBackend.verifyNoOutstandingRequest();

      expect(controller, 'before: controller not called').not.toHaveBeenCalled();
      expect(element.find('#contents').length, 'before: #contents count').toBe(0);

      State.set('stateField', 'some value');

      element = createView('viewA');
      triggerOpeningAnimationCompleteCallbacks();
      deliverMainTemplate();

      expect(controller, 'after: controller not called').toHaveBeenCalled();
      expect(element.find('#contents').length, 'after: #contents count').toBe(1);
    });
  });

  it('will not bind a view if the canActivate function returns false', function() {
    const controllerA = jasmine.createSpy('controllerA');
    const controllerB = jasmine.createSpy('controllerB');

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider) {
      ViewBindingsProvider.bind('viewA', [
        {
          controller: controllerA,
          templateUrl: 'stateVariationA.html',
          canActivate() {
            return false;
          }
        },
        {
          controller: controllerB,
          templateUrl: 'stateVariationB.html',
          canActivate() {
            return true;
          }
        }
      ]);

    });

    mockLocationSuccess();
    mockTemplateRequest('stateVariationB.html', '<div>state variation B template</div>');

    createView('viewA');
    triggerOpeningAnimationCompleteCallbacks();
    deliverMainTemplate();

    expect(controllerA, 'controllerA should not be called').not.toHaveBeenCalled();
    expect(controllerB, 'controllerB should be called').toHaveBeenCalled();
  });

  it('binds the view if the required state becomes available after the containing template is processed', function() {
    const controller = jasmine.createSpy();

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      $controllerProvider.register('StateVariationActrl', ['$scope', controller]);

      ViewBindingsProvider.bind('viewA', {
        controller: 'StateVariationActrl',
        templateUrl: 'stateVariationA.html',
        requiredState: ['stateField']
      });

    });

    mockLocationSuccess();
    mockTemplateRequest('stateVariationA.html', '<div id="contents"></div>');

    inject(function($httpBackend, State) {
      const element = createView('viewA');
      $httpBackend.verifyNoOutstandingRequest();

      expect(controller, 'before: controller should not be called').not.toHaveBeenCalled();
      expect(element.find('#contents').length, 'before: #contents count').toBe(0);

      State.set('stateField', 'some value???');

      triggerStateChangeEventConslidationTimeout();
      triggerOpeningAnimationCompleteCallbacks();
      deliverMainTemplate();

      expect(controller, 'after: controller should be called').toHaveBeenCalled();
      expect(element.find('#contents').length, 'after: #contents count').toBe(1);
    });
  });

  it('unbinds the view if the required state is removed after the containing template is processed', function() {
    const controller = jasmine.createSpy();

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      $controllerProvider.register('StateVariationActrl', ['$scope', '$element', controller]);
      RouteProvider.setPersistentStates('stateField');
      ViewBindingsProvider.bind('viewA', {
        controller: 'StateVariationActrl',
        templateUrl: 'stateVariationA.html',
        requiredState: ['stateField']
      });
    });

    mockTemplateRequest('stateVariationA.html', '<div id="contents"></div>');
    mockLocationSuccess();

    inject(function($compile, $httpBackend, State) {
      State.set('stateField', 'some value');

      const element = createView('viewA');
      triggerOpeningAnimationCompleteCallbacks();
      deliverMainTemplate();

      expect(controller, 'before: controller should be called').toHaveBeenCalled();
      expect(element.find('#contents').length, 'before: #contents count').toBe(1);

      State.unset('stateField');
      triggerStateChangeEventConslidationTimeout();
      triggerOpeningAnimationCompleteCallbacks();

      expect(element.find('#contents').length, 'after: #contents count').toBe(0);
    });
  });

  it('results in $element $destroy event being triggered when the view binding is removed', function() {
    let destroyCalledCounter = 0;

    function controller($element) {
      $element.$on('$destroy', () => destroyCalledCounter += 1);
    }

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      $controllerProvider.register('StateVariationActrl', ['$scope', '$element', controller]);
      RouteProvider.setPersistentStates('stateField');
      ViewBindingsProvider.bind('viewA', {
        controller: 'StateVariationActrl',
        templateUrl: 'stateVariationA.html',
        requiredState: ['stateField']
      });
    });

    mockTemplateRequest('stateVariationA.html', '<div id="contents"></div>');
    mockLocationSuccess();

    inject(function($compile, $httpBackend, State) {
      State.set('stateField', 'some value');

      let element = createView('viewA');
      triggerOpeningAnimationCompleteCallbacks();
      deliverMainTemplate();

      State.unset('stateField');
      triggerStateChangeEventConslidationTimeout();
      triggerOpeningAnimationCompleteCallbacks();

      expect(destroyCalledCounter, 'destroyCalledCounter count').toBe(1);
    });
  });

  it('will switch between different bindings for the same view when watched/required state changes', function() {
    const stateAController = jasmine.createSpy('stateAController');
    const stateBController = jasmine.createSpy('stateBController');

    const viewAstateVariationA = {
      name: 'viewAstateVariationA',
      controller: 'StateVariationActrl',
      templateUrl: 'stateVariationA.html',
      requiredState: ['stateFieldA']
    };

    const viewAstateVariationB = {
      name: 'viewAstateVariationB',
      controller: 'StateVariationBctrl',
      templateUrl: 'stateVariationB.html',
      requiredState: ['stateFieldB']
    };

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      $controllerProvider.register('StateVariationActrl', ['$scope', stateAController]);
      $controllerProvider.register('StateVariationBctrl', ['$scope', stateBController]);
      RouteProvider.setPersistentStates('stateFieldA');
      ViewBindingsProvider.bind('viewA', [viewAstateVariationA, viewAstateVariationB]);
    });

    mockTemplateRequest('stateVariationA.html', '<div id="contentsA"></div>');
    mockTemplateRequest('stateVariationB.html', '<div id="contentsB"></div>');

    mockLocationSuccess();

    inject(function(State) {
      State.set('stateFieldA', 'some value');
      const element = createView('viewA');
      triggerOpeningAnimationCompleteCallbacks();
      deliverMainTemplate();

      expect(stateAController, 'before: stateAController should be called').toHaveBeenCalled();
      expect(stateBController, 'before: stateBController should not be called').not.toHaveBeenCalled();
      expect(element.find('#contentsA').length, 'before: #contentsA count').toBe(1);
      expect(element.find('#contentsB').length, 'before: #contentsB count').toBe(0);

      triggerPendingViewCounterDecreaseTimeout();

      State.unset('stateFieldA');
      State.set('stateFieldB', 'some value');

      triggerStateChangeEventConslidationTimeout();
      deliverMainTemplate();

      expect(stateBController, 'after: stateBController should be called').toHaveBeenCalled();
      expect(element.find('#contentsA').length, 'after: #contentsA count').toBe(0);
      expect(element.find('#contentsB').length, 'after: #contentsB count').toBe(1);
    });
  });

  it('should not rebuild the current binding if state for other bindings change, but the state for the current' +
     ' one remains the same', function() {

    const stateAController = jasmine.createSpy('stateAController');

    const viewAstateVariationA = {
      name: 'viewAstateVariationA',
      controller: 'StateVariationActrl',
      templateUrl: 'stateVariationA.html',
      requiredState: ['stateFieldA']
    };

    const viewAstateVariationB = {
      name: 'viewAstateVariationB',
      templateUrl: 'stateVariationB.html',
      requiredState: ['stateFieldB', 'zzz']
    };

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      $controllerProvider.register('StateVariationActrl', ['$scope', stateAController]);
      RouteProvider.setPersistentStates('stateFieldA');
      ViewBindingsProvider.bind('viewA', [viewAstateVariationA, viewAstateVariationB]);
    });

    mockTemplateRequest('stateVariationA.html', '<div id="contentsA"></div>');
    mockLocationSuccess();

    inject(function(State) {
      State.set('stateFieldA', 'some value');

      createView('viewA');
      triggerOpeningAnimationCompleteCallbacks();
      deliverMainTemplate();

      expect(stateAController, 'before: stateAController should be called').toHaveBeenCalled();
      stateAController.calls.reset();

      State.set('stateFieldB', 'some value');
      triggerStateChangeEventConslidationTimeout();

      expect(stateAController, 'before: stateAController should not be called').not.toHaveBeenCalled();
    });
  });

  it('caches the template so that it is not requested more than once', function() {
    const controller = jasmine.createSpy();

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      $controllerProvider.register('StateVariationActrl', ['$scope', controller]);

      ViewBindingsProvider.bind('viewA', {
        controller: 'StateVariationActrl',
        templateUrl: 'stateVariationA.html'
      });

    });

    const templateContents = '<div>state variation A template</div>';
    mockTemplateRequest('stateVariationA.html', templateContents);
    mockLocationSuccess();

    inject(function($templateCache, $httpBackend) {
      createView('viewA');
      triggerOpeningAnimationCompleteCallbacks();
      deliverMainTemplate();

      createView('viewA');
      triggerOpeningAnimationCompleteCallbacks();
      triggerDeliveryOfCachedTemplate();
      $httpBackend.verifyNoOutstandingRequest();

      expect($templateCache.get('stateVariationA.html'), '$templateCache contents').toBe(templateContents);
      expect(controller.calls.count(), 'calls count').toBe(2);
    });
  });

  it('handles nested views', function() {
    const viewActrl = jasmine.createSpy('viewActrl');
    const viewBctrl = jasmine.createSpy('viewBctrl');

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      $controllerProvider.register('ViewActrl', ['$scope', viewActrl]);
      $controllerProvider.register('ViewBctrl', ['$scope', viewBctrl]);

      ViewBindingsProvider.bind('viewA', {
        controller: 'ViewActrl',
        templateUrl: 'viewA.html'
      });

      ViewBindingsProvider.bind('viewB', {
        controller: 'ViewBctrl',
        templateUrl: 'viewB.html'
      });
    });

    mockLocationSuccess();
    mockTemplateRequest('viewA.html', '<div>view A template <view name="viewB"></view></div>');
    mockTemplateRequest('viewB.html', '<div id="viewB">view B template</div>');

    let element = createView('viewA');

    // for viewA
    triggerOpeningAnimationCompleteCallbacks();
    deliverMainTemplate();
    // for viewB
    triggerOpeningAnimationCompleteCallbacks();
    deliverMainTemplate();

    expect(viewActrl, 'viewActrl should be called').toHaveBeenCalled();
    expect(viewBctrl, 'viewBctrl should be called').toHaveBeenCalled();
    expect(element.find('#viewB').length, '#viewB count').toEqual(1);
  });

  it('resolves promises and injects them into the controller', function() {
    let deferred = undefined;
    let viewActrl = jasmine.createSpy('viewActrl');

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $controllerProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      $controllerProvider.register('ViewActrl', ['$scope', 'PromisedDependency', viewActrl]);

      ViewBindingsProvider.bind('viewA', {
        controller: 'ViewActrl',
        templateUrl: 'viewA.html',
        resolve: {
          PromisedDependency($q) {
            deferred = $q.defer();
            return deferred.promise;
          }
        }
      });

    });

    mockLocationSuccess();
    mockTemplateRequest('viewA.html', 'view A template');

    inject(function($rootScope) {
      createView('viewA');
      triggerOpeningAnimationCompleteCallbacks();
      deliverMainTemplate();

      expect(viewActrl, 'viewActrl should not be called').not.toHaveBeenCalled();
      let mockedDependency = 'mockedDependency';
      deferred.resolve(mockedDependency);
      $rootScope.$digest();

      expect(viewActrl, 'viewActrl should be called').toHaveBeenCalled();
      // check second argument (1) for the first call (0) of the controller is the PromisedDependency.
      // The reason it's the second argument is because that's the order of the dependencies defined
      // above when controller was registered ($scope is the first)
      expect(viewActrl.calls.argsFor(0)[1], 'viewActrl calls args').toBe(mockedDependency);
    });
  });

  it('should show the resolvingTemplateUrl until resolving is completed', function() {
    let deferred = undefined;

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      ViewBindingsProvider.bind('viewA', {
        templateUrl: 'viewA.html',
        resolvingTemplateUrl: 'resolving.html',
        resolve: {
          PromisedDependency($q) {
            deferred = $q.defer();
            return deferred.promise;
          }
        }
      });
    });

    mockTemplateRequest('viewA.html', '<div>view A template</div>');
    mockTemplateRequest('resolving.html', '<div>resolving template</div>');
    mockLocationSuccess();

    inject(function($rootScope) {
      const element = createView('viewA');

      deliverResolvingTemplate();
      triggerOpeningAnimationCompleteCallbacks();
      expect(element.text(), 'before: element.text()').toBe('resolving template');

      deferred.resolve('mockedDependency');
      $rootScope.$digest();

      deliverMainTemplate();
      triggerResolvingTemplateDelayTimeout();
      expect(element.text(), 'after: element.text()').toBe('view A template');
    });
  });

  it('should show the resolvingErrorTemplateUrl if any of the promises are rejected', function() {
    let deferred = undefined;

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      ViewBindingsProvider.bind('viewA', {
        templateUrl: 'viewA.html',
        resolvingTemplateUrl: 'resolving.html',
        resolvingErrorTemplateUrl: 'error.html',
        resolve: {
          PromisedDependency($q) {
            deferred = $q.defer();
            return deferred.promise;
          }
        }
      });

    });

    mockTemplateRequest('viewA.html', '<div>view A template</div>');
    mockTemplateRequest('error.html', '<div>error template</div>');
    mockTemplateRequest('resolving.html', '<div>resolving template</div>');
    mockLocationSuccess();

    const element = createView('viewA');

    deliverResolvingTemplate();
    triggerResolvingTemplateDelayTimeout();
    triggerOpeningAnimationCompleteCallbacks();
    expect(element.text(), 'before: element.text()').toBe('resolving template');

    deferred.reject();
    deliverErrorTemplate();

    expect(element.text(), 'after: element.text()').toBe('error template');
  });

  it('should show the resolvingErrorTemplateUrl if any of the resolve functions throw an error', function() {
    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      ViewBindingsProvider.bind('viewA', {
        templateUrl: 'viewA.html',
        resolvingTemplateUrl: 'resolving.html',
        resolvingErrorTemplateUrl: 'error.html',
        resolve: {
          PromisedDependency() { throw new Error('nope!'); }
        }
      });
    });

    mockTemplateRequest('viewA.html', '<div>view A template</div>');
    mockTemplateRequest('error.html', '<div>error template</div>');
    mockTemplateRequest('resolving.html', '<div>resolving template</div>');
    mockLocationSuccess();

    const element = createView('viewA');

    deliverResolvingTemplate();
    triggerResolvingTemplateDelayTimeout();
    triggerOpeningAnimationCompleteCallbacks();
    expect(element.text(), 'before: element.text()').toBe('resolving template');

    deliverErrorTemplate();

    expect(element.text(), 'after: element.text()').toBe('error template');
  });

  it('should show the resolvingErrorComponent if any of the promises are rejected', function() {
    let deferred = undefined;
    let error = new Error('nope');
    let controller = jasmine.createSpy('error component controller');

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $compileProvider) {
      $compileProvider.component('myResolvingErrorComponent', {controller: ['error', controller], templateUrl: 'resolvingErrorTemplate.html'});

      RouteProvider.registerUrl('/fake_initial_url');
      ViewBindingsProvider.bind('viewA', {
        templateUrl: 'viewA.html',
        resolvingTemplateUrl: 'resolving.html',
        resolvingErrorComponent: 'myResolvingErrorComponent',
        resolve: {
          PromisedDependency($q) {
            deferred = $q.defer();
            return deferred.promise;
          }
        }
      });
    });

    mockTemplateRequest('viewA.html', '<div>view A template</div>');
    mockTemplateRequest('resolvingErrorTemplate.html', '<div>error template</div>');
    mockTemplateRequest('resolving.html', '<div>resolving template</div>');
    mockLocationSuccess();

    const element = createView('viewA');

    deliverResolvingTemplate();
    triggerResolvingTemplateDelayTimeout();
    triggerOpeningAnimationCompleteCallbacks();
    expect(element.text(), 'before: element.text()').toBe('resolving template');

    deferred.reject(error);
    deliverErrorTemplate();

    expect(controller, 'controller toHaveBeenCalledWith').toHaveBeenCalledWith(error);
    expect(element.text(), 'after: element.text()').toBe('error template');
  });


  it("should show the errorTemplateUrl if the view's controller throws an error when instantiated", function() {
    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $compileProvider) {
      let controller = function() { throw new Error('oopsy'); };

      $compileProvider.component('myComponent', {controller, templateUrl: 'viewA.html'});
      RouteProvider.registerUrl('/fake_initial_url');
      ViewBindingsProvider.bind('viewA', {
        component: 'myComponent',
        errorTemplateUrl: 'error.html'
      });

    });

    mockTemplateRequest('viewA.html', '<div>view A template</div>');
    mockTemplateRequest('error.html', '<div>error template</div>');
    mockLocationSuccess();

    let element = createView('viewA');
    triggerOpeningAnimationCompleteCallbacks();
    deliverErrorTemplate();

    expect(element.text()).toBe('error template');
  });

  it("should show the error component if the view's controller throws an error when instantiated", function() {
    let myErrorComponentController = jasmine.createSpy();
    let error = new Error('oopsy');

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider, $compileProvider) {
      const myComponentController = function() { throw error; };

      $compileProvider.component('myComponent', {controller: myComponentController, templateUrl: 'viewA.html'});
      $compileProvider.component('myErrorComponent', {controller: ['error', myErrorComponentController], templateUrl: 'error.html'});

      RouteProvider.registerUrl('/fake_initial_url');
      ViewBindingsProvider.bind('viewA', {
        component: 'myComponent',
        errorComponent: 'myErrorComponent'
      });
    });

    mockTemplateRequest('viewA.html', '<div>view A template</div>');
    mockTemplateRequest('error.html', '<div>error template</div>');
    mockLocationSuccess();

    const element = createView('viewA');
    triggerOpeningAnimationCompleteCallbacks();
    deliverErrorTemplate();

    expect(myErrorComponentController, 'myErrorComponentController toHaveBeenCalledWith').toHaveBeenCalledWith(error);
    expect(element.text(), 'element.text()').toBe('error template');
  });

  it('increases the global pending view counter when it is created', function() {
    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      ViewBindingsProvider.bind('viewA', {templateUrl: 'viewA.html'});
    });

    mockTemplateRequest('viewA.html', 'view A template');
    mockLocationSuccess();

    inject(function($rootScope, $compile, $httpBackend, $animate, PendingViewCounter) {
      spyOn(PendingViewCounter, 'increase');

      createView('viewA');
      triggerOpeningAnimationCompleteCallbacks();
      deliverMainTemplate();
      expect(PendingViewCounter.increase).toHaveBeenCalled();
    });
  });

  it('decreases the global pending view counter after it has resolved all data and rendered the template', function() {
    let deferred = undefined;

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      ViewBindingsProvider.bind('viewA', {
        templateUrl: 'viewA.html',
        resolvingTemplateUrl: 'resolving.html',
        resolve: {
          PromisedDependency($q) {
            deferred = $q.defer();
            return deferred.promise;
          }
        }
      });
    });

    mockTemplateRequest('viewA.html', '<div>view A template</div>');
    mockTemplateRequest('resolving.html', '<div>resolving template</div>');
    mockLocationSuccess();

    inject(function($rootScope, $compile, $httpBackend, $animate, $timeout, PendingViewCounter) {
      triggerInitialModuleLoad();

      const element = createView('viewA');

      deliverResolvingTemplate();
      triggerOpeningAnimationCompleteCallbacks();

      expect(PendingViewCounter.get(), 'before: PendingViewCounter.get()').toBe(1);
      expect(element.text(), 'element.text()').toBe('resolving template');

      deliverMainTemplate();
      triggerResolvingTemplateDelayTimeout();

      deferred.resolve('mockedDependency');
      $rootScope.$digest();

      triggerPendingViewCounterDecreaseTimeout();
      expect(PendingViewCounter.get(), 'after: PendingViewCounter.get()').toBe(0);
    });
  });

  it('does not decrease the global pending view counter after it has resolved all data and rendered the template' +
     ' if the manualCompletion flag is set', function() {

    let deferred = undefined;

    window.angular.mock.module(function(RouteProvider, ViewBindingsProvider) {
      RouteProvider.registerUrl('/fake_initial_url');
      ViewBindingsProvider.bind('viewA', {
        templateUrl: 'viewA.html',
        resolvingTemplateUrl: 'resolving.html',
        manualCompletion: true,
        resolve: {
          PromisedDependency($q) {
            deferred = $q.defer();
            return deferred.promise;
          }
        }
      });

    });

    mockTemplateRequest('viewA.html', '<div>view A template</div>');
    mockTemplateRequest('resolving.html', '<div>resolving template</div>');
    mockLocationSuccess();

    inject(function($rootScope, $compile, $httpBackend, $animate, $timeout, PendingViewCounter) {
      triggerInitialModuleLoad();

      const element = createView('viewA');

      deliverResolvingTemplate();
      triggerOpeningAnimationCompleteCallbacks();

      expect(PendingViewCounter.get(), 'before: PendingViewCounter.get()').toBe(1);
      expect(element.text(), 'element.text()').toBe('resolving template');

      deliverMainTemplate();
      triggerResolvingTemplateDelayTimeout();

      deferred.resolve('mockedDependency');
      $rootScope.$digest();

      triggerPendingViewCounterDecreaseTimeout();
      expect(PendingViewCounter.get(), 'after: PendingViewCounter.get()').toBe(1);
    });
  });


  function mockTemplateRequest(path, template) {
    inject(function($httpBackend) {
      $httpBackend.when('GET', path).respond(template);
    });
  }

  const createView = function(name, digest) {
    if (digest == null) { digest = true; }
    let element = undefined;

    inject(function($rootScope, $compile) {
      let scope = $rootScope.$new();
      element = $compile(`<view name='${name}'></view>`)(scope);
      if (digest) { return $rootScope.$digest(); }
    });

    return element;
  };

  function mockLocationNotReady() {
    inject(function(Route) {
      spyOn(Route, 'whenReady').and.callFake(function () {
        let queryDeferred = undefined;
        inject($q => queryDeferred = $q.defer());
        return queryDeferred.promise;
      });
    });
  }

  function mockLocationSuccess() {
    inject(function($location, $rootScope) {
      $rootScope.$broadcast('$locationChangeSuccess', 'fake_initial_url');
    });
  }

  const deliverResolvingTemplate = () => inject($httpBackend => $httpBackend.flush());

  const deliverErrorTemplate = () => inject($httpBackend => $httpBackend.flush());

  const deliverMainTemplate = () => inject($httpBackend => $httpBackend.flush());

  const triggerDeliveryOfCachedTemplate = () => inject($rootScope => $rootScope.$digest());

  const triggerResolvingTemplateDelayTimeout = () => inject($timeout => $timeout.flush());

  const triggerPendingViewCounterDecreaseTimeout = () => inject($timeout => $timeout.flush());

  // Make sure the $locationChangeSuccess event handler gets called, resetting the PendingViewCount etc
  const triggerInitialModuleLoad = () => inject($rootScope => $rootScope.$digest());

  // Flush the timeout that exists to make sure that all state data changes have come in before triggering the creation
  // of the view
  const triggerStateChangeEventConslidationTimeout = () => inject($timeout => $timeout.flush());

  // The code waits for the animations to run, so we need to trigger the callbacks to pretend that they have run
  function triggerOpeningAnimationCompleteCallbacks() {
    inject(function ($animate, $rootScope) {
      $rootScope.$digest();
      return $animate.flush();
    });
  }
});
