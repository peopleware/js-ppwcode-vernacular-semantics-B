define(["../_util/contracts/doh", "../Value", "dojo/_base/declare", "./ppwCodeObjectTestGenerator",
  "./valueTestGenerator", "module"],
  function (doh, Value, declare, ppwCodeObjectTestGenerator,
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
        return 0;
      },

      getValue: function() {
        return this._data;
      }

    });
    ValueStub.mid = module.id + "_ValueStub";

    var ValueStub1 = declare([ValueStub], {

    });
    ValueStub1.mid = module.id + "_ValueStub1";

    var ValueStub2 = declare([ValueStub], {

      canCoerceTo: function() {
        // summary:
        //   Array of the types this can coerceTo. Types to which we coerce with more
        //   of our information intact should come earlier than types to which we coerce
        //   with more loss of information.

        return this.inherited(arguments).concat([ValueStub1]);
      }

    });

    function test_Compare(/*Value*/ v1, /*Value?*/ v2, /*Integer*/ expectCompare) {
      var result = v1.compare(v2);
      doh.validateInvariants(v1);
      if (v2 && v2.isInstanceOf && v2.isInstanceOf(Value)) {
        doh.validateInvariants(v2);
      }
      doh.is(result, expectCompare);
    }

    function getTestSubject() {
      return new ValueStub1({data: "TEST"});
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
      ].concat(ppwCodeObjectTestGenerator(
          function() {return new ValueStub1({data: "TEST WITH MID"});},
          function() {return new ValueStub2({data: "TEST NO MID"});}
        )).concat(valueTestGenerator(
          getTestSubject,
          function() {return new ValueStub1({data: "OTHER"});},
          function() {return new ValueStub2({data: "TEST"});}
        ))/*,
        {
          name: "compare with null",
          runTest: function () {
            var subject = getNumericTestSubject();
            test_Compare(subject, null, +1);
          }
        },
        {
          name: "compare with undefined",
          runTest: function () {
            var subject = getNumericTestSubject();
            test_Compare(subject, undefined, +1);
          }
        },
        {
          name: "compare with me",
          runTest: function () {
            var subject = getNumericTestSubject();
            test_Compare(subject, subject, 0);
          }
        },
        {
          name: "compare with larger",
          runTest: function () {
            var subject = getNumericTestSubject();
            var other = new ValueStub1({data: 10});
            test_Compare(subject, other, -1);
          }
        },
        {
          name: "compare with smaller",
          runTest: function () {
            var subject = getNumericTestSubject();
            var other = new ValueStub1({data: -5});
            test_Compare(subject, other, +1);
          }
        },
        {
          name: "compare with object of same type same value, expect equals",
          runTest: function () {
            var subject = getNumericTestSubject();
            var other = new ValueStub1({data: 0});
            test_Compare(subject, other, 0);
          }
        },
        {
          name: "compare with object of other type",
          runTest: function () {
            var subject = getNumericTestSubject();
            var other = new ValueStub2({data: "TEST"});
            test_Compare(subject, other, +1);
          }
        }*/

        /*
          canCoerceTo must not be tested: basic
          test coerceTo, from a Stub1 (default) and from a Stub2 (with the extended canCoerceTo
          all in different cases
         */
    );
  }
);
