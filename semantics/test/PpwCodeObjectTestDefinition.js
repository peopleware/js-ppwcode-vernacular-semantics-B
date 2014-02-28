define(["../_util/contracts/doh", "../PpwCodeObject", "dojo/_base/declare", "module"],
  function (doh, PpwCodeObject, declare, module) {

    var PpwCodeObjectStub1 = declare([PpwCodeObject], {});
    PpwCodeObjectStub1.mid = module.id + "_PpwCodeObjectStub1";

    var PpwCodeObjectStub2 = declare([PpwCodeObject], {}); // no mid

    function test_getTypeDescription(/*Function*/ Constructor) {
      var subject = new Constructor();
      var result = subject.getTypeDescription();
      doh.validateInvariants(subject);
      // postconditions
      doh.t(!!result);
      doh.t(typeof result === "string");
    }


    var tests = [
      {
        name: "getTypeDescription with mid",
        runTest: function () {
          test_getTypeDescription(PpwCodeObjectStub1);
        }
      },
      {
        name: "getTypeDescription with no mid",
        runTest: function () {
          test_getTypeDescription(PpwCodeObjectStub2);
        }
      }
    ];

    tests.subjectMid = PpwCodeObject.mid;
    tests.PpwCodeObjectStub1 = PpwCodeObjectStub1;
    tests.PpwCodeObjectStub2 = PpwCodeObjectStub2;
    tests.getTypeDescription = test_getTypeDescription;

    return tests;
  }
);
