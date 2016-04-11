/**
 * textpad.js
 * textpad module
 * @ndaidong
 */

/* eslint no-console: 0 */
/* eslint func-names: 0 */

Box.Application.addModule('textpad', function() {

  var wordlist = Box.Application.getService('wordlist');

  var $textpad, $typingArea;

  var isActivated = true;
  var strInput = '';
  var characters = [];
  var cursor = 0;
  var startTime = 0;
  var endTime = 0;
  var totalTime = 0;
  var error = 0;
  var correct = 0;
  var totalChars = 0;
  var totalWords = 0;

  var start, end, restart, reset;

  reset = function() {
    strInput = '';
    characters = [];
    cursor = 0;
    startTime = 0;
    endTime = 0;
    totalTime = 0;
    error = 0;
    correct = 0;
    totalChars = 0;
    totalWords = 0;
    $typingArea.empty();
  };

  start = function() {
    startTime = Bella.time();
    totalChars = strInput.length;
    totalWords = strInput.split(' ').length;
  };

  end = function() {
    endTime = Bella.time();
    totalTime = endTime - startTime;
    console.log('totalTime: %s', totalTime);
    console.log('totalChars: %s', totalChars);
    console.log('totalWords: %s', totalWords);
    console.log('error: %s', error);
    console.log('correct: %s', correct);
    restart();
  };

  var moveCursor = function(k) {

    if (k < 0 || k > characters.length) {
      return false;
    }

    Bella.dom.all('.cursor').forEach(function(item) {
      item.removeClass('cursor');
    });

    if (k >= 0 && k < characters.length) {
      var el = Bella.dom.get('c_' + k);
      el.addClass('cursor');
      cursor = k;
    }

    if (k === 0) {
      start();
    }
    if (k === characters.length) {
      end();
    }
    return cursor;
  };

  var moveBack = function() {
    if (cursor > 0) {
      cursor--;
      var prevChar = characters[cursor];
      var el = Bella.dom.get(prevChar.id);

      if (el.hasClass('correct')) {
        correct--;
        el.removeClass('correct');
      } else if (el.hasClass('error')) {
        error--;
        el.removeClass('error');
      }
      moveCursor(cursor);
    }
  };

  var moveNext = function(char) {
    if (cursor < characters.length) {
      cursor++;
      var prevChar = characters[cursor - 1];
      var el = Bella.dom.get(prevChar.id);
      if (prevChar.char === char) {
        el.addClass('correct');
        correct++;
      } else {
        el.addClass('error');
        error++;
      }
      moveCursor(cursor);
    }
  };

  var handleAction = function(evt) {
    if (!isActivated) {
      return false;
    }
    var e = evt || window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode === 8) {
      Bella.event.stop(evt);
      return moveBack();
    }
    return e;
  };

  var handleText = function(evt) {
    if (!isActivated) {
      return false;
    }
    var e = evt || window.event;
    var keyCode = e.keyCode || e.which;
    var chr = String.fromCharCode(keyCode);
    return moveNext(chr);
  };

  var render = function(s) {
    reset();
    strInput = s;
    var a = s.split('');
    var i = 0;
    a.forEach(function(c) {
      var id = 'c_' + i;
      var span = Bella.dom.add('SPAN', $typingArea);
      span.id = id;
      span.innerHTML = c;
      characters.push({
        index: i,
        id: id,
        char: c
      });
      i++;
    });
    moveCursor(0);
  };

  var load = function(text) {
    var s = text;
    if (!s) {
      var a = wordlist.get(5);
      s = a.join(' ');
    }
    render(s);
  };

  restart = function() {
    load();
  };

  var init = function() {
    $textpad.focus();
    Bella.event.on(document.body, 'click', function() {

      isActivated = false;
      var focused = document.activeElement;
      if (!focused || focused === document.body) {
        focused = null;
      } else if (document.querySelector) {
        focused = document.querySelector(':focus');
      }

      if (!isActivated && focused && focused.id === 'textpad') {
        isActivated = true;
      }
    });

    Bella.event.on(document, 'keydown', handleAction);
    Bella.event.on(document, 'keypress', handleText);
  };

  return {
    init: function() {
      $textpad = Bella.dom.get('textpad');
      $typingArea = Bella.dom.get('typingArea');
      init();
      load();
    },
    load: load
  };
});
