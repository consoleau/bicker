angular.module('bicker_router', ['ngAnimate']).run (State, Route, $location, $rootScope, ObjectHelper, PendingViewCounter) ->
  "ngInject";
  oldUrl = undefined
  $rootScope.$on '$locationChangeStart', ->
    Route.setReady false if Route.isReady()

  $rootScope.$on '$locationChangeSuccess', (e, newUrl) ->
    # Work-around for AngularJS issue https://github.com/angular/angular.js/issues/8368
    return if newUrl is oldUrl

    oldUrl = newUrl

    PendingViewCounter.reset()
    match = Route.match $location.path()

    if not match
      data = {}
    else
      data = Route.extractData(match)

    fieldsToUnset = ObjectHelper.notIn State.list, data
    fieldsToUnset = _.difference fieldsToUnset, Route.getPersistentStates().concat(Route.getFlashStates())

    eventData = unsetting: fieldsToUnset, setting: data

    $rootScope.$emit 'bicker_router.beforeStateChange', eventData

    if (eventData.unsetting).length isnt 0
      State.unset eventData.unsetting

    for key, value of eventData.setting
      State.set key, value

    Route.resetFlashStates()
    Route.setReady true

    return
