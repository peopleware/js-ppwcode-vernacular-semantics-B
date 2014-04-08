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

define(["dojo/_base/declare", "./Value", "../_util/contracts/doh", "../EnumerationValue"],
  function(declare, ValueContract, doh, EnumerationValue) {

    return declare([ValueContract], {

      SubjectType: EnumerationValue,

      $isValueOf: function(/*EnumerationValue*/ subject, /*Object*/ EnumDef) {
        var result = subject.isValueOf(EnumDef);
        doh.validateInvariants(subject);
        // postconditions
        doh.is("boolean", typeof result);
        if (EnumDef.values) {
         doh.is(EnumDef.values().indexOf(subject) >= 0, result);
        }
        else {
          var found = false;
          for(var key in EnumDef) {
            if (EnumDef[key] === subject) {
              found = true;
            }
          }
          doh.is(found, result);
        }
        return result;
      },

      $equals: function(/*EnumerationValue*/ subject, other) {
        var result = this.inherited(arguments);
        doh.is(subject === other, result);
        return result;
      },

      $toJSON: function(/*EnumerationValue*/ subject) {
        var result = subject.toJSON();
        doh.t(result);
        doh.is("string", typeof result);
        return result;
      },

      $getLabel: function(/*EnumerationValue*/ subject, options) {
        var result = subject.getLabel(options);
        doh.is("string", typeof result);
        return result;
      }

   });

  }
);
