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
        //   format: ValueType? x FormatOptions? --> String?
        //     postconditions:
        //       function(value) {return value || (result === null);},
        //       function(value) {return !value || value.equals(value.constructor.parse(result));}
        //   parse: String? x FormatOptions? --> ValueType?, ParseException
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

        _c_invar: [
          function() {return typeof this.constructor.format === "function";},
          function() {return typeof this.constructor.parse === "function";},
          function() {
            var valueOf = this.valueOf();
            var type = js.typeOf(valueOf);
            return valueOf === this || type === "date" || type === "number" || type === "string" || type === "boolean";
          },
          function() {return js.typeOf(this.getValue()) === "string";},
          function() {return js.typeOf(this.canCoerceTo()) === "array";},
          function() {return this.canCoerceTo().every(function(el) {
            return js.typeOf(el) === "function" && el.prototype.isInstanceOf(Value);
          });}
        ],

        constructor: function(/*Object*/ props) {
          this._c_pre(function() {return props /* exists and not null */;});
          this._c_pre(function() {return js.typeOf(props) === "object";});

          this._c_NOP(props);
        },

        equals: function(other) {
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

        coerceTo: function(/*Function?*/ Type) {
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
          return undefined;
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
        },

        format: function(/*FormatOptions?*/ options) {
          // summary:
          //   Shortcut for `this.constructor.format(this)`.
          //   Note that this gives dynamic binding: you will always use the format function
          //   defined for the dynamic type of this.

          return this.constructor.format(this, options);
        }

      });

      Value.mid = module.id;

      return Value;
    }
);
