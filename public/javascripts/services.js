
// Authentication service
app.factory('AuthenticationService', function(){
	var auth = {
		isAuthenticated : false ,
		isAdmin : false
	}
	return auth;
});

//Communication Service, manage to send to request to server.
app.factory('ComService', function($http){
	return {
		saveCom:function(com, token){
			return $http.post(options.api.base_url + '/com/save', {com: com, token: token});
		},

		list:function(token){
			return $http.post(options.api.base_url  + '/com/list', {token: token});
		},

		queryCom:function(id, token){
			return $http.post(options.api.base_url + '/com/query' ,{id: id, token: token});
		},

		delete:function(id, token){
			return $http.post(options.api.base_url + '/com/delete', {id: id, token: token});
		},

		saveInfo:function(pinfo, token){
			return $http.post(options.api.base_url + '/info/save', {pinfo: pinfo, token: token});
		},

		queryInfo:function(username, token){
			return $http.post(options.api.base_url + '/info/query', {username: username, token: token});
		},
		tagComInfo:function(id, isAdded, token){
			return $http.post(options.api.base_url + '/com/tag/info/added', {id: id, isAdded:isAdded, token: token});
		},
		tagComDeleted: function(id, inputValue, token){
			return $http.post(options.api.base_url + '/com/tag/com/deleted', {id: id, 
				isDeletedByAdmin: true, reason: inputValue, token: token});
		},
		tagComReverted: function(id, token){
			return $http.post(options.api.base_url + '/com/tag/com/reverted', {id: id, 
				isDeletedByAdmin: false , token: token});
		}
	};
});

// User service.
app.factory('UserService', function($http){
	return{
		logIn:function(username, password){
			return $http.post(options.api.base_url + '/user/signin', {username: username.toLowerCase(), password: password});
		}
	};
});


// Remember me service, not finished, to be done.
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


// Share service, mainly to transfer data between controllers.
app.factory('ShareService', function(){
	var username = '';
	var comId = ''; // Communication ID;
	var comData = {};  // Communication data;
	var isEdit = false;
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
		},
		setEdit:function(status){
			isEdit = status;
		},
		isEdit:function(){
			return isEdit;
		}
	}
});