define(["require", "dojo/string", "ppwcode-vernacular-semantics/EnumerationValue"],
  function (require, string, EnumerationValue) {

    var imgsrc = "demo/img/${0}/${1}.jpg";

    var TrafficSign = EnumerationValue.declare(
      {

        // _dir: String
        //   Directory in base path.
        _typeDir: null,

        // url: String
        url: null,

        // filename: String
        filename: null,

        constructor: function(/*Object*/ kwargs) {
          this._c_pre(function () {return !kwargs.filename || this._c_prop_string(kwargs, "filename");});

          if (kwargs.filename) {
            this.filename = kwargs.filename;
          }
        },

        getUrl: function() {
          return require.toUrl(string.substitute(imgsrc, [this._typeDir, this.filename])).toString();
        },

        getLabel: function () {
          return this.getValue();
        }
      }
    );

    TrafficSign.Regulatory = EnumerationValue.declare(
      TrafficSign,
      {
        name: null,
        code: null
      }
    );

    TrafficSign.MANDATORY = EnumerationValue.declare(
      TrafficSign.Regulatory,
      {_typeDir: "regulatory-signs/mandatory-signs"},
      [
        {representation: "proceed_left", filename: "606"},
        {representation: "proceed_right", filename: "606B"},
        {representation: "turn_left", filename: "609"},
        {representation: "turn_right", filename: "609A"},
        {representation: "roundabout", filename: "611.1"},
        {representation: "pass_either_side", filename: "611"}
      ]
    );

    TrafficSign.PROHIBITORY = EnumerationValue.declare(
      TrafficSign.Regulatory,
      {_typeDir: "regulatory-signs/prohibitory-signs"},
      [
        {representation: "stop", filename: "601.1"},
        {representation: "give_way", filename: "602"},
        {representation: "no_turn_right", filename: "612"},
        {representation: "no_turn_left", filename: "613"},
        {representation: "no_u-turn", filename: "614"},
        {representation: "no_entry", filename: "616"},
        {representation: "no_entry_both_directions", filename: "617"},
        {representation: "no_overtaking", filename: "632"},
        {representation: "max_speed_40", filename: "670"},
        {representation: "max_speed_20", filename: "670V20"},
        {representation: "max_speed_30", filename: "670V30"},
        {representation: "max_speed_50", filename: "670V50"},
        {representation: "max_speed_60", filename: "670V60"}
      ]
    );

    TrafficSign.WARNING = EnumerationValue.declare(
      TrafficSign.Regulatory,
      {_typeDir: "regulatory-signs/warning-signs"},
      [
        {representation: "crossroad_ahead", filename: "504.1"},
        {representation: "side_road_ahead_right", filename: "506.1"},
        {representation: "side_road_ahead_left", filename: "506.1L"},
        {representation: "bend_ahead_right", filename: "512"},
        {representation: "bend_ahead_left", filename: "512L"},
        {representation: "double_bend_ahead", filename: "513"},
        {representation: "road_narrows_both_sides", filename: "516"},
        {representation: "uneven_road_ahead", filename: "556"},
        {representation: "slippery_road_ahead", filename: "557"}

      ]
    );

    TrafficSign.DIRECTION = EnumerationValue.declare(
      TrafficSign,
      {_typeDir: "direction-signs"},
      [
        {representation: "zoo", filename: "2202"},
        {representation: "village", filename: "2203"},
        {representation: "tourist_info", filename: "2204"},
        {representation: "youth_hostel", filename: "2304"},
        {representation: "picknick", filename: "2306"},
        {representation: "services", filename: "2314.1"},
        {representation: "parking", filename: "2507"}

      ]
    );

    return TrafficSign;
  }
);
