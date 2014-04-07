define(["../_util/contracts/doh", "../_util/contracts/createTests"],
  function (doh, createTests) {

    var tests = {

      getTypeDescription: function(/*PpwCodeObject*/ subject) {
        var result = subject.getTypeDescription();
        doh.validateInvariants(subject);
        // postconditions
        doh.t(!!result);
        doh.t(typeof result === "string");
      }

    };

    var testGenerator = function(groupId, /*Function[]*/ subjectFactories) {

      createTests(groupId, tests, "getTypeDescription", [subjectFactories]);

    };

    testGenerator.tests = tests;

    return testGenerator;
  }
);
