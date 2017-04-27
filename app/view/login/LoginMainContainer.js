Ext.define("EdealMobile.view.login.LoginMainContainer", {
	extend : 'Ext.Panel',
	xtype : 'login-LoginMainContainer',
	config : {
		xtype:"container",
		layout: "vbox",
		scrollable: true,
		items: [{
			cls:"header",
			tpl:"<div class='logo'><div class='icon'></div></div><div class='title'><span class='name'>CONTACTS</span></div>"
		},{
			xtype:"container",
			cls:"content",
			items: [{
			    id: 'loginForm',
				xtype : "login-LoginScreen",
				hidden: false
			},{
			    id: 'changeBaseForm',
				xtype : "login-ChangeBaseScreen",
				hidden: true
			}]
		},{
			cls:"spacer",
			html:"&nbsp;",
			flex:1
		},{
            xtype: 'container',
            cls:"footer",
			items: [{
	            cls:"version",
				tpl:"V{version}",
				flex:0
			}]
		}]
	},
	getHeader: function() {
		return this.query(".component[cls~='header']")[0];
	},
	showLoginForm: function () {
		this.query(".login-LoginScreen")[0].show();
		this.query(".login-ChangeBaseScreen")[0].hide();
	},
	showChangeBaseForm: function () {
		this.query(".login-LoginScreen")[0].hide();
		this.query(".login-ChangeBaseScreen")[0].show();
	}
});



