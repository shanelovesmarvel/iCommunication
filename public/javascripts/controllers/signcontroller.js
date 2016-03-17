app.controller('LogInController',['$scope','$rootScope','$location','$window','localStorageService','UserService',
	function LogInController($scope,$rootScope, $location,$window,localStorageService,UserService){

		$scope.logIn = function login(username, password){
        localStorageService.clearAll();
	    if(username!= undefined && password!= undefined){
				UserService.logIn(username, password).success(function(data){
					localStorageService.set('isLogged', true);
                    if(username.toLowerCase() =='admin' || username.toLowerCase() == 'ananta'){
                         localStorageService.set('isAdmin', true);
                    }
					$window.sessionStorage.setItem('username',username.toLowerCase());
                    $window.sessionStorage.token = data.token;
                    console.log('==========='+ $window.sessionStorage.token);
					$location.path('/comlist');
				}).error(function(status,data){
                     localStorageService.clearAll();
                     delete $window.sessionStorage.token;
					 console.log(status);
					 console.log(data);
				});
			}
		}

	}]);

app.controller('LogOutController',['$scope','$rootScope','$location','$window','localStorageService','$route','UserService', 'LoadJsonService',
    function LogOutController($scope,$rootScope, $location,$window,localStorageService,$route,UserService, LoadJsonService){
        $scope.logout = function logout(){
            if(localStorageService.get('isLogged')){
                localStorageService.set('isLogged', false);
                localStorageService.set('isAdmin', false);
                delete $window.sessionStorage.token;
                $location.path("/login");
                $rootScope.isLoggedIn = localStorageService.get('isLogged');
            }
         } 

         $scope.main = function main(){
            if(localStorageService.get('isLogged')){
                 $location.path('/comlist');
            }
         }
    }]);