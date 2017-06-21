/**
 * app.js
 * @ndaidong
 */

(() => {

  var App = Box.Application || {};

  App.on('error', (event) => {
    var exception = event.exception;
    console.log(exception);
  });

  App.init({
    debug: true,
    K: 0.123456789
  });

})();
