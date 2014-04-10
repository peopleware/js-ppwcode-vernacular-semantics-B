define(["require",
  "dojo/_base/declare",
  "dojo/string",
  "../trafficSign/TrafficSign",
  "dojo/on",
  "dojo/_base/Deferred",
  "dojo/_base/array",
  "dojo/store/Memory",
  "dojo/dom",
  "dojo/dom-style",
  "dojo/dom-construct",
  "dojo/dom-class",
  "put-selector/put",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!./combo.html",
  "xstyle/css!./combo.css"
],
  function (require, declare, string, TrafficSign, on, Deferred, array, Memory, dom, domStyle, domConstruct, domClass, put, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, template) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
      templateString: template,

      // select
      _enumSelect: null,
      _gridDropDown: null,


      renderItem: function (item) {
        var divNode, textNode;
        textNode = document.createTextNode(item.id);
        divNode = domConstruct.create("div", {
          "class": "langSelect"
        });
        put(divNode, this.getImageSource(item.boardImage));
        domConstruct.place(textNode, divNode);
        return divNode;
      },


      getImageSource: function (src) {
        return string.substitute("img[src=${0}]", [src]);
      },

      _showDropDown: function (boardsdata) {
        var self = this;

        require(["dgrid/OnDemandList", "dgrid/Selection", "dgrid/Keyboard"],
          function (OnDemandList, Selection, Keyboard) {

            var DropDown = declare([OnDemandList, Selection, Keyboard]);
            var store = new Memory({
              identifier: "representation",
              data: boardsdata
            });
            var dropDown = self._gridDropDown = new DropDown({
              selectionMode: "single",
              store: store,
              renderRow: self.renderItem.bind(self)
            });
            domConstruct.place(dropDown.domNode, self._enumSelect);
            dropDown.startup();
            domStyle.set(dropDown.domNode, "height", "200px");
            var open = false;

            function toggle(state) {
              open = state;
              domClass[open ? "add" : "remove"](dropDown.domNode, "opened");
            }

            on(self._enumSelect, ".button:click", function () {
              toggle(!open);
            });

            dropDown.on("dgrid-select", function (e) {
              toggle(false);
              self.emit("EnumValueChanged", {enum: e.rows[0].data.enum});
            });
            dropDown.on("onBlur", function () {
              toggle(false);
            });
            self.own(
              on(self.getParent().domNode, "click", function (evt) {
                if (domClass.contains(dropDown.domNode, "opened") && !dom.isDescendant(evt.target, self._enumSelect)) {
                  toggle(false);
                }
              })
            );
          });

      },
      _loadEnumerations: function () {
        var self = this;

        // get all enums
        var allboards = TrafficSign.MANDATORY.values().concat(TrafficSign.PROHIBITORY.values()).concat(TrafficSign.WARNING.values()).concat(TrafficSign.DIRECTION.values())
          , dfd = new Deferred(),
          makeOptions = function () {
            if (!Array.isArray(allboards)) {
              return false;
            }
            var boards = array.map(allboards, function (board) {

              var obj = {id: board.getLabel(), enum: board, boardImage: board.getUrl()};
              // obj.onClick = self.emit("EnumValueChanged",{enum:obj.enum});
              return obj;
            });
            dfd.resolve(boards);
          };
        makeOptions();

        return dfd;
      },

      startup: function () {
        var self = this;
        this._loadEnumerations().then(function (boards) {
          self._showDropDown(boards);
        });
        this.inherited(arguments);
      }
    });

  })
;
