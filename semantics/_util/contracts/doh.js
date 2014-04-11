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

    console.log("Loading ppwcode contracts doh extension");

    doh._flattenConditions = function(context, args, /*Array*/ a, /*Array*/ acc) {
      doh.isNot(null, context);
      doh.isNot(null, a);
      doh.t(a instanceof Array);
      doh.isNot(null, acc);
      doh.t(acc instanceof Array);

      function forAllElementsOf(forAllCondition) {
        var conditionResult = forAllCondition.condition.call(context);
        if (conditionResult) {
          var selection = forAllCondition.selector.call(context);
          if (selection instanceof Array) {
            selection.forEach(
              function(el) {
                doh._flattenConditions(el, args, forAllCondition.invars, acc);
              }
            );
          }
          else {
            // selection is Object
            var propName;
            for (propName in selection) {
              if (selection.hasOwnProperty(propName)) {
                doh._flattenConditions(selection[propName], args, forAllCondition.invars, acc);
              }
              //else NOP
            }
          }
        }
      }

      a.forEach(function(el) {
        if (el instanceof Function) {
          acc.push({
                     testMethodForPrint: el.toString(),
                     testMethodInContext: function() {
                       var conditionResult = el.apply(context, args);
                       return conditionResult;
                     }
                   });
        }
        else {
          // we expect an object {condition: /*Function (optional)*/, selector: /*Function*/, invars: /*Array*/ of /*Function*/
          if (el.hasOwnProperty("condition")) {
            forAllElementsOf(el);
          }
        }
      });
    };

    doh.validateConditions = function(subject, conditions, args, outcome) {
      doh.isNot(null, subject);
      doh.isNot(null, conditions);
      doh.t(conditions instanceof Array);

      var flattenedConditions = [];
      this._flattenConditions(subject, (args ||[]).concat([outcome]), conditions, flattenedConditions);

      flattenedConditions.forEach(function(condition) {
        doh.isNot(null, condition);
        doh.t(condition.testMethodInContext instanceof Function);

        var result = condition.testMethodInContext();
        if (!result) {
          throw new doh._AssertFailure("contract error: " + condition.testMethodForPrint + " (on " + subject.toString() + ")");
        }
      });
    };


    function gatherInvariants(subject) {
      return subject.constructor._meta.bases.reduceRight(
        function(acc, base) {
          var definition = base.prototype.hasOwnProperty("_c_invar") && base.prototype._c_invar;
          if (definition) {
            Array.prototype.push.apply(acc, definition);
          }
          return acc;
        },
        []
      );
    }

    doh.validateInvariants = function(subject) {
      // subject is a _Mixin IDEA check with duck typing
      doh.isNot(null, subject);
      doh.t("_c_invar" in subject);
      doh.isNot(null, subject._c_invar);
      doh.t(subject._c_invar instanceof Array);

      doh.validateConditions(subject, gatherInvariants(subject));
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


    var Test = function(kwargs) {
      lang.mixin(this, kwargs);
    };
    Test.prototype = {

      // methodName: String
      methodName: null,

      // name: String
      name: null,

      argFactories: null, // lock a copy in scope of this test

      // nominalPostConditions: Function[]
      nominalPostConditions: null,

      // exceptionalPostConditions: Function[]?
      exceptionalPostConditions: null,

      instantiateArguments: function() {

        function argInstance(argFactoryOrConstant) {
          if (typeof argFactoryOrConstant.factoryOrConstant === "function") {
            return argFactoryOrConstant.factoryOrConstant();
          }
          return argFactoryOrConstant.factoryOrConstant;
        }

        var self = this;
        var args = self.argFactories.map(argInstance);
        args = args.map(function(arg) {
          if (arg === "$this") {
            return args[0];
          }
          if (arg === "$this()") {
            return argInstance(self.argFactories[0]);
          }
          var match = /^\$args\[(\d+)\](\(\))?$/.exec(arg);
          if (match) {
            if (match.length === 3) {
              return argInstance(self.argFactories[match[1]]);
            }
            if (match.length === 2) {
              return args[match[1]];
            }
          }
          return arg;
        });
        return args;
      },

      runTest: function() {
        var args = this.instantiateArguments();
        var subject = args[0];
        var trueArgs = args.slice(1);
        var result;
        try {
          if (typeof subject === "function" && this.methodName === "constructor") {
            // "apply" of a constructor
            var ApplyConstructor = function() {
              subject.apply(this, trueArgs);
            };
            ApplyConstructor.prototype = subject.prototype;
            result = new ApplyConstructor();
          }
          else {
            result = subject[this.methodName].apply(subject, trueArgs);
          }
        }
        catch (exc) {
          var applicableConditions = this.exceptionalPostConditions && this.exceptionalPostConditions.filter(function(c) {
            return c.exception.call(null, exc);
          });
          if (!applicableConditions || applicableConditions.length <= 0) {
            doh.unexpectedException(exc); // throw
          }
          var conditions = applicableConditions.reduce(
            function(acc, c) {
              Array.prototype.push.apply(acc, c.conditions);
              return acc;
            },
            []
          );
          doh.validateConditions(subject, conditions, trueArgs, exc);
          return;
        }
        if (subject._c_invar) {
          doh.validateInvariants(subject);
        }
        if (result && result._c_invar) {
          doh.validateInvariants(result);
        }
        trueArgs.forEach(function(arg) {
          if (arg && arg._c_invar) {
            doh.validateInvariants(arg);
          }
        });
        doh.validateConditions(subject, this.nominalPostConditions, trueArgs, result);
      }

    };

    var groupCache = [];

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

    var testCounter = 0;

    doh.createMethodTest = function(Type, methodName, postConditions, argFactories) {

      if (argFactories.length > 0) {
        doh.register(
          groupId(Type),
          new Test({
            methodName: methodName,
            name: "(" + testCounter + ") " + methodName + " - " +
                  argFactories.map(function(af) {return af.argRepr;}).join("; "),
            argFactories: argFactories.slice(), // lock a copy in scope of this test
            nominalPostConditions: postConditions.nominal,
            exceptionalPostConditions: postConditions.exceptional
          })
        );
        testCounter++;
      }
    };

    return doh;
  }
);
