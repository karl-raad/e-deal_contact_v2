Ext.define("EdealMobile.view.edit.widget.DateField", {
	xtype : 'editwidget-DateField',
	extend : 'EdealMobile.view.edit.widget.AbstractEditField',

	config: {
		baseCls:"dateField",
		itemClass: "EdealMobile.view.edit.widget.DateFieldItem"
	}
});

Ext.define("EdealMobile.view.edit.widget.DateFieldItem", {
	xtype : 'editwidget-DateField',
	extend : 'Ext.field.DatePicker',
	config: {
		cls: "field",
		clearIcon: false,
		//dateFormat: "d/m/Y",
		/*picker:{
			 yearFrom : new Date().getFullYear() - 100,
			 yearTo : new Date().getFullYear() + 100,
			 value: new Date()
        },*/
		listeners: {
			focus: function() { this.addCls("focus");},
			blur: function() {this.removeCls("focus");}
		}
	},
	initializeLocale: function() {
		this.setDateFormat(EdealMobile.utils.DataDescriptor.getLocale().DATEFORMAT);
		
		var slotOrder = [];
		var sdf = EdealMobile.utils.DataDescriptor.getLocale().DATEFORMAT.split("/");
		for (var i=0; i<sdf.length; i++) {
			if (sdf[i].toUpperCase() == "D") {
				slotOrder.push("day");
			}
			if (sdf[i].toUpperCase() == "M") {
				slotOrder.push("month");
			}
			if (sdf[i].toUpperCase() == "Y") {
				slotOrder.push("year");
			}
		}
		
		this.setPicker(Ext.create("Ext.picker.Date", {
			useTitles: true,
			yearFrom : new Date().getFullYear() - 100,
			yearTo : new Date().getFullYear() + 100,
			value: new Date(),
			dayText: Loc.get("edit.DAY"),
			monthText: Loc.get("edit.MONTH"),
			yearText: Loc.get("edit.YEAR"),
			slotOrder:slotOrder
		}));
	},
	setData: function (data) {
		this.initializeLocale();
		EdealMobile.utils.WidgetFactory.initFieldItem(this, data);
		this.setValue(data.content.displayedValue);
		Ext.Component.prototype.setData.call(this, data);
	}
})