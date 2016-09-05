angular.module('bicker_router').factory 'PendingViewCounter', ($rootScope) ->
  class PendingViewCounter
    count: 0
    initialViewsLoaded: false

    get: -> @count

    increase: -> @count += 1

    decrease: ->
      @count = Math.max 0, @count-1
      if @count is 0
        if not @initialViewsLoaded
          $rootScope.$broadcast 'bicker_router.initialViewsLoaded'
          @initialViewsLoaded = true
        else
          $rootScope.$broadcast 'bicker_router.currentViewsLoaded'

    reset: ->
      @count = 0
      @initialViewsLoaded = false

  new PendingViewCounter()
