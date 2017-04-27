Ext.define('EdealMobile.store.LocalSettings', {
	extend: 'Ext.data.Store',
	requires: ['Ext.data.proxy.LocalStorage'],
	CURRENT_BASE:"CURRENT_BASE",
	API_VERSION:"API_VERSION",
	APPLICATION_OS:"APPLICATION_OS",
	LAST_LOGIN:"LAST_LOGIN",
	LAST_CONNECTED_ID:"LAST_CONNECTED_ID",
	__NP_AUTH_TOKEN__:"__NP_AUTH_TOKEN__",
	AUTO_LOGIN_PIN:"AUTO_LOGIN_PIN",
	BASE_LIST:"BASE_LIST",
	config: {
		model:'EdealMobile.model.LocalSettingsItem',
		proxy: {
            type: 'localstorage'
        }
	},
	get: function (key) {
		var record = this.getAt(this.find("key", key));
		if (record)
			return record.getData().value;
		else
			return null;
	},
	set: function (key, value) {
		var record;
		while (record = this.getAt(this.find("key", key))) {
			this.remove(record)	;
		}
		this.add({key:key, value:value});
	}
})



