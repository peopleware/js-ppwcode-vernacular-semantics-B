define(["../_util/contracts/doh", "../PpwCodeObject", "module"],
  function (doh, PpwCodeObject, module) {
    doh.register("tests.semantics.PpwCodeObject", [
      {
        // module level in boot
        // injected with has["logLevel-log.test.test-logger"] = "TRACE";
        name: "getTypeDescription",
        runTest: function (t) {
          t.assertTrue(logger != null);
          // level test via has
          t.assertEqual(logFactory.getInitialLogLevelFor(logger.name), "TRACE");
          // module test logger module should be the same as current module
          t.assertEqual(logFactory.loggerName2Mid(logger.name), module.id);
        }
      },
      {
        name: "TEST[Logger with ID injected via plugin]",
        runTest: function(t) {
          t.assertTrue(testLogger != null);
          t.assertEqual("WARN", testLogger.getLevel());
          t.assertEqual("testLoggerName", testLogger.name);
        }
      }
    ]);
  }
);
