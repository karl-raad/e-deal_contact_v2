Ext.define('EdealMobile.model.apiresult.ErrorApiResult', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
	         {name: 'type',     type: 'string'},
	         {name: 'subtype',      type: 'string'},
	         {name: 'code',      type: 'string'},
	         {name: 'message',      type: 'string'}
		]
	},
	extraData: null,
	setExtraData: function(extraData) {
		this.extraData = extraData
	},
	getExtraData: function() {
		return this.extraData;
	},
	isAuthentificationError: function() {
		return this.getData().type == "AUTHORIZATION_ERROR" && this.getData().subtype == "AUTHENTIFICATION";
	},
	is404Error: function() {
		return this.getData().type == "NO_RESPONSE_FROM_SERVER";
	}
});



ERROR_CODES = {
	NO_RESPONSE_FROM_SERVER:0,
	CLIENT_IS_OBSOLETE: "CONFIGURATION_ERROR_CHECK_APPLICATION_ERROR1001",
	NOT_OPTIMAL_CLIENT_VERSION: "CONFIGURATION_ERROR_CHECK_APPLICATION_ERROR1002",
	BLOCKED_ACCOUNT:"AUTHORIZATION_ERROR_AUTHENTIFICATION0002",
	WRONG_LOGIN_PASSWORD:"AUTHORIZATION_ERROR_AUTHENTIFICATION0001"
}


Ext.define('EdealMobile.model.apiresult.Errors', {
	singleton: true,
	NO_RESPONSE_FROM_SERVER: {
		type:"NO_RESPONSE_FROM_SERVER",
		subtype:"",
		code:ERROR_CODES.NO_RESPONSE_FROM_SERVER,
		message:"no response has been send by the server"
	},
	UNMANAGED_API_EXCEPTION: {
		type:"UNMANAGED_API_EXCEPTION"
	}
})