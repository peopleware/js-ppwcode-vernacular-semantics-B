define(["../_util/contracts/doh", "../EnumerationValue", "./enumerationValueTestGenerator", "module"],
  function (doh, EnumerationValue, testGenerator, module) {

    // Abstract functions are not tested.
    var EnumerationValueStub1 = EnumerationValue.declare(
      {},
      ["first", "second", "third"],
      module.id + "_1"
      // no bundle
    );

    doh.register(
      EnumerationValue.mid,
      testGenerator(EnumerationValueStub1)
    );

  });
