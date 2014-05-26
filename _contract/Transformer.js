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

define(["dojo/_base/declare", "../_util/contracts/Contract", "../ParseException"],
  function(declare, Contract, ParseException) {

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

      FormatOptions: FormatOptions,
      Transformer: Transformer,

      $format: [
        function(/*Value?*/ value, /*FormatOptions?*/ options, result) {return value || result === null;},
        function(/*Value?*/ value, /*FormatOptions?*/ options, result) {return !value || typeof result === "string";},
        function(/*Value?*/ value, /*FormatOptions?*/ options, result) {return !value || value.equals(value.constructor.parse(result, options));}
      ],

      $parse: {
        nominal: [
          function(/*String?*/ str, /*FormatOptions?*/ options, result) {return str || str === "" || result === null;},
          function(/*String?*/ str, /*FormatOptions?*/ options, result) {return (!str && str !== "") || (result && result.constructor === this);}
        ],
        exceptional: [
          {
            exception: function(exc) {return exc && exc.isInstanceOf && exc.isInstanceOf(ParseException);},
            conditions: [
              function(/*String?*/ str, /*FormatOptions?*/ options, exc) {return !!str || str === "";}
            ]
          }
        ]
      }

    });

  }
);

