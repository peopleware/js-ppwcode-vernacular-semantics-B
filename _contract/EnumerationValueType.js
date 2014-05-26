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

define(["dojo/_base/declare", "./Transformer", "../EnumerationValue", "../ParseException", "../_util/js"],
  function(declare, TransformerContract, EnumerationValue, ParseException, js) {

    // only documentation
    var EnumerationValueType = function() {};
    EnumerationValueType.values = function() {
      return []; // return EnumerationValue[]
    };
    EnumerationValueType.isJson = function(/*String?*/ json) {
      return false; // return boolean
    };
    EnumerationValueType.revive = function(/*String?*/ json) {
      return new EnumerationValueType(); // return EnumerationValueType
    };
    EnumerationValueType.getBundle = function(/*String*/ lang) {
      return {}; // return Object
    };
    EnumerationValueType.format = TransformerContract.prototype.Transformer.format;
    EnumerationValueType.parse = TransformerContract.prototype.Transformer.parse;





    return declare([TransformerContract], {

      // SubjectType must be set in constructor

      // values is a basic inspector, but we check the sync with the type as object here,
      // because we have no invariants yet for "Constructors"
      $values: [
        function(result) {return result instanceof Array;},
        function(result) {
          return result.every(function(v) {return Object.keys(this).some(function(k) {return v === this[k];}, this);}, this);
        },
        function(result) {
          return Object.keys(this).every(
            function(k) {
              return k ===
                     "superclass" ||
                     !this[k] ||
                     !this[k].isInstanceOf ||
                     !this[k].isInstanceOf(EnumerationValue) ||
                     result.indexOf(this[k] >= 0);
            },
            this
          );
        },
        function(result) {
          return result.every(function(v) {
            return result.every(function(otherV) {
              return v === otherV || v.toJSON() !== otherV.toJSON();
            });
          });
        }
      ],

      $isJson: [
        function(/*String?*/ json, result) {return typeof result === "boolean";},
        function(/*String?*/ json, result) {return result === this.values().some(function(v) {return v.toJSON() === json;});}
      ],

      $revive: [
        function(/*String?*/ json, result) {return result || !this.isJson(json);},
        function(/*String?*/ json, result) {return !result || result.isValueOf(this);},
        function(/*String?*/ json, result) {return !result || result.toJSON() === json;}
      ],

      $getBundle: [
        function(/*String?*/ lang, result) {return result === undefined || js.typeOf(result) === "object";}
      ],

      $format: [
        function(/*EnumerationValue?*/ value, /*Object?*/ options, result) {
          if (!value) {
            return true;
          }
          var bundle = this.getBundle(options && options.locale);
          var repr = value.toJSON();
          var bundleLabel = bundle && bundle[repr];
          return result === ((bundleLabel || bundleLabel === "") ? bundleLabel : repr);
        }
      ],

      $parse: {
        nominal: [
          function(/*String?*/ str, /*FormatOptions?*/ options, result) {return !result || result.isValueOf(this);},
          function(/*String?*/ str, /*FormatOptions?*/ options, result) {
            if (!result) {
              return true;
            }
            var bundle = this.getBundle(options && options.locale);
            return str === bundle ? bundle[result.toJSON()] : result.toJSON();
          }
        ],
        exceptional: [
          {
            exception: function(exc) {return exc && exc.isInstanceOf && exc.isInstanceOf(ParseException);},
            conditions: [
              function(/*String?*/ str, /*FormatOptions?*/ options) {
                var bundle = this.getBundle(options && options.locale);
                return bundle ?
                       Object.keys(bundle).every(function(k) {return bundle[k] !== str;}) :
                       (!this[str] || this.values().indexOf(this[str]) < 0);
              }
            ]
          }
        ]
      }

    });

  }
);

