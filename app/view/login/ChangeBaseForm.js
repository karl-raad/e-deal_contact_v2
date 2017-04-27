Ext.define("EdealMobile.view.login.ChangeBaseForm", {
	extend : 'EdealMobile.view.ValidatedPanel',
	xtype : 'login-ChangeBaseScreen',
	config : {
		layout: "vbox",
		items: [{
        	html: Loc.get("login.CHANGE_BASE_INTRO")
		},{
			xtype:"selectfield",
			usePicker: false,
			placeHolder: Loc.get("login.CHANGE_BASE_SELECT_PLACE_HOLDER"),
            autoSelect:false,
            value:null,
            name:"base",
            store: {
            	fields: ["value","text","baseDetail"]
            },
            options: []
		},{
        	html: Loc.get("login.CHANGE_BASE_INTRO2")
		},{
			xtype:"numberfield",
			placeHolder: "<"+Loc.get("login.CHANGE_BASE_ACTIVATION_CODE_PLACE_HOLDER")+">",
			
			name:"code"
		},{
            xtype: 'container',
            cls:"actions",
            items:[{
				xtype:"button",
	        	html: Loc.get("login.CHANGE_BASE_VALIDATION_BUTTON_LABEL"),
	        	name:"validate",
	        	cls:"bigOne"
			}]
		},{
            xtype: 'container',
            cls:"actions remove",
            items:[{
				xtype:"button",
	        	text: Loc.get("login.CHANGE_BASE_VALIDATION_REMOVE_THE_CURRENT_ASSOCIATION_LABEL"),
	        	name:"remove",
	        	cls:"bigOne remove red"
			}]
		},{
        	cls:"explaination",
        	html: Loc.get("login.CHANGE_BASE_VALIDATION_EXPLAINATION1")
		},{
        	cls:"explaination",
        	html: Loc.get("login.CHANGE_BASE_VALIDATION_EXPLAINATION2")
		}]
	},
	updateBaseList:function () {
		var baseList = Settings.get(Settings.BASE_LIST);
		var options = []
		options.push({
			text: "",
			value: "",
			baseDetail:null
		})
		if (baseList) {

			// db name is displayed only if there is 2 entries in already connected api with this same corp name
			var corpNameList = []
			var corpNameListTwice = [];
			for (var i=0; i<baseList.length; i++) {
				var corpName = baseList[i].corpName;
				if (corpNameList.indexOf(corpName)>=0)
					corpNameListTwice.push(corpName);
				corpNameList.push(corpName);
			}
			
			for (var i=0; i<baseList.length; i++) {
				var corpName = baseList[i].corpName;
				var label = corpName
				if (corpNameListTwice.indexOf(corpName)>=0) {
					label = corpName+(baseList[i].databaseName?" / "+baseList[i].databaseName:"");
				}
				options.push({
					text: label,
					value: baseList[i].urlApi,
					baseDetail:baseList[i]
				})
			}
		}
		var selectBaseInput = this.query("[name='base']")[0];
		selectBaseInput.updateOptions(options);
		if (Settings.get(Settings.CURRENT_BASE))
			selectBaseInput.setValue(Settings.get(Settings.CURRENT_BASE).urlApi);
	},
	getSelectedBaseDetail:function () {
		var selectBaseInput = this.query("[name='base']")[0];		
		return selectBaseInput.getRecord().get("baseDetail");
	}
});