define(["../_util/contracts/doh", "../EnumerationValue", "dojo/_base/declare", "module"],
  function (doh, EnumerationValue, declare, module) {

    // Abstract functions are not tested.
    var EnumerationValueStub = declare([EnumerationValue], {

      _data: null,

      constructor: function (props) {
        this._data = props.data;
      },

      equals: function (/*Value*/ other) {
        return this.inherited(arguments) && (other._data === this._data);
      },

      compare: function (other) {
        return 0;
      },

      getValue: function () {
        return this._data;
      }

    });
  });
