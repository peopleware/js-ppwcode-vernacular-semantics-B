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

define(["dojo/_base/declare", "./TransformerCaseFactory", "../_contract/EnumerationValueType"],
 function(declare, TransformerCaseFactory, Contract) {

   return declare([TransformerCaseFactory], {

     constructor: function(kwargs) {
       this.contract = new Contract({SubjectType: kwargs.SubjectType});
     },

     jsonFactories: function() {
       return {
         name: "json",
         factories: [
           null,
           undefined,
           "",
           {
             name: "2 quotes",
             factory: "\"\""
           },
           {
             name: "valid but quoted",
             factory: "\"first\""
           },
           {
             name: "not a value",
             factory: "XX not a JSON value XX"
           },
           {
             name: "not a value, quoted",
             factory: "\"XX not a JSON value XX\""
           }
         ].concat(this.valueFactories().map(function(factoryOrConstant) {
           var value = typeof factoryOrConstant === "function" ? factoryOrConstant() : factoryOrConstant;
           return function() {return value.toJSON();};
         }))
       };
     },

     $values: function() {
       return [this.subjectFactories()];
     },

     $isJson: function() {
       return [this.subjectFactories(), this.jsonFactories()];
     },

     $revive: function() {
       return [this.subjectFactories(), this.jsonFactories()];
     },

     $getBundle: function() {
       return [
         this.subjectFactories(),
         {
           name: "lang",
           factories: [null, undefined, "", "nl", "ru"]
         }
       ]
     }

   });

 }
);
