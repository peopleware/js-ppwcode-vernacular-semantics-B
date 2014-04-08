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

define(["dojo/_base/declare", "../_util/contracts/MethodTests", "../_util/contracts/doh", "../Value", "../ParseException"],
  function(declare, MethodTests, doh, Value, ParseException) {

    return declare([MethodTests], {

      SubjectType: Value,

      format: function(/*Function*/ ValueType, /*Value?*/ value, /*Object?*/ options) {
        var result = ValueType.format(value, options);
        if (!value) {
          doh.is(null, result);
        }
        else {
          doh.validateInvariants(value);
          doh.is("string", typeof result);
          doh.t(value.equals(value.constructor.parse(result, options)));
        }
      },

      parse: function(/*Function*/ ValueType, /*String?*/ str, /*Object?*/ expected, /*Object?*/ options) {
        try {
          var result = ValueType.parse(str, options);
          if (!str && str !== "") {
            doh.is(null, result);
          }
          else {
            doh.t(result);
            doh.t(result.isInstanceOf(ValueType));
            doh.validateInvariants(result);
          }
        }
        catch (exc) {
          doh.t(exc.isInstanceOf && exc.isInstanceOf(ParseException));
          doh.t(!!str || str === "");
        }
      }

    });

  }
);

