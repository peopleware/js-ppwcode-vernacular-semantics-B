define(["../_util/contracts/doh", "./valueTestGenerator"],
  function (doh, valueTestGenerator) {

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
      var tests = valueTestGenerator(
        function() {return values[0];},
        function() {return values[1]},
        function() {return OtherEnumType.values()[0]}
      );
      tests = tests.concat([
        {
          name: "isValueOf",
          runTest: testForAllValues(EnumType, test_isValueOf)
        }
      ]);

      return tests;

    };

    testGenerator.isValueOf = test_isValueOf;

    return testGenerator;
  }
);
