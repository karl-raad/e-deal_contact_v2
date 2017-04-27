Ext.define("EdealMobile.view.edit.EditMainContainer", {
	extend : 'Ext.Container',
	xtype:"edit-EditMainContainer",
	requires: ["Ext.Carousel", "Ext.form.Panel"],
	config : {
		cls: "editContainer",
		title:"",
		layout: "fit",
		items: []
	},

	// init on creation
	viewDescriptor:null,
	objectName:null,
	objectId:null,
	prefillFob: null,
	
	getObjectName: function () {
		return this.getInitialConfig().objectName;
	},
	getObjectId: function () {
		return this.getInitialConfig().objectId;
	},
	getPrefillFob: function () {
		return this.getInitialConfig().prefillFob;
	},
	// Manage errors functions
	manageServerError: function(serverError) {
		EdealMobile.app.getMainController().alert(null, Loc.get("detail.AN_ERROR_OCCURS_WHILE_TRYING_TO_GET_YOUR_RESULT"));
	},
	createCaroussel: function() {
		var items = [];
		for (var i=0; i<this.getInitialConfig().viewDescriptor.screens.length; i++) {
			var screen = Ext.create("Ext.Container", {
				height: "100%",
				cls:"screen",
				items: [
					this.createScreenDetail(this.getInitialConfig().viewDescriptor.screens[i])
				]
			});
			items.push(screen);
			if (i>0)
				screen.addCls("hasPreviousScreen");
			if (i<this.getInitialConfig().viewDescriptor.screens.length-1)
				screen.addCls("hasNextScreen");
		}
		
		if (items.length > 1) {
			this.add(Ext.create("Ext.Carousel", {
				items: items
			}));
		} else {
			this.add(items);
		}
	},
	createScreenDetail: function(screen) {
		var items = [];
		var title = Ext.create("Ext.Component", {
			cls: "title",
			html: "<div class='leftArrow'><div class='rightArrow'>"+screen.title+"</div></div>"
		});

		for (var i=0; i<screen.widgets.length; i++) {
			var widget = screen.widgets[i];

			var component = EdealMobile.utils.WidgetFactory.create(widget, this.getRecord());
			if (component)
				items.push(component);
			if(i==0)
				component.addCls("first");
			if(i==screen.widgets.length-1)
				component.addCls("last");
		}

		var form = Ext.create("EdealMobile.view.ValidatedPanel", {
			id:"editForm",
	    	name:"editForm",
			flex:1,
	    	scrollable: {
				directionLock: true
			},
			items: items
		});
		this.editForm = form;

		return Ext.create("Ext.Panel", {
			layout: "vbox",
			cls:"detail",
			height: "100%",
			items: [
		        title,
		        form
		    ]
		});
	},
	validate: function() {
		var errors = [];
		var widgetController = EdealMobile.app.getControllerInstances()["EdealMobile.controller.WidgetController"];
		var items = this.editForm.getItems().items;
		
		for (var i=0; i < items.length; i++) {
			var fieldInputErrors = widgetController.validateOneField(items[i]);
			errors = Ext.Array.union(errors, fieldInputErrors);
		}
		return errors;
	}
});
