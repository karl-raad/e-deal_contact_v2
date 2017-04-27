Ext.define("EdealMobile.view.read.widget.AddressField", {
	xtype : 'readwidget-AddressField',
	extend : 'Ext.Component',
	config: {
		baseCls: "addressField",
		cls: "field",
		tpl: "<div class='label'><div class='decorator'><span class='content'>{widgetDefinition.label}</span></div></div>" +
			"<tpl for='content'><div class='value'><div class='decorator'><div class='content'>" +
				"<p>{add1}</p>" +
				"<p>{add2}</p>" +
				"<p>{add3}</p>" +
				"<p>{formatedLastline}</p>" +
			"</div></div></tpl>"
	},
	setData: function (data) {
		this.addCls(data.widgetDefinition.type);
		data.content[0].formatedLastline = (data.content[0].zip+"          "+data.content[0].city+"          "+data.content[0].country).trim();
		data.content[0].formatedLastline = data.content[0].formatedLastline.replace(/          /g, ", ");		
		if(!data.content[0].add1 && !data.content[0].add2 && !data.content[0].add3 && !data.content[0].zip && !data.content[0].city)
			this.addCls("empty");
		Ext.Component.prototype.setData.call(this, data);
	},
	initialize: function() {
		var values = this.element.query(".value");
		for (var i=0; i<values.length; i++) {
			var valueNode = new Ext.Element(values[i]);
			valueNode.addListener("tap", function( event, node, options, eOpts ) {
				this.fireEvent('addresstap', this, options)
			}, this, this.getData().content[i] );
		}
	}
})