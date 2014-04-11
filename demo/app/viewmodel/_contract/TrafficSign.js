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

define(["dojo/_base/declare", "ppwcode-vernacular-semantics/_contract/EnumerationValue", "ppwcode-vernacular-semantics/_contract/ComparableValue", "../TrafficSign",
        "ppwcode-vernacular-semantics/_util/contracts/doh"],
  function(declare, EnumerationValueContract, ComparableValueContract, TrafficSign, doh) {

    return declare([EnumerationValueContract, ComparableValueContract], {

      SubjectType: TrafficSign,

      $getUrl: function(/*TrafficSign*/ subject) {
        var result = subject.getUrl();
        doh.is("string", typeof result);
        if (subject.filename) {
          doh.t(result.indexOf("/" + subject.typeDir + "/" + subject.filename + ".jpg") >= 0);
        }
        else {
          doh.f(result);
        }
        return result;
      },

      $compare: function(/*TrafficSign*/ subject, /*TrafficSign*/ other) {
        var result = this.inherited(arguments);
        if (result < 0) {
          doh.t((!subject.filename && other.filename) ||
                subject.filename < other.filename ||
                (subject.filename === other.filename && subject.toJSON() < other.toJSON()));
        }
        if (result > 0) {
          doh.t((subject.filename && !other.filename) ||
                subject.filename > other.filename ||
                (subject.filename === other.filename && subject.toJSON() > other.toJSON()));
        }
        return result;
      }

    });

  }
);

