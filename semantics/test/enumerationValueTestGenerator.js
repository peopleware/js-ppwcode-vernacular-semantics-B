define(["../_util/contracts/doh", "./valueTestGenerator", "../EnumerationValue"],
  function (doh, valueTestGenerator, EnumerationValue) {

    /*
      basic inspectors (not tested separately):
        EnumType.values
     */

    function tests_isJson(/*String*/ candidate, /*Object*/ EnumType) {
      var values = EnumType.values();
      var jsons = values.map(function(enumValue) {return JSON.parse(JSON.stringify(enumValue));});
      var expected = (jsons.indexOf(candidate) >= 0);
      var result = EnumType.isJson(candidate);
      doh.is(expected, result);
    }

    function test_isValueOf(/*EnumerationValue*/ enumValue, /*Object*/ EnumType) {
      var result = enumValue.isValueOf(EnumType);
      doh.validateInvariants(enumValue);
      // postconditions
      doh.t(EnumType.values().indexOf(enumValue) >= 0, result);
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
            tests_isJson(null, EnumType);
          }
        },
        {
          name: "isJson - undefined",
          runTest: function() {
            tests_isJson(null, EnumType);
          }
        },
        {
          name: "isJson - not json",
          runTest: function() {
            tests_isJson("NOT A JSON STRING", EnumType);
          }
        },
        {
          name: "isJson - other string",
          runTest: function() {
            tests_isJson("\"lalala\"", EnumType);
          }
        },
        {
          name: "isJson - other string first",
          runTest: function() {
            tests_isJson("first", EnumType);
          }
        },
        {
          name: "isJson - other",
          runTest: function() {
            tests_isJson("{something: 'else'}", EnumType);
          }
        },
        {
          name: "isJson - ok",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            var json = JSON.stringify(enumValue);
            tests_isJson(json, EnumType);
          })
        },
        {
          name: "all instances adhere to invariants",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            doh.validateInvariants(enumValue);
          })
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

    testGenerator.tests_isJson = tests_isJson;
    testGenerator.isValueOf = test_isValueOf;

    return testGenerator;
  }
);
