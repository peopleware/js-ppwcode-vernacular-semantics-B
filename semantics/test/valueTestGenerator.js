define(
  ["../_util/contracts/doh", "../Value", "./ppwCodeObjectTestGenerator", "../_exceptions/SemanticException"],
  function(doh, Value, ppwCodeObjectTestGenerator, ParseException) {

    var instanceTests = {

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

      equals: function(/*Value*/ subject, other, /*Boolean?*/ expectEquals) {
        var result = subject.equals(other);
        doh.validateInvariants(subject);
        if (other && other.isInstanceOf && other.isInstanceOf(Value)) {
          doh.validateInvariants(other);
        }
        // postconditions
        // we expect not equal, unless it is said it should be
        doh.is(result, !!expectEquals);
      },

      valueOf: function(/*Value*/ subject) {
      },

      getValue: function(/*Value*/ subject) {

      },

      // canCoerceTo is basic

      coerceTo: function(/*Value*/ subject, /*Function?*/ Type, expectedResult) {
        var result = subject.coerceTo(Type);
        doh.validateInvariants(subject);
        if (result && result.isInstanceOf && result.isInstanceOf(Value)) {
          doh.validateInvariants(result);
        }
        doh.assertEqual(result, expectedResult);
      },

      format: function(/*Value*/ subject, /*FormatOptions?*/ options) {
        var result = subject.format(options);
        doh.validateInvariants(subject);
        var expected = subject.constructor.format(subject, options);
        doh.is(expected, result);
      }

    };

    var constructorTests = {

      format: function(/*Function*/ ValueType, /*Value?*/ value, /*Object?*/ options) {
        var result = ValueType.format(value, options);
        if (!value) {
          doh.is(null, result);
        }
        else {
          doh.validateInvariants(value);
          doh.is("string", typeof result);
          doh.t(value.equals(value.constructor.parse(result, options)));
        }
      },

      parse: function(/*Function*/ ValueType, /*String?*/ str, /*Object?*/ expected, /*Object?*/ options) {
        try {
          var result = ValueType.parse(str, options);
          if (!str && str !== "") {
            doh.is(null, result);
          }
          else {
            doh.t(result);
            doh.t(result.isInstanceOf(ValueType));
            doh.validateInvariants(result);
          }
        }
        catch (exc) {
          doh.t(exc.isInstanceOf && exc.isInstanceOf(ParseException));
          doh.t(!!str || str === "");
        }
      }

    };

    function parameterToName(parameter) {
      if (parameter instanceof Function && parameter.prototype.getTypeDescription) {
        return parameter.prototype.getTypeDescription();
      }
      if (parameter && parameter.toString !== Object.prototype.toString) {
        return parameter.toString();
      }
      return JSON.stringify(parameter);
    }

    var testGenerator = function(createSubject,
                                 createSubjectSameTypeOtherDataLarger,
                                 createSubjectOtherTypeSameDataNoMid) {

      var ValueType = createSubject().constructor;

      function createTests(tests, methodName, argumentFactories) {

        var acc = [];
        var partialInstanceArgFactories = [];
        var remainingArgFactories = argumentFactories;

        function fillTests() {
          if (remainingArgFactories.length <= 0) {
            acc.push({
              argFactories: partialInstanceArgFactories.slice(), // lock a copy in scope of this test
              name: methodName + " - " + partialInstanceArgFactories.map(function(af) {return af.argRepr;}).join("; "),
              runTest: function() {
                var args = this.argFactories.map(function(af) {
                  return typeof af.factoryOrConstant === "function" ? af.factoryOrConstant() : af.factoryOrConstant;
                });
                tests[methodName].apply(tests, args);
              }
            });
          }
          else {
            var nextArg = remainingArgFactories.shift();
            nextArg = {
              name: nextArg.name ||
                      (partialInstanceArgFactories.length <= 0 ? "subject" : "arg" + (partialInstanceArgFactories.length - 1)),
              factories: nextArg.factories || nextArg
            };
            nextArg.factories.forEach(function(instanceFactory) { // go wide
              var factoryOrConstant = instanceFactory && instanceFactory.factory ? instanceFactory.factory : instanceFactory;
              var valueRepr = instanceFactory && instanceFactory.name ?
                                instanceFactory.name :
                                parameterToName(typeof factoryOrConstant === "function" ? factoryOrConstant() : factoryOrConstant);
              partialInstanceArgFactories.push({argRepr: nextArg.name + ": " + valueRepr, factoryOrConstant: factoryOrConstant});
              fillTests(); // go deep
              partialInstanceArgFactories.pop();
            });
            remainingArgFactories.unshift(nextArg);
          }
        }

        fillTests();
        return acc;
      }

      var tests = ppwCodeObjectTestGenerator(createSubject, createSubjectOtherTypeSameDataNoMid)
        .concat([
          {
            name: "has a format",
            runTest: function() {
              var instance = createSubject();
              var Subject = instance.constructor;
              doh.is("function", typeof Subject.format);
            }
          },
          {
            name: "has a parse",
            runTest: function() {
              var instance = createSubject();
              var Subject = instance.constructor;
              doh.is("function", typeof Subject.parse);
            }
          }
        ])
        .concat(createTests(
          constructorTests,
          "format",
          [
            [function() {return ValueType;}], // subject factories
            {name: "value", factories: [null, undefined, createSubject]},
            {name: "options", factories: [
              null,
              undefined,
              function() {return {locale: "nl"};},
              {
                name: "options.locale === ru --> fallback language",
                factory: function() {return {locale: "ru"};}
              }
            ]}
          ]
        ))
        .concat(createTests(
          constructorTests,
          "parse",
          [
            [function() {return ValueType;}], // subject factories
            {name: "value", factories: [
              null,
              undefined,
              "",
              {
                name: "a value",
                factory: function() {return ValueType.format(createSubject());}
              },
              {
                name: "not a value",
                factory: "XX not a formatted value XX"
              }
            ]},
            {name: "options", factories: [
              null,
              undefined,
              function() {return {locale: "nl"};},
              {
                name: "options.lang === ru --> fallback language",
                factory: function() {return {locale: "ru"};}
              }
            ]}
          ]
        ))
        .concat(createTests(
                  instanceTests,
                  "compare",
                  [
                    [createSubject, createSubjectSameTypeOtherDataLarger], // subject factories
                    {name: "other", factories: [
                      {
                        name: "large",
                        factory: createSubjectSameTypeOtherDataLarger
                      },
                      {
                        name: "small",
                        factory: createSubject
                      }
                    ]},
                    {name: "options", factories: [
                      null,
                      undefined,
                      function() {return {locale: "nl"};},
                      {
                        name: "options.lang === ru --> fallback language",
                        factory: function() {return {locale: "ru"};}
                      }
                    ]}
                  ]
                ))
        .concat([
          {
            name: "equals with null",
            runTest: function() {
              var subject = createSubject();
              instanceTests.equals(subject, null);
            }
          },
          {
            name: "equals with undefined",
            runTest: function() {
              var subject = createSubject();
              instanceTests.equals(subject, undefined);
            }
          },
          {
            name: "equals with me",
            runTest: function() {
              var subject = createSubject();
              instanceTests.equals(subject, subject, true);
            }
          },
          {
            name: "equals with object of same type, expect equals",
            runTest: function() {
              var subject = createSubject();
              var other = createSubject();
              instanceTests.equals(subject, other, true);
            }
          },
          {
            name: "equals with object of same type, expect not equals",
            runTest: function() {
              var subject = createSubject();
              var other = createSubjectSameTypeOtherDataLarger();
              instanceTests.equals(subject, other);
            }
          },
          {
            name: "equals with object of other type",
            runTest: function() {
              var subject = createSubject();
              var other = createSubjectOtherTypeSameDataNoMid();
              instanceTests.equals(subject, other);
            }
          },
          {
            name: "equals with not-a-value Number",
            runTest: function() {
              var subject = createSubject();
              instanceTests.equals(subject, 4, false);
            }
          },
          {
            name: "equals with not-a-value String",
            runTest: function() {
              var subject = createSubject();
              instanceTests.equals(subject, "TEST");
            }
          },
          {
            name: "equals with not-a-value Date",
            runTest: function() {
              var subject = createSubject();
              instanceTests.equals(subject, new Date());
            }
          },
          {
            name: "equals with not-a-value Function",
            runTest: function() {
              var subject = createSubject();
              instanceTests.equals(subject, window.open);
            }
          },
          {
            name: "equals with not-a-value object",
            runTest: function() {
              var subject = createSubject();
              instanceTests.equals(subject, window);
            }
          },
          {
            name: "coerceTo null",
            runTest: function() {
              var subject = createSubject();
              instanceTests.coerceTo(subject, null, undefined);
            }
          },
          {
            name: "coerceTo undefined",
            runTest: function() {
              var subject = createSubject();
              instanceTests.coerceTo(subject, undefined, undefined);
            }
          },
          {
            name: "coerceTo same type",
            runTest: function() {
              var subject = createSubject();
              instanceTests.coerceTo(subject, subject.constructor, subject);
            }
          },
          //            {
          //              name: "coerceTo other type, supported, expect success",
          //              runTest: function () {
          //                var subject = createSubjectOtherTypeSameDataNoMid();
          //                var supportedOtherType = createSubject().constructor;
          //                instanceTests.coerceToData(subject, supportedOtherType, subject.data);
          //              }
          //            },
          //            {
          //              name: "coerceTo other type, not supported, expect fail",
          //              runTest: function () {
          //                var subject = getTestSubject();
          //                instanceTests.coerceTo(subject, ValueStub2, undefined);
          //              }
          //            },
          //            {
          //              name: "coerceTo other type (chaining), supported, expect succes",
          //              runTest: function () {
          //                var subject = getTestSubjectChainingType();
          //                instanceTests.coerceToData(subject, ValueStub1, subject.data);
          //              }
          //            },
          //            {
          //              name: "coerceTo other type (chaining), not supported, expect failure",
          //              runTest: function () {
          //                var subject = getTestSubjectOtherTypeSameData();
          //                instanceTests.coerceTo(subject, ValueStub3, undefined);
          //              }
          //            },
          {
            name: "instance format, no options",
            runTest: function() {
              var instance = createSubject();
              instanceTests.format(instance);
            }
          },
          {
            name: "instance format, options.lang === nl",
            runTest: function() {
              var instance = createSubject();
              instanceTests.format(instance, {locale: "nl"});
            }
          },
          {
            name: "instance format, options.lang === ru",
            runTest: function() {
              var instance = createSubject();
              instanceTests.format(instance, {locale: "ru"});
            }
          }
        ]);
      return tests;

    };

    testGenerator.instanceTests = instanceTests;
    testGenerator.constructorTests = constructorTests;

    return testGenerator;
  }
);
