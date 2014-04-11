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

define(["dojo/_base/declare", "ppwcode-vernacular-semantics/_contract/EnumerationValue", "../TrafficSign",
        "ppwcode-vernacular-semantics/_util/contracts/doh"],
  function(declare, EnumerationValueContract, TrafficSign, doh) {

    return declare([EnumerationValueContract], {

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
      }

    });

  }
);

