'use strict';
var app = angular.module('kamn',['ngRoute','LocalStorageModule','ui.bootstrap.datetimepicker']);

var options = {};
options.api = {};
options.api.base_url = "http://localhost:5373";

app.config(['$locationProvider','$routeProvider',
	function($location, $routeProvider){
		$routeProvider.
		   when('/',{
		   	templateUrl:'/login',
		   	controller: 'LogInController'
		   }).
		   when('/comlist',{
		   	 templateUrl:'/comlist',
		   	 controller:'ComlistController'
		   }).
		   when('/comlist_canceled',{
		   	 templateUrl:'/comlist_canceled',
		   	 controller:'ComCanceledListController'
		   }).
		   when('/com',{
		   	 templateUrl:'/com',
		   	 controller:'ComController'
		   }).
		   when('/info',{
             templateUrl: '/info',
             controller: 'InfoController'
		   }).
		   otherwise({
		   	redirectTo:'/'
		   });
	}]);

