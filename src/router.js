angular.module('bicker_router', ['ngAnimate']).run(function (State, Route, $location, $rootScope, ObjectHelper, PendingViewCounter) {
  "ngInject";

  let oldUrl = undefined;
  $rootScope.$on('$locationChangeStart', function () {
    if (Route.isReady()) {
      Route.setReady(false);
    }
  });

  $rootScope.$on('$locationChangeSuccess', function (e, newUrl) {

    setTimeout(function() {
      const eventData = {'viewName': Route.getCurrentViewName()};
      $rootScope.$emit('bicker_router.$locationChangeSuccess', eventData);
    }, 1)

    // Work-around for AngularJS issue https://github.com/angular/angular.js/issues/8368
    let data;
    if (newUrl === oldUrl) {
      return;
    }

    oldUrl = newUrl;

    PendingViewCounter.reset();
    const match = Route.match($location.path());

    if (!match) {
      data = {};
    } else {
      data = Route.extractData(match);
    }

    let fieldsToUnset = ObjectHelper.notIn(State.list, data);
    fieldsToUnset = _.difference(fieldsToUnset, Route.getPersistentStates().concat(Route.getFlashStates()));

    const eventData = {unsetting: fieldsToUnset, setting: data};

    $rootScope.$emit('bicker_router.beforeStateChange', eventData);

    if ((eventData.unsetting).length !== 0) {
      State.unset(eventData.unsetting);
    }

    _.forEach(eventData.setting, (value, key) => {
      State.set(key, value);
    });

    Route.resetFlashStates();
    Route.setReady(true);
  });
});
