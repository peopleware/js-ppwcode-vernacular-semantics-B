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
      module.id + "_2",
      "EnumerationValue_2"
    );

    testGenerator(EnumerationValue.mid, EnumerationValueStub1, EnumerationValueStub2);

  });
