Ext.define("EdealMobile.view.read.widget.TextField", {
	xtype : 'readwidget-TextField',
	extend : 'Ext.Component',
	config: {
		baseCls: "textField",
		cls: "field",
		tpl: "<div class='label'><div class='decorator'><span class='content'>{fieldInfo.label}</span></div></div>" +
			"<tpl for='content'><div class='value'><div class='decorator'><span class='content'>{displayedValue}</span></div><div class='subaction'>{displayedValue}</div></div></tpl>"
	},
	setData: function (data) {
		this.name=data.fieldInfo.sql;
		this.type=data.widgetDefinition.type;
		this.subtype=data.widgetDefinition.subtype;
		this.addCls(data.fieldInfo.sql);
		this.addCls(data.widgetDefinition.type);
		this.addCls(data.widgetDefinition.subtype);
		if(!data.content[0].displayedValue && data.content.length<2)
			this.addCls("empty");
		Ext.Component.prototype.setData.call(this, data);
	},
	initialize: function() {
		var values = this.element.query(".value .decorator");
		for (var i=0; i<values.length; i++) {
			var valueNode = new Ext.Element(values[i]);
			valueNode.addListener("tap", function( event, node, options, eOpts ) {
				this.fireEvent('itemtap', this, options)
			}, this, this.getData().content[i] );
		}
		var values = this.element.query(".value .subaction");
		for (var i=0; i<values.length; i++) {
			var valueNode = new Ext.Element(values[i]);
			valueNode.addListener("tap", function( event, node, options, eOpts ) {
				this.fireEvent('subtasktap', this, options)
			}, this, this.getData().content[i] );
		}
	}
})