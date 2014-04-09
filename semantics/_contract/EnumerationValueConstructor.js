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

define(["dojo/_base/declare", "../_util/contracts/Contract", "../EnumerationValue", "../_util/js", "../_util/contracts/doh"],
  function(declare, Contract, EnumerationValue, js, doh) {

    return declare([Contract], {

      SubjectType: EnumerationValue,

      // values is a basic inspector, but we check the sync with the type as object here
      $declare: function(/*Function*/ Subject,
                         /*Function?*/ SuperType,
                         /*Object?*/ prototypeDef,
                         /*Array|Object*/ valueDefinitions,
                         /*module|String?*/ mod,
                         /*String?*/ bundleName) {
        var Result;
        if (SuperType) {
          Result = Subject.declare(SuperType, prototypeDef, valueDefinitions, mod, bundleName);
        }
        else {
          Result = Subject.declare(prototypeDef, valueDefinitions, mod, bundleName);
        }
        doh.is("function", typeof Result);
        doh.is("function", typeof Result.isJson);
        doh.is("function", typeof Result.revive);
        doh.is("function", typeof Result.values);
        doh.is("function", typeof Result.getBundle);
        doh.is("function", typeof Result.format);
        doh.is("function", typeof Result.parse);
        doh.t(Result.prototype.isInstanceOf(SuperType || EnumerationValue));
        if (prototypeDef) {
          js.getAllPropertyNames(prototypeDef).forEach(function(key) {
            if (key !== "__proto__") {
              var overridden = ["constructor", "toString", "valueOf"];
              var expected = (overridden.indexOf(key) >= 0) ? Result.prototype[key] : prototypeDef[key];
              doh.is(expected, Result.prototype[key]);
            }
          });
        }
        if (mod) {
          doh.is(mod.id || mod, Result.mid);
        }
        if (bundleName) {
          doh.is(bundleName, Result.bundleName);
        }



        function reprFromDef(valueDefinition) {
          return (typeof valueDefinition === "string") ?
                 valueDefinition :
                 valueDefinition.representation;
        }

        function instanceExistsAndOk(expectedInstanceName, expectedRepresentation) {
          var instance = Result[expectedInstanceName];
          doh.t(!!instance);
          doh.is(expectedRepresentation, instance.toJSON());
          doh.t(instance.isInstanceOf(Result));
          doh.t(instance.isValueOf(Result));
        }

        if (valueDefinitions instanceof Array) {
          valueDefinitions.forEach(function(valueDefinition) {
            var expectedInstanceNameAndRepresentation = reprFromDef(valueDefinition);
            instanceExistsAndOk(expectedInstanceNameAndRepresentation, expectedInstanceNameAndRepresentation);
          });
        }
        else if (valueDefinitions) {
          Object.keys(valueDefinitions).forEach(function(key) {
            instanceExistsAndOk(key, reprFromDef(valueDefinitions[key]));
          });
        }
        return Result;
      }

    });

  }
);

