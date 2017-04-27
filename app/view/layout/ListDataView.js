Ext.define("EdealMobile.view.layout.ListDataView", {
	extend : 'Ext.DataView',
	xtype:"layout-ListDataView",
	config : {
		cls:"layout-ListDataView",
		store: {xclass:'EdealMobile.store.ListStore'}
	},

	listeners:{
        itemtap: function(nestedList, index, target, record, e, eOpts){
        	//target.addCls("tapped");
        }
	},
	itemTemplateNoLabel:'<div class="buttonContainer"><div class="item">'+
							'<div class="title"><span class="value">{col1}</span></div>'+
							'<tpl if="col2.trim()"><div class="info info1"><span class="value">{col2}</span></div></tpl>'+
							'<tpl if="col3.trim()"><div class="info info2"><span class="value">{col3}</span></div></tpl>'+
						'</div></div>',
	setColumnLabels:function(labels) {
		var newTemplate = this.itemTemplateNoLabel.replace("#col1#",labels[0]);
		newTemplate = newTemplate.replace("#col2#",labels[1]);
		newTemplate = newTemplate.replace("#col3#",labels[2]);
		this.setItemTpl(newTemplate);
	},
	ids: null,
	relatedObjectName: null,
	setIds:function(ids) {
		this.ids = ids;
	},
	setRelatedObjectName:function(relatedObjectName) {
		this.relatedObjectName = relatedObjectName;
	},
	getIds:function() {
		return this.ids;
	},
	getRelatedObjectName:function() {
		return this.relatedObjectName;
	},
	setFilterBy: function (filterBy) {
		this.filterBy = filterBy;
	},
	getFilterBy: function () {
		return this.filterBy;
	}
});