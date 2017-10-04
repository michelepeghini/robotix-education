/* USER ROUTES */

angular.module('Robotix').config(['$routeProvider', function($routeProvider){
    $routeProvider
	// PUBLIC
    .when('/', {
        templateUrl: 'robotix/user/home/home.html'
    })
	.when('/videos', {
		templateUrl: 'robotix/user/videos/videos.html'
	})
	.when('/playlist_:playlist_id', {
		templateUrl: 'robotix/user/videos/playlist.html',
		controller: 'playlistController'
	})
	.when('/playlist_:playlist_id/:video_id', {
		templateUrl: 'robotix/user/videos/playlist_video.html'
	})
	.when('/videos/:video_id', {
		templateUrl: 'robotix/user/videos/video_details.html',
		controller: 'videoDetailsController'
	})
	.when('/courses', {
		templateUrl: 'robotix/user/courses/courses.html'
	})
	.when('/kits', {
		templateUrl: 'robotix/user/kits/kits.html',
		controller: 'kitsController'
	})
	.when('/kits/:kit_id', {
		templateUrl: 'robotix/user/kits/kit_details.html',
		controller: 'kitDetailsController'
	})
	.when('/software', {
		templateUrl: 'robotix/user/software/software.html'
	})
	.when('/udemy', {
		templateUrl: 'robotix/user/udemy/udemy.html'
	})
	//REGISTERED USER
	.when('/account', {
		templateUrl: 'robotix/user/account/account.html',
		controller: 'AccountController'
	})
    .otherwise({
		redirectTo: '/'
	})
}]);