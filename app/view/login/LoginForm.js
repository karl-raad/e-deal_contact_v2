Ext.define("EdealMobile.view.login.LoginForm", {
    requires: ['Ext.MessageBox',
               'Ext.form.FieldSet',
               'Ext.field.Password'],
	extend : 'EdealMobile.view.ValidatedPanel',
	xtype : 'login-LoginScreen',
	config : {
		layout: "vbox",
		items: [{
			cls: "changeBaseIntro",
			html: Loc.get("login.CHANGE_BASE")
		},{
			layout: "hbox",
			cls: "changeBase",
			align: 'center',
			items: [{
				html:"",
				flex:1
			},{
				xtype: 'button',
				cls: "info",
				name: "displayChangeBaseScreen",
				tpl:"<tpl if=\"corpName\">{corpName}<tpl if=\"databaseName && twiceRegistredCorpname\"> / {databaseName}</tpl></tpl>"
			},{
				html:"",
				flex:1
			}]
		},{
            xtype: 'fieldset',
            cls:"form",
			items: [{
				xtype:"textfield",
				placeHolder: "<"+Loc.get("login.USERNAME_INPUT_DEFAULT")+">",
				autoCapitalize: "off",
				autoComplete: "off",
				autoCorrect: "off",
				name: "login"
			},{
				xtype:"passwordfield",
				placeHolder: "<"+Loc.get("login.PASSWORD_INPUT_DEFAULT")+">",
				name: "password"
			}]
		},{
            xtype: 'container',
            cls:"actions",
			items: [{
				xtype: 'button',
	            text: Loc.get("login.LOGIN_BUTTON_LABEL"),
	            name: "login",
	            cls:"bigOne"
			}]
        }]
	},
	manageServerError: function (error, action, scope) {
		this.query(".passwordfield")[0].reset();
		EdealMobile.view.ValidatedPanel.prototype.manageServerError.call(this, error, action, scope);
	},
	enable: function() {
		EdealMobile.view.ValidatedPanel.prototype.enable.apply(this, arguments);
		this.query("[cls~='actions'] .button")[0].enable();
		this.removeCls("disabled");
	},
	disable: function () {
		this.query("[cls~='actions'] .button")[0].disable();
		EdealMobile.view.ValidatedPanel.prototype.disable.apply(this, arguments);
		this.addCls("disabled");
	}
});





