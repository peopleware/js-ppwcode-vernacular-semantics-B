define(["dojo/_base/declare",
  "dijit/_WidgetBase",
  "./Symbol",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/query",
  "xstyle/css!./symbol.css"],
  function (declare, _WidgetBase, SymbolWidget, domClass, domConstruct, query) {

    return declare([_WidgetBase], {//,_PropagationMixin, _DerivedMixin
      // summary:
      //   Widget that shows a list of symbols. Should be used in an <ul>-tag.
      //   Re-renders if the symbols change, and propagates language changes to the Symbol widgets.

      // symbols: Symbol[]
      symbols: null, // IDEA make it an Observable store,

      postCreate: function () {
        this.inherited(arguments);
        domClass.add(this.domNode, "symbolList");
      },


      _setSymbolsAttr: function (s) {
        this.symbols = s;
        this._updateSymbolWidgets(s);
      },

      updateSymbols: function (symbol) {
        var s = this.symbols || [];
        if (s.indexOf(symbol) < 0) {
          s.push(symbol);
          this.set("symbols", s);
        }
      },


      _updateSymbolWidgets: function (symbols) {
        var self = this;
        query("dl#" + self.id + " dd").forEach(domConstruct.destroy);
        symbols.forEach(function (symbol) {
          var dd = domConstruct.create("dd", null, self.domNode);
          var w = new SymbolWidget();
          w.placeAt(dd);
          w.set("symbol", symbol);
        });
      }
    });
  }
);
