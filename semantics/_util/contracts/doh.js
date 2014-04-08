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

define(["doh/main", "dojo/_base/lang"],
  function(doh, lang) {

    var groupCache = [];
    var testCounter = 0;

    function cached(Type) {
      if (!Type) {
        return "untyped";
      }
      var index = groupCache.indexOf(Type);
      if (index < 0) {
        index = groupCache.push(Type) - 1;
      }
      return "test group " + index;
    }

    function groupId(/*Function?*/ Type) {
      if (Type && (Type.mid || Type.declaredClass || Type.name)) {
        return Type.mid || Type.declaredClass || Type.name;
      }
      return cached(Type);
    }

    console.log("Loading ppwcode contracts doh extension");

//    var InvariantViolationError = declare(null, {
//      instance: null,
//      invariant: null,
//      constructor: function(instance, invariant) {
//        this.instance = instance;
//        this.invariant = invariant;
//      }
//    });

    doh._flattenInvars = function(context, /*Array*/ a, /*Array*/ acc) {
      doh.isNot(null, context);
      doh.isNot(null, a);
      doh.t(a instanceof Array);
      doh.isNot(null, acc);
      doh.t(acc instanceof Array);

      for (var i = 0; i < a.length; i++) {
        var el = a[i];
        if (el instanceof Function) {
          acc.push({
            testMethodForPrint: el.toString(),
            testMethodInContext: lang.hitch(context, el)
          });
        }
        else {
          // we expect an object {condition: /*Function (optional)*/, objectSelector: /*Function*/, invars: /*Array*/ of /*Function*/
          if (el.hasOwnProperty("condition")) {
            var conditionResult = el.condition.call(context);
            if (conditionResult) {
              var selection = el.selector.call(context);
              if (selection instanceof Array) {
                // for all elements
                for (var j = 0; j < selection.length; j++) {
                  doh._flattenInvars(selection[j], el.invars, acc);
                }
              }
              else {
                // selection is Object
                for (var propName in selection) {
                  if (selection.hasOwnProperty(propName)) {
                    doh._flattenInvars(selection[propName], el.invars, acc);
                  }
                  //else NOP
                }
              }
            }
          }
        }
      }
    };

    doh.validateInvariants = function(subject) {
      // subject is a _Mixin IDEA check with duck typing
      doh.isNot(null, subject);
      doh.t("_c_invar" in subject);
      doh.isNot(null, subject._c_invar);
      doh.t(subject._c_invar instanceof Array);

      var invars = [];
      this._flattenInvars(subject, subject._c_invar, invars);

      for (var i = 0; i < invars.length; i++) {
        var invar = invars[i];
        doh.isNot(null, invar);
        doh.t(invar.testMethodInContext instanceof Function);

        // inject for this
        var result = invar.testMethodInContext();
        if (! result) {
          throw new doh._AssertFailure("invariant error: " + invar.testMethodForPrint + " (on " + subject.toString() + ")");
        }
      }
    };
    doh.invars = doh.validateInvariants;

    doh.assertFailure = function(/*String?*/ hint, /*Error*/ error) {
      // summary:
      //    The test failed.
      var msg = "test failed";
      if (error) {
        msg += ('" + error + "');
      }
      throw new doh._AssertFailure(msg, hint);
    };
    doh.fail = doh.assertFailure;

    doh.unexpectedException = function(/*Error*/ exc) {
      // summary:
      //    exc was encountered, and this was unexpected
      var msg = "encountered an unexpected exception";
      throw new doh._AssertFailure(msg, exc);
    };
    doh.exc = doh.unexpectedException;

    doh.createMethodTest = function(Type, methodName, testMethod, argFactories) {
      doh.register(
        groupId(Type),
        {
          argFactories: argFactories.slice(), // lock a copy in scope of this test
          name: "(" + testCounter + ") " + methodName + " - " +
                argFactories.map(function(af) {return af.argRepr;}).join("; "),
          runTest: function() {
            var self = this;
            var args = this.argFactories.map(
              function(af) {
                if (typeof af.factoryOrConstant === "function") {
                  return af.factoryOrConstant();
                }
                return af.factoryOrConstant;
              }
            );
            args = args.map(
              function(arg) {
                if (arg === "$this") {
                  return args[0];
                }
                if (arg === "$this()") {
                  return self.argFactories[0].factoryOrConstant();
                }
                var match = /^\$args\[(\d+)\](\(\))?$/.exec(arg);
                if (match) {
                  if (match.length === 3) {
                    return self.argFactories[match[1]].factoryOrConstant();
                  }
                  if (match.length === 2) {
                    return args[match[1]];
                  }
                }
                return arg;
              }
            );
            testMethod.apply(this, args);
          }
        }
      );
      testCounter++;
    };

    return doh;
  }
);
