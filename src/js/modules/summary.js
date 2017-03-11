/**
 * summary.js
 * @ndaidong
 */

var App = Box.Application || {};

App.addModule('summary', (context) => {

  var K = App.getGlobalConfig('K');
  var H = {};
  var storage = context.getService('storage');

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
    return 0;
  };

  var onPressed = () => {
    return 0;
  };

  var onFinished = (o) => {
    let correct = o.correct;
    let error = o.error;
    let mistake = o.mistake;
    let speed = Math.round(o.totalWords * 6e4 / (o.endTime - o.startTime));

    let score = calculate(o.totalChars, correct, error, mistake, speed);

    let x = {
      speed,
      error,
      mistake,
      score
    };

    let tmp = normalize(x);
    Bella.copies(tmp, data);

    if (H.hr) {
      let hr = H.hr;
      if (score > hr.score) {
        storage.set('hr', x);
        H.hr = x;
      }
    } else {
      H.hr = x;
    }
    data.hr = H.hr;
    onchange();
  };

  var init = () => {

    $numSpeed = doc.get('numSpeed');
    $numMistake = doc.get('numMistake');
    $txtMistake = doc.get('txtMistake');
    $numScore = doc.get('numScore');
    $txtScore = doc.get('txtScore');
    $numHrSpeed = doc.get('numHrSpeed');
    $numHrMistake = doc.get('numHrMistake');
    $txtHrMistake = doc.get('txtHrMistake');
    $numHrScore = doc.get('numHrScore');
    $txtHrScore = doc.get('txtHrScore');

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
  };

  return {
    init: () => {
      storage.ready(init);
    },
    messages: ['onstarted', 'onpressed', 'onfinished'],
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
