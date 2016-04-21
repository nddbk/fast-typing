/**
 * start.js
 * Init app
 * @ndaidong
 */

(() => {

  'use strict';

  var App = Box.Application || {};

  App.on('error', (event) => {
    var exception = event.exception;
    console.log(exception); // eslint-disable-line no-console
  });

  App.init({
    debug: true,
    K: 0.123456789
  });

})();
