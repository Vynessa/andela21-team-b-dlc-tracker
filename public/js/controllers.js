angular.module('dlctrackerApp', [])
.controller('appCtrl', ($scope, dlctrackerService) => {
  $scope.testIsShown = false;
  $scope.videoSrc = '';
  $scope.videoIsShown = false;
  $scope.showVideo = () => {
    $scope.videoSrc = $scope.module.video;
    $scope.videoIsShown = true;
  };
  $scope.showTest = () => {
    $scope.testIsShown = true;
  };
  $scope.getModule = () => {
    dlctrackerService.getModule(modId, (resData) => {
      $scope.module = resData;
    });
  };

  $scope.hasCommunity = (commName) => {
    if (Object.prototype.hasOwnProperty($scope.user, 'communities')) {
      return Object.prototype.hasOwnProperty.call($scope.user.communities, commName);
    }
    return false;
  };
  
  dlctrackerService.getUser((resData) => {
    $scope.user = resData;
  });
  dlctrackerService.getCommunities((resData) => {
    $scope.communities = resData;
    $scope.communitiesCount = Object.keys(resData).length;
  });
  dlctrackerService.getUsers((resData) => {
    console.log(resData);
    $scope.userLength = Object.keys(resData).length;
  });
});

