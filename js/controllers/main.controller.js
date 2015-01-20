
angular.module('giftCard')

.controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', '$timeout', 'Main', function($rootScope, $scope, $location, $localStorage, $timeout, Main) {
  $scope.tokenStatus = true;
  $scope.signin = function() {
  	console.log('inside signin');
    var formData = {
      email: $scope.email,
      password: $scope.password
    };

    Main.login(formData, function(response) {
    	console.log('done with authenticate call 2')
      if (response.type == false) {
      	alert(response.data)    
      } else {
        $localStorage.token = response.data.token;
        window.location = "#/profile";
      }
    }, function() {
      $rootScope.error = 'Failed to login';
    });
  };

  $scope.signup = function() {
  	console.log('inside signup');
    var formData = {
    	firstName: $scope.firstName,
    	lastName: $scope.lastName,
      email: $scope.email,
      password: $scope.password
    };

    Main.save(formData, function(response) {
      if (response.type == false) {
        alert(response.data)
      } else {
        $localStorage.token = response.data.token;
        window.location = "#/profile"   
      }
    }, function() {
      $rootScope.error = 'Failed to signup';
    });
  };

  $scope.me = function() {
    console.log(Main.me);
    Main.me(function(response) {
      $scope.firstName = response.data.firstName;
      $scope.lastName = response.data.lastName;
      $scope.wishList = response.data.wishList;

      // $scope.token = response.data.token;
      //$scope.tokenStatus = true;
      $timeout(function() {
        $scope.token = response.data.token;
        $scope.tokenStatus = true;
      });
      console.log($scope.token);
      console.log($scope.tokenStatus);
    }, function() {
      $scope.token = null;
      $scope.tokenStatus = false;
      console.log('Token scope is: ');
      console.log($scope.token);
      $rootScope.error = 'Failed to fetch details';
    });
  };

  $scope.profile = function() {
  	$scope.me();

  	Main.apiCall(function(response) {
  		console.log('done with d api call 2');
  		$scope.items = response;
  	}, function() {
  		$rootScope.error = 'Failed to fetch api details';
  	});
  }

	$scope.pushToList = function (item, wishList) {
		for (var j = 0; j<wishList.length; j++) {
			if (item === wishList[j]) {
				return console.log('Don\'t be greedy. Item in list already.')
			}
		}
		wishList.push(item)
	}
	$scope.popFromList = function (item, wishList) {
		var i = wishList.indexOf(item);
		wishList.splice(i, 1);
	}
	$scope.saveWishList = function () {
		if ($scope.wishList.length) { // double check
			var wishList = $scope.wishList;
			console.log('maincontroller wishList: ');
			console.log(wishList);

			Main.saveWish(wishList, function(response) {
				var statusReport = 'Items Saved!';
				$scope.statusReport = statusReport;
			},
			function(err) {
				console.log('Error. failed to save wish list');
				console.log(err);
				$rootScope.error = 'Failed to save wish list';
			});
		}
	}

	$scope.viewUsers = function() {
		$scope.me();
		Main.allUsers(function(response) {
			$scope.users = response.data;
		});
	}
	$scope.showWishList = function(user) {
		$scope.selUser = user.firstName;
		$scope.userWishList = user.wishList;
	}

	$scope.createProduct = function() {
		console.log('beginning...');

		var formData = {
			itemName: $scope.itemName,
    	itemDescription: $scope.itemDescription,
      itemCategory: $scope.itemCategory,
      itemPrice: $scope.itemPrice
		};

		Main.createItem(formData, function(response) {
			var statusReport = response.itemName + ' added successfully!';
			$scope.statusReport = statusReport;
			$scope.clearFields();
		},
		function() {
			$rootScope.error = 'Failed to save items';
			$scope.statusReport = err;
		})
	}

	$scope.clearFields = function() {
		$scope.itemName = $scope.itemDescription = $scope.itemCategory = $scope.itemPrice = '';
	}

  $scope.logout = function() {
    console.log('about to logout...');
    Main.logout(function() {
    	console.log('user has been logged out!');
      $scope.tokenStatus = false;
      window.location = "#/login"
    }, function() {
      alert("Failed to logout!");
    });
  };

  $scope.token = $localStorage.token;
}])
