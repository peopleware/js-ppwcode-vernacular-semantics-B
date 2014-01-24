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

      var CompoundSemanticException = declare([SemanticException], {
        // summary:
        //   Aggregate of zero or more `SemanticExceptions`, that signals that the issues reported by each child
        //   separately occur together.
        // description:
        //   Children can be of any subtype of SemanticException. If they are, e.g., PropertyExceptions, they
        //   can each report on an issue of a different property, or the same, of a different object (sender)
        //   or the same.
        //   The list of children is flat. If another CompoundSemanticException is added, its children are
        //   added, and not the CompoundSemanticException itself.
        //   A CompoundSemanticException can be closed or not closed. Once it is closed, it cannot un-close again.
        //   No more children can be added to a closed instance. Closing the instance means in essence that the instance
        //   is made immutable. Only closed instances may be thrown.

        invars: [
          function() {return this.children;},
          function() {return typeof this.children === "array";},
          function() {return typeof this.children.every(function(c) {return c;});}
          // TODO no duplicates
        ],

        // children: SemanticException[]
        children: [],

        closed: false,

        constructor: function() {
          this.children = [];
        },

        add: function(/*SemanticException?*/ se) {
          var self = this;
          if (se && !self.closed) {
            if (se.isInstanceOf(CompoundSemanticException)) {
              /*CompoundSemanticException*/ se.children.forEach(function(c) {
                self.add(c);
              });
            }
            else if (self.children.every(function(c) {return !c.like(se);})) {
              self.children.push(se);
            }
          }
        },

        close: function() {
          this.closed = true;
        },

        isEmpty: function() {
          return this.children.length <= 0;
        },

        like: function(/*CompoundSemanticException*/ other) {
          var self = this;
          return self.inherited(arguments) &&
                 other.isInstanceOf(CompoundSemanticException) &&
                 self.children.every(function(tc) {return other.children.some(function(oc) {return tc.like(oc);});}) &&
                 other.children.every(function(oc) {return self.children.some(function(tc) {return oc.like(tc);});});
        },

        toString: function() {
          return "CompoundSemanticException [" + this.children.join(", ") + "]";
        }

        // IDEA need JSON?
      });

      // summary:
      //   A string that can be used, if you wish, as the message to signal that
      //   the property is mandatory, but was not filled out.
      CompoundSemanticException.MANDATORY = "MANDATORY";

      return CompoundSemanticException;
    }
);
