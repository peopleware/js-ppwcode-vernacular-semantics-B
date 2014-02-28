define(["../_util/contracts/doh", "../Value"],
    function (doh, Value) {

      function test_Equals(/*Value*/ v1, /*Value?*/ v2, /*Boolean?*/ expectEquals) {
        var result = v1.equals(v2);
        doh.validateInvariants(v1);
        if (v2 && v2.isInstanceOf && v2.isInstanceOf(Value)) {
          doh.validateInvariants(v2);
        }
        // postconditions
        // we expect not equal, unless it is said it should be
        doh.is(result, !!expectEquals);
      }

      var testGenerator = function(createSubject, createSubjectOtherData, createSubjectOtherType) {

        var tests = [
          {
            name: "equals with null",
            runTest: function () {
              var subject = createSubject();
              test_Equals(subject, null);
            }
          },
          {
            name: "equals with undefined",
            runTest: function () {
              var subject = createSubject();
              test_Equals(subject, undefined);
            }
          },
          {
            name: "equals with me",
            runTest: function () {
              var subject = createSubject();
              test_Equals(subject, subject, true);
            }
          },
          {
            name: "equals with object of same type, expect equals",
            runTest: function () {
              var subject = createSubject();
              var other = createSubject();
              test_Equals(subject, other, true);
            }
          },
          {
            name: "equals with object of same type, expect not equals",
            runTest: function () {
              var subject = createSubject();
              var other = createSubjectOtherData();
              test_Equals(subject, other);
            }
          },
          {
            name: "equals with object of other type",
            runTest: function () {
              var subject = createSubject();
              var other = createSubjectOtherType();
              test_Equals(subject, other);
            }
          },
          {
            name: "equals with not-a-value Number",
            runTest: function () {
              var subject = createSubject();
              test_Equals(subject, 4);
            }
          },
          {
            name: "equals with not-a-value String",
            runTest: function () {
              var subject = createSubject();
              test_Equals(subject, "TEST");
            }
          },
          {
            name: "equals with not-a-value Date",
            runTest: function () {
              var subject = createSubject();
              test_Equals(subject, new Date());
            }
          },
          {
            name: "equals with not-a-value Function",
            runTest: function () {
              var subject = createSubject();
              test_Equals(subject, window.open);
            }
          },
          {
            name: "equals with not-a-value object",
            runTest: function () {
              var subject = createSubject();
              test_Equals(subject, window);
            }
          },
          {
            name: "getValue that was set via constructor",
            runTest: function () {
              var subject = createSubject();
              doh.assertEqual("TEST", subject.getValue());
            }
          }
        ];

        return tests;

      };

      testGenerator.Equals = test_Equals;

      return testGenerator;
    }
);
