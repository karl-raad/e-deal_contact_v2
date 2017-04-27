Ext.define("EdealMobile.view.edit.widget.TextField", {
	xtype : 'editwidget-TextField',
	extend : 'EdealMobile.view.edit.widget.AbstractEditField',

	config: {
		baseCls:"textField",
		itemClass: "EdealMobile.view.edit.widget.TextFieldItem"
	},
	initialize: function () {
		// no text field are supposed to be multi value
		this.getData().fieldInfo.isMultival = false;
		EdealMobile.view.edit.widget.AbstractEditField.prototype.initialize.apply(this, arguments);
		/*
		
		*/
	}
});

Ext.define("EdealMobile.view.edit.widget.TextFieldItem", {
	xtype : 'editwidget-TextField',
	extend : 'Ext.field.Text',
	config: {
		cls: "field",
		clearIcon: false,
		listeners: {
			focus: function() { this.addCls("focus");},
			blur: function() {this.removeCls("focus");}
		}
	},
	setData: function (data) {
		EdealMobile.utils.WidgetFactory.initFieldItem(this, data);
		this.setValue(data.content.displayedValue);
		Ext.Component.prototype.setData.call(this, data);
		
		if (this.getData().widgetDefinition.subtype=="URL")
			this.getComponent().setType("url");
		if (this.getData().widgetDefinition.subtype=="EMAIL")
			this.getComponent().setType("email");
		if (this.getData().widgetDefinition.subtype=="PHONE")
			this.getComponent().setType("tel");
	}
})