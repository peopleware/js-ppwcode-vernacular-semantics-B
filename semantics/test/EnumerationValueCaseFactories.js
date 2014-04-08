define(["dojo/_base/declare", "../EnumerationValue", "./ValueCaseFactories", "./EnumerationValueMethodTests", "./TransformerCaseFactories", "module"],
  function(declare, EnumerationValue, ValueCaseFactories, EnumerationValueMethodTests, TransformerCaseFactories, module) {


    // Abstract functions are not tested.
    var EnumerationValueStub1 = EnumerationValue.declare(
      {},
      ["first", "second", "third"],
      module.id + "_1"
      // bundle is standard
    );

    var EnumerationValueStub2 = EnumerationValue.declare(
      {},
      ["alpha", "beta", "gamma"],
      module.id + "_2",
      "EnumerationValue_2"
    );





    return declare([ValueCaseFactories], {

      contract: new EnumerationValueMethodTests(),

      // typeCaseFactories: TransformerCaseFactories
      typeCaseFactories: null,

      subjectFactories: function() {
        return EnumerationValueStub1.values().concat(EnumerationValueStub2.values());
      },

      otherOfSameTypeFactories: function() {
        return this.subjectFactories();
      },

      $constructor: function() {
        return [];
      },

      $isValueOf: function() {
        return [
          this.subjectFactories(),
          {
            name: "EnumDef",
            factories: [
              {
                name: "EnumerationValueStub1",
                factory: function() {return EnumerationValueStub1;}
              },
              {
                name: "EnumerationValueStub2",
                factory: function() {return EnumerationValueStub2;}
              },
              {},
              {
                name: "not an EnumerationValue Type",
                factory: {someOtherObject: "a test"}
              },
              {
                name: "not an EnumerationValue Type",
                factory: {first: EnumerationValueStub1.first, second: 4}
              },
              {
                name: "not an EnumerationValue Type function",
                factory: function() {
                  var aFunction = function() {};
                  aFunction.someOtherObject = "a test";
                  return aFunction;
                }
              }
            ]
          }
        ];
      },

      $toJSON: function() {
        return [this.subjectFactories()];
      },

      $getLabel: function() {
        var formatOptionFactories = this.formatOptionsFactories();
        formatOptionFactories.factories.push("");
        formatOptionFactories.factories.push("nl");
        formatOptionFactories.factories.push("ru");
        return [
          this.subjectFactories(),
          formatOptionFactories
        ];
      }

    });

  }
);
