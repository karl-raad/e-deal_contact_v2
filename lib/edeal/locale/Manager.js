if (typeof edeal =="undefined")
	edeal = {};
if (typeof edeal.locale =="undefined")
	edeal.locale = {};

edeal.locale.Manager = function (config) {
	edeal.locale.currentLanguage = config.locale;
	this.locale = config.locale;
	this.bundles = config.bundles;
	this.onReady = config.onReady;
	this.ajaxQueries = [];
	for (var i =0; i<this.bundles.length; i++) {
		var bundle = this.bundles[i];
		var loadedPath = config.location+bundle+"_"+this.locale+".js";
		this.createAjax(loadedPath, bundle);
	}
	this.loadNext();
}
edeal.locale.Manager.prototype = {
	createAjax: function (path, moduleName) {
		var scope = this;
		
		this.ajaxQueries.push(function () {

			var xmlhttp=new XMLHttpRequest();
			xmlhttp.onreadystatechange=function() {
				if (xmlhttp.readyState==4) {
					if (xmlhttp.status==200 || xmlhttp.status==0)
						scope.onOneBundleLoadedSuccess.call(scope, moduleName, eval("("+xmlhttp.responseText+")"))
					else
						scope.onOneBundleLoadedFailed.call(scope, moduleName, eval("("+xmlhttp.responseText+")"));
				}
			}
			xmlhttp.open("GET",path,false);
			xmlhttp.send();
		});
    },
    loadNext: function () {
    	if(this.ajaxQueries.length>0) {
    		var callConnection = this.ajaxQueries.shift();
    		callConnection();
    	}
    	else {
    		edeal.locale.Locales.isReady = true;
    	}
    },
    onOneBundleLoadedSuccess: function (moduleName, data) {
    	edeal.locale.Locales.addBundles(moduleName, data);
    	this.loadNext();
    },
    onOneBundleLoadedFailed: function ( conn, response, options) {
    	this.loadNext();
    }
}





edeal.locale.Locales = {
	isReady:false,
	get:function(key){
		try {
			if (typeof eval("this."+key) != "undefined")
				return eval("this."+key);
			else
				return key+" NOT TRANSLATED";
		}
		catch (e) {
			return key+" NOT TRANSLATED";
		}
	},
	addBundles: function (moduleName, obj) {
		if(typeof this[moduleName] == "undefined")
			this[moduleName] = {};
		for (key in obj)
			this[moduleName][key] = obj[key];

		/*
		if (typeof eval("this."+moduleName) == "undefined")
			eval("this."+moduleName+"={}");
		eval ("Ext.Object.merge(this."+moduleName+", obj)");
		*/
	}
}
Loc = edeal.locale.Locales;



function getCookie(nom) {
	//var nom = "language";
	var deb = document.cookie.indexOf(nom + "=")
	if (deb >= 0) {
		deb += nom.length + 1;
		fin = document.cookie.indexOf(";",deb);
		if (fin < 0) fin = document.cookie.length;
		return unescape(document.cookie.substring(deb,fin));
	}
	return "";
}

var languageToLoad = getCookie("language")?getCookie("language"):"fr";
//locale init
new edeal.locale.Manager({
	locale: languageToLoad,
	bundles: [
		"layout",
		"login",
		"search",
		"edit",
		"detail",
		"settings",
		"iwatch"
	],
	location: "resources/i18n/"
});