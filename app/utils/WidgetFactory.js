Ext.define('EdealMobile.utils.WidgetFactory', {
	singleton: true,
    requires: ['EdealMobile.view.read.widget.TextField',
               'EdealMobile.view.read.widget.FobField',
               'EdealMobile.view.read.widget.FileField',
               'EdealMobile.view.read.widget.AddressField',
               'EdealMobile.view.edit.widget.TextField',
               'EdealMobile.view.edit.widget.SelectField',
               'EdealMobile.view.edit.widget.FobField',
               'EdealMobile.view.edit.widget.DateField',
               'EdealMobile.view.edit.widget.HiddenField'],

	create: function(widgetDefinition, apiGetObjectResult) {
		try {
			var widget = null;
			if (widgetDefinition.type == "HTML") {
				/***************************************
				 * Return an HTML component
				 */
				widget = Ext.create("Ext.Component", {
					tpl: widgetDefinition.value,
					data: apiGetObjectResult.getDataWithFobAndRefValue(),
					cls: widgetDefinition.cls
				});
			} else if (widgetDefinition.type == "LIST") {
				/***************************************
				 * Return a list view
				 */
				var listData = apiGetObjectResult.getData().linkedList[widgetDefinition.code];
				var columnLabels = listData.grid.columnTitles;
	
				var listDataView = Ext.create("EdealMobile.view.layout.ListDataView", {
					scrollable: null
				});
				listDataView.setColumnLabels(columnLabels);
				listDataView.setIds(listData.grid.rowsId);
				listDataView.setRelatedObjectName(listData.relatedObjectName);
				listDataView.setFilterBy(widgetDefinition.filterBy);
				listDataView.getStore().setData(listData.grid.internalRows);

				var listContainer = Ext.create("Ext.Container", {
					baseCls: "listDataViewContainer",
					items:[{
							xtype:"button",
							text: Loc.get('edit.ADD_CONTENT'),
							name: "addToList",
							data: {list:listDataView},
							cls:"smallBlue addToListButton"
						},
						listDataView
					]
				});
	
				// Check if the view can display read or edit view
				var readViewDescriptor = EdealMobile.app.getDataDescriptor().getReadViewDescriptor(listData.relatedObjectName);
				var editViewDescriptor = EdealMobile.app.getDataDescriptor().getEditViewDescriptor(listData.relatedObjectName);
				if (!readViewDescriptor) {
					listContainer.addCls("hasNoReadView")
				}
				if (!editViewDescriptor){
					listContainer.addCls("hasNoEditView")
				}
	
				return listContainer;
			} else if (widgetDefinition.type == "FIELD_READ") {
				/***************************************
				 * Return a field component
				 */
				/** Prepare data depending of the object properties */
				data = this.getData(widgetDefinition, apiGetObjectResult);
				
				var readViewDescription = EdealMobile.app.getDataDescriptor().getReadViewDescriptor(data.fieldInfo.fobObjectName)
				if (data.fieldInfo.fobID && readViewDescription!=null && readViewDescription.screens.length>0) {
					widget = Ext.create("EdealMobile.view.read.widget.FobField", {
						data: data
					});
				} else {
					if (data.fieldInfo.type == "String") {
						widget = Ext.create("EdealMobile.view.read.widget.TextField", {
							data: data
						});
					}
				}
			} else if (widgetDefinition.type == "ADDRESS_READ") {
				/***************************************
				 * Return a field component
				 */
				/** Prepare data depending of the object properties */
				var add1 = apiGetObjectResult.getData()[widgetDefinition.add1];
				var add2 = apiGetObjectResult.getData()[widgetDefinition.add2];
				var add3 = apiGetObjectResult.getData()[widgetDefinition.add3];
				var zip = apiGetObjectResult.getData()[widgetDefinition.zip];
				var city = apiGetObjectResult.getData()[widgetDefinition.city];
				var country = EdealMobile.app.getDataDescriptor().getReferenceValue(apiGetObjectResult.getData()[widgetDefinition.country]);
				
				var data = {
					widgetDefinition: widgetDefinition,
					content: [{
						add1: add1?add1:"",
						add2: add2?add2:"",
						add3: add3?add3:"",
						zip: zip?zip:"",
						city: city?city:"",
						country: country?country:""
					}]
				};
				
				widget = Ext.create("EdealMobile.view.read.widget.AddressField", {
					data: data
				});
			} else if (widgetDefinition.type == "FIELD_FILE_READ") {
				/***************************************
				 * Return a field filed component
				 */
				/** Prepare data depending of the object properties */
				data = this.getData(widgetDefinition, apiGetObjectResult);
				
				var readViewDescription = EdealMobile.app.getDataDescriptor().getReadViewDescriptor(data.fieldInfo.fobObjectName)
				widget = Ext.create("EdealMobile.view.read.widget.FileField", {
					data: data
				});
			} else if (widgetDefinition.type == "FIELD_TEXT") {
				data = this.getData(widgetDefinition, apiGetObjectResult);
				widget = Ext.create("EdealMobile.view.edit.widget.TextField", {
					name: widgetDefinition.fieldname,
					data: data
				});
			} else if (widgetDefinition.type == "FIELD_SELECT") {

				data = this.getData(widgetDefinition, apiGetObjectResult);
				widget = this.createSelectField(widgetDefinition, data);
				
			} else if (widgetDefinition.type == "FIELD_DATE") {
				data = this.getData(widgetDefinition, apiGetObjectResult);
				widget = Ext.create("EdealMobile.view.edit.widget.DateField", {
					name: widgetDefinition.fieldname,
					data: data
				});
			}  else if (widgetDefinition.type == "FIELD_HIDDEN") {
				data = this.getData(widgetDefinition, apiGetObjectResult);
				if (widgetDefinition.value) {
					 data.content = [{
						id: null,
						objectName: null,
						displayedValue: widgetDefinition.value
					}]
				}
				widget = Ext.create("EdealMobile.view.edit.widget.HiddenField", {
					name: widgetDefinition.fieldname,
					data: data
				});
			} else if (widgetDefinition.type == "FIELD_DEFAULT_INPUT") {
				data = this.getData(widgetDefinition, apiGetObjectResult);
				// field is a reference list
				if (data.fieldInfo.tabID) {
					widget = this.createSelectField(widgetDefinition, data);
				// Field is a FOB
				} else if (data.fieldInfo.fobObjectName) {
					widget = Ext.create("EdealMobile.view.edit.widget.FobField", {
						name: widgetDefinition.fieldname,
						data: data,
						itemsExtraConfig: {
							
						}
					});
				// Field is just a normal textfield
				} else {
					widget = Ext.create("EdealMobile.view.edit.widget.TextField", {
						name: widgetDefinition.fieldname,
						data: data
					});
				}
			}
			return widget;
		} catch (e) {
			EdealMobile.utils.Debug.logForSupport(e, widgetDefinition, apiGetObjectResult);
			throw e;
		}
	},
	getData:function(widgetDefinition, apiResult) {
		var apiValues = apiResult.getData()[widgetDefinition.fieldname];
		var fieldInfo = EdealMobile.app.getDataDescriptor().getFieldInfo(widgetDefinition.fieldname);
		var data = {
			fieldInfo: fieldInfo,
			widgetDefinition: widgetDefinition
		}
		var multiValue = Ext.isArray(apiValues)
		if (!multiValue)
			apiValues = [apiValues];
		
		// Is standart field
		data.content = [];
		if (fieldInfo.tabID) {
			// Is reference value
			data.isReferenceValue = true;
			data.content = [];
			for(var i=0; i<apiValues.length; i++) {
				var apiValue = apiValues[i];
				data.content.push({
					id: apiValue,
					objectName: null,
					displayedValue: apiValue ? EdealMobile.app.getDataDescriptor().getReferenceValue(apiValue) : ""
				})
			}
		} else if (fieldInfo.fobObjectName) {
			// Is FOB
			data.content = [];
			data.isFOB = true;
			for(var i=0; i<apiValues.length; i++) {
				var apiValue = apiValues[i];
				var linkedFob = apiValue? apiResult.getData().linkedFob[apiValue] : null;
				data.content.push({
					id: apiValue,
					objectName: fieldInfo.fobObjectName,
					displayedValue: linkedFob!=null? linkedFob.toString: ""
				})
			}
		} else {
			// Is standart field
			data.content = [];
			for(var i=0; i<apiValues.length; i++) {
				var apiValue = apiValues[i];
				data.content.push({
					id: null,
					objectName: null,
					displayedValue:apiValue!=null?apiValue:""
				})
			}
		}
		return data;
	},
	createSelectField: function (widgetDefinition, data) {
		var options = [];
		if (data.fieldInfo.tabID) {
			var dataDescriptor = EdealMobile.app.getDataDescriptor();
			var referenceIdsList = dataDescriptor.getReferenceTableRefenceList(data.fieldInfo.tabID);
			if (referenceIdsList) {
				for(var i=0; i<referenceIdsList.length; i++) {
					if(dataDescriptor.isReferenceValueEnabled(referenceIdsList[i]))
						options.push({value: referenceIdsList[i], text: dataDescriptor.getReferenceValue(referenceIdsList[i])})
				}
			}
		}
		return Ext.create("EdealMobile.view.edit.widget.SelectField", {
			name: widgetDefinition.fieldname,
			data: data,
			itemsExtraConfig: {
				options: options
			}
		});
	},
	initFieldItem: function (field, data) {
		field.setName(data.fieldInfo.sql);
		field.type=data.widgetDefinition.type;
		//this.subtype=data.widgetDefinition.subtype;

		field.addCls(data.fieldInfo.sql);
		field.addCls(data.widgetDefinition.type);
		//this.addCls(data.widgetDefinition.subtype);

		var validations = data.widgetDefinition.validations;
		
		for (var i=0; i<validations.length;i++) {
			if (validations[i].type == "presence") {
				field.setRequired(true);
			}
		}		
		if(!data.content.displayedValue)
			field.addCls("empty");
		Ext.Component.prototype.setData.call(field, data);
	}
})
