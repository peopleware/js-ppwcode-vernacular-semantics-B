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
        "./TrafficSignConstructorCaseFactory",
        "./TrafficSign_RegulatoryConstructorCaseFactory",
        "./TrafficSign_MandatoryCaseFactory",
        "./TrafficSign_ProhibitoryCaseFactory",
        "./TrafficSign_WarningCaseFactory",
        "./TrafficSign_DirectionCaseFactory"],
  function(doh,
           TrafficSignCaseFactory,
           TrafficSignConstructorCaseFactory,
           TrafficSign_RegulatoryConstructorCaseFactory,
           TrafficSign_MandatoryCaseFactory,
           TrafficSign_ProhibitoryCaseFactory,
           TrafficSign_WarningCaseFactory,
           TrafficSign_DirectionCaseFactory) {

    var kwargs = {methodTestCreator: doh.createMethodTest};
    new TrafficSignCaseFactory(kwargs).createTypeTests();
    new TrafficSignConstructorCaseFactory(kwargs).createTypeTests();
    new TrafficSign_RegulatoryConstructorCaseFactory(kwargs).createTypeTests();
    new TrafficSign_MandatoryCaseFactory(kwargs).createTypeTests();
    new TrafficSign_ProhibitoryCaseFactory(kwargs).createTypeTests();
    new TrafficSign_WarningCaseFactory(kwargs).createTypeTests();
    new TrafficSign_DirectionCaseFactory(kwargs).createTypeTests();
  }
);
