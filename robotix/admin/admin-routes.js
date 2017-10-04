angular.module('RobotixAdmin').config(['$routeProvider', function($routeProvider){
    $routeProvider
	.when('/', {
        templateUrl: 'admin-home/admin-home.html'
        
    })
	.when('/kits', {
		templateUrl: 'kit/cms_kits.html'
		
	})  
	.when('/videos', {
		templateUrl: 'videos/cms_videos.html'
		
	})  
	.when('/elements', {
		templateUrl: 'element/cms_elements.html'
		
	})
    .otherwise({redirectTo: '/'});
}]);