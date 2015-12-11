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


//=======================================================================================================
        ComService.queryInfo(ShareService.getSharedData(), $window.sessionStorage.token).success(function(data){
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

//=========================================================================================================        
        function findMarital(marital){
            for(var i = 0; i< $scope.maritalStatus.availableOptions.length; i++){
                if($scope.maritalStatus.availableOptions[i].name == marital){
                    return $scope.maritalStatus.availableOptions[i];
                }
            }
        }

         function tagAdded(id, isAdded, isRedirect){
            ComService.tagComInfo(id, isAdded, $window.sessionStorage.token).success(function(data){
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
                ComService.saveInfo(pinfo, $window.sessionStorage.token).success(function(data){
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