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

define(["dojo/_base/declare", "./Transformer", "../EnumerationValue", "../ParseException", "../_util/contracts/doh"],
  function(declare, TransformerContract, EnumerationValue, ParseException, doh) {

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

      // values is a basic inspector, but we check the sync with the type as object here
      $values: function(/*EnumerationValueType*/ subject) {
        var result = subject.values();
        doh.t(result instanceof Array);
        result.forEach(function(enumValue) {
          var candidateKey;
          var found = true;
          for (candidateKey in subject) {
            if (subject[candidateKey] === enumValue) {
              found = true;
              //noinspection BreakStatementJS
              break;
            }
          }
          doh.t(found);
        });
        Object.keys(subject).forEach(function(key) {
          doh.t(key === "superclass" ||
                !subject[key] ||
                !subject[key].isInstanceOf ||
                !subject[key].isInstanceOf(EnumerationValue) ||
                result.indexOf(subject[key] >= 0));
        });
        result.forEach(function(enumValue) {
          result.every(function(otherEnumValue) {
            return enumValue === otherEnumValue || enumValue.toJSON() !== otherEnumValue.toJSON();
          })
        });
        return result;
      },


      $isJson: function(/*EnumerationValueType*/ subject, /*String?*/ json) {
        var result = subject.isJson(json);
        doh.is("boolean", typeof result);
        var expected = false;
        if (typeof json === "string") {
          var candidateKey;
          for (candidateKey in subject) {
            if (subject[candidateKey] &&
                subject[candidateKey].toJSON &&
                subject[candidateKey].toJSON() === json) {
              expected = true;
              //noinspection BreakStatementJS
              break;
            }
          }
        }
        doh.is(expected, result);
        return result;
      },

      $revive: function(/*EnumerationValueType*/ subject, /*String?*/ json) {
        var result = subject.revive(json);
        if (result) {
          doh.t(result.isValueOf(subject));
          doh.t(subject.isJson(json));
          doh.is(json, result.toJSON());
          doh.validateInvariants(result);
        }
        else {
          doh.f(subject.isJson(json));
        }
        return result;
      },

      $getBundle: function(/*EnumerationValueType*/ subject, /*String?*/ lang) {
        var result = subject.getBundle(lang);
        if (result) {
          doh.is("object", typeof result);
        }
        // noting to do; can only call the method
        return result;
      },

      $format: function(/*EnumerationValueType*/ transformer, /*EnumerationValue?*/ value, /*Object?*/ options) {
        var result = this.inherited(arguments);
        var expected = null;
        if (value) {
          var bundle = transformer.getBundle(options && options.locale);
          var repr = value.toJSON();
          var bundleLabel = bundle && bundle[repr];
          expected = (bundleLabel || bundleLabel === "") ? bundleLabel : repr;
        }
        doh.is(expected, result);
        return result;
      },

      $parse: function(/*EnumerationValueType*/ EnumerationValueType, /*String?*/ str, /*FormatOptions?*/ options) {
        var result = this.inherited(arguments);
        if (str || str === "") {
          var bundle = EnumerationValueType.getBundle(options && options.locale);
          var repr = str;
          if (bundle) {
            var key;
            for (key in bundle) {
              if (bundle[key] === str) {
                repr = key;
                //noinspection BreakStatementJS
                break;
              }
            }
          }
          if (EnumerationValueType[repr]) {
            doh.is(EnumerationValueType[repr], result);
          }
          else {
            doh.t(result && result.isInstanceOf && result.isInstanceOf(ParseException));
          }
        }
        return result;
      }

    });

  }
);

