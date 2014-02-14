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

    window.require.packages = window.require.packages.concat([
    {name: "ppwcode-vernacular-semantics",   location: "../../semantics"}
  ]);

  window.require["ppwcode-contracts-doh-initialization-done"] = true;
  console.log("loaded _dohConfig.js");

  console.log("starting load of dojo.js");
  var e = document.createElement("script");
  e.type = "text/javascript";
  e.src = "../../dojo/dojo.js";
  e.charset = "utf-8";
  document.getElementsByTagName("head")[0].appendChild(e);
  console.log("injection of dojo.js done");
})();
