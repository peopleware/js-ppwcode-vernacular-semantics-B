define(["dojo/_base/declare", "./PpwCodeObjectCaseFactories", "./ValueMethodTests", "module"],
  function(declare, PpwCodeObjectCaseFactories, ValueMethodTests, module) {



    // Abstract functions are not tested.
    var ValueStub = declare([ValueMethodTests.prototype.SubjectType], {

      _data: null,

      constructor: function(props) {
        this._data = props.data;
      },

      equals: function(/*Value*/ other) {
        return this.inherited(arguments) && (other._data === this._data);
      },

      compare: function(/*Value*/ other) {
        return this._data < other._data ? -1 : (this._data === other._data ? 0 : +1);
      },

      getValue: function() {
        return this._data;
      }

    });
    ValueStub.format = function(v) {
      return v ? v._data : null;
    };
    ValueStub.parse = function(str) {
      return (str || str === "") ? new this({data: str}) : null;
    };
    ValueStub.mid = module.id + "_ValueStub";



    var ValueStub1 = declare(
      [ValueStub], {

      }
    );
    ValueStub1.format = ValueStub.format;
    ValueStub1.parse = ValueStub.parse;
    ValueStub1.mid = ValueStub.mid + "1";



    var ValueStub2 = declare([ValueStub], {

      _coerceTo: function(/*Function*/ Type) {
        if (Type === ValueStub1) {
          return new ValueStub1({data: this.data});
        }
        return this.inherited(arguments);
      },

      canCoerceTo: function() {
        // summary:
        //   Array of the types this can coerceTo. Types to which we coerce with more
        //   of our information intact should come earlier than types to which we coerce
        //   with more loss of information.

        return this.inherited(arguments).concat([ValueStub1]);
      }

    });
    ValueStub2.format = ValueStub.format;
    ValueStub2.parse = ValueStub.parse;
    // no MID



    var ValueStub3 = declare([ValueStub], {

      _coerceTo: function(/*Function*/ Type) {
        if (Type === ValueStub2) {
          return new ValueStub2({data: this.data});
        }
        return this.inherited(arguments);
      },

      canCoerceTo: function() {
        // summary:
        //   Array of the types this can coerceTo. Types to which we coerce with more
        //   of our information intact should come earlier than types to which we coerce
        //   with more loss of information.

        return this.inherited(arguments).concat([ValueStub2]);
      }

    });
    ValueStub3.format = ValueStub.format;
    ValueStub3.parse = ValueStub.parse;



    return declare([PpwCodeObjectCaseFactories], {

      contract: new ValueMethodTests(),

      subjectFactories: function() {
        return [
          function() {
            return new ValueStub1({data: "TEST"});
          }
        ];
      },

      otherOfSameTypeFactories: function() {
        return [
          function() {
            return new ValueStub1({data: "T_OTHER"});
          }
        ];
      },

      formatOptionsFactories: function() {
        return {
          name: "options",
          factories: [
            null,
            undefined,
            function() {return {locale: "nl"};},
            {
              name: "options.locale === ru --> fallback language",
              factory: function() {return {locale: "ru"};}
            }
          ]
        };
      },

      $constructor: function() {
        return [
          [
            function() {return ValueStub1;}
          ],
          {
            name: "kwargs",
            factories: [
              function() {return {data: "CONSTRUCTOR TEST"};}
            ]
          }
        ];
      },

      $compare: function() {
        return [
          this.subjectFactories(),
          {
            name: "other",
            factories: [
              "$this",
              "$this()"
            ].concat(this.otherOfSameTypeFactories())
          }
        ];
      },

      $equals: function() {
        return [
          this.subjectFactories(),
          {
            name: "other",
            factories: [
              null,
              undefined,
              "$this",
              "$this()",
              {
                name: "object of other type",
                factory: function() {return new ValueStub2({data: "TEST"});}
              },
              {
                name: "not-a-value Number",
                factory: 4
              },
              {
                name: "not-a-value String",
                factory: "TEST"
              },
              {
                name: "not-a-value Date",
                factory: function() {return new Date();}
              },
              {
                name: "not-a-value Function",
                factory: function() {return window.open;}
              },
              {
                name: "not-a-value object",
                factory: function() {return window;}
              }
            ].concat(this.otherOfSameTypeFactories())
          }
        ];
      },

      $valueOf: function() {
        return [
          this.subjectFactories()
        ];
      },

      $getValue: function() {
        return [
          this.subjectFactories()
        ];
      },

      $coerceTo: function() {
        var self = this;
        return [
          this.subjectFactories(),
          {
            name: "Type",
            factories: [
              null,
              undefined,
              {
                name: "same type",
                factory: function() {return self.contract.SubjectType;}
              }
              //            {
              //              name: "coerceTo other type, supported, expect success",
              //              runTest: function () {
              //                var subject = createSubjectOtherTypeSameDataNoMid();
              //                var supportedOtherType = createSubject().constructor;
              //                instanceTests.coerceToData(subject, supportedOtherType, subject.data);
              //              }
              //            },
              //            {
              //              name: "coerceTo other type, not supported, expect fail",
              //              runTest: function () {
              //                var subject = getTestSubject();
              //                instanceTests.coerceTo(subject, ValueStub2, undefined);
              //              }
              //            },
              //            {
              //              name: "coerceTo other type (chaining), supported, expect success",
              //              runTest: function () {
              //                var subject = getTestSubjectChainingType();
              //                instanceTests.coerceToData(subject, ValueStub1, subject.data);
              //              }
              //            },
              //            {
              //              name: "coerceTo other type (chaining), not supported, expect failure",
              //              runTest: function () {
              //                var subject = getTestSubjectOtherTypeSameData();
              //                instanceTests.coerceTo(subject, ValueStub3, undefined);
              //              }
              //            },
            ]
          }
        ];
      },

      $format: function() {
        return [
          this.subjectFactories(),
          this.formatOptionsFactories()
        ];
      }

    });

  }
);
