/*
 Copyright 2012 - $Date $ by PeopleWare n.v.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

define(["../_util/contracts/doh", "./valueTestGenerator", "./ValueMethodTests", "../EnumerationValue"],
  function (doh, valueTestGenerator, ValueMethodTests, EnumerationValue) {

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

      valueTestGenerator(
        new ValueMethodTests(),
        [
          function() {return EnumType.first;},
          function() {return EnumType.second;},
          function() {return OtherEnumType.alpha;}
        ]
      );

      var values = EnumType.values();

      doh.register(EnumType.prototype.getTypeDescription(), [
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
//        {
//          name: "format - no options ok",
//          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
//            test_format(enumValue, EnumType);
//          })
//        },
//        {
//          name: "format - options.locale = nl",
//          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
//            test_format(enumValue, EnumType, null, {locale: "nl"});
//          })
//        },
//        {
//          name: "format - options.locale = ru => fallback language",
//          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
//            test_format(enumValue, EnumType, null, {locale: "ru"});
//          })
//        },
//        {
//          name: "format - not found in fallback language",
//          runTest: function() {
//            test_format(EnumType.second, EnumType, EnumType.second.getValue(), {locale: "ru"});
//          }
//        },
//        {
//          name: "format - not found in nl language, falling back to default nls file",
//          runTest: function() {
//            test_format(EnumType.third, EnumType, "Number 3", {locale: "nl"});
//          }
//        },
//        {
//          name: "format - found in fallback language file",
//          runTest: function() {
//            test_format(EnumType.first, EnumType, "Number 1", {locale: "ru"});
//          }
//        },
//        {
//          name: "format - found in nl language file",
//          runTest: function() {
//            test_format(EnumType.first, EnumType, "Nummer 1", {locale: "nl"});
//          }
//        },
//        {
//          name: "parse - null value",
//          runTest: function() {
//            test_parse(null, EnumType, {value: null}, {});
//          }
//        },
//        {
//          name: "parse - undefined value",
//          runTest: function() {
//            test_parse(undefined, EnumType, {value: null}, {});
//          }
//        },
//        {
//          name: "parse - empty string value",
//          runTest: function() {
//            test_parse("", EnumType, {value: null}, {});
//          }
//        },
//        {
//          name: "parse - passing in an object instead of a string",
//          runTest: function() {
//            test_parse({foo: "bar"}, EnumType, {value: null}, {});
//          }
//        },
//        {
//          name: "parse - non existent string value",
//          runTest: function() {
//            test_parse("wrongValue", EnumType, {value: undefined}, {});
//          }
//        },
//        {
//          name: "parse - test with locale",
//          runTest: function() {
//            test_parse("Nummer 1", EnumType, {value: EnumType.first}, {locale: "nl"});
//          }
//        },
//        {
//          name: "parse - test with locale with missing property for current enumeration value",
//          runTest: function() {
//            test_parse("Number 3", EnumType, {value: EnumType.third}, {locale: "nl"});
//          }
//        },
//        {
//          name: "parse - test with not found in fallback locale",
//          runTest: function() {
//            test_parse("Number 2", EnumType, {value: null}, {locale: "fr"});
//          }
//        },
//        {
//          name: "parse - test with fallback locale",
//          runTest: function() {
//            test_parse("Number 3", EnumType, {value: EnumType.third}, {locale: "fr"});
//          }
//        },
//        {
//          name: "parse - all values are tested",
//          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
//            var formattedEnum = EnumType.format(enumValue);
//            test_parse(formattedEnum, EnumType);
//          })
//        },
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
          name: "mid is set",
          runTest: testForAllValues(EnumType, function(/*EnumerationValue*/ enumValue) {
            doh.assertEqual(EnumType.mid, enumValue.constructor.mid);
            doh.assertEqual("ppwcode-vernacular-semantics/test/EnumerationValue_1", enumValue.constructor.mid);
          })
        },
        {
          name: "No bundleName is set",
          runTest: testForAllValues(OtherEnumType, function(/*EnumerationValue*/ enumValue) {
            doh.t(!EnumType.bundleName);
          })
        },
        {
          name: "bundleName is set",
          runTest: testForAllValues(OtherEnumType, function(/*EnumerationValue*/ enumValue) {
            doh.assertEqual(OtherEnumType.bundleName, enumValue.constructor.bundleName);
            doh.assertEqual("EnumerationValue_2", enumValue.constructor.bundleName);
          })
        },
        {
          name: "isValueOf",
          runTest: testForAllValues(EnumType, test_isValueOf)
        }
      ]);

    };

    testGenerator.isJson = test_isJson;
    testGenerator.revive = test_revive;
    testGenerator.isValueOf = test_isValueOf;

    return testGenerator;
  }
);
