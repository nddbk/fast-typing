/**
 * sentence.js
 * sentence service
 * @ndaidong
 */

/* eslint no-console: 0 */
/* eslint func-names: 0 */

Box.Application.addService('sentence', function() {

  'use strict';

  var consolnants = [
    'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y'
  ];
  var vowels = [
    'a', 'e', 'i', 'o', 'u', 'y'
  ];
  var vowelCombinations = [
    'ay', 'au', 'aw', 'augh', 'wa', 'all', 'ald', 'alm', 'alt',
    'ee', 'ea', 'eu', 'ew', 'ei', 'ey', 'eigh',
    'ie', 'ye', 'igh', 'ign', 'ind',
    'oo', 'oa', 'oe', 'oi', 'oy', 'old', 'olk', 'olt', 'oll', 'ost', 'ou', 'ow',
    'ue', 'ui'
  ];

  var isConsolnant = function(c) {
    return Bella.contains(consolnants, c);
  };

  var isVowel = function(c) {
    return Bella.contains(vowels, c);
  };

  var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  var pick = function(range, probability) {
    var k = getRandomInt(0, range.length);
    var r = getRandomInt(0, 100);
    var p = probability || 100;
    if (r <= p) {
      return range[k];
    }
    return false;
  };

  function word(size) {
    var chars = [];
    while (chars.length < size) {
      var c;
      if (!chars.length) {
        c = pick(vowels, 30);
        if (!c) {
          c = pick(vowelCombinations, 20);
        }
        if (!c) {
          c = pick(consolnants);
        }
      } else {
        var lastChar = chars[chars.length - 1];
        if (isConsolnant(lastChar)) {
          c = pick(vowels);
        } else if (isVowel(lastChar)) {
          c = pick(consolnants);
        }
      }
      chars.push(c);
    }
    return chars.join('');
  }

  function sentence(n) {
    var words = [], i;
    for (i = 0; i < n; i++) {
      var t = 1 + Math.floor(Math.random() * 3 + Math.random() * 3 + Math.random() * 3);
      var w = word(t);
      if (i === 0) {
        w = Bella.ucfirst(w);
      }
      words.push(w);

      // add random , into the sentence
      if (i < n - 1 && Math.random() < 0.1) {
        words.push(',');
      }
    }

    // add random ,.?! at the and of the sentence
    if (Math.random() < 0.2) {
      if (Math.random() < 0.3) {
        words.push('!');
      } else {
        words.push('?');
      }
    } else {
      words.push('.');
    }

    var s = words.join(' ');
    s = s.replace(/\s(\.|!|\?|,)/gi, '$1');
    return s;
  }

  function paragraph(n) {
    var sentences = [], i;
    for (i = 0; i < n; i++) {
      sentences.push(sentence(4 + Math.floor(Math.random() * 10)));
    }
    return sentences.join(' ');
  }

  var get = function(size) {
    console.log(paragraph(size));
  };

  return {
    get: get
  };
});
