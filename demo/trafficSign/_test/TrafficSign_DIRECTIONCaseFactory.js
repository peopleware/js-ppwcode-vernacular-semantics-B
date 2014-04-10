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

define(["dojo/_base/declare", "./TrafficSignCaseFactory", "../_contract/TrafficSign_DIRECTION"],
  function(declare, TrafficSignCaseFactory, Contract) {

    return declare([TrafficSignCaseFactory], {

      contract: new Contract(),

      typeSubjectFactories: function() {
        var SubjectType = this.contract.SubjectType;
        return [function() {return SubjectType;}];
      },

      subjectFactories: function() {
        return this.contract.SubjectType.values();
      }

    });

  }
);
