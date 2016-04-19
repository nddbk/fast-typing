/**
 * settings.js
 * settings module
 * @ndaidong
 */

'use strict';

var App = Box.Application || {};

App.addModule('preferences', (context) => {

  var storage = context.getService('storage');

  var $dialog, $btnSetting, vTpl;

  var OPTS = {
    letters: 1,
    sumbers: 0,
    sentences: 0,
    punctiations: 0
  };

  var changeState = (key, inputId) => {
    console.log(key, inputId); // eslint-disable-line
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
        ip.setEvent('change', () => {
          changeState(k, ip.tagId);
        });
        lb.append('SPAN', {
          class: 'mdl-checkbox__label',
          text: label
        });
        vTpl.append(p);
      }
    }

    vTpl.render('prefBox');
  };

  var init = () => {
    var opts = storage.get('options');
    opts = false;
    if (!opts) {
      opts = OPTS;
      storage.set('options', opts);
    }
    updateBox(opts);

    $dialog = DOM.one('dialog');
    $btnSetting = DOM.get('butSetting');

    DOM.Event.on($btnSetting, 'click', () => { $dialog.showModal(); });
    DOM.Event.on('btnCancel', 'click', () => { $dialog.close(); });
  };

  return {
    init: () => {
      storage.ready(init);
    }
  };
});
