define(["../_util/contracts/doh"],
  function (doh) {

    function test_getTypeDescription(/*Function*/ createSubject) {
      var subject = createSubject();
      var result = subject.getTypeDescription();
      doh.validateInvariants(subject);
      // postconditions
      doh.t(!!result);
      doh.t(typeof result === "string");
    }

    var testGenerator = function(createSubjectWithMid, createSubjectWithoutMid) {

      var tests = [
        {
          name: "getTypeDescription with mid",
          runTest: function () {
            test_getTypeDescription(createSubjectWithMid);
          }
        },
        {
          name: "getTypeDescription with no mid",
          runTest: function () {
            test_getTypeDescription(createSubjectWithoutMid);
          }
        }
      ];

      return tests;

    };

    testGenerator.getTypeDescription = test_getTypeDescription;

    return testGenerator;
  }
);
