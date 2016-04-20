/**
 * settings.js
 * settings module
 * @ndaidong
 */

/* global componentHandler */

'use strict';

var App = Box.Application || {};

App.addModule('preferences', (context) => {

  var storage = context.getService('storage');

  var $dialog, $btnSetting, vTpl;

  var OPTS = {
    numbers: 0,
    sentences: 0,
    punctiations: 0
  };

  var saveOptions = () => {
    let changed = false;
    let opts = {};
    let a = [
      'numbers', 'sentences', 'punctiations'
    ];
    for (let i = 0; i < a.length; i++) {
      let k = a [i];
      if (Bella.hasProperty(OPTS, k)) {
        let cval = OPTS[k];
        let id = '_' + k;
        let input = DOM.get(id);
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

  var updateBox = (o) => {

    OPTS = o;
    vTpl = vDOM.create('DIV');

    for (let k in o) {
      if (Bella.hasProperty(o, k)) {
        let id = '_' + k;
        let v = o[k];
        let label = Bella.ucfirst(k);
        let p = vTpl.append('P');
        let lb = p.append('label');
        lb.setAttribute('class', 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect');
        lb.setAttribute('for', id);
        let ip = lb.append('input', {
          type: 'checkbox',
          class: 'mdl-checkbox__input',
          id: id
        });
        if (v) {
          ip.setAttribute('checked', true);
        }
        lb.append('SPAN', {
          class: 'mdl-checkbox__label',
          text: label
        });
        vTpl.append(p);
      }
    }

    let $prefBox = DOM.get('prefBox');
    vTpl.render($prefBox);

    componentHandler.upgradeElement($prefBox);
  };

  var init = () => {
    let opts = storage.get('options');
    if (!opts) {
      opts = OPTS;
      storage.set('options', opts);
    }
    updateBox(opts);

    $dialog = DOM.one('dialog');
    $btnSetting = DOM.get('butSetting');

    DOM.Event.on($btnSetting, 'click', () => { $dialog.showModal(); });
    DOM.Event.on('btnCancel', 'click', () => { $dialog.close(); });
    DOM.Event.on('btnSave', 'click', () => {
      saveOptions();
      $dialog.close();
    });
  };

  return {
    init: () => {
      storage.ready(init);
    }
  };
});
