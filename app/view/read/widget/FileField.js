Ext.define("EdealMobile.view.read.widget.FileField", {
	xtype : 'readwidget-FileField',
	extend : 'Ext.Component',
	config: {
		baseCls: "fileField",
		cls: "field",
		tpl: "<div class='label'><div class='decorator'><span class='content'>{widgetDefinition.label?widgetDefinition.label:fieldInfo.label}</span></div></div>" +
			"<tpl for='content'><div class='value'><div class='decorator'><span class='content'>{displayedValue}</span></div></div></tpl>"
	},
	setData: function (data) {
		this.addCls(data.fieldInfo.sql);
		this.addCls(data.widgetDefinition.type);
		if(!data.content[0].displayedValue && data.content.length<2)
			this.addCls("empty");
		
		Ext.Component.prototype.setData.call(this, data);
	},
	initialize: function() {
		var values = this.element.query(".value");
		for (var i=0; i<values.length; i++) {
			var valueNode = new Ext.Element(values[i]);
			valueNode.addListener("tap", function( event, node, options, eOpts ) {
				this.fireEvent('filetap', this, options)
			}, this, this.getData().content[i] );
		}
	}
})