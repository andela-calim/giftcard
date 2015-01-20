
angular.module('giftCard', ['ngStorage', 'ngRoute'])
.config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) {

	$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
    return {
      'request': function (config) {
        config.headers = config.headers || {};
        if ($localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $localStorage.token;
        }
        return config;
      },
      'responseError': function(response) {
        if(response.status === 401 || response.status === 403) {
          $location.path('/login');
        }
        return $q.reject(response);
      }
    };
  }]);

	$routeProvider
		.when('/', {
			templateUrl: 'partials/register.html',
			controller: 'HomeCtrl'
		})

		.when('/register', {
			templateUrl: 'partials/register.html',
			controller: 'HomeCtrl'
		})

		.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'HomeCtrl'
		})

		.when('/profile', {
			templateUrl: 'partials/profile.html',
			controller: 'HomeCtrl'
		})

		.when('/viewUsers', {
			templateUrl: 'partials/users.html',
			controller: 'HomeCtrl'
		})

		.when('/createProduct', {
			templateUrl: 'partials/createProduct.html',
			controller: 'HomeCtrl'
		})

		.otherwise({
			redirectTo: '/'
		});
}]);