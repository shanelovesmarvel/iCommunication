'use strict';
var app = angular.module('kamn',['ngRoute','LocalStorageModule','ui.bootstrap.datetimepicker']);

var options = {};
options.api = {};
options.api.base_url = "http://localhost:8080";

app.config(['$locationProvider','$routeProvider',
	function($location, $routeProvider){
		$routeProvider.
		   when('/',{
		   	templateUrl:'/shane',
		   	controller: 'LogInController'
		   }).
		   when('/comlist',{
		   	 templateUrl:'/comlist',
		   	 controller:'ComlistController'
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

