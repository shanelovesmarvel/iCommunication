
var koa = require('koa');
var logger = require('koa-logger');
var router = require('koa-router')();
var parse = require('co-body');
var serve = require('koa-static');
var path  = require('path');
var bodyparser = require('koa-bodyparser');
var views = require('co-views');
var path  = require('path');
var jwt = require('koa-jwt');


var render= views(__dirname + '/views', { map: { html: 'jade' }});

var app = koa();

app.use(serve('./public'));
app.use(serve('./node_modules'));
app.use(serve('./config'));

// middleware
app.use(logger());
app.use(bodyparser());

router.get('/', function *(){
     this.body = yield render('nav.jade', { title: 'iCommunication' });
});

router.get('/login', function *(){
     this.body = yield render('login.jade', { title: 'iCommunication' });
});

router.get('/com', function *(){
    this.body = yield render('com.jade', {title: 'iCommunication'});
});

router.get('/comlist', function *(){
     this.body = yield render('comlist.jade', {title: 'iCommunication'});
});

router.get('/info', function *(){
     this.body = yield render('personal_info.jade', {title: 'iCommunication'});
});

router.get('/comlist_canceled',function *(){
	 this.body = yield render('comlist_canceled.jade', {title: 'iCommunication'});
})

app.use(jwt({ secret: 'shared-secret' , passthrough: true}));

// route middleware
var user = require('./routes/user');
var com = require('./routes/com');
var info = require('./routes/info');

router.use('/user', user.routes());
router.use('/com',com.routes());
router.use('/info', info.routes());

app.use(router.routes());

// http server listening
app.listen(5373);
console.log('listening on port 5373');

module.exports = app;