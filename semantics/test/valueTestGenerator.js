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

      function test_valueOf(/*Value*/ value) {
        var result = value.valueOf();
        doh.validateInvariants(value);
        doh.t(result !== null);
        doh.t(result !== undefined);
        var type = js.typeOf(result);
        doh.t(result === value || type === "date" || type === "number" || type === "string" || type === "boolean");
      }

      function test_getValue(/*Value*/ value) {
        var result = value.getValue();
        doh.validateInvariants(value);
        doh.is("string", js.typeOf(result));
        doh.isNot("", result);
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
          },
          {
            name: "test valueOf", // don't call this valueOf - doh crashes on that because it is a method of Object
            runTest: function () {
              var subject = createSubject();
              test_getValue(subject);
            }
          },
          {
            name: "getValue",
            runTest: function () {
              var subject = createSubject();
              test_getValue(subject);
            }
          }
        ];

        return tests;

      };

      testGenerator.compare = test_compare;
      testGenerator.equals = test_equals;
      testGenerator.valueOf = test_valueOf;
      testGenerator.getValue = test_getValue;

      return testGenerator;
    }
);
