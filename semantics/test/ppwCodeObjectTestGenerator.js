define(["../_util/contracts/createTests"],
  function (createTests) {

    return function(groupId, methodTests, /*Function[]*/ subjectFactories) {

      createTests(groupId, methodTests, "getTypeDescription", [subjectFactories]);

    };

  }
);
