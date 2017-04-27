Ext.define('EdealMobile.utils.DataDescriptor', {
	singleton: true,
	dataDictionary: null,
    labels: null,
    mapRefDetailByRefID: null,
    mapRefIDsByTableID: null,
    viewsDescriptor: null,
    locale: null,
    manageLoginresult: function (loginResult)  {
    	this.setDataDictionnary(loginResult.dictionnary);
    	this.setLabels(loginResult.labels);
    	this.setReferences(loginResult.references.mapReferenceDetailByReferenceID,
									loginResult.references.mapReferenceIDListByTableID);
    	this.setViewDescriptors(loginResult.views.list);
    	this.setLocale(loginResult.locale);
    	this.setServerConfiguration(loginResult.config);
    	this.connectedActorToString = loginResult.result.connectedActorToString;
    	//this.setServerConfiguration
    },
    setLocale: function (locale) {
    	locale.DATEFORMAT = this.convertDateFormat(locale.DATEFORMAT);
    	this.locale = locale;
    	
		Ext.Date.dayNames = [Loc.get("edit.SUNDAY"),
		                       Loc.get("edit.MONDAY"), 
		                       Loc.get("edit.TUESDAY"),
		                       Loc.get("edit.WEDNESDAY"),
		                       Loc.get("edit.THRUSDAY"),
		                       Loc.get("edit.FRIDAY"),
		                       Loc.get("edit.SATURDAY")];
		Ext.Date.monthNames = [Loc.get("edit.JANUARY"),
		                       Loc.get("edit.FEBRUARY"), 
		                       Loc.get("edit.MARCH"),
		                       Loc.get("edit.APRIL"),
		                       Loc.get("edit.MAY"),
		                       Loc.get("edit.JUNE"),
		                       Loc.get("edit.JULY"),
		                       Loc.get("edit.AUGUST"),
		                       Loc.get("edit.SEPTEMBER"),
		                       Loc.get("edit.OCTOBER"),
		                       Loc.get("edit.NOVEMBER"),
		                       Loc.get("edit.DECEMBER")];
    },
    convertDateFormat: function(dateformat) {
    	if (!dateformat) {
    		return "d/m/Y";
    	}
    	return dateformat.toUpperCase().replace("DD", "d").replace("MM", "m").replace("YYYY", "Y").replace("YYY", "Y").replace("YY", "Y");
    },
    convertNumber: function(number) {
    	var returnedResult = new String(number);
    	if (this.locale.LANGUAGE=="fr") {
    		returnedResult = returnedResult.replace(".", ",");
    	}
    	return returnedResult;
    },
    getLocale: function () {
    	return this.locale;
    },
    setDataDictionnary: function (dataDictionary) {
    	this.dataDictionary = dataDictionary;
    },
    getObjectFieldList: function (objectName) {
    	return this.dataDictionary.objects[objectName].fields;
    },
	getObjectPrefix: function(objectName) {
		return this.dataDictionary.objects[objectName].fields[0].substr(0,3);
	},
	getObjectFieldIDName: function(objectName) {
		return this.getObjectPrefix(objectName)+"ID";
	},
    getFieldInfo: function (fieldName) {
    	var info = this.dataDictionary.fields[fieldName];
    	// API return only type ref value ID, let's get a string instead
    	if (info && !info.type) {
    		info.type = this.getReferenceValue(info.fltID)
    	}
    	// API return only label code, lets get the label value on first usage
    	if (info && !info.label) {
    		info.label = this.getLabel(info.displayLabel)
    	}
    	return info;
    },
    setLabels: function (labels) {
    	this.labels = labels;
    },
    getLabel: function (labelKey) {
    	return this.labels[labelKey];
    },
    setReferences: function (mapRefDetailByRefID, mapRefIDsByTableID) {
    	this.mapRefDetailByRefID = mapRefDetailByRefID;
    	this.mapRefIDsByTableID = mapRefIDsByTableID;
    },
    getReferenceValueInfo: function (referenceID) {
    	return this.mapRefDetailByRefID[referenceID];
    },
    getReferenceValue: function (referenceID, colName) {
    	if (typeof colName == "undefined")
    		colName = "Te1"
    	if(this.mapRefDetailByRefID[referenceID])
    		return this.mapRefDetailByRefID[referenceID].values[colName];
    	else
    		return null;
    },
    isReferenceValueEnabled: function (referenceID) {
    	if(this.mapRefDetailByRefID[referenceID])
    		return this.mapRefDetailByRefID[referenceID].enabled;
    	return false;
    },
    getReferenceTableRefenceList: function (tableID) {
    	return this.mapRefIDsByTableID[tableID];
    },
    setViewDescriptors: function(viewsDescriptor) {
    	this.viewsDescriptor = viewsDescriptor;
    },
    getListViewDescriptor: function(viewsDescriptorName) {
    	if(!this.viewsDescriptor[viewsDescriptorName])
    		return null;
    	else
    		return this.viewsDescriptor[viewsDescriptorName].listView;
    },
    getReadViewDescriptor: function(viewsDescriptorName) {
    	if(!this.viewsDescriptor[viewsDescriptorName])
    		return null;
    	else
    		return this.viewsDescriptor[viewsDescriptorName].readView;
    },
    getEditViewDescriptor: function(viewsDescriptorName) {
    	if(!this.viewsDescriptor[viewsDescriptorName])
    		return null;
    	else
    		return this.viewsDescriptor[viewsDescriptorName].editView;
    },
    getCreateViewDescriptor: function(viewsDescriptorName) {
    	if(!this.viewsDescriptor[viewsDescriptorName])
    		return null;
    	else
    		return this.viewsDescriptor[viewsDescriptorName].createView;
    },
    setServerConfiguration: function(configObj) {
    	this.configObj = configObj; 
    },
    getServerConfiguration: function() {
    	return this.configObj;
    }
    
});