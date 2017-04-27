Ext.define("EdealMobile.view.DebugView", {
	extend : 'Ext.Container',
	xtype : 'debug',
	id: "debugLayout",
	config: {
		layout: "vbox",
		scrollable: true,
		items: [{
			cls:"closeButton",
			xtype:"button",
			text:"Close log window"
		},{
			cls:"debugInfo",
			xtype:"textareafield",
			clearIcon: false,
            maxRows: 20
		}]
	},

	initialize: function () {
		/*
		this.query(".button[cls~='closeButton']")[0].addListener("tap", function() {
			this.hide();
		}, this);
		*/
	},
	updateDebugInfo: function () {
		this.query(".textareafield")[0].setValue(EdealMobile.utils.Debug.logDataForSuport);
	}
});
