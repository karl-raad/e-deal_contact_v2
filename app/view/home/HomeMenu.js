Ext.define("EdealMobile.view.home.HomeMenu", {
	extend : 'Ext.Menu',
    id: 'homeMenu',
	xtype : 'home-HomeMenu',
	config : {
		modal: false,
		flex:1,
		items: [{
			xtype:"container",
	    	scrollable: {
				directionLock: true
			},
			height:"100%",
			items:[{
				xtype: 'button',
				cls: "closeOnClickHeader",
	            name: "closeOnClickHeader",
				html:""
			},{
				cls: "welcomeMessage",
				tpl:Loc.get('layout.MENU_WELCOM_MESSAGE')
			},{
				xtype: 'button',
	            text: Loc.get('layout.LOGOUT'),
	            name: "logout",
	            cls: "logout"
			},{
				xtype: 'button',
	            text: Loc.get('layout.TITLE_Person'),
	            name: "person",
	            cls: "person",
	            iconCls: "person",
	            iconAlign:"top"
			},{
				xtype: 'button',
	            text: Loc.get('layout.TITLE_Enterprise'),
	            name: "enterprise",
	            cls: "enterprise",
	            iconCls: "enterprise",
	            iconAlign:"top"
			}]
		}]
	}
})