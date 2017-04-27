Ext.define("EdealMobile.view.edit.widget.FobField", {
	xtype : 'editwidget-FobField',
	extend : 'EdealMobile.view.edit.widget.AbstractEditField',
	config: {
		baseCls:"fobField",
		itemClass: "EdealMobile.view.edit.widget.FobFieldItem"
	},
	initialize: function () {
		EdealMobile.view.edit.widget.AbstractEditField.prototype.initialize.apply(this, arguments);
	}
})

Ext.define("EdealMobile.view.edit.widget.FobFieldItem", {
	extend : 'Ext.Container',
	xtype:"fobField-Item",
	requires: ["Ext.field.Hidden"],
	config: {
		layout:"hbox",
		cls: "field",
		flex:1,
		items: [{
			xtype: "button",
			flex:1
		}, {
			xtype: "hiddenfield"
		},{
			xtype: "button",
			cls:"open",
			html:Loc.get("edit.CHOOSE")
		}],
		listeners: {
			focus: function() { this.addCls("focus");},
			change: function() {this.removeCls("focus");}
		}
	},
	initialize: function() {
		Ext.Container.prototype.initialize.apply(this, arguments);
		var input = this.query(".hiddenfield")[0];
		input.addListener("change", function(input, newValue, oldValue, eOpts){
			this.fireEvent("change", input, newValue, oldValue, eOpts);
		}, this)
	},
	setData: function(data) {
		Ext.Component.prototype.setData.apply(this, arguments);

		var validations = data.widgetDefinition.validations;
		
		for (var i=0; i<validations.length;i++) {
			if (validations[i].type == "presence") {
				//this.query(".button")[0].setRequired(true);
			}
		}
		
		this.query(".button")[0].setData(this.getData());
		this.query(".hiddenfield")[0].setName(this.getData().fieldInfo.sql);
		this.query(".hiddenfield")[0].setValue(this.getData().content.id);
		if (!this.getData().content.displayedValue) {
			this.query(".button")[0].setText(Loc.get("edit.EMPTY_FOB_DEFAULT_VALUE"));
		} else {
			this.query(".button")[0].setText(this.getData().content.displayedValue);
		}

	},
	getValue: function() {
		return this.query(".hiddenfield")[0].getValue();
	}
})

Ext.define("EdealMobile.view.edit.widget.FobFieldSelectionList", {
	xtype:"fobField-selectionList",
	extend : 'EdealMobile.view.ValidatedPanel',
	config: {
		id:"fobSelectionPopup",
		items: [{
			xtype: "container",
			layout:"vbox",
			scrollable:false,
			cls: "content",
			items: [{
				xtype:"container",
				layout:"hbox",
				cls:"header",
				items: [{
		        	xtype: "button",
					text: Loc.get("search.SEARCH"),
					cls:"searchButton"
				},{
		        	xtype: "textfield",
					placeHolder: Loc.get("search.WRITE_YOUR_SEARCH"),
					name:"searchInput",
					flex:"1"
				},{
		        	xtype: "button",
					cls:"close",
					iconCls: 'delete',
				    iconMask: true
				}]
			},{
				xtype:"panel",
				layout:"fit",
				flex:"1",
				hidden:true,
				cls:"searchResultContainer",
				items: [{
					xtype:"layout-ListDataView"
				}]
			},{
				flex:"1",
				cls:"searchNoResult",
				hidden:true,
				html:Loc.get("search.NO_RESULT_AVAILABLE")
			}]
		}]
	},
	show: function() {
		Ext.Panel.prototype.show.call(this);
		Ext.ComponentQuery.query("#applicationScreen")[0].setMasked(true);
		this.query(".layout-ListDataView")[0].getStore().setData();
		this.query(".container[cls~='header'] .component[name='searchInput']")[0].setValue("");
		this.query(".container[cls~='header'] .component[name='searchInput']")[0].focus();
	},
	hide: function() {
		Ext.ComponentQuery.query("#applicationScreen")[0].setMasked(false);
		Ext.Panel.prototype.hide.call(this);
	},
	displayNoResultView: function () {
		this.query(".component[cls~='searchNoResult']")[0].show();
		this.query(".component[cls~='searchResultContainer']")[0].hide();
	},
	displayDataView: function () {
		this.query(".component[cls~='searchNoResult']")[0].hide();
		this.query(".component[cls~='searchResultContainer']")[0].show();
	}
});


