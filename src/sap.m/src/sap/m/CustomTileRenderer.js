/*!
 * ${copyright}
 */
sap.ui.define(['jquery.sap.global', './TileRenderer'],
	function(jQuery, TileRenderer) {
	"use strict";

/**
	 * @class CustomTile renderer. 
	 * @static
	 */
	var CustomTileRenderer = sap.ui.core.Renderer.extend(TileRenderer);
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager}
	 *                oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control}
	 *                oControl an object representation of the control that should be rendered
	 */
	 CustomTileRenderer.render = function(rm, oControl) {
		rm.write("<div tabindex=\"0\"");
		rm.writeControlData(oControl);
		rm.addClass("sapMCustomTile");
		rm.writeClasses();
		if (oControl._invisible) {
			rm.addStyle("visibility", "hidden");
			rm.writeStyles();
		}
		rm.write(">");
		rm.write("<div id=\"" + oControl.getId() + "-remove\" class=\"sapMTCRemove\"></div>");
		rm.write("<div class=\"sapMCustomTileContent\">");
		this._renderContent(rm,oControl);
		rm.write("</div></div>");
	};
	
	CustomTileRenderer._renderContent = function (rm, oTile) {
		rm.renderControl(oTile.getContent());
	};
	

	return CustomTileRenderer;

}, /* bExport= */ true);
