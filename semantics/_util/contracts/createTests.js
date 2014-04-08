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

define(["./doh"], function (doh) {

  var groupCounter = 0;

  function groupId(/*MethodTests*/ tests) {
    groupCounter++;
    return tests.Type.mid || tests.Type.prototype.declaredClass || ("test group " + groupCounter);
  }

  function parameterToName(parameter) {
    if (parameter instanceof Function && parameter.prototype.getTypeDescription) {
      return parameter.prototype.getTypeDescription();
    }
    if (parameter && parameter.toString !== Object.prototype.toString) {
      return parameter.toString();
    }
    return JSON.stringify(parameter);
  }

  var counter = 1;

  function createTests(tests, methodName, argumentFactories) {

    var partialInstanceArgFactories = [];
    var remainingArgFactories = argumentFactories;

    function fillTests() {
      if (remainingArgFactories.length <= 0) {
        doh.register(
          groupId(tests), {
            argFactories: partialInstanceArgFactories.slice(), // lock a copy in scope of this test
            name: "(" + counter + ") " + methodName + " - " +
                  partialInstanceArgFactories.map(function(af) {return af.argRepr;}).join("; "),
            runTest: function() {
              var self = this;
              var args = this.argFactories.map(
                function(af) {
                  if (typeof af.factoryOrConstant === "function") {
                    return af.factoryOrConstant();
                  }
                  return af.factoryOrConstant;
                }
              );
              args = args.map(
                function(arg) {
                  if (arg === "$this") {
                    return args[0];
                  }
                  if (arg === "$this()") {
                    return self.argFactories[0].factoryOrConstant();
                  }
                  var match = /^\$args\[(\d+)\](\(\))?$/.exec(arg);
                  if (match) {
                    if (match.length === 3) {
                      return self.argFactories[match[1]].factoryOrConstant();
                    }
                    if (match.length === 2) {
                      return args[match[1]];
                    }
                  }
                  return arg;
                }
              );
              tests[methodName].apply(tests, args);
            }
          }
        );
        counter++;
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
