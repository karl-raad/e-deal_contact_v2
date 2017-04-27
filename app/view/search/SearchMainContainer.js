Ext.define("EdealMobile.view.search.SearchMainContainer", {
	extend : 'EdealMobile.view.ValidatedPanel',
	xtype:"search-SearchMainContainer",
	id:"SearchMainContainer",
	requires:['Ext.field.Text'],
	config : {
		layout:"vbox",
		scrollable:false,
		title:"search",
		align:"left",
		cls:"normalResearch",
		items:[{
			layout:"vbox",
			flex: 1,
			scrollable:false,
			items: [{
				xtype:"container",
				layout:"vbox",
				cls:"header",
				id:"searchHeader",
				items: [{
					cls: "normalSearchInput",
					xtype:"container",
					layout:"hbox",
					items: [{
			        	xtype: "button",
						text: Loc.get("search.SEARCH"),
						cls:"searchButton"
					},{
			        	xtype: "textfield",
						placeHolder: "<"+Loc.get("search.WRITE_YOUR_SEARCH")+">",
						name:"searchInput"
					}]
				},{
					cls: "distance",
					xtype:"container",
					items:[{
						cls:"waiting",
						html:Loc.get("search.WAITING_FOR_POSITION")
					},{
						cls:"error",
						xtype:"container",
						layout:"hbox",
						hidden:"true",
						items:[{
							xtype: 'button',
				            text: Loc.get("search.RETRY_GEOLOC"),
				            name: "retry",
				            cls: "retry smallBlue"
						}]
					},{
						cls:"slidercontainer",
						hidden:"true",
						xtype:"container",
						layout:"hbox"
					}]
				}]
			},{
				id:"nbSearchResult",
				tpl:Loc.get("search.NB_RESULTS"),
				hidden: true,
				// Using listener should has been better, but this is the only to update tpl property before updating tpl render
				setData: function(data) {
					this.setHidden(false);
					if (data.nbResult>1)
						this.setTpl(Loc.get("search.NB_RESULTS"));
					else
						this.setTpl(Loc.get("search.NB_RESULT_1_OR_0"));
					Ext.Component.prototype.setData.call(this, data);
				}
			},{
				xtype:"panel",
				layout:"fit",
				flex:"1",
				hidden:true,
				id:"searchResultContainer",
				items: [{
					id:"searchResult",
					xtype:"layout-ListDataView"
				}]
			},{
				flex:"1",
				id:"searchNoResult",
				hidden:true,
				html:Loc.get("search.NO_RESULT_AVAILABLE")
			}]
		},{
			cls:"footer",
			layout:"hbox",
			items:[{
				xtype: 'button',
	            text: Loc.get('search.RESEARCH'),
	            name: "research",
	            cls: "research",
	            iconCls: "research",
	            iconAlign:"top"
			},{
				xtype: 'button',
	            text: Loc.get('search.NEARBY'),
	            name: "nearby",
	            cls: "nearby",
	            iconCls: "nearby",
	            iconAlign:"top"
			},{
				xtype: 'button',
	            text: Loc.get('search.FAVORITE'),
	            name: "favorite",
	            cls: "favorite",
	            iconCls: "favorite",
	            iconAlign:"top"
			}]
		}]
	},
	noResultView: null,
	dataView: null,
	initialize: function () {
		this.dataViewContainer = this.query("#searchResultContainer")[0];
		this.noResultView = this.query("#searchNoResult")[0];

		this.scrollablePart = this.query(".container[id='searchResult']")[0];
		this.footer = this.query(".container[cls~='footer']")[0];

		this.selectDistanceContainer = this.query(".component[cls~='distance']")[0];
		this.loadingView = this.query(".component[cls~='distance'] .component[cls~='waiting']")[0];
		this.successView = this.query(".component[cls~='distance'] .component[cls~='slidercontainer']")[0];
		this.errorView = this.query(".component[cls~='distance'] .component[cls~='error']")[0];

		if(!this.getInitialConfig().viewDescriptor.favoriteCode)
			this.query(".container[cls~='footer'] .button[name='favorite']")[0];
		
		this.addListener("painted", function () {
			this.query(".textfield[name='searchInput']")[0].element.query("input")[0].focus();
		}, this);
	},
	distanceLoadingView: function() {
		this.loadingView.show();
		this.successView.hide();
		this.errorView.hide();
	},
	distanceSuccessView: function() {
		this.loadingView.hide();
		this.successView.show();
		this.errorView.hide();
		this.successView.setItems([{
			data:eval(Loc.get("search.DISTANCE_ENUM")),
			xtype: 'sliderfield',
            label: 'Percentage',
            value: 0,
            minValue: 0,
            maxValue: (eval(Loc.get("search.DISTANCE_ENUM")).length -1),
            labelWidth: ""
		}])
	},
	distanceErrorView: function() {
		this.loadingView.hide();
		this.successView.hide();
		this.errorView.show();
	},
	// init on creation
	getViewDescriptor: function () {
		return this.config.viewDescriptor;
	},
	getObjectName: function () {
		return this.config.objectName;
	},
	displayNoResultView:function() {
		this.noResultView.setHidden(false);
		this.dataViewContainer.setHidden(true);
	},
	displayDataView:function() {
		this.noResultView.setHidden(true);
		this.dataViewContainer.setHidden(false);
	}
});