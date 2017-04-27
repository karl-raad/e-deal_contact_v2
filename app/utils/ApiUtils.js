Ext.define('EdealMobile.utils.ApiUtils', {
	singleton: true,
	requires: ['EdealMobile.proxy.BaseProxy',
               'EdealMobile.model.apiresult.ApiResult'],
               
    createActivateApplicationConnection:function () {
		var connectionResult = Ext.create('EdealMobile.model.apiresult.ApiResult');
		connectionResult.setProxy(Ext.create('EdealMobile.proxy.BaseProxy', {
			url: EdealMobile.app.HUB_SETTING_URL
		}))
		return connectionResult;
	},
    createCheckMobileVersionsConnection: function () {
		var connectionResult = Ext.create('EdealMobile.model.apiresult.ApiResult');
		connectionResult.setProxy(Ext.create('EdealMobile.proxy.BaseProxy', {
			url: "checkMobileVersions"
		}))
		return connectionResult;
	},
	createLoginConnection: function () {
		var connectionResult = Ext.create('EdealMobile.model.apiresult.ApiResult');
		connectionResult.setProxy(Ext.create('EdealMobile.proxy.BaseProxy', {
			url: "loginApi"
		}));
		connectionResult.isLoginApi = true;
		return connectionResult;
	},
	createLogoutConnection: function () {
		var connectionResult = Ext.create('EdealMobile.model.apiresult.ApiResult');
		connectionResult.setProxy(Ext.create('EdealMobile.proxy.BaseProxy', {
			url: "logout"
		}))
		return connectionResult;
	},
	createGetListConnection: function () {
		var connectionResult = Ext.create('EdealMobile.model.apiresult.ApiResult');
		connectionResult.setProxy(Ext.create('EdealMobile.proxy.BaseProxy', {
			url: "getList"
		}))
		return connectionResult;
	},
	createGetInteractionsListConnection: function () {
		var connectionResult = Ext.create('EdealMobile.model.apiresult.ApiResult');
		connectionResult.setProxy(Ext.create('EdealMobile.proxy.BaseProxy', {
			url: "getInteractions"
		}))
		return connectionResult;
	},
	createGetKPIConnection: function () {
		var connectionResult = Ext.create('EdealMobile.model.apiresult.ApiResult');
		connectionResult.setProxy(Ext.create('EdealMobile.proxy.BaseProxy', {
			url: "getKPI"
		}))
		return connectionResult;
	},
	defineRestRessourceClass: function(objectName) {
		var fieldsDefinition = this.getFieldsDefinition(objectName);
		Ext.define('EdealMobile.model.apiresult.ApiResult.'+objectName, {
			extend: 'EdealMobile.model.apiresult.RestApiResult',
			config: {
				proxy: Ext.create('EdealMobile.proxy.BaseProxy', {
		            url : objectName
		        }),
		        fields: fieldsDefinition,
				objectName: objectName
			}
		})
	},
	getFieldsDefinition: function(objectName) {
		var fieldsDefinition = [];
		var objectFieldsList = EdealMobile.app.getDataDescriptor().getObjectFieldList(objectName);
		for (i=0; i< objectFieldsList.length; i++) {
			var fieldName = objectFieldsList[i];
			var fieldInfo = EdealMobile.app.getDataDescriptor().getFieldInfo(fieldName);
			if (fieldsDefinition) {
				fieldsDefinition.push({
					name: fieldInfo.sql,
					mapping: "data.result.object."+fieldInfo.sql
				})
			}
		}
		fieldsDefinition.push({
			name: "linkedFob",
			mapping: "data.result.linkedFob"
		})
		fieldsDefinition.push({
			name: "linkedList",
			mapping: "data.result.linkedList"
		})
		fieldsDefinition.push({
			name: "toString_",
			mapping: "data.result.toString_"
		})
		return fieldsDefinition;
	},
	loadRessource: function(objectName, id, _callback, scope) {
		// load is a model static function, we need to define an ApiResult with correct proxy to load it
		EdealMobile.utils.ApiUtils.getRestRessourceClass(objectName).load(id, {
		    callback: function(record, operation){
		    	record.parseResult (operation, record);
				_callback.call(scope, record, operation);
			}
		});
	},
	getRestRessourceClass: function (objectName) {
		return Ext.ClassManager.get('EdealMobile.model.apiresult.ApiResult.'+objectName);
	},
	getRestRessourceConnection: function(objectName) {
		return new EdealMobile.utils.ApiUtils.getRestRessourceClass(objectName).create();
	}
});