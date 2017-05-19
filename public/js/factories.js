angular.module('dlctrackerApp')
.factory('apiCall', ['$http', ($http) => {
  const apiCall = (method, url, data, cb) => {
    const req = (method === 'DELETE' || method === 'GET') ? 
    { method, url } : { method, url, data };
    $http(req).then((res) => {
      return cb(res.data);
    }, (res) => {
      return cb(res.statusText);
    });
  }
  return apiCall;
}])
.service('dlctrackerService', function (apiCall) {
  this.getUser = (callback) => {
    apiCall('GET', '/api/user', undefined, (user) => {
      this.user = user;
      return callback(user);
    });
  };
  this.getUsers = (callback) => {
    apiCall('GET', '/api/user/users', undefined, (users) => {
      return callback(users);
    });
  };
  this.getCommunities = (callback) => {
    apiCall('GET', '/api/user-community', undefined, (communities) => {
      return callback(communities);
   }); 
  }
  this.getModule = (callback) => {
    apiCall('GET', 'url', (moduleObj) => {
      return callback(moduleObj);
    });
  }
  this.createCommunities = (commName, details, callback) => {
    apiCall('POST', `/api/comm/${commName}`, {
      description: {
        details,
        name: commName,
      },
      estimatedTime: 0,
      studentsCount: 0
    }, (resData) => {
      return callback(resData);
    });
  }
});
