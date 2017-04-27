Ext.define('EdealMobile.controller.SearchController', {
	extend: 'EdealMobile.controller.AbstractController',
	config: {
		refs: {
			searchScreen:".search-SearchMainContainer",
			searchTextField:".search-SearchMainContainer .container[cls~='header'] .component[name='searchInput']",
			nbResultComponent:".search-SearchMainContainer #nbSearchResult",
			searchDataView:".search-SearchMainContainer #searchResult",
			distanceSlider:".search-SearchMainContainer .container[cls~='header'] .container[cls~='distance'] .sliderfield"
		},
		control: {
	    	".search-SearchMainContainer": {
	    		activate: "onActivate"
	    	},
	    	".search-SearchMainContainer .container[cls~='header'] #searchHeader button[name='retry']" : {
				tap:"search"
			},
			".search-SearchMainContainer #searchHeader .component[name='searchInput']" : {
				action:"search"
			},
			".search-SearchMainContainer #searchResult": {
				itemtap:"itemTap"
			},
			".search-SearchMainContainer .container[cls~='footer'] .button[name='research']": {
				tap: "switchToNormalResearch"
	    	},
			".search-SearchMainContainer .container[cls~='footer'] .button[name='nearby']": {
				tap: "initNearbyResearch"
	    	},
			".search-SearchMainContainer .container[cls~='footer'] .button[name='favorite']": {
				tap: "switchToFavoriteResearch"
	    	},
			".search-SearchMainContainer .container[cls~='header'] .container[cls~='distance'] .button[name='retry']": {
				tap: "initNearbyResearch"
	    	},
	    	".search-SearchMainContainer .container[cls~='header'] .container[cls~='distance'] .sliderfield": {
	    		drag:"updateDistanceLabel",
	    		change:"startNearbyResearch"
	    	}
		}
	},
	search: function() {
		var searchParams = Ext.create("EdealMobile.model.search.SearchParam", {
			search: this.getSearchTextField().getValue().trim()
		});

		var viewListDescriptor = this.getSearchScreen().getViewDescriptor();
		var params = {
			code: viewListDescriptor.code,
			"$$nb": EdealMobile.app.NB_MAX_RESEARCH_RESULT,
			"defaultSearch":searchParams.getData().search
		};

		this.createSearchConnection(params);
	},
	itemTap: function(dataView, index, target, record) {
		var itemId = dataView.getIds()[index];
		var itemObjectName = dataView.getRelatedObjectName();
		this.redirectTo("detail/"+itemObjectName+"/"+itemId)
	},
	onActivate: function(searchView, eOpts) {
		var objectName = searchView.getObjectName();
		EdealMobile.app.getAppLayout().updateContextButton(Ext.create('Ext.Button', {
			xtype:"button",
			cls: "createButton",
			text: "create",
			hidden: false,
			handler: function() {
				EdealMobile.app.getMainController().redirectTo("create/"+objectName);
			}
		}));
	},
	switchToNormalResearch: function () {
		this.getSearchScreen().addCls("normalResearch");
		this.getSearchScreen().removeCls("nearbyResearch");
		this.getSearchScreen().removeCls("favoriteResearch");
		this.clearResult();
	},
	switchToFavoriteResearch: function () {
		this.getSearchScreen().addCls("favoriteResearch");
		this.getSearchScreen().removeCls("nearbyResearch");
		this.getSearchScreen().removeCls("normalResearch");
		this.clearResult();

		var viewListDescriptor = this.getSearchScreen().getViewDescriptor();
		var params = {
			code: viewListDescriptor.favoriteCode
		}
		// Initiate search
		this.createSearchConnection(params);
	},
	initNearbyResearch: function () {
		this.getSearchScreen().addCls("nearbyResearch");
		this.getSearchScreen().removeCls("normalResearch");
		this.getSearchScreen().removeCls("favoriteResearch");
		this.clearResult();
		this.getSearchScreen().distanceLoadingView();
		var onSuccess = function(position) {
			this.coords = position.coords;
			this.getSearchScreen().distanceSuccessView();
			this.updateDistanceLabel();
			this.startNearbyResearch();
		}
		var onError = function(params) {
			EdealMobile.app.getMainController().alert(null, Loc.get("search.NOT_ABLE_TO_GET_YOUR_POSITION"));
			this.getSearchScreen().distanceErrorView();
		}
		navigator.geolocation.getCurrentPosition(
			Ext.Function.bind(onSuccess, this),
			Ext.Function.bind(onError, this)
		);
	},
	updateDistanceLabel: function () {
		var key = this.getDistanceSlider().getValue();
		var distanceLabel = this.getDistanceSlider().getData()[key].label;
		this.getDistanceSlider().setLabel(distanceLabel);
	},
	startNearbyResearch: function() {
		// Calculate min and max latitude and longitude
		var key = this.getDistanceSlider().getValue();
		var distanceValue = this.getDistanceSlider().getData()[key].value;
		// big approximation for longitude (longitude/meter ratio is different depending of latitude) 
		var deltaLat = 0.009*distanceValue/1000;
		var deltaLon = 0.0135*distanceValue/1000;
		var minLat = this.coords.latitude - deltaLat;
		var maxLat = this.coords.latitude + deltaLat;
		var minLon = this.coords.longitude - deltaLon;
		var maxLon = this.coords.longitude + deltaLon;
		
		// Get list params
		var viewListDescriptor = this.getSearchScreen().getViewDescriptor();
		var params = {
			code: viewListDescriptor.code
		}
		// Add longitude latitude params to research (naming convention)
		var objectPrefix = this.getSearchScreen().getObjectName().substr(0,3);
		params[objectPrefix+"La$From"]= EdealMobile.app.getDataDescriptor().convertNumber(minLat);
		params[objectPrefix+"La$To"]=EdealMobile.app.getDataDescriptor().convertNumber(maxLat);
		params[objectPrefix+"Lo$From"]=EdealMobile.app.getDataDescriptor().convertNumber(minLon);
		params[objectPrefix+"Lo$To"]=EdealMobile.app.getDataDescriptor().convertNumber(maxLon);
		
		// Initiate search
		this.createSearchConnection(params);
	},
	createSearchConnection: function(params) {
		var getListConnection = EdealMobile.utils.ApiUtils.createGetListConnection();
		getListConnection.callAction(params, function() {
			if (getListConnection.getError()) {
				this.getSearchScreen().manageServerError(getListConnection.getError());
				this.getSearchScreen().displayNoResultView();
			} else {
				var getListResult = getListConnection.getData().data;
				var data = getListResult.result;
				var nbResult = data.grid.totalNbOfRecords>0 ? data.grid.totalNbOfRecords : data.grid.internalRows.length;
				
				this.getNbResultComponent().setData({nbResult:nbResult});
				var columnLabels = data.grid.columnTitles;
				if(data.grid.internalRows.length>0) {
					this.getSearchDataView().setColumnLabels(columnLabels);
					this.getSearchDataView().setIds(data.grid.rowsId);
					this.getSearchDataView().setRelatedObjectName(data.relatedObjectName);
					this.getSearchDataView().getStore().setData(data.grid.internalRows);
					this.getSearchScreen().displayDataView();
				}
				else
					this.getSearchScreen().displayNoResultView();
			}
		}, this);
	},
	clearResult: function () {
		this.getNbResultComponent().setData({nbResult:0});
		this.getNbResultComponent().hide();
		this.getSearchTextField().setValue("");
		this.getSearchDataView().setColumnLabels([]);
		this.getSearchDataView().setIds([]);
		this.getSearchDataView().setRelatedObjectName(null);
		this.getSearchDataView().getStore().setData([]);
		this.getSearchTextField().setValue("");
	}
})
