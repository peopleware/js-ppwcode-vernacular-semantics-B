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

define(["dojo/_base/declare", "../_util/contracts/doh", "../PpwCodeObject", "./ppwCodeObjectTestGenerator", "module"],
  function (declare, doh, PpwCodeObject, testGenerator, module) {

    var PpwCodeObjectStub1 = declare([PpwCodeObject], {});
    PpwCodeObjectStub1.mid = module.id + "_PpwCodeObjectStub1";

    var PpwCodeObjectStub2 = declare([PpwCodeObject], {}); // no mid



    doh.register(PpwCodeObject.mid, [
      {
        name: "Constructor test", // don't name a test "constructor"; it kills everything :-(
        runTest: function () {
          var subject = new PpwCodeObjectStub2();
          doh.validateInvariants(subject);
        }
      }
    ]);

    testGenerator(
      PpwCodeObject.mid,
      [
        function() {return new PpwCodeObjectStub1();},
        function() {return new PpwCodeObjectStub2();}
      ]
    );
  }
);
