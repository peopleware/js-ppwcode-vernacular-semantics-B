define(["../_util/contracts/doh", "./valueTestGenerator", "../EnumerationValue"],
  function (doh, valueTestGenerator, EnumerationValue) {

    /*
      basic inspectors (not tested separately):
        EnumType.values
     */

    function test_isJson(/*String*/ candidate, /*Object*/ EnumType) {
      var values = EnumType.values();
      var jsons = values.map(function(enumValue) {return JSON.parse(JSON.stringify(enumValue));});
      var expected = (jsons.indexOf(candidate) >= 0);
      var result = EnumType.isJson(candidate);
      doh.is(expected, result);
    }

    function test_revive(/*String*/ candidate, /*Object*/ EnumType) {
      var result = EnumType.revive(candidate);
      doh.is(candidate, result.toJSON());
    }

    function test_isValueOf(/*EnumerationValue*/ enumValue, /*Object*/ EnumType) {
      var result = enumValue.isValueOf(EnumType);
      doh.validateInvariants(enumValue);
      // postconditions
      doh.t(EnumType.values().indexOf(enumValue) >= 0, result);
    }

    function test_Compare(/*EnumerationValue*/ enumValue1, /*EnumerationValue?*/ enumValue2, /*Object*/ expectCompare) {
      var result = enumValue1.compare(enumValue2);
      doh.validateInvariants(enumValue1);
      if (enumValue2 && enumValue2.isInstanceOf && enumValue2.isInstanceOf(EnumerationValue)) {
        doh.validateInvariants(enumValue2);
      }
      doh.is(result, expectCompare);
    }

    function testForAllValues(/*Object*/ EnumType, /*Function*/ testFunction) {
      return function() {
        EnumType.values().forEach(function(enumValue) {
          testFunction(enumValue, EnumType);
        });
      };
    }

    var testGenerator = function(EnumType, OtherEnumType) {

      var values = EnumType.values();
      var tests = [
        {
          name: "EnumType has all necessary properties",
          runTest: function() {
            doh.t(EnumType.isJson);
            doh.is("function", typeof EnumType.isJson);
            doh.t(EnumType.revive);
            doh.is("function", typeof EnumType.revive);
            doh.t(EnumType.values);
            doh.is("function", typeof EnumType.values);
            doh.t(EnumType.format);
            doh.is("function", typeof EnumType.format);
            doh.t(EnumType.parse);
            doh.is("function", typeof EnumType.parse);
          }
        },
        {
          name: "isJson - null",
          runTest: function() {
            test_isJson(null, EnumType);
          }
        },
        {
          name: "isJson - undefined",
          runTest: function() {
            test_isJson(null, EnumType);
          }
        },
        {
          name: "isJson - not json",
          runTest: function() {
            test_isJson("NOT A JSON STRING", EnumType);
          }
        },
        {
          name: "isJson - other string",
          runTest: function() {
            test_isJson("\"lalala\"", EnumType);
          }
        },
        {
          name: "isJson - other string first",
          runTest: function() {
            test_isJson("first", EnumType);
          }
        },
        {
          name: "isJson - other",
          runTest: function() {
            test_isJson("{something: 'else'}", EnumType);
          }
        },
        {
          name: "isJson - ok",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            var json = JSON.stringify(enumValue);
            test_isJson(json, EnumType);
          })
        },
        {
          name: "revive",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            var json = JSON.parse(JSON.stringify(enumValue));
            test_revive(json, EnumType);
          })
        },
        {
          name: "all instances adhere to invariants",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            doh.validateInvariants(enumValue);
          })
        },
        {
          name: "compare with me",
          runTest: function () {
            test_Compare(EnumType.values()[0], EnumType.values()[0], 0);
          }
        },
        {
          name: "compare with larger",
          runTest: function () {
            test_Compare(EnumType.values()[0], EnumType.values()[1], -1);
          }
        },
        {
          name: "compare with smaller",
          runTest: function () {
            test_Compare(EnumType.values()[1], EnumType.values()[0], +1);
          }
        }
      ];
      tests = tests.concat(valueTestGenerator(
        function() {return values[0];},
        function() {return values[1]},
        function() {return OtherEnumType.values()[0]}
      ));
      tests = tests.concat([
        {
          name: "isValueOf",
          runTest: testForAllValues(EnumType, test_isValueOf)
        }
      ]);

      return tests;

    };

    testGenerator.isJson = test_isJson;
    testGenerator.revive = test_revive;
    testGenerator.isValueOf = test_isValueOf;
    testGenerator.compare = test_Compare;

    return testGenerator;
  }
);
