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

define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
        "dgrid/OnDemandList", "dgrid/Selection", "dgrid/Keyboard",
        "dojo/dom-style", "dojo/dom-construct", "dojo/dom-class", "dojo/dom", "dojo/on",
        "dojo/text!./combo.html",

        "xstyle/css!./combo.css"],
  function (declare, _WidgetBase, TemplatedMixin,
            OnDemandList, Selection, Keyboard,
            domStyle, domConstruct, domClass, dom, on,
            template) {

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

    var DropDown = declare([OnDemandList, Selection, Keyboard], {

      selectionMode: "single",

      renderRow: function(/*Symbol*/ symbol) {
        var divNode = domConstruct.create("div", {"className": "entry"});
        domConstruct.create("img", {src: symbol.getUrl()}, divNode);
        var textNode = document.createTextNode(symbol.getLabel());
        domConstruct.place(textNode, divNode);
        return divNode;
      }

    });

    var Combo = declare([_WidgetBase, TemplatedMixin], {
      // summary:
      //   Widget that allows to select a symbol from a drop-down. Symbols are provided in
      //   a Store.
      //
      // description:
      //   For symbols we need to be able to get a url for the image that represents them,
      //   (`getUrl`), and optionally a label in a given language (`getLabel`).
      //   A symbol needs to have a valid URL.

      templateString: template,

      // _dropDown: DropDown
      _dropDown: null,

      // dropDownOpen: boolean
      dropDownOpen: false,

      // symbols: Store<Symbol>
      store: null,

      postCreate: function() {
        var self = this;
        self.inherited(arguments);
        self._dropDown = new DropDown({store: self._store});
        domStyle.set(self._dropDown.domNode, "height", "200px");
        self.own(self._dropDown.on(
          "dgrid-select",
          function (e) {
            self.set("dropDownOpen", false);
            self.emit("selected", {detail: {symbol: e.rows[0].data}});
          }
        ));
        self.own(on(
          self.domNode,
          "click",
          function() {self.set("dropDownOpen", !self.get("dropDownOpen"));}
        ));
        self.own(self._dropDown.on(
          "blur",
          function() {self.set("dropDownOpen", false);}
        ));
        self.own(on(
          window,
          "click",
          function (evt) {
            if (self.get("dropDownOpen") && !dom.isDescendant(evt.target, self.domNode)) {
              self.set("dropDownOpen", false);
            }
          }
        ));
        domConstruct.place(self._dropDown.domNode, self.domNode);
      },

      startup: function() {
        this._dropDown.startup();
        this.inherited(arguments);
      },

      _setStoreAttr: function(/*Store<Symbol>*/ store) {
        this._set("store", store);
        this._dropDown.set("store", store);
      },

      _setDropDownOpenAttr: function(dropDownOpen) {
        this._set("dropDownOpen", dropDownOpen);
        domClass.toggle(this._dropDown.domNode, "opened", dropDownOpen);
      }

    });

    Combo.isSymbol = isSymbol;

    return Combo;

  })
;
