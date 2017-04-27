Ext.define("EdealMobile.view.read.widget.FobField", {
	xtype : 'readwidget-FobField',
	extend : 'EdealMobile.view.read.widget.TextField',
	config: {
		baseCls:"fobField"
	},
	initialize: function() {
		var values = this.element.query(".value");
		for (var i=0; i<values.length; i++) {
			var valueNode = new Ext.Element(values[i]);
			valueNode.addListener("tap", function( event, node, options, eOpts ) {
				this.fireEvent('fobtap', this, options)
			}, this, this.getData().content[i] );
		}
	}
})