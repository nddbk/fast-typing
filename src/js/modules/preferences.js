/**
 * preferences.js
 * @ndaidong
 */

var App = Box.Application || {};

App.addModule('preferences', (context) => {

  var storage = context.getService('storage');

  var $dialog, $btnSetting;

  var {
    get,
    add,
    Event
  } = realdom;

  var {
    hasProperty,
    ucfirst
  } = bella;

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
      if (hasProperty(OPTS, k)) {
        let cval = OPTS[k];
        let id = '_' + k;
        let input = get(id);
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
      let el = get('_' + k);
      if (v === 1) {
        el.checked = true;
      } else {
        el.checked = false;
      }
    }
  };

  var updateBox = (o) => {

    OPTS = o;
    let $prefBox = get('prefBox');

    for (let k in o) {
      if (hasProperty(o, k)) {
        let id = '_' + k;
        let v = o[k];
        let label = ucfirst(k);
        let p = add('P', $prefBox);
        let lb = add('LABEL', p);
        lb.setProperty({
          class: 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect',
          for: id
        });

        let ip = add('INPUT', lb);
        ip.setProperty({
          type: 'checkbox',
          class: 'mdl-checkbox__input',
          id
        });
        if (v) {
          ip.setAttribute('checked', true);
        }
        let span = add('SPAN', lb);
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

    $dialog = get('preferences');
    $btnSetting = get('butSetting');

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
