/**
 * FastTyping
 * @ndaidong
 */

/* global chrome */

chrome.app.runtime.onLaunched.addListener(function _onLaunched() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 700,
      'height': 400
    }
  });
});
