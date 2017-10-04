var app = angular.module('Robotix', ['ngRoute']);

/*--- FILTERS ---*/


/*--- DIRECTIVES ---*/

app.directive('signUp', function(){
	return {
		restrict: 'E',
		templateUrl: 'robotix/user/user_access/signup.html',
		controller: 'signUpController'
	};
});

app.directive('logIn', function(){
	return {
		restrict: 'E',
		templateUrl: 'robotix/user/user_access/login.html',
		controller: 'logInController'
	};
});

/*--- SERVICES ---*/

// provides server session and session Storage functions 
app.factory('sessionService', ['$http', function($http){
	return{
		set:function(key,value){
			return sessionStorage.setItem(key, JSON.stringify(value));
		},
		get: function(key){
			return JSON.parse(sessionStorage.getItem(key));
		},
		remove:function(key){
			sessionStorage.removeItem(key);
		},
		destroySession:function(){
			$http.post('robotix/user/user_access/destroy_session.php');
			sessionStorage.removeItem('user');
			sessionStorage.removeItem('uid');
		}
	};
}])

// provides log in and log out functions and user details data gathering
app.factory('accountService', ['$http', '$location', 'sessionService', '$rootScope', function($http, $location, sessionService, $rootScope){
	return{
		signUp: function(data){
			return $http({
				method: 'POST',
				url: 'robotix/user/user_access/signup.php',
				data: data
			});
		},
		logIn: function(user){
			return $http({
				method: 'POST',
				url: 'robotix/user/user_access/login.php',
				data: user
			});
		},
		broadcastLogIn: function() {
			$rootScope.loggedIn = true;
			$rootScope.$broadcast('loggedIn');
		},
		logOut: function(){
			sessionService.destroySession();
			sessionService.remove('cart');
			$location.path('#/');
		},
		getUser: function(){
			return sessionService.get('user');
		},
		sendPassword: function(email){
			return $http({
				method: 'POST',
				url: 'robotix/user/login/forgottenPW.php',
				data: {email: email}
			});
		},
		isLoggedIn: function(){
			return sessionService.get('user')? true : false;
		},
		editDetails: function(user){
			return $http({
				method: 'POST',
				url: 'robotix/user/user_access/edit_details.php',
				data: user
			});
		}
	};
}])

app.factory('homeContentService', ['$http', function ($http) {
	return {
		getHomeContent: function () {
			return $http({
				method: 'GET',
				url: 'robotix/user/home/home.php'
			});
		}
	};
}])

app.factory('videosContentService', ['$http', function ($http) {
	
	return {
		videos: [],
		playlists: [],
		getVideosContent: function () {
			return $http({
				method: 'GET',
				url: 'robotix/user/videos/videos.php'
			});
		},
		getVideoDetails: function (param) {
			return $http({
				method: 'GET',
				url: 'robotix/user/videos/video_details.php',
				params: {video_id: param}
			});
		}
	};
}])

app.factory('playlistContentService', ['$http', function($http) {
	return {
		playlist: {},
		playlistVideos: [],
		getPlaylistContent: function(param) {
			return $http ({
				method: 'GET',
				url: 'robotix/user/videos/playlist.php',
				params: {playlist_id: param}
			})
		},
		getPlaylistVideoContent: function(param) {
			return $http ({
				method: 'GET',
				url: 'robotix/user/videos/video_details.php',
				params: {video_id: param}
			})
		}
	}
}])

app.factory('coursesContentService', ['$http', function($http) {
	return {
		courses: [],
		getCourses: function() {
			return $http({
				headers: { 
					'Authorization': 'Basic bnRWT1VxdTl3Ukg2YWpsOHJjTWlmeEJXWkU0RnF6RWlJWEFrRXJscTpsMEM1bk9VVHBRcVkyazRyb0lNcTFZZ3E3aDBEUlo4VmFpOXVIbVFwOEE5ZTFvbEhDUWh6ZVU0ejBLalE4NHRGVDMyQXV6T3l0T01ONjJDcExRbUhHUzU1TUlmVHRwWmhTeWFLaUJiZUZWRGF4Wk5qaUl5ZURPN3RLVDBIaFgyVQ==',
					'Accept': 'application/json, text/plain, */*'
				},
				method: 'GET',
				url: 'https://www.udemy.com/api-2.0/courses/?page=1&page_size=100&search=Sanjin Dedic&ordering=newest'
			});
		},
		getCourseContent: function(param) {
			return $http ({
				headers: { 
					'Authorization': 'Basic bnRWT1VxdTl3Ukg2YWpsOHJjTWlmeEJXWkU0RnF6RWlJWEFrRXJscTpsMEM1bk9VVHBRcVkyazRyb0lNcTFZZ3E3aDBEUlo4VmFpOXVIbVFwOEE5ZTFvbEhDUWh6ZVU0ejBLalE4NHRGVDMyQXV6T3l0T01ONjJDcExRbUhHUzU1TUlmVHRwWmhTeWFLaUJiZUZWRGF4Wk5qaUl5ZURPN3RLVDBIaFgyVQ==',
					'Accept': 'application/json, text/plain, */*'},
				method: 'GET',
				url: ''
			})
		}
	}
}])

app.factory('kitsContentService', ['$http', function ($http) {
	return {
		getKitsContent: function () {
			return $http({
				method: 'GET',
				url: 'robotix/user/kits/kits.php'
			});
		},
		getKitDetails: function (param) {
			return $http({
				mehtod: 'GET',
				url: 'robotix/user/kits/kit_details.php',
				params: {kit_id: param}
			});
		}
	};
}])

app.factory('udemyCodeService', ['$http', function($http) {
	return {
		getUdemyCourseLink: function(param) {
			return $http({
				method: 'GET',
				url: 'robotix/user/udemy/udemy_code.php',
				params: param
			});
		},
		removeCode: function(param) {
			return $http({
				method: 'GET',
				url: 'robotix/user/udemy/remove_udemy_code.php',
				params: param
			})
		}
	};
}])

/*--- CONTROLLERS ---*/

app.controller('sliderController', ['$scope', 'videosContentService', '$timeout', '$filter', function($scope, videosContentService, $timeout, $filter) {
	$scope.$on('getVideosContent', function() {
		$timeout(function() {
			$scope.slides = $filter('limitTo')(videosContentService.videos, 10);
			$scope.index = 0;
		}, 1000);
	});
	$scope.slidePrev = function() {
		$scope.slides.unshift($scope.slides.pop());
	};
	$scope.slideNext = function() {
		$scope.slides.push($scope.slides.shift());
	};
}]);

app.controller('tabController', ['$scope', function($scope) {
	$scope.activeTab = 1;
	$('#tab_' + $scope.activeTab).children().attr('id', 'active_tab');
	$scope.isActive = function(tabNo) {
		return tabNo === $scope.activeTab;
	};
	
	$scope.setActiveTab = function(tabNo) {
		$('#tab_' + $scope.activeTab).children().removeAttr('id');
		$scope.activeTab = tabNo;
		$('#tab_' + $scope.activeTab).children().attr('id', 'active_tab');
	};
}]);

app.controller('navigationController', ['$scope', 'accountService', '$routeParams', function ($scope, accountService, $routeParams) {
		
	//determines visible elements of navigation
	$scope.loggedIn = accountService.isLoggedIn();
	
	$scope.$on('loggedIn', function(){
		$scope.loggedIn = accountService.isLoggedIn();
	});
	
	// forces log in when accessing videos
	$scope.$on('$routeChangeSuccess', function(evt, curr, prev) {
		if ($routeParams.video_id && !$scope.loggedIn){
			$('#sign_up').modal('show');
		}
	});
	
	$scope.logOut =  function() {
		accountService.logOut();
		$scope.loggedIn = accountService.isLoggedIn();
	};
	
	$(document).on('click','.navbar-collapse.in',function(e) {
		if( $(e.target).is('a') ) {
			$(this).collapse('hide');
		}
	})
}]);


// INDEX

// controller for Signup View, stores registration information through accountService
app.controller('signUpController', ['$scope', 'accountService', 'sessionService', '$routeParams', '$location', function($scope, accountService, sessionService, $routeParams, $location){
	
	//initialize user object
	$scope.user = {
		id: '',
		email: '',
		password: ''		
	};
		
	$scope.errorMessage = ''; //error message field in form
	$scope.isSaving = false; //disable form fields between submission and response
	$scope.confirm_password = ''; //password match field
	
	// validation feedback in form
	$scope.passwordMatch = function(){
		if ($scope.confirm_password === $scope.user.password){
			return 'valid_field';
		} else {
			return 'invalid_field';
		}
	};
	
	//switch to login form
	$scope.showLogIn = function() {
		$scope.resetForm();
		$('#sign_up').modal('hide');
		$('#log_in').modal('show');
	};
	
	//called when modal is closed, moves user to home if not logged in
	$scope.redirect = function() {
		if($routeParams.video_id && !accountService.isLoggedIn()) {
			$location.path('#/');
		}
	};
	
	// watcher for validation feedback in form
	$scope.$watch('confirm_password', function(){
		$scope.passwordMatch()
	});
	
	//resets form after promise return
	$scope.resetForm = function() {
		$scope.user.email = '';
		$scope.user.password = '';
		$scope.confirm_password = '';
	};
	
	//register user: data from form is bound to $scope.account
	$scope.signUp = function(){
		$scope.isSaving = true;
		accountService.signUp($scope.user)
			.then(function(result){
				if (result.data.success) {
					$scope.isSaving = false;
					$scope.user.id = result.data.elements.user_id;
					delete $scope.user.password;
					sessionService.set('user', $scope.user);
					sessionService.set('uid', result.data.elements.uid);
					$('#sign_up').modal('hide');
					$scope.resetForm();
					accountService.broadcastLogIn();
					alert("You're now logged in!");
				} else {
					$scope.isSaving = false;
					$scope.resetForm();
					$scope.errorMessage = result.data.message[0];
				}

			}, function(result){
				$scope.isSaving = false;
				$scope.resetForm();
				$scope.errorMessage = 'Unable to create user, please try again.';
			});
	};
}]);

// controller for Log In View	
app.controller('logInController', ['$scope', 'accountService', 'sessionService', '$routeParams', '$location', function($scope, accountService, sessionService, $routeParams, $location){
	
	//initialize user 
	$scope.user = {
		id: '',
		email: '',
		password: ''
	};
	//switch to login form
	$scope.showSignUp = function() {
		$scope.resetForm();
		$('#log_in').modal('hide');
		$('#sign_up').modal('show');
	};
	$scope.isSaving = false; //disables form fields while login request is processing
	$scope.errorMessage = '';
	
	//moves user to home if not logged in
	$scope.redirect = function() {
		if($routeParams.video_id && !accountService.isLoggedIn()) {
			$location.path('#/');
		}
	};
	
	$scope.resetForm = function() {
		$scope.user.email = '';
		$scope.user.password = '';
	}
	
	// check user account and creates a session to server 
	$scope.logIn = function(){
		$scope.isSaving = true; //disable formfields
		accountService.logIn($scope.user)
			.then(function(result){
				$scope.isSaving = false; //enable formfields
				//if session created, save user details in session storage
				if(result.data.success){
					//save current user in session storage
					$scope.user.id = result.data.elements.user_id;
					delete $scope.user.password;
					sessionService.set('user', $scope.user);
					sessionService.set('uid', result.data.elements.uid);
					$('#log_in').modal('hide');
					$scope.resetForm();
					accountService.broadcastLogIn();
				}
				else  {
					$scope.isSaving = false; //enable formfields
					$scope.resetForm();
					$scope.errorMessage = result.data.message[0];
				};
			}, function(result){
				$scope.processing = false; //enable formfields
				$scope.errorMessage = 'Server error! Unable to log in.';
				$scope.resetForm();
			});
	};
}])

app.controller('homeElementsController', ['$scope', 'homeContentService', '$sce', function ($scope, homeContentService, $sce) {
	
	$scope.video_id = 'qw_4tnefN_s';
	$scope.trustedVideo = $sce.trustAsHtml('<iframe class="embed-responsive-item" id="ytplayer" type="text/html" width="720" height="405" src="https://www.youtube.com/embed/'+$scope.video_id+'?controls=2?modestbranding=1&rel=0&color=white"frameborder="0" allowfullscreen></iframe>');
	
	homeContentService.getHomeContent()
		.then(function (result) {
			if(result.data.success && result.data.message.length < 2){ 
				angular.forEach(result.data.elements, function(value, key){
					$scope[key] = value;
				});
			} else {
				alert("Warning: " + result.data.message);
			}
		}, function() {
			alert("Error: Unable to connect");
	});
}]);

//VIDEOS VIEW
app.controller('videosController', ['$scope', 'videosContentService', function ($scope, videosContentService) {
	$scope.playlistSelector = "";
	$scope.videos = [];
	$scope.kitSelector = "";
	videosContentService.getVideosContent()
		.then(function (result) {
			if (result.data.success && !result.data.message.length) {
				videosContentService.videos = result.data.elements.videos;
				videosContentService.playlists = result.data.elements.playlists;
				$scope.$broadcast('getVideosContent');
				angular.forEach(result.data.elements, function(value, key) {
					$scope[key] = value;
				});
			
			} else {
				alert("Warning: " + result.data.message);
			}
		}, function() {
			alert("Error: Unable to connect");
	});
}]);

app.controller('listOfPlaylistsController', ['$scope', 'videosContentService', function($scope, videosContentService) {
	$scope.$on('getVideosContent', function(){
		$scope.playlists = videosContentService.playlists;	
	})
		
	$scope.expanded = false;
	
	$scope.togglePlaylists = function() {
		$scope.expanded ? $scope.expanded = false : $scope.expanded = true;
	}
}]);

//VIDEO VIEW
app.controller('videoDetailsController', ['$scope', '$routeParams', 'videosContentService', '$sce', function($scope, $routeParams, videosContentService, $sce) {
	// returns true if qty > 0 else :false
	$scope.isAvailable = function(kit_qty){
		return kit_qty > 0; 
	}
	
	$scope.fileName = function(nameOfVideo, nameOfFile) {
		return nameOfVideo + '.' + nameOfFile.split('.').pop();
	}
	
	videosContentService.getVideoDetails($routeParams.video_id)
		.then(function(result) {
			if (result.data.success) {
				angular.forEach(result.data.elements, function(value, key) {
					if (key === 'video') {
						$scope[key] = value[0];
					} else{
						$scope[key] = value;	
					}
				});
				$scope.trustedVideo = $sce.trustAsHtml('<iframe class="embed-responsive-item" id="ytplayer" type="text/html" width="720" height="405" src="https://www.youtube.com/embed/'+$scope.video.yt_id+'?controls=2?modestbranding=1&rel=0&color=white"frameborder="0" allowfullscreen></iframe>');
			} else {
				alert("Warning: " + result.data.message);
			}
		}, function(result) {
			alert("Error: Unable to connect");
	});
}]);

// PLAYLIST VIEW
app.controller('playlistController', ['$scope', 'playlistContentService', '$routeParams', function($scope, playlistContentService, $routeParams) {
	
	// get playlist and playlistVideos details
	playlistContentService.getPlaylistContent($routeParams.playlist_id)
		.then(function(result){
			if(result.data.success){
				angular.forEach(result.data.elements, function(value, key) {
					if(key === 'playlist') {
						$scope[key] = value[0];
						playlistContentService[key] = value[0];
					} else {
						$scope[key] = value;
						playlistContentService[key] = value;
					}
				})
			} else {
				alert(result.data.message);
			}
		
		}, function(result) {
		alert("Unable to retieve Playlist details!")
	})	
}]);

// PLAYLIST VIDEO VIEW
app.controller('playlistVideoController', ['$scope', 'playlistContentService', '$routeParams', function($scope, playlistContentService, $routeParams) {
	
	// get playlist and playlistVideos details
	playlistContentService.getPlaylistVideoContent($routeParams.video_id)
		.then(function(result){
			if(result.data.success){
				angular.forEach(result.data.elements, function(value, key) {
					if(key === 'video') {
						$scope[key] = value[0];
					} else {
						$scope[key] = value;
					}
				})
			} else {
				alert(result.data.message);
			}
		
		}, function(result) {
		alert("Unable to retieve Playlist details!")
	})	
}]);

// COURSES VIEW
app.controller('coursesController', ['$scope', 'coursesContentService', function($scope, coursesContentService) {
	
	$scope.courses = [];
	var response = {
	  "results": [
		{
		  "_class": "course",
		  "id": 1240076,
		  "title": "Zero to Hero in Vex Robotics",
		  "url": "/zero-to-hero-in-vex-robotics/",
		  "is_paid": false,
		  "price": "Free",
		  "visible_instructors": [
			{
			  "_class": "user",
			  "id": 20414404,
			  "title": "Sanjin Dedic",
			  "name": "Sanjin",
			  "display_name": "Sanjin Dedic",
			  "job_title": "Teacher, Robotics Engineer",
			  "image_50x50": "https://udemy-images.udemy.com/user/50x50/20414404_b068_2.jpg",
			  "image_100x100": "https://udemy-images.udemy.com/user/100x100/20414404_b068_2.jpg",
			  "url": "/user/sanjin-dedic/"
			}
		  ],
		  "image_125_H": "https://udemy-images.udemy.com/course/125_H/1240076_7e74_2.jpg",
		  "image_240x135": "https://udemy-images.udemy.com/course/240x135/1240076_7e74_2.jpg",
		  "is_practice_test_course": false,
		  "image_480x270": "https://udemy-images.udemy.com/course/480x270/1240076_7e74_2.jpg",
		  "published_title": "zero-to-hero-in-vex-robotics",
		  "predictive_score": null,
		  "relevancy_score": null,
		  "lecture_search_result": null,
		  "input_features": null
		},
		{
		  "_class": "course",
		  "id": 1141778,
		  "title": "Games and Simulations: The Scratch Masterclass",
		  "url": "/games-and-simulations-scratch-masterclass/",
		  "is_paid": false,
		  "price": "Free",
		  "visible_instructors": [
			{
			  "_class": "user",
			  "id": 20414404,
			  "title": "Sanjin Dedic",
			  "name": "Sanjin",
			  "display_name": "Sanjin Dedic",
			  "job_title": "Teacher, Robotics Engineer",
			  "image_50x50": "https://udemy-images.udemy.com/user/50x50/20414404_b068_2.jpg",
			  "image_100x100": "https://udemy-images.udemy.com/user/100x100/20414404_b068_2.jpg",
			  "url": "/user/sanjin-dedic/"
			}
		  ],
		  "image_125_H": "https://udemy-images.udemy.com/course/125_H/1141778_e551_3.jpg",
		  "image_240x135": "https://udemy-images.udemy.com/course/240x135/1141778_e551_3.jpg",
		  "is_practice_test_course": false,
		  "image_480x270": "https://udemy-images.udemy.com/course/480x270/1141778_e551_3.jpg",
		  "published_title": "games-and-simulations-scratch-masterclass",
		  "predictive_score": null,
		  "relevancy_score": null,
		  "lecture_search_result": null,
		  "input_features": null
		},
		{
		  "_class": "course",
		  "id": 1141780,
		  "title": "Fundmentals in Robot C and VEX Robotics",
		  "url": "/robot-c-and-vex-robotics/",
		  "is_paid": false,
		  "price": "Free",
		  "visible_instructors": [
			{
			  "_class": "user",
			  "id": 20414404,
			  "title": "Sanjin Dedic",
			  "name": "Sanjin",
			  "display_name": "Sanjin Dedic",
			  "job_title": "Teacher, Robotics Engineer",
			  "image_50x50": "https://udemy-images.udemy.com/user/50x50/20414404_b068_2.jpg",
			  "image_100x100": "https://udemy-images.udemy.com/user/100x100/20414404_b068_2.jpg",
			  "url": "/user/sanjin-dedic/"
			}
		  ],
		  "image_125_H": "https://udemy-images.udemy.com/course/125_H/1141780_37df_2.jpg",
		  "image_240x135": "https://udemy-images.udemy.com/course/240x135/1141780_37df_2.jpg",
		  "is_practice_test_course": false,
		  "image_480x270": "https://udemy-images.udemy.com/course/480x270/1141780_37df_2.jpg",
		  "published_title": "robot-c-and-vex-robotics",
		  "predictive_score": null,
		  "relevancy_score": null,
		  "lecture_search_result": null,
		  "input_features": null
		},
		{
		  "_class": "course",
		  "id": 1081830,
		  "title": "Computational Thinking In Python",
		  "url": "/computational-thinking-in-python/",
		  "is_paid": true,
		  "price": "A$105",
		  "visible_instructors": [
			{
			  "_class": "user",
			  "id": 20414404,
			  "title": "Sanjin Dedic",
			  "name": "Sanjin",
			  "display_name": "Sanjin Dedic",
			  "job_title": "Teacher, Robotics Engineer",
			  "image_50x50": "https://udemy-images.udemy.com/user/50x50/20414404_b068_2.jpg",
			  "image_100x100": "https://udemy-images.udemy.com/user/100x100/20414404_b068_2.jpg",
			  "url": "/user/sanjin-dedic/"
			}
		  ],
		  "image_125_H": "https://udemy-images.udemy.com/course/125_H/1081830_aaf5_2.jpg",
		  "image_240x135": "https://udemy-images.udemy.com/course/240x135/1081830_aaf5_2.jpg",
		  "is_practice_test_course": false,
		  "image_480x270": "https://udemy-images.udemy.com/course/480x270/1081830_aaf5_2.jpg",
		  "published_title": "computational-thinking-in-python",
		  "predictive_score": null,
		  "relevancy_score": null,
		  "lecture_search_result": null,
		  "input_features": null
		},
		{
		  "_class": "course",
		  "id": 1051548,
		  "title": "Python Fundamentals",
		  "url": "/python-fundamentals/",
		  "is_paid": true,
		  "price": "A$55",
		  "visible_instructors": [
			{
			  "_class": "user",
			  "id": 20414404,
			  "title": "Sanjin Dedic",
			  "name": "Sanjin",
			  "display_name": "Sanjin Dedic",
			  "job_title": "Teacher, Robotics Engineer",
			  "image_50x50": "https://udemy-images.udemy.com/user/50x50/20414404_b068_2.jpg",
			  "image_100x100": "https://udemy-images.udemy.com/user/100x100/20414404_b068_2.jpg",
			  "url": "/user/sanjin-dedic/"
			}
		  ],
		  "image_125_H": "https://udemy-images.udemy.com/course/125_H/1051548_1085_2.jpg",
		  "image_240x135": "https://udemy-images.udemy.com/course/240x135/1051548_1085_2.jpg",
		  "is_practice_test_course": false,
		  "image_480x270": "https://udemy-images.udemy.com/course/480x270/1051548_1085_2.jpg",
		  "published_title": "python-fundamentals",
		  "predictive_score": null,
		  "relevancy_score": null,
		  "lecture_search_result": null,
		  "input_features": null
		},
		{
		  "_class": "course",
		  "id": 983840,
		  "title": "Scratch Mathematics",
		  "url": "/scratch-mathematics/",
		  "is_paid": false,
		  "price": "Free",
		  "visible_instructors": [
			{
			  "_class": "user",
			  "id": 20414404,
			  "title": "Sanjin Dedic",
			  "name": "Sanjin",
			  "display_name": "Sanjin Dedic",
			  "job_title": "Teacher, Robotics Engineer",
			  "image_50x50": "https://udemy-images.udemy.com/user/50x50/20414404_b068_2.jpg",
			  "image_100x100": "https://udemy-images.udemy.com/user/100x100/20414404_b068_2.jpg",
			  "url": "/user/sanjin-dedic/"
			}
		  ],
		  "image_125_H": "https://udemy-images.udemy.com/course/125_H/983840_4ee9_2.jpg",
		  "image_240x135": "https://udemy-images.udemy.com/course/240x135/983840_4ee9_2.jpg",
		  "is_practice_test_course": false,
		  "image_480x270": "https://udemy-images.udemy.com/course/480x270/983840_4ee9_2.jpg",
		  "published_title": "scratch-mathematics",
		  "predictive_score": null,
		  "relevancy_score": null,
		  "lecture_search_result": null,
		  "input_features": null
		},
		{
		  "_class": "course",
		  "id": 829966,
		  "title": "Scratch Fundamentals",
		  "url": "/coding-with-scratch-junior/",
		  "is_paid": true,
		  "price": "A$30",
		  "visible_instructors": [
			{
			  "_class": "user",
			  "id": 20414404,
			  "title": "Sanjin Dedic",
			  "name": "Sanjin",
			  "display_name": "Sanjin Dedic",
			  "job_title": "Teacher, Robotics Engineer",
			  "image_50x50": "https://udemy-images.udemy.com/user/50x50/20414404_b068_2.jpg",
			  "image_100x100": "https://udemy-images.udemy.com/user/100x100/20414404_b068_2.jpg",
			  "url": "/user/sanjin-dedic/"
			}
		  ],
		  "image_125_H": "https://udemy-images.udemy.com/course/125_H/829966_11b8_3.jpg",
		  "image_240x135": "https://udemy-images.udemy.com/course/240x135/829966_11b8_3.jpg",
		  "is_practice_test_course": false,
		  "image_480x270": "https://udemy-images.udemy.com/course/480x270/829966_11b8_3.jpg",
		  "published_title": "coding-with-scratch-junior",
		  "predictive_score": null,
		  "relevancy_score": null,
		  "lecture_search_result": null,
		  "input_features": null
		}
	  ]
	}
	
	function checkInstructor(instructorsArr) {
		for(var i = 0; i < instructorsArr.length; i++) {
			if (instructorsArr[i].id == "20414404") {
				return true;
			}	
		}
		return false;
	}
	
	angular.forEach(response.results, function(course, key) {
		if (checkInstructor(course.visible_instructors)) {
			var c = {
				"id": course.id,
				"title": course.title,
				//"price": course.price,
				"image": course.image_480x270,
				"link": course.published_title
			}
			$scope.courses.push(c);
		}
	})
	
	coursesContentService.courses = $scope.courses;
}])

//UDEMY CODES VIEW
app.controller('udemyCodesController', ['$scope', 'udemyCodeService', function($scope, udemyCodeService) {
	
	$scope.request = {
		code: '', // user code
		date: -1 // UTC date of request
	}
	$scope.codeRemoved = false; // flag to display/hide #code_removed section on page
	$scope.submitting = false; // disable field while submitting
	$scope.udemyLink = ''; // url of udemy course
	
	// fetches link to Udemy course with relative coupon code
	$scope.getLink = function() {
		$scope.submitting = true;
		var today = new Date();
		$scope.request.date = today.toISOString();
		udemyCodeService.getUdemyCourseLink($scope.request)
			.then(function(result) {
				$scope.submitting = false;
				console.log(result.data);
				if(result.data.success) {
					$scope.udemyLink = result.data.elements.udemyLink;
				} else {
					alert(result.data.message);
					$scope.request.code = '';
					$scope.udemyCodeForm.$setPristine();
				}
			}, function(result) {
				$scope.submitting = false;
				alert('Unable to perform operation.');
			})
	}
	
	//removes code from database after user has followed the link to Udemy
	$scope.removeCode = function() {
		udemyCodeService.removeCode($scope.request)
			.then(function(result){
				if (result.data.success) {
					$scope.codeRemoved = true;
				} 
			}, function(result) {
				$scope.removeCode();
			})
	}
}])

//KITS VIEW
app.controller('kitsController', ['$scope', 'kitsContentService', function($scope, kitsContentService){
	// returns availability of a kit
	$scope.isAvailable =  function(quantity){
		return quantity > 0 ? true : false;
	};
	kitsContentService.getKitsContent()
		.then(function(result) {
			if (result.data.success && !result.data.message.length) {
				angular.forEach(result.data.elements, function(value, key) {
					$scope[key] = value;
				});
			} else {
				//alert("Warning: " + result.data.message);
			}
		}, function() {
			alert("Error: Unable to connect");
	});
}]);

//KIT VIEW
app.controller('kitDetailsController', ['$scope', '$routeParams', 'kitsContentService', function($scope, $routeParams, kitsContentService){
	kitsContentService.getKitDetails($routeParams.kit_id)
		.then(function(result){
			if (result.data.success && !result.data.message.length) {
				angular.forEach(result.data.elements, function(value, key ) {
					if(key == 'kit') {
						$scope[key] = value[0];
					} else {
						$scope[key] = value;
					}
				});
			} else {
				alert("Warning: " + result.data.message);
			}
		}, function(){
			alert('Unable to fetch Product Details!');
		});
	
	// returns boolen variable, if qty > 0: true, else :false
	$scope.isAvailable = function(quantity){
		return quantity > 0;
	};
}]);
