var router = require('koa-router')();

//Config MongoDB
var mongo = require('../config/mongo');
var jwt = require('jsonwebtoken');

// Sign-in
// No password authentication.
// Just verify if the username exists in DB, if not, insert this user.
router.post('/signin', function *(next){
      var user = this.request.body;
      try{
         var isExisted = yield mongo.users.findOne({'username': user.username});
         if(isExisted == null){
            yield mongo.users.insert(user);
         }
         var profile = {
            name: user.username,
            password: user.password
         };
         var secret = 'shared-secret';
         var token = jwt.sign(profile, secret);
         this.body = {token: token};
         this.status = 201; 
      }catch(e){
         this.body = "An error occurred: " + e;
         this.status = 500;
    }
});


module.exports = router;