// 2 functions:
// - hide and show loaders
// - set root URL path

Ext.define("EdealMobile.proxy.BaseProxy", {
	extend: "Ext.data.proxy.Rest",
	config: {
		actionMethods:{create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'},
		writer: {
			write: function(request) {
				Ext.data.writer.Json.prototype.write.call(this, request);
			}
		}
	},
	firstCall: true,
	read: function ( operation, callback, scope ) {
		this.process("read", operation, callback, scope);
	},
	create: function ( operation, callback, scope ) {
		this.process("create", operation, callback, scope);
	},
	update: function ( operation, callback, scope ) {
		this.process("update", operation, callback, scope);
	},
	destroy: function ( operation, callback, scope ) {
		this.process("destroy", operation, callback, scope);
	},
	init: function() {
		// If the user didn't specify a specific URL (starting with http)
		// then we use domain + version url define in setting (normaly used only for hub calls)
		if (!this.getUrl().match(/^http.*/)) {
			this.setUrl(Settings.get(Settings.CURRENT_BASE).urlApi+this.getUrl());
		}
	},
	process: function (action, operation, callback, scope) {
		callbackHideLoader = this.preprocess(callback, scope);


		if (operation.getParams() == null)
			operation.setParams({})

		operation.getParams().appVersion = EdealMobile.app.APPLICATION_VERSION;
		operation.getParams().appOS = EdealMobile.app.APPLICATION_OS;

		if(Settings.get(Settings.__NP_AUTH_TOKEN__)) {
			this.getHeaders().__NP_AUTH_TOKEN__ = Settings.get(Settings.__NP_AUTH_TOKEN__);
			operation.getParams().__NP_AUTH_TOKEN__ = Settings.get(Settings.__NP_AUTH_TOKEN__);
		}

		var url = this.getUrl();
		EdealMobile.utils.Debug.logForSupport("CALL -> "+url, operation.getParams());
		callbackLogResult  = function () {
			callbackHideLoader.apply(scope, arguments);
			// don't remove debug log, there are used to get customer logs when application is on production
			EdealMobile.utils.Debug.logForSupport("RECEIVE <- "+url, operation.getRecords()[0].getData());
		}
		Ext.data.proxy.Ajax.prototype[action].call(this, operation, callbackLogResult, scope);
	},
	processCustomAjaxQuery: function(options, callback, scope) {
		callbackHideLoader = this.preprocess(callback, scope);

		var callbackGenerateApiResult = function (connection, success, request) {
			var connectionResult = Ext.create('EdealMobile.model.apiresult.ApiResult');
			connectionResult.parseNativeRequest(request);
			// don't remove debug log, there are used to get customer logs when application is on production
			EdealMobile.utils.Debug.logForSupport("RECEIVE custom result <- "+connection.url, connectionResult.getData());
			callbackHideLoader.call(scope, connectionResult);
		}
		options.url = this.getUrl();
		options.callback = callbackGenerateApiResult;
		options.scope = scope;

		if (!options.params)
			options.params({})
		if(!options.defaultHeaders) {
			options.defaultHeaders = {}
		}
		options.params.appVersion = EdealMobile.app.APPLICATION_VERSION;
		options.params.appOS = EdealMobile.app.APPLICATION_OS;

		if(Settings.get(Settings.__NP_AUTH_TOKEN__)) {
			options.params.__NP_AUTH_TOKEN__ = Settings.get(Settings.__NP_AUTH_TOKEN__);
			options.defaultHeaders.__NP_AUTH_TOKEN__ = Settings.get(Settings.__NP_AUTH_TOKEN__);
		}
			
		
		var connection = new Ext.data.Connection();
		EdealMobile.utils.Debug.logForSupport("CALL ->"+this.getUrl(), options.params);
		connection.request(options);
	},
	preprocess: function(callback, scope) {
		var proxy = this
		var allowUserNavigation = this.config.allowUserNavigation;
		if (!allowUserNavigation)
			EdealMobile.app.getAppLayout().showLoader();
		if(this.firstCall) {
			this.init();
			this.firstCall = false;
		}
		callbackHideLoader = function () {
			if (!allowUserNavigation)
				EdealMobile.app.getAppLayout().hideLoader();
			if(callback)
				callback.apply(scope, arguments);
		}
		return callbackHideLoader;
	}
})
