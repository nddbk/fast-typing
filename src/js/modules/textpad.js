/**
 * textpad.js
 * textpad module
 * @ndaidong
 */

var App = Box.Application || {};

App.addModule('textpad', (context) => {

  'use strict';

  var Dom = Bella.dom;
  var Event = Bella.event;

  var defaultTextLength = 2;

  const FLAT_WORDS = 0; // default
  const CAPITAL_LETTERS = 1;
  const DIGIT_NUMBERS = 2; // 0123456789
  const PUNCTIATIONS = 3; // .,;:"'!?/()-
  const SPECIAL_CHARS = 4; // @#~`<>{}()|&!$%^+-*\/:=[],.;"'

  var mode = FLAT_WORDS;

  var generator = context.getService('generator');
  var storage = context.getService('storage');

  var updateBank = (ar) => {
    let sentences = storage.get('sentences') || [];
    let arr = sentences.concat(ar);
    let arrr = Bella.unique(arr);
    arrr = Bella.pick(arrr, 1000);
    storage.set('sentences', arrr);
  };

  var getSentences = () => {
    fetch('http://techpush.net/api/sentences').then((response) => {
      return response.text();
    }).then((txt) => {
      let o = JSON.parse(txt);
      if (o && o.sentences) {
        updateBank(o.sentences);
      } else {
        console.log(txt); // eslint-disable-line no-console
      }
    }).catch((error) => {
      console.log('Request failed', error); // eslint-disable-line no-console
    });
  };

  var $textpad, $typingArea;

  var isActivated = true;
  var strInput = '';
  var characters = [];
  var cursor = 0;
  var startTime = 0;
  var endTime = 0;
  var error = 0;
  var correct = 0;
  var mistake = 0;
  var totalChars = 0;
  var totalWords = 0;

  var start, end, restart, reset;

  reset = () => {
    strInput = '';
    characters = [];
    cursor = 0;
    startTime = 0;
    endTime = 0;
    error = 0;
    correct = 0;
    mistake = 0;
    totalChars = 0;
    totalWords = 0;
    $typingArea.empty();
  };

  start = () => {
    startTime = Bella.time();
    totalChars = strInput.length;
    totalWords = strInput.split(' ').length;
  };

  end = () => {
    endTime = Bella.time();
    context.broadcast('onfinished', {
      startTime: startTime,
      endTime: endTime,
      totalChars: totalChars,
      totalWords: totalWords,
      error: error,
      correct: correct,
      mistake: mistake
    });
    restart();
  };

  var moveCursor = (k) => {

    if (k < 0 || k > characters.length) {
      return false;
    }

    Dom.all('.cursor').forEach((item) => {
      item.removeClass('cursor');
    });

    if (k >= 0 && k < characters.length) {
      let el = Dom.get('c_' + k);
      el.addClass('cursor');
      cursor = k;
    }

    if (k === 0 || k === 1 && mistake === 0) {
      return start();
    }
    if (k === characters.length) {
      return end();
    }
    return context.broadcast('onpressed');
  };

  var moveBack = () => {
    if (cursor > 0) {
      cursor--;
      let prevChar = characters[cursor];
      let el = Dom.get(prevChar.id);

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

  var moveNext = (char) => {
    if (cursor < characters.length) {
      cursor++;
      let prevChar = characters[cursor - 1];
      let el = Dom.get(prevChar.id);
      if (prevChar.char === char) {
        el.addClass('correct');
        correct++;
      } else {
        el.addClass('error');
        error++;
        mistake++;
      }
      moveCursor(cursor);
    }
  };

  var handleAction = (evt) => {
    if (!isActivated) {
      return false;
    }
    let e = evt || window.event;
    let keyCode = e.keyCode || e.which;
    if (keyCode === 8) {
      Event.stop(evt);
      return moveBack();
    }
    return e;
  };

  var handleText = (evt) => {
    if (!isActivated) {
      return false;
    }
    let e = evt || window.event;
    let keyCode = e.keyCode || e.which;
    let chr = String.fromCharCode(keyCode);
    return moveNext(chr);
  };

  var render = (s) => {
    reset();
    strInput = s;
    let a = s.split('');
    let i = 0;
    a.forEach((c) => {
      let id = 'c_' + i;
      let span = Dom.add('SPAN', $typingArea);
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
    return context.broadcast('onstarted');
  };

  var toTextData = (arr) => {
    var r = [];
    if (mode === FLAT_WORDS) {
      r = arr.map((sen) => {
        return sen.replace(/[^a-zA-Z0-9\s]/g, '');
      });
    } else if (mode === CAPITAL_LETTERS) {
      r = [];
    } else if (mode === DIGIT_NUMBERS) {
      r = [];
    } else if (mode === PUNCTIATIONS) {
      r = [];
    } else if (mode === SPECIAL_CHARS) {
      r = [];
    }
    return r.join(' ');
  };

  var load = (text) => {
    let s = text;
    if (!s) {
      let sentences = storage.get('sentences') || [];
      if (sentences.length > 0) {
        s = toTextData(Bella.pick(sentences, defaultTextLength));
      } else {
        let a = generator.get(defaultTextLength);
        s = toTextData(a);
      }
    }
    render(s);
  };

  restart = () => {
    load();
  };

  var init = () => {
    $textpad.focus();
    Event.on(document.body, 'click', () => {

      isActivated = false;
      let focused = document.activeElement;
      if (!focused || focused === document.body) {
        focused = null;
      } else if (document.querySelector) {
        focused = document.querySelector(':focus');
      }

      if (!isActivated && focused && focused.id === 'textpad') {
        isActivated = true;
      }
    });

    Event.on(document, 'keydown', handleAction);
    Event.on(document, 'keypress', handleText);
  };

  return {
    init: () => {
      $textpad = Dom.get('textpad');
      $typingArea = Dom.get('typingArea');
      init();
      load();
      getSentences();
    },
    load: load
  };
});
