'use strict';
var app = angular.module('kamn',['ngRoute','LocalStorageModule','ui.bootstrap.datetimepicker']);

var options = {};
options.api = {};
options.api.base_url = "http://192.168.71.40:3931";

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

