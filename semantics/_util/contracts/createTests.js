/*
 Copyright 2012 - $Date $ by PeopleWare n.v.

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

define(["./doh", "dojo/_base/lang"], function (doh, lang) {

  function parameterToName(parameter) {
    if (parameter instanceof Function && parameter.prototype.getTypeDescription) {
      return parameter.prototype.getTypeDescription();
    }
    if (parameter && parameter.toString !== Object.prototype.toString) {
      return parameter.toString();
    }
    return JSON.stringify(parameter);
  }

  function createTests(tests, methodName, argumentFactories) {

    var partialInstanceArgFactories = [];
    var remainingArgFactories = argumentFactories;

    function fillTests() {
      if (remainingArgFactories.length <= 0) {
        doh.createMethodTest(tests.SubjectType, methodName, lang.hitch(tests, tests["$" + methodName]), partialInstanceArgFactories);
      }
      else {
        var nextArg = remainingArgFactories.shift();
        nextArg = {
          name: nextArg.name ||
                (partialInstanceArgFactories.length <= 0 ? "subject" : "arg" + (partialInstanceArgFactories.length - 1)),
          factories: nextArg.factories || nextArg
        };
        nextArg.factories.forEach(
          function(instanceFactory) { // go wide
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
          }
        );
        remainingArgFactories.unshift(nextArg);
      }
    }

    fillTests();
  }

  return createTests;
});
