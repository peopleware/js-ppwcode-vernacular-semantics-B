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
        "./TrafficSign_MANDATORYCaseFactory",
        "./TrafficSign_PROHIBITORYCaseFactory",
        "./TrafficSign_WARNINGCaseFactory",
        "./TrafficSign_DIRECTIONCaseFactory"],
  function(doh,
           TrafficSignCaseFactory,
           TrafficSign_MANDATORYCaseFactory,
           TrafficSign_PROHIBITORYCaseFactory,
           TrafficSign_WARNINGCaseFactory,
           TrafficSign_DIRECTIONCaseFactory) {

    var kwargs = {methodTestCreator: doh.createMethodTest};
    new TrafficSignCaseFactory(kwargs).createTypeTests();
    new TrafficSign_MANDATORYCaseFactory(kwargs).createTypeTests();
    new TrafficSign_PROHIBITORYCaseFactory(kwargs).createTypeTests();
    new TrafficSign_WARNINGCaseFactory(kwargs).createTypeTests();
    new TrafficSign_DIRECTIONCaseFactory(kwargs).createTypeTests();
  }
);