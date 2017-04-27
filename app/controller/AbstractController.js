Ext.define('EdealMobile.controller.AbstractController', {
	extend: 'Ext.app.Controller',

	/***************************
	 * Navigation action
	 */
	// use this function to add a screen in history
	redirectTo: function(path) {
		EdealMobile.app.isNotBackAction=true;
		if(EdealMobile.app.APPLICATION_OS == ANDROID) {
			EdealMobile.app.redirectTo(path);
		} else {
			document.location.hash=path;
		}
	},
	// use this function to go back to previous screen in history
	back: function () {
		history.back();
	},
	execute: function(action, skipFilters) {
		var currentRoute = window.location.hash.substring(1);
		console.log("Current route "+currentRoute);
		console.log("Previous route "+EdealMobile.app.previousRoute);
		console.log("----------------------");
		// Manage close popup with back button
		// User press back after open popup -> don't take care of current route and close popup
		if (EdealMobile.app.previousRoute == "openPopup" && !EdealMobile.app.isNotBackAction) {
			Ext.Msg.hide();
			EdealMobile.app.isNotBackAction=false;
			EdealMobile.app.previousRoute=currentRoute;
		} else {
			if (currentRoute == "openPopup" && !EdealMobile.app.isNotBackAction) {
				// User press back and arrive on an openPopup route -> we don't won't to reopen the popup, instead we go directly to previous route
				history.back()
			} else {
				// Normal behavior
				action.getArgs().unshift(EdealMobile.app.previousRoute);
				action.getArgs().unshift(EdealMobile.app.isNotBackAction);
				Ext.app.Controller.prototype.execute.apply(this, arguments);
				EdealMobile.app.isNotBackAction=false;
				EdealMobile.app.previousRoute=currentRoute;
			}
		}
    }
});