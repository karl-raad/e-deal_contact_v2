convert = function(v) {
	return v.content
}

Ext.define('EdealMobile.store.ListStore', {
	extend: 'Ext.data.Store',
	config: {
		fields: [{
				name:"col1", mapping:0, convert: convert
			},{
				name:"col2", mapping:1, convert: convert
			},{
				name:"col3", mapping:2, convert: convert
			}]
	}
})
