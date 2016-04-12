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

  var alphabet = consolnants.concat(vowels);

  var consolnantCombinations = [
    'bl', 'br',
    'ch', 'chr', 'chz', 'cl', 'cr', 'cz',
    'dr',
    'fl',
    'gh',
    'gr',
    'kn',
    'ph',
    'qu', 'qw',
    'sch', 'sh', 'sl', 'sm', 'st',
    'th', 'tr'
  ];

  var allConsolnants = consolnants.concat(consolnantCombinations);

  var vowelCombinations = [
    'ai', 'ao', 'au', 'ay',
    'ea', 'ee', 'ei', 'eu', 'ey',
    'ia', 'ie', 'io',
    'oo', 'oa', 'oe', 'oi', 'oy', 'ou',
    'ua', 'ue', 'ui', 'ua', 'uy',
    'ye'
  ];

  var allVowels = vowels.concat(vowelCombinations);

  var patterns = [
    'CVV', // Consonant Vowel Vowel, e.g: may, too
    'CVC', // Consonant Vowel Consonant, e.g: web, red, beg
    'CVCC', // Consonant Vowel Consonant Consonant, e.g: help, melt, weld
    'CVVC', // Consonant Vowel Vowel Consonant, e.g: seat, read
    'CVVCC' // Consonant Vowel Vowel Consonant Consonant, e.g:  field, read
  ];

  var endSounds = [
    '-Cate',
    '-Case',
    '-Cace',
    '-Came',
    '-Cake',
    '-Cache',
    '-Cage',
    '-Cain',
    '-Cail',
    '-Caise',
    '-Caid',
    '-Cait',
    '-Caight',
    '-Caint',
    '-Cave',
    '-Cable',
    '-Cadle',
    '-Cange',
    '-Cape',
    '-Caste',
    '-Canger',
    '-Carrow',
    '-Casis',
    '-Cazy',
    '-Cayer',
    '-Caying',
    '-Vche',
    '-Vcious',
    '-Ceigh',
    '-Ceight',
    '-Cein',
    '-Ceroic',
    '-Ceying',
    '-Ceyor',
    '-Ciche',
    '-Cide',
    '-Cidle',
    '-Cifle',
    '-Cigh',
    '-Cight',
    '-Cile',
    '-Cimb',
    '-Cime',
    '-Cind',
    '-Cine',
    '-Cise',
    '-Cite',
    '-Cisis',
    '-Citle',
    '-Cize',
    '-Cive',
    '-Cizon',
    '-Cycle',
    '-Coach',
    '-Coad',
    '-Coak',
    '-Coal',
    '-Coast',
    '-Coat',
    '-Coin',
    '-Coing',
    '-Cold',
    '-Colk',
    '-Cost',
    '-Cough',
    '-Counce',
    '-Count',
    '-Couse',
    '-Couth',
    '-Cow',
    '-Cowd',
    '-Cower',
    '-Cowing',
    '-Cowl',
    '-Cown',
    '-Vddle',
    '-Vght',
    '-Vndle',
    '-Vtial',
    '-Vtion',
    '-Vssion'
  ];

  var isVowel = function(c) {
    return Bella.contains(vowels, c);
  };

  var isConsolnant = function(c) {
    return !isVowel(c);
  };

  var isStartWithVowel = function(w) {
    var r = false;
    for (var i = 0; i < allVowels.length; i++) {
      var x = allVowels[i];
      if (w.startsWith(x)) {
        r = true;
        break;
      }
    }
    return r;
  };

  var isEndWithVowel = function(w) {
    var r = false;
    for (var i = 0; i < allVowels.length; i++) {
      var x = allVowels[i];
      if (w.endsWith(x)) {
        r = true;
        break;
      }
    }
    return r;
  };

  var pick = function(range, probability) {
    var k = Bella.random(0, range.length - 1);
    var r = Bella.random(0, 100);
    var p = probability || 100;
    if (r <= p) {
      return range[k];
    }
    return false;
  };

  function word(t) {
    var w = '';
    var c = [];
    var x = '';

    if (t === 1) {
      return pick(vowels);
    }

    if (t === 2) {
      x = pick(alphabet);
      c.push(x);
      if (isConsolnant(x)) {
        c.push(pick(allVowels));
      } else {
        c.push(pick(allConsolnants));
      }
      return c.join('');
    }

    var pts = [], candidates = [];

    if (t === 3) {
      pts = patterns.filter(function(item) {
        return item.length < 4;
      });

      pts.forEach(function(p) {
        p.split('').forEach(function(pos) {
          if (pos === 'C') {
            x += pick(consolnants);
          } else if (pos === 'V') {
            x += pick(vowels);
          }
        });
        candidates.push(x);
      });

      return Bella.pick(candidates);
    }

    if (t === 4) {
      pts = patterns.filter(function(item) {
        return item.length < 5;
      });

      pts.forEach(function(p) {
        p.split('').forEach(function(pos) {
          if (pos === 'C') {
            x = pick(consolnants);
          } else if (pos === 'V') {
            x = pick(vowels);
          }
        });
        candidates.push(x);
      });

      return Bella.pick(candidates);
    }

    patterns.forEach(function(p) {
      p.split('').forEach(function(pos) {
        if (pos === 'C') {
          x += pick(consolnants);
        } else if (pos === 'V') {
          x += pick(vowels);
        }
      });
      candidates.push(x);
    });

    w = Bella.pick(candidates);

    if (t > 6) {
      candidates = [];
      endSounds.forEach(function(p) {
        x = p.replace('-', '');
        x = x.replace('C', pick(allConsolnants));
        x = x.replace('V', pick(allVowels));
        candidates.push(x);
      });

      var wend = Bella.pick(candidates);
      if (isStartWithVowel(wend)) {
        if (isEndWithVowel(w)) {
          w += pick(consolnants);
        }
      } else if (!isEndWithVowel(w)) {
        w += pick(vowels);
      }
      w += wend;
    }

    return w;
  }

  function sentence(n) {
    var words = [], i;
    for (i = 0; i < n; i++) {
      var t = 1 + Math.floor(Math.random() * 3 + Math.random() * 3 + Math.random() * 3);
      var w = word(t);
      console.log(t);
      console.log(w);
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
