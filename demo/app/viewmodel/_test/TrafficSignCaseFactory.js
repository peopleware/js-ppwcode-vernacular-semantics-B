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

define(["dojo/_base/declare", "ppwcode-vernacular-semantics/_test/EnumerationValueCaseFactory", "ppwcode-vernacular-semantics/_test/ComparableValueCaseFactory",
        "../_contract/TrafficSign", "ppwcode-vernacular-semantics/EnumerationValue", "../TrafficSign",
       "module"],
  function(declare, EnumerationValueCaseFactory, ComparableValueCaseFactory, Contract, EnumerationValue, TrafficSign, module) {

    var TrafficSignStub = EnumerationValue.declare(
      TrafficSign,
      {
        typeDir: "DIR_NAME"
      },
      [
        {representation: "repr", filename: "reprFILENAME"}
      ],
      module.id + "_Stub1"
    );

    return declare([ComparableValueCaseFactory, EnumerationValueCaseFactory], { // order of inheritance is important to get the methods of Comparable...

      contract: new Contract(),

      typeSubjectFactories: function() {
        return [function() {return TrafficSignStub;}];
      },

      subjectFactories: function() {
        return TrafficSignStub.values();
      },

      $getUrl: function() {
        return [
          this.subjectFactories()
        ];
      }

    });

  }
);
