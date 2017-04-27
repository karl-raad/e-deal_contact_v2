Ext.define('EdealMobile.utils.Debug', {
	singleton: true,
	requires: [],
    // If user press a very long time, we display a debug windows
	debugLayout: null,
	longWaitBeforeDisplayDebugger: null,
	logDataForSuport:"",
	shouldDisplayDebugger:false,

	createDebugger: function () {
		// add debugger and hide it
		this.debugLayout = Ext.create('EdealMobile.view.DebugView');
		Ext.Viewport.add(this.debugLayout);
		this.debugLayout.hide();
		this.longWaitBeforeDisplayDebugger = null;
		// Create the waiting debugger function sleeping task
		// complex scope here is equivalent to jquery proxy or prototype bind
		var scope = this;
		var createSleepingTaskDisplayDebugger = function () {
			if (this.longWaitBeforeDisplayDebugger == null) {
				this.shouldDisplayDebugger = false;
				this.longWaitBeforeDisplayDebugger = window.setTimeout(function () {
					(function () {
						this.shouldDisplayDebugger = true;
					}).apply(scope, arguments);
				}, 10000);
			}
		}

		// destroy previously defined task
		var cancelSleepingTaskDisplayDebugger = function () {
			window.clearTimeout(this.longWaitBeforeDisplayDebugger);
			if (this.shouldDisplayDebugger) {
				if (this.debugLayout.isHidden()) {
					this.debugLayout.updateDebugInfo();
					//this.debugLayout.show();
				} else {
					this.debugLayout.hide();
				}
			}
			this.longWaitBeforeDisplayDebugger = null;
			this.shouldDisplayDebugger = false;
		}

		// listen very long press
		Ext.Viewport.element.addListener ("touchstart", createSleepingTaskDisplayDebugger, this);
		// cancel sleeping task "display debugger"
		Ext.Viewport.element.addListener ("tap", cancelSleepingTaskDisplayDebugger, this);

		Ext.Viewport.element.addListener ("doubletap", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("drag", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("dragend", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("dragstart", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("pinch", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("pinchend", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("pinchstart", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("rotate", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("rotateend", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("rotatestart", cancelSleepingTaskDisplayDebugger, this);
		Ext.Viewport.element.addListener ("touchmove", cancelSleepingTaskDisplayDebugger, this);

		// Add Error listener to log error
		// complex scope here is equivalent to jquery proxy or prototype bind
		var scope = this;
		window.addEventListener("error", function (e) {
			(function (e) {
				this.logDataForSuport += "# ERROR ####################################\n"+
										"file: "+e.filename+ " line:"+e.lineno+"\n"+
										e.message+"\n\n";
			}).call(scope, e);
		})
	},

	logForSupport: function () {
		console.log(arguments)
		
		for (var i=0; i<arguments.length; i++) {
			console.log(Ext.JSON.encode(arguments[i]));
		}
		
		try {
			var logStr = "**************************************************************\n";

			// display logged object
			for(i=0; i<arguments.length; i++) {
				var obj = arguments[i];
				// remove password for safety purpose
				if (obj.pwd) {
					obj = Ext.clone(obj);
					obj.pwd = "XXXXX";
				}
				var objectDump = Ext.JSON.encode(obj);

				if (objectDump.length > 10000)
					objectDump = objectDump.substr(0, 10000) + "  ...TRUNCATED DATA..."
				logStr += objectDump
				logStr += "\n -----------------------------------------\n";

			}
			// generate a stack trace
			logStr += this.generateStackTrace()+"\n";

			this.logDataForSuport += logStr;
		} catch(e) { /* I don't wan't logger break everythings... */}

	},
	generateStackTrace: function () {
		var stack = "";
		try {
			unknown.unknown.unknown()
		}
		catch(e) {
			if (e.stack) {
				lines = e.stack.split("\n");
				if (lines.length>2) {
					// remove generated error
					lines.shift();
					// remove this function call
					lines.shift();
				}

				if (lines.length>8) {
					lines.splice(8-lines.length)
					lines.push("...")
				}
				stack = lines.join("\n")+"\n";
			}
		}
		return stack;
	}
});