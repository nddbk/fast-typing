/**
 * start.js
 * Init app
 * @ndaidong
 */

/* eslint no-console: 0 */

(() => {

  'use strict';

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
