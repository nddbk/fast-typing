// helpers -> generator

import txtgen from 'txtgen';
import {randint} from 'bellajs';

import {getOptions} from './store';

const pickMiddlePunc = () => {
  let p = ' ';
  const k = Math.random() * 1000;
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

const isNormalChar = (s) => {
  const spe = /@#~`<>\{\}\(\)\|&!\$%\^+-*\/:=\[\],\.;"\\''/;
  return !spe.test(s);
};

const insertPunc = (s) => {
  const a = s.split('');
  const b = [];
  let lastInsert = 0;
  for (let i = 0; i < a.length; i++) {
    let c = a[i];
    if (c === ' ' && lastInsert < i - 10) {
      let prev;
      let next;
      if (i > 0) {
        prev = a[i - 1];
      }
      if (i < a.length - 1) {
        next = a[i + 1];
      }
      if (prev && isNormalChar(prev) && next && isNormalChar(next)) {
        const p = pickMiddlePunc();
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

const insertNumbers = (s) => {
  const a = s.split(' ');
  for (let i = 0; i < a.length; i += 3) {
    const k = Math.random() * 1000;
    if (k < 100) {
      a.splice(i, 0, randint(9999, 999999));
    } else if (k > 900) {
      a.splice(i, 0, randint(0, 999));
    } else if (k > 400 && k < 600) {
      a.splice(i, 0, randint(999, 9999));
    }
  }

  return a.join(' ');
};

const attachBrackets = (w) => {
  const arr = [
    `[${w}]`,
    `(${w})`,
    `{${w}}`,
    `<${w}>`,
    `"${w}"`,
    `'${w}'`,
  ];
  const k = randint(0, arr.length - 1);
  return arr[k];
};

const insertSpecialPunc = (s) => {
  const a = s.split(' ');
  for (let i = 0; i < a.length; i += 3) {
    const w = a[i];
    if (isNormalChar(w)) {
      a[i] = attachBrackets(w);
    }
  }

  return a.join(' ');
};

const preprocess = (a, opt) => {
  let s = '';
  const r = [];

  const x = opt.numbers;
  const y = opt.sentences;
  const z = opt.punctiations;

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


export const getTextString = () => {
  const a = [];
  while (a.length < 3) {
    a.push(txtgen.sentence());
  }
  const opts = getOptions();
  return preprocess(a, opts);
};
