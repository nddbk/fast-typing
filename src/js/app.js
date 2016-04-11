/**
 * start.js
 * Init app
 * @ndaidong
 */

/* eslint no-console: 0 */
/* eslint func-names: 0 */

(function _init() {

  var App = window.App = Box.Application || {};

  App.on('error', function _onError(event) {
    var exception = event.exception;
    console.log(exception);
  });

  App.init({
    debug: true
  });

})();
