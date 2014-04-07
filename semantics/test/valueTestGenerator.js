define(
  ["../_util/contracts/doh", "../Value", "./ppwCodeObjectTestGenerator", "../_exceptions/SemanticException"],
  function(doh, Value, ppwCodeObjectTestGenerator, ParseException) {

    var instanceTests = {

      compare: function(/*Value*/ subject, /*Value*/ other, /*Object*/ expectCompare) {
        var result = subject.compare(other);
        doh.validateInvariants(subject);
        doh.validateInvariants(other);
        doh.is(result, expectCompare);
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

    var testGenerator = function(createSubject,
                                 createSubjectSameTypeOtherDataLarger,
                                 createSubjectOtherTypeSameDataNoMid) {

      function createFormatTests(options, extraName) {
        return [
          {
            name: "format - null - " + extraName,
            runTest: function() {
              var instance = createSubject();
              constructorTests.format(instance.constructor, null, options);
            }
          },
          {
            name: "format - undefined - " + extraName,
            runTest: function() {
              var instance = createSubject();
              constructorTests.format(instance.constructor, undefined, options);
            }
          },
          {
            name: "format - a value - " + extraName,
            runTest: function() {
              var instance = createSubject();
              constructorTests.format(instance.constructor, instance, options);
            }
          }
        ];
      }

      function createParseTests(options, extraName) {
        return [
          {
            name: "parse - null - " + extraName,
            runTest: function() {
              var instance = createSubject();
              constructorTests.parse(instance.constructor, null, options);
            }
          },
          {
            name: "parse - undefined - " + extraName,
            runTest: function() {
              var instance = createSubject();
              constructorTests.parse(instance.constructor, undefined, options);
            }
          },
          {
            name: "parse - \"\" - " + extraName,
            runTest: function() {
              var instance = createSubject();
              constructorTests.parse(instance.constructor, "", options);
            }
          },
          {
            name: "parse - a value - " + extraName,
            runTest: function() {
              var instance = createSubject();
              constructorTests.parse(instance.constructor, instance.constructor.format(instance), options);
            }
          },
          {
            name: "parse - not a value - " + extraName,
            runTest: function() {
              var instance = createSubject();
              constructorTests.parse(instance.constructor, "XX not a formatted value XX", options);
            }
          }
        ];
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
        .concat(createFormatTests(undefined, "no options"))
        .concat(createFormatTests({locale: "nl"}, "options.lang === nl"))
        .concat(createFormatTests({locale: "ru"}, "options.lang === ru => fallback language"))
        .concat(createParseTests(undefined, "no options"))
        .concat(createParseTests({locale: "nl"}, "options.lang === nl"))
        .concat(createParseTests({locale: "ru"}, "options.lang === ru => fallback language"))
        .concat([
          {
            name: "compare with me",
            runTest: function() {
              var subject = createSubject();
              instanceTests.compare(subject, subject, 0);
            }
          },
          {
            name: "compare with larger",
            runTest: function() {
              var subject = createSubject();
              var larger = createSubjectSameTypeOtherDataLarger();
              instanceTests.compare(subject, larger, -1);
            }
          },
          {
            name: "compare with smaller",
            runTest: function() {
              var subject = createSubjectSameTypeOtherDataLarger();
              var smaller = createSubject();
              instanceTests.compare(subject, smaller, +1);
            }
          },
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
