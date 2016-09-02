angular.module('bicker_example').component('profileListComponent', {
  templateUrl: 'views/profileList/profileList.html',
  controller: ['$scope', 'UserList', 'Route', function ($scope, UserList, Route) {
    this.users = UserList;
    this.go = function(user) {
      Route.go('profile', user);
    }
  }
]});