var router = require('koa-router')();

//Config MongoDB
var mongo = require('../config/mongo');

router.post('/signin', function *(next){
      var user = this.request.body;
      try{
         var isExisted = yield mongo.users.findOne({'username': user.username});
         if(isExisted == null){
            this.body = yield mongo.users.insert(user);
         }
         this.status = 201; 
      }catch(e){
         this.body = "An error occurred: " + e;
         this.status = 401;
    }
});


module.exports = router;