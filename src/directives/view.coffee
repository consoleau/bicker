# @TODO none of the animation code in this directive has been tested. Not sure if it can be at this stage This needs further investigation.
# @TODO this code does too much, it should be refactored, but I need to get this out ASAP
angular.module('bicker_router').directive 'view', ($compile, $controller, ViewBindings, $q, State, $rootScope, $animate, $timeout, $injector, PendingViewCounter, $templateRequest, Route) ->
  directive =
    restrict: 'E'
    scope: false
    replace: true
    template: '<div></div>'

    link: (viewDirectiveScope, iElement, iAttrs) ->
      viewCreated = false
      viewScope = undefined
      viewManagementPending = false
      view = ViewBindings.getView(iAttrs.name)
      bindings = view.getBindings()

      iElement.addClass 'ng-hide'

      previousBoundState = undefined
      previousBinding = undefined

      getStateDataForBinding = (binding) ->
        _.cloneDeep State.getSubset getStateFieldsFromBinding binding

      getComponentFromBinding = (binding) ->
        source = if binding.component then $injector.get(binding.component + 'Directive')[0] else binding
        _.defaults(_.pick(source, ['controller', 'templateUrl', 'controllerAs']), { controllerAs: '$ctrl' })

      hasRequiredData = (binding) ->
        return true if not binding.requiredState?

        for requirement in binding.requiredState
          negateResult = false
          if '!' == requirement.charAt 0
            requirement = requirement.slice 1
            negateResult = true

          element = State.get requirement

          # Return false if element is undefined
          return false if not element?

          # Only check value of element if it is defined
          element = not element if negateResult
          return false if not element

        return true

      manageView = (element, bindings) ->
        matchingBinding = getMatchingBinding bindings

        if not matchingBinding
          if viewCreated
            $animate.addClass(element, 'ng-hide').then =>
              destroyView element
            previousBoundState = undefined
            previousBinding = undefined
          return

        newState = getStateDataForBinding matchingBinding

        return if matchingBinding is previousBinding and angular.equals(previousBoundState, newState)

        previousBinding = matchingBinding
        previousBoundState = newState

        PendingViewCounter.increase()

        showResolvingTemplate(element, matchingBinding).then (hasResolvingTemplate) ->

          # @TODO: Magic number
          delayForRealTemplateInsertion = if hasResolvingTemplate then 300 else undefined

          if not viewCreated
            $animate.removeClass(element, 'ng-hide').then =>
              createView element, matchingBinding, delayForRealTemplateInsertion
          else
            viewScope.$destroy()
            createView element, matchingBinding, delayForRealTemplateInsertion

      getMatchingBinding = (bindings) ->
        for binding in bindings
          return binding if hasRequiredData binding

        undefined

      destroyView = (element) ->
        return if viewCreated is false
        viewCreated = false
        element.html ''
        viewScope.$destroy()

      createView = (element, binding, minimumDelay) ->

        timeStartedMainView = Date.now()
        component = getComponentFromBinding binding

        onSuccessfulResolution = (args) ->
          return if getMatchingBinding(bindings) isnt binding

          viewCreated = true

          resolvingTemplateShownTime = Date.now() - timeStartedMainView

          injectMainTemplate = ->
            dependencies = args.dependencies
            template = args.template

            element.html template
            link = $compile element.contents()
            viewScope = viewDirectiveScope.$new()

            if component.controller
              locals = _.merge dependencies, $scope: viewScope

              controller = $controller(component.controller, locals)
              locals.$scope[component.controllerAs] = controller

            link viewScope

            # Wrapped in a timeout so that we can give the view time to properly initialise
            # before potentially triggering the intialViewsLoaded event
            $timeout -> PendingViewCounter.decrease() if not binding.manualCompletion

          mainTemplateInjectionDelay = Math.max(0, minimumDelay - resolvingTemplateShownTime)

          if resolvingTemplateShownTime < minimumDelay
            $timeout ->
              injectMainTemplate()
            , mainTemplateInjectionDelay
          else
            injectMainTemplate()

        onResolutionFailure = ->
          $timeout -> PendingViewCounter.decrease() if not binding.manualCompletion
          showResolvingErrorTemplate element, binding

        promises = template: $templateRequest(component.templateUrl), dependencies: resolve(binding)
        $q.all(promises).then(onSuccessfulResolution, onResolutionFailure)

      showResolvingTemplate = (element, binding) ->
        if not binding.resolvingTemplateUrl or not binding.resolve or Object.keys(binding.resolve).length is 0
          deferred = $q.defer()
          deferred.resolve false
          return deferred.promise

        $templateRequest(binding.resolvingTemplateUrl).then (template) ->
          element.html template
          $compile(element.contents())($rootScope.$new())

      showResolvingErrorTemplate = (element, binding) ->
        return if not binding.resolvingErrorTemplateUrl
        $templateRequest(binding.resolvingErrorTemplateUrl).then (template) ->
          element.html template

      resolve = (binding) ->
        if not binding.resolve or Object.keys(binding.resolve).length is 0
          deferred = $q.defer()
          deferred.resolve {}
          return deferred.promise

        promises = {}

        for dependencyName, dependencyFactory of binding.resolve
          promises[dependencyName] = $injector.invoke dependencyFactory

        $q.all promises

      getStateFieldsFromBinding = (binding) ->
        _.union(binding.requiredState or [], binding.watchedState or [])

      stripNegationPrefix = (str) ->
        if str.charAt(0) is '!' then str.substr(1) else str

      getStateFieldsFromView = (view) ->
        _.flatten _.map view.getBindings(), getStateFieldsFromBinding

      getFieldsToWatch = (view) ->
        _.uniq _.map getStateFieldsFromView(view), stripNegationPrefix

      fields = getFieldsToWatch(view)

      Route.whenReady().then ->
        viewManagementPending = true

        # Try to start the ball rolling in case there's no dependencies and we can create the view immediately
        manageView iElement, bindings
        viewManagementPending = false

        # Don't bother putting in a watcher if there's no dependencies that will ever trigger a change event
        return if fields.length is 0

        stateWatcher = ->
          return if viewManagementPending
          viewManagementPending = true

          # Wrapped in a timeout so that we can finish the digest cycle before building the view, which should
          # prevent us from re-rendering a view multiple times if multiple properties of the same state dependency
          # get changed with repeated State.set calls
          $timeout ->
            manageView iElement, bindings
            viewManagementPending = false

        State.watch fields, stateWatcher

        viewDirectiveScope.$on '$destroy', ->
          State.removeWatcher stateWatcher

  return directive
