/*!
 * ${copyright}
 */

// Provides control sap.m.SelectList.
sap.ui.define(['jquery.sap.global', './SelectListRenderer', './library', 'sap/ui/core/Control', 'sap/ui/core/delegate/ItemNavigation'],
	function(jQuery, SelectListRenderer, library, Control, ItemNavigation) {
		"use strict";

		/**
		 * Constructor for a new SelectList.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given 
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * This control displays a list of items to allow the user to select an item.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version ${version}
		 *
		 * @constructor
		 * @public
		 * @since 1.26.0
		 * @name sap.m.SelectList
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var SelectList = Control.extend("sap.m.SelectList", /** @lends sap.m.SelectList.prototype */ { metadata : {

			library : "sap.m",
			properties : {

				/**
				 * Determines whether the user can change the selection.
				 */
				enabled : {type : "boolean", group : "Behavior", defaultValue : true},

				/**
				 * Determines whether this control is visible when its parent is visible.
				 */
				visible : {type : "boolean", group : "Appearance", defaultValue : true},

				/**
				 * Defines the width of the control. This value can be provided in all CSS units.
				 */
				width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : "auto"},

				/**
				 * Defines the maximum width of the control. This value can be provided in all CSS units.
				 */
				maxWidth : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : "100%"},

				/**
				 * Key of the selected item. If the key has no corresponding aggregated item, no changes will apply. If duplicate keys exist, the first item matching the key is used.
				 */
				selectedKey : {type : "string", group : "Data", defaultValue : ""},

				/**
				 * Id of the selected item. If the id has no corresponding aggregated item, no changes will apply.
				 */
				selectedItemId : {type : "string", group : "Misc", defaultValue : ""}
			},
			defaultAggregation : "items",
			aggregations : {

				/**
				 * Aggregation of items to be displayed.
				 */
				items : {type : "sap.ui.core.Item", multiple : true, singularName : "item", bindable : "bindable"}
			},
			associations : {

				/**
				 * Sets or retrieves the selected item from the aggregation named items.
				 */
				selectedItem : {type : "sap.ui.core.Item", multiple : false}
			},
			events : {

				/**
				 * Occurs when the user changes the selected item.
				 */
				selectionChange : {
					parameters : {

						/**
						 * The selected item.
						 */
						selectedItem : {type : "sap.ui.core.Item"}
					}
				}
			}
		}});

		/**
		 * Retrieves the item with the given key from the aggregation named items.
		 * If duplicate keys exist, the first item matching the key is returned.
		 *
		 * @name sap.m.SelectList#getItemByKey
		 * @function
		 * @param {string} sKey
		 *         An item key that identifies the item to retrieve.
		 * @type sap.ui.core.Item
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */

		/**
		 * Retrieves the first item from the aggregation named items.
		 *
		 * @name sap.m.SelectList#getFirstItem
		 * @function
		 * @type sap.ui.core.Item
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */

		/**
		 * Retrieves the last item from the aggregation named items.
		 *
		 * @name sap.m.SelectList#getLastItem
		 * @function
		 * @type sap.ui.core.Item
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */

		/**
		 * Retrieves the item from the aggregation named items at the given 0-based index.
		 *
		 * @name sap.m.SelectList#getItemAt
		 * @function
		 * @param {int} iIndex
		 *         Index of the item to return.
		 * @type sap.ui.core.Item
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */

		/**
		 * Retrieves the enabled items from the aggregation named items.
		 *
		 * @name sap.m.SelectList#getEnabledItems
		 * @function
		 * @type sap.ui.core.Item[]
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */

		/**
		 * Clear the selection.
		 *
		 * @name sap.m.SelectList#clearSelection
		 * @function
		 * @type sap.m.SelectList
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */

		/* =========================================================== */
		/* Private methods and properties                              */
		/* =========================================================== */

		/* ----------------------------------------------------------- */
		/* Private methods                                             */
		/* ----------------------------------------------------------- */

		/**
		 * Sets the selected item by its index.
		 *
		 * @param {int} iIndex
		 * @private
		 * @name sap.m.SelectList#_setSelectedIndex
		 * @function
		 */
		SelectList.prototype._setSelectedIndex = function(iIndex, _aItems /* only for internal usage */) {
			var oItem;
			_aItems = _aItems || this.getItems();

			// constrain the new index
			iIndex = (iIndex > _aItems.length - 1) ? _aItems.length - 1 : Math.max(0, iIndex);
			oItem = _aItems[iIndex];

			if (oItem) {

				this.setSelection(oItem);
			}
		};

		/**
		 * Called, whenever the binding of the aggregation items is changed.
		 * This method deletes all items in this aggregation and recreates them
		 * according to the data model.
		 *
		 * @private
		 * @name sap.m.SelectList#updateItems
		 * @function
		 */
		SelectList.prototype.updateItems = function(sReason) {
			this._bDataAvailable = false;
			this.updateAggregation("items");
			this._bDataAvailable = true;
		};

		/**
		 * Called, when the items aggregation needs to be refreshed.
		 * This method does not make any change on the aggregation, but just calls the
		 * getContexts() method to trigger fetching of new data.
		 *
		 * note: This method has been overwritten to prevent .updateItems()
		 * from being called when the bindings are refreshed.
		 * @see sap.ui.base.ManagedObject#bindAggregation
		 *
		 * @private
		 * @name sap.m.SelectList#refreshItems
		 * @function
		 */
		SelectList.prototype.refreshItems = function() {
			this.refreshAggregation("items");
		};

		/**
		 * Activates an item on the SelectList.
		 *
		 * @param {sap.ui.core.Item} oItem The item to be activated.
		 * @private
		 * @name sap.m.SelectList#_activateItem
		 * @function
		 */
		SelectList.prototype._activateItem = function(oItem) {

			if (oItem instanceof sap.ui.core.Item && (this.getSelectedItem() !== oItem)) {

				this.setSelection(oItem);
				this.fireSelectionChange({
					selectedItem: this.getSelectedItem()
				});
			}
		};

		/**
		 * Retrieves the enabled items DOM references.
		 *
		 * @param {object} [oDomRef] The selectList DOM reference.
		 * @returns {array} The enabled items DOM references.
		 * @private
		 * @name sap.m.SelectList#_queryEnabledItemsDomRefs
		 * @function
		 */
		SelectList.prototype._queryEnabledItemsDomRefs = function(oDomRef) {
			var CSS_CLASS = "." + SelectListRenderer.CSS_CLASS + "Item";
			oDomRef = oDomRef || this.getDomRef();

			return oDomRef ? Array.prototype.slice.call(oDomRef.querySelectorAll(CSS_CLASS + ":not(" + CSS_CLASS + "Disabled)")) : [];
		};

		/* =========================================================== */
		/* Lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Required adaptations before rendering.
		 *
		 * @private
		 * @name sap.m.SelectList#onBeforeRendering
		 * @function
		 */
		SelectList.prototype.onBeforeRendering = function() {
			this.synchronizeSelection();
		};

		/**
		 * Required adaptations after rendering.
		 *
		 * @private
		 */
		SelectList.prototype.onAfterRendering = function() {
			var oDomRef = this.getDomRef();

			// initialize the item navigation and add apply it to the control (only once)
			if (!this._oItemNavigation) {
				this._oItemNavigation = new ItemNavigation(null, null, !this.getEnabled() /* not in tab chain */);
				this.addDelegate(this._oItemNavigation);
			}

			// set the root dom node that surrounds the items
			this._oItemNavigation.setRootDomRef(oDomRef);

			// set the array of DOM elements representing the items
			this._oItemNavigation.setItemDomRefs(this._queryEnabledItemsDomRefs(oDomRef));

			// turn of the cycling
			this._oItemNavigation.setCycling(false);

			// set the selected index
			this._oItemNavigation.setSelectedIndex(this.indexOfItem(this.getSelectedItem()));

			// set the page size
			this._oItemNavigation.setPageSize(10);
		};

		/**
		 * Cleans up before destruction.
		 *
		 * @private
		 */
		SelectList.prototype.exit = function() {

			if (this._oItemNavigation) {
				this.removeDelegate(this._oItemNavigation);
				this._oItemNavigation.destroy();
				this._oItemNavigation = null;
			}
		};

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */

		/**
		 * Handle the touch start event on the Select.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 * @name sap.m.SelectList#ontouchstart
		 * @function
		 */
		SelectList.prototype.ontouchstart = function(oEvent) {

			// only process single touches (only the first active touch point)
			if (sap.m.touch.countContained(oEvent.touches, this.getId()) > 1 ||
				!this.getEnabled()) {

				return;
			}

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// add the active state to the pressed item
			oEvent.srcControl.$().addClass(SelectListRenderer.CSS_CLASS + "ItemPressed");
			this._$ItemPressed = oEvent.srcControl.$();
		};

		/**
		 * Handle the touch end event on the Select.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 * @name sap.m.SelectList#ontouchend
		 * @function
		 */
		SelectList.prototype.ontouchend = function(oEvent) {

			if (this.getEnabled()) {

				// mark the event for components that needs to know if the event was handled
				oEvent.setMarked();

				// remove the active state
				if (this._$ItemPressed) {
					this._$ItemPressed.removeClass(SelectListRenderer.CSS_CLASS + "ItemPressed");
					this._$ItemPressed = null;
				}
			}
		};

		/**
		 * Handle the touchcancel event on the select list.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		SelectList.prototype.ontouchcancel = SelectList.prototype.ontouchend;

		/**
		 * Handle the tap event on the SelectList.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 * @name sap.m.SelectList#ontap
		 * @function
		 */
		SelectList.prototype.ontap = function(oEvent) {
			if (this.getEnabled()) {

				// mark the event for components that needs to know if the event was handled
				oEvent.setMarked();
				this._activateItem(oEvent.srcControl);
			}
		};

		/**
		 *  Handle when the space or enter key are pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		SelectList.prototype.onsapselect = function(oEvent) {

			if (this.getEnabled()) {

				// mark the event for components that needs to know if the event was handled
				oEvent.setMarked();

				// note: prevent document scrolling when space keys is pressed
				oEvent.preventDefault();

				this._activateItem(oEvent.srcControl);
			}
		};

		/* =========================================================== */
		/* API methods                                                 */
		/* =========================================================== */

		/* ----------------------------------------------------------- */
		/* protected methods                                           */
		/* ----------------------------------------------------------- */

		/**
		 * Retrieves the first enabled item from the aggregation named <code>items</code>.
		 *
		 * @param {array} [aItems]
		 * @returns {sap.ui.core.Item | null}
		 * @protected
		 * @name sap.m.SelectList#findFirstEnabledItem
		 * @function
		 */
		SelectList.prototype.findFirstEnabledItem = function(aItems) {
			aItems = aItems || this.getItems();

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getEnabled()) {
					return aItems[i];
				}
			}

			return null;
		};

		/**
		 * Retrieves the last enabled item from the aggregation named <code>items</code>.
		 *
		 * @param {array} [aItems]
		 * @returns {sap.ui.core.Item | null}
		 * @protected
		 * @name sap.m.SelectList#findLastEnabledItem
		 * @function
		 */
		SelectList.prototype.findLastEnabledItem = function(aItems) {
			aItems = aItems || this.getItems();
			return this.findFirstEnabledItem(aItems.reverse());
		};

		/**
		 * Update and synchronize "selectedItem" association, "selectedItemId", "selectedKey" properties and
		 * the "selectedItem".
		 *
		 * @param {string | sap.ui.core.Item | null} vItem
		 * @protected
		 * @name sap.m.SelectList#setSelection
		 * @function
		 */
		SelectList.prototype.setSelection = function(vItem) {
			var oSelectedItem = this.getSelectedItem(),
				CSS_CLASS = SelectListRenderer.CSS_CLASS;

			// update and synchronize "selectedItem" association,
			// "selectedKey" and "selectedItemId" properties
			this.setAssociation("selectedItem", vItem || null, true);
			this.setProperty("selectedItemId", vItem ? vItem.getId() : "", true);
			this.setProperty("selectedKey", vItem ? vItem.getKey() : "", true);

			if (oSelectedItem) {
				oSelectedItem.$().removeClass(CSS_CLASS + "ItemSelected");
			}

			oSelectedItem = this.getSelectedItem();

			if (oSelectedItem) {
				oSelectedItem.$().addClass(CSS_CLASS + "ItemSelected");
			}
		};

		/*
		 * Synchronize selected item and key.
		 *
		 * @protected
		 * @name sap.m.SelectList#synchronizeSelection
		 * @function
		 */
		SelectList.prototype.synchronizeSelection = function() {

			// the "selectedKey" property is set and it is synchronized with the "selectedItem" association
			if (this.isSelectionSynchronized()) {
				return;
			}

			var sKey = this.getSelectedKey(),
				vItem = this.getItemByKey("" + sKey);	// find the first item with the given key

			// there is an item that match with the "selectedKey" property and
			// it does not have the default value
			if (vItem && (sKey !== "")) {

				// update and synchronize "selectedItem" association and
				// "selectedKey" property
				this.setAssociation("selectedItem", vItem, true);
				this.setProperty("selectedItemId", vItem.getId(), true);

			// the aggregation items is not bound or
			// it is bound and the data is already available
			} else if (!this.isBound("items") || this._bDataAvailable) {

				vItem = this.getDefaultSelectedItem();

				// update and synchronize "selectedItem" association,
				// "selectedKey" and "selectedItemId" properties
				this.setSelection(vItem);
			}
		};

		/*
		 * Determines whether the "selectedItem" association and "selectedKey" property are synchronized.
		 *
		 * @returns {boolean}
		 * @protected
		 * @name sap.m.SelectList#isSelectionSynchronized
		 * @function
		 */
		SelectList.prototype.isSelectionSynchronized = function() {
			var vItem = this.getSelectedItem();
			return this.getSelectedKey() === (vItem && vItem.getKey());
		};

		/*
		 * Retrieves the first enabled item from the aggregation named <code>items</code>.
		 *
		 * @param {array} [aItems]
		 * @returns {sap.ui.core.Item | null}
		 * @protected
		 * @name sap.m.SelectList#findFirstEnabledItem
		 * @function
		 */
		SelectList.prototype.findFirstEnabledItem = function(aItems) {
			aItems = aItems || this.getItems();

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getEnabled()) {
					return aItems[i];
				}
			}

			return null;
		};

		/*
		 * Retrieves the last enabled item from the aggregation named <code>items</code>.
		 *
		 * @param {array} [aItems]
		 * @returns {sap.ui.core.Item | null}
		 * @protected
		 * @name sap.m.SelectList#findLastEnabledItem
		 * @function
		 */
		SelectList.prototype.findLastEnabledItem = function(aItems) {
			aItems = aItems || this.getItems();
			return this.findFirstEnabledItem(aItems.reverse());
		};

		/*
		 * Getter for visible <code>items</code>.
		 *
		 * @return {sap.ui.core.Item[]}
		 * @protected
		 * @name sap.m.SelectList#getVisibleItems
		 * @function
		 */
		SelectList.prototype.getVisibleItems = function() {
			return this.getItems();
		};

		/*
		 * Retrieves the selectables items from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item[]} An array containing the selectables items.
		 * @protected
		 * @name sap.m.SelectList#getSelectableItems
		 * @function
		 */
		SelectList.prototype.getSelectableItems = function() {
			return this.getEnabledItems(this.getVisibleItems());
		};

		/*
		 * Retrieves a item by searching for the given property/value from the aggregation named <code>items</code>.
		 * If duplicate values exist, the first item matching the value is returned.
		 *
		 * @param {string} sProperty An item property.
		 * @param {string} sValue An item value that specifies the item to retrieve.
		 * @returns {sap.ui.core.Item | null} The matched item or null.
		 * @protected
		 * @name sap.m.SelectList#findItem
		 * @function
		 */
		SelectList.prototype.findItem = function(sProperty, sValue) {
			var sMethod = "get" + sProperty.charAt(0).toUpperCase() + sProperty.slice(1);

			for (var i = 0, aItems = this.getItems(); i < aItems.length; i++) {
				if (aItems[i][sMethod]() === sValue) {
					return aItems[i];
				}
			}

			return null;
		};

		/*
		 * Retrieves the item with the given value from the aggregation named <code>items</code>.
		 * If duplicate values exist, the first item matching the value is returned.
		 *
		 * @param {string} sText An item value that specifies the item to retrieve.
		 * @returns {sap.ui.core.Item | null} The matched item or null.
		 * @protected
		 * @name sap.m.SelectList#getItemByText
		 * @function
		 */
		SelectList.prototype.getItemByText = function(sText) {
			return this.findItem("text", sText);
		};

		/*
		 * Determines whether the provided item is selected.
		 *
		 * @param {sap.ui.core.Item} oItem
		 * @returns {boolean}
		 * @protected
		 * @name sap.m.SelectList#isItemSelected
		 * @function
		 */
		SelectList.prototype.isItemSelected = function(oItem) {
			return oItem && (oItem.getId() === this.getAssociation("selectedItem"));
		};

		/**
		 * Retrieves the default selected item from the aggregation named <code>items</code>.
		 *
		 * @param {sap.ui.core.Item[]} [aItems]
		 * @returns {sap.ui.core.Item | null}
		 * @protected
		 * @name sap.m.SelectList#getDefaultSelectedItem
		 * @function
		 */
		SelectList.prototype.getDefaultSelectedItem = function(aItems) {
			return null;
		};

		/**
		 * Clear the selection.
		 *
		 * @protected
		 * @name sap.m.SelectList#clearSelection
		 * @function
		 */
		SelectList.prototype.clearSelection = function() {
			this.setSelection(null);
		};

		/* ----------------------------------------------------------- */
		/* public methods                                              */
		/* ----------------------------------------------------------- */

		/**
		 * Setter for association <code>selectedItem</code>.
		 *
		 * @param {string | sap.ui.core.Item | null} vItem new value for association <code>selectedItem</code>
		 *    Id of an sap.ui.core.Item which becomes the new target of this <code>selectedItem</code> association.
		 *    Alternatively, an sap.ui.core.Item instance may be given or null.
		 *    If the value of null is provided the first enabled item will be selected (if any).
		 *
		 * @returns {sap.m.SelectList} <code>this</code> to allow method chaining.
		 * @public
		 * @name sap.m.SelectList#setSelectedItem
		 * @function
		 */
		SelectList.prototype.setSelectedItem = function(vItem) {

			if (typeof vItem === "string") {
				vItem = sap.ui.getCore().byId(vItem);
			}

			if (!(vItem instanceof sap.ui.core.Item) && vItem !== null) {
				jQuery.sap.log.warning('Warning: setSelectedItem() "vItem" has to be an instance of sap.ui.core.Item, a valid sap.ui.core.Item id, or null on', this);
				return this;
			}

			if (!vItem) {
				vItem = this.getDefaultSelectedItem();
			}

			// update and synchronize "selectedItem" association,
			// "selectedKey" and "selectedItemId" properties
			this.setSelection(vItem);

			return this;
		};

		/**
		 * Setter for property <code>selectedItemId</code>.
		 *
		 * Default value is an empty string <code>""</code> or <code>undefined</code>.
		 *
		 * @param {string | undefined} vItem New value for property <code>selectedItemId</code>.
		 * @returns {sap.m.SelectList} <code>this</code> to allow method chaining.
		 * @public
		 * @name sap.m.SelectList#setSelectedItemId
		 * @function
		 */
		SelectList.prototype.setSelectedItemId = function(vItem) {
			vItem = this.validateProperty("selectedItemId", vItem);
			var oItem = sap.ui.getCore().byId(vItem);

			if (!(oItem instanceof sap.ui.core.Item) && vItem !== "" && vItem !== undefined) {
				jQuery.sap.log.warning('Warning: setSelectedItemId() "sItem" has to be a string id of an sap.ui.core.Item instance, an empty string or undefined on', this);
				return this;
			}

			if (!oItem) {
				oItem = this.getDefaultSelectedItem();
			}

			// update and synchronize "selectedItem" association,
			// "selectedKey" and "selectedItemId" properties
			this.setSelection(oItem);

			return this;
		};

		/**
		 * Setter for property <code>selectedKey</code>.
		 *
		 * Default value is an empty string <code>""</code> or <code>undefined</code>.
		 *
		 * @param {string} sKey New value for property <code>selectedKey</code>.
		 * @returns {sap.m.SelectList} <code>this</code> to allow method chaining.
		 * @public
		 * @name sap.m.SelectList#setSelectedKey
		 * @function
		 */
		SelectList.prototype.setSelectedKey = function(sKey) {
			sKey = this.validateProperty("selectedKey", sKey);
			var oItem = this.getItemByKey(sKey);

			if (oItem || (sKey === "")) {

				if (!oItem && sKey === "") {
					oItem = this.getDefaultSelectedItem();
				}

				// update and synchronize "selectedItem" association,
				// "selectedKey" and "selectedItemId" properties
				this.setSelection(oItem);

				return this;
			}

			// note: setSelectedKey() method sometimes is called
			// before the items are added, in this case the "selectedItem" association
			// and "selectedItemId" property need to be updated in onBeforeRendering()
			return this.setProperty("selectedKey", sKey);	// update "selectedKey" property, re-rendering is needed
		};

		/**
		 * Retrieves the selected item object from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item | null} The current target of the <code>selectedItem</code> association, or null.
		 * @public
		 * @name sap.m.SelectList#getSelectedItem
		 * @function
		 */
		SelectList.prototype.getSelectedItem = function() {
			var vSelectedItem = this.getAssociation("selectedItem");
			return (vSelectedItem === null) ? null : sap.ui.getCore().byId(vSelectedItem) || null;
		};

		/**
		 * Retrieves the item from the aggregation named items at the given 0-based index.
		 *
		 * @param {int} iIndex Index of the item to return.
		 * @returns {sap.ui.core.Item | null} Item at the given index, or null if none.
		 * @public
		 * @name sap.m.SelectList#getItemAt
		 * @function
		 */
		SelectList.prototype.getItemAt = function(iIndex) {
			return this.getItems()[ +iIndex] || null;
		};

		/**
		 * Retrieves the first item from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item | null} The first item, or null if there are no items.
		 * @public
		 * @name sap.m.SelectList#getFirstItem
		 * @function
		 */
		SelectList.prototype.getFirstItem = function() {
			return this.getItems()[0] || null;
		};

		/**
		 * Retrieves the last item from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item | null} The last item, or null if there are no items.
		 * @public
		 * @name sap.m.SelectList#getLastItem
		 * @function
		 */
		SelectList.prototype.getLastItem = function() {
			var aItems = this.getItems();
			return aItems[aItems.length - 1] || null;
		};

		/**
		 * Retrieves the enabled items from the given array of items or from
		 * this control's aggregation named <code>items</code>.
		 *
		 * @param {sap.ui.core.Item[]} [aItems=getItems()] items to filter
		 * @return {sap.ui.core.Item[]} An array containing the enabled items.
		 * @public
		 * @name sap.m.SelectList#getEnabledItems
		 * @function
		 */
		SelectList.prototype.getEnabledItems = function(aItems) {
			aItems = aItems || this.getItems();
			return aItems.filter(function(oItem) {
				return oItem.getEnabled();
			});
		};

		/**
		 * Retrieves the item with the given key from the aggregation named <code>items</code>.
		 * If duplicate keys exists, the first item matching the key is returned.
		 *
		 * @param {string} sKey An item key that specifies the item to retrieve.
		 * @returns {sap.ui.core.Item | null}
		 * @public
		 * @name sap.m.SelectList#getItemByKey
		 * @function
		 */
		SelectList.prototype.getItemByKey = function(sKey) {
			return this.findItem("key", sKey);
		};

		/**
		 * Removes an item from the aggregation named <code>items</code>.
		 *
		 * @param {int | string | sap.ui.core.Item} vItem The item to remove or its index or id.
		 * @returns {sap.ui.core.Item} The removed item or null.
		 * @public
		 * @name sap.m.SelectList#removeItem
		 * @function
		 */
		SelectList.prototype.removeItem = function(vItem) {

			// remove the item from the aggregation items
			vItem = this.removeAggregation("items", vItem);

			// no items, the removed item was the last
			if (this.getItems().length === 0) {

				// clear the selection
				this.clearSelection();
			} else if (this.isItemSelected(vItem)) {	// if the removed item is selected
				this.setSelection(this.getDefaultSelectedItem());
			}

			// return the removed item or null
			return vItem;
		};

		/**
		 * Removes all the controls in the aggregation named <code>items</code>.
		 * Additionally unregisters them from the hosting UIArea and clears the selection.
		 *
		 * @returns {sap.ui.core.Item[]} An array of the removed items (might be empty).
		 * @public
		 * @name sap.m.SelectList#removeAllItems
		 * @function
		 */
		SelectList.prototype.removeAllItems = function() {
			var aItems = this.removeAllAggregation("items");

			// clear the selection
			this.clearSelection();

			return aItems;
		};

		/**
		 * Destroys all the items in the aggregation named <code>items</code>.
		 *
		 * @returns {sap.m.SelectList} <code>this</code> to allow method chaining.
		 * @public
		 * @name sap.m.SelectList#destroyItems
		 * @function
		 */
		SelectList.prototype.destroyItems = function() {
			this.destroyAggregation("items");
			return this;
		};

		SelectList.prototype.setNoDataText = jQuery.noop;

		return SelectList;

	}, /* bExport= */ true);
