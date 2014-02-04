define([
  "require",
  "dojo/string",
  "ppwcode-vernacular-semantics/EnumerationValue"
],
  function (require, string, EnumerationValue) {


    var TrafficSign = EnumerationValue.declare(
      {

        // _dir: String
        //   Directory in base path.
        _typeDir: null,

        // url: String
        url: null,

        constructor: function (/*Object*/ kwargs) {
          var pre;
          this._c_pre(function () {
            pre = this._c_prop_mandatory(kwargs, "representation");
            return pre;
          });
          this._c_pre(function () {
            pre = this._c_prop_string(kwargs, "representation");
            return pre;
          });
          this._c_pre(function () {
            pre = !kwargs.filename || this._c_prop_string(kwargs, "filename");
            return pre;
          });
          if (kwargs.filename) {
            this.url = this.urlBuildSymbol(this._typeDir, kwargs.filename);
          }
        },

        urlBuildSymbol: function (/*String*/ dir, /*String*/ fileName) {
          var umgsrc = "demo/img/${0}/${1}.jpg";
          return require.toUrl(string.substitute(umgsrc, [dir, fileName])).toString();

        },

        getLabel: function () {
          return this.getValue();
        }
      }
    );
    TrafficSign.WARNING = EnumerationValue.declare(
      TrafficSign,
      {_typeDir: "warning-signs-jpg"},
      [
        {representation: "warning", filename: "501"},
        {representation: "warning_stop", filename: "502"},
        {representation: "warning_give_way", filename: "503"},
        {representation: "warning_croas", filename: "504.1"},
        {representation: "warning_croas_left", filename: "504.1L"},
        {representation: "warning_croas_right", filename: "504.1R"},

        {representation: "warning_t_croas_left", filename: "505.1"},
        {representation: "warning_t_croas_right", filename: "505.1R"}

      ]
    );

    TrafficSign.DIRECTION = EnumerationValue.declare(
      TrafficSign,
      {_typeDir: "direction-and-tourist-signs-jpg"},
      [
        {representation: "direction_823V", filename: "823V"},
        {representation: "direction_823VR", filename: "823VR"},
        {representation: "direction_824V", filename: "824V"},
        {representation: "direction_824VR", filename: "824VR"}

      ]
    );

    return TrafficSign;
  }
);
