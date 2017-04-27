Ext.define("EdealMobile.view.read.ReadMainContainer", {
	extend : 'Ext.Container',
	xtype:"read-ReadMainContainer",
	requires: ["Ext.Carousel"],
	config : {
		cls: "readContainer",
		title:"",
		layout: "vbox",
		items: []
	},

	// init on creation
	viewDescriptor:null,
	objectName:null,
	objectId:null,
	getObjectName: function () {
		return this.getInitialConfig().objectName;
	},
	getObjectId: function () {
		return this.getInitialConfig().objectId;
	},

	// Manage errors functions
	manageServerError: function(serverError) {
		EdealMobile.app.getMainController().alert(null, Loc.get("detail.AN_ERROR_OCCURS_WHILE_TRYING_TO_GET_YOUR_RESULT"));
	},
	createCaroussel: function() {
		var items = [];
		for (var i=0; i<this.getInitialConfig().viewDescriptor.screens.length; i++) {
			var header = this.createHeader();
			var screen = Ext.create("Ext.Container", {
				height: "100%",
				cls:"screen",
				scrollable: {
					direction:"vertical",
					directionLock: true
				},
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
		this.removeAll();
		this.add(this.createHeader());
		if (items.length > 1) {
			this.add(Ext.create("Ext.Carousel", {
				items: items,
				flex:1
			}));
		} else {
			this.add(items);
		}
	},
	createScreenDetail: function(screen) {
		var items = [];
		var title = Ext.create("Ext.Component", {
			baseCls: "title",
			html: "<div class='leftArrow'><div class='rightArrow'>"+screen.title+"</div></div>"
		});

		for (var i=0; i<screen.widgets.length; i++) {
			var widget = screen.widgets[i];
			var component = EdealMobile.utils.WidgetFactory.create(widget, this.getRecord());
			if (component) {
				items.push(component);
				if(i==0)
					component.addCls("first");
				if(i==screen.widgets.length-1)
					component.addCls("last");
			}
		}
		return Ext.create("Ext.Container", {
			cls:"detail",
			items: [title,{
				xtype:"container",
				cls:"detailContent",
				items:items
			}]
		});
	},
	createHeader: function() {
		var items = [];
		for (i=0; i<this.getInitialConfig().viewDescriptor.headerContent.length; i++) {
			var widget = this.getInitialConfig().viewDescriptor.headerContent[i];
			var component = EdealMobile.utils.WidgetFactory.create(widget, this.getRecord());
			if (component)
				items.push(component);
		}
		return Ext.create("Ext.Container", {
			cls:"mainHeader",
			items: {
				xtype: "container",
				cls: "patternBackground",
				items: items
			}
		});
	}
});