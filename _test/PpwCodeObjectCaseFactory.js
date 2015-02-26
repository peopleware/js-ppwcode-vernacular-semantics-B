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

define(["dojo/_base/declare", "../_util/contracts/CaseFactory", "../_contract/PpwCodeObject", "module"],
 function(declare, CaseFactory, PpwCodeObjectContract, module) {

   var PpwCodeObjectStub1 = declare([PpwCodeObjectContract.prototype.SubjectType], {});
   PpwCodeObjectStub1.mid = module.id + "_PpwCodeObjectStub1";

   var PpwCodeObjectStub2 = declare([PpwCodeObjectContract.prototype.SubjectType], {}); // no mid

   return declare([CaseFactory], {

     contract: new PpwCodeObjectContract(),

     subjectFactories: function() {
       return [
         function() {return new PpwCodeObjectStub1();},
         function() {return new PpwCodeObjectStub2();}
       ];
     },

     $constructor: function() {
       return [
         [
           function() {return PpwCodeObjectStub1;},
           function() {return PpwCodeObjectStub2;}
         ]
       ];
     }

   });

 }
);
