// modules -> preference

import {
  get,
  add,
  Event,
} from 'realdom';

import {
  hasProperty,
  ucfirst,
} from 'bellajs';


const OPTS = {
  numbers: 0,
  sentences: 0,
  punctiations: 0
};

const ORDER = [
  'numbers', 'sentences', 'punctiations'
];

const saveOptions = () => {
  let changed = false;
  const opts = {};
  for (let i = 0; i < ORDER.length; i++) {
    const k = ORDER[i];
    if (hasProperty(OPTS, k)) {
      const cval = OPTS[k];
      const id = '_' + k;
      const input = get(id);
      const nval = input.checked ? 1 : 0;
      opts[k] = nval;
      if (nval !== cval) {
        changed = true;
      }
    }
  }

  if (changed) {
    OPTS = opts;
    storage.set('options', opts);
  }
};

