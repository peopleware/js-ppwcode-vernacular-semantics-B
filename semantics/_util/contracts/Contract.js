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

define(["dojo/_base/declare", "dojo/_base/lang"],
  function(declare, lang) {

    var Contract = declare([], {

      // SubjectType: Function
      //   Constructor of the type documented by this contract.
      SubjectType: null,

      constructor: function(kwargs) {
        lang.mixin(this, kwargs);
      },

      gatherPostconditions: function(methodName) {

        function addToConditions(obj, acc) {
          var conditionPropertyName = "$" + methodName;
          var definition = obj.hasOwnProperty(conditionPropertyName) && obj[conditionPropertyName];
          if (definition) {
            if (definition instanceof Array) {
              Array.prototype.push.apply(acc.nominal, definition);
            }
            else {
              Array.prototype.push.apply(acc.nominal, definition.nominal);
              Array.prototype.push.apply(acc.exceptional, definition.exceptional);
            }
          }
          return acc;
        }

        if (methodName === "constructor") {
          var definition = this.$constructor;
          return {
            nominal: definition ? (definition instanceof Array ? definition : definition.nominal) : [],
            exceptional: definition && definition.exceptional ? definition.exceptional : []
          };
        }
        return this.constructor._meta.bases.reduceRight(
          function(acc, base) {return addToConditions(base.prototype, acc);},
          addToConditions(this, {
            nominal: [],
            exceptional: []
          })
        );
      }

    });

    return Contract;

  }
);

