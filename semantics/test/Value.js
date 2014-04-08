/*
 Copyright 2012 - $Date $ by PeopleWare n.v.

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

define(["../_util/contracts/doh", "../Value", "./ValueMethodTests", "dojo/_base/declare",
  "./valueTestGenerator", "module"],
  function (doh, Value, ValueMethodTests, declare,
            valueTestGenerator, module) {

    // Abstract functions are not tested.
    var ValueStub = declare([Value], {

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
      return (str || str === "") ? new ValueStub1({data: str}) : null;
    };
    ValueStub.mid = module.id + "_ValueStub";

    var ValueStub1 = declare([ValueStub], {

    });
    ValueStub1.format = ValueStub.format;
    ValueStub1.parse = ValueStub.parse;
    ValueStub1.mid = module.id + "_ValueStub1";

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

    function getTestSubject() {
      return new ValueStub1({data: "TEST"});
    }

    function getTestSubjectSameTypeOtherDataLarger() {
      return new ValueStub1({data: "T_OTHER"});
    }

    function getTestSubjectOtherTypeSameData() {
      return new ValueStub2({data: "TEST"});
    }

    function getTestSubjectChainingType() {
      return new ValueStub3({data: "CHAINED"});
    }

    function getNumericTestSubject() {
      return new ValueStub1({data: 0});
    }

    doh.register(Value.mid, [
      {
        name: "Constructor test", // don't name a test "constructor"; it kills everything :-(
        runTest: function () {
          var subject = getTestSubject();
          doh.validateInvariants(subject);
        }
      }
    ]);
    valueTestGenerator(
      new ValueMethodTests(),
      [
        getTestSubject,
        getTestSubjectSameTypeOtherDataLarger,
        getTestSubjectOtherTypeSameData
      ]
    );

  }
);
