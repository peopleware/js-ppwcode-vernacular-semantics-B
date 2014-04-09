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

define(["dojo/_base/declare", "./Value", "./ParseException",
        "./_util/js", "dojo/i18n", "dojo/_base/kernel", "dojo/_base/lang", "module"],
  function(declare, Value, ParseException,
           js, i18n, kernel, lang, module) {

    function dirFromMid(mid) {
      // summary:
      //   Helper function to get the directory from a MID

      var parts = mid.split("/");
      parts.pop();
      return parts.join("/");
    }

    function getParentDirectory(/*Function*/ EnumValueConstructor) {
      if (!EnumValueConstructor._parentDirectory) {
        if (!EnumValueConstructor.mid) {
          throw "ERROR you must defined a property `mid` on the enumeration value constructor";
        }
        EnumValueConstructor._parentDirectory = dirFromMid(EnumValueConstructor.mid);
      }
      return EnumValueConstructor._parentDirectory;
    }

    function getBundleName(/*Function*/ EnumValueConstructor) {
      return EnumValueConstructor.bundleName || EnumValueConstructor.mid.split("/").pop();
    }

    function getBundle(/*Function*/ EnumValueConstructor, /*String*/ lang) {
      return i18n.getLocalization(
        getParentDirectory(EnumValueConstructor),
        getBundleName(EnumValueConstructor),
        lang
      );
    }

    function format(/*EnumerationValue?*/ v, /*Object?*/ options) {
      // summary:
      //   options.locale can be filled out; if not, the default locale is used.
      //   The key for label lookup is the value representation, possibly extended with
      //   options.keyExtension (`this._representation + "_" + options.keyExtension`).
      //   If no label is found, the representation itself is returned, if the key is not extended.
      //   A warning is issued if no label is found with a given extension.

      if (!v) {
        return null;
      }
      var lang = (options && options.locale) || kernel.locale;
      var actualKey = v._representation;
      if (options && options.keyExtension) {
        actualKey += "_" + options.keyExtension;
      }
      var result = getBundle(v.constructor, lang)[actualKey];
      if (!result && result !== "") {
        return !(options && options.keyExtension) ? v._representation : "?" + actualKey + "?";
      }
      return result;
    }

    var EnumerationValue = declare([Value], {
      // summary:
      //   Support for enum types.
      //   Values of enum types are communicated to and from the server as Strings in JSON.
      // description:
      //   Enumeration types should be defined as a hash of the EnumerationValues.
      //   This class thus defines the values, but not the type.
      //   This hash is referenced with a Capitalized name, like a Constructor (although it is an object,
      //   and not a function).
      //   Note that "" might be a valid representation of an enumeration value.
      //   It can therefore not be used to represent "no value". For this, we need to use
      //   null or undefined.
      //   An enumeration value can have a label (a human representation) that is different in different
      //   languages. To enable this, place a set of nls files in the nls directory next to the module
      //   defining the enumeration type with the same name as the module itself (or define the
      //   name used in `bundleName`). The Constructor needs to have a property `mid` containing the
      //   module id for this to work. The EnumerationValue Constructor then has a `format` and `parse`
      //   method, that can take an options-argument that has a locale in the regular way.
      //   If we don't find a locale in the options, we use the default locale.

      _c_invar: [
        function() {return js.typeOf(this.toJSON()) === "string" && this.toJSON() !== "";}
      ],

      // _representation: String
      //   The internal representation of the value.
      //   This string is used in communication to and from the server.
      _representation: null,

      constructor: function(/*Object*/ kwargs) {
        // summary:
        //   Private. Don't call the constructor of an EnumerationValue type.

        this._c_pre(function() {return this._c_prop_mandatory(kwargs, "representation");});
        this._c_pre(function() {return this._c_prop_string(kwargs, "representation");});

        this._representation = kwargs.representation;
      },

      isValueOf: function(/*Object*/ EnumDef) {
        // summary:
        //   Is this defined in `EnumDef`?
        // description:
        //   Similar to isInstanceOf.
        //   Note: with the current implementation of declare, we cannot overwrite isInstanceOf.
        //   (the declare definition of isInstanceOf overwrites anything we declare).

        return Object.keys(EnumDef).some(function(ed) {return EnumDef[ed] === this;}, this);
      },

      equals: function(/*EnumerationValue*/ other) {
        // summary:
        //   Referential equality.

        return this.inherited(arguments) && this === other;
      },

      getValue: function() {
        return this._representation;
      },

      toJSON: function() {
        // summary:
        //   JSON.Stringify hook.
        //   See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior

        return this._representation;
      },

      compare: function(other) {
        // summary:
        //   Comparison based on getValue. Can be overridden.
        if (!other) {
          return -1;
        }
        return this.equals(other) ? 0 : (this.getValue() < other.getValue() ? -1 : +1);
      },

      toString: function() {
        return this._representation;
      },

      getLabel: function(/*String|Object?*/ opt) {
        // summary:
        //   Shortcut to EnumerationValue.format(this, {locale: lang});
        // opt: String|Object?
        //   If a string, the locale.
        //   If an object, format options. See EnumerationValue.format

        return format(this, js.typeOf(opt) === "object" ? opt : {locale: opt /* i.e., lang*/});
      }

    });

    function values(EnumDef) {
      // summary:
      //   The values of EnumDef as a an array.

      if (!EnumDef._values) {
        EnumDef._values = Object.keys(EnumDef)
          .filter(function(key) {
                    return key !== "superclass" &&
                           EnumDef[key] &&
                           EnumDef[key].isInstanceOf &&
                           EnumDef[key].isInstanceOf(EnumerationValue);
                  })
          .map(function(key) {return EnumDef[key];});
      }
      return EnumDef._values;
    }

    function isEnumJson(EnumDef, /*String?*/ json) {
      // summary:
      //   Is `json` the String representation of a value defined in EnumDef?
      //   Note: json must be the result of JSON.parse, not the naked JSON string.
      //   E.g., "MALE" would be a correct "json representation", not "\"MALE\"".

      return values(EnumDef).some(function(ev) {return ev._representation === json;});
    }

    function enumRevive(EnumDef, json) {
      // summary:
      //   Revive a json String value into the appropriate
      //   EnumDef value.
      // description:
      //   Returns undefined if no such value is found.
      //   *Note that `enum` is a reserved word.*
      //   https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Reserved_Words

      // pre: json is a String;
      // pre: isEnumJson(EnumDef, json);

      if (!json) {
        return undefined;
      }
      var match = Object.keys(EnumDef).filter(function(ed) {return EnumDef[ed]._representation === json;});
      if (match.length > 1) {
        throw "Error: there are different values in enum type " + EnumDef + " with the same value.";
      }
      if (match.length < 1) {
        return undefined;
      }
      return EnumDef[match[0]]; // return EnumerationValue
    }

    function parse(/*Function*/ EnumValueConstructor, /*String*/ str, /*Object*/ options) {
      // summary:
      //   options.locale can be filled out; if not, the default locale is used.
      //   If no label is found, the representation itself is returned.

      if (!str && str !== "") {
        return null;
      }
      var lang = (options && options.locale) || kernel.locale;
      var bundle = getBundle(EnumValueConstructor, lang);
      var representation;
      for (representation in bundle) {
        //noinspection JSUnfilteredForInLoop
        if (bundle[representation] === str) {
          //noinspection JSUnfilteredForInLoop
          return enumRevive(EnumValueConstructor, representation);
        }
      }
      // if we get here, there was no match in the bundle; try the representation itself
      var possibleResult = enumRevive(EnumValueConstructor, str);
      if (possibleResult) {
        return possibleResult;
      }
      // nope, got no answer for you
      throw new ParseException({targetType: EnumValueConstructor, str: str, options: options});
    }

    function enumDeclare(/*Function?*/ SuperType,
                         /*Object*/ prototypeDef,
                         /*Array|Object*/ valueDefinitions,
                         /*module|String*/ mod,
                         /*String*/ bundleName) {
      if (js.typeOf(SuperType) !== "function") {
        // shift arguments
        //noinspection AssignmentToFunctionParameterJS,JSValidateTypes
        bundleName = mod;
        //noinspection AssignmentToFunctionParameterJS,JSValidateTypes
        mod = valueDefinitions;
        //noinspection AssignmentToFunctionParameterJS,JSValidateTypes
        valueDefinitions = prototypeDef;
        //noinspection AssignmentToFunctionParameterJS,JSValidateTypes
        prototypeDef = SuperType;
        //noinspection AssignmentToFunctionParameterJS,JSValidateTypes
        SuperType = EnumerationValue;
      }

      var Enum = declare([SuperType], prototypeDef);
      Enum._values = [];

      function create(instanceName, vDef) {
        var newValue = new Enum((js.typeOf(vDef) === "string") ? {representation: vDef} : vDef);
        Enum[instanceName] = newValue;
        Enum._values.push(newValue);
      }

      switch (js.typeOf(valueDefinitions)) {
        case "array":
          valueDefinitions.forEach(function(vDef) {
            create((js.typeOf(vDef) === "string") ? vDef : vDef.representation, vDef);
          });
          break;
        case "object":
          Object.keys(valueDefinitions).forEach(function(instanceName) {
            create(instanceName, valueDefinitions[instanceName]);
          });
          break;
        default:
          // NOP
      }
      Enum.isJson = lang.partial(isEnumJson, Enum);
      Enum.revive = lang.partial(enumRevive, Enum);
      Enum.values = lang.partial(values, Enum); // basic
      Enum.getBundle = lang.partial(getBundle, Enum);
      Enum.format = format;
      Enum.parse = lang.partial(parse, Enum);
      if (mod) {
        Enum.mid = (js.typeOf(mod) === "object") ? mod.id : mod;
      }
      if (bundleName) {
        Enum.bundleName = bundleName;
      }
      return Enum;
    }

    EnumerationValue.mid = module.id;
    EnumerationValue.bundleName = null;
    EnumerationValue.declare = enumDeclare;

    return EnumerationValue;
  }
);
