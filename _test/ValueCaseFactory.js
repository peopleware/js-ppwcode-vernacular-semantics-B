/*
 Copyright 2014 - $Date $ by PeopleWare n.v.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

define(["dojo/_base/declare", "./PpwCodeObjectCaseFactory", "../_contract/Value", "./TransformerCaseFactory", "dojo/_base/lang", "module"],
  function(declare, PpwCodeObjectCaseFactory, ValueContract, TransformerCaseFactory, lang, module) {



    // Abstract functions are not tested.
    var ValueStub = declare([ValueContract.prototype.SubjectType], {

      _data: null,

      constructor: function(props) {
        this._data = props.data;
      },

      equals: function(/*Value*/ other) {
        return this.inherited(arguments) && (other._data === this._data);
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





    return declare([PpwCodeObjectCaseFactory], {

      contract: new ValueContract(),

      // typeCaseFactory: TransformerCaseFactories
      typeCaseFactory: null,

      createTypeCaseFactory: function(kwargs) {
        return new TransformerCaseFactory({
          SubjectType: this.contract.SubjectType,
          typeTestCreator: kwargs.typeTestCreator,
          subjectFactories: lang.hitch(this, this.typeSubjectFactories),
          valueFactories: lang.hitch(this, this.subjectFactories),
          formatOptionsFactories: lang.hitch(this, this.formatOptionsFactories)
        });
      },

      typeSubjectFactories: function() {
        return [function() {return ValueStub1;}];
      },

      constructor: function(kwargs) {
        this.typeCaseFactory = this.createTypeCaseFactory(kwargs);
      },

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
                factory: function() {return function() {return "function is not a value";};}
              },
              {
                name: "not-a-value object",
                factory: function() {return {_data: "not a value"};}
              }
            ].concat(this.otherOfSameTypeFactories())
          }
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
