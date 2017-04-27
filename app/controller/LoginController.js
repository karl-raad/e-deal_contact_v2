Ext.define('EdealMobile.controller.LoginController', {
	extend: 'EdealMobile.controller.AbstractController',
	config: {
		refs: {
			loginScreen: "#loginScreen",
			loginScreenHeader: "#loginScreen .component[cls~='header']",
			loginScreenChangeBaseInfo: "#loginScreen .component[cls~='changeBase'] [cls~='info']",
			
			loginForm: "#loginForm",
			versionFooter: "#loginScreen .component[cls~='footer'] .component[cls~='version']",
			changeBaseForm: "#changeBaseForm",
			homeMenuWelcomeMessage: ".home-HomeMenu .component[cls~='welcomeMessage']"
		},
		control: {
			"#appLayout" : {
				activate: 'onActivate'
			},
	    	"#loginForm .field": {
	    		action: "loginFullpassword"
	    	},
	    	"#loginForm .button[name='login']": {
	    		tap: "loginFullpassword"
	    	},
			"#loginScreen .button[name='displayChangeBaseScreen']": {
	    		tap: "goToChangeBaseScreen"
			},
	    	"#changeBaseForm .field": {
	    		action: "registerNewBase"
	    	},
			"#changeBaseForm .button[name='validate']": {
				tap: "registerNewBase"
			},
			"#changeBaseForm .button[name='remove']": {
				tap: "removeCurrentBase"
			}
	    },
	    routes: {
	    	"login":"showLoginForm",
	    	"registerNewBase":"displayChangeBaseScreen"
	    }
	},
	showLoginForm:function () {
		this.getLoginScreen().showLoginForm();
	},
	onActivate: function (appLayout) {
		this.getLoginScreen().getHeader().setData({version:EdealMobile.app.APPLICATION_VERSION});
		
		this.getVersionFooter().setData({version:EdealMobile.app.APPLICATION_VERSION});
		this.resetLoginForm();
	},
	resetLoginForm: function () {
		this.getLoginScreen().showLoginForm();
		this.getLoginForm().setValues({login: Settings.get(Settings.LAST_LOGIN), password: ""});
		if (Settings.get(Settings.CURRENT_BASE)) {
			var data = Settings.get(Settings.CURRENT_BASE);

			// db name is displayed only if there is 2 entries in already connected api with this same corp name
			var baseList = Settings.get(Settings.BASE_LIST);
			var corpNameList = []
			var corpNameListTwice = [];
			if (baseList) {
				for (var i=0; i<baseList.length; i++) {
					var corpName = baseList[i].corpName;
					if (corpNameList.indexOf(corpName)>=0)
						corpNameListTwice.push(corpName);
					corpNameList.push(corpName);
				}
			}
			data.twiceRegistredCorpname = corpNameListTwice.indexOf(corpName)>=0;
			
			this.getLoginScreenChangeBaseInfo().setData(data);
			this.getLoginForm().enable();
		} else {
			this.getLoginScreenChangeBaseInfo().setData({});
			this.getLoginForm().disable();
		}
	},
	loginByPin: function () {
		var connectionData = Ext.create('EdealMobile.model.login.LoginByPinParams', this.getPinForm().getValues());
		connectionError = connectionData.validate();
		if(connectionError.isValid()) {
			var params = {
				login: Settings.get(Settings.LAST_LOGIN),
				pwd: connectionData.getData().pin
			}
			this.callLoginApi(params, this.getPinForm());
		} else {
			this.getPinForm().manageValidationErrors(connectionError);
		}
	},
	loginFullpassword: function () {
		var connectionData = Ext.create('EdealMobile.model.login.LoginParams', this.getLoginForm().getValues());
		connectionError = connectionData.validate();
		if(connectionError.isValid()) {
			var params = {
				login: connectionData.getData().login,
				pwd: connectionData.getData().password
			}
			this.callLoginApi(params, this.getLoginForm());
		} else {
			this.getLoginForm().manageValidationErrors(connectionError);
		}
	},
	autoLoginByPin: function () {
		var params = {
				login: Settings.get(Settings.LAST_LOGIN),
				pwd: Settings.get(Settings.AUTO_LOGIN_PIN)
			};
		this.callLoginApi(params, this.getPinForm());
	},

	
	callLoginApi: function(params, connectionForm) {
		Settings.set(Settings.AUTO_LOGIN_PIN, null);
		Settings.sync();
		var loginConnection = EdealMobile.utils.ApiUtils.createLoginConnection();
		loginConnection.callAction(params, function () {
			if (loginConnection.getError()) {
				connectionForm.manageServerError(loginConnection.getError());
				if (loginConnection.getError().get("code") == ERROR_CODES.BLOCKED_ACCOUNT) {
					Settings.set(Settings.LAST_LOGIN, null);
					Settings.sync();
					this.getLoginScreen().showLoginForm();
				}
			} else {
				var loginResult = loginConnection.getData().data;
				
				connectionForm.query(".passwordfield")[0].reset();
				// use for remenber my username feature on login page
				Settings.set(Settings.LAST_LOGIN, params.login);
				// use by apple watch for list filter
				Settings.set(Settings.LAST_CONNECTED_ID, loginResult.result.connectedActorID);
				// use to access to low security webservice, remember actor but don't require password (apple watch feature)
				Settings.set(Settings.__NP_AUTH_TOKEN__, loginResult.result.__NP_AUTH_TOKEN__);
				Settings.sync();
				
				// Manage login extra data (data-dictionary, labels, references list data and view descriptors)
				
				EdealMobile.app.getDataDescriptor().manageLoginresult(loginResult);

				this.getHomeMenuWelcomeMessage().setData(EdealMobile.app.getDataDescriptor());
				
				//EdealMobile.app.getDataDescriptor().connectedActorToString
				var languageHasChange = EdealMobile.app.setCookieLanguage();
				if (languageHasChange) {
					new edeal.locale.Manager({
						locale: EdealMobile.app.getDataDescriptor().locale.LANGUAGE,
						bundles: [
							"layout",
							"login",
							"search",
							"edit",
							"detail",
							"settings"
						],
						location: "resources/i18n/"
					});
					Ext.Msg.alert(null, Loc.get("layout.LANGUAGE_UPDATE"), function(result) {
						document.location.reload()
		    		});
				} else {
					EdealMobile.app.setIsConnected(true);

					// model are define only if we have an associate view to display it
					for (objectName in EdealMobile.app.getDataDescriptor().viewsDescriptor) {
						EdealMobile.utils.ApiUtils.defineRestRessourceClass(objectName);
					}
					EdealMobile.app.getMainController().afterLogin();
					EdealMobile.utils.IWatchJSInterface.callGetInteractionList();
				}
			}
		}, this);
	},
	goToChangeBaseScreen: function () {
		EdealMobile.app.getMainController().redirectTo("registerNewBase");
	},
	displayChangeBaseScreen: function () {
		var currentBase = Settings.get(Settings.CURRENT_BASE);
		this.getChangeBaseForm().updateBaseList(Settings.get(Settings.BASE_LIST));
		this.getChangeBaseForm().setValues({code:'', base:currentBase?currentBase.urlApi:""})
		this.getLoginScreen().showChangeBaseForm();
	},
	registerNewBase: function () {
		var registerFormData = this.getChangeBaseForm().getValues();
		
		// Select base by Hub code
		if (registerFormData.code) {
			var settingConnection = EdealMobile.utils.ApiUtils.createActivateApplicationConnection();
			var params = {
				code: registerFormData.code,
				action: "read"
			};
			settingConnection.callAction(params, function () {
				if (settingConnection.getError()) {
					this.getChangeBaseForm().manageServerError(settingConnection.getError());
				} else {
					data = settingConnection.getData().data;
					// manage compatibility with old hub version
					if (!data.urlApi) {
						data = {
							urlApi:data.result,
							corpName:"oldVersion",
							databaseName: null
						}
					}
					var urlApi = data.urlApi;
					// Save if nessecary the new url API in base list
					var alreadyRegisteredBaseList = Settings.get(Settings.BASE_LIST);
					if (!alreadyRegisteredBaseList) {
						alreadyRegisteredBaseList = [];
					}
					var isNewUrlAlreadyRegistred = false;
					for (var i=0; i<alreadyRegisteredBaseList.length && !isNewUrlAlreadyRegistred; i++) {
						var alreadyRegisteredBaseUrlApi = alreadyRegisteredBaseList[i].urlApi;
						if (alreadyRegisteredBaseUrlApi == urlApi)
							isNewUrlAlreadyRegistred = true;
					}
					if (!isNewUrlAlreadyRegistred) {
						alreadyRegisteredBaseList.push(data);
						Settings.set(Settings.BASE_LIST, alreadyRegisteredBaseList);
					}
					Settings.set(Settings.CURRENT_BASE, data);
					Settings.sync();
					this.resetLoginForm();
					EdealMobile.app.getMainController().back();
				}
			}, this);
		// Select a previously connected base
		} else if (registerFormData.base){
			var selectedBase = this.getChangeBaseForm().getSelectedBaseDetail();
			Settings.set(Settings.CURRENT_BASE, selectedBase);
			Settings.sync();
			this.resetLoginForm();
			EdealMobile.app.getMainController().back();
		} else {
			EdealMobile.app.getMainController().alert(null, Loc.get("login.PLEASE_SELECT_A_PREVIOUSLY_REGISTRED_BASE_OR_NEW_ASSOCIATION_CODE"));
		}
	},
	removeCurrentBase: function () {
		var currentBase = Settings.get(Settings.CURRENT_BASE);
		if (currentBase) {
			var currentBaseUrl = currentBase.urlApi;
			Settings.set(Settings.CURRENT_BASE, null);
			
			// also remove the url from base list
			var baseList = Settings.get(Settings.BASE_LIST);
			var newBaseList = [];
			for (var i=0; baseList&&i<baseList.length; i++) {
				if ((baseList[i].urlApi!=currentBase.urlApi || baseList[i].databaseName!=currentBase.databaseName || baseList[i].corpName!=currentBase.corpName) || currentBase.corpName==EdealMobile.app.DEMO_CORP_NAME)
					newBaseList.push(baseList[i]);
			}
			Settings.set(Settings.BASE_LIST,newBaseList);

			// Save settings
			Settings.sync();
		}
		
		// Go back to login page
		this.back();
		
		// reset login form view
		this.resetLoginForm();
		
	}
});


