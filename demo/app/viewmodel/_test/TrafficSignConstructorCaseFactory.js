define(["dojo/_base/declare",
        "ppwcode-vernacular-semantics/_util/contracts/CaseFactory", "../_contract/TrafficSignConstructor"],
  function(declare, CaseFactory, Contract) {

    return declare([CaseFactory], {

      contract: new Contract(),

      subjectFactories: function() {
        var SubjectType = this.contract.SubjectType;
        return [function() {return SubjectType;}];
      },

      $allValues: function() {
        return [this.subjectFactories()];
      }

    });

  }
);
