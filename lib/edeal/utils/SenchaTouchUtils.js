SenchaTouchUtils = {
	prepareDomNodeForSenchaPanel: function (domNode, baseView, baseViewOption) {
		if (baseView)
			new baseView (baseViewOption);
		return domNode;
	}
};
