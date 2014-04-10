define(["dojo/_base/declare", "./TrafficSign_RegulatoryCaseFactory", "../_contract/TrafficSign_WARNING"],
  function(declare, TrafficSign_RegulatoryCaseFactory, Contract) {

    return declare([TrafficSign_RegulatoryCaseFactory], {

      contract: new Contract()

    });

  }
);
