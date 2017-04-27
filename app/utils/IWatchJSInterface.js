Ext.define('EdealMobile.utils.IWatchJSInterface', {
	singleton: true,
	// called by EdealMobile.utils.IWatchJSInterface.getLastConnectedID()
	getLastConnectedID: function () {
		return Settings.get(Settings.LAST_CONNECTED_ID);
	},
	formatDate: function (dd,mm,yyyy) {
		if (dd < 10)
			dd = '0' + dd;
		if (mm < 10)
			mm = '0' + mm;
		return dd + '/' + mm + '/' + yyyy;
	},
	getToday: function (bool) {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; // January is 0!
		var yyyy = today.getFullYear();
		if (!bool)
			return EdealMobile.utils.IWatchJSInterface.formatDate(dd, mm, yyyy);
		if (bool) {
			if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
				if (((dd + 6) / 30) > 1) {
					mm++;
					dd = (dd + 6) % 30;
					return EdealMobile.utils.IWatchJSInterface.formatDate(dd, mm, yyyy);
				}
				return EdealMobile.utils.IWatchJSInterface.formatDate(dd + 6, mm, yyyy);
			}
			if (mm == 1 || mm == 3 || mm == 5 || mm == 7
					|| mm == 8 || mm == 10) {
				if (((dd + 6) / 31) > 1) {
					mm++;
					dd = (dd + 6) % 31;
					return EdealMobile.utils.IWatchJSInterface.formatDate(dd, mm, yyyy);
				}
				return EdealMobile.utils.IWatchJSInterface.formatDate(dd + 6, mm, yyyy);
			}
			if (mm == 2 && yyyy % 4 == 0) {
				if (((dd + 6) / 29) > 1) {
					mm++;
					dd = (dd + 6) % 29;
					return EdealMobile.utils.IWatchJSInterface.formatDate(dd, mm, yyyy);
				}
				return EdealMobile.utils.IWatchJSInterface.formatDate(dd + 6, mm, yyyy);
			}
			if (mm == 2 && yyyy % 4 != 0) {
				if (((dd + 6) / 28) > 1) {
					mm++;
					dd = (dd + 6) % 28;
					return EdealMobile.utils.IWatchJSInterface.formatDate(dd, mm, yyyy);
				}
				return EdealMobile.utils.IWatchJSInterface.formatDate(dd + 6, mm, yyyy);
			}
			if (mm == 12) {
				if (((dd + 6) / 31) > 1) {
					yyyy++;
					mm = 1;
					dd = (dd + 6) % 31;
					return EdealMobile.utils.IWatchJSInterface.formatDate(dd, mm, yyyy);
				}
				return EdealMobile.utils.IWatchJSInterface.formatDate(dd + 6, mm, yyyy);
			}
		}
	},
	callGetInteractionList: function () {
			var getInteractionsConnection = EdealMobile.utils.ApiUtils.createGetInteractionsListConnection();
			getInteractionsConnection.callAction({
				IntDate$From:Ext.Date.format(Ext.Date.parse(EdealMobile.utils.IWatchJSInterface.getToday(0),"d/m/Y"),EdealMobile.app.getDataDescriptor().locale.DATEFORMAT),
				IntDate$To:Ext.Date.format(Ext.Date.parse(EdealMobile.utils.IWatchJSInterface.getToday(1),"d/m/Y"),EdealMobile.app.getDataDescriptor().locale.DATEFORMAT),
				IntActID:Settings.get(Settings.LAST_CONNECTED_ID)
				}, function () {
					if (getInteractionsConnection.getError() != null) {
						if(getInteractionsConnection.getError().isAuthentificationError()) {
							window.location = "invalidSession://"+JSON.stringify(getInteractionsConnection.getError());
						}
						if (getInteractionsConnection.getError().is404Error()) {
							window.location = "error404://"+JSON.stringify(getInteractionsConnection.getError());
						}
					} 
					else {
						for(var i=0;i<getInteractionsConnection.getData().data.result.grid.internalRows.length;i++) {
							getInteractionsConnection.getData().data.result.grid.internalRows[i][0].content = Ext.Date.format(Ext.Date.parse(getInteractionsConnection.getData().data.result.grid.internalRows[i][0].content,EdealMobile.utils.DataDescriptor.getLocale().DATEFORMAT),"d/m/Y");
						}
						window.location = "interactions://"+ encodeURI(JSON.stringify({result:getInteractionsConnection.getData().data.result.grid.internalRows, labels:{EVENTS:Loc.get("iwatch.EVENTS"),TYPE:Loc.get("iwatch.TYPE"),CREATOR:Loc.get("iwatch.CREATOR"),NOTES:Loc.get("iwatch.NOTES"),CORRESPONDENTS:Loc.get("iwatch.CORRESPONDENTS"),PLACE:Loc.get("iwatch.PLACE"),CORRESPONDENT:Loc.get("iwatch.CORRESPONDENT"),SYNC:Loc.get("iwatch.SYNC")},locale:EdealMobile.app.getDataDescriptor().locale.LOCALE}));
					}
			}, this, true);
	},
	callGetKPI: function () {
		var getKPIConnection = EdealMobile.utils.ApiUtils.createGetKPIConnection();
		getKPIConnection.callAction({
		}, function () {
			window.location = "kpi://"+ encodeURI(JSON.stringify(getKPIConnection.getData().data.result));
			console.log(getKPIConnection.getError());
			console.log(getKPIConnection.getData().data.result);
		});	
	}
});