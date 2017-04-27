Ext.define('EdealMobile.controller.HomeController', {
	extend: 'EdealMobile.controller.AbstractController',
	config: {
		refs: {
			appLayout: "#appLayout"
		},
		control: {
			"#homeMenu .button[name='closeOnClickHeader']": {
				tap: "closeMenu"
			},
	    	"#homeMenu .button[name='enterprise']": {
	    		tap: "enterpriseButtonTap"
	    	},
	    	"#homeMenu .button[name='person']": {
	    		tap: "personButtonTap"
	    	},
	    	"#homeMenu .button[name='logout']": {
	    		tap: "logoutButtonTap"
	    	},
	    	"#homeMenu": {
	    		hide: "onCloseWithFingerSlide"
	    	}
	    }
	},
	enterpriseButtonTap:function() {
		EdealMobile.app.getAppLayout().resetNavigation();
		this.redirectTo("search/Enterprise");
	},
	personButtonTap:function() {
		EdealMobile.app.getAppLayout().resetNavigation();
		this.redirectTo("search/Person");
	},
	logoutButtonTap: function () {
		var logoutConnection = EdealMobile.utils.ApiUtils.createLogoutConnection();
		logoutConnection.callAction(null, function () {
			EdealMobile.app.getMainController().showLogin();
			this.getAppLayout().closeMenu(true);
		}, this);
	},
	closeMenu: function() {
		this.getAppLayout().closeMenu();
	},
	onCloseWithFingerSlide: function () {
		this.getAppLayout().menuOpen = false;
		if(this.getAppLayout().noScreenAvailableYet()) {
			this.personButtonTap();
		}
	}
});