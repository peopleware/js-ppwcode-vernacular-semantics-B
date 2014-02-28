define(["../_util/contracts/doh", "../EnumerationValue", "./enumerationValueTestGenerator", "module"],
  function (doh, EnumerationValue, testGenerator, module) {

    // Abstract functions are not tested.
    var EnumerationValueStub1 = EnumerationValue.declare(
      {},
      ["first", "second", "third"],
      module.id + "_1"
      // no bundle
    );

    var EnumerationValueStub2 = EnumerationValue.declare(
      {},
      ["alpha", "beta", "gamma"],
      module.id + "_2"
      // no bundle
    );

    doh.register(
      EnumerationValue.mid,
      testGenerator.tests_isJson(
        "EnumerationValue",
        EnumerationValueStub1,
        function(/*String*/ candidate, /*Object*/ EnumType) {
          var values = EnumType.values();
          var jsons = values.map(function(enumValue) {return JSON.parse(JSON.stringify(enumValue));});
          var expected = (jsons.indexOf(candidate) >= 0);
          var result = EnumerationValue.isJson(EnumType, candidate);
          doh.is(expected, result);
        }
      ).concat(testGenerator(EnumerationValueStub1, EnumerationValueStub2))
    );

  });
