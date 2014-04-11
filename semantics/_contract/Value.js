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

define(["dojo/_base/declare", "./PpwCodeObject", "../Value"],
  function(declare, PpwCodeObjectContract, Value) {

    return declare([PpwCodeObjectContract], {

      SubjectType: Value,

      $constructor: [
        function(/*Object*/ kwargs, result) {return result;},
        function(/*Object*/ kwargs, result) {return result.isInstanceOf;},
        function(/*Object*/ kwargs, result) {return result.isInstanceOf(Value);},
        function(/*Object*/ kwargs, result) {return result.isInstanceOf(this);}
      ],

      $equals: [
        function(other, result) {return other !== this || !!result;},
        function(other, result) {return (other && other.constructor === this.constructor) || !result;}
      ],

      // canCoerceTo is basic

      $coerceTo: [
        function(/*Function?*/ Type, result) {return !result || (result.isInstanceOf && result.isInstanceOf(Value));}
      ],

      $format: [
        function(/*FormatOptions?*/ options, result) {return result === this.constructor.format(this, options);}
      ]

    });

  }
);

