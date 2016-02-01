angular.module('bicker_example').controller('ProfileListController', ['$scope', 'UserList', function ($scope, UserList) {
    $scope.users = UserList;
}]);