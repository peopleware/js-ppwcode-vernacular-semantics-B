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

define(["dojo/_base/declare", "./SemanticException"],
    function(declare, SemanticException) {

      var PropertyException = declare([SemanticException], {
        // summary:
        //   `PropertyExceptions` are exceptions that carry with them information about the property for
        //   which they occurred. They are usually thrown by a property setter during validation.
        // description:
        //   A `PropertyException` reports on an issue with one object. If there is a need to communicate
        //   an issue over more than one issue, use a `CompoundSemanticException`.
        //
        //   Specific property exception subtypes will make these advises binding in most cases.
        //
        //   Supertype for exceptions related to semantics: the nominal effect of a method could
        //   not be reached, because doing so under the given circumstances would violate semantics
        //   (often type invariants).

        invars: [
          function() {return this.senderType;},
          function() {return !this.sender ||
            (this.sender.isInstanceOf ? this.sender.isInstanceOf(this.senderType) : this.sender instanceof this.senderType);}
        ],

        constructor: function(kwargs) {
          this._c_pre(function() {return kwargs;});
          this._c_pre(function() {return kwargs.sender || kwargs.senderType;});

          if (kwargs.sender) {
            this.sender = kwargs.sender;
            if (! kwargs.senderType) {
              this.senderType = Object.getPrototypeOf(this.sender).constructor;
            }
          }
          if (kwargs.senderType) {
            this.senderType = kwargs.senderType;
          }
          if (kwargs.propertyName) {
            this.propertyName = kwargs.propertyName;
          }
        },

        // summary:
        //   `Sender` should not be `null`, except when the exception is thrown during construction of
        //   an object, that could not be completed. Carrying the reference to the object would expose
        //   an incompletely initialized object, as the exception signals a failure to complete the
        //   initialization.
        sender: null,

        // summary:
        //   `senderType` is never null, and expresses the type of the `sender`.
        senderType: null,

        // summary:
        //   If the `propertyName is `null`, it means that the exception could not be attributed to a
        //   specific property of `sender`.
        propertyName: null,

        like: function(/*PropertyException*/ other) {
          return this.inherited(arguments) &&
            this.sender === other.sender &&
            this.senderType === other.senderType &&
            this.propertyName === other.propertyName;
        },

        toString: function() {
          var result = "PropertyException (";
          if (this.sender != null) {
            result += "sender: " + this.sender;
          }
          else {
            result += "senderType: " + this.senderType;
          }
          result += ", property: " + this.propertyName;
          return result + ")";
        }

        // IDEA need JSON?
      });

      // summary:
      //   A string that can be used, if you wish, as the message to signal that
      //   the property is mandatory, but was not filled out.
      PropertyException.MANDATORY = "MANDATORY";

      return PropertyException;
    }
);
