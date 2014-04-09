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

define(["dojo/_base/declare", "./Transformer", "../EnumerationValue", "../_util/contracts/doh"],
  function(declare, TransformerContract, EnumerationValue, doh) {

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
      }
//
//      $getBundle: function(/*String?*/ json) {
//
//      },

//      $format: function(/*EnumerationValueType*/ transformer, /*Value?*/ value, /*Object?*/ options) {
//        var result = transformer.format(value, options);
//        if (!value) {
//          doh.is(null, result);
//        }
//        else {
//          doh.validateInvariants(value);
//          doh.is("string", typeof result);
//          doh.t(value.equals(value.constructor.parse(result, options)));
//        }
//        return result;
//      },
//
//      $parse: function(/*EnumerationValueType*/ transformer, /*String?*/ str, /*Object?*/ expected, /*Object?*/ options) {
//        try {
//          var result = transformer.parse(str, options);
//          if (!str && str !== "") {
//            doh.is(null, result);
//          }
//          else {
//            doh.t(result);
//            doh.t(result.isInstanceOf(transformer));
//            doh.validateInvariants(result);
//          }
//          return result;
//        }
//        catch (exc) {
//          doh.t(exc.isInstanceOf && exc.isInstanceOf(ParseException));
//          doh.t(!!str || str === "");
//          return exc;
//        }
//      }

    });

  }
);
