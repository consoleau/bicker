angular.module('bicker_example').component('profileListComponent', {
  templateUrl: 'views/profileList/profileList.html',
  controller: ['$scope', 'UserList', function ($scope, UserList) {
    $scope.users = UserList;
  }
]});