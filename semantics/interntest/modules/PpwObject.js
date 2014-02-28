/**
 * Created by rrakhmetov on 28/02/14.
 */
define([
  'intern!object',
  'intern/chai!assert',
  '../../PpwCodeObject'
], function (registerSuite, assert, PpwCodeObject) {
  registerSuite({
    name: 'PpwCodeObject intern test',

    'PpwCodeObject constructor': function () {
      var ppwobj = new PpwCodeObject();
      assert.isNotNull(ppwobj,"PpwObject is not null");
    }
  });
});