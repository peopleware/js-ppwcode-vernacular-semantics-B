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
        "../trafficSign/TrafficSign",
        "dojo/store/Memory", "dojo/dom-style", "dojo/dom-construct", "dojo/dom-class", "dojo/dom", "dojo/on",
        "dojo/text!./combo.html",

        "xstyle/css!./combo.css"],
  function (declare, _WidgetBase, TemplatedMixin,
            OnDemandList, Selection, Keyboard,
            TrafficSign, Memory, domStyle, domConstruct, domClass, dom, on,
            template) {

    /*=====
    var Entry = {

      // id: String
      id: null,

      // trafficSign: TrafficSign
      trafficSign: null

    };
    =====*/


    var DropDown = declare([OnDemandList, Selection, Keyboard], {

      selectionMode: "single",

      renderRow: function(/*Entry*/ entry) {
        var divNode = domConstruct.create("div", {"className": "trafficSignEntry"});
        domConstruct.create("img", {src: entry.trafficSign.getUrl()}, divNode);
        var textNode = document.createTextNode(entry.trafficSign.getLabel());
        domConstruct.place(textNode, divNode);
        return divNode;
      }

    });

    return declare([_WidgetBase, TemplatedMixin], {

      templateString: template,

      // _dropDown: DropDown
      _dropDown: null,

      // dropDownOpen: boolean
      dropDownOpen: false,

      // _store
      _store: null,

      postCreate: function() {
        var self = this;
        self.inherited(arguments);
        self._store = new Memory({
          identifier: "id",
          data: TrafficSign.allValues().map(function(trafficSign) {
            return {id: trafficSign.toJSON(), trafficSign: trafficSign};
          })
        });
        self._dropDown = new DropDown({store: self._store});
        domStyle.set(self._dropDown.domNode, "height", "200px");
        self.own(self._dropDown.on(
          "dgrid-select",
          function (e) {
            self.set("dropDownOpen", false);
            self.emit("selected", {detail: {trafficSign: e.rows[0].data.trafficSign}});
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

      _setDropDownOpenAttr: function(dropDownOpen) {
        this._set("dropDownOpen", dropDownOpen);
        domClass.toggle(this._dropDown.domNode, "opened", dropDownOpen);
      }

    });

  })
;
