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

define(["dojo/_base/declare", "../EnumerationValue",
        "../_util/contracts/CaseFactory", "../_contract/EnumerationValueConstructor",
        "module"],
  function(declare, EnumerationValue,
           CaseFactory, EnumerationValueConstructorContract,
           module) {

    var EnumerationValueStub1 = EnumerationValue.declare(
      {},
      ["first", "second", "third"],
      module.id + "_Stub1"
      // bundle is standard
    );

    return declare([CaseFactory], {

      contract: new EnumerationValueConstructorContract(),

      subjectFactories: function() {
        return [function() {return EnumerationValue;}];
      },

      $declare: function() {
        return [
          this.subjectFactories(),
          {
            name: "SuperType",
            canBeSkipped: true,
            factories: [
              function() {return EnumerationValueStub1;}
            ]
          },
          {
            name: "prototypeDef",
            factories: [
              undefined,
              null,
              {},
              {someProperty: "SOME PROPERTY VALUE"}
            ]
          },
          {
            name: "valueDefinitions",
            factories: [
              undefined,
              null,
              [],
              {},
              ["alpha", "beta", "gamma"],
              [
                {representation: "1", someProp: 5},
                {representation: "2", someProp: 5},
                {representation: "3", someProp: 7, someOtherProp: new Date()}
              ],
              {
                one: {representation: "1", someProp: 5},
                two: {representation: "2", someProp: 5},
                three: {representation: "3", someProp: 7, someOtherProp: new Date()}
              }
              // precondition violation ["aleph", "aleph"],
              /* precondition violation
              {
                blue: {representation: "0000FF"},
                two: {representation: "0000FF"}
              }
              */
            ]
          },
          {
            name: "mod",
            factories: [undefined, null, "", {id: "someMid"}, "aMid"]
          },
          {
            name: "bundleName",
            factories: [undefined, null, "", "ABundleName"]
          }
        ];
      }

    });

  }
);
