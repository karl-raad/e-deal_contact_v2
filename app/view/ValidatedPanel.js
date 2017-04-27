Ext.define("EdealMobile.view.ValidatedPanel", {
    requires: ['Ext.MessageBox'],
	extend : 'Ext.form.Panel',
	xtype : 'validatedPanel',
	config: {
		standardSubmit: true,
		submitOnAction: true,
		scrollable: null
	},
	removeSubmitAction: function () {
		// fix old android version form submit
		this.element.dom.action ='javascript:void(0)';
	},
	manageValidationErrors: function(errors) {
		for (var i=0; i<this.getFieldsArray().length; i++) {
			field = this.getFieldsArray()[i];
			field.removeCls("error");
		}
		var errorMessage = new Array();
		var alreadyManageError = new Array();
		errors.each(function(error){
			// display only one type of error per type (for example I don't wand to display "missing email" and "not valid email format" at same time
			if(alreadyManageError.indexOf(error.getField())<0) {
				this.getFields()[error.getField()].addCls("error");
				errorMessage.push("<li>"+error.getMessage()+"</li>");
			}
			alreadyManageError.push(error.getField());
		}, this);

		EdealMobile.app.getMainController().alert(null, "<ul>"+errorMessage.join("")+"</ul>");
	},
	manageServerError: function(error, action, scope) {
		var popup;
		if (error.get("type") == EdealMobile.model.apiresult.Errors.NO_RESPONSE_FROM_SERVER.type)
			popup = EdealMobile.app.getMainController().alert(null, Loc.get("login.NOT_ABLE_TO_LOGIN_TRY_AGAIN_LATER"), action, scope);
		else if (error.get("type") == EdealMobile.model.apiresult.Errors.UNMANAGED_API_EXCEPTION.type) {
			popup = EdealMobile.app.getMainController().alert(null, Loc.get("layout.UNMANAGED_API_EXCEPTION"), action, scope);
		} else
			popup = EdealMobile.app.getMainController().alert(null, Loc.get("login."+error.get("code")), action, scope);
		return popup;
	}
});
