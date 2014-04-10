/*
 Copyright 2014 - $Date $ by PeopleWare n.v.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

define(["dojo/_base/declare", "dijit/_WidgetBase", "ppwcode-vernacular-semantics/_util/contracts/_Mixin",
        "dojo/dom-class", "dojo/dom-construct", "dojo/dom-attr",
        "dojo/_base/fx", "dojo/fx", "dojo/_base/connect",

        "xstyle/css!./symbol.css"],
  function (declare, _WidgetBase, _ContractsMixin,
            domClass, domConstruct, domAttr,
            baseFx, fx, connect) {

    /*=====
    var Symbol = {

      getUrl: function() {
        return null; // return String
      },

      getLabel: function(lang) {
        // lang: String?

        return null; // return String
      }

    };
    =====*/

    function hasMethod(anything, methodName) {
      return typeof anything[methodName] === "function";
    }

    function isSymbol(anything) {
      return anything && hasMethod(anything, "getUrl") && hasMethod(anything, "getLabel");
    }


    //noinspection MagicNumberJS
    var animDuration = 500; // ms

    var SymbolWidget = declare([_WidgetBase, _ContractsMixin], {
      // summary:
      //   Widget that shows a symbol (or not). Use with a block or table-cell element.
      //
      // description:
      //   If there is no symbol to show, there is no img tag.
      //   If the `sign` is changed, a new img is added.
      //   A fade animation is used to switch.
      //
      //   For symbols we need to be able to get a url for the image that represents them,
      //   (`getUrl`), and optionally a label in a given language (`getLabel`).
      //   A symbol needs to have a valid URL.

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
        domClass.add(this.domNode, "symbol");
        var symbol = this.get("symbol");
        if (symbol && symbol.getUrl()) {
          this._showNewSymbolAnimation().play();
        }
      },

      _setSymbolAttr: function (/*Symbol*/ symbol) {
        this._c_pre(function() {return !symbol || isSymbol(symbol);});

        if (this.get("symbol") !== symbol) {
          //noinspection JSCheckFunctionSignatures
          this._set("symbol", symbol);
          this._changeAnimation().play();
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

      _changeAnimation: function () {
        // summary:
        //   Animation to switch the symbol.
        this._c_pre(function() {return (this.get("symbol") && this.get("symbol").getUrl()) ||
                                       (this._imgNode && this._labelNode);});

        if (!this.get("symbol") || !this.get("symbol").getUrl()) {
        // change from some symbol to no symbol
          return this._removeOldSymbolAnimation(); // return baseFx.Animation
        }
        // there is a symbol to show
        if (!this._imgNode) {
        // change from no symbol to a symbol
          return this._showNewSymbolAnimation(); // return baseFx.Animation
        }
        // there is a symbol to show, and there is a symbol shown that is different
        return fx.combine([this._removeOldSymbolAnimation(), this._showNewSymbolAnimation()]); // return baseFx.Animation
      },

      _showNewSymbolAnimation: function () {
        // summary:
        //   An animation to create an _imgNode.
        this._c_pre(function() {return this.get("symbol");});
        this._c_pre(function() {return this.get("symbol").getUrl();});

        this._createNodes();
        return baseFx.fadeIn({node: this.domNode, duration: animDuration}); // return baseFx.Animation
      },

      _createNodes: function () {
        this._c_pre(function() {return this.get("symbol");});
        this._c_pre(function() {return this.get("symbol").getUrl();});

        this._imgNode = domConstruct.create("img", {src: this.get("symbol").getUrl()}, this.domNode);
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
        this._c_pre(function() {return this._imgNode;});
        this._c_pre(function() {return this._labelNode;});

        var /*DOMNode*/ oldImgNode = this._imgNode; // lock reference in closure for when play executes
        var /*DOMNode*/ oldLabelNode = this._labelNode; // lock reference in closure for when play executes
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

    SymbolWidget.isSymbol = isSymbol;

    return SymbolWidget;
  }
);
