define(["../_util/contracts/doh", "../Value", "dojo/_base/declare",
  "./valueTestGenerator", "module"],
  function (doh, Value, declare,
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
    }
    ValueStub.parse = function(str) {
      return (str || str === "") ? new ValueStub1({data: str}) : null;
    }
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

    function test_CoerceToData(/*Value*/ v1, /*Type?*/ type, expectResult) {
      var result = _coerceTo(v1, type);
      doh.assertEqual(result.data, expectResult);
    }

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

    doh.register(Value.mid,
      [
        {
          name: "Constructor test", // don't name a test "constructor"; it kills everything :-(
          runTest: function () {
            var subject = getTestSubject();
            doh.validateInvariants(subject);
          }
        }
      ].concat(valueTestGenerator(
          getTestSubject,
          getTestSubjectSameTypeOtherDataLarger,
          getTestSubjectOtherTypeSameData
        ))
    );
  }
);
