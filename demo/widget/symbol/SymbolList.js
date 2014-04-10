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

define(["dojo/_base/declare", "dijit/_WidgetBase",  "ppwcode-vernacular-semantics/_util/contracts/_Mixin",
        "./Symbol", "dojo/dom-class", "dojo/dom-construct",

        "xstyle/css!./symbol.css"],
  function (declare, _WidgetBase, _ContractsMixin,
            SymbolWidget, domClass, domConstruct) {

    return declare([_WidgetBase, _ContractsMixin], {
      // summary:
      //   Widget that shows a list of symbols. Should be used in an <ul>-tag.
      //   Propagates language changes to the Symbol widgets.

      // symbols: Symbol[]
      symbols: null, // IDEA make it an Observable store,

      // _widgets: {symbol: Symbol, widget: Widget}
      _widgets: null,

      constructor: function() {
        this._widgets = [];
      },

      postCreate: function() {
        this.inherited(arguments);
        domClass.add(this.domNode, "symbolList");
      },

      _getSymbolsAttr: function() {
        return this.symbols && this.symbols.slice();
      },

      _setSymbolsAttr: function(/*Symbol[]*/ symbols) {
        this._c_pre(function() {
          return !symbols ||
            (symbols instanceof Array && symbols.every(function(symbol) {return SymbolWidget.isSymbol(symbol);}));
        });

        function difference(one, other) {
          return one ? (other ? one.filter(function(symbol) {return other.indexOf(symbol) < 0;}) : one) : [];
        }

        var before = this.get("symbols");
        //noinspection JSCheckFunctionSignatures
        this._set("symbols", symbols);
        this._updateSymbolWidgets(difference(symbols, before), difference(before, symbols));
      },

      addSymbol: function(symbol) {
        this._c_pre(function() {return !symbol || SymbolWidget.isSymbol(symbol);});

        var symbols = this.get("symbols") || [];
        if (symbol && symbols.indexOf(symbol) < 0) {
          symbols.push(symbol);
          this.set("symbols", symbols);
        }
      },

      _updateSymbolWidgets: function(added, removed) {
        var self = this;
        self._widgets = self._widgets.reduce(
          function(acc, e) {
            if (removed.indexOf(e.symbol) < 0) {
              acc.push(e);
            }
            else {
              e.widget.destroyRecursive();
            }
            return acc;
          },
          []
        );
        added.forEach(function(symbol) {
          var li = domConstruct.create("li", null, self.domNode);
          var widget = new SymbolWidget({symbol: symbol}, li);
          self._widgets.push({symbol: symbol, widget: widget});
        });
      }

    });
  }
);
