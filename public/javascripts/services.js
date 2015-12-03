
app.factory('CostService', function($http){
	return{
		list:function(){
			return $http.get(options.api.base_url  + '/cost/list');
		},
		create:function(cost){
			return $http.post(options.api.base_url + '/cost/new');
		}
	};
});

app.factory('AuthenticationService', function(){
	var auth = {
		isAuthenticated : false ,
		isAdmin : false
	}
	return auth;
});

app.factory('ComService', function($http){
	return {
		saveCom:function(com){
			return $http.post(options.api.base_url + '/com/save', {com: com});
		},

		list:function(){
			return $http.get(options.api.base_url  + '/com/list');
		},

		queryCom:function(id){
			return $http.post(options.api.base_url + '/com/query' ,{id: id });
		},

		delete:function(id){
			return $http.post(options.api.base_url + '/com/delete', {id: id});
		},

		saveInfo:function(pinfo){
			return $http.post(options.api.base_url + '/info/save', {pinfo: pinfo});
		},

		queryInfo:function(username){
			return $http.post(options.api.base_url + '/info/query', {username: username} );
		},

		tagComInfo:function(id, isAdded){
			return $http.post(options.api.base_url + '/com/tag', {id: id, isAdded:isAdded});
		}
	};
});


app.factory('UserService', function($http){
	return{
		logIn:function(username, password){
			return $http.post(options.api.base_url + '/user/signin', {username: username.toLowerCase(), password: password});
		}
	};
});

app.factory('$remember', function(){
	function fetchValue(name){
		var cookieValue = document.cookie.split("; ");
		for(var i = 0; i < cookieValue.length ; i++){
			var crumb = cookieValue[i].split('=');
			if(name === crumb[0]){
				var value = '';
				try{
					value = angular.fromJson(crumb[1]);
				}catch(e){
					value = unescape(crumb[1]);
				}
				return value;
			}
		}
		return null;
	}
	return function(name, values) {
                if(arguments.length === 1) return fetchValue(name);
                var cookie = name + '=';
                if(typeof values === 'object') {
                    var expires = '';
                    cookie += (typeof values.value === 'object') ? angular.toJson(values.value) + ';' : values.value + ';';
                    if(values.expires) {
                        var date = new Date();
                        date.setTime( date.getTime() + (values.expires * 24 *60 * 60 * 1000));
                        expires = date.toGMTString();
                    }
                    cookie += (!values.session) ? 'expires=' + expires + ';' : '';
                    cookie += (values.path) ? 'path=' + values.path + ';' : '';
                    cookie += (values.secure) ? 'secure;' : '';
                } else {
                    cookie += values + ';';
                }
                document.cookie = cookie;
       }
});

app.factory('ShareService', function(){
	var username = '';
	var comId = '';
	var comData = {};
	return {
		getSharedData:function(){
			return username;
		},
		setSharedData:function(name){
            username = name;
		},
		getComId:function(){
			return comId;
		},
		setComId:function(id){
            comId = id;
		},
		setComData:function(data){
			comData = data;
		},
		getComData:function(){
			return comData;
		}
	}
});