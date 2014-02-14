define(["../_util/contracts/doh", "../Value", "dojo/_base/declare", "module"],
  function (doh, Value, declare, module) {

    // Abstract functions are not tested.
    var ValueStub = declare([Value], {

      _data: null,

      constructor: function(props) {
        this._data = props.data;
      },

      equals: function(/*Value*/ other) {
        return this.inherited(arguments) && (other._data === this._data);
      },

      compare: function(other) {
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
    ValueStub2.mid = module.id + "_ValueStub2";

    function test_Equals(/*Value*/ v1, /*Value?*/ v2, /*Boolean?*/ expectEquals) {
      var result = v1.equals(v2);
      doh.validateInvariants(v1);
      if (v2 && v2.isInstanceOf && v2.isInstanceOf(Value)) {
        doh.validateInvariants(v2);
      }
      // postconditions
      // we expect not equal, unless it is said it should be
      doh.is(result, !!expectEquals);
    }

    doh.register(Value.mid, [
      {
        name: "Constructor test", // don't name a test "constructor"; it kills everything :-(
        runTest: function () {
          var subject = new ValueStub({data: "TEST"});
          doh.validateInvariants(subject);
        }
      },
      {
        name: "equals with null",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          test_Equals(subject, null);
        }
      },
      {
        name: "equals with undefined",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          test_Equals(subject, undefined);
        }
      },
      {
        name: "equals with me",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          test_Equals(subject, subject, true);
        }
      },
      {
        name: "equals with object of same type, expect equals",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          var other = new ValueStub1({data: "TEST"});
          test_Equals(subject, other, true);
        }
      },
      {
        name: "equals with object of same type, expect not equals",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          var other = new ValueStub1({data: "OTHER"});
          test_Equals(subject, other);
        }
      },
      {
        name: "equals with object of other type",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          var other = new ValueStub2("TEST");
          test_Equals(subject, other);
        }
      },
      {
        name: "equals with not-a-value Number",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          test_Equals(subject, 4);
        }
      },
      {
        name: "equals with not-a-value String",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          test_Equals(subject, "TEST");
        }
      },
      {
        name: "equals with not-a-value Date",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          test_Equals(subject, new Date());
        }
      },
      {
        name: "equals with not-a-value Function",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          test_Equals(subject, window.open);
        }
      },
      {
        name: "equals with not-a-value object",
        runTest: function () {
          var subject = new ValueStub1({data: "TEST"});
          test_Equals(subject, window);
        }
      }

      /*
        canCoerceTo must not be tested: basic
        test coerceTo, from a Stub1 (default) and from a Stub2 (with the extended canCoerceTo
        all in different cases
       */

    ]);
  }
);
