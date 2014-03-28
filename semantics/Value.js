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

define(["dojo/_base/declare", "./PpwCodeObject", "./_util/contracts/_Mixin",
        "./_util/js", "module"],
    function(declare, PpwCodeObject, _ContractMixin,
             js, module) {

      var Value = declare([PpwCodeObject, _ContractMixin], {
        // summary:
        //   Values are immutable after construction.
        //   They are constructed with a kwargs argument.
        //   For JSON-inification, toString, typeDescription, see PpwCodeObject.
        // description:
        //   Constructors of concrete types should have a property format
        //   and parse, that are functions that can format (turn into a user-oriented
        //   string) instances of that type, and parse strings into instances
        //   of that type.
        //   format: ValueType? x Options? --> String?
        //     postconditions:
        //       function(value) {return value || (result === null);},
        //       function(value) {return !value || value.equals(value.constructor.parse(result));}
        //   parse: String? x Options? --> ValueType?, ParseException
        //     postconditions:
        //       function(str) {return str || (str === "") || (result === null);}
        //     exceptionConditions:
        //       function(str) {return str || str === "";}
        //
        //   This way, the constructor can be passed to at.transform directly.
        //   The format function should return null for the null-value. This is the only
        //   possible general outcome, because some subtype might format a regular value
        //   as "". The parser would not be able to discern the two.

        // IDEA add options.na handling
        // IDEA add format as instance method; this is certainly needed on the constructor for at,
        //      but it would be handy nevertheless. Then the choice of formatting is dynamic!

        _c_invar: [
          function() {return typeof this.constructor.format === "function";},
          function() {return typeof this.constructor.parse === "function";},
          function() {
            var valueOf = this.valueOf();
            var type = js.typeOf(valueOf);
            return valueOf === this || type === "date" || type === "number" || type === "string" || type === "boolean";
          },
          function() {return js.typeOf(this.getValue()) === "string"},
          function() {return js.typeOf(this.canCoerceTo()) === "array"},
          function() {return this.canCoerceTo().every(function(el) {
            return js.typeOf(el) === "function" && el.prototype.isInstanceOf(Value);
          })}
        ],

        constructor: function(/*Object*/ props) {
          this._c_pre(function() {return props /* exists and not null */;});
          this._c_pre(function() {return js.typeOf(props) === "object";});

          this._c_NOP(props);
        },

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
        },

        equals: function(/*Value*/ other) {
          // summary:
          // description:
          //   Must be overriden in subtypes with the pattern:
          //   | return this.inherited(arguments) && (EXTRA CONDITIONS);
          //   This implementation checks whether other is null.
          //
          //   This method is also used by dojox/mvc/sync! There can be no preconditions!
          // tags:
          //   public extension

          // Note: not a good candidate for chaining: look at what the overrider should write (it is the same)

          // we force to actually return a Boolean (!!)

          return !!(other && // return boolean
                    other.constructor &&
                    (other.constructor === this.constructor)); // same type;
        },

        valueOf: function() {
          // summary:
          //   Convert a value instance to a primitive value, if possible. Otherwise, return `this`.
          //   Also see `coerceTo`.
          // description:
          //   The default implementation returns `this`. Subclasses should override if it makes sense.

          return this.inherited(arguments);
        },

        getValue: function() {
          // summary:
          //   Deprecated. Use `format`, `valueOf`, `toString` or `toJSON` (via `JSON.stringify`).
          //   Return a string-representation of this value.
          this._c_ABSTRACT();

          return null; // return object
        },

        canCoerceTo: function() {
          // summary:
          //   Array of the types this can coerceTo. Types to which we coerce with more
          //   of our information intact should come earlier than types to which we coerce
          //   with more loss of information.

          return [this.constructor];
        },

        coerceTo: function(/*Function*/ Type) {
          // summary:
          //   Try to return a value of Type, that is similar to this.
          //   It might contain less information.
          //   If this is not possible, returns undefined.
          //   The default implementation returns this only for its exact type, and undefined otherwise.

          function coercionChain(FromType) {
            if (FromType.prototype.canCoerceTo().indexOf(Type) >= 0) {
              return [Type];
            }
            // else, maybe one of the types FromType can coerce to, can itself coerce to Type
            var FromFromTypes = FromType.prototype.canCoerceTo();
            var FromFromType = FromFromTypes.shift();
            while (FromFromType) {
              if (FromFromType !== FromType) { // otherwise we have an infinite loop
                var partialChain = coercionChain(FromFromType);
                if (partialChain) { // we have a solution
                  partialChain.shift(FromFromType);
                  return partialChain;
                }
              }
              FromFromType = FromFromTypes.shift();
            }
            // we have no solution
            return undefined;
          }

          var chain = coercionChain(this.constructor);
          if (chain) {
            return chain.reduce(
              function(acc, ToType) {
                return acc._coerceTo(ToType);
              },
              this
            );
          }
          else {
            return undefined;
          }
        },

        _coerceTo: function(/*Function*/ Type) {
            // summary:
            //   Try to return a value of Type, that is similar to this.
            //   It might contain less information. NEVER coerce to a Type that requires more information,
            //   e.g., by using a default for the missing information. This will result in module dependency
            //   cycles!
            //   If this is not possible, return undefined.
            //   The default implementation returns this only for its exact type, and undefined otherwise.

          if (Type === this.constructor) {
            return this;
          }
          return undefined;
        }

      });

      Value.mid = module.id;

      return Value;
    }
);
