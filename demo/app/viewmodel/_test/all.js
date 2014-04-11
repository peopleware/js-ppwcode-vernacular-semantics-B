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

define(["ppwcode-vernacular-semantics/_util/contracts/doh",
        "./TrafficSignCaseFactory",
        "./TrafficSign_Mandatory1CaseFactory",
        "./TrafficSign_Prohibitory1CaseFactory",
        "./TrafficSign_Warning1CaseFactory",
        "./TrafficSign_Direction1CaseFactory"],
  function(doh,
           TrafficSignCaseFactory,
           TrafficSign_MandatoryCaseFactory,
           TrafficSign_ProhibitoryCaseFactory,
           TrafficSign_WarningCaseFactory,
           TrafficSign_DirectionCaseFactory) {

    var kwargs = {methodTestCreator: doh.createMethodTest};
    new TrafficSignCaseFactory(kwargs).createTypeTests();
    new TrafficSign_Mandatory1CaseFactory(kwargs).createTypeTests();
    new TrafficSign_Prohibitory1CaseFactory(kwargs).createTypeTests();
    new TrafficSign_Warning1CaseFactory(kwargs).createTypeTests();
    new TrafficSign_Direction1CaseFactory(kwargs).createTypeTests();
  }
);
