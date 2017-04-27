Ext.define('EdealMobile.controller.EditController', {
	extend: 'EdealMobile.controller.AbstractController',
	config: {
		refs: {
			editScreen:".edit-EditMainContainer"
		},
		control: {
	    	".edit-EditMainContainer": {
	    		initialize: "onCreation",
	    		activate: "onActivate"
	    	}
	    }
	},
	onCreation:function(editView, eOpts) {
		var objectName = editView.getObjectName();
		var objectID = editView.getObjectId();
		var prefillFob = editView.getPrefillFob();
		if (objectID) {
			EdealMobile.utils.ApiUtils.loadRessource(objectName, objectID, function(record) {
				if (record.getError()) {
					this.editView.manageServerError(this.record.getError());
				} else {
					editView.setRecord(record);
					editView.createCaroussel();
				}
			}, this);
		} else {
			var record = new (EdealMobile.utils.ApiUtils.getRestRessourceClass(objectName))();
			// If we arrive from an "add object in list" view, we prefill the data with url route params
			if (prefillFob) {
				record.getData().linkedFob = {};
				record.getData().linkedFob[prefillFob.value] = {
					toString: prefillFob.display
				}
				record.getData()[prefillFob.name] = prefillFob.value;
				
				// Maybe there is no input define in widget description?
				var isFobWidgetDefined = false
				for (i1=0; i1<editView.config.viewDescriptor.screens.length&&!isFobWidgetDefined; i1++) {
					var editScreen = editView.config.viewDescriptor.screens[i1];
					for (i2=0; i2<editScreen.widgets.length&&!isFobWidgetDefined; i2++) {
						var widget = editScreen.widgets[i2];
						if (widget.fieldname==prefillFob.name)
							isFobWidgetDefined = true;
					}
				}
				// then we add a hidden input for the fob
				if(!isFobWidgetDefined && editView.viewDescriptor.screens.length>0) {
					editView.viewDescriptor = Ext.clone(editView.viewDescriptor);
					editView.viewDescriptor.screens[0].widgets.push({
						fieldname: prefillFob.name,
						options: [],
						overidable: false,
						type: "FIELD_HIDDEN",
						validations: [],
						value: prefillFob.value
					})
				}
			}
			editView.setRecord(record);
			editView.createCaroussel();
		}
	},
	onActivate: function(editView, eOpts) {
		var objectName = editView.getObjectName();
		var objectID = editView.getObjectId();

		EdealMobile.app.getAppLayout().updateContextButton(
			Ext.create('Ext.Button', {
				xtype:"button",
				id: "saveButton",
				cls: "saveButton",
				text: "save",
				name: "context",
				hidden: false,
				handler: function() {			
					var errors = editView.validate();
					if (errors.length == 0) {
						var editForm = editView.editForm;
						var record = editView.getRecord();
						record.setData(Ext.merge(record.getData(), editForm.getValues()));
						record.save(function (apiResult) {
							if (!apiResult.getError()) {
								// new object
								if(!objectID) {
									var newObjectID = apiResult.getData().data.result.objectID;
									// display the new object in read view
									EdealMobile.app.getMainController().redirectTo("detail/"+objectName+"/"+newObjectID);
								} else {
									var previousReadScreen = EdealMobile.app.getAppLayout().getPreviousScreen();
									if (previousReadScreen!=null) {
										previousReadScreen.fireEvent("reloadRequire", previousReadScreen);
										history.back();
									}
									else { /* no screen to display, application start with edit view */ }
								}
							} else {
								editForm.manageServerError(apiResult.getError());
							}
						})
					} else {
						//Build the error message
						var errorMessage = Loc.get("edit.FIELDS_ON_ERROR");
						for (var i=0; i<errors.length;i++) {
							var error = errors[i];
							errorMessage += "<br/>";
							errorMessage += "    - " + error.getMessage();
						}
						EdealMobile.app.getMainController().alert(null, errorMessage);
					}
				}
			})
		);
	}
});
