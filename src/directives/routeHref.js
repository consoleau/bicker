function routeHrefFactory (Route, $location, $timeout) {
  'ngInject'

  return {
    restrict: 'A',
    scope: true,
    link (scope, iElement, iAttrs) {
      if (iAttrs.ignoreHref === undefined && Route.isHtml5ModeEnabled()) {
        iElement.click((event) => {
            event.preventDefault();
            const urlPath = iElement.attr('href').replace(/^#/, '');
            return $timeout(() => $location.url(urlPath));
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
