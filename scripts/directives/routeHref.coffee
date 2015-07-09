angular.module('bicker_router').directive 'routeHref', (Route, $location, $timeout) ->
  restrict: 'A'
  scope: true

  link: (scope, iElement, iAttrs) ->

    if iAttrs.ignoreHref is undefined
      iElement.click (event) ->
        event.preventDefault()
        $timeout -> $location.url iElement.attr 'href'

    for writerName, writer of Route.getUrlWriters()
      scope["#{writerName}UrlWriter"] = writer

    scope.$watch iAttrs.routeHref, (newUrl) ->
      iElement.attr 'href', newUrl

