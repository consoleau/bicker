function routeHrefFactory (Route, $window, $location, $timeout) {
  'ngInject'

  return {
    restrict: 'A',
    scope: true,
    link (scope, iElement, iAttrs) {
    if (iAttrs.ignoreHref === undefined) {
      iElement.click((event) => {
        event.preventDefault();
        let urlPath = iElement.attr('href');

        if (event.metaKey) {
          const fullUrl = $window.location.protocol + "//" + $window.location.host + urlPath;
          $window.open(fullUrl,'_blank')
        } else {
          if (!Route.isHtml5ModeEnabled()) {
            urlPath = urlPath.replace(/^#/, '');
          }
          return $timeout(() => $location.url(urlPath));
        }
      });
    }

    const object = Route.getUrlWriters();
    for (const writerName in object) {
      const writer = object[writerName];
      scope[`${writerName}UrlWriter`] = writer;
    }

    return scope.$watch(iAttrs.routeHref, (newUrl) => {
      let url;
      if (Route.isHtml5ModeEnabled()) {
        url = newUrl;
      } else {
        url = `#${newUrl}`;
      }
      return iElement.attr('href', url);
    });
  }
  }
}

angular.module('bicker_router').directive('routeHref', routeHrefFactory);
