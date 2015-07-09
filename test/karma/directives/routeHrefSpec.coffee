describe 'routeHref directive', ->
  beforeEach ->
    window.angular.mock.module 'bicker_router'

  it 'should populate the href attribute of the element with the URL returned from the matching URL writer', ->
    window.angular.mock.module (RouteProvider) ->
      RouteProvider.setPersistentStates 'page'
      RouteProvider.registerUrlWriter 'pagination', (UrlData, State) ->
        page = State.get 'page'
        "/page/#{page}"
      return

    inject ($rootScope, $location, Route, $compile, State) ->
      State.set 'page', 2
      element = $compile('<a route-href="paginationUrlWriter()">Link</a>') $rootScope.$new()
      $rootScope.$digest()

      expect(element.attr 'href').toBe '/page/2'

      State.set 'page', 3
      $rootScope.$digest()
      expect(element.attr 'href').toBe '/page/3'

  it 'should prevent the default action by default and navigate using $location so as to use pushstate', ->
    window.angular.mock.module (RouteProvider) ->
      RouteProvider.registerUrlWriter 'pagination', (UrlData, State) ->
        RouteProvider.setPersistentStates 'page'
        page = State.get 'page'
        "/page/#{page}"
      return

    inject ($rootScope, $compile, $location, State, $timeout) ->
      State.set 'page', 2
      scope = $rootScope.$new()
      element = $compile('<a route-href="paginationUrlWriter()">Link</a>') scope
      $rootScope.$digest()
      expect(element.attr 'href').toBe '/page/2'

      spyOn $location, 'url'

      event = undefined

      element.click (e) -> event = e
      element.click()

      $timeout.flush()

      expect($location.url).toHaveBeenCalled()
      expect(event.isDefaultPrevented()).toBe true

  it 'should ignore the route href when the ignore-href attribute is added to the anchor element', ->
    window.angular.mock.module (RouteProvider) ->
      RouteProvider.registerUrlWriter 'hash', -> '#test'
      return

    inject ($rootScope, $compile, $location, $timeout) ->
      element = $compile('<a route-href="hashUrlWriter()" ignore-href>Link</a>') $rootScope.$new()
      $rootScope.$digest()
      expect(element.attr 'href').toBe '#test'

      spyOn $location, 'url'

      event = undefined

      element.click (e) -> event = e
      element.click()

      $timeout.verifyNoPendingTasks()

      expect($location.url).not.toHaveBeenCalled()
      expect(event.isDefaultPrevented()).toBe false
