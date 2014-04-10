define(["dojo/_base/declare", "ppwcode-vernacular-semantics/test/EnumerationValueCaseFactory",
        "../_contract/TrafficSign", "ppwcode-vernacular-semantics/EnumerationValue", "../TrafficSign",
       "module"],
  function(declare, EnumerationValueCaseFactory, Contract, EnumerationValue, TrafficSign, module) {

    var TrafficSignStub = EnumerationValue.declare(
      TrafficSign,
      {
        _typeDir: "DIRNAME"
      },
      [
        {representation: "repr", filename: "reprFILENAME"}
      ],
      module.id + "_Stub1"
    );

    return declare([EnumerationValueCaseFactory], {

      contract: new Contract(),

      typeSubjectFactories: function() {
        return [function() {return TrafficSignStub;}];
      },

      subjectFactories: function() {
        return TrafficSignStub.values();
      },

      $getUrl: function() {
        return [
          this.subjectFactories()
        ];
      }

    });

  }
);
