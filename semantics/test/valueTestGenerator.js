define(["../_util/contracts/doh", "../Value", "../_util/js"],
    function (doh, Value, js) {

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

      var testGenerator = function(createSubject, createSubjectSameTypeOtherDataLarger, createSubjectOtherTypeSameData) {

        var tests = [
          {
            name: "compare with me",
            runTest: function () {
              var subject = createSubject();
              test_compare(subject, subject, 0);
            }
          },
          {
            name: "compare with larger",
            runTest: function () {
              var subject = createSubject();
              var larger = createSubjectSameTypeOtherDataLarger();
              test_compare(subject, larger, -1);
            }
          },
          {
            name: "compare with smaller",
            runTest: function () {
              var subject = createSubjectSameTypeOtherDataLarger();
              var smaller = createSubject();
              test_compare(subject, smaller, +1);
            }
          },
          {
            name: "equals with null",
            runTest: function () {
              var subject = createSubject();
              test_equals(subject, null);
            }
          },
          {
            name: "equals with undefined",
            runTest: function () {
              var subject = createSubject();
              test_equals(subject, undefined);
            }
          },
          {
            name: "equals with me",
            runTest: function () {
              var subject = createSubject();
              test_equals(subject, subject, true);
            }
          },
          {
            name: "equals with object of same type, expect equals",
            runTest: function () {
              var subject = createSubject();
              var other = createSubject();
              test_equals(subject, other, true);
            }
          },
          {
            name: "equals with object of same type, expect not equals",
            runTest: function () {
              var subject = createSubject();
              var other = createSubjectSameTypeOtherDataLarger();
              test_equals(subject, other);
            }
          },
          {
            name: "equals with object of other type",
            runTest: function () {
              var subject = createSubject();
              var other = createSubjectOtherTypeSameData();
              test_equals(subject, other);
            }
          },
          {
            name: "equals with not-a-value Number",
            runTest: function () {
              var subject = createSubject();
              test_equals(subject, 4);
            }
          },
          {
            name: "equals with not-a-value String",
            runTest: function () {
              var subject = createSubject();
              test_equals(subject, "TEST");
            }
          },
          {
            name: "equals with not-a-value Date",
            runTest: function () {
              var subject = createSubject();
              test_equals(subject, new Date());
            }
          },
          {
            name: "equals with not-a-value Function",
            runTest: function () {
              var subject = createSubject();
              test_equals(subject, window.open);
            }
          },
          {
            name: "equals with not-a-value object",
            runTest: function () {
              var subject = createSubject();
              test_equals(subject, window);
            }
          }
        ];

        return tests;

      };

      testGenerator.compare = test_compare;
      testGenerator.equals = test_equals;

      return testGenerator;
    }
);
