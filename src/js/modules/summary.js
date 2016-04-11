/**
 * summary.js
 * summary module
 * @ndaidong
 */

/* eslint no-console: 0 */
/* eslint func-names: 0 */

'use strict';

var App = Box.Application || {};

App.addModule('summary', function() {

  var K = App.getGlobalConfig('K');
  var H = App.getGlobalConfig('H');

  var Dom = Bella.dom;

  var data;

  var $numSpeed, $numMistake, $txtMistake, $numScore, $txtScore;
  var $numHrSpeed, $numHrMistake, $txtHrMistake, $numHrScore, $txtHrScore;

  var normalize = function(o) {
    o.mistakeText = 'mistake' + (o.mistake > 1 ? 's' : '');
    o.pointText = 'point' + (o.score > 1 ? 's' : '');
    return o;
  };

  var display = function() {
    $numSpeed.html(data.speed);
    $numMistake.html(data.mistake);
    $txtMistake.html(data.mistakeText);
    $numScore.html(data.score);
    $txtScore.html(data.pointText);

    var hr = data.hr;
    $numHrSpeed.html(hr.speed);
    $numHrMistake.html(hr.mistake);
    $txtHrMistake.html(hr.mistakeText);
    $numHrScore.html(hr.score);
    $txtHrScore.html(hr.pointText);
  };

  var onchange = function() {
    for (var k in data) {
      if (Bella.hasProperty(data, k)) {
        var x = normalize(data);
        x.hr = normalize(data.hr);
        Bella.copies(x, data);
      }
    }
    display();
  };

  var calculate = function(totalChars, correct, error, mistake, speed) {
    var n = speed * (correct / totalChars) * K * 200;
    if (n > 0 && mistake > 0) {
      while (mistake > 0) {
        mistake--;
        n /= 1 + K;
      }
    }
    return Math.ceil(n);
  };

  var onStarted = function() {

  };

  var onPressed = function() {

  };

  var onFinished = function(o) {
    var correct = o.correct;
    var error = o.error;
    var mistake = o.mistake;
    var speed = Math.round(o.totalWords * 6e4 / (o.endTime - o.startTime));

    var score = calculate(o.totalChars, correct, error, mistake, speed);

    var x = {
      speed: speed,
      error: error,
      mistake: mistake,
      score: score
    };

    var tmp = normalize(x);
    Bella.copies(tmp, data);

    if (!H.hr) {
      H.hr = x;
    } else {
      var hr = H.hr;
      if (score > hr.score) {
        H.hr = x;
      }
    }

    data.hr = H.hr;

    onchange();
  };

  var init = function() {

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

    data = {
      speed: 0,
      mistake: 0,
      score: 0,
      hr: {
        speed: 0,
        mistake: 0,
        score: 0
      }
    };
    onchange();
  };

  return {
    init: init,
    messages: [ 'onstarted', 'onpressed', 'onfinished' ],
    onmessage: function(name, eventData) {
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
