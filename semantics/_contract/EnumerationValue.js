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

define(["dojo/_base/declare", "./Value", "../EnumerationValue"],
  function(declare, ValueContract, EnumerationValue) {

    return declare([ValueContract], {

      SubjectType: EnumerationValue,

      $isValueOf: [
        function(/*Object*/ EnumDef, result) {return typeof result === "boolean";},
        function(/*Object*/ EnumDef, result) {
          return result === (EnumDef.values ?
                             (EnumDef.values().indexOf(this) >= 0) :
                             Object.keys(EnumDef).some(function(k) {return EnumDef[k] === this;}, this));
        }
      ],

      $equals: [
        function(other, result) {return result === (this === other);}
      ],

      $getLabel: [
        function(options, result) {return typeof result === "string";}
      ]

   });

  }
);

