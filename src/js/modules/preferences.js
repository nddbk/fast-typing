/**
 * settings.js
 * settings module
 * @ndaidong
 */


'use strict';

var App = Box.Application || {};

App.addModule('preferences', (context) => {

  var storage = context.getService('storage');

  var $dialog, $btnSetting;

  var Event = doc.Event;

  var OPTS = {
    numbers: 0,
    sentences: 0,
    punctiations: 0
  };

  var ORDER = [
    'numbers', 'sentences', 'punctiations'
  ];

  var saveOptions = () => {
    let changed = false;
    let opts = {};
    for (let i = 0; i < ORDER.length; i++) {
      let k = ORDER[i];
      if (Bella.hasProperty(OPTS, k)) {
        let cval = OPTS[k];
        let id = '_' + k;
        let input = doc.get(id);
        let nval = input.checked ? 1 : 0;
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

  var resetOptions = () => {
    for (let i = 0; i < ORDER.length; i++) {
      let k = ORDER[i];
      let v = OPTS[k];
      let el = doc.get('_' + k);
      if (v === 1) {
        el.checked = true;
      } else {
        el.checked = false;
      }
    }
  };

  var updateBox = (o) => {

    OPTS = o;
    let $prefBox = doc.get('prefBox');

    for (let k in o) {
      if (Bella.hasProperty(o, k)) {
        let id = '_' + k;
        let v = o[k];
        let label = Bella.ucfirst(k);
        let p = doc.add('P', $prefBox);
        let lb = doc.add('LABEL', p);
        lb.setProperty({
          class: 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect',
          for: id
        });

        let ip = doc.add('INPUT', lb);
        ip.setProperty({
          type: 'checkbox',
          class: 'mdl-checkbox__input',
          id: id
        });
        if (v) {
          ip.setAttribute('checked', true);
        }
        let span = doc.add('SPAN', lb);
        span.setProperty({
          class: 'mdl-checkbox__label'
        });
        span.html(label);
      }
    }

  };

  var showModal = () => {
    $dialog.addClass('dialog-container--visible');
  };
  var hideModal = () => {
    $dialog.removeClass('dialog-container--visible');
  };

  var init = () => {
    let opts = storage.get('options');
    if (!opts) {
      opts = OPTS;
      storage.set('options', opts);
    }
    updateBox(opts);

    $dialog = doc.get('preferences');
    $btnSetting = doc.get('butSetting');

    Event.on($btnSetting, 'click', showModal);
    Event.on('btnCancel', 'click', () => {
      hideModal();
      setTimeout(resetOptions, 500);
      context.broadcast('onresetoption');
    });
    Event.on('btnSave', 'click', () => {
      saveOptions();
      hideModal();
      context.broadcast('onsavechange');
    });
  };

  return {
    init: () => {
      storage.ready(init);
    }
  };
});
