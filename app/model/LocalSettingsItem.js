Ext.define('EdealMobile.model.LocalSettingsItem', {
	extend: 'Ext.data.Model',
	requires: ['Ext.data.identifier.Uuid'],
	config: {
		identifier: 'uuid',
		fields: ["key","value"]
	}
})