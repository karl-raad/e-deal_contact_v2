Ext.define('EdealMobile.model.login.LoginParams', {
    extend: 'Ext.data.Model',
    config: {
    	fields: [
    		{name: 'login',     type: 'string'},
            {name: 'password',      type: 'string'}
    	],validations: [
    	    {type: 'presence',  field: 'login', message:Loc.get("login.LOGIN_REQUIRED")},
    	    {type: 'presence',  field: 'password', message:Loc.get("login.PASSWORD_REQUIRED")}
        ]
    }
})
