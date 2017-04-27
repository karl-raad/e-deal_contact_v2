Ext.define('EdealMobile.controller.WidgetController', {
	extend: 'EdealMobile.controller.AbstractController',
	config: {
		refs: {
			fobSelectionPopup: "#fobSelectionPopup",
			fobSelectionSearchInput: "#fobSelectionPopup .container[cls~='header'] .component[name='searchInput']",
			fobSelectionDataView:"#fobSelectionPopup .layout-ListDataView"
		},
		control: {
			".fobField-Item .button": {
				tap: "openFobFieldItem"
			},
			"#fobSelectionPopup .container[cls~='header'] .button[cls~='searchButton']" : {
				tap:"searchFob"
			},
			"#fobSelectionPopup .container[cls~='header'] .button[cls~='close']" : {
				tap:"closeFobSelection"
			},
			"#fobSelectionPopup .container[cls~='header'] .component[name='searchInput']" : {
				action:"searchFob"
			},
			"#fobSelectionPopup .layout-ListDataView": {
				itemtap:"selectFob"
			},
			".abstractEditField": {
				itemChange: "contentChange",
				itemAdded: "contentChange",
				itemRemoved: "contentChange"
			},
			".container": {
				"show":"fixFocusOnBelowInputsWhenClickOnSelect"
			}
		},
	    routes: {
		    'widget/showFobSearch/:fieldSearch': 'showFobSelection'
	    }
	},
    /**
     * fix "When the user click on a list item after oppening a select box 
     * if there is another input under this select, on ios, the tap event is bubelled to this input
     * and the keyboard is opening due to the input focus"
     */
    fixFocusOnBelowInputsWhenClickOnSelect: function (container) {
    	try {
        	container.element.addListener("tap", function (e) { 
        		e.preventDefault();
        	});
    	}catch(e){
    		console.log(e);
    	}
    },
    openFobFieldItem: function(fobFieldInputItemButton) {
    	fobFieldInputItem = fobFieldInputItemButton.getParent();
    	var displayObject = fobFieldInputItem.getData().fieldInfo.fobObjectName;
    	var listInfo = EdealMobile.utils.DataDescriptor.getListViewDescriptor(displayObject);
    	if (listInfo) {
    		// keep a reference to the fob item to allow update input when the user finish to select a fob
    		this.getFobSelectionPopup().fobFieldInputItem = fobFieldInputItem;
    		// add history input to avoid leaving edit screen when user will do a back action
    		this.redirectTo("widget/showFobSearch/"+displayObject);
    	}
    	else {
			EdealMobile.utils.Debug.logForSupport("MISSING SETTINGS: no list view define for object "+displayObject);
    	}
    },
	showFobSelection: function (isBackAction, previousRoute, fieldName) {
    	var listInfo = EdealMobile.utils.DataDescriptor.getListViewDescriptor(fieldName);
    	this.getFobSelectionPopup().setData(listInfo);
    	this.getFobSelectionPopup().show();
	},
	searchFob: function () {
		var searchParams = Ext.create("EdealMobile.model.search.SearchParam", {
			search: this.getFobSelectionSearchInput().getValue().trim()
		});

		viewListDescriptor = this.getFobSelectionPopup().getData();
		var params = {
			code: viewListDescriptor.code,
			"$$nb": EdealMobile.app.NB_MAX_RESEARCH_RESULT,
			"defaultSearch":searchParams.getData().search
		};

		var getListConnection = EdealMobile.utils.ApiUtils.createGetListConnection();
		getListConnection.callAction(params, function() {
			if (getListConnection.getError()) {
				this.getFobSelectionPopup().manageServerError(getListConnection.getError());
				this.getFobSelectionPopup().displayNoResultView();
			} else {
				var getListResult = getListConnection.getData().data;
				var data = getListResult.result;
				var nbResult = data.grid.totalNbOfRecords>0 ? data.grid.totalNbOfRecords : data.grid.internalRows.length;
				
				var columnLabels = data.grid.columnTitles;
				if(data.grid.internalRows.length>0) {
					this.getFobSelectionDataView().setColumnLabels(columnLabels);
					this.getFobSelectionDataView().setIds(data.grid.rowsId);
					this.getFobSelectionDataView().setRelatedObjectName(data.relatedObjectName);
					this.getFobSelectionDataView().getStore().setData(data.grid.internalRows);
					this.getFobSelectionPopup().displayDataView();
				}
				else
					this.getFobSelectionPopup().displayNoResultView();
			}
		}, this);
	},
	closeFobSelection: function() {
		history.back();
	},
	selectFob: function (dataView, index, target, record) {
		var newData = this.getFobSelectionPopup().fobFieldInputItem.getData();
		newData.content.displayedValue = record.getData().col1;
		newData.content.id = dataView.getIds()[index];
		this.getFobSelectionPopup().fobFieldInputItem.setData(newData);

		history.back();
	},

	manageDeleteButton: function(itemContainer, value) {
		var deleteButton = itemContainer.query(".component[cls~='removeItem']")[0]; 
		if (value == "") {
			if (deleteButton) {
				deleteButton.hide();
			}
		} else {
			if (deleteButton) {
				deleteButton.show();
			}			
		}
	},
	
	contentChange: function (input, editField, inputAndSupButtonContainer, newValue, previousValue, options, event) {	
		editField.manageAddButton();
		// hide or display remove button if there only one item and the value of this item is empty or null
		var deleteButton = inputAndSupButtonContainer.query(".component[cls~='removeItem']")[0];
		if (deleteButton) {
			if (!newValue) {
				deleteButton.hide();
			} else {
				deleteButton.show();
			}
		}
		this.validateOneField(editField);
	},
	validateOneField: function (fieldsContainer) {
		var errors = new Array();
		var fieldData = fieldsContainer.getData();
		var validations = fieldData.widgetDefinition.validations;
		var isRequired = fieldsContainer.isMandatory();
		var fieldList = fieldsContainer.getItemsList();

		// Reset previous check and precheck the presence validation
		var allItemsEmpty = true;
		for (var i=0; i<fieldList.length;i++) {
			var field = fieldList[i];
			field.removeCls("error");
			//check the presence validation for each field items
			if (Ext.data.Validations.presence((field.getValue()||"").trim())) {
				allItemsEmpty = false;
			}
		}
		
		// Case of presence validation
		if (isRequired && allItemsEmpty) {
			for (var i=0; i<fieldList.length;i++) {
				var field = fieldList[i];
				field.addCls("error");
			}
			var error = new Ext.data.Error({
				field: fieldData.fieldInfo.sql, 
				message: Loc.get("edit.FIELD") + " \"" + fieldData.fieldInfo.label + "\" " + Loc.get("edit.ISREQUIRED")
			})
			errors.push(error);
		}
		
		// Case of others validations
		for (var i1=0; i1<validations.length; i1++) {
			var currentValidation = validations[i1];
			
			for (var i2=0; i2<fieldList.length;i2++) {
				var field = fieldList[i2];
				if (currentValidation.type == "format" && field.getValue() && field.getValue().trim()) {
					if (!Ext.data.Validations.format({matcher:new RegExp(currentValidation.format)}, field.getValue().trim())) {
						field.addCls("error");
						var error = new Ext.data.Error({
							field: fieldData.fieldInfo.sql, 
							message: Loc.get("edit.FIELD") + " \"" + fieldData.fieldInfo.label + "\" " + Loc.get("edit.WRONGFORMAT")
						})
						errors.push(error);
					}
				}
			}
		}
		return errors;
	}
	
});


