Ext.define("EdealMobile.view.layout.MainContainer", {
	id: "MainContainer",
	requires: ["Ext.navigation.View"],
	extend : 'Ext.Container',
	config : {
		layout: 'card',
		id:"appLayout",
		items:[{
			id:"loginScreen",
			xtype: "login-LoginMainContainer"
		}, {
			id:"applicationScreen",
			layout: 'vbox',
			items: [{
				xtype:'toolbar',
				id:"headerToolBar",
				items:[{
					xtype:"button",
					id:"backButton",
					text: "back",
					name: "back",
					disabled:true
				},{
					xtype:"button",
					id: "titleComponent",
					text: Loc.get('layout.TITLE_HOME'),
					name: "menu",
					flex:1
				},{
					xtype:"button",
					id: "emptyButton",
					cls: "emptyButton contextAction",
					text: "donothings",
					name: "context",
					hidden: false
				}]
			},{
				xtype: "container",
				layout: 'fit',
				flex:1,
				id:"menuOrNavigationScreen",
				items: [] 
			}
			]
		}, {
			xtype:"fobField-selectionList"
		}]
	},
	loginScreen: null,
	applicationScreen: null,
	menuScreen: null,
	navigationScreen: null,
	menuOrNavigationScreen: null,
	titleComponent: null,
	initialize: function () {
		this.loginScreen = this.query("#loginScreen")[0];
		
		this.applicationScreen = this.query("#applicationScreen")[0];

		this.titlecomponent = this.query("#headerToolBar #titleComponent")[0];
		this.menuScreen = this.query("#menuScreen")[0];
		this.menuOrNavigationScreen = this.query("#menuOrNavigationScreen")[0];

		this.headerToolBar = this.query("#headerToolBar")[0];
		this.contextButton = this.query("#contextButton")[0];
		this.backButton = this.query("#headerToolBar .button[name='back']")[0];
		
		this.previousButton = this.query("#headerToolBar .button[name='context']")[0]
		
		this.resetNavigation();
	},
	showLoader: function () {
		this.setMasked({
			xtype: 'loadmask'
		});
	},
	hideLoader: function () {
		this.setMasked(false);
	},

	// Manage screen navigation
	showLogin:function() {
		this.closeMenu();
		this.setActiveItem(this.loginScreen);
	},
	isLoginScreenDisplayed: function() {
		return this.getActiveItem() == this.loginScreen;
	},
	showHome:function() {
		this.setActiveItem(this.applicationScreen);
		this.openMenu(true);
	},
	goTo: function(component) {
		this.setActiveItem(this.applicationScreen);
		this.navigationScreen.push(component);
		this.closeMenu();
		this.backButton.enable();
	},
	goBack: function(component) {
		// No more items in navigation screen, we empty the navigation and display the menu as if it was a home page
		if (!this.navigationScreen.getPreviousItem()) {
			if (!this.noScreenAvailableYet())
				this.navigationScreen.getActiveItem().destroy();
			this.openMenu();
			this.updateContextButton(null);
			this.titlecomponent.setHtml(Loc.get('layout.TITLE_HOME'));
			this.backButton.disable()
		} else if (this.menuOpen) {
			this.closeMenu();
		}
		if(!this.noScreenAvailableYet())
			this.navigationScreen.pop();
	},
	resetNavigation: function () {
		if (this.navigationScreen) {
			this.menuOrNavigationScreen.remove(this.navigationScreen, true);
		}
		this.navigationScreen = Ext.create("Ext.navigation.View", {
			cls: "mainContainer",
			width: "100%",
			hidden: true,
			navigationBar: false,
			items: []
		})
		this.menuOrNavigationScreen.insert(0,this.navigationScreen);
		this.navigationScreen.show({type:'fade'});

		this.navigationScreen.addListener("pop", this.updateToolbar, this);
		this.navigationScreen.addListener("push", this.updateToolbar, this);
	},
	getPreviousScreen: function() {
		var previousScreen = null;
		var screens = this.navigationScreen.getItems();
		if (screens!=null && screens.getCount()>2) {
			previousScreen = screens.get(screens.getCount()-2);
		}
		return previousScreen;
	},
	getCurrentScreen: function() {
		var currentScreen = null;
		var screens = this.navigationScreen.getItems();
		if (screens!=null) {
			currentScreen = screens.get(screens.getCount()-1);
		}
		return currentScreen;
	},
	// Manage menu
	menuOpen: false,
	openCloseMenu: function () {
		if (!this.menuOpen) {
			this.openMenu();
		} else {
			this.closeMenu();
		}
	},
	openMenu: function (skipAnimation) {
		if (skipAnimation)
			Ext.Viewport.showMenu('left');
			//this.menuScreen.show();
		else
			Ext.Viewport.showMenu('left');
			//this.menuScreen.show({type:'slide', autoClear: false, direction:'right'});
		this.menuOpen = true;
	},
	closeMenu: function (showLoginScreen) {
		if(!this.noScreenAvailableYet() || showLoginScreen) {
			Ext.Viewport.hideMenu('left');
			//this.menuScreen.hide({type:'slide', autoClear: false, direction:'left'});
			this.menuOpen = false;
		}
	},
	noScreenAvailableYet:function() {
		return typeof this.navigationScreen.getActiveItem() != "object";
	},
	// Manage header toolbar
	updateToolbar: function () {
		if (this.navigationScreen.getActiveItem()) {
			this.titlecomponent.setHtml(this.navigationScreen.getActiveItem().getTitle());
		}
	},

	updateContextButton: function(aButton) {
		if (this.previousButton) {
			this.previousButton.destroy();
		}
		if(!aButton) {
			aButton = Ext.create('Ext.Button', {
				xtype:"button",
				id: "emptyButton",
				text: "donothings",
				name: "context",
				hidden: false
			});
		}
			
		this.previousButton = aButton;
		if (aButton) {
			aButton.addCls("contextAction");
			this.headerToolBar.add(aButton);
		} else {
		}
	},

	manageStartupAppServerError: function (serverError) {
		var errorInfo = serverError.getData();
		var extraData = serverError.getExtraData();
		if (errorInfo.code == ERROR_CODES.CLIENT_IS_OBSOLETE || errorInfo.code == ERROR_CODES.NOT_OPTIMAL_CLIENT_VERSION) {
			EdealMobile.app.getMainController().alert(null, "<p>"+extraData.message+"</p><p><a href='"+extraData.client_download_link+"'>"+Loc.get("layout.UPDATE_FROM_STORE")+"</a></p>");
		}
	}
});
