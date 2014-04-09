define(["dojo/_base/declare", "./TrafficSignCaseFactory", "../_contract/TrafficSign_Regulatory"],
  function(declare, TrafficSignCaseFactory, Contract) {

    return declare([TrafficSignCaseFactory], {

      contract: new Contract(),

      typeSubjectFactories: function() {
        var SubjectType = this.contract.SubjectType;
        return [function() {return SubjectType;}];
      },

      subjectFactories: function() {
        return this.contract.SubjectType.values();
      }

    });

  }
);
