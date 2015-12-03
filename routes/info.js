var router = require('koa-router')();

//Config MongoDB
var mongo = require('../config/mongo');

router.post('/save', function *(next){
     var pinfo = this.request.body.pinfo;
     try{
        this.body = yield mongo.infos.update({'username': pinfo.username}, 
          { "username" : pinfo.username, "cname" : pinfo.cname,  "age" : pinfo.age,
            "marital" : pinfo.marital.name, "hometown" : pinfo.hometown, "hobby" : pinfo.hobby,
            "join" : pinfo.join}, {"upsert": true});       
     }catch(e){
        this.body = "An error occurred: " + e;
        this.status = 401;
     }
});

router.post('/query', function *(next){
    var username = this.request.body.username;
    try{
        this.body = yield mongo.infos.find({'username': username},{});
    }catch(e){
        this.body = "An error occurred: " + e;
        this.status = 401;
    }
});


module.exports = router;