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

define(["dojo/_base/declare", "./Value", "../ComparableValue"],
  function(declare, ValueContract, ComparableValue) {

    return declare([ValueContract], {

      SubjectType: ComparableValue,

      $compare: [
        function(/*Value*/ other, result) {return typeof result === "number";},
        function(/*Value*/ other, result) {return result !== 0 || this.equals(other);},
        function(/*Value*/ other, result) {
          var inverse = other.compare(this);
          return result === 0 ? (inverse === 0) : ((result < 0) === (inverse > 0));
        }
      ]

    });

  }
);

