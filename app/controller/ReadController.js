Ext.define('EdealMobile.controller.ReadController', {
	extend: 'EdealMobile.controller.AbstractController',
	config: {
		control: {
	    	".read-ReadMainContainer": {
	    		initialize: "buildScreen",
	    		reloadRequire: "buildScreen",
	    		activate: "onActivate"
	    	},
			".read-ReadMainContainer .readwidget-FileField" : {
				filetap:"fileTap"
			},
			".read-ReadMainContainer .readwidget-FobField" : {
				fobtap:"fobTap"
			},
			".read-ReadMainContainer .readwidget-TextField" : {
				itemtap:"textWidgetItemTap",
				subtasktap:"textWidgetSubtaskTap"
			},
			".read-ReadMainContainer .readwidget-AddressField" : {
				addresstap:"addresstap"
			},
			".read-ReadMainContainer .layout-ListDataView" : {
				itemtap:"listItemTap"
			},
	    	".container[baseCls~='listDataViewContainer'] .button[name~='addToList']": {
	    		tap:"addItemToList"
	    	}
	    }
	},
	buildScreen:function(readView) {
		var objectName = readView.getObjectName();
		var objectID = readView.getObjectId();
		EdealMobile.utils.ApiUtils.loadRessource(objectName, objectID, function(record) {
			if (record.getError()) {
				readView.manageServerError(record.getError());
			} else {
				readView.setRecord(record);
				readView.createCaroussel();
			}
		}, this);
	},
	onActivate: function(readView) {
		var objectName = readView.getObjectName();
		var objectID = readView.getObjectId();

		//Update context Button in tooltbar
		EdealMobile.app.getAppLayout().updateContextButton(
			Ext.create('Ext.Button', {
				xtype:"button",
				cls: "editButton",
				text: "read",
				name: "context",
				hidden: false,
				handler: function() {
					EdealMobile.app.getMainController().redirectTo("edit/"+objectName+"/"+objectID);
				}
			})
		);
	},

	fobTap: function(fobField, clickedFobData) {
		var itemId = clickedFobData.id;
		var itemObjectName = clickedFobData.objectName;
		// If there is a view defined for this object, clicking on fobfield will open the new view
		if (EdealMobile.app.getDataDescriptor().getReadViewDescriptor(itemObjectName))
			this.redirectTo("detail/"+itemObjectName+"/"+itemId);
	},

	textWidgetItemTap: function(readField, clickedFieldData) {
		if (readField.subtype == "PHONE" || readField.subtype == "MOBILE") {
			EdealMobile.app.call(clickedFieldData.displayedValue);
		} else if (readField.subtype == "EMAIL"){
			EdealMobile.app.email(clickedFieldData.displayedValue);
		} else if (readField.subtype == "URL"){
			EdealMobile.app.openUrl(clickedFieldData.displayedValue);
		}
	},
	textWidgetSubtaskTap: function(readField, clickedFieldData) {
		if (readField.subtype == "MOBILE") {
			EdealMobile.app.sms(clickedFieldData.displayedValue);
		}
	},
	fileTap: function(readField, clickedFieldData) {
		EdealMobile.app.download(clickedFieldData.id);
	},
	addresstap: function (addressField, clickedFieldData) {
		EdealMobile.app.openMap(clickedFieldData.add1,
			clickedFieldData.add2,
			clickedFieldData.add3,
			clickedFieldData.zip,
			clickedFieldData.city,
			clickedFieldData.country);
	},
	listItemTap: function(dataView, index, target, record) {
		var itemId = dataView.getIds()[index];
		var itemObjectName = dataView.getRelatedObjectName();
		// If there is a view defined for this object, clicking on fobfield will open the new view
		if (EdealMobile.app.getDataDescriptor().getReadViewDescriptor(itemObjectName))
			this.redirectTo("detail/"+itemObjectName+"/"+itemId)
	},
	addItemToList: function (button) {
		var list = button.getData().list;
		var currentScreen =  EdealMobile.app.getAppLayout().getCurrentScreen();
		
		var prefilledFobName = list.getFilterBy();
		var prefilledFobValue = currentScreen.getObjectId();
		var prefilledFobDisplayedValue = currentScreen.getRecord().toString();
		var itemObjectName = list.getRelatedObjectName();
		this.redirectTo("addToList/"+itemObjectName+"/"+prefilledFobName+"/"+prefilledFobValue+"/"+prefilledFobDisplayedValue);
	}
});
