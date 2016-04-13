/**
 * summary.js
 * summary module
 * @ndaidong
 */

/* eslint no-console: 0 */
/* eslint func-names: 0 */

'use strict';

var App = Box.Application || {};

App.addModule('summary', (context) => {

  var K = App.getGlobalConfig('K');
  var H = {};
  var storage = context.getService('storage');

  var Dom = Bella.dom;

  var data;

  var $numSpeed, $numMistake, $txtMistake, $numScore, $txtScore;
  var $numHrSpeed, $numHrMistake, $txtHrMistake, $numHrScore, $txtHrScore;

  var normalize = (o) => {
    o.mistakeText = 'mistake' + (o.mistake > 1 ? 's' : '');
    o.pointText = 'point' + (o.score > 1 ? 's' : '');
    return o;
  };

  var display = () => {
    $numSpeed.html(data.speed);
    $numMistake.html(data.mistake);
    $txtMistake.html(data.mistakeText);
    $numScore.html(data.score);
    $txtScore.html(data.pointText);

    let hr = data.hr;
    $numHrSpeed.html(hr.speed);
    $numHrMistake.html(hr.mistake);
    $txtHrMistake.html(hr.mistakeText);
    $numHrScore.html(hr.score);
    $txtHrScore.html(hr.pointText);
  };

  var onchange = () => {
    for (let k in data) {
      if (Bella.hasProperty(data, k)) {
        let x = normalize(data);
        x.hr = normalize(data.hr);
        Bella.copies(x, data);
      }
    }
    display();
  };

  var calculate = (totalChars, correct, error, mistake, speed) => {
    let n = speed * (correct / totalChars) * K * 200;
    if (n > 0 && mistake > 0) {
      while (mistake > 0) {
        mistake--;
        n /= 1 + K;
      }
    }
    return Math.ceil(n);
  };

  var onStarted = () => {

  };

  var onPressed = () => {

  };

  var onFinished = (o) => {
    let correct = o.correct;
    let error = o.error;
    let mistake = o.mistake;
    let speed = Math.round(o.totalWords * 6e4 / (o.endTime - o.startTime));

    let score = calculate(o.totalChars, correct, error, mistake, speed);

    let x = {
      speed: speed,
      error: error,
      mistake: mistake,
      score: score
    };

    let tmp = normalize(x);
    Bella.copies(tmp, data);

    if (!H.hr) {
      H.hr = x;
    } else {
      let hr = H.hr;
      if (score > hr.score) {
        storage.set('hr', x);
        H.hr = x;
      }
    }
    data.hr = H.hr;
    onchange();
  };

  var init = () => {

    $numSpeed = Dom.get('numSpeed');
    $numMistake = Dom.get('numMistake');
    $txtMistake = Dom.get('txtMistake');
    $numScore = Dom.get('numScore');
    $txtScore = Dom.get('txtScore');
    $numHrSpeed = Dom.get('numHrSpeed');
    $numHrMistake = Dom.get('numHrMistake');
    $txtHrMistake = Dom.get('txtHrMistake');
    $numHrScore = Dom.get('numHrScore');
    $txtHrScore = Dom.get('txtHrScore');

    storage.ready(() => {
      let savedHr = storage.get('hr') || {
        speed: 0,
        mistake: 0,
        score: 0
      };
      H.hr = savedHr;
      data = {
        speed: 0,
        mistake: 0,
        score: 0,
        hr: savedHr
      };
      onchange();
    });
  };

  return {
    init: init,
    messages: [ 'onstarted', 'onpressed', 'onfinished' ],
    onmessage: (name, eventData) => {
      if (name === 'onrenderred') {
        onStarted(eventData);
      } else if (name === 'onpressed') {
        onPressed(eventData);
      } else if (name === 'onfinished') {
        onFinished(eventData);
      }
    }
  };
});
