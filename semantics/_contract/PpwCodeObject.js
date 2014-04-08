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

define(["dojo/_base/declare", "../_util/contracts/Contract", "../_util/contracts/doh", "../PpwCodeObject"],
  function(declare, Contract, doh, PpwCodeObject) {

    return declare([Contract], {

      SubjectType: PpwCodeObject,

      $constructor: function(/*Function*/ Constructor) {
        var result = new Constructor();
        doh.t(!!result);
        doh.t(result.isInstanceOf(PpwCodeObject));
        doh.t(result.isInstanceOf(Constructor));
        doh.validateInvariants(result);
        return result;
      },

      $getTypeDescription: function(/*PpwCodeObject*/ subject) {
        var result = subject.getTypeDescription();
        doh.validateInvariants(subject);
        // postconditions
        doh.t(!!result);
        doh.is("string", typeof result);
        return result;
      },

      $toString: function(/*PpwCodeObject*/ subject) {
        var result = subject.toString();
        doh.validateInvariants(subject);
        // postconditions
        doh.is("string", typeof result);
        return result;
      }

    });

  }
);

