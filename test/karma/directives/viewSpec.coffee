describe 'View directive', ->

  beforeEach ->
    window.angular.mock.module 'bicker_router'
    window.angular.mock.module 'ngAnimateMock'

  it 'should not load view or controller until state has been checked', ->
    controller = jasmine.createSpy()

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      RouteProvider.registerUrl '/fake_initial_url', state: stateField: true
      $controllerProvider.register 'StateVariationActrl', ['$scope', controller]

      ViewBindingsProvider.bind 'viewA', [
        controller: 'StateVariationActrl'
        templateUrl: 'stateVariationA.html'
        requiredState: ['stateField']
      ,
        controller: 'StateVariationBctrl'
        templateUrl: 'stateVariationB.html'
      ]

      return

      mockLocationNotReady()
      mockTemplateRequest 'stateVariationA.html', 'state variation A template'

      inject ($rootScope, $httpBackend) ->
        element = createView 'viewA'
        triggerOpeningAnimationCompleteCallbacks()

        $rootScope.$digest() # resolve the empty resolving template promise
        $httpBackend.verifyNoOutstandingRequest()

      expect(controller).not.toHaveBeenCalled()
      expect(element.find('#contents').length).toBe 0

  it 'binds a view to the associated template and controller when no required state and URL has been set', ->
    controller = jasmine.createSpy()

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      $controllerProvider.register 'StateVariationActrl', ['$scope', controller]

      ViewBindingsProvider.bind 'viewA', {
        controller: 'StateVariationActrl'
        templateUrl: 'stateVariationA.html'
      }

      return

    mockLocationSuccess()
    mockTemplateRequest 'stateVariationA.html', 'state variation A template'

    createView 'viewA'
    triggerOpeningAnimationCompleteCallbacks()
    deliverMainTemplate()

    expect(controller).toHaveBeenCalled()

  it 'can use a component in place of the controller and templateUrl', ->
    controller = jasmine.createSpy()

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $compileProvider) ->
      $compileProvider.component('myComponent', controller: controller, templateUrl: 'stateVariationA.html')
      ViewBindingsProvider.bind 'viewA', component: 'myComponent'

      return

    mockLocationSuccess()
    mockTemplateRequest 'stateVariationA.html', 'state variation A template'

    createView 'viewA'
    triggerOpeningAnimationCompleteCallbacks()
    deliverMainTemplate()

    expect(controller).toHaveBeenCalled()

  it 'should assign the controller to scope.$ctrl', ->
    controller = ->
      this.testing = 1234

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $compileProvider) ->
      $compileProvider.component('myComponent', controller: controller, templateUrl: 'stateVariationA.html')
      ViewBindingsProvider.bind 'viewA', component: 'myComponent'

      return

    mockLocationSuccess()
    mockTemplateRequest 'stateVariationA.html', '<div>{{$ctrl.testing}}</div>'

    element = createView 'viewA'
    triggerOpeningAnimationCompleteCallbacks()
    deliverMainTemplate()

    expect(element.text()).toEqual('1234')

  it 'should allow users to specify the name of the property on scope where the controller will be found via controllerAs', ->
    controller = ->
      this.testing = 1234

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $compileProvider) ->
      $compileProvider.component('myComponent', controller: controller, controllerAs: 'boop', templateUrl: 'stateVariationA.html')
      ViewBindingsProvider.bind 'viewA', component: 'myComponent'

      return

    mockLocationSuccess()
    mockTemplateRequest 'stateVariationA.html', '<div>{{boop.testing}}</div>'

    element = createView 'viewA'
    triggerOpeningAnimationCompleteCallbacks()
    deliverMainTemplate()

    expect(element.text()).toEqual('1234')

  it 'only binds a view if the required state data matches up to the state of the current page', ->
    controller = jasmine.createSpy()

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      $controllerProvider.register 'StateVariationActrl', ['$scope', controller]

      ViewBindingsProvider.bind 'viewA', {
        controller: 'StateVariationActrl'
        templateUrl: 'stateVariationA.html'
        requiredState: ['stateField']
      }

      return

    mockLocationSuccess()
    mockTemplateRequest 'stateVariationA.html', '<div id="contents"></div>'

    inject ($rootScope, $httpBackend, State) ->
      element = createView 'viewA'
      $httpBackend.verifyNoOutstandingRequest()

      expect(controller).not.toHaveBeenCalled()
      expect(element.find('#contents').length).toBe 0

      State.set 'stateField', 'some value'

      element = createView 'viewA'
      triggerOpeningAnimationCompleteCallbacks()
      deliverMainTemplate()

      expect(controller).toHaveBeenCalled()
      expect(element.find('#contents').length).toBe 1

  it 'will not bind a view if the canActivate function returns false', ->
    controllerA = jasmine.createSpy('controllerA')
    controllerB = jasmine.createSpy('controllerB')

    window.angular.mock.module (RouteProvider, ViewBindingsProvider) ->
      ViewBindingsProvider.bind 'viewA', [
        {
          controller: controllerA
          templateUrl: 'stateVariationA.html'
          canActivate: () ->
            return false
        },
        {
          controller: controllerB
          templateUrl: 'stateVariationB.html'
          canActivate: () ->
            return true
        }
      ]

      return

    mockLocationSuccess()
    mockTemplateRequest 'stateVariationB.html', 'state variation B template'

    createView 'viewA'
    triggerOpeningAnimationCompleteCallbacks()
    deliverMainTemplate()

    expect(controllerA).not.toHaveBeenCalled()
    expect(controllerB).toHaveBeenCalled()

  it 'binds the view if the required state becomes available after the containing template is processed', ->
    controller = jasmine.createSpy()

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      $controllerProvider.register 'StateVariationActrl', ['$scope', controller]

      ViewBindingsProvider.bind 'viewA', {
        controller: 'StateVariationActrl'
        templateUrl: 'stateVariationA.html'
        requiredState: ['stateField']
      }

      return

    mockLocationSuccess()
    mockTemplateRequest 'stateVariationA.html', '<div id="contents"></div>'

    inject ($httpBackend, State) ->
      element = createView 'viewA'
      $httpBackend.verifyNoOutstandingRequest()

      expect(controller).not.toHaveBeenCalled()
      expect(element.find('#contents').length).toBe 0

      State.set 'stateField', 'some value???'

      triggerStateChangeEventConslidationTimeout()
      triggerOpeningAnimationCompleteCallbacks()
      deliverMainTemplate()

      expect(controller).toHaveBeenCalled()
      expect(element.find('#contents').length).toBe 1

  it 'unbinds the view if the required state is removed after the containing template is processed', ->
    controller = jasmine.createSpy()

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      $controllerProvider.register 'StateVariationActrl', ['$scope', controller]
      RouteProvider.setPersistentStates 'stateField'
      ViewBindingsProvider.bind 'viewA', {
        controller: 'StateVariationActrl'
        templateUrl: 'stateVariationA.html'
        requiredState: ['stateField']
      }

      return

    mockTemplateRequest 'stateVariationA.html', '<div id="contents"></div>'
    mockLocationSuccess()

    inject ($compile, $httpBackend, State) ->
      State.set 'stateField', 'some value'

      element = createView 'viewA'
      triggerOpeningAnimationCompleteCallbacks()
      deliverMainTemplate()

      expect(controller).toHaveBeenCalled()
      expect(element.find('#contents').length).toBe 1

      State.unset 'stateField'
      triggerStateChangeEventConslidationTimeout()
      triggerOpeningAnimationCompleteCallbacks()

      expect(element.find('#contents').length).toBe 0

  it 'will switch between different bindings for the same view when watched/required state changes', ->
    stateAController = jasmine.createSpy 'stateAController'
    stateBController = jasmine.createSpy 'stateBController'

    viewAstateVariationA =
      name: 'viewAstateVariationA'
      controller: 'StateVariationActrl'
      templateUrl: 'stateVariationA.html'
      requiredState: ['stateFieldA']

    viewAstateVariationB =
      name: 'viewAstateVariationB'
      controller: 'StateVariationBctrl'
      templateUrl: 'stateVariationB.html'
      requiredState: ['stateFieldB']

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      $controllerProvider.register 'StateVariationActrl', ['$scope', stateAController]
      $controllerProvider.register 'StateVariationBctrl', ['$scope', stateBController]
      RouteProvider.setPersistentStates 'stateFieldA'
      ViewBindingsProvider.bind 'viewA', [viewAstateVariationA, viewAstateVariationB]

      return

    mockTemplateRequest 'stateVariationA.html', '<div id="contentsA"></div>'
    mockTemplateRequest 'stateVariationB.html', '<div id="contentsB"></div>'

    mockLocationSuccess()

    inject (State) ->
      State.set 'stateFieldA', 'some value'
      element = createView 'viewA'
      triggerOpeningAnimationCompleteCallbacks()
      deliverMainTemplate()

      expect(stateAController).toHaveBeenCalled()
      expect(stateBController).not.toHaveBeenCalled()
      expect(element.find('#contentsA').length).toBe 1
      expect(element.find('#contentsB').length).toBe 0

      triggerPendingViewCounterDecreaseTimeout()

      State.unset 'stateFieldA'
      State.set 'stateFieldB', 'some value'

      triggerStateChangeEventConslidationTimeout()
      deliverMainTemplate()

      expect(stateBController).toHaveBeenCalled()
      expect(element.find('#contentsA').length).toBe 0
      expect(element.find('#contentsB').length).toBe 1

  it 'should not rebuild the current binding if state for other bindings change, but the state for the current' +
     ' one remains the same', ->

    stateAController = jasmine.createSpy 'stateAController'

    viewAstateVariationA =
      name: 'viewAstateVariationA'
      controller: 'StateVariationActrl'
      templateUrl: 'stateVariationA.html'
      requiredState: ['stateFieldA']

    viewAstateVariationB =
      name: 'viewAstateVariationB'
      templateUrl: 'stateVariationB.html'
      requiredState: ['stateFieldB', 'zzz']

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      $controllerProvider.register 'StateVariationActrl', ['$scope', stateAController]
      RouteProvider.setPersistentStates 'stateFieldA'
      ViewBindingsProvider.bind 'viewA', [viewAstateVariationA, viewAstateVariationB]

      return

    mockTemplateRequest 'stateVariationA.html', '<div id="contentsA"></div>'
    mockLocationSuccess()

    inject (State, $rootScope) ->
      State.set 'stateFieldA', 'some value'

      createView 'viewA'
      triggerOpeningAnimationCompleteCallbacks()
      deliverMainTemplate()

      expect(stateAController).toHaveBeenCalled()
      stateAController.calls.reset()

      State.set 'stateFieldB', 'some value'
      triggerStateChangeEventConslidationTimeout()

      expect(stateAController).not.toHaveBeenCalled()

  it 'caches the template so that it is not requested more than once', ->
    controller = jasmine.createSpy()

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      $controllerProvider.register 'StateVariationActrl', ['$scope', controller]

      ViewBindingsProvider.bind 'viewA', {
        controller: 'StateVariationActrl'
        templateUrl: 'stateVariationA.html'
      }

      return

    templateContents = 'state variation A template'
    mockTemplateRequest 'stateVariationA.html', templateContents
    mockLocationSuccess()

    inject ($templateCache, $httpBackend) ->
      createView 'viewA'
      triggerOpeningAnimationCompleteCallbacks()
      deliverMainTemplate()

      createView 'viewA'
      triggerOpeningAnimationCompleteCallbacks()
      triggerDeliveryOfCachedTemplate()
      $httpBackend.verifyNoOutstandingRequest()

      expect($templateCache.get 'stateVariationA.html').toBe templateContents
      expect(controller.calls.count()).toBe 2

  it 'handles nested views', ->
    viewActrl = jasmine.createSpy 'viewActrl'
    viewBctrl = jasmine.createSpy 'viewBctrl'

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      $controllerProvider.register 'ViewActrl', ['$scope', viewActrl]
      $controllerProvider.register 'ViewBctrl', ['$scope', viewBctrl]

      ViewBindingsProvider.bind 'viewA', {
        controller: 'ViewActrl'
        templateUrl: 'viewA.html'
      }

      ViewBindingsProvider.bind 'viewB', {
        controller: 'ViewBctrl',
        templateUrl: 'viewB.html'
      }

      return

    mockLocationSuccess()
    mockTemplateRequest 'viewA.html', 'view A template <view name="viewB"></view>'
    mockTemplateRequest 'viewB.html', '<div id="viewB">view B template</div>'

    element = createView 'viewA'

    # for viewA
    triggerOpeningAnimationCompleteCallbacks()
    deliverMainTemplate()
    # for viewB
    triggerOpeningAnimationCompleteCallbacks()
    deliverMainTemplate()

    expect(viewActrl).toHaveBeenCalled()
    expect(viewBctrl).toHaveBeenCalled()
    expect(element.find('#viewB').length).toEqual 1

  it 'resolves promises and injects them into the controller', ->
    deferred = undefined
    viewActrl = jasmine.createSpy 'viewActrl'

    window.angular.mock.module (RouteProvider, ViewBindingsProvider, $controllerProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      $controllerProvider.register 'ViewActrl', ['$scope', 'PromisedDependency', viewActrl]

      ViewBindingsProvider.bind 'viewA', {
        controller: 'ViewActrl',
        templateUrl: 'viewA.html'
        resolve:
          PromisedDependency: ($q) ->
            deferred = $q.defer()
            deferred.promise
      }

      return

    mockLocationSuccess()
    mockTemplateRequest 'viewA.html', 'view A template'

    inject ($rootScope) ->
      createView 'viewA'
      triggerOpeningAnimationCompleteCallbacks()
      deliverMainTemplate()

      expect(viewActrl).not.toHaveBeenCalled()
      mockedDependency = 'mockedDependency'
      deferred.resolve mockedDependency
      $rootScope.$digest()

      expect(viewActrl).toHaveBeenCalled()
      # check second argument (1) for the first call (0) of the controller is the PromisedDependency.
      # The reason it's the second argument is because that's the order of the dependencies defined
      # above when controller was registered ($scope is the first)
      expect(viewActrl.calls.argsFor(0)[1]).toBe mockedDependency

  it 'should show the resolvingTemplateUrl until resolving is completed', ->
    deferred = undefined

    window.angular.mock.module (RouteProvider, ViewBindingsProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      ViewBindingsProvider.bind 'viewA', {
        templateUrl: 'viewA.html'
        resolvingTemplateUrl: 'resolving.html'
        resolve:
          PromisedDependency: ($q) ->
            deferred = $q.defer()
            deferred.promise
      }

      return

    mockTemplateRequest 'viewA.html', 'view A template'
    mockTemplateRequest 'resolving.html', 'resolving template'
    mockLocationSuccess()

    inject ($rootScope) ->
      element = createView 'viewA'

      deliverResolvingTemplate()
      triggerOpeningAnimationCompleteCallbacks()
      expect(element.text()).toBe 'resolving template'

      deferred.resolve 'mockedDependency'
      $rootScope.$digest()

      deliverMainTemplate()
      triggerResolvingTemplateDelayTimeout()
      expect(element.text()).toBe 'view A template'

  it 'should show the resolvingErrorTemplateUrl if any of the promises is rejected', ->
    deferred = undefined

    window.angular.mock.module (RouteProvider, ViewBindingsProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      ViewBindingsProvider.bind 'viewA', {
        templateUrl: 'viewA.html'
        resolvingTemplateUrl: 'resolving.html'
        resolvingErrorTemplateUrl: 'error.html'
        resolve:
          PromisedDependency: ($q) ->
            deferred = $q.defer()
            deferred.promise
      }

      return

    mockTemplateRequest 'viewA.html', 'view A template'
    mockTemplateRequest 'error.html', 'error template'
    mockTemplateRequest 'resolving.html', 'resolving template'
    mockLocationSuccess()

    element = createView 'viewA'

    deliverResolvingTemplate()
    triggerResolvingTemplateDelayTimeout()
    triggerOpeningAnimationCompleteCallbacks()
    expect(element.text()).toBe 'resolving template'

    deferred.reject()
    deliverErrorTemplate()

    expect(element.text()).toBe 'error template'

  it 'increases the global pending view counter when it is created', ->
    window.angular.mock.module (RouteProvider, ViewBindingsProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      ViewBindingsProvider.bind 'viewA', templateUrl: 'viewA.html'
      return

    mockTemplateRequest 'viewA.html', 'view A template'
    mockLocationSuccess()

    inject ($rootScope, $compile, $httpBackend, $animate, PendingViewCounter) ->
      spyOn PendingViewCounter, 'increase'

      createView 'viewA'
      triggerOpeningAnimationCompleteCallbacks()
      deliverMainTemplate()
      expect(PendingViewCounter.increase).toHaveBeenCalled()

  it 'decreases the global pending view counter after it has resolved all data and rendered the template', ->
    deferred = undefined

    window.angular.mock.module (RouteProvider, ViewBindingsProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      ViewBindingsProvider.bind 'viewA', {
        templateUrl: 'viewA.html'
        resolvingTemplateUrl: 'resolving.html'
        resolve:
          PromisedDependency: ($q) ->
            deferred = $q.defer()
            deferred.promise
      }

      return

    mockTemplateRequest 'viewA.html', 'view A template'
    mockTemplateRequest 'resolving.html', 'resolving template'
    mockLocationSuccess()

    inject ($rootScope, $compile, $httpBackend, $animate, $timeout, PendingViewCounter) ->
      triggerInitialModuleLoad()

      element = createView 'viewA'

      deliverResolvingTemplate()
      triggerOpeningAnimationCompleteCallbacks()

      expect(PendingViewCounter.get()).toBe 1
      expect(element.text()).toBe 'resolving template'

      deliverMainTemplate()
      triggerResolvingTemplateDelayTimeout()

      deferred.resolve 'mockedDependency'
      $rootScope.$digest()

      triggerPendingViewCounterDecreaseTimeout()
      expect(PendingViewCounter.get()).toBe 0

  it 'does not decrease the global pending view counter after it has resolved all data and rendered the template' +
     ' if the manualCompletion flag is set', ->

    deferred = undefined

    window.angular.mock.module (RouteProvider, ViewBindingsProvider) ->
      RouteProvider.registerUrl '/fake_initial_url'
      ViewBindingsProvider.bind 'viewA', {
        templateUrl: 'viewA.html'
        resolvingTemplateUrl: 'resolving.html'
        manualCompletion: true
        resolve:
          PromisedDependency: ($q) ->
            deferred = $q.defer()
            deferred.promise
      }

      return

    mockTemplateRequest 'viewA.html', 'view A template'
    mockTemplateRequest 'resolving.html', 'resolving template'
    mockLocationSuccess()

    inject ($rootScope, $compile, $httpBackend, $animate, $timeout, PendingViewCounter) ->
      triggerInitialModuleLoad()

      element = createView 'viewA'

      deliverResolvingTemplate()
      triggerOpeningAnimationCompleteCallbacks()

      expect(PendingViewCounter.get()).toBe 1
      expect(element.text()).toBe 'resolving template'

      deliverMainTemplate()
      triggerResolvingTemplateDelayTimeout()

      deferred.resolve 'mockedDependency'
      $rootScope.$digest()

      triggerPendingViewCounterDecreaseTimeout()
      expect(PendingViewCounter.get()).toBe 1

  mockTemplateRequest = (path, template) ->
    inject ($httpBackend) ->
      $httpBackend.when('GET', path).respond template

  createView = (name, digest = true) ->
    element = undefined

    inject ($rootScope, $compile) ->
      scope = $rootScope.$new()
      element = $compile("<view name='#{name}'></view>")(scope)
      $rootScope.$digest() if digest

    element

  mockLocationNotReady = ->
    inject (Route) ->
      spyOn(Route, 'whenReady').and.callFake ->
        queryDeferred = undefined
        inject ($q) ->
          queryDeferred = $q.defer()
        queryDeferred.promise

  mockLocationSuccess = ->
    inject ($location, $rootScope) ->
      $rootScope.$broadcast '$locationChangeSuccess', 'fake_initial_url'

  deliverResolvingTemplate = ->
    inject ($httpBackend) -> $httpBackend.flush()

  deliverErrorTemplate = ->
    inject ($httpBackend) -> $httpBackend.flush()

  deliverMainTemplate = ->
    inject ($httpBackend) -> $httpBackend.flush()

  triggerDeliveryOfCachedTemplate = ->
    inject ($rootScope) -> $rootScope.$digest()

  triggerResolvingTemplateDelayTimeout = ->
    inject ($timeout) -> $timeout.flush()

  triggerPendingViewCounterDecreaseTimeout = ->
    inject ($timeout) -> $timeout.flush()

  # Make sure the $locationChangeSuccess event handler gets called, resetting the PendingViewCount etc
  triggerInitialModuleLoad = ->
    inject ($rootScope) -> $rootScope.$digest()

  # Flush the timeout that exists to make sure that all state data changes have come in before triggering the creation
  # of the view
  triggerStateChangeEventConslidationTimeout = ->
    inject ($timeout) -> $timeout.flush()

  # The code waits for the animations to run, so we need to trigger the callbacks to pretend that they have run
  triggerOpeningAnimationCompleteCallbacks = ->
    inject ($animate, $rootScope) ->
      $rootScope.$digest()
      $animate.flush()
