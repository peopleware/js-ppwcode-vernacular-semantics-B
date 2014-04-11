define(["dojo/_base/declare",
        "./TrafficSignConstructorCaseFactory", "../_contract/TrafficSign_RegulatoryConstructor"],
  function(declare, CaseFactory, Contract) {

    return declare([CaseFactory], {

      contract: new Contract()

    });

  }
);
