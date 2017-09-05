function routeClickFactory (Route, $location, $window, $timeout) {
  'ngInject'

  return {
    restrict: 'A',
    scope: true,

    link (scope, element, attrs) {
      element.mouseup((event) => {
        event.preventDefault();
        let urlPath = element.attr('href');

        if (event.which === 2 || (event.which === 1 && (event.metaKey || event.ctrlKey))) {
          const fullUrl = $window.location.origin + '/' + urlPath;
          return $window.open(fullUrl, '_blank');
        } else {
          if (!Route.isHtml5ModeEnabled()) {
            urlPath = urlPath.replace(/^#/, '');
          }
          return $timeout(() => $location.url(urlPath));
        }
      });

      const object = Route.getUrlWriters();
      for (const writerName in object) {
        const writer = object[writerName];
        scope[`${writerName}UrlWriter`] = writer;
      }

      return scope.$watch(attrs.routeClick, (newUrl) => {
        let url = newUrl;
        if (!Route.isHtml5ModeEnabled()) {
          url = `#${url}`;
        }
        return element.attr('href', url);
      });
    }
  }
}

angular.module('bicker_router').directive('routeClick', routeClickFactory);
