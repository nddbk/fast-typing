/**
 * start.js
 * Init app
 * @ndaidong
 */

/* eslint no-console: 0 */
/* eslint func-names: 0 */

(function _init() {

  'use strict';

  var App = Box.Application || {};

  App.on('error', function _onError(event) {
    var exception = event.exception;
    console.log(exception);
  });

  App.init({
    debug: true,
    defaultTextLength: 80,
    capitalLetters: false, // ABCDE
    digitNumbers: false, // 0123456789
    punctuationChars: false, // .,;:"'!?/()-
    specialChars: false // @#~`<>{}()|&!$%^+-*\/:=[],.;"'
  });

})();
