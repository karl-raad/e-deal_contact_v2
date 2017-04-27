Ext.define("EdealMobile.view.edit.widget.AbstractEditField", {
	extend : 'Ext.Container',
	xtype: "abstractEditField",
	config: {
		items: [{
			cls: "label"
		}, {
			xtype:"container",
			cls:"itemsContainer"
		}, {
			xtype:"button",
			cls:"addItem",
			text: Loc.get('edit.ADD_CONTENT'),
			hidden: true
		}]
	},
	labelComponent: null,
	itemsContainer: null,
	initialize: function() {
		this.initInProgress = true;
		this.labelComponent = this.query(".component[cls~='label']")[0];
		this.itemsContainer = this.query(".container[cls~='itemsContainer']")[0];
		this.addButton = this.query(".button[cls~='addItem']")[0];
		this.addCls ("abstractEditField");

		// Update field label
		if(this.getData().fieldInfo)
			this.labelComponent.setHtml(this.getData().fieldInfo.label);

		// Add one item for each content
		var content = this.getData().content;
		for (var i=0; i<content.length; i++) {
			var addedItem = this.addItem(content[i]);
		}
		// Add item button
		if (this.getData().fieldInfo.isMultival) {
			this.addButton.show();
			this.addButton.addListener("tap", function (button) {
		    	this.addItem({
		    		displayedValue: null,
		    		id: null,
		    		objectName: null
		    	});
			}, this)
			this.manageAddButton();
		}
		this.initInProgress = false;
	},
	addItem: function (content) {
		var items = this.query(".component[cls~='removableItem']");
		var lastItem = items.length>0 ? items[items.length-1].getItems().get(0) : null
		if (lastItem && this.isItemContentEmpty(lastItem))
			return;

		// Item Creation
		var itemData = this.getData();
		itemData.content = content;

		itemsOptions = {
			flex: 1,
			data: itemData
		}
		if (this.getInitialConfig().itemsExtraConfig) {
			itemsOptions = Ext.merge(itemsOptions, this.getInitialConfig().itemsExtraConfig);
		}
		var item = Ext.create(this.getConfig("itemClass"), itemsOptions);

		// Add item in multi value container (mainly for remove button)
		var itemDecorator = Ext.create("Ext.Container", {
			cls:"removableItem",
			layout: "hbox",
			items: [item]
		})
		if (this.getData().fieldInfo.isMultival || ((this.getData().isFOB || this.getData().isReferenceValue) && !this.isMandatory())){// && items.length > 1) {
			var supButton = Ext.create("Ext.Button", {
				cls:"removeItem",
				xtype:"button",
				iconCls:"delete"
			});
			itemDecorator.add(supButton);
			supButton.addListener("tap", function () {
				this.removeItem(itemDecorator, {
		    		displayedValue: null,
		    		id: null,
		    		objectName: null
		    	});
				this.fireEvent("itemRemoved", undefined, this, itemDecorator, null, null);
		    }, this);
			
			if (content.displayedValue == "") {
				supButton.hide();
			}
		}
		this.itemsContainer.add(itemDecorator);

		// Some event that may be used in controller
		item.addListener("blur", function (item){
			if(!this.initInProgress)
				this.fireEvent("itemBlur", item, this, itemDecorator, item.getValue());
		}, this);
		item.addListener("change", function (item, newValue, previousValue) {
			if(!this.initInProgress) {
				this.fireEvent("itemChange", item, this, itemDecorator, newValue, previousValue);
			}
		}, this);
		if(!this.initInProgress) {
			this.fireEvent("itemAdded", item, this, itemDecorator, null, null);
		}
		
		return item;
	},
	isItemContentEmpty: function (item) {
		content = item.getData().content;
		if (!content)
			return true;
		for (key in content){
			// if on property is not empty I return false (not empty data)
			if (content[key])
				return false
		}
		return true
	},
	removeItem: function (item, defaultEmptyValue) {
		// Remove the item
		this.query(".container[cls~='itemsContainer']")[0].remove(item, true);
		// if the number of items left is equal to zero, I add an empty input
		itemsLeft = this.query(".component[cls~='removableItem']");
		if(itemsLeft==null || itemsLeft.length == 0)
			this.addItem(defaultEmptyValue);
	},
	getItemsList: function () {
		 var itemsWithDeleteButton = this.query(".component[cls~='removableItem']");
		 var toReturn = new Array();
		 for(var i=0; i<itemsWithDeleteButton.length; i++) {
			 toReturn.push(itemsWithDeleteButton[i].getItems().get(0));
		 }
		 return toReturn;
		//return this.query(".component[cls~='field']");
	},
	manageAddButton: function() {
		if (this.getData().fieldInfo.isMultival) {
			var isOneItemEmpty = false;
			var fieldList = this.getItemsList();
			for (var i=0; i<fieldList.length;i++) {
				if (!fieldList[i].getValue()) {
					isOneItemEmpty = true;
					break;
				}
			}
			if (isOneItemEmpty) {
				this.addButton.hide();
			} else {
				this.addButton.show();
			}
		}
	},
	isMandatory:function() {
		//  Check if field is mandatory
		var isMandatory = false;
		var validationsRules = this.getData().widgetDefinition.validations;
		for (var i=0; i<validationsRules.length && !isMandatory; i++) {
			var rule = validationsRules[i];
			if(rule.type=="presence")
				isMandatory = true;
		}
		return isMandatory;
	}
})






