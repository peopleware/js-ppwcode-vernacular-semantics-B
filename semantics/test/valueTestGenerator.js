define(
  ["../_util/contracts/doh", "../_util/contracts/createTests", "../Value", "./ppwCodeObjectTestGenerator", "../_exceptions/SemanticException"],
  function(doh, createTests, Value, ppwCodeObjectTestGenerator, ParseException) {

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

      equals: function(/*Value*/ subject, other) {
        var result = !!subject.equals(other);
        doh.validateInvariants(subject);
        if (other && other.isInstanceOf && other.isInstanceOf(Value)) {
          doh.validateInvariants(other);
        }
        // postconditions
        if (subject === other) {
          doh.t(result);
        }
        if (!other) {
          doh.f(result);
        }
        else if (other.constructor !== subject.constructor) {
          doh.f(result);
        }
      },

      valueOf: function(/*Value*/ subject) {
      },

      getValue: function(/*Value*/ subject) {

      },

      // canCoerceTo is basic

      coerceTo: function(/*Value*/ subject, /*Function?*/ Type) {
        var result = subject.coerceTo(Type);
        doh.validateInvariants(subject);
        if (result && result.isInstanceOf && result.isInstanceOf(Value)) {
          doh.validateInvariants(result);
        }
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

    var formatOptionsFactories = {
      name: "options",
      factories: [
        null,
        undefined,
        function() {return {locale: "nl"};},
        {
          name: "options.locale === ru --> fallback language",
          factory: function() {return {locale: "ru"};}
        }
      ]
    };

    var testGenerator = function(groupId, /*Function[]*/ subjectFactories) {

      var createSubject = subjectFactories[0];
      var createSubjectSameTypeOtherDataLarger = subjectFactories[1];
      var createSubjectOtherTypeSameDataNoMid = subjectFactories[2];

      var ValueType = createSubject().constructor;

      ppwCodeObjectTestGenerator(groupId, subjectFactories);
      doh.register(groupId, [
        {
          name: "has a format",
          runTest: function() {
            doh.is("function", typeof ValueType.format);
          }
        },
        {
          name: "has a parse",
          runTest: function() {
            doh.is("function", typeof ValueType.parse);
          }
        }
      ]);
      createTests(
        groupId,
        constructorTests,
        "format",
        [
          [function() {return ValueType;}], // subject factories
          {name: "value", factories: [null, undefined, createSubject]},
          formatOptionsFactories
        ]
      );
      createTests(
        groupId,
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
          formatOptionsFactories
        ]
      );
      createTests(
        groupId,
        instanceTests,
        "compare",
        [
          [createSubject], // subject factories
          {name: "other", factories: [
            "$this",
            "$this()",
            {
              name: "large",
              factory: createSubjectSameTypeOtherDataLarger
            }
          ]}
        ]
      );
      createTests(
        groupId,
        instanceTests,
        "equals",
        [
          [createSubject], // subject factories
          {name: "other", factories: [
            null,
            undefined,
            "$this",
            "$this()",
            {
              name: "unequal object of same type",
              factory: createSubjectSameTypeOtherDataLarger
            },
            {
              name: "object of other type",
              factory: createSubjectOtherTypeSameDataNoMid
            },
            {
              name: "not-a-value Number",
              factory: 4
            },
            {
              name: "not-a-value String",
              factory: "TEST"
            },
            {
              name: "not-a-value Date",
              factory: function() {return new Date();}
            },
            {
              name: "not-a-value Function",
              factory: function() {return window.open;}
            },
            {
              name: "not-a-value object",
              factory: function() {return window;}
            }
          ]}
        ]
      );
      createTests(
        groupId,
        instanceTests,
        "coerceTo",
        [
          [createSubject], // subject factories
          {name: "Type", factories: [
            null,
            undefined,
            {
              name: "same type",
              factory: function() {return ValueType;}
            }
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
          ]}
        ]
      );
      createTests(
        groupId,
        instanceTests,
        "format",
        [
          [createSubject], // subject factories
          formatOptionsFactories
        ]
      );
    };

    testGenerator.instanceTests = instanceTests;
    testGenerator.constructorTests = constructorTests;

    return testGenerator;
  }
);
