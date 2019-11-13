// helpers -> analyzer

import {hasProperty, copies} from 'bellajs';
import {get} from 'realdom';

import {getItem, setItem} from './store';

let $numSpeed, $numMistake, $txtMistake, $numScore, $txtScore;
let $numHrSpeed, $numHrMistake, $txtHrMistake, $numHrScore, $txtHrScore;

const K = Math.PI / 3e1;
const H = {};
const data = {
  speed: 0,
  mistake: 0,
  score: 0,
  hr: {},
};

const normalize = (o) => {
  o.mistakeText = 'mistake' + (o.mistake > 1 ? 's' : '');
  o.pointText = 'point' + (o.score > 1 ? 's' : '');
  return o;
};

const calculate = (totalChars, correct, error, mistake, speed) => {
  let n = speed * (correct / totalChars) * K * 200;
  if (n > 0 && mistake > 0) {
    while (mistake > 0) {
      mistake--;
      n /= 1 + K;
    }
  }
  return Math.ceil(n);
};


const display = () => {
  $numSpeed.html(data.speed);
  $numMistake.html(data.mistake);
  $txtMistake.html(data.mistakeText);
  $numScore.html(data.score);
  $txtScore.html(data.pointText);

  const hr = data.hr;
  $numHrSpeed.html(hr.speed);
  $numHrMistake.html(hr.mistake);
  $txtHrMistake.html(hr.mistakeText);
  $numHrScore.html(hr.score);
  $txtHrScore.html(hr.pointText);
};

const onchange = () => {
  for (const k in data) {
    if (hasProperty(data, k)) {
      const x = normalize(data);
      x.hr = normalize(data.hr);
      copies(x, data);
    }
  }
  display();
};

export const onStarted = (state) => {
  return state;
};


export const onPressed = (state) => {
  return state;
};


export const onFinished = (o) => {
  const correct = o.correct;
  const error = o.error;
  const mistake = o.mistake;
  const speed = Math.round(o.totalWords * 6e4 / (o.endTime - o.startTime));

  const score = calculate(o.totalChars, correct, error, mistake, speed);

  const x = {
    speed,
    error,
    mistake,
    score,
  };

  const tmp = normalize(x);
  copies(tmp, data);

  if (H.hr) {
    const hr = H.hr;
    if (score > hr.score) {
      setItem('hr', x);
      H.hr = x;
    }
  } else {
    H.hr = x;
  }
  data.hr = H.hr;
  onchange();
};

export const init = () => {
  $numSpeed = get('numSpeed');
  $numMistake = get('numMistake');
  $txtMistake = get('txtMistake');
  $numScore = get('numScore');
  $txtScore = get('txtScore');
  $numHrSpeed = get('numHrSpeed');
  $numHrMistake = get('numHrMistake');
  $txtHrMistake = get('txtHrMistake');
  $numHrScore = get('numHrScore');
  $txtHrScore = get('txtHrScore');

  const savedHr = getItem('hr') || {
    speed: 0,
    mistake: 0,
    score: 0,
  };

  H.hr = savedHr;
  data.hr = savedHr;
  onchange();
};

