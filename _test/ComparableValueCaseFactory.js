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

define(["dojo/_base/declare", "./ValueCaseFactory", "../_contract/ComparableValue", "module"],
  function(declare, ValueCaseFactory, ComparableValueContract, module) {



    // Abstract functions are not tested.
    var ValueStub = declare([ComparableValueContract.prototype.SubjectType], {

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





    return declare([ValueCaseFactory], {

      contract: new ComparableValueContract(),

      typeSubjectFactories: function() {
        return [function() {return ValueStub1;}];
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
      }

    });

  }
);
