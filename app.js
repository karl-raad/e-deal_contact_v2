Ext.Loader.setPath('edeal', 'lib/edeal');
/*
This file is generated and updated by Sencha Cmd. You can edit this file as
needed for your application, but these edits will have to be merged by
Sencha Cmd when it performs code generation tasks such as generating new
models, controllers or views and when running "sencha app upgrade".

Ideally changes to this file would be limited and most work would be done
in other places (such as Controllers). If Sencha Cmd cannot merge your
changes and its generated code, it will produce a "merge conflict" that you
will need to resolve manually.
*/
	
application = Ext.application({
	name: 'EdealMobile',
	requires: ['EdealMobile.utils.ApiUtils',
	           'EdealMobile.utils.WidgetFactory',
	           'EdealMobile.utils.DataDescriptor',
	           'EdealMobile.utils.Debug',
	           'EdealMobile.utils.IWatchJSInterface'
	           ],
	
	controllers: ['MainController',
                  "LoginController",
                  "HomeController",
                  "SearchController",
                  "ReadController",
                  "EditController", 
                  "WidgetController",
                  "SettingsController"
                  ],
    views: ["layout.MainContainer",
            "layout.ListDataView",
            "login.LoginMainContainer",
            "login.LoginForm",
            "login.ChangeBaseForm",
            "home.HomeMenu",
            "search.SearchMainContainer",
            "read.ReadMainContainer",
            "edit.EditMainContainer",
            "edit.widget.AbstractEditField",
            "ValidatedPanel",
            "DebugView"],
    
    models: ["apiresult.ApiResult",
             "apiresult.ErrorApiResult",
             "apiresult.RestApiResult",
             "login.LoginParams",
             "login.FirstSettingParams",
             "search.SearchParam",
             "LocalSettingsItem"],
    stores: ["ListStore",
             "LocalSettings"],
	/*
	icon: {
	    '57': 'resources/icons/Icon.png',
	    '72': 'resources/icons/Icon~ipad.png',
	    '114': 'resources/icons/Icon@2x.png',
	    '144': 'resources/icons/Icon~ipad@2x.png'
	},
	
	isIconPrecomposed: true,
	
	startupImage: {
	    '320x460': 'resources/startup/320x460.jpg',
	    '640x920': 'resources/startup/640x920.png',
	    '768x1004': 'resources/startup/768x1004.png',
	    '748x1024': 'resources/startup/748x1024.png',
	    '1536x2008': 'resources/startup/1536x2008.png',
	    '1496x2048': 'resources/startup/1496x2048.png'
	},
	*/
	APPLICATION_VERSION:"2.0",
    APPLICATION_OS: (typeof device !="undefined"?device.platform:"Android"),
    //HUB_SETTING_URL: "http://localhost:8080/edealapi/emulatehub/return_url.jsp",
    //HUB_SETTING_URL: "http://localhost:8083/hub-webservice/service/mobile/activate",
    //HUB_SETTING_URL: "http://192.168.1.73:8083/hub-webservice/service/mobile/activate",
    HUB_SETTING_URL: "http://e-deal.biz/service/mobile/activate",
    //HUB_SETTING_URL: "http://93.93.44.226/hubwebservices/service/mobile/activate",
    //HUB_SETTING_URL: "http://192.168.1.59/hubwebservices/mobile/activate",
    NB_MAX_RESEARCH_RESULT:200,
    DEMO_CORP_NAME: "Démonstration E-DEAL",
    isNotBackAction: true,
    launch: function() {
    	this.APPLICATION_OS = (typeof device !="undefined"?device.platform:"Android");
    	this.fixOverflowChangedIssue();
        // IOS7 Keyboard overlapping input hack
        if (window.device && parseFloat(window.device.version) == 7.0) {
        	Ext.Viewport.setHeight(Ext.Viewport.getWindowHeight());
        }

    	// Init Storage
    	Settings = new EdealMobile.store.LocalSettings();
    	Settings.load(function() {
	    	// first start!
    		if(!Settings.get(Settings.BASE_LIST) || Settings.get(Settings.BASE_LIST).length==0) {
    			Settings.set(Settings.BASE_LIST, [{
    				corpName: EdealMobile.app.DEMO_CORP_NAME,
					databaseName: "DemoPublic",
					urlApi: "http://demo.e-deal.com/demo_api/api/"
    			}])
    			Settings.sync();
    		}
    		
    		Settings.set(Settings.CURRENT_BASE,{
				corpName: "test",
				databaseName: "test",
				urlApi: "http://127.0.0.1:8080/edealapi-mobile/api/"
				//urlApi: "http://192.168.0.75:8080/edealapi-mobile/api/"
			})
    		Settings.sync();
    		
    		// Init display
    		this.appLayout = Ext.create('EdealMobile.view.layout.MainContainer');
	        Ext.Viewport.add(this.appLayout);
	        EdealMobile.utils.Debug.createDebugger();
	        
	        Ext.MessageBox.YES.text = Loc.get("layout.YES");
	        Ext.MessageBox.NO.text = Loc.get("layout.NO");
	        Ext.MessageBox.YESNO[0].text = Loc.get("layout.NO");
	        Ext.MessageBox.YESNO[1].text = Loc.get("layout.YES");
	        Ext.MessageBox.YESNOCANCEL[0].text = Loc.get("layout.CANCEL");
	        Ext.MessageBox.YESNOCANCEL[1].text = Loc.get("layout.NO");
	        Ext.MessageBox.YESNOCANCEL[2].text = Loc.get("layout.YES");
	        
	        Ext.Viewport.setMenu(Ext.create('EdealMobile.view.home.HomeMenu'), {
	            side: 'left',
	            reveal: false
	        });
    	}, this);
    },

	/**
	 * Fix a Sencha Touch Bug that was introduced with Google Chrome v43+
	 *
	 * See following Forum Thread for more Information:
	 * https://www.sencha.com/forum/showthread.php?300288-Scrolling-Issues-in-latest-Google-Chrome
	 */
    fixOverflowChangedIssue: function()
    {
        if (Ext.browser.is.WebKit) {
            console.info(this.$className + ': Fix a Sencha Touch Bug (TOUCH-5716 / Scrolling Issues in Google Chrome v43+)');

            Ext.override(Ext.util.SizeMonitor, {
                constructor: function (config) {
                    var namespace = Ext.util.sizemonitor;
                    return new namespace.Scroll(config);
                }
            });

            Ext.override(Ext.util.PaintMonitor, {
                constructor: function (config) {
                    return new Ext.util.paintmonitor.CssAnimation(config);
                }
            });
        }
    },
    setCookieLanguage: function() {
    	this.deleteCookieLanguage();
    	var currentLanguage = edeal.locale.currentLanguage;
    	var newLanguage = null;
    	try {
			newLanguage = this.getDataDescriptor().locale.LANGUAGE;
    	} catch (e) {}
    	document.cookie = "language=" + newLanguage;
    	if (currentLanguage!=newLanguage) {
    		return true;
    	}    	
    	return false;
    },
    deleteCookieLanguage: function() {
    	var nom = "language";
        var expDate = new Date();
        expDate.setTime(expDate.getTime() + (-1 * 24 * 3600 * 1000))
        document.cookie = nom + "=;expires=" + expDate.toGMTString()
    },
    getAppLayout: function () {
    	return this.appLayout;
    },
    getMainController: function () {
    	return this.getControllerInstances()["EdealMobile.controller.MainController"];
    },
    getDataDescriptor: function () {
    	return EdealMobile.utils.DataDescriptor;
    },
    isConnected: false,
    setIsConnected: function (isConnected) {
    	this.isConnected = isConnected;
    },
    getIsConnected: function () {
    	return this.isConnected;
    },
    call: function(tel) {
    	EdealMobile.utils.Debug.logForSupport("call -> ",tel);
    	document.location = "tel:"+tel;
    },
    sms: function(tel) {
    	tel = tel.replace(/ /g, "");
    	EdealMobile.utils.Debug.logForSupport("send SMS -> ",tel);
    	document.location = "sms:"+tel;
    },
    email:function(mail) {
    	EdealMobile.utils.Debug.logForSupport("email -> ",mail);
    	document.location = "mailto:"+mail+"?BCC="+EdealMobile.utils.DataDescriptor.getServerConfiguration()["Interaction.InMailAddress"];
    },
    openUrl: function (url) {
    	EdealMobile.utils.Debug.logForSupport("openUrl -> ",url);
    	window.open(url, '_system');
    },
    download: function (id) {
    	EdealMobile.utils.Debug.logForSupport("download -> ",id);
        url = Settings.get(Settings.CURRENT_BASE).urlApi+"../download?id="+id;
        EdealMobile.app.openUrl(url);
    },
    openMap:function(PerAd1,PerAd2,PerAd3,PerZip,PerCity,PerCtrID) {
    	var q="";
    	if (PerAd1.length||PerAd2.length||PerAd3.length) {
    		q = PerAd1+" "+PerAd2+" "+PerAd3;
    	}
    	if (PerZip.length||PerCity.length) {
    		q += (q.length?",":"")+PerZip+" "+PerCity;
    	}
    	if (PerCtrID.length) {
    		q += (q.length?",":"")+PerCtrID;
    	}
    	var url;
    	if (EdealMobile.app.APPLICATION_OS == ANDROID) {
    		url = "geo:0,0?q="+encodeURIComponent(q);
    	} else {
    		url = "http://maps.apple.com/maps/?q="+encodeURIComponent(q);
    	}
    	EdealMobile.utils.Debug.logForSupport("display map ->", q, url)
    	EdealMobile.app.openUrl(url);
    },

	onUpdated: function() {
	    Ext.Msg.confirm(
	        "Application Update",
	        "This application has just successfully been updated to the latest version. Reload now?",
	        function(buttonId) {
	            if (buttonId === 'yes') {
	                window.location.reload();
	            }
	        }
	    );
	}
});


ANDROID = "Android";
IOS="iOS";
