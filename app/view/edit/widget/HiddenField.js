Ext.define("EdealMobile.view.edit.widget.HiddenField", {
	xtype : 'editwidget-HiddenField',
	extend : 'EdealMobile.view.edit.widget.AbstractEditField',

	config: {
		baseCls:"hiddenField",
		itemClass: "EdealMobile.view.edit.widget.HiddenFieldItem"
	}
});

Ext.define("EdealMobile.view.edit.widget.HiddenFieldItem", {
	xtype : 'editwidget-TextField',
	extend : 'Ext.field.Hidden',
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
	}
})