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

define(["dojo/_base/declare", "../_util/contracts/Contract", "../EnumerationValue", "../_util/js"],
  function(declare, Contract, EnumerationValue, js) {

    var overridden = ["__proto__", "constructor", "toString", "valueOf"];

    function normalizeArguments(/*Function*/ condition) {
      return function(SuperType /*...*/) {
        return condition.apply(this, (typeof SuperType === "function") ? arguments : [undefined].concat(Array.prototype.slice.apply(arguments)));
      };
    }

    function reprFromDef(valueDefinition) {
      return (typeof valueDefinition === "string") ? valueDefinition : valueDefinition.representation;
    }

    function instanceExistsAndOk(Result, expectedInstanceName, expectedRepresentation) {
      var instance = Result[expectedInstanceName];
      return !!instance && expectedRepresentation === instance.toJSON() && instance.isInstanceOf(Result) && instance.isValueOf(Result);
    }

    return declare([Contract], {

      SubjectType: EnumerationValue,

      $declare: [
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return typeof Result === "function";
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return typeof Result.isJson === "function";
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return typeof Result.revive === "function";
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return typeof Result.values === "function";
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return typeof Result.getBundle === "function";
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return typeof Result.format === "function";
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return typeof Result.parse === "function";
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return Result.prototype.isInstanceOf(SuperType || EnumerationValue);
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return js.getAllPropertyNames(prototypeDef)
            .filter(function(key) {return overridden.indexOf(key) < 0;})
            .every(function(key) {return Result.prototype[key] === prototypeDef[key];});
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return !mod || Result.mid === (mod.id || mod);
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return !bundleName || Result.bundleName === bundleName;
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return !valueDefinitions || !(valueDefinitions instanceof Array) || valueDefinitions.every(function(valueDefinition) {
            //noinspection LocalVariableNamingConventionJS
            var expectedInstanceNameAndRepresentation = reprFromDef(valueDefinition);
            return instanceExistsAndOk(Result, expectedInstanceNameAndRepresentation, expectedInstanceNameAndRepresentation);
          });
        }),
        normalizeArguments(function(/*Function?*/ SuperType, /*Object?*/ prototypeDef, /*Array|Object*/ valueDefinitions, /*module|String?*/ mod, /*String?*/ bundleName, Result) {
          return !valueDefinitions || valueDefinitions instanceof Array || Object.keys(valueDefinitions).every(function(key) {
            return instanceExistsAndOk(Result, key, reprFromDef(valueDefinitions[key]));
          });
        })
      ]

    });

  }
);

