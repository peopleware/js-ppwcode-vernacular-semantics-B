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

define(["dojo/_base/declare", "../_util/contracts/CaseFactory", "../_contract/Transformer"],
 function(declare, CaseFactory, Contract) {

   return declare([CaseFactory], {

     contract: new Contract(),

     // valueFactories: Function return Function[]
     valueFactories: null,

     // formatOptionsFactories: Function return Function[]
     formatOptionsFactories: null,

     constructor: function(kwargs) {
       this.contract = new Contract({SubjectType: kwargs.SubjectType});
     },

     $format: function() {
       return [
         this.subjectFactories(),
         {
           name: "value",
           factories: [null, undefined].concat(this.valueFactories())
         },
         this.formatOptionsFactories()
       ];
     },

     $parse: function() {
       return [
         this.subjectFactories(),
         {
           name: "str",
           factories: [
             null,
             undefined,
             "",
             {
               name: "not a value",
               factory: "XX not a formatted value XX"
             }
           ].concat(this.valueFactories().map(function(factoryOrConstant) {
             var value = typeof factoryOrConstant === "function" ? factoryOrConstant() : factoryOrConstant;
             return function() {return value.constructor.format(value);};
           }))
         },
         this.formatOptionsFactories()
       ];
     }

   });

 }
);
