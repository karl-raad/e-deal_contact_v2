Ext.define('EdealMobile.controller.SettingsController', {
	extend: 'EdealMobile.controller.AbstractController',
	config: {
		control: {
			".settings-settingsContainer .button[name='reset']": {
	    		tap: "resetButtonTap"
	    	}
	    }
	},
	resetButtonTap: function () {
		EdealMobile.app.getMainController().confirm(null, Loc.get('settings.RESET_DATA_CONFIRM'), function (choice) {
			if (choice=="yes") {
				Settings.removeAll();
				Settings.sync();
				document.location.reload()
			}
		}, this);
	}
});