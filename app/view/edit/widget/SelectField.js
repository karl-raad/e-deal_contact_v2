Ext.define("EdealMobile.view.edit.widget.SelectField", {
	xtype : 'editwidget-SelectField',
	extend : 'EdealMobile.view.edit.widget.AbstractEditField',
	config: {
		baseCls:"selectField",
		itemClass: "EdealMobile.view.edit.widget.SelectFieldItem"
	},
	initialize: function () {
		if (this.getInitialConfig().itemsExtraConfig.options.length>4 || this.getData().fieldInfo.isMultival == false) {
			
			//options = [{text:"", value:""}];
			var fieldData = this.getData();
			//var isMultival = fieldData.fieldInfo.isMultival;
			var validations = fieldData.widgetDefinition.validations;
			var isRequired = false;
			for (var i=0; i<validations.length;i++) {
				if (validations[i].type == "presence") {
					isRequired = true;
					break;
				}
			}
			if (!isRequired || this.getData().fieldInfo.isMultival == true) {
				this.getInitialConfig().itemsExtraConfig.options = [{text:"", value:""}].concat(this.getInitialConfig().itemsExtraConfig.options);
			}
			
			EdealMobile.view.edit.widget.AbstractEditField.prototype.initialize.apply(this, arguments);
			this.updateItemsValues();
		}
		// if the field is multivalue and there is not plenty of value, I use check box instead of select box
		else {
			this.initInProgress = true;
			this.addCls ("abstractEditField");
			this.labelComponent = this.query(".component[cls~='label']")[0];
			this.itemsContainer = this.query(".container[cls~='itemsContainer']")[0];
			// Update field label
			this.labelComponent.setHtml(this.getData().fieldInfo.label);

			var options = this.getInitialConfig().itemsExtraConfig.options;

			// remove empty first option (useless for check box)
			//options.shift();

			// for each option I create a radio button
			for (i=0; i<options.length; i++) {
				var item = Ext.create("Ext.field.Checkbox", {
					cls:"field",
		            name : this.getData().fieldInfo.sql,
		            value: options[i].value,
		            label: options[i].text
				})
				this.itemsContainer.add(item);
				// Add a global change event for the Widget controller
				item.addListener("check", function (item, previousValue, newValue) {
					if(!this.initInProgress)
						this.fireEvent("itemChange", item, this, false, true);
				}, this);
				item.addListener("uncheck", function (item, previousValue, newValue) {
					if(!this.initInProgress)
						this.fireEvent("itemChange", item, this, true, false);
				}, this);
			}

			// I check the item found in content
			for (var i=0; i<this.getData().content.length; i++) {
				var selectedId = this.getData().content[i].id;
				this.itemsContainer.getItems().each(function (item) {
					if (item.getValue()==selectedId)
						item.check();
				});
			}
			this.initInProgress = false;
		}
	},
	addItem: function () {
		var item = EdealMobile.view.edit.widget.AbstractEditField.prototype.addItem.apply(this, arguments);
		if (item) {
			item.addListener("change", this.onChangeItemValue, this);

			if (this.isItemContentEmpty(item))
				this.updateItemsValues();
		}
	},
	removeItem: function (item) {
		EdealMobile.view.edit.widget.AbstractEditField.prototype.removeItem.apply(this, arguments);
		this.updateItemsValues();
	},
	onChangeItemValue: function () {
		this.updateItemsValues();
	},
	getValues: function () {
		var returnValues = new Array();
		var items = this.query(".selectfield");
		for (var i=0; i<items.length; i++) {
			var currentSelectValue = items[i].getValue();
			returnValues.push(currentSelectValue);
		}
		return returnValues;
	},
	updateItemsValues: function() {
		var items = this.query(".selectfield");
		if (this.getData().fieldInfo.isMultival == true) {
			var allValues = this.getValues();
			for (var i=0; i<items.length; i++) {
				items[i].removeValuesExceptCurrentSelectedValue(allValues);
			}
		}
	},
	isItemContentEmpty: function (item) {
		return !item.getValue();
	}
})

Ext.define("EdealMobile.view.edit.widget.SelectFieldItem", {
	extend : 'Ext.field.Select',
	config: {
		cls: "field",
		usePicker: false,
		listeners: {
			focus: function() { this.addCls("focus");},
			blur: function() { this.removeCls("focus");}
		}
	},
	initialize: function () {
		Ext.field.Select.prototype.initialize.apply(this, arguments);
	},
	setData: function (data) {
		EdealMobile.utils.WidgetFactory.initFieldItem(this, data);
		if (data.content.id)
			this.setValue(data.content.id);
		Ext.field.Select.prototype.setData.call(this, data);
	},
	removeValuesExceptCurrentSelectedValue: function (values) {
		newOptions = Ext.Array.filter(this.getInitialConfig().options, function(item){
			return this.getValue() == item.value || values.indexOf(item.value)<0;
		}, this)
		this.setOptions(newOptions);
	}
})