var router = require('koa-router')();

//Config MongoDB
var mongo = require('../config/mongo');


// Get all the communications from DB
router.post('/list', function *(next){
     var token = this.request.body.token;
     if(!verifyToken(token)){
       try{
          var res = yield mongo.coms.find({});
          this.body = res;
        }catch(e){
          this.body = "An error occurred: " + e;
          this.status = 500;
        }
     }
});

// Save communication, to create if it's new, to update if it's exists.
router.post('/save', function *(next){
      var token = this.request.body.token;
      if(!verifyToken(token)){
         var com = this.request.body.com;
         try{
               var isExisted = yield mongo.coms.findOne({'_id': com._id});
               if(isExisted){
                    this.body = yield mongo.coms.update({'_id': com._id}, 
                           {"username" : com.username,
                            "project"  : com.project,    "subject" : com.subject,
                            "starttime" : com.starttime, "endtime" : com.endtime });
               }else{
                   this.body = yield mongo.coms.insert(com);
              }
          }catch(e){
               this.body = "An error occurred: " + e;
               this.status = 500;
          }         
      }
});

// Query communication details.
router.post('/query', function *(next){
     var token = this.request.body.token;
     if(!verifyToken(token)){
         var id = this.request.body.id;
         try{ 
             this.body = yield mongo.coms.find({'_id': id}, {});
         }catch(e){
             this.body = "An error occurred: " + e;
             this.status = 500;
        }  
     }
});

// If user has already personal information stored in DB, tagged user info added.
router.post('/tag/info/added', function *(next){
    var token = this.request.body.token;
    if(!verifyToken(token)){
        var info = this.request.body;
        try{
            this.body = yield mongo.coms.update({'_id': info.id},{$set : {'isAdded': info.isAdded}});
        }catch(e){
            this.body = "An error occurred: " + e;
            this.status = 500;
        }
    }
});

// If the communication is deleted by user, tagged it true as deleted by Admin.
router.post('/tag/com/deleted', function *(next){
   var token = this.request.body.token;
   if(!verifyToken(token)){
        var info = this.request.body;
        try{
           this.body = yield mongo.coms.update({'_id': info.id}, 
                           {$set: {'isDeletedByAdmin': info.isDeletedByAdmin, 'reason': info.reason}});
        }catch(e){
           this.body = "An error occurred: " + e;
           this.status = 500;
       }
   }
  
});

// If the communication is reverted by user, tagged it false as deleted by Admin.
router.post('/tag/com/reverted', function *(next){
   var token = this.request.body.token;
   if(!verifyToken(token)){
        var info = this.request.body;
        try{
            this.body = yield mongo.coms.update({'_id': info.id}, 
                            {$set: {'isDeletedByAdmin': info.isDeletedByAdmin }});
        }catch(e){
            this.body = "An error occurred: " + e;
            this.status = 500;
       }  
   }
});

// Deleted a communication.
router.post('/delete', function *(next){
    var token = this.request.body.token;
    if(!verifyToken(token)){
          var id = this.request.body.id;
          try{
              this.body = yield mongo.coms.remove({'_id': id});
          }catch(e){
              this.body = "An error occurred: " + e;
              this.status = 500;
        }
    }
});

function verifyToken(token){
   if(token =='' || token == undefined){
      this.status = 401;
      return true;
   }
   return false;
}


module.exports = router;