define(
  ["../_util/contracts/doh", "../Value", "./ppwCodeObjectTestGenerator", "../_util/js", "../_exceptions/SemanticException"],
  function(doh, Value, ppwCodeObjectTestGenerator, js, ParseException) {

    function test_compare(/*Value*/ value1, /*Value*/ value2, /*Object*/ expectCompare) {
      var result = value1.compare(value2);
      doh.validateInvariants(value1);
      doh.validateInvariants(value2);
      doh.is(result, expectCompare);
    }

    function test_equals(/*Value*/ v1, /*Value?*/ v2, /*Boolean?*/ expectEquals) {
      var result = v1.equals(v2);
      doh.validateInvariants(v1);
      if (v2 && v2.isInstanceOf && v2.isInstanceOf(Value)) {
        doh.validateInvariants(v2);
      }
      // postconditions
      // we expect not equal, unless it is said it should be
      doh.is(result, !!expectEquals);
    }

    function test_coerceTo(/*Value*/ value, /*Type?*/ type, expectedResult) {
      var result = value.coerceTo(type);
      doh.validateInvariants(value);
      if (result && result.isInstanceOf && result.isInstanceOf(Value)) {
        doh.validateInvariants(result);
      }
      doh.assertEqual(result, expectedResult);
    }

    function test_format(/*Function*/ ValueType, /*Value*/ candidate, /*Object?*/ options) {
      var result = ValueType.format(candidate, options);
      if (!candidate) {
        doh.is(null, result);
      }
      else {
        doh.is("string", typeof result);
        doh.t(candidate.equals(candidate.constructor.parse(result, options)));
      }
    }

    function test_parse(/*Function*/ ValueType, /*String?*/ candidate, /*Object?*/ expected, /*Object?*/ options) {
      try {
        var result = ValueType.parse(candidate, options);
        if (!candidate && candidate !== "") {
          doh.is(null, result);
        }
        else {
          doh.t(result);
          doh.t(result.isInstanceOf(ValueType));
        }
      }
      catch (exc) {
        doh.t(exc.isInstanceOf && exc.isInstanceOf(ParseException));
        doh.t(!!candidate || candidate === "");
      }
    }


    var testGenerator = function(createSubject,
                                 createSubjectSameTypeOtherDataLarger,
                                 createSubjectOtherTypeSameDataNoMid) {

      function createFormatTests(options, extraName) {
        return [
          {
            name: "format - null - " + extraName,
            runTest: function() {
              var instance = createSubject();
              test_format(instance.constructor, null, options);
            }
          },
          {
            name: "format - undefined - " + extraName,
            runTest: function() {
              var instance = createSubject();
              test_format(instance.constructor, undefined, options);
            }
          },
          {
            name: "format - a value - " + extraName,
            runTest: function() {
              var instance = createSubject();
              test_format(instance.constructor, instance, options);
            }
          }
        ]
      }

      function createParseTests(options, extraName) {
        return [
          {
            name: "parse - null - " + extraName,
            runTest: function() {
              var instance = createSubject();
              test_parse(instance.constructor, null, options);
            }
          },
          {
            name: "parse - undefined - " + extraName,
            runTest: function() {
              var instance = createSubject();
              test_parse(instance.constructor, undefined, options);
            }
          },
          {
            name: "parse - \"\" - " + extraName,
            runTest: function() {
              var instance = createSubject();
              test_parse(instance.constructor, "", options);
            }
          },
          {
            name: "parse - a value - " + extraName,
            runTest: function() {
              var instance = createSubject();
              test_parse(instance.constructor, instance.constructor.format(instance), options);
            }
          },
          {
            name: "parse - not a value - " + extraName,
            runTest: function() {
              var instance = createSubject();
              test_parse(instance.constructor, "XX not a formatted value XX", options);
            }
          }
        ]
      }

      var tests = ppwCodeObjectTestGenerator(createSubject, createSubjectOtherTypeSameDataNoMid)
        .concat([
          {
            name: "compare with me",
            runTest: function() {
              var subject = createSubject();
              test_compare(subject, subject, 0);
            }
          },
          {
            name: "compare with larger",
            runTest: function() {
              var subject = createSubject();
              var larger = createSubjectSameTypeOtherDataLarger();
              test_compare(subject, larger, -1);
            }
          },
          {
            name: "compare with smaller",
            runTest: function() {
              var subject = createSubjectSameTypeOtherDataLarger();
              var smaller = createSubject();
              test_compare(subject, smaller, +1);
            }
          },
          {
            name: "equals with null",
            runTest: function() {
              var subject = createSubject();
              test_equals(subject, null);
            }
          },
          {
            name: "equals with undefined",
            runTest: function() {
              var subject = createSubject();
              test_equals(subject, undefined);
            }
          },
          {
            name: "equals with me",
            runTest: function() {
              var subject = createSubject();
              test_equals(subject, subject, true);
            }
          },
          {
            name: "equals with object of same type, expect equals",
            runTest: function() {
              var subject = createSubject();
              var other = createSubject();
              test_equals(subject, other, true);
            }
          },
          {
            name: "equals with object of same type, expect not equals",
            runTest: function() {
              var subject = createSubject();
              var other = createSubjectSameTypeOtherDataLarger();
              test_equals(subject, other);
            }
          },
          {
            name: "equals with object of other type",
            runTest: function() {
              var subject = createSubject();
              var other = createSubjectOtherTypeSameDataNoMid();
              test_equals(subject, other);
            }
          },
          {
            name: "equals with not-a-value Number",
            runTest: function() {
              var subject = createSubject();
              test_equals(subject, 4);
            }
          },
          {
            name: "equals with not-a-value String",
            runTest: function() {
              var subject = createSubject();
              test_equals(subject, "TEST");
            }
          },
          {
            name: "equals with not-a-value Date",
            runTest: function() {
              var subject = createSubject();
              test_equals(subject, new Date());
            }
          },
          {
            name: "equals with not-a-value Function",
            runTest: function() {
              var subject = createSubject();
              test_equals(subject, window.open);
            }
          },
          {
            name: "equals with not-a-value object",
            runTest: function() {
              var subject = createSubject();
              test_equals(subject, window);
            }
          },
          {
            name: "coerceTo null",
            runTest: function() {
              var subject = createSubject();
              test_coerceTo(subject, null, undefined);
            }
          },
          {
            name: "coerceTo undefined",
            runTest: function() {
              var subject = createSubject();
              test_coerceTo(subject, undefined, undefined);
            }
          },
          {
            name: "coerceTo same type",
            runTest: function() {
              var subject = createSubject();
              test_coerceTo(subject, subject.constructor, subject);
            }
          },
          //            {
          //              name: "coerceTo other type, supported, expect success",
          //              runTest: function () {
          //                var subject = createSubjectOtherTypeSameDataNoMid();
          //                var supportedOtherType = createSubject().constructor;
          //                test_CoerceToData(subject, supportedOtherType, subject.data);
          //              }
          //            },
          //            {
          //              name: "coerceTo other type, not supported, expect fail",
          //              runTest: function () {
          //                var subject = getTestSubject();
          //                test_coerceTo(subject, ValueStub2, undefined);
          //              }
          //            },
          //            {
          //              name: "coerceTo other type (chaining), supported, expect succes",
          //              runTest: function () {
          //                var subject = getTestSubjectChainingType();
          //                test_CoerceToData(subject, ValueStub1, subject.data);
          //              }
          //            },
          //            {
          //              name: "coerceTo other type (chaining), not supported, expect failure",
          //              runTest: function () {
          //                var subject = getTestSubjectOtherTypeSameData();
          //                test_coerceTo(subject, ValueStub3, undefined);
          //              }
          //            },
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
        .concat(createParseTests({locale: "ru"}, "options.lang === ru => fallback language"));

      return tests;

    };

    testGenerator.compare = test_compare;
    testGenerator.equals = test_equals;

    return testGenerator;
  }
);
