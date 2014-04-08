define(["../_util/contracts/createTests"],
  function (createTests) {

    return function(methodTests, /*Function[]*/ subjectFactories) {

      createTests(methodTests, "getTypeDescription", [subjectFactories]);

    };

  }
);
