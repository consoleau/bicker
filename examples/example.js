angular.module('bicker_example', ['bicker_router']).config(function (RouteProvider, ViewBindingsProvider) {
    RouteProvider.registerUrlToken('profileId', {
        statePath: 'profile.id',
        type: 'numeric'
    });

    RouteProvider.registerUrl('/profiles');
    RouteProvider.registerUrl('/profile/{profileId}');


    ViewBindingsProvider.bind('main', [
        {
            requiredState: ['profile.id'],
            controller: 'ProfileController',
            templateUrl: 'views/profile/profile.html',
            resolvingTemplateUrl: 'views/loading/loading.html',
            resolve: {
                User: ['$q', '$timeout', 'State', function ($q, $timeout, State) {
                    var deferred = $q.defer();

                    $timeout(function() {
                        deferred.resolve(getUser(State.get('profile.id')))
                    }, 2000);

                    return deferred.promise;
                }]
            }
        },{
            controller: 'ProfileListController',
            templateUrl: 'views/profileList/profileList.html',
            resolve: {
                UserList: function () {
                    return users;
                }
            }
        }
    ]);

    RouteProvider.registerUrlWriter('profile', ['UrlData', function(profile) {
        return '/profile/' + profile.id;
    }]);
}).run(function ($animate) {
    $animate.enabled(true);
});

function getUser(id) {
    for (user in users) {
        if (users[user].id === id) {
            return users[user];
        }
    }

    return null;
}


const users = [{
    id: 1234,
    name: 'John Doe'
},{
    id: 2345,
    name: 'Jane Doe'
}];