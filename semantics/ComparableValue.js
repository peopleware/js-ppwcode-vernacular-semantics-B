/*
 Copyright 2012 - $Date $ by PeopleWare n.v.

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

define(["dojo/_base/declare", "./Value","module"],
    function(declare, Value, module) {

      var ComparableValue = declare([Value], {
        // summary:
        //   ComparableValues have a compare method. Natural order is not sensible in most cases,
        //   but it is for values. The order defined by compare must be complete.

        _c_invar: [
        ],

        compare: function(/*Value*/ other) {
          // summary:
          //   Return a negative number if `this` is considered smaller than `other`.
          //   Return a positive number if `this` is considered larger than `other`.
          //   return 0 if `this.equals(other)`.
          // description:
          //   This method should return consistent results: given a `this` and an `other`,
          //   it should return the same result whenever the method is called, during
          //   the entire lifetime of the object.
          //   This extra requirement can be asked of Values, since they are immutable.
          //   This method should realize a total order: it should be complete,
          //   transitive, and anti-symmetric.
          //   For any `one` and `other` of the same type, it must always be true that
          //   `one.compare(other) === -other.compare(one)`.
          //
          //   `other` must be of the same type as `this`. `other` cannot be `null` or `undefined`.
          //   We could devise a semantics for comparison with `null` or `undefined`, considering them
          //   either the smallest or largest element of any type. There is however no sound reason to
          //   choose one option over the other. In practice, sometimes we need null-elements last, sometimes
          //   we need null-elements first. Furthermore, we cannot uphold the above requirement,
          //   since `null` nor `undefined` can be used as the left-side when calling `compare`.
          //   "Wovon man nicht sprechen kann, darüber mu§ man schweigen."
          //   (http://en.wikisource.org/wiki/Tractatus_Logico-Philosophicus/7): the only sensible option
          //   is to let this to the user, when needed.
          //
          //   The idiom to express `this # other` is `this.compare(other) # 0`, with
          //   # either <, =, or >.
          //
          //   When you need to add a semantics for `null` being first, e.g., you might wrap this method

          //   function nullCompare(one, other) {
          //     return one === null ?
          //        (other === null ? 0 : -1) :
          //        (other === null ? +1 : one.compare(other));
          //   }
          // tags:
          //   public extension
          this._c_pre(function() {return other && other.isInstanceOf && other.isInstanceOf(this.constructor);});

          return this._c_ABSTRACT(); // return Number
        }

      });

      ComparableValue.mid = module.id;

      return ComparableValue;
    }
);
