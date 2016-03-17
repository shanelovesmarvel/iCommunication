app.controller('ComlistController',['$scope','$rootScope','$location','localStorageService','$window','$timeout','$route', 'ComService','ShareService',
	function ComlistController($scope,$rootScope,$location,localStorageService,$window,$route,$timeout, ComService, ShareService){
        $scope.signInUserName = $window.sessionStorage.getItem('username');

        $rootScope.isLoggedIn = function(){
            return localStorageService.get('isLogged');
        }
        $scope.canShow = !localStorageService.get('isAdmin');
        $scope.isAdmin = localStorageService.get('isAdmin');
        $scope.avaliableCom = 'Avaliable Communications';

//=====================================================================================================
        $scope.coms = [];
        ComService.list($window.sessionStorage.token).success(function(data){
          var currentTime = new Date();
          // To detect whether com exists for sign-in user.
          var hasComExisted = false ; 
          // To  whether has com deleted by admin user for sign-in user.
          var hasComDeleted = false;
          // To get the com deleted message to show;
          var comMessage = '';
        	$scope.coms = data;
            for(var i = data.length- 1 ; i >= 0; i--){
                var com = data[i]; 
                var endtime = new Date(com.endtime);
                //Never show the out-of-date communication.
                if(currentTime > endtime){
                    $scope.coms.splice(i, 1);
                }else{
                   var isSignInUser = com.username == $window.sessionStorage.getItem('username');                 
                   if(com.isDeletedByAdmin){
                       if(isSignInUser){
                         hasComDeleted = true;
                         comMessage = "You communication '" + com.subject + 
                                "' was canceled by Admin because of '" + com.reason +"' "+ '\n'+
                                "Please create a new communication. ";
                      }
                      $scope.coms.splice(i,1);

                   }else{
                      if(isSignInUser){
                         hasComExisted = true;
                      }
                      if(localStorageService.get('isAdmin')){
                           com.actionName = 'View Personal Info';
                      }else{
                         if(isSignInUser && !com.isAdded){
                            com.actionName = 'Add Personal Info';
                         }else{
                            com.actionName = 'View Personal Info';
                         }
                      }  
                   }
                }                          
            }
            if(hasComDeleted && !hasComExisted){
               $scope.is_error = true;
               $scope.message = comMessage;
            }else{
               $scope.is_error = false;
            }
            ShareService.setComData($scope.coms.sort(sortCom));
            ShareService.setComId('');
        }).error(function(data,status){
        	console.log(status);
        	console.log(data);
        });

//==========================================================================================
        $scope.cancelCom = function cancelCom(id, username){
            var isAdmin = localStorageService.get('isAdmin');
            var isDifferentUser = username!= $window.sessionStorage.getItem('username');
            
            //Only admin and sign-in user can cancel a communication.
            if(!isAdmin && isDifferentUser){
                swal({ 
                    title:"",  
                    text: "You can only cancel your own communication!",   
                    timer: 5000,   
                    showConfirmButton: true ,
                    confirmButtonColor: "#4cae4c"});
                return;
            } else{
                 // Admin user needs to specify the reason to cancel a communication.
                 if(isAdmin){
                    swal({
                      title: "Are you sure to cancel this communication ?",   
                      text: "If you have to cancel, please specify the reason: ",   
                      type: "input",   
                      showCancelButton: true, 
                      cancelButtonText: "No",  
                      closeOnConfirm: false, 
                      showConfirmButton: true, 
                      confirmButtonColor: "#DD6B55", 
                      animation: "slide-from-top",   
                      confirmButtonText: "Yes, cancel it !",  
                      inputPlaceholder: "specify the reason"
                    },
                    function(inputValue){   
                      if (inputValue === false) 
                         return false;      
                      if (inputValue === "") {
                         swal.showInputError("You need to specify the reason!");     
                         return false;
                      }else{
                         if(id != null){
                             // Just tag a marker for the communication and do not delete.
                             ComService.tagComDeleted(id, inputValue, $window.sessionStorage.token).success(function(data){
                                $window.location.reload();
                            }).error(function(status, data){
                                console.log(status);
                                console.log(data);
                            });
                          }                       
                      }

                    });

                 }else{ //Sign-in user just directly delete a communication.
                     swal({
                       title: 'Are you sure to cancel this communication ?', 
                       text: 'You will not be able to recover this imaginary communication!',
                       type: 'warning', 
                       showCancelButton: true,   
                       cancelButtonText:"No",
                       cancelButtonColor:"#4cae4c",
                       confirmButtonColor: "#DD6B55",   
                       confirmButtonText: "Yes, cancel it !",   
                       closeOnConfirm: false
                      },
                      function(isConfirm){
                       if(isConfirm){
                           if(id != null){
                             ComService.delete(id, $window.sessionStorage.token).success(function(data){
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
        }
//=================================================================================================
        $scope.queryCom = function queryCom(comId, username){
            if(username == $window.sessionStorage.getItem('username')){
              ShareService.setEdit(true);
              ShareService.setComId(comId);
              $location.path('/com');  
            } else{
                if(!localStorageService.get('isAdmin')){
                      $window.getSelection().removeAllRanges();
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

//==================================================================================================
        $scope.queryInfo = function queryInfo(comId, username){
            ShareService.setComId(comId);
            ShareService.setSharedData(username);
            $location.path('/info');
        }

//===================================================================================================        
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
//====================================================================================================
        //Sort the communication by the start time.
        function sortCom(com1, com2){
            var date1 = new Date(com1.starttime);
            var date2 = new Date(com2.starttime);
            return date1 > date2 ? 1: -1 ;
        }

}]);



app.controller('ComCanceledListController',['$scope','$rootScope','$location','localStorageService','$window','$timeout','$route', 'ComService', 'AuthenticationService', 'ShareService',
  function ComlistController($scope,$rootScope,$location,localStorageService,$window,$route,$timeout, ComService, AuthenticationService, ShareService){
       $scope.signInUserName = $window.sessionStorage.getItem('username');
        $scope.coms = [];
        ComService.list($window.sessionStorage.token).success(function(data){
            $scope.coms = data;
            var currentTime = new Date();
            for(var i = data.length- 1 ; i >= 0; i--){
                var com = data[i];
                var starttime = new Date(com.starttime);
                if(currentTime > starttime){
                  $scope.coms.splice(i,1);
                }else if(!com.isDeletedByAdmin){
                  $scope.coms.splice(i, 1);
                }
            }

        }).error(function(data,status){
          console.log(status);
          console.log(data);
        });

        $scope.revertCom = function revertCom(id, username){
                 swal({
                       title: 'Are you sure to revert this communication ?', 
                       text: '',
                       type: 'info', 
                       showCancelButton: true,   
                       cancelButtonText:"No",
                       cancelButtonColor:"#4cae4c",
                       confirmButtonColor: "#4cae4c",   
                       confirmButtonText: "Yes, revert it !",   
                       closeOnConfirm: false
                      },
                      function(isConfirm){
                       if(isConfirm){
                           if(id != null){
                             ComService.tagComReverted(id, $window.sessionStorage.token).success(function(data){
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
}]);