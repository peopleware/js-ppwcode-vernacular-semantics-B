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

define(["../_util/contracts/createTests", "./PpwCodeObjectCaseFactory", "./ValueCaseFactory", "./EnumerationValueCaseFactory", "../_util/js"],
  function(createMethodTests, PpwCodeObjectCaseFactory, ValueCaseFactory, EnumerationValueCaseFactory, js) {

    function createTypeTests(caseFactories) {
      if (caseFactories.typeCaseFactories) {
        createTypeTests(caseFactories.typeCaseFactories);
      }
      js.getAllPropertyNames(caseFactories.contract)
        .filter(function(methodName) {
          return methodName[0] === "$" && typeof caseFactories.contract[methodName] === "function";
        })
        .forEach(function(methodName) {
          createMethodTests(caseFactories.contract, methodName.slice(1), caseFactories[methodName]());
        });
    }

    createTypeTests(new PpwCodeObjectCaseFactory());
    createTypeTests(new ValueCaseFactory());
    createTypeTests(new EnumerationValueCaseFactory());
  }
);
