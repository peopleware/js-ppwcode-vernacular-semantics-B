define(["dojo/_base/declare", "dijit/_WidgetBase",
  "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/dom-attr", "dojo/_base/fx", "dojo/fx", "dojo/_base/connect",
  "xstyle/css!./symbol.css"],
  function (declare, _WidgetBase, domClass, domConstruct, domStyle, domAttr, baseFx, fx, connect) {

    var animDuration = 500; // ms

    return declare([_WidgetBase], {
      // summary:
      //   Widget that shows a Symbol (or not). Use with a block or table-cell element.
      // description:
      //   If there is no Symbol to show, there is no img tag.
      //   If the `symbol` is changed, a new img is added.
      //   A fade animation is used to switch.
      //
      //   Some symbols have extra i18n text. This is shown below the img.

      // symbol: Symbol
      symbol: null,

      // lang: String?
      //   If the Symbol has a label, we need to retrieve it with a lang.
      //   The default is "nl".
      lang: null,

      // _imgNode: DOMNode
      //   Initially there is no img node.
      _imgNode: null,

      // _labelNode: DOMNode
      //   Initially there is no label node.
      _labelNode: null,

      postCreate: function () {
        this.inherited(arguments);
        domClass.add(this.domNode, "traffic_symbol");
        if (this.symbol && this.symbol.url) {
          this._createNodes();
          domStyle.set(this.domNode, "opacity", 1);
        }
      },

      _setSymbolAttr: function (/*Symbol*/ symbol) {
        if (this.symbol !== symbol) {
          this._set("symbol", symbol);
          this._symbolChangeAnimation().play();
        }
      },

      _getLangAttr: function () {
        return this.lang || "nl";
      },

      _setLangAttr: function (lang) {
        this._set("lang", lang);
        if (this._labelNode) { // there is a symbol
          var label = this.get("symbol").getLabel(lang);
          domAttr.set(this._labelNode, "innerHTML", label);
        }
      },

      _symbolChangeAnimation: function () {
        // summary:
        //   Animation to switch the symbol.
        // description:
        //   pre: (this.get("symbol") && this.get("symbol").url) || this._imgNode

        if (!this.get("symbol") || !this.get("symbol").url) { // change from some symbol to no symbol
          return this._removeOldSymbolAnimation(); // return baseFx.Animation
        }
        // this.get("symbol") && this.get("symbol").url
        // there is a symbol to show
        if (!this._imgNode) { // change from no symbol to a symbol
          return this._showNewSymbolAnimation(); // return baseFx.Animation
        }
        // this.get("symbol") && this.get("symbol").url && this._imgNode
        // there is a symbol to show, and there is a symbol shown that is different
        return fx.combine([this._removeOldSymbolAnimation(), this._showNewSymbolAnimation()]); // return baseFx.Animation
      },

      _showNewSymbolAnimation: function () {
        // summary:
        //   An animation to create an _imgNode.
        // description:
        //   pre: this.get("symbol")
        //   pre: this.get("symbol").url

        this._createNodes();
        return baseFx.fadeIn({node: this.domNode, duration: animDuration}); // return baseFx.Animation
      },

      _createNodes: function () {
        // description:
        //   pre: this.get("symbol")
        //   pre: this.get("symbol").url

        this._imgNode = domConstruct.create("img", {src: this.get("symbol").url}, this.domNode);
        /*
         IE has a bug, where it sets the natural width and height on an img sometimes.
         The trick is to delete that.
         */
        domAttr.remove(this._imgNode, "width");
        domAttr.remove(this._imgNode, "height");
        var label = this.get("symbol").getLabel(this.get("lang"));
        if (label) {
          this._labelNode = domConstruct.create("span", {innerHTML: label}, this.domNode);
        }
      },

      _removeOldSymbolAnimation: function () {
        // summary:
        //   An animation to remove the current _imgNode.
        // description:
        //   pre: this._imgNode

        var /*DOMNode*/ oldImgNode = this._imgNode; // lock reference in closure for when play executes
        var /*DOMNode*/ oldLabelNode = this._imgNode; // lock reference in closure for when play executes
        this._imgNode = null;
        this._labelNode = null;
        var /*Animation*/ anim = baseFx.fadeOut({node: this.domNode, duration: animDuration});
        var handler = connect.connect(anim, "onEnd", function () {
          domConstruct.destroy(oldImgNode);
          domConstruct.destroy(oldLabelNode);
          handler.remove();
        });
        return anim; // return baseFx.Animation
      }

    });
  }
);
