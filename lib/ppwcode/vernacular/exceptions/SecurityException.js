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

define(["dojo/_base/declare", "./SemanticException", "module"],
    function(declare, SemanticException, module) {

      var SecurityException = declare([SemanticException], {
        // summary:
        //   `SecurityExceptions` signal that an attempted action was refused because of security reasons.
        //   Most often this means the current user does not have the right to perform the attempted action.
        //   Most often these exceptions are returned from the server.
        // description:
        //   There are no extra properties in this class.

        invars: [
        ],

        constructor: function(kwargs) {
          this._c_NOP();
        }

      });

      SecurityException.mid = module.id;

      return SecurityException;
    }
);
