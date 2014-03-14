define(["../_util/contracts/doh", "./valueTestGenerator", "../EnumerationValue"],
  function (doh, valueTestGenerator, EnumerationValue) {

    /*
      basic inspectors (not tested separately):
        EnumType.values
     */

    function test_isJson(/*String*/ candidate, /*Object*/ EnumType) {
      var values = EnumType.values();
      var /*String[]*/ jsons = values.map(function(enumValue) {return JSON.parse(JSON.stringify(enumValue));});
      var expected = (jsons.indexOf(candidate) >= 0);
      var result = EnumType.isJson(candidate);
      doh.is(expected, result);
    }

    function test_format(/*EnumerationValue*/ candidate, /*Object*/ EnumType, /*String?*/ expected, /*Object?*/ options) {
      var result = EnumType.format(candidate, options);
      doh.t(!!result);
      doh.t(typeof result === "string");
      doh.t(result.trim().length > 0);
      if (expected) {
        doh.assertEqual(expected, result);
      }
    }

    function test_parse(/*String?*/ candidate, /*Object*/ EnumType, /*Object?*/ expected, /*Object?*/ options) {
      var result = EnumType.parse(candidate, options);
      if (result) {
        doh.t(result.isInstanceOf(EnumType));
      }
      if (expected) {
        doh.assertEqual(expected.value, result);
      } else {
        var values = EnumType.values();
        var /*String[]*/ stringRepresentations = values.map(function(enumValue) {return JSON.parse(JSON.stringify(enumValue));});
        doh.t(stringRepresentations.indexOf(result.getValue()) >= 0);
      }
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
            test_isJson(undefined, EnumType);
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
          name: "format - no options ok",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            test_format(enumValue, EnumType);
          })
        },
        {
          name: "format - options.locale = nl",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            test_format(enumValue, EnumType, null, {locale: "nl"});
          })
        },
        {
          name: "format - options.locale = ru => fallback language",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            test_format(enumValue, EnumType, null, {locale: "ru"});
          })
        },
        {
          name: "format - not found in fallback language",
          runTest: function() {
            test_format(EnumType.second, EnumType, EnumType.second.getValue(), {locale: "ru"});
          }
        },
        {
          name: "format - not found in nl language, falling back to default nls file",
          runTest: function() {
            test_format(EnumType.third, EnumType, "Number 3", {locale: "nl"});
          }
        },
        {
          name: "format - found in fallback language file",
          runTest: function() {
            test_format(EnumType.first, EnumType, "Number 1", {locale: "ru"});
          }
        },
        {
          name: "format - found in nl language file",
          runTest: function() {
            test_format(EnumType.first, EnumType, "Nummer 1", {locale: "nl"});
          }
        },
        {
          name: "parse - null value",
          runTest: function() {
            test_parse(null, EnumType, {value: null}, {});
          }
        },
        {
          name: "parse - undefined value",
          runTest: function() {
            test_parse(undefined, EnumType, {value: null}, {});
          }
        },
        {
          name: "parse - empty string value",
          runTest: function() {
            test_parse("", EnumType, {value: null}, {});
          }
        },
        {
          name: "parse - all values are tested",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            var formattedEnum = EnumType.format(enumValue);
            test_parse(formattedEnum, EnumType);
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
        }
      ];
      tests = tests.concat(valueTestGenerator(
        function() {return EnumType.first;},
        function() {return EnumType.second;},
        function() {return OtherEnumType.alpha;}
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

    return testGenerator;
  }
);
