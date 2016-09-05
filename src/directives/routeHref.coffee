angular.module('bicker_router').directive 'routeHref', (Route, $location, $timeout) ->
  restrict: 'A'
  scope: true

  link: (scope, iElement, iAttrs) ->

    if iAttrs.ignoreHref is undefined
      iElement.click (event) ->
        event.preventDefault()
        url = iElement.attr 'href'

        if !Route.isHtml5ModeEnabled()
          url = url.replace(/^#/, '')
          
        $timeout -> $location.url url

    for writerName, writer of Route.getUrlWriters()
      scope["#{writerName}UrlWriter"] = writer

    scope.$watch iAttrs.routeHref, (newUrl) ->
      if Route.isHtml5ModeEnabled()
        url = newUrl
      else
        url = '#' + newUrl
      iElement.attr 'href', url

