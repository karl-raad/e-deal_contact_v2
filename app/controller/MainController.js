Ext.define('EdealMobile.controller.MainController', {
	extend: 'EdealMobile.controller.AbstractController',
	config: {
		id:"MainController",
		refs: {
			appLayout: "#appLayout"
		},
		before: {
			showHome:"checkAuthentification",
			showSettings: "checkAuthentification",
			showSearch:"checkAuthentification",
			showDetail:"checkAuthentification",
			showEdit:"checkAuthentification",
			addTolist:"checkAuthentification"
		},
	    control: {
	    	"#MainContainer": {
	    		activate: "onActivate"
	    	},
	    	"#headerToolBar .button[name='menu']": {
	    		tap: "menuTap"
	    	},
	    	"#headerToolBar .button[name='back']": {
	    		tap: "back"
	    	},
	    	"#appLayout": {
	    		activate:"checkStartupRequirement"
	    	},
	    	".validatedPanel": {
	    		// use to fix old android reload app when click on "GO" or "SEARCH" button
	    		initialize:"validatedPannelRemoveSubmitAction"
	    	}
	    },
	    routes: {
	        '': 'showHome',
	        'search/:objectName': 'showSearch',
	        'settings': 'showSettings',
	        'detail/:objectName/:id': 'showDetail',
	        'edit/:objectName/:id': 'showEdit',
		    'create/:objectName': 'showEdit',
		    'addToList/:objectName/:autoFillFobName/:autoFillFobValue/:autoFillFobDisplay': 'addTolist',
		    'openPopup':'openPopup'
	    }
	},
	validatedPannelRemoveSubmitAction: function (validatedPanel) {
		// use to fix old android reload app when click on "GO" or "SEARCH" button
		// we can't used initialize function to avoid overide while inheritance
		validatedPanel.removeSubmitAction();
	},
	checkStartupRequirement: function () {
		if (Settings.get(Settings.AUTO_LOGIN_PIN)) {
			EdealMobile.app.getController("EdealMobile.controller.LoginController").autoLoginByPin();
		} else {
			// no serverUrl is defined, it's useless to check mobile version
			if (!Settings.get(Settings.CURRENT_BASE))
				return ;
			
			/*
	    	var checkMobileVersionsConnection = EdealMobile.utils.ApiUtils.createCheckMobileVersionsConnection();
			checkMobileVersionsConnection.callAction({}, function () {
				Settings.set(Settings.API_VERSION, checkMobileVersionsConnection.getData().apiVersion);
	    		Settings.sync();
				checkError = checkMobileVersionsConnection.getError();
				if (checkError!=null) {
					this.getAppLayout().manageStartupAppServerError(checkError);
				}
	    	}, this);
	    	*/
		}
	},
	checkAuthentification: function (action) {		
		// If user is connected or if the user is already in the login screen view, we continue current action
		if(EdealMobile.app.getIsConnected()) {
			action.resume();
		}
		// If user is not connected, we redirect him to the login screen
		else {
			this.actionAfterLogin = action;
			this.showLogin();
		}
	},
	afterLogin: function() {
		if (!this.actionAfterLogin)
			this.redirectTo("");
		else {
			this.actionAfterLogin.getArgs().shift();
			this.actionAfterLogin.getArgs().shift();
			this.actionAfterLogin.getArgs().unshift(EdealMobile.app.previousRoute);
			this.actionAfterLogin.getArgs().unshift(true);
			this.actionAfterLogin.resume();
			EdealMobile.app.isNotBackAction=false;
			EdealMobile.app.previousRoute=window.location.hash.substring(1);
		}
	},
	/***************************
	 * Screen creation and display menu action
	 */
	menuTap: function () {
		this.getAppLayout().openCloseMenu();
	},
	showLogin:function(serverError) {
		EdealMobile.app.setIsConnected(false);
		EdealMobile.app.getControllerInstances()["EdealMobile.controller.LoginController"].resetLoginForm();
		this.getAppLayout().showLogin();
	},
	showHome: function(isNotBackAction, previousRoute) {
		if(isNotBackAction) {
			this.getAppLayout().showHome();
		} else {
			this.getAppLayout().goBack();
		}
	},
	showSearch: function (isNotBackAction, previousRoute, objectName) {
		if(isNotBackAction) {
			var view = Ext.create("EdealMobile.view.search.SearchMainContainer", {
				viewDescriptor: EdealMobile.app.getDataDescriptor().getListViewDescriptor(objectName),
				objectName: objectName,
				title: Loc.get("layout.TITLE_"+objectName)
			});
			this.getAppLayout().goTo(view);
		}
		else
			this.getAppLayout().goBack();
	},
	showDetail: function (isNotBackAction, previousRoute, objectName, id) {
		if(isNotBackAction){
			var view = new EdealMobile.view.read.ReadMainContainer({
				viewDescriptor: EdealMobile.app.getDataDescriptor().getReadViewDescriptor(objectName),
				objectName: objectName,
				objectId: id,
				title: Loc.get("layout.TITLE_"+objectName)
			});
			view.addCls(objectName);
			this.getAppLayout().goTo(view);
		}
		else
			this.getAppLayout().goBack();
	},
	showEdit: function (isNotBackAction, previousRoute, objectName, id) {
		if(isNotBackAction){
			var viewDescriptor;
			if (id)
				viewDescriptor = EdealMobile.app.getDataDescriptor().getEditViewDescriptor(objectName)
			else
				viewDescriptor = EdealMobile.app.getDataDescriptor().getCreateViewDescriptor(objectName)

			var view = new EdealMobile.view.edit.EditMainContainer({
				viewDescriptor: viewDescriptor,
				objectName: objectName,
				objectId: id,
				title: Loc.get("layout.TITLE_"+objectName)
			});
			view.addCls(objectName);
			this.getAppLayout().goTo(view);
		}
		else {
			if (previousRoute.match("widget/showFobSearch/.*")) {
				var fobFieldSelectionList = Ext.ComponentQuery.query('#fobSelectionPopup')[0];
				fobFieldSelectionList.hide()
			}
			else {
				this.getAppLayout().goBack();
			}
		}
	},
	addTolist: function (isNotBackAction, previousRoute, objectName, autoFillFobName, autoFillFobValue, autoFillFobDisplay) {
		if(isNotBackAction){
			var viewDescriptor = EdealMobile.app.getDataDescriptor().getCreateViewDescriptor(objectName)
			
			var view = new EdealMobile.view.edit.EditMainContainer({
				viewDescriptor: viewDescriptor,
				objectName: objectName,
				objectId: null,
				prefillFob: {
					name: autoFillFobName, 
					value: autoFillFobValue, 
					display: autoFillFobDisplay
				},
				title: Loc.get("layout.TITLE_"+objectName)
			});
			view.addCls(objectName);
			this.getAppLayout().goTo(view);
		}
		else {
			if (previousRoute.match("widget/showFobSearch/.*")) {
				var fobFieldSelectionList = Ext.ComponentQuery.query('#fobSelectionPopup')[0];
				fobFieldSelectionList.hide()
			}
			else {
				this.getAppLayout().goBack();
			}
		}
	},
    alert: function (title, message, fn, scope) {
    	this.redirectTo("openPopup");
    	fn = fn ? fn : Ext.emptyFn;
    	scope = scope ? scope : this;
    	fnBackHistory = function() {
    		fn.apply(scope, arguments);
    		history.back();
    	}
    	Ext.Msg.alert.call(Ext.Msg, title, message, fnBackHistory, scope);
    },
    confirm: function (title, message, fn, scope) {
    	this.redirectTo("openPopup");
    	fn = fn ? fn : Ext.emptyFn;
    	scope = scope ? scope : this;
    	fnBackHistory = function(action) {
    		fn.apply(scope, arguments);
    		if(action!="yes")
    			history.back();
    	}
    	Ext.Msg.confirm.call(Ext.Msg, title, message, fnBackHistory, scope);
    },
	openPopup: function () {
		// Manage refresh with #openPopup anchor in URL
		if(!EdealMobile.app.getAppLayout().navigationScreen.getActiveItem()&&!this.getAppLayout().isLoginScreenDisplayed)
			this.getAppLayout().showHome();
	},
	onActivate: function() {
		EdealMobile.app.getAppLayout().updateContextButton();
	}
});
