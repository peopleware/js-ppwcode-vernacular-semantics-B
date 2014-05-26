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

define(["dojo/_base/declare", "../js", "dojo/_base/lang"],
  function(declare, js, lang) {

    function parameterToName(parameter) {
      if (parameter instanceof Function && parameter.prototype.getTypeDescription) {
        return parameter.prototype.getTypeDescription();
      }
      if (parameter && parameter.toString !== Object.prototype.toString) {
        return parameter.toString();
      }
      return JSON.stringify(parameter);
    }

    var CaseFactory = declare([], {

      // contract: Contract
      //   Instance of the contract we are supplying cases for.
      contract: null,

      typeTestCreator: null,

      // typeCaseFactory: CaseFactories
      //   Optional instance for testing the type (the Constructor function object) itself.
      typeCaseFactory: null,

      constructor: function(kwargs) {
        lang.mixin(this, kwargs);
      },

      createMethodTests: function(methodName, methodTestCreator) {

        var self = this;
        var remainingArgFactories = self["$" + methodName]();
        var partialInstanceArgFactories = [];
        var postconditions = self.contract.gatherPostconditions(methodName);

        function fillTests() {
          if (remainingArgFactories.length <= 0) {
            methodTestCreator(
              self.contract.SubjectType,
              methodName,
              postconditions,
              partialInstanceArgFactories
            );
          }
          else {
            var nextArg = remainingArgFactories.shift();
            if (nextArg.canBeSkipped) {
              fillTests(); // go deep skipping this argument
            }
            nextArg = {
              name: nextArg.name ||
                    (partialInstanceArgFactories.length <= 0 ?
                      "subject" :
                      "arg" + (partialInstanceArgFactories.length - 1)),
              factories: nextArg.factories || nextArg
            };
            nextArg.factories.forEach(function(instanceFactory) { // go wide
              var factoryOrConstant = instanceFactory && instanceFactory.factory ? instanceFactory.factory : instanceFactory;
              var valueRepr = instanceFactory && instanceFactory.name ?
                                instanceFactory.name :
                                parameterToName(typeof factoryOrConstant === "function" ? factoryOrConstant() : factoryOrConstant);
              partialInstanceArgFactories.push({
                argRepr: nextArg.name + ": " + valueRepr,
                factoryOrConstant: factoryOrConstant
              });
              fillTests(); // go deep
              partialInstanceArgFactories.pop();
            });
            remainingArgFactories.unshift(nextArg);
          }
        }

        fillTests();
      },

      createTypeTests: function() {
        if (this.typeCaseFactory) {
          this.typeCaseFactory.createTypeTests();
        }
        var self = this;
        self.typeTestCreator(
          self.contract.SubjectType,
          js.getAllPropertyNames(self.contract)
            .filter(function(methodName) {
              return methodName[0] === "$" &&
                     (self.contract[methodName] instanceof Array ||
                      (self.contract[methodName].nominal instanceof Array && self.contract[methodName].exceptional instanceof Array));
            }),
          lang.hitch(self, self.createMethodTests)
        );
      }


      /*
      When factories for the subjects, call it subjectFactories

      subjectFactories: function() {
        return [];
      }
      */

    });

    return CaseFactory;

  }
);

