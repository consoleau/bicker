angular.module('bicker_example').component('profileListComponent', {
  templateUrl: 'views/profileList/profileList.html',
  controllerAs: 'xxx',
  controller: ['$scope', 'UserList', function ($scope, UserList) {
    this.users = UserList;
    this.wat = '1234';
  }
]});