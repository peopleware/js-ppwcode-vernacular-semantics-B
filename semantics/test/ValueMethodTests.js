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

define(["dojo/_base/declare", "./PpwCodeObjectMethodTests", "../_util/contracts/doh", "../Value"],
  function(declare, PpwCodeObjectMethodTests, doh, Value) {

    return declare([PpwCodeObjectMethodTests], {

      SubjectType: Value,

      compare: function(/*Value*/ subject, /*Value*/ other) {
        var result = subject.compare(other);
        doh.validateInvariants(subject);
        doh.validateInvariants(other);
        doh.is("number", typeof result);
        if (result === 0) {
          doh.t(subject.equals(other));
        }
        var otherResult = other.compare(subject);
        doh.validateInvariants(subject);
        doh.validateInvariants(other);
        doh.is(-1 * (result / Math.abs(result)), otherResult / Math.abs(otherResult));
      },

      equals: function(/*Value*/ subject, other) {
        var result = !!subject.equals(other);
        doh.validateInvariants(subject);
        if (other && other.isInstanceOf && other.isInstanceOf(Value)) {
          doh.validateInvariants(other);
        }
        // postconditions
        if (subject === other) {
          doh.t(result);
        }
        if (!other) {
          doh.f(result);
        }
        else if (other.constructor !== subject.constructor) {
          doh.f(result);
        }
      },

      valueOf: function(/*Value*/ subject) {
      },

      getValue: function(/*Value*/ subject) {

      },

      // canCoerceTo is basic

      coerceTo: function(/*Value*/ subject, /*Function?*/ Type) {
        var result = subject.coerceTo(Type);
        doh.validateInvariants(subject);
        if (result && result.isInstanceOf && result.isInstanceOf(Value)) {
          doh.validateInvariants(result);
        }
      },

      format: function(/*Value*/ subject, /*FormatOptions?*/ options) {
        var result = subject.format(options);
        doh.validateInvariants(subject);
        var expected = subject.constructor.format(subject, options);
        doh.is(expected, result);
      }

    });

  }
);

