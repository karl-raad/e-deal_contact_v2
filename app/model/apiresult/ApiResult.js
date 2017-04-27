Ext.define('EdealMobile.model.apiresult.ApiResult', {
	extend: 'Ext.data.Model',
	config: {
		/*
		 * The 2 fields status and data are used until we know if the API sucess or is an error result
		 */
		fields: [
		         {name: 'status',     type: 'number'},
		         {name: 'apiVersion'},
		         {name: 'data', mapping: "data"}
		]
	},
	resultError: null,
	parseResult: function (operation, record,catchAuthentificationError) {
		var rawResult = null;
		try {
			rawResult = operation.getResultSet().getRecords()[0].data;
		} catch (e) {
			// misformed result, certainly a 404 error
		}
		if (rawResult==null) {
			this.set("status", operation.getError().status);
			this.resultError = Ext.create("EdealMobile.model.apiresult.ErrorApiResult", EdealMobile.model.apiresult.Errors.NO_RESPONSE_FROM_SERVER)
		} else {
			if (this.get("status")!=200) {
				this.resultError = Ext.create("EdealMobile.model.apiresult.ErrorApiResult", rawResult.data);
				this.resultError.setExtraData(rawResult.data.data);
				if (!this.isLoginApi && this.resultError && this.resultError.isAuthentificationError()) {
					EdealMobile.app.getMainController().alert(null, Loc.get("login.YOU_HAVE_BEEN_DISCONNECTED"));
					EdealMobile.app.getMainController().showLogin();
					if(typeof catchAuthentificationError == "undefined" || !catchAuthentificationError) {
						throw new Error("Authentification error");
					}
				}
			}
		}
	},
	parseNativeRequest: function (request) {
		if (request==null) {
			this.set("status", 404);
			this.resultError = Ext.create("EdealMobile.model.apiresult.ErrorApiResult", EdealMobile.model.apiresult.Errors.NO_RESPONSE_FROM_SERVER)
		} else if (request.status!=200) {
			this.set("status", request.status);
			this.resultError = Ext.create("EdealMobile.model.apiresult.ErrorApiResult", EdealMobile.model.apiresult.Errors.NO_RESPONSE_FROM_SERVER)
		} else {
			var obj = Ext.JSON.decode(request.responseText);
			this.set("status", obj.status)
			this.set("data", obj.data);
			if (this.get("status")!=200) {
				this.resultError = Ext.create("EdealMobile.model.apiresult.ErrorApiResult", this.get("data"));
				this.resultError.setExtraData(this.get("data").data);
				if (!this.isLoginApi && this.resultError && this.resultError.isAuthentificationError()) {
					EdealMobile.app.getMainController().showLogin();
					throw new Error("Authentification error");
				}
			} else {
				var obj = Ext.JSON.decode(request.responseText);
				this.set("status", obj.status)
				this.set("data", obj.data);
			}
		}
	},
	getError: function () {
		return this.resultError;
	},
	callAction: function (params, _callback, scope, catchAuthentificationError) {
		this.save({
			params:params,
			callback: function(record, operation){
				this.parseResult (operation, record,catchAuthentificationError);
				_callback.call(scope);
			}
		});
	},
	// Replace fobID by the fob.toString or refvalueID by refval(text1)
	dataWithParsedIDs: null,
	getDataWithFobAndRefValue: function() {
		if (this.dataWithParsedIDs==null) {
			this.dataWithParsedIDs = Ext.clone(this.getData());
	 		for (key in this.getData()) {
				if (this.getData()[key]!=null) {
					var fieldDefinition = EdealMobile.utils.DataDescriptor.getFieldInfo(key)
					if (fieldDefinition) {
						// get refID field value
						if (fieldDefinition.tabID) {
							this.dataWithParsedIDs[key] = EdealMobile.utils.DataDescriptor.getReferenceValue(this.getData()[key]);
						// get fobID field value
						} else if (fieldDefinition.fobID) {
							var fobId = this.getData()[key];
							var fobObject = this.getData().linkedFob[fobId];
							if (fobObject) {
								this.dataWithParsedIDs[key] = fobObject.toString;
							}
						}
					}
				}
			}
		}
		return this.dataWithParsedIDs;
	}
});