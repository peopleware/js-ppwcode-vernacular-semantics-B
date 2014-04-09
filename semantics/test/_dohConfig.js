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

// Executed as boot, before doh or dojo is loaded.
// See util/doh/_parseURLargs

// Just extend and overwrite dojoConfig, which is at this time
// known as window.require

// Finally, dojo will be loaded, and then we are of.


(function(){

  if (! window.require.has) {
    window.require.has = {};
  }
  window.require.has["running-doh"] = true;
  window.require.has["dojo-debug-messages"] = true;
  window.require.isDebug = true;

  // when sandbox === false, as it should be, there is no packages array yet
  window.require.packages = [
    {name: "ppwcode-vernacular-semantics",   location: "../../../semantics"}
  ];

  window.require["ppwcode-contracts-doh-initialization-done"] = true;
  console.log("loaded _dohConfig.js");

  console.log("starting load of dojo.js");
  var e = document.createElement("script");
  e.type = "text/javascript";
  e.src = "../../dojo/dojo.js";
  e.charset = "utf-8";
  document.getElementsByTagName("head")[0].appendChild(e);
  console.log("injection of dojo.js done");
}());
