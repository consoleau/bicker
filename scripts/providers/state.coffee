angular.module('bicker_router').provider 'State', ->
  $get: (WatchableListFactory) ->
    stateService = WatchableListFactory.create()
    stateService
