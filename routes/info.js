var router = require('koa-router')();

//Config MongoDB
var mongo = require('../config/mongo');


// Save personal info.
router.post('/save', function *(next){
     var token = this.request.body.token;
     if(!verifyToken(token)){
           var pinfo = this.request.body.pinfo;
           try{
                 this.body = yield mongo.infos.update({'username': pinfo.username}, 
                            { "username" : pinfo.username, "cname" : pinfo.cname,  "age" : pinfo.age,
                              "marital" : pinfo.marital.name, "hometown" : pinfo.hometown, 
                            "hobby" : pinfo.hobby, "join" : pinfo.join}, {"upsert": true});       
          }catch(e){
                 this.body = "An error occurred: " + e;
                 this.status = 500;
         }
     }
});


// Query personal info by username.
// Personal info stored in DB is deferred by username, so a user can only have one info stored in DB.
router.post('/query', function *(next){
    var token = this.request.body.token;
    if(!verifyToken(token)){
          var username = this.request.body.username;
          try{
               this.body = yield mongo.infos.find({'username': username},{});
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

module.exports = router; // exports the router, so it can be used by other modules.