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

define(["dojo/_base/declare", "../_util/contracts/Contract", "../_util/contracts/doh", "../ParseException"],
  function(declare, Contract, doh, ParseException) {

    // only documentation
    var FormatOptions = {

      // locale: String
      locale: null

    };

    // only documentation
    var Transformer = {

      format: function(/*Value?*/ value, /*FormatOptions?*/ options) {
        // summary:
        //   Return an end-user String representation of `value`.

        return null; // return string?
      },

      parse: function(/*string?*/ str, /*FormatOptions?*/ options) {
        // summary:
        //   Return a Value that is the in-memory representation of what `str` is to the end-user.

        return null; // return Value?
      }

    };

    return declare([Contract], {

      // SubjectType must be set in constructor

      $format: function(/*Transformer*/ transformer, /*Value?*/ value, /*FormatOptions?*/ options) {
        var result = transformer.format(value, options);
        if (!value) {
          doh.is(null, result);
        }
        else {
          doh.validateInvariants(value);
          doh.is("string", typeof result);
          doh.t(value.equals(value.constructor.parse(result, options)));
        }
        return result;
      },

      $parse: function(/*Transformer*/ transformer, /*String?*/ str, /*FormatOptions?*/ options) {
        try {
          var result = transformer.parse(str, options);
          if (!str && str !== "") {
            doh.is(null, result);
          }
          else {
            doh.t(result);
            doh.t(result.isInstanceOf(transformer));
            doh.validateInvariants(result);
          }
          return result;
        }
        catch (exc) {
          doh.t(exc.isInstanceOf && exc.isInstanceOf(ParseException));
          doh.t(!!str || str === "");
          return exc;
        }
      }

    });

  }
);

