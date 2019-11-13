// modules -> textpad

import {
  queryAll,
  get,
  add,
  Event,
} from 'realdom';

import {getTextString} from '../helpers/generator';
import {
  init as initAnalyzer,
  onStarted,
  onPressed,
  onFinished,
} from '../helpers/analyzer';

const Loader = {
  load: () => {},
};

const state = {
  isActivated: false,
  text: '',
  characters: [],
  cursor: 0,
  mistake: 0,
  correct: 0,
  totalChars: 0,
  totalWords: 0,
  startTime: 0,
  endTime: 0,
};

const time = () => {
  return (new Date()).getTime();
};

const start = () => {
  state.startTime = time();
  state.totalChars = state.text.length;
  state.totalWords = state.text.split(' ').length;
};

const end = () => {
  state.endTime = time();
  onFinished(state);
  Loader.load();
};

const moveCursor = (k) => {
  const {
    characters,
    mistake,
  } = state;

  if (k < 0 || k > characters.length) {
    return false;
  }

  queryAll('.cursor').forEach((item) => {
    item.removeClass('cursor');
  });

  if (k >= 0 && k < characters.length) {
    const el = get('c_' + k);
    el.addClass('cursor');
    state.cursor = k;
  }

  if (k === 0 || k === 1 && mistake === 0) {
    return start();
  }
  if (k === characters.length) {
    return end();
  }
  return onPressed(state);
};

const moveBack = () => {
  let {
    cursor,
    characters,
  } = state;
  if (cursor > 0) {
    cursor--;
    const prevChar = characters[cursor];
    const el = get(prevChar.id);

    if (el.hasClass('correct')) {
      state.correct--;
      el.removeClass('correct');
    } else if (el.hasClass('error')) {
      state.error--;
      el.removeClass('error');
    }
    state.cursor = cursor;
    moveCursor(cursor);
  }
};

const moveNext = (chr) => {
  let {
    cursor,
    characters,
  } = state;
  if (cursor < characters.length) {
    cursor++;
    const prevChar = characters[cursor - 1];
    const el = get(prevChar.id);
    if (prevChar.letter === chr) {
      el.addClass('correct');
      state.correct++;
    } else {
      el.addClass('error');
      state.error++;
      state.mistake++;
    }
    state.cursor = cursor;
    moveCursor(cursor);
  }
};

const handleAction = (evt) => {
  if (!state.isActivated) {
    return false;
  }
  const e = evt || window.event;
  const keyCode = e.keyCode || e.which;
  if (keyCode === 8) {
    Event.stop(evt);
    return moveBack();
  }
  return e;
};

const handleText = (evt) => {
  if (!state.isActivated) {
    return false;
  }
  const e = evt || window.event;
  const keyCode = e.keyCode || e.which;
  const chr = String.fromCharCode(keyCode);
  return moveNext(chr);
};

const reset = () => {
  state.text = '';
  state.characters = [];
  state.cursor = 0;
  state.startTime = 0;
  state.endTime = 0;
  state.error = 0;
  state.correct = 0;
  state.mistake = 0;
  state.totalChars = 0;
  state.totalWords = 0;
  state.$typingArea.empty();
};

const render = (s) => {
  reset();
  state.text = s.trim();
  const a = s.split('');
  let i = 0;
  a.forEach((c) => {
    const id = 'c_' + i;
    const span = add('SPAN', state.$typingArea);
    span.id = id;
    span.innerHTML = c;
    state.characters.push({
      index: i,
      id,
      letter: c,
    });
    i++;
  });
  moveCursor(0);
  return onStarted(state);
};

Loader.load = (text = '') => {
  const s = text || getTextString();
  render(s);
};

const reactivate = () => {
  state.$textpad.focus();
  state.isActivated = true;
};


export const init = () => {
  state.$textpad = get('textpad');
  state.$typingArea = get('typingArea');
  reactivate();
  Loader.load();
  initAnalyzer();
  Event.on(document.body, 'click', () => {
    state.isActivated = false;
    let focused = document.activeElement;
    if (!focused || focused === document.body) {
      focused = null;
    } else if (document.querySelector) {
      focused = document.querySelector(':focus');
    }
    if (!state.isActivated && focused && focused.id === 'textpad') {
      state.isActivated = true;
    }
  });

  Event.on(document.body, 'keydown', handleAction);
  Event.on(document.body, 'keypress', handleText);
};

