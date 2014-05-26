/*
 Copyright 2012 - $Date $ by PeopleWare n.v.

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

define(["dojo/_base/declare", "./_util/contracts/_Mixin", "./_util/js", "module"],
    function(declare, _ContractMixin, js, module) {

      var PpwCodeObject = declare([_ContractMixin], {

        _c_invar: [
          function() {return js.typeOf(this.getTypeDescription()) === "string";},
          function() {return this.getTypeDescription() !== "";},
          function() {return js.typeOf(this.toString()) === "string";},
          function() {return this.toString() !== "";}
        ],

        getTypeDescription: function() {
          // summary:
          //   A string describing the type of this instance for toString.
          //   This is also used when sending data to the server.
          // description:
          //   The default is a property `mid` of the Constructor. If this
          //   does not exist, it is the declared class. Subtypes can override.
          // tags
          //   basic public extension

          if (this.constructor.mid) {
            return this.constructor.mid;
          }
          return this.declaredClass;
        }

      });

      PpwCodeObject.mid = module.id;

      return PpwCodeObject;
    }
);
