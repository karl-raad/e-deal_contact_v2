Ext.define('EdealMobile.model.apiresult.RestApiResult', {
	extend: 'EdealMobile.model.apiresult.ApiResult',
	save: function(callback, scope) {
		var options = {
				method:"POST"
		}
		var params = Ext.clone(this.getData());

		// delete not setted field, we don't want to set to null undefined field
		for (key in params) {
			if (typeof params[key] == "undefined")
				delete params[key];
		}
		var fieldIdName = EdealMobile.utils.DataDescriptor.getObjectFieldIDName(this.getObjectName());
		params.id = this.getData()[fieldIdName];
		params.$$presentFields = "";
		params.type = this.getObjectName();

		// Remove fob object
		delete params.linkedFob;

		options.params = params;

		// have to do a custom ajax query because the RestProxy save function will add object has a JSON body instead of POST parameters
		this.getProxy().processCustomAjaxQuery(options, callback, scope);
	},
	parseResult: function (operation, record) {
		EdealMobile.model.apiresult.ApiResult.prototype.parseResult.call(this,operation, record);
		// let remove not nessecary field from EdealMobile.model.apiresult.ApiResult
		delete this.getData().data;
		delete this.getData().status;
		delete this.getData().apiVersion;
	},
	getObjectName: function() {
		return this.getCurrentConfig().objectName;
	},
	toString: function() {
		return this.getData().toString_;
	}
});