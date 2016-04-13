/**
 * FastTyping
 * @ndaidong
 */

/* global chrome */

chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create('blank.html', {
    'outerBounds': {
      'width': 700,
      'height': 400
    }
  });
});
