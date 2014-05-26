define(["dojo/_base/declare", "../EnumerationValue",
        "../_util/contracts/CaseFactory", "../_contract/EnumerationValueConstructor",
        "module"],
  function(declare, EnumerationValue,
           CaseFactory, Contract,
           module) {

    var EnumerationValueStub1 = EnumerationValue.declare(
      {},
      ["first", "second", "third"],
      module.id + "_Stub1"
      // bundle is standard
    );

    return declare([CaseFactory], {

      contract: new Contract(),

      subjectFactories: function() {
        return [function() {return EnumerationValue;}];
      },

      $declare: function() {
        return [
          this.subjectFactories(),
          {
            name: "SuperType",
            canBeSkipped: true,
            factories: [
              function() {return EnumerationValueStub1;}
            ]
          },
          {
            name: "prototypeDef",
            factories: [
              undefined,
              null,
              {},
              {someProperty: "SOME PROPERTY VALUE"}
            ]
          },
          {
            name: "valueDefinitions",
            factories: [
              undefined,
              null,
              [],
              {},
              ["alpha", "beta", "gamma"],
              [
                {representation: "1", someProp: 5},
                {representation: "2", someProp: 5},
                {representation: "3", someProp: 7, someOtherProp: new Date()}
              ],
              {
                one: {representation: "1", someProp: 5},
                two: {representation: "2", someProp: 5},
                three: {representation: "3", someProp: 7, someOtherProp: new Date()}
              }
              // precondition violation ["aleph", "aleph"],
              /* precondition violation
              {
                blue: {representation: "0000FF"},
                two: {representation: "0000FF"}
              }
              */
            ]
          },
          {
            name: "mod",
            factories: [undefined, null, "", {id: "someMid"}, "aMid"]
          },
          {
            name: "bundleName",
            factories: [undefined, null, "", "ABundleName"]
          }
        ];
      }

    });

  }
);
