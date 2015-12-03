var monk = require('monk');
var wrap = require('co-monk');
var mongo = monk('localhost/travel');
var collection_info = wrap(mongo.get('info'));
var collection_com  = wrap(mongo.get('com'));
var collection_user = wrap(mongo.get('user'));

mongo.coms = collection_com;
mongo.infos = collection_info;
mongo.users = collection_user;

module.exports = mongo;