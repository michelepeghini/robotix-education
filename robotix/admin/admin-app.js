var app = angular.module('RobotixAdmin', ['ngRoute', 'ngFileUpload']);

/*--- FILTERS ---*/


/*--- DIRECTIVES ---*/

app.directive('signUp', function () {
	return {
		restrict: 'E',
		templateUrl: '../user/user_access/signup.html',
		controller: 'registrationController'
	};
});

app.directive('logIn', function () {
	return {
		restrict: 'E',
		templateUrl: '../user/user_access/login.html',
		controller: 'logInController'
	};
});

/*--- SERVICES ---*/

// provides server session and session Storage functions 
app.factory('sessionService', ['$http', function ($http) {
	return {
		set: function (key, value) {
			return sessionStorage.setItem(key, JSON.stringify(value));
		},
		get: function (key) {
			return JSON.parse(sessionStorage.getItem(key));
		},
		remove: function (key) {
			sessionStorage.removeItem(key);
		},
		destroySession: function () {
			$http.post('../user/user_access/destroy_session.php');
			sessionStorage.removeItem('user');
			sessionStorage.removeItem('uid');
		}
	};
}]);

// provides log in and log out functions and user details data gathering
app.factory('accountService', ['$http', '$location', 'sessionService', '$rootScope', function ($http, $location, sessionService, $rootScope) {
	return{
		createAdmin: function (user) {
			return $http({
				method: 'POST',
				url: 'account/admin_register.php',
				data: {user}
			});
		},
		logIn: function (user) {
			return $http({
				method: 'POST',
				url: 'account/admin_login.php',
				data: {user}
			});
		},
		broadcastLogIn: function () {
			$rootScope.loggedIn = true;
			$rootScope.$broadcast('loggedIn');
		},
		logOut: function () {
			sessionService.destroySession();
			$location.path('#/');
		},
		getUser: function () {
			return sessionService.get('user');
		},
		sendPassword: function (email) {
			return $http({
				method: 'POST',
				url: 'admin/forgottenPW.php',
				data: {email: email}
			});
		},
		isLoggedIn: function ( ){
			return sessionService.get('user')? true : false;
		},
		editDetails: function (user) {
			return $http({
				method: 'POST',
				url: 'admin/edit_admin_details.php',
				data: {user}
			});
		}
	};
}]);

app.factory('cmsVideosService', ['$http', function ($http) {
	return {
		videos: [], 
		playlists: [],
		kitsList: [],
		editVideo: {}, //video data
		selectedVideo: "", //id of video used to determine where to attach video_editor element
		video_editor: {}, //html form editor element
		getVideosContent: function () {
			return $http({
				method: 'GET',
				url: '../user/videos/videos.php'
			});
		},
		getVideoDetails: function (param) {
			return $http({
				method: 'GET',
				url: '../user/videos/video_details.php',
				params: {video_id: param}
			});
		},
		getYtContent: function(request) {
			return $http({
				method: 'GET',
				url: request
			});
		},
		saveYtVideo: function(video) {
			return $http({
				method: 'POST',
				url: 'videos/save_yt_video.php',
				data: video
			});
		},
		saveYtVideos: function(data) {
			return $http({
				method: 'POST',
				url: 'videos/save_yt_videos.php',
				data: data
			});
		},
		saveVideo: function(data) {
			return $http({
				method: 'PUT',
				url: 'videos/cms_save_video.php',
				data: data
			});
		},
		removeVideo: function(video_id) {
			return $http({
				method: 'DELETE',
				url: 'videos/cms_remove_video.php',
				params: {video_id: video_id}
			});
		}
	};
}]);

app.factory('cmsPlaylistsService', ['$http', function ($http) {
	return {
		playlists: [],
		videos:[],
		editPlaylist: {}, //playlist data
		selectedPlaylist: "", //id of platylist used to determine where to attach playlist_editor element
		playlist_editor: {}, //html form editor element
		getPlaylistsContent: function () {
			return $http({
				method: 'GET',
				url: 'videos/cms_get_playlists_content.php'
			});
		},
		getPlaylistDetails: function (param) {
			return $http({
				method: 'GET',
				url: 'videos/cms_playlist_details.php',
				params: {playlist_id: param}
			});
		},
		savePlaylist: function(data) {
			return $http({
				method: 'PUT',
				url: 'videos/cms_save_playlist.php',
				data: data
			});
		},
		removePlaylist: function(pl_id) {
			return $http({
				method: 'DELETE',
				url: 'videos/cms_remove_playlist.php',
				params: {pl_id: pl_id}
			});
		},
		saveNewPlaylist: function(data) {
			return $http({
				method: 'POST',
				url: 'videos/cms_save_new_playlist.php',
				data: {playlist: data}
			});
		}
	};
}]);

app.factory('cmsCoursesService', ['$http', function ($http) {
	return {
		courses: [],
		videos:[],
		editCourse: {}, //course data
		selectedCourse: "", //id of course used to determine where to attach course_editor element
		course_editor: {}, //html form editor element
		getCoursesContent: function () {
			return $http({
				method: 'GET',
				url: 'videos/cms_get_courses_content.php'
			});
		},
		getCourseDetails: function (param) {
			return $http({
				method: 'GET',
				url: 'videos/cms_course_details.php',
				params: {course_id: param}
			});
		},
		saveCourse: function(data) {
			return $http({
				method: 'PUT',
				url: 'videos/cms_save_course.php',
				data: data
			});
		},
		removeCourse: function(course_id) {
			return $http({
				method: 'DELETE',
				url: 'videos/cms_remove_course.php',
				params: {course_id: course_id}
			});
		},
		saveNewCourse: function(data) {
			return $http({
				method: 'POST',
				url: 'videos/cms_save_new_course.php',
				data: {course: data}
			});
		}
	};
}]);

app.factory('cmsKitsService', ['$http', function ($http) {
	return {
		kits: [],
		components: [],
		videos: [],
		editKit: {},
		editKfv: {},
		selectedKit: "", //id of kit used to determine where to attach kit_editor element
		selectedKfv: "", //id of kit used to determine where to attach kfv_editor element
		kit_editor: {}, //html form editor element
		kfv_editor: {}, //html form editor element
		getKitsContent: function () {
			return $http({
				method: 'GET',
				url: 'kit/cms_kits.php'
			});
		},
		getKitDetails: function (param) {
			return $http({
				mehtod: 'GET',
				url: 'kit/cms_kit_details.php',
				params: {kit_id: param}
			});
		},
		saveNewKit: function(data) {
			return $http({
				method: 'POST',
				url: 'kit/cms_save_new_kit.php',
				data: {kit: data}
			});
		},
		saveKit: function(data) {
			return $http({
				method: 'PUT',
				url: 'kit/cms_save_kit.php',
				data: {kit: data}
			});
		},
		removeKit: function(kit_id) {
			return $http({
				method: 'DELETE',
				url: 'kit/cms_remove_kit.php',
				params: {kit_id: kit_id}
			});
		},
		saveNewComponent: function(data) {
			return $http({
				method: 'POST',
				url: 'kit/cms_save_new_component.php',
				data: {component: data}
			});
		},
		removeComponent: function(comp_id) {
			return $http({
				method: 'DELETE',
				url: 'kit/cms_remove_component.php',
				params: {component_id: comp_id}
			});
		},
		getKfvDetails: function (param) {
			return $http({
				mehtod: 'GET',
				url: 'kit/cms_kfv_details.php',
				params: {kit_id: param}
			});
		},
		saveKfv: function(data) {
			return $http({
				method: 'PUT',
				url: 'kit/cms_save_kfv.php',
				data: {kit: data}
			});
		},
	};
}]);

app.factory('cmsElementsService', ['$http', function ($http) {
	return {
		elements: [],
		editElement: {},
		selectedElement: "", //id of element used to determine where to attach video_editor element
		element_editor: {}, //html form editor element	
		links: [
			{name: 'Software', link: 'software'},
			{name: 'Videos', link: 'videos'},
			{name: 'Kits', link: 'kits'},
			{name: 'Courses', link: 'courses'}
		],	//list of paths to use in link
		getElementsContent: function () {
			return $http({
				method: 'GET',
				url: 'element/cms_elements.php'
			});
		},
		getElementDetails: function (param) {
			return $http({
				mehtod: 'GET',
				url: 'element/cms_element_details.php',
				params: {element_id: param}
			});
		},
		saveNewElement: function(data) {
			return $http({
				method: 'POST',
				url: 'element/cms_save_new_element.php',
				data: {element: data}
			});
		},
		saveElement: function(data) {
			return $http({
				method: 'PUT',
				url: 'element/cms_save_element.php',
				data: {element: data}
			});
		},
		removeElement: function(element_id) {
			return $http({
				method: 'DELETE',
				url: 'element/cms_remove_element.php',
				params: {element_id: element_id}
			});
		}
	};
}]);

app.factory('cmsFilesService', ['$http', 'Upload', function($http, Upload){
	return {
		remove: function(fileName, elementId, opType){
			return $http({
				method: 'DELETE',
				url: '../common/cms_file_remove.php',
				data: {
					file_name: fileName,
					element_id: elementId,
					op_type: opType
				}
			});
		},
		upload: function(file, elementId, opType){
			return Upload.upload({
				method: 'POST',
				url: '../common/cms_file_upload.php',
				file: file,
				data: {
					element_id: elementId,
					op_type: opType
				}
			});
		}
	};
}]);

/*--- CONTROLLERS ---*/

app.controller('navigationController', ['$scope', 'accountService', '$location', function ($scope, accountService, $location) {
	//determines visible elements of navigation
	$scope.loggedIn = accountService.isLoggedIn();
	
	$scope.$on('loggedIn', function(){
		$scope.loggedIn = accountService.isLoggedIn();
		$('#log_in').modal('hide');
	});
	
	// checks if logged in when accessing any route
	$scope.$on('$routeChangeSuccess', function(evt, curr, prev) {
		if (!$scope.loggedIn){
			$('#log_in').modal('show');
		}
	});
	
	$scope.logOut =  function() {
		accountService.logOut();
		$scope.loggedIn = accountService.isLoggedIn();
		$('#log_in').modal('show');	
	};
	
}]);

// controller for creating a new Admin account
app.controller('registrationController', ['$scope', 'accountService', 'sessionService', function($scope, accountService, sessionService){

	$scope.user = {
		id: '',
		email: '',
		password: ''		
	};
	$scope.errorMessage = '';
	
	//disable form fields between submission and response
	$scope.isSaving = false;

	//password match
	$scope.confirm_password='';
	$scope.passwordMatch = function(){
		if ($scope.confirm_password === $scope.user.password){
			return 'valid_field';
		} else {
			return 'invalid_field';
		}
	};
	
	$scope.$watch('confirm_password', function(){
		$scope.passwordMatch();
	});
	
	$scope.resetForm = function() {
		$scope.user.email = '';
		$scope.user.password = '';
		$scope.confirm_password = '';
	};
	
	//register user: data from form is bound to $scope.account
	$scope.signUp = function(){
		$scope.isSaving = true;
		if ($scope.signupForm.$valid && $scope.confirm_password === $scope.user.password){
			accountService.createAdmin($scope.user)
				.then(function(result){
					if (result.data.success) {
						$scope.isSaving = false;
						$scope.user.id = result.data.elements.user_id;
						sessionService.set('user', $scope.user);
						sessionService.set('uid', result.data.elements.uid);
						$('#sign_up').modal('hide');
						accountService.broadcastLogIn();
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
		} else {
			alert('Invalid form. Check fields!');
		}
	};
}]);

// controller for Log In View	
app.controller('logInController', ['$scope', 'accountService', 'sessionService', function($scope, accountService, sessionService){
	
	$('#log_in').on('hidden.bs.modal', function () {
    	if (!accountService.isLoggedIn()) {
			$('#log_in').modal('show');
		}
	});
	//removes link to signUp form 
	$('.switch_form').hide();
	
	//initialize user 
	$scope.user = {
		email: '',
		password: ''
	};
	//prevent closing modal without logging in
	$scope.redirect = function() {
		$('#log_in').modal('show');
	};
	
	$scope.isSaving = false; //disables form fields while login request is processing
	$scope.errorMessage = '';
	
	$scope.resetForm = function() {
		$scope.user.email = '';
		$scope.user.password = '';
	};
		
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
					sessionService.set('user', $scope.user);
					sessionService.set('uid', result.data.elements.uid);
					$scope.resetForm();
					$scope.isSaving = false;
					$('#log_in').modal('hide');
					accountService.broadcastLogIn();
				}
				else  {
					$scope.isSaving = false; //enable formfields
					$scope.resetForm();
					$scope.errorMessage = result.data.message[0];
				}
			}, function(result){
				$scope.processing = false; //enable formfields
				$scope.errorMessage = 'Server error! Unable to log in.';
				$scope.resetForm();
			});
	};
}]);

app.controller('adminHomeController', ['$scope', 'accountService', function($scope, accountService) {
	
}]);

/* VIDEOS */
app.controller('videoTabsController', ['$scope', function($scope) {
	
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
	
	// needed for display of video_editor element, recieves event from cmsVideosController and broacast to videoEditController
	$scope.$on('videoDetails', function() {
		$scope.$broadcast('videoDetails');
	});
	
	// needed for removing of videoEdit data in videoEditController recieves event from cmsVideosController and broacast to videoEditController
	$scope.$on('hideEditor', function() {
		$scope.$broadcast('hideEditor');
	});
}]);

app.controller('ytPlaylistController', ['$scope', 'cmsVideosService', function($scope, cmsVideosService) {
	//determines visibility of playlist elements
	$scope.playlistLoaded = false;
	
	//determines visibility of videos in playlist
	$scope.videosLoaded = false;
	
	//parameters for API request
	$scope.requestOptions = {
    	playlistId: '',
    	part: 'snippet',
		maxResults: 50
  	};
	
	// Retrieves playlist and videos details from You Tube
	$scope.loadPlaylist = function() {
		//API request for playlist items
		var requestItems = "https://www.googleapis.com/youtube/v3/playlistItems?part="+$scope.requestOptions.part+"&maxResults="+$scope.requestOptions.maxResults+"&playlistId="+$scope.requestOptions.playlistId+"&fields=items(id%2Ckind%2Csnippet(description%2CresourceId%2FvideoId%2Ctitle))&key=AIzaSyAie6ZgbO9PXLfzr999pqyk3rGuApM8Azs";
		
		//API request for playlist details
		var requestPlaylist = "https://www.googleapis.com/youtube/v3/playlists?part="+$scope.requestOptions.part+"&id="+$scope.requestOptions.playlistId+"&fields=items(id%2Csnippet(description%2Ctitle))&key=AIzaSyAie6ZgbO9PXLfzr999pqyk3rGuApM8Azs";
		
		//request playlist details
		cmsVideosService.getYtContent(requestPlaylist)
			.then(function(result) {
				$scope.playlist = {
					name: result.data.items[0].snippet.title,
					description: result.data.items[0].snippet.description,
					yt_pl_id: result.data.items[0].id
				};
				$scope.playlistLoaded = true;
			}, function(result) {
				alert("Unable to retrieve playlist data!");
		});
		
		//request playlist items
		cmsVideosService.getYtContent(requestItems)
			.then(function(result) {
				$scope.videos = [];
				angular.forEach(result.data.items, function(item) {
					var video = {
						name: item.snippet.title,
						description: item.snippet.description,
						yt_id: item.snippet.resourceId.videoId
					};
					$scope.videos.push(video);
				});
				$scope.videosLoaded = true;
			}, function(result) {
				alert("Unable to retrieve videos data!");	
		});
	};
	
	// Removes video from playlist 
	$scope.removeVideo = function(idx) {
		$scope.videos.splice(idx,1);
	};
	
	//save videos and playlist to DB
	$scope.saveYtVideos = function() {
		data = {
			params: {
				playlist: $scope.playlist,
				videos: $scope.videos
			}
		};
		cmsVideosService.saveYtVideos(data)
			.then(function(result) {
				$scope.videos = [];
				$scope.playlist = {};
				$scope.playlistLoaded = false;
				$scope.videosLoaded = false;
				$scope.requestOptions.playlistId = '';
			}, function(result) {
				
		});
	};
}]);

app.controller('ytVideoController', ['$scope', 'cmsVideosService', function($scope, cmsVideosService) {

	//determines visibility of single video
	$scope.videoLoaded = false;
	
	//parameters for API request
	$scope.requestOptions = {
		videoId: '',
    	part: 'snippet',
		maxResults: 1
  	};
	
	// Retrieves single video details from You Tube
	$scope.loadVideo = function() {
		var requestVideo = "https://www.googleapis.com/youtube/v3/videos?part="+$scope.requestOptions.part+"&id="+$scope.requestOptions.videoId+"&fields=items(id%2Csnippet(description%2Ctitle))&key=AIzaSyAie6ZgbO9PXLfzr999pqyk3rGuApM8Azs";
		
		cmsVideosService.getYtContent(requestVideo)
			.then(function(result) {
				$scope.video = {
					name: result.data.items[0].snippet.title,
					description: result.data.items[0].snippet.description,
					yt_id: result.data.items[0].id
				};
				$scope.videoLoaded = true;
			}, function(result) {
				
		});
	};
	
	// Clears single video 
	$scope.removeSingleVideo = function() {
		$scope.video = {
			name: '',
			description: '',
			yt_id: ''
		};
		$scope.videoLoaded = false;
	};
	
	//save single video to DB
	$scope.saveYtVideo = function() {
		var video = {
			video: $scope.video
		};
		cmsVideosService.saveYtVideo(video)
			.then(function(result) {
				$scope.removeSingleVideo();
				$scope.requestOptions.videoId = '';
				$scope.videoLoaded = false;
			}, function(result) {
				
		});
	};
}]);


app.controller('cmsVideosController', ['$scope', 'cmsVideosService', 'cmsFilesService', function($scope, cmsVideosService, cmsFilesService) {
	
	//id of playlist used to filter videos
	$scope.playlistSelector = "";
	//id of kit used to filter videos
	$scope.kitSelector = "";
	
	//stores video_editor element for detach/append operations
	cmsVideosService.video_editor = $('#video_editor').detach();
	
	// Retrieves single video data and stores it into session storage
	$scope.getVideoDetails = function(video_id) {
		cmsVideosService.getVideoDetails(video_id)
			.then(function(result) {
			if (result.data.success) {
				cmsVideosService.editVideo = result.data.elements.video[0];
				cmsVideosService.editVideo.videoInPlaylists = result.data.elements.videoInPlaylists;
				cmsVideosService.editVideo.kitsForVideo = result.data.elements.kitsForVideo;
				cmsVideosService.video_editor.insertBefore('#cmsVideo_'+video_id+' .partial_separator');
			}
		}, function(result) {
			alert("Unable to get video details");
		});
	};
	
	//set selectedVideo variable
	$scope.selectVideo = function(video_id) {
		if(cmsVideosService.selectedVideo === video_id) {
			cmsVideosService.selectedVideo = ""; //toogles selection if video is already selected
			cmsVideosService.video_editor = $('#video_editor').detach();
			$('#cmsVideo_'+video_id).removeClass('selected');
		} else {
			$('#cmsVideo_'+cmsVideosService.selectedVideo).removeClass('selected');
			cmsVideosService.selectedVideo = video_id; //new selection, update selectedVideo
			$scope.getVideoDetails(video_id);
			$('#cmsVideo_'+video_id).addClass('selected');
		}	
	};
	
	// Removes video from DB
	$scope.removeVideo = function(video_id) {
		cmsVideosService.removeVideo(video_id)
			.then(function(result) {
				if (result.data.success) {
					// Remove video from videos collection
					cmsVideosService.selectedVideo = ""; //toogles selection if video is already selected
					cmsVideosService.video_editor = $('#video_editor').detach();
					$('#cmsVideo_'+video_id).removeClass('selected');
					var index = cmsVideosService.videos.map(function(v){return v.id;}).indexOf(video_id);
					cmsVideosService.videos.splice(index,1);
				} else{
					alert(result.data.message);
				}
		}, function(result) {
			alert("Unable to remove video");
		});
	};
	
	// Get all videos from DB 
	cmsVideosService.getVideosContent()
		.then(function (result) {
			if (result.data.success) {
				angular.forEach(result.data.elements, function(value, key) {
					$scope[key] = value;
					cmsVideosService[key] = value;
				});
			} else {
				alert("Warning: " + result.data.message);
			}
		}, function() {
			alert("Error: Unable to connect");
	});
}]);

app.controller('videoEditController', ['$scope', 'cmsVideosService', 'Upload', 'cmsFilesService', function($scope, cmsVideosService, Upload, cmsFilesService) {
		
	// determines which files will be removed on update
	$scope.fileRemove = {
		manual: false,
		code: false
	};
	
	//checks if a paylist has a video in it or not
	$scope.checkPlaylist = function(playlist_id) {
		for(var	i = 0; i < $scope.editVideo.videoInPlaylists.length; i++) {
			if ($scope.editVideo.videoInPlaylists[i].id === playlist_id) {
				return true;
			}
		}
		return false;
	};
	
	//checks if a kit can build a video or not
	$scope.checkKit = function(kit_id) {
		for(var	i = 0; i < $scope.editVideo.kitsForVideo.length; i++) {
		if ($scope.editVideo.kitsForVideo[i].id === kit_id) {
				return true;
			}
		}
		return false;				
	};
	
	//toggles playlists' checkbutton and adds or remove playlists in videoInPlaylist array
	$scope.togglePlaylist = function(playlist) {
		if ($('#pl_'+playlist.id).prop('checked')) {
			for(var	i = 0; i < $scope.editVideo.videoInPlaylists.length; i++) {
				if ($scope.editVideo.videoInPlaylists[i].id === playlist.id) {
					$scope.editVideo.videoInPlaylists.splice(i, 1);
					return;
				}
			}
		} else {
			$scope.editVideo.videoInPlaylists.push(playlist);
		}
	};
	
	//toggles kits' checkbutton and adds or remove kits in kitsForVideo array
	$scope.toggleKit = function(kit) {
		if ($('#k_'+kit.id).prop('checked')) {
			for(var	i = 0; i < $scope.editVideo.kitsForVideo.length; i++) {
				if ($scope.editVideo.kitsForVideo[i].id === kit.id) {
					$scope.editVideo.kitsForVideo.splice(i, 1);
					return;
				}
			}
		} else {
			$scope.editVideo.kitsForVideo.push(kit);
		}
	};
	
	// clears file input
	$scope.clearUpload = function(element_id) {
		$(element_id).val(undefined);	
		$(element_id).get(0).files[0] = undefined;
		if(element_id.indexOf('manual') === -1) {
			$scope.codeFile = undefined;	
		} else {
			$scope.manualFile = undefined;	
		}
	};
	
	// toggles file remove operation
	$scope.toggleRemove = function(fileType) {
		$scope.fileRemove[fileType]? $scope.fileRemove[fileType] = false : $scope.fileRemove[fileType] = true;
	};
	
	//get editVideo data from cmsVideoService whenever data in service is updated 
	$scope.videoService = cmsVideosService;
	$scope.$watch('videoService.editVideo', function(newVideo) {
		$scope.playlists = cmsVideosService.playlists;
		$scope.kitsList = cmsVideosService.kitsList;
		$scope.editVideo = newVideo;
	});
	
	// upload a file to directory relative to selected video
	$scope.uploadFile = function(file, video_id, opType, fileType) {
		cmsFilesService.upload(file, video_id, opType)
			.then(function(result) {
				if(!result.data.success) {
					alert(result.data.message);
				}
		}, function(result) {
			alert("Upload of " + fileType + " falied!");
		});
	};
	
	// removes a file from directory relative to selected video
	$scope.removeFile = function(fileName, video_id, opType) {
		cmsFilesService.remove(fileName, video_id, opType)
			.then(function(result) {
				if(!result.data.success) {
					alert(result.data.message);
				}
		}, function(result) {
			alert("File remove failed! Operation aborted.");
		});
	};

	// stores video data to DB and uploads files, if any
	$scope.saveVideo = function() {
		//ask for confirmation with a dialog
		if(confirm("This will update the video information.\nInculindg File Uploads!\n\nAre you sure?") === true) {
			
			//update Manual file name before updating video element
			if ($scope.manualFile) {$scope.editVideo.manual = $scope.editVideo.id + '.' + $scope.manualFile.name.split('.').pop();}
			
			//update Code file name before updating video element
			if ($scope.codeFile) {$scope.editVideo.code = $scope.editVideo.id + '.' + $scope.codeFile.name.split('.').pop();}
			
			//removal of Manual file selected
			if ($scope.fileRemove.manual) {
				cmsFilesService.remove($scope.editVideo.manual, $scope.editVideo.id, 'video');
				$scope.editVideo.manual = '';	
				$scope.toggleRemove('manual');
			}
			//removal of Code file selected
			if ($scope.fileRemove.code) {
				cmsFilesService.remove($scope.editVideo.code, $scope.editVideo.id, 'video');
				$scope.editVideo.code = '';
				$scope.toggleRemove('code');
			}
			
			// save updated video data to DB
			cmsVideosService.saveVideo($scope.editVideo)
				.then(function(result) {
				if (result.data.success) {
					// update video name in cmsVideosServce.videos
					var index = cmsVideosService.videos.map(function(v){return v.id;}).indexOf($scope.editVideo.id);
					cmsVideosService.videos[index].name = $scope.editVideo.name;
									
					// if Manual file present, upload file
					if($scope.manualFile) {
						$scope.uploadFile($scope.manualFile, $scope.editVideo.id, 'video', 'manual');
						$scope.clearUpload('#manual');
					}

					// check for Code File, upload file
					if($scope.codeFile) {
						$scope.uploadFile($scope.codeFile, $scope.editVideo.id, 'video', 'code');
						$scope.clearUpload('#code');
					}
					
					// remove editor
					cmsVideosService.selectedVideo = "";
					cmsVideosService.video_editor = $('#video_editor').detach();
					$('#cmsVideo_'+$scope.editVideo.id).removeClass('selected');
					
					alert("Video updated successfully!");
				} else {
					alert(result.data.message);
				}
			}, function(result) {
				alert("Unable to perform operation!");
			})
		}
	};
}]);

/* PLAYLISTS */
app.controller('newPlaylistController', ['$scope', 'cmsPlaylistsService', function($scope, cmsPlaylistsService) {
	
	$scope.saveNewPlaylist = function () {
		cmsPlaylistsService.saveNewPlaylist($scope.newPlaylist)
		.then(function(result) {
			if(result.data.success) {
				cmsPlaylistsService.playlists.push(result.data.elements.playlist);
				alert("Playlist added successfully!");
			} else {
				alert(result.data.message);
			}
		}, function(result) {
			alert("Unable to save new Playlist");
		})
	};
}]);

app.controller('cmsPlaylistsController', ['$scope', 'cmsPlaylistsService', 'cmsFilesService', function($scope, cmsPlaylistsService, cmsFilesService) {
	
	//stores playlist_editor element for detach/append operations
	cmsPlaylistsService.playlist_editor = $('#playlist_editor').detach();
	
	// Retrieves single playlists data
	$scope.getPlaylistDetails = function(pl_id) {
		cmsPlaylistsService.getPlaylistDetails(pl_id)
			.then (function(result) {
				if (result.data.success) {
					cmsPlaylistsService.editPlaylist = result.data.elements.playlist;
					cmsPlaylistsService.editPlaylist.videosInPlaylist = result.data.elements.videosInPlaylist;
					cmsPlaylistsService.playlist_editor.insertBefore('#cmsPlaylist_'+pl_id+' .partial_separator');
				}
		}, function(result) {
			alert("Unable to retrieve Playlist information!");
		})
	};
	
	//set selectedPlaylist variable
	$scope.selectPlaylist = function(playlist_id) {
		if(cmsPlaylistsService.selectedPlaylist === playlist_id) {
			cmsPlaylistsService.selectedPlaylist = ""; //toogles selection if playlist is already selected
			cmsPlaylistsService.playlist_editor = $('#playlist_editor').detach();
			$('#cmsPlaylist_'+playlist_id).removeClass('selected');
		} else {
			$('#cmsPlaylist_'+cmsPlaylistsService.selectedPlaylist).removeClass('selected');
			cmsPlaylistsService.selectedPlaylist = playlist_id; //new selection, update selectedPlaylist
			$scope.getPlaylistDetails(playlist_id);
			$('#cmsPlaylist_'+playlist_id).addClass('selected');
		}	
	};
	
	// Removes playlist from DB
	$scope.removePlaylist = function(playlist_id) {
		if(confirm("This will remove the playlist! \n\nAre you sure?") === true){
			cmsPlaylistsService.removePlaylist(playlist_id)
				.then(function(result) {
					if (result.data.success) {
						// Remove playlist from playlists collection
						cmsPlaylistsService.selectedPlaylist = ""; //toogles selection if playlist is already selected
						cmsPlaylistsService.playlist_editor = $('#playlist_editor').detach();
						$('#cmsPlaylist_'+playlist_id).removeClass('selected');
						var index = cmsPlaylistsService.playlists.map(function(pl){return pl.id;}).indexOf(playlist_id);
						cmsPlaylistsService.playlists.splice(index,1);
						$scope.playlists.splice(index,1);
						alert("Playlist removed successfully!");
					} else{
						alert(result.data.message);
					}
			}, function(result) {
				alert("Unable to remove playlist");
			});
		};
	};
	
	cmsPlaylistsService.getPlaylistsContent()
		.then(function(result){
			if (result.data.success) {
				angular.forEach(result.data.elements, function(value, key) {
					$scope[key] = value;
					cmsPlaylistsService[key] = value;
				});
			} else {
				alert(result.data.message);
			}
	}, function(result){
		alert("unable to retrieve list of playlists!");
	});
}]);

app.controller('playlistEditController', ['$scope', 'cmsPlaylistsService', 'Upload', 'cmsFilesService', function($scope, cmsPlaylistsService, Upload, cmsFilesService) {
			
	//checks if a video in currently edited playlist or not
	$scope.checkVideo = function(video_id) {
		for(var	i = 0; i < $scope.editPlaylist.videosInPlaylist.length; i++) {
			if ($scope.editPlaylist.videosInPlaylist[i].video_id === video_id) {
				return true;
			}
		}
		return false;
	};
		
	//toggles video's checkbutton and adds or remove video in videosInPlaylist array
	$scope.toggleVideo = function(video) {
		$scope.editedVIPlist = true;
		if ($('#v_'+video.id).prop('checked')) {
			$('#v_'+video.id).prop('checked' , false);
		} else {
			$('#v_'+video.id).prop('checked' , true);
		}
	};
	
	// flag to determine if Videos in Playlist has been modified
	$scope.editedVIPlist = false;
	
	//selects all video checkboxes from form and returns array of id of selected videos
	$scope.listVideosInPlaylist = function(){
		var videosInPlaylist = [];
		$('.video_in_pl li input[type=checkbox]').each(function() {
			if ($(this).prop('checked')){
				var currentVideo = $scope.videos.map(function(video){return video.id}).indexOf($(this).prop('value'));
				videosInPlaylist.push($scope.videos[currentVideo]);
				}
		});
		return videosInPlaylist;
	};
	
	//get editPalylist data from cmsPalylistService whenever data in service is updated 
	$scope.playlistsService = cmsPlaylistsService;
	$scope.$watch('playlistsService.editPlaylist', function(newPlaylist) {
		$scope.videos = cmsPlaylistsService.videos;
		$scope.editPlaylist = newPlaylist;
	});
	
	// stores playlist data to DB
	$scope.savePlaylist = function() {
		//ask for confirmation with a dialog
		if(confirm("This will update the playlist information. \n\nAre you sure?") === true) {
			// set list of edited videos in playlist
			$scope.editedVIPlist ? $scope.editPlaylist.videosInPlaylist = $scope.listVideosInPlaylist() : $scope.editPlaylist.videosInPlaylist = [];
			// save updated playlist data to DB
			cmsPlaylistsService.savePlaylist($scope.editPlaylist)
				.then(function(result) {
				if (result.data.success) {
					// update playlist name in cmsPlaylistsServce.playlists
					var index = cmsPlaylistsService.playlists.map(function(pl){return pl.id;}).indexOf($scope.editPlaylist.id);
					cmsPlaylistsService.playlists[index].name = $scope.editPlaylist.name;
														
					// remove editor
					cmsPlaylistsService.selectedPlaylist = "";
					cmsPlaylistsService.playlist_editor = $('#playlist_editor').detach();
					$('#cmsPlaylist_'+$scope.editPlaylist.id).removeClass('selected');
					
					alert("Playlist updated successfully!");
				} else {
					alert(result.data.message);
				}
			}, function(result) {
				alert("Unable to perform operation!");
			})
		}
	};
}]);

/* COURSES */
app.controller('newCourseController', ['$scope', 'cmsCoursesService', function($scope, cmsCoursesService) {
	
	$scope.saveNewCourse = function () {
		cmsCoursesService.saveNewCourse($scope.newCourse)
		.then(function(result) {
			if(result.data.success) {
				cmsCoursesService.courses.push(result.data.elements.course);
				alert("Course added successfully!");
			} else {
				alert(result.data.message);
			}
		}, function(result) {
			alert("Unable to save new Course");
		})
	};
}]);

app.controller('cmsCoursesController', ['$scope', 'cmsCoursesService', function($scope, cmsCoursesService) {
	
	//stores course_editor element for detach/append operations
	cmsCoursesService.course_editor = $('#course_editor').detach();
	
	// Retrieves single courses data
	$scope.getCourseDetails = function(course_id) {
		cmsCoursesService.getCourseDetails(course_id)
			.then (function(result) {
				if (result.data.success) {
					cmsCoursesService.editCourse = result.data.elements.course;
					cmsCoursesService.editCourse.videosInCourse = result.data.elements.videosInCourse;
					cmsCoursesService.course_editor.insertBefore('#cmsCourse_'+course_id+' .partial_separator');
				}
		}, function(result) {
			alert("Unable to retrieve Course information!");
		})
	};
	
	//set selectedCourse variable
	$scope.selectCourse = function(course_id) {
		if(cmsCoursesService.selectedCourse === course_id) {
			cmsCoursesService.selectedCourse = ""; //toogles selection if course is already selected
			cmsCoursesService.course_editor = $('#course_editor').detach();
			$('#cmsCourse_'+course_id).removeClass('selected');
		} else {
			$('#cmsCourse_'+cmsCoursesService.selectedCourse).removeClass('selected');
			cmsCoursesService.selectedCourse = course_id; //new selection, update selectedCourse
			$scope.getCourseDetails(course_id);
			$('#cmsCourse_'+course_id).addClass('selected');
		}	
	};
	
	// Removes course from DB
	$scope.removeCourse = function(course_id) {
		if(confirm("This will remove the course! \n\nAre you sure?") === true){
			cmsCoursesService.removeCourse(course_id)
				.then(function(result) {
					if (result.data.success) {
						// Remove course from courses collection
						cmsCoursesService.selectedCourse = ""; //toogles selection if course is already selected
						cmsCoursesService.course_editor = $('#course_editor').detach();
						$('#cmsCourse_'+course_id).removeClass('selected');
						var index = cmsCoursesService.courses.map(function(pl){return pl.id;}).indexOf(course_id);
						cmsCoursesService.courses.splice(index,1);
						$scope.courses.splice(index,1);
						alert("Course removed successfully!");
					} else{
						alert(result.data.message);
					}
			}, function(result) {
				alert("Unable to remove course");
			});
		};
	};
	
	cmsCoursesService.getCoursesContent()
		.then(function(result){
			if (result.data.success) {
				angular.forEach(result.data.elements, function(value, key) {
					$scope[key] = value;
					cmsCoursesService[key] = value;
				});
			} else {
				alert(result.data.message);
			}
	}, function(result){
		alert("unable to retrieve list of courses!");
	});
}]);

app.controller('courseEditController', ['$scope', 'cmsCoursesService', function($scope, cmsCoursesService) {
	
	//checks if a video in currently edited course or not
	$scope.checkVideo = function(video_id) {
		for(var	i = 0; i < $scope.editCourse.videosInCourse.length; i++) {
			if ($scope.editCourse.videosInCourse[i].video_id === video_id) {
				return true;
			}
		}
		return false;
	};
		
	//toggles video's checkbutton and adds or remove video in videosInCourse array
	$scope.toggleVideo = function(video) {
		$scope.editedVIClist = true;
		if ($('#v_'+video.id).prop('checked')) {
			$('#v_'+video.id).prop('checked' , false);
		} else {
			$('#v_'+video.id).prop('checked' , true);
		}
	};
	
	// flag to determine if Videos in Course has been modified
	$scope.editedVIClist = false;
	
	//selects all video checkboxes from form and returns array of id of selected videos
	$scope.listVideosInCourse = function(){
		var videosInCourse = [];
		$('.video_in_course li input[type=checkbox]').each(function() {
			if ($(this).prop('checked')){
				var currentVideo = $scope.videos.map(function(video){return video.id}).indexOf($(this).prop('value'));
				videosInCourse.push($scope.videos[currentVideo]);
				}
		});
		return videosInCourse;
	};
	
	//get editCourse data from cmsPalylistService whenever data in service is updated 
	$scope.coursesService = cmsCoursesService;
	$scope.$watch('coursesService.editCourse', function(newCourse) {
		$scope.videos = cmsCoursesService.videos;
		$scope.editCourse = newCourse;
	});
	
	// stores course data to DB
	$scope.saveCourse = function() {
		//ask for confirmation with a dialog
		if(confirm("This will update the course information. \n\nAre you sure?") === true) {
			// set list of edited videos in course
			$scope.editedVIClist ? $scope.editCourse.videosInCourse = $scope.listVideosInCourse() : $scope.editCourse.videosInCourse = [];
			// save updated course data to DB
			cmsCoursesService.saveCourse($scope.editCourse)
				.then(function(result) {
				if (result.data.success) {
					// update course name in cmsCoursesServce.courses
					var index = cmsCoursesService.courses.map(function(pl){return pl.id;}).indexOf($scope.editCourse.id);
					cmsCoursesService.courses[index].name = $scope.editCourse.name;
														
					// remove editor
					cmsCoursesService.selectedCourse = "";
					cmsCoursesService.course_editor = $('#course_editor').detach();
					$('#cmsCourse_'+$scope.editCourse.id).removeClass('selected');
					
					alert("Course updated successfully!");
				} else {
					alert(result.data.message);
				}
			}, function(result) {
				alert("Unable to perform operation!");
			})
		}
	};
}]);
/* KITS */
app.controller('kitTabsController', ['$scope', function($scope) {
	
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
	
	// needed for display of kit_editor element, recieves event from cmskitsController and broacast to kitEditController
	$scope.$on('kitDetails', function() {
		$scope.$broadcast('kitDetails');
	});
	
	// needed for removing of kitEdit data in kitEditController recieves event from cmskitsController and broacast to kitEditController
	$scope.$on('hideEditor', function() {
		$scope.$broadcast('hideEditor');
	});
}]);

app.controller('newKitController', ['$scope', 'cmsKitsService', 'Upload', 'cmsFilesService', function($scope, cmsKitsService, Upload, cmsFilesService) {
	
	// clears file input
	$scope.clearUpload = function(element_id) {
		$(element_id).val(undefined);	
		$(element_id).get(0).files[0] = undefined;
		$scope.newImageFile = undefined;	
	};
				
	// stores kit data to DB and uploads files, if any
	$scope.saveNewKit = function() {
		//ask for confirmation with a dialog
		if(confirm("This will save the new kit.\n\nAre you sure?") === true) {
			// save updated kit data to DB
			cmsKitsService.saveNewKit($scope.newKit)
				.then(function(result) {
				if (result.data.success) {
					cmsKitsService.kits.push(result.data.elements.kit);
					$scope.newKit.name = "";
					$scope.newKit.description = "";
					$scope.newKit.price = "";
					$('#newKitName').removeClass('ng-dirty');
					$('#newKitDescription').removeClass('ng-dirty');
					$('#newKitPrice').removeClass('ng-dirty');
					$('#newKitName').addClass('ng-pristine');
					$('#newKitDescription').addClass('ng-pristine');
					$('#newKitPrice').addClass('ng-pristine');
					alert("Kit updated successfully!");
				} else {
					alert(result.data.message);
				}
			}, function(result) {
				alert("Unable to perform operation!");
			})
		}
	};
}]);

app.controller('cmsKitsController', ['$scope', 'cmsKitsService', 'cmsFilesService', function($scope, cmsKitsService, cmsFilesService) {
	
	//stores Kit_editor element for detach/append operations
	cmsKitsService.kit_editor = $('#kit_editor').detach();
	
	// Retrieves single kit data and stores it into session storage
	$scope.getKitDetails = function(kit_id) {
		cmsKitsService.getKitDetails(kit_id)
			.then(function(result) {
			if (result.data.success) {				
				cmsKitsService.editKit = result.data.elements.kit;
				cmsKitsService.editKit.price = parseFloat(cmsKitsService.editKit.price);
				// Convert quantities of components to integers
				for(var i = 0; i< cmsKitsService.editKit.componentsInKit.length; i++) {
					cmsKitsService.editKit.componentsInKit[i].qty = parseInt(cmsKitsService.editKit.componentsInKit[i].qty);
				};
				cmsKitsService.kit_editor.insertBefore('#cmsKit_'+kit_id+' .partial_separator');
			}
		}, function(result) {
			alert("Unable to get kit details");
		});
	};
	
	//set selectedKit variable
	$scope.selectKit = function(kit_id) {
		if(cmsKitsService.selectedKit === kit_id) {
			cmsKitsService.selectedKit = ""; //toogles selection if Kit is already selected
			cmsKitsService.kit_editor = $('#kit_editor').detach();
			$('#cmsKit_'+kit_id).removeClass('selected');
		} else {
			$('#cmsKit_'+cmsKitsService.selectedKit).removeClass('selected');
			cmsKitsService.selectedKit = kit_id; //new selection, update selectedKit
			$scope.getKitDetails(kit_id);
			$('#cmsKit_'+kit_id).addClass('selected');
		}	
	};
	
	// Removes kit from DB
	$scope.removeKit = function(kit_id) {
		cmsKitsService.removeKit(kit_id)
			.then(function(result) {
				// Remove kit from Kits collection
				cmsKitsService.selectedKit = ""; 
				cmsKitsService.kit_editor = $('#kit_editor').detach();
				$('#cmsKit_'+kit_id).removeClass('selected');
				var index = cmsKitsService.kits.map(function(v){return v.id;}).indexOf(kit_id);
				cmsKitsService.kits.splice(index,1);
				if(result.data.message) {
					alert(result.data.message);
				}
		}, function(result) {
			alert("Unable to remove kit");
		});
	};
	
	// Get all Kits from DB 
	cmsKitsService.getKitsContent()
		.then(function (result) {
			if (result.data.success) {
				angular.forEach(result.data.elements, function(value, key) {
					$scope[key] = value;
					cmsKitsService[key] = value;
				});
			} else {
				alert("Warning: " + result.data.message);
			}
		}, function() {
			alert("Error: Unable to connect");
	});
}]);

app.controller('kitEditController', ['$scope', 'cmsKitsService', 'Upload', 'cmsFilesService', function($scope, cmsKitsService, Upload, cmsFilesService) {
	
	// clears file input
	$scope.clearUpload = function(element_id) {
		$(element_id).val(undefined);	
		$(element_id).get(0).files[0] = undefined;
		$scope.imageFile = undefined;	
	};
		
	//get editKit data from cmsKitService whenever data in service is updated 
	$scope.kitService = cmsKitsService;
	$scope.$watch('kitService.editKit', function(newKit) {
		$scope.editKit = newKit;	
	});
	
	// upload a file to directory relative to selected kit
	$scope.uploadFile = function(file, kit_id, opType, listIndex) {
		cmsFilesService.upload(file, kit_id, opType)
			.then(function(result) {
				if(result.data.success) {
					cmsKitsService.kits[listIndex].image = $scope.editKit.image;
					$scope.clearUpload('#image');
					// remove editor
					cmsKitsService.selectedKit = "";
					cmsKitsService.kit_editor = $('#kit_editor').detach();
					$('#cmsKit_'+$scope.editKit.id).removeClass('selected');
				} else {
					alert(result.data.message);
				}
		}, function(result) {
			alert("Upload of image falied!");
		});
	};
		
	// stores kit data to DB and uploads files, if any
	$scope.saveKit = function() {
		//ask for confirmation with a dialog
		if(confirm("This will update the kit information.\nInculindg File Uploads!\n\nAre you sure?") === true) {
			//update Image file name before updating kit element
			if ($scope.imageFile) {
				$scope.editKit.image = $scope.editKit.id + '.' + $scope.imageFile.name.split('.').pop();
			}
			
			// create array of components that have been edited and append it to kit
			var editedComponents = [];
			for (var i = 0; i < $scope.editKit.componentsInKit.length; i++) {
				if($("#comp_qty_"+$scope.editKit.componentsInKit[i].id).hasClass("ng-dirty")){
					editedComponents.push($scope.editKit.componentsInKit[i]);
				} 
			}
			$scope.editKit.editedComponents = editedComponents;
			
			// save updated kit data to DB
			cmsKitsService.saveKit($scope.editKit)
				.then(function(result) {
				if (result.data.success) {
					// update kit name in cmsKitsServce.kits
					var index = cmsKitsService.kits.map(function(v){return v.id;}).indexOf($scope.editKit.id);
					cmsKitsService.kits[index].id = $scope.editKit.id;
					cmsKitsService.kits[index].name = $scope.editKit.name;
					// resets dirty form fields to pristine
					for (var i = 0; i < $scope.editKit.componentsInKit.length; i++) {
						if($("#comp_qty_"+$scope.editKit.componentsInKit[i].id).hasClass("ng-dirty")){
							$("#comp_qty_"+$scope.editKit.componentsInKit[i].id).removeClass("ng-dirty");
							$("#comp_qty_"+$scope.editKit.componentsInKit[i].id).addClass("ng-pristine");
						} 
					}
					// upload image if present
					if ($scope.imageFile) {
						$scope.uploadFile($scope.imageFile, $scope.editKit.id, 'kit', index);
					}
					
					alert("Kit updated successfully!");
				} else {
					alert(result.data.message);
				}
			}, function(result) {
				alert("Unable to perform operation!");
			})
		}
	};
}]);

app.controller('cmsKfvController', ['$scope', 'cmsKitsService', function($scope, cmsKitsService) {
		
	//stores Kit_editor element for detach/append operations
	cmsKitsService.kfv_editor = $('#kfv_editor').detach();
	
	// Retrieves single kit data and stores it into session storage
	$scope.getKfvDetails = function(kit_id) {
		cmsKitsService.getKfvDetails(kit_id)
			.then(function(result) {
			if (result.data.success) {				
				cmsKitsService.editKfv = result.data.elements.kit;
				cmsKitsService.editKfv.kitForVideos = result.data.elements.kitForVideos;
				cmsKitsService.videos = result.data.elements.videos;
				cmsKitsService.kfv_editor.insertBefore('#cmsKfv_'+kit_id+' .partial_separator');
			}
		}, function(result) {
			alert("Unable to get kit details");
		});
	};
	
	
	//set selectedKfv variable
	$scope.selectKit = function(kit_id) {
		if(cmsKitsService.selectedKfv === kit_id) {
			cmsKitsService.selectedKfv = ""; //toogles selection if Kit is already selected
			cmsKitsService.kfv_editor = $('#kfv_editor').detach();
			$('#cmsKfv_'+kit_id).removeClass('selected');
		} else {
			$('#cmsKfv_'+cmsKitsService.selectedKfv).removeClass('selected');
			cmsKitsService.selectedKfv = kit_id; //new selection, update selectedKfv
			$scope.getKfvDetails(kit_id);
			$('#cmsKfv_'+kit_id).addClass('selected');
		}	
	};
	
	// Get all Kits from DB 
	cmsKitsService.getKitsContent()
		.then(function (result) {
			if (result.data.success) {
				angular.forEach(result.data.elements, function(value, key) {
					$scope[key] = value;
					cmsKitsService[key] = value;
				});
			} else {
				alert("Warning: " + result.data.message);
			}
		}, function() {
			alert("Error: Unable to connect");
	});
}]);

app.controller('kfvEditController', ['$scope', 'cmsKitsService', function($scope, cmsKitsService) {
			
	//checks inputboxes for all video if they are present in kitForVideos
	$scope.checkVideo = function(video_id) {
		for(var	i = 0; i < cmsKitsService.editKfv.kitForVideos.length; i++) {
			if (cmsKitsService.editKfv.kitForVideos[i].video_id === video_id) {
				return true;
			}
		}
		return false;	
	};
		
	//toggles video's checkbutton 
	$scope.toggleVideo = function(video) {
		$scope.editedKFVlist = true;
		if ($('#v_'+video.id).prop('checked')) {
			$('#v_'+video.id).prop('checked' , false);
		} else {
			$('#v_'+video.id).prop('checked' , true);
		}
	};
	
	// flag to determine if Videos for Kit has been modified
	$scope.editedKFVlist = false;
	
	//selects all video checkboxes from form and returns array of id of selected videos
	$scope.listVideosForKit = function(){
		var videosForKit = [];
		$('.video_for_kit li input[type=checkbox]').each(function() {
			if ($(this).prop('checked')){
				var currentVideo = $scope.videos.map(function(video){return video.id}).indexOf($(this).prop('value'));
				videosForKit.push($scope.videos[currentVideo]);
				}
		});
		return videosForKit;
	};
	
	//get editPalylist data from cmsPalylistService whenever data in service is updated 
	$scope.kitsService = cmsKitsService;
	$scope.$watch('kitsService.editKfv', function(newKfv) {
		$scope.videos = cmsKitsService.videos;
		$scope.editKfv = newKfv;
	});
	
	// stores playlist data to DB
	$scope.saveKfv = function() {
		//ask for confirmation with a dialog
		if(confirm("This will update the list of videof for selected kit. \n\nAre you sure?") === true) {
			// set list of edited videos in playlist
			$scope.editedKFVlist ? $scope.editKfv.kitForVideos = $scope.listVideosForKit() : $scope.editKfv.kitForVideos = [];
			// save updated playlist data to DB
			cmsKitsService.saveKfv($scope.editKfv)
				.then(function(result) {
				if (result.data.success) {
					// update playlist name in cmsPlaylistsServce.playlists
					var index = cmsKitsService.playlists.map(function(pl){return pl.id;}).indexOf($scope.editKfv.id);
					cmsKitsService.playlists[index].name = $scope.editKfv.name;
														
					// remove editor
					cmsKitsService.selectedPlaylist = "";
					cmsKitsService.playlist_editor = $('#playlist_editor').detach();
					$('#cmsKfv_'+$scope.editKfv.id).removeClass('selected');
					
					alert("List updated successfully!");
				} else {
					alert(result.data.message);
				}
			}, function(result) {
				alert("Unable to perform operation!");
			})
		}
	};
}]);

/* COMPONENTS */
app.controller('newCompController', ['$scope', 'cmsKitsService', function($scope, cmsKitsService) {
	$scope.saveComp = function () {
		cmsKitsService.saveNewComponent($scope.newComp)
		.then(function(result) {
			if(result.data.success) {
				cmsKitsService.components.push(result.data.elements.component);
			} else {
				alert(result.data.message);
			}
		}, function(result) {
			alert("Unable to save new Component");
		})
	};
}]);

app.controller('cmsComponentController', ['$scope', 'cmsKitsService', function($scope, cmsKitsService) {
	
	//get components data from cmsKitService whenever data in service is updated 
	$scope.componentsService = cmsKitsService;
	$scope.$watch('componentsService.components', function(comp) {
		$scope.components = comp;	
	});
	
	// Removes component from DB
	$scope.removeComponent = function(component_id) {
		cmsKitsService.removeComponent(component_id)
			.then(function(result) {
				if (result.data.success) {
					// Remove kit from Kits collection
					var index = cmsKitsService.components.map(function(c){return c.id;}).indexOf(component_id);
					cmsKitsService.components.splice(index,1);
				} else {
					alert(result.data.message);
				}
			}, function(result) {
				alert("Unable to remove component");
		});
	};
}]);


/* HOME ELEMENTS */
app.controller('newElementController', ['$scope', 'cmsElementsService', 'Upload', 'cmsFilesService', function($scope, cmsElementsService, Upload, cmsFilesService) {
	
	$scope.links = cmsElementsService.links;
	
	// clears file input
	$scope.clearUpload = function(element_id) {
		$(element_id).val(undefined);	
		$(element_id).get(0).files[0] = undefined;
		$scope.newImageFile = undefined;	
	};
				
	// stores element data to DB and uploads files, if any
	$scope.saveNewElement = function() {
		//ask for confirmation with a dialog
		if(confirm("This will save the new element.\n\nAre you sure?") === true) {
			// save updated element data to DB
			cmsElementsService.saveNewElement($scope.newElement)
				.then(function(result) {
				if (result.data.success) {
					cmsElementsService.elements.push(result.data.elements.element);
					
					alert("Element updated successfully!");
				} else {
					alert(result.data.message);
				}
			}, function(result) {
				alert("Unable to perform operation!");
			})
		}
	};	
}]);

app.controller('cmsElementsController', ['$scope', 'cmsElementsService', 'cmsFilesService', function($scope, cmsElementsService, cmsFilesService) {
		
	//stores Element_editor element for detach/append operations
    angular.element(document).ready(function () {
		cmsElementsService.element_editor = $('#element_editor').detach();
	});
	
	// Retrieves single element data and stores it into session storage
	$scope.getElementDetails = function(element_id) {
		cmsElementsService.getElementDetails(element_id)
			.then(function(result) {
			if (result.data.success) {
				cmsElementsService.editElement = result.data.elements.element;
				cmsElementsService.element_editor.insertBefore('#cmsElement_'+element_id+' .partial_separator');
			}
		}, function(result) {
			alert("Unable to get element details");
		});
	};
	
	//set selectedElement variable
	$scope.selectElement = function(element_id) {
		if(cmsElementsService.selectedElement === element_id) {
			cmsElementsService.selectedElement = ""; //toogles selection if Element is already selected
			cmsElementsService.element_editor = $('#element_editor').detach();
			$('#cmsElement_'+element_id).removeClass('selected');
		} else {
			$('#cmsElement_'+cmsElementsService.selectedElement).removeClass('selected');
			cmsElementsService.selectedElement = element_id; //new selection, update selectedElement
			$scope.getElementDetails(element_id);
			$('#cmsElement_'+element_id).addClass('selected');
		}	
	};
	
	// Removes element from DB
	$scope.removeElement = function(element_id) {
		cmsElementsService.removeElement(element_id)
			.then(function(result) {
				// Remove element from Elements collection
				cmsElementsService.selectedElement = ""; 
				cmsElementsService.element_editor = $('#element_editor').detach();
				$('#cmsElement_'+element_id).removeClass('selected');
				var index = cmsElementsService.elements.map(function(v){return v.id;}).indexOf(element_id);
				cmsElementsService.elements.splice(index,1);
				/*if(result.data.message) {
					alert(result.data.message);
				}*/
		}, function(result) {
			alert("Unable to remove element");
		});
	};
	
	// Get all Elements from DB 
	cmsElementsService.getElementsContent()
		.then(function (result) {
			if (result.data.success) {
				angular.forEach(result.data.elements, function(value, key) {
					$scope[key] = value;
					cmsElementsService[key] = value;
				});
			} else {
				alert("Warning: " + result.data.message);
			}
		}, function() {
			alert("Error: Unable to connect");
	});
}]);

app.controller('elementEditController', ['$scope', 'cmsElementsService', 'Upload', 'cmsFilesService', function($scope, cmsElementsService, Upload, cmsFilesService) {
	
	$scope.links = cmsElementsService.links;
	// clears file input
	$scope.clearUpload = function(element_id) {
		$(element_id).val(undefined);	
		$(element_id).get(0).files[0] = undefined;
		$scope.imageFile = undefined;	
	};
		
	//get editElement data from cmsElementService whenever data in service is updated 
	$scope.elementService = cmsElementsService;
	$scope.$watch('elementService.editElement', function(newElement) {
		$scope.editElement = newElement;	
	});
	
	// upload a file to directory relative to selected element
	$scope.uploadFile = function(file, element_id, opType, listIndex) {
		cmsFilesService.upload(file, element_id, opType)
			.then(function(result) {
				if(result.data.success) {
					cmsElementsService.elements[listIndex].image = $scope.editElement.image;
					$scope.clearUpload('#image');
					// remove editor
					cmsElementsService.selectedElement = "";
					cmsElementsService.element_editor = $('#element_editor').detach();
					$('#cmsElement_'+$scope.editElement.id).removeClass('selected');
				} else {
					alert(result.data.message);
				}
		}, function(result) {
			alert("Upload of image falied!");
		});
	};
		
	// stores element data to DB and uploads files, if any
	$scope.saveElement = function() {
		//ask for confirmation with a dialog
		if(confirm("This will update the element information.\nInculindg File Uploads!\n\nAre you sure?") === true) {
			//update Image file name before updating element element
			if ($scope.imageFile) {
				$scope.editElement.image = $scope.editElement.id + '.' + $scope.imageFile.name.split('.').pop();
			}
					
			// save updated element data to DB
			cmsElementsService.saveElement($scope.editElement)
				.then(function(result) {
				if (result.data.success) {
					// update element name in cmsElementsServce.elements
					var index = cmsElementsService.elements.map(function(v){return v.id;}).indexOf($scope.editElement.id);
					cmsElementsService.elements[index].id = $scope.editElement.id;
					cmsElementsService.elements[index].name = $scope.editElement.name;
					
					// upload image if present
					if ($scope.imageFile) {
						$scope.uploadFile($scope.imageFile, $scope.editElement.id, 'element', index);
					}
					
					alert("Element updated successfully!");
				} else {
					alert(result.data.message);
				}
			}, function(result) {
				alert("Unable to perform operation!");
			})
		}
	};
}]);
