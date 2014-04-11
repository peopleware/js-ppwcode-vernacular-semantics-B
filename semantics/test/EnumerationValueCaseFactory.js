define(["dojo/_base/declare", "../EnumerationValue", "../ComparableValue", "./ValueCaseFactory", "./EnumerationValueTypeCaseFactory",
        "dojo/_base/lang", "../_contract/EnumerationValue", "module"],
  function(declare, EnumerationValue, ComparableValue, ValueCaseFactory, EnumerationValueTypeCaseFactory,
           lang, Contract, module) {


    // Abstract functions are not tested.
    //noinspection JSCheckFunctionSignatures
    var EnumerationValueStub1 = EnumerationValue.declare(
      {},
      ["first", "second", "third"],
      module.id + "_Stub1"
      // bundle is standard
    );

    var EnumerationValueStub2 = EnumerationValue.declare(
      ComparableValue,
      {
        compare: function(other) {
          return this === other ? 0 : this._representation < other._representation ? -1 : +1;
        }
      },
      ["alpha", "beta", "gamma"],
      module.id + "_Stub2",
      "EnumerationValue_Stub2"
    );


    var EnumerationValueStub3 = EnumerationValue.declare(
      EnumerationValueStub1,
      {},
      ["aleph"],
      module.id + "_Stub3"
      // no bundle
    );




    return declare([ValueCaseFactory], {

      contract: new Contract(),

      createTypeCaseFactory: function(kwargs) {
        return new EnumerationValueTypeCaseFactory({
          SubjectType: this.contract.SubjectType,
          methodTestCreator: kwargs.methodTestCreator,
          subjectFactories: lang.hitch(this, this.typeSubjectFactories),
          valueFactories: lang.hitch(this, this.subjectFactories),
          formatOptionsFactories: lang.hitch(this, this.formatOptionsFactories)
        });
      },

      typeSubjectFactories: function() {
        return [
          function() {return EnumerationValueStub1;},
          function() {return EnumerationValueStub2;},
          function() {return EnumerationValueStub3;}
        ];
      },

      subjectFactories: function() {
        return EnumerationValueStub1.values()
          .concat(EnumerationValueStub2.values())
          .concat(EnumerationValueStub3.values());
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
            factories: this.typeSubjectFactories().concat([
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
            ])
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
