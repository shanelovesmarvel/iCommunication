var router = require('koa-router')();

//Config MongoDB
var mongo = require('../config/mongo');


router.get('/list', function *(next){
     var res = yield mongo.coms.find({});
     this.body = res;
});

router.post('/save', function *(next){
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
        this.status = 401;
      }
});

router.post('/query', function *(next){
     var id = this.request.body.id;
     try{ 
        this.body = yield mongo.coms.find({'_id': id}, {});
     }catch(e){
        this.body = "An error occurred: " + e;
        this.status = 401;
     }
});

router.post('/tag', function *(next){
    var info = this.request.body;
    try{
        this.body = yield mongo.coms.update({'_id': info.id},{$set : {'isAdded': info.isAdded}});
    }catch(e){
        this.body = "An error occurred: " + e;
        this.status = 401;
    }
});


router.post('/delete', function *(next){
    var id = this.request.body.id;
    try{
        this.body = yield mongo.coms.remove({'_id': id});
    }catch(e){
        this.body = "An error occurred: " + e;
        this.status = 401;
    }
});

module.exports = router;