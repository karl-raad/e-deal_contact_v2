Ext.define('EdealMobile.model.login.FirstSettingParams', {
    extend: 'Ext.data.Model',
    config: {
    	fields: [
            {name: 'installationPin',      type: 'string'}
    	],validations: [
    	    {type: 'presence',  field: 'installationPin', message:Loc.get("login.PIN_REQUIRED_ERROR")}
        ]
    }
})
