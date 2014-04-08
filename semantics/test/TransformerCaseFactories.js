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

define(["dojo/_base/declare", "../_util/contracts/CaseFactories", "./TransformerMethodTests"],
 function(declare, CaseFactories, TransformerMethodTests) {

   return declare([CaseFactories], {

     contract: new TransformerMethodTests(),

     // ValueType: Function
     //   Constructor (type) of the values to be formatted or parsed.
     ValueType: null,

     // valueFactories: Function[]
     valueFactories: null,

     // formatOptionsFactories: Function[]
     formatOptionsFactories: null,

     constructor: function(/*Function*/ ValueType, /*Function[]*/ valueFactories, /*Function[]*/ formatOptionsFactories) {
       this.ValueType = ValueType;
       this.valueFactories = valueFactories;
       this.formatOptionsFactories = formatOptionsFactories;
     },

     subjectFactories: function() {
       var self = this;
       return [function() {return self.ValueType;}];
     },

     $format: function() {
       return [
         this.subjectFactories(),
         {
           name: "value",
           factories: [null, undefined].concat(this.valueFactories)
         },
         this.formatOptionsFactories
       ];
     },

     $parse: function() {
       var subjectTypeFormat = this.ValueType.format;
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
           ].concat(this.valueFactories.map(function(sFactory) {
             return function() {return subjectTypeFormat(sFactory());};
           }))
         },
         this.formatOptionsFactories
       ];
     }

   });

 }
);
