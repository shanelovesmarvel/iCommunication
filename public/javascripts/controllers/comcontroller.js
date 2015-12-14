app.controller('ComController',['$scope','$rootScope','$location','$window','$route', '$filter','ComService', 'AuthenticationService', 'ShareService',
    function ComController($scope,$rootScope,$location,$window,$route, $filter, ComService, AuthenticationService, ShareService){     
        $scope.signInUserName = $window.sessionStorage.getItem('username');

        $scope.selectData = {
            availableOptions: [
               {id:'1', name: 'API Exchange'},
               {id:'2', name: 'BW6 Admin'},
               {id:'3', name: 'BPM'},
               {id:'4', name: 'BrownBag'},
               {id:'5', name: 'Cloud Docs'},
               {id:'6', name: 'LogLogic'},
               {id:'7', name: 'MDM'},
               {id:'8', name: 'MF WebUI'},
               {id:'9', name: 'MicroFlow'},
               {id:'10', name: 'QCells'},
               {id:'11', name: 'Simplr'},
               {id:'12', name: 'Simplr Backend'},
               {id:'13', name: 'None'}                         
            ]
        }

      $scope.save = function save(com){
          if(com != undefined){
              com.username = $window.sessionStorage.getItem('username');
              //com.isExisted = com._id != null;
              var currentTime = new Date();
              var existedStartTime = '';
              var existedEndTime = '';
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
                        existedStartTime = rowStarttime;
                        existedEndTime = rowEndtime;
                        if(com.endtime >= rowStarttime && com.endtime <= rowEndtime){
                            isAvailabe = false;
                            break;
                        }else if(com.starttime < rowEndtime && com.endtime > rowEndtime){
                            isAvailabe = false;
                            break;
                        }else if(com.starttime < rowStarttime && com.endtime > rowStarttime){
                            isAvailabe = false;
                            break;
                            //Compare start time and end time if equals to each other.
                        }else if(com.starttime.getTime() == rowStarttime.getTime() && com.endtime.getTime() ==rowEndtime.getTime()){
                            isAvailabe = false;
                            break;
                        }
                    }
                    if(isAvailabe){
                        ComService.saveCom(com, $window.sessionStorage.token).success(function(data){
                            $location.path('/comlist');
                        }).error(function(status, data){
                            console.log(status);
                            console.log(data);
                        });
                    }else{
                      swal({ 
                        title:"This time is unavailable!",  
                        type: 'warning',
                        text: "A Communication from "+ formatDate(existedStartTime)+" to "+ formatDate(existedEndTime) + ' already exists.' ,   
                        timer: 20000,   
                        showConfirmButton: true ,
                        confirmButtonColor: "#4cae4c"
                      });                         
                    }
                }
              }
            }
         }        
        if(ShareService.getComId()!=''){
             ComService.queryCom(ShareService.getComId(), $window.sessionStorage.token).success(function(data){
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

        function formatDate(date){
           return $filter('date')(date, 'yyyy/MM/dd HH:mm');
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