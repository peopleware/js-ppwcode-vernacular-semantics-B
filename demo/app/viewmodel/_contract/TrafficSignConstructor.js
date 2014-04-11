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

define(["dojo/_base/declare", "ppwcode-vernacular-semantics/_util/contracts/Contract", "../TrafficSign"],
  function(declare, Contract, TrafficSign) {

    return declare([Contract], {

      SubjectType: TrafficSign,

      // values is a basic inspector, but we check the sync with the type as object here
      $allValues: [
        function(result) {return result instanceof Array;},
        function(result) {return result.every(function(ts) {return ts && ts.isInstanceOf && ts.isInstanceOf(this);}, this);},
        function(result) {
          return result.every(
            function(ts) {return this.concreteSubTypes.some(function(TsType) {return ts.valueOf(TsType);});},
            this
          );
        },
        function(result) {
          return this.concreteSubTypes.every(function(TsType) {
            return TsType.values().every(function(ts) {return result.indexOf(ts) >= 0;});
          });
        }
      ]

    });

  }
);

