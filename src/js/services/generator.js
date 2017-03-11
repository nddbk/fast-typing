/**
 * generator.js
 * @ndaidong
 */

Box.Application.addService('generator', (context) => {

  var storage = context.getService('storage');

  var pickMiddlePunc = () => {
    let p = ' ';
    let k = Math.random() * 1000;
    if (k < 50) {
      p = ':';
    } else if (k > 950) {
      p = '...';
    } else if (k > 300 && k < 500) {
      p = ',';
    } else if (k > 500 && k < 600) {
      p = '-';
    }
    return p;
  };

  var isNormalChar = (s) => {
    let spe = /@#~`<>\{\}\(\)\|&!\$%\^+-*\/:=\[\],\.;"\\''/;
    return !spe.test(s);
  };

  var insertPunc = (s) => {
    let a = s.split('');
    let b = [];
    let lastInsert = 0;
    for (let i = 0; i < a.length; i++) {
      let c = a[i];
      if (c === ' ' && lastInsert < i - 10) {
        let prev, next;
        if (i > 0) {
          prev = a[i - 1];
        }
        if (i < a.length - 1) {
          next = a[i + 1];
        }
        if (prev && isNormalChar(prev) && next && isNormalChar(next)) {
          let p = pickMiddlePunc();
          if (p !== ' ') {
            c = (p === '-' ? ' ' : '') + p + ' ';
            lastInsert = i;
          }
        }
      }
      b.push(c);
    }
    return b.join('');
  };

  var insertNumbers = (s) => {
    let a = s.split(' ');
    for (let i = 0; i < a.length; i += 3) {
      let k = Math.random() * 1000;
      if (k < 100) {
        a.splice(i, 0, Bella.random(9999, 999999));
      } else if (k > 900) {
        a.splice(i, 0, Bella.random(0, 999));
      } else if (k > 400 && k < 600) {
        a.splice(i, 0, Bella.random(999, 9999));
      }
    }

    return a.join(' ');
  };

  var attachBrackets = (w) => {
    return Bella.stabilize([
      `[${w}]`,
      `(${w})`,
      `{${w}}`,
      `<${w}>`,
      `"${w}"`,
      `'${w}'`
    ]).pick();
  };

  var insertSpecialPunc = (s) => {
    let a = s.split(' ');
    for (let i = 0; i < a.length; i += 3) {
      let w = a[i];
      if (isNormalChar(w)) {
        a[i] = attachBrackets(w);
      }
    }

    return a.join(' ');
  };

  var preprocess = (a, opt) => {
    let s = '';
    let r = [];

    let x = opt.numbers;
    let y = opt.sentences;
    let z = opt.punctiations;

    a.forEach((sen) => {
      if (x + y + z === 0) {
        sen = sen.toLowerCase();
        sen = sen.replace(/[^a-zA-Z0-9\s]/g, '');
      } else {
        if (x === 1) {
          sen = insertNumbers(sen);
        }
        if (y === 1) {
          sen = insertPunc(sen);
        }
        if (z === 1) {
          sen = insertSpecialPunc(sen);
        }
      }
      r.push(sen);
    });
    s = r.join(' ');
    return s;
  };

  var getTextString = () => {
    let a = [];
    while (a.length < 3) {
      a.push(txtgen.sentence());
    }
    let opts = storage.get('options') || {
      numbers: 0,
      sentences: 0,
      punctiations: 0
    };
    return preprocess(a, opts);
  };

  return {
    getTextString
  };
});
