function routeOnClickFactory (Route, $location, $window, $timeout) {
  'ngInject'

  return {
    restrict: 'A',
    scope: true,

    link (scope, element, attrs) {
      const LEFT_BUTTON = 0;
      const MIDDLE_BUTTON = 1;

      if (element.tagName === 'A') {
        addWatchThatUpdatesHrefAttribute();

      } else {
        element.click((event) => {
          if (event.button === LEFT_BUTTON) {
            navigateToUrl(getUrl(), shouldOpenNewWindow(event));
          }
        });

        element.mouseup((event) => {
          if (event.button === MIDDLE_BUTTON) {
            navigateToUrl(getUrl(), shouldOpenNewWindow(event));
          }
        });
      }

      function navigateToUrl(_url, newWindow = false) {
        let url = _url;

        if (newWindow) {
          url = `${$window.location.origin}/${url}`;
          $window.open(url, '_blank');
        } else {
          if (!Route.isHtml5ModeEnabled()) {
            url = url.replace(/^#/, '');
          }
          $timeout(() => $location.url(url));
        }
      }

      function shouldOpenNewWindow(event) {
        return event.button === MIDDLE_BUTTON || (event.button === LEFT_BUTTON && (event.ctrlKey || event.metaKey));
      }

      function getUrl() {
        const urlWriters = Route.getUrlWriters();
        const locals = {};

        for (const writerName in urlWriters) {
          locals[`${writerName}UrlWriter`] = urlWriters[writerName];
        }

        let url = scope.$eval(attrs.routeOnClick, _.assign(locals, scope));

        if (!Route.isHtml5ModeEnabled()) {
          url = `#${url}`;
        }

        return url;
      }

      function addWatchThatUpdatesHrefAttribute() {
        return scope.$watch(iAttrs.routeOnClick, () => {
          return element.attr('href', getUrl());
        });
      }
    }
  }
}

angular.module('bicker_router').directive('routeOnClick', routeOnClickFactory);
