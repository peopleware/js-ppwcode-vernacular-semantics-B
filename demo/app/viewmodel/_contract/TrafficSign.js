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

define(["dojo/_base/declare", "ppwcode-vernacular-semantics/_contract/EnumerationValue",
        "ppwcode-vernacular-semantics/_contract/ComparableValue", "../TrafficSign"],
  function(declare, EnumerationValueContract, ComparableValueContract,
           TrafficSign) {

    return declare([EnumerationValueContract, ComparableValueContract], {

      SubjectType: TrafficSign,

      $compare: [
        function(/*TrafficSign*/ other, result) {
          return result >= 0 ||
                 (!this.filename && other.filename) ||
                 this.filename < other.filename ||
                 (this.filename === other.filename && this.toJSON() < other.toJSON());
        },
        function(/*TrafficSign*/ other, result) {
          return result <= 0 ||
                 (this.filename && !other.filename) ||
                 this.filename > other.filename ||
                 (this.filename === other.filename && this.toJSON() > other.toJSON());
        }
      ]

    });

  }
);

