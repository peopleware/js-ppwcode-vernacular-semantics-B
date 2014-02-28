define(["../_util/contracts/doh", "./PpwCodeObjectTestDefinition"],
  function (doh, tests) {

    doh.register(tests.subjectMid, [
      {
        name: "Constructor test", // don't name a test "constructor"; it kills everything :-(
        runTest: function () {
          var subject = new tests.PpwCodeObjectStub1();
          doh.validateInvariants(subject);
        }
      }
    ].concat(tests));
  }
);
