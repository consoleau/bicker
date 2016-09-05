angular.module('bicker_example').controller('ProfileController', ['$scope', 'User', function ($scope, User) {
    $scope.user = User;
}]);