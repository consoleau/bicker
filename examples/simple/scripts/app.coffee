
angular.module('simple', ['bicker_router'])

angular.module('simple').config ($locationProvider, RouteProvider, ViewBindingsProvider) ->

  $locationProvider.html5Mode true

  RouteProvider.registerUrl '/', state: layout1: true
  RouteProvider.registerUrl '/pageLayout2', state: layout2: true

  ViewBindingsProvider.bind 'main', [
    requiredState: ['layout1']
    controller: 'Layout1Controller'
    templateUrl: 'views/layout1.html'
  ,
    requiredState: ['layout2']
    controller: 'Layout2Controller'
    templateUrl: 'views/layout2.html'
  ]

