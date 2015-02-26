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

var profile = (function () { // jshint ignore:line

  //noinspection JSUnusedLocalSymbols
  function isTest(filename, mid) {
    return filename.indexOf("_test/") >= 0;
  }

  //noinspection JSUnusedLocalSymbols
  function isCopyOnly(filename, mid) {
    return filename.indexOf(".html") >= 0 || filename.indexOf("README.md") >= 0 || filename.indexOf("LICENSE.TXT") >= 0;
  }

  //noinspection JSUnusedLocalSymbols
  function isAmd(filename, mid) {
    return filename.indexOf(".json") < 0 && filename.indexOf(".js") >= 0 && filename.indexOf("profile.js") < 0;
  }

  return {
    resourceTags: {
      test: function (filename, mid) {
        return isTest(filename, mid);
      },

      copyOnly: function (filename, mid) {
        return isCopyOnly(filename, mid);
      },

      amd: function (filename, mid) {
        return !isTest(filename, mid) && !isCopyOnly(filename, mid) && isAmd(filename, mid);
      }
    }
  };
})();
