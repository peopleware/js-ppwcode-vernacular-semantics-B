define(["dojo/_base/declare",
  "dijit/_WidgetBase",
  "./Symbol",
  "dojo/dom-class",
  "dojo/dom-construct",
  "xstyle/css!./symbol.css"],
  function (declare, _WidgetBase, SymbolWidget, domClass, domConstruct) {

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
        s.push(symbol);
        this.set("symbols", s);
      },


      _updateSymbolWidgets: function (symbols) {
        var self = this;
        domConstruct.empty(self.domNode);
        //domClass.toggle(self.domNode, "dpd", true);
        symbols.forEach(function (symbol) {
          var li = domConstruct.create("li", null, self.domNode);
          var w = new SymbolWidget();
          w.placeAt(li);
          w.set("symbol", symbol);
        });
      }
    });
  }
);
