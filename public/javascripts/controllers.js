app.controller('CostController', ['$scope', '$rootScope','$location','localStorageService','$window','$timeout','CostService',
	function CostController($scope, $rootScope, $location, $localStorageService, $window, $timeout, CostService){
        $scope.costs = []; 
        CostService.list().success(function(data){
        	$scope.costs = data;
        }).error(function(data, status){
            console.log(status);
        });
}]);

app.controller('LogInController',['$scope','$rootScope','$location','$window','localStorageService','UserService', 'AuthenticationService','$remember',
	function LogInController($scope,$rootScope, $location,$window,localStorageService,UserService, AuthenticationService, $remember){

		$scope.logIn = function login(username, password , remember){
            localStorageService.clearAll();
			if(username!= undefined && password!= undefined){
				UserService.logIn(username, password).success(function(data){
					localStorageService.set('isLogged', true);
                    if(username.toLowerCase() =='admin' || username.toLowerCase() == 'ananta'){
                        localStorageService.set('isAdmin', true);
                     }
					$window.sessionStorage.setItem('username',username.toLowerCase());
                    if($scope.user.remember){
                         $remember('username', $scope.user.username);
                         $remember('password', $scope.user.password);
                    }else{
                        $remember('username', '');
                        $remember('password', '');
                    }
					$location.path('/comlist');
				}).error(function(status,data){
                    localStorageService.clearAll();
					console.log(status);
					console.log(data);
				});
			}
		}

	}]);

app.controller('LogOutController',['$scope','$rootScope','$location','$window','localStorageService','$route','UserService', 'AuthenticationService',
    function LogOutController($scope,$rootScope, $location,$window,localStorageService,$route,UserService, AuthenticationService){
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

app.controller('ComlistController',['$scope','$rootScope','$location','localStorageService','$window','$timeout','$route', 'ComService', 'AuthenticationService', 'ShareService',
	function ComlistController($scope,$rootScope,$location,localStorageService,$window,$route,$timeout, ComService, AuthenticationService, ShareService){
        $scope.signInUserName = $window.sessionStorage.getItem('username');

        $rootScope.isLoggedIn = function(){
            return localStorageService.get('isLogged');
        }
        $scope.canShow = !localStorageService.get('isAdmin');

        $scope.coms = [];
        ComService.list().success(function(data){
            var currentTime = new Date();
        	$scope.coms = data;
            for(var i = $scope.coms.length- 1 ; i >= 0; i--){
               var com = $scope.coms[i];
               if(localStorageService.get('isAdmin')){
                       com.actionName = 'View Personal Info';
                   }else{
                       if(com.isAdded){
                           com.actionName = 'View Personal Info'; 
                       }else{
                           com.actionName = 'Add Personal Info';
                       }
                }   
                var starttime = new Date(com.starttime);
                if(currentTime > starttime){
                    $scope.coms.splice(i, 1);
                }             
            }
            ShareService.setComData($scope.coms.sort(sortCom));
            ShareService.setComId('');
        }).error(function(data,status){
        	console.log(status);
        	console.log(data);
        });

        $scope.cancelCom = function cancelCom(id, username){
            if(!localStorageService.get('isAdmin') && username!= $window.sessionStorage.getItem('username')){
                //$scope.is_error = true;
                //$scope.message = 'You can only cancel your own communication!';
                //hideMessage(true, 3000);
                swal({ 
                    title:"",  
                    text: "You can only cancel your own communication!",   
                    timer: 5000,   
                    showConfirmButton: true ,
                    confirmButtonColor: "#4cae4c"});
                return;
            } else{
                 swal({
                    title: 'Are you sure to cancel this communication ?', 
                    text: 'You will not be able to recover this imaginary communication!',
                    type: 'warning', 
                    showCancelButton: true,   
                    cancelButtonText:"No",
                    cancelButtonColor:"#4cae4c",
                    confirmButtonColor: "#DD6B55",   
                    confirmButtonText: "Yes, cancel it!",   
                    closeOnConfirm: false
                   },
                   function(isConfirm){
                       if(isConfirm){
                           if(id != null){
                             ComService.delete(id).success(function(data){
                                $window.location.reload();
                            }).error(function(status, data){
                                console.log(status);
                                console.log(data);
                            });
                           }
                       }else{
                          return false;
                       }
                   });
            }
        }

        $scope.queryCom = function queryCom(comId, username){
            if(username == $window.sessionStorage.getItem('username')){
              ShareService.setComId(comId);
              $location.path('/com');  
            } else{
                if(!localStorageService.get('isAdmin')){
                      $window.getSelection().removeAllRanges();
                      //$scope.is_error = true;
                      //$scope.message = 'You can only edit your own communication!';
                      //hideMessage(true, 3000);
                      swal({ 
                        title:"",  
                        text: "You can only edit your own communication!",   
                        timer: 5000,   
                        showConfirmButton: true ,
                        confirmButtonColor: "#4cae4c"});
                }
                return;
            }      
        }

        $scope.queryInfo = function queryInfo(comId, username){
            ShareService.setComId(comId);
            ShareService.setSharedData(username);
            $location.path('/info');
        }
        
        function hideMessage(isError, delay){
            setTimeout(function(){
                $scope.$apply(function(){
                    if(isError){
                        $scope.is_error = false;
                    }else{
                        $scope.is_success = false;
                    }                  
                });
            }, delay);
        }

        function sortCom(com1, com2){
            var date1 = new Date(com1.starttime);
            var date2 = new Date(com2.starttime);
            return date1 > date2 ? 1: -1 ;
        }

}]);

app.controller('InfoController',['$scope','$rootScope','$location','$window','$route', 'ComService', 'AuthenticationService', 'ShareService',
    function InfoController($scope,$rootScope,$location,$window,$route, ComService, AuthenticationService, ShareService){
        $scope.maritalStatus = {
            availableOptions: [
               {id:'1', name: 'Married'},
               {id:'2', name: 'Single'},
               {id:'3', name: 'In love'}                         
            ]
        }       
        $scope.personName = ShareService.getSharedData();

        ComService.queryInfo(ShareService.getSharedData()).success(function(data){
            if(data!=null && data!=''){
                 $scope.infoTitle = 'View Personal Info';
                 $scope.pinfo = data[0];
                 $scope.pinfo.join = new Date(data[0].join);
                 $scope.pinfo.marital= findMarital(data[0].marital);
                 setTimeout(function(){
                       tagAdded(ShareService.getComId(), true, false);
                }, 2000); 
            }else{
                $scope.infoTitle = 'Add Personal Info';
            }

            if(ShareService.getSharedData()!= $window.sessionStorage.getItem('username')){
                $scope.isOwnInfo = true;
            }else{
                $scope.isOwnInfo = false;
            }
        }).error(function(status, data){
                console.log(status);
                console.log(data);
        });   

        function findMarital(marital){
            for(var i = 0; i< $scope.maritalStatus.availableOptions.length; i++){
                if($scope.maritalStatus.availableOptions[i].name == marital){
                    return $scope.maritalStatus.availableOptions[i];
                }
            }
        }

         function tagAdded(id, isAdded, isRedirect){
            ComService.tagComInfo(id, isAdded, isRedirect).success(function(data){
                if(isRedirect){
                  $location.path('/comlist');  
              }               
            }).error(function(status,data){
                console.log(status);
                console.log(data);
            });
        } 

        $scope.saveInfo = function saveInfo(pinfo){
            if(pinfo != null){
                pinfo.username = $window.sessionStorage.getItem('username');
                ComService.saveInfo(pinfo).success(function(data){
                    setTimeout(function(){
                       tagAdded(ShareService.getComId(), true , true);
                    }, 2000);             
                }).error(function(status, data){
                    console.log(status);
                    console.log(data);
                });
            }
        }   

        $scope.back = function back(){
            $location.path('/comlist');
        }  
   
}]);


app.controller('ComController',['$scope','$rootScope','$location','$window','$route', 'ComService', 'AuthenticationService', 'ShareService',
    function ComController($scope,$rootScope,$location,$window,$route, ComService, AuthenticationService, ShareService){     
        $scope.signInUserName = $window.sessionStorage.getItem('username');

        $scope.selectData = {
            availableOptions: [
               {id:'1', name: 'Mainframe WebUI'},
               {id:'2', name: 'MicroFlow'},
               {id:'3', name: 'API Exchange'},
               {id:'4', name: 'BW6 Admin'},
               {id:'5', name: 'Loglogic Unity'},
               {id:'6', name: 'Simplr'},
               {id:'7', name: 'MDM'},
               {id:'8', name: 'Cloud Doc'}                           
            ]
        }

         $scope.save = function save(com){
            if(com != undefined){
                com.username = $window.sessionStorage.getItem('username');
                //com.isExisted = com._id != null;
                var currentTime = new Date();
          if(com.project != null && com.subject != null){
                if(com.starttime < currentTime || com.endtime < currentTime){
                     swal({ 
                        title:"",  
                        text: "Start time or end time is out of date!",   
                        timer: 5000,   
                        showConfirmButton: true ,
                        confirmButtonColor: "#4cae4c"
                    });                     
                }
                else if(com.starttime > com.endtime){
                     swal({ 
                        title:"",  
                        text: "Start time should be earlier than end time!",   
                        timer: 5000,   
                        showConfirmButton: true ,
                        confirmButtonColor: "#4cae4c"
                    });                                        
                }else{
                    var isAvailabe = true;
                    var comData = ShareService.getComData();
                    for(var i = 0; i < comData.length ; i++){
                        var rowData = comData[i];
                        var rowEndtime = new Date(rowData.endtime);
                        var rowStarttime = new Date(rowData.starttime);
                        if(com.endtime > rowStarttime && com.endtime < rowEndtime){
                            isAvailabe = false;
                            break;
                        }else if(com.starttime < rowEndtime && com.endtime > rowEndtime){
                            isAvailabe = false;
                            break;
                        }else if(com.starttime < rowStarttime && com.endtime > rowStarttime){
                            isAvailabe = false;
                            break;
                        }else if(com.starttime === rowStarttime && com.endtime === rowEndtime){
                            isAvailabe = false;
                            break;
                        }
                    }
                    if(isAvailabe){
                        ComService.saveCom(com).success(function(data){
                            $location.path('/comlist');
                        }).error(function(status, data){
                            console.log(status);
                            console.log(data);
                        });
                    }else{
                      swal({ 
                        title:"",  
                        text: "This time is unavailable, please choose another time!",   
                        timer: 5000,   
                        showConfirmButton: true ,
                        confirmButtonColor: "#4cae4c"
                      });                         
                    }
                }
              }
            }
         }        
        if(ShareService.getComId()!=''){
             ComService.queryCom(ShareService.getComId()).success(function(data){
                   if(data!=null && data!=''){
                        $scope.infoTitle = 'View Communication';
                        $scope.com = data[0];
                        $scope.com.starttime = new Date(data[0].starttime);
                        $scope.com.endtime= new Date(data[0].endtime);
                        $scope.com.project = findProject(data[0].project);
                   }else{
                        $scope.infoTitle = 'Create Communication';
                   }
                }).error(function(status, data){
                        console.log(status);
                        console.log(data);
            });             
       }else{
            $scope.infoTitle = 'Create Communication';
       }
 

        function findProject(project){
            for(var i = 0; i< $scope.selectData.availableOptions.length; i++){
                if($scope.selectData.availableOptions[i].name == project.name){
                    return $scope.selectData.availableOptions[i];
                }
            }
        }

        function isSameDay(date1, date2){
            return date1.getDate() == date2.getDate() && 
                   date1.getMonth() == date2.getMonth() &&
                   date1.getFullYear() == date2.getFullYear();
        }

       $scope.back = function back(){
           ShareService.setComId('');
           $location.path('/comlist');
       }        

        function hideMessage(isError, delay){
            setTimeout(function(){
                $scope.$apply(function(){
                    if(isError){
                        $scope.is_error = false;
                    }else{
                        $scope.is_success = false;
                    }                  
                });
            }, delay);
        }       
     
}]);

