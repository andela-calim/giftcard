
angular.module('giftCard')
  .factory('Main', ['$http', '$localStorage', function($http, $localStorage){
    var baseUrl = "https://giftcardapi.herokuapp.com";

    function changeUser(user) {
      angular.extend(currentUser, user);
    }

    function urlBase64Decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
        case 0:
          break;
        case 2:
          output += '==';
          break;
        case 3:
          output += '=';
          break;
        default:
          throw 'Illegal base64url string!';
      }
      return window.atob(output);
    }

    function getUserFromToken() {
      var token = $localStorage.token;
      var user = {};
      if (typeof token !== 'undefined') {
        var encoded = token.split('.')[1];
        user = JSON.parse(urlBase64Decode(encoded));
      }
      return user;
    }

    var currentUser = getUserFromToken();

    return {
      save: function(data, success, error) {
        $http.post(baseUrl + '/signin', data).success(success).error(error)
      },
      login: function(data, success, error) {
      	console.log('making d authenticate call');
        $http.post(baseUrl + '/authenticate', data).success(success).error(error)
        console.log('done with authenticate call 1')
      },
      apiCall: function(success, error) {
      	console.log('making d api call');
      	$http.get(baseUrl + '/api').success(success).error(error)
      	console.log('done with api call 1');
      },
      me: function(success, error) {
        $http.get(baseUrl + '/profile').success(success).error(error)
      },
      saveWish: function(data, success, error) {
      	console.log('making the saveWish call');
      	console.log(data);
      	$http.post(baseUrl + '/profile', data).success(success).error(error)
      	console.log('done with saveWish call');
      },
      allUsers: function(success, error) {
      	console.log('making the allUsers call');
      	$http.get(baseUrl + '/users').success(success).error(error)
      	console.log('done with saveWish call');
      },
      createItem: function(data, success, error) {
      	$http.post(baseUrl + '/api', data).success(success).error(error)
      },
      logout: function(success) {
        changeUser({});
        delete $localStorage.token;
        success();
      }
    };
  }
]);