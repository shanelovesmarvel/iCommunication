
var koa = require('koa');
var logger = require('koa-logger');
var router = require('koa-router')();
var parse = require('co-body');
var serve = require('koa-static');
var jade  = require('koa-jade-render');
var path  = require('path');
var bodyparser = require('koa-bodyparser');

var views = require('co-views');
var path  = require('path');

var render= views(__dirname + '/views', { map: { html: 'jade' }});

var app = koa();

app.use(serve('./public'));
app.use(serve('./node_modules'));

// middleware
app.use(logger());
app.use(bodyparser());

router.get('/', function *(next){
     this.body = yield render('nav.jade', { title: 'iCommunication' });
});

router.get('/shane', function *(next){
     this.body = yield render('login.jade', { title: 'iCommunication' });
});

router.get('/com', function *(next){
    this.body = yield render('com.jade', {title: 'iCommunication'});
});

router.get('/comlist', function *(next){
     this.body = yield render('comlist.jade', {title: 'iCommunication'});
});

router.get('/info', function *(next){
     this.body = yield render('personal_info.jade', {title: 'iCommunication'});
});

// route middleware
var user = require('./routes/user');
var com = require('./routes/com');
var info = require('./routes/info');

router.use('/user', user.routes());
router.use('/com',com.routes());
router.use('/info', info.routes());

app.use(router.routes());

// http server listening
app.listen(8080);
console.log('listening on port 8080');