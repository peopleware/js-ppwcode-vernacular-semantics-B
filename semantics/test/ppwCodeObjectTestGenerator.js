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

    var testGenerator = function(groupId, /*Function[]*/ subjectFactories) {

      doh.register(groupId, [
        {
          name: "getTypeDescription with mid",
          runTest: function () {
            test_getTypeDescription(subjectFactories[0]);
          }
        },
        {
          name: "getTypeDescription with no mid",
          runTest: function () {
            test_getTypeDescription(subjectFactories[1]);
          }
        }
      ]);

    };

    testGenerator.getTypeDescription = test_getTypeDescription;

    return testGenerator;
  }
);
