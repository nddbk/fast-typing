// main.js

import {html, render} from 'lit-html';

import Store from './helpers/store';
import {init as initTextpad} from './modules/textpad';

import {tplHeader} from './templates/header';
import {tplMain} from './templates/main';
import {tplFooter} from './templates/footer';
import {tplOverlay} from './templates/overlay';


const App = window.App = {
  render: (state) => {
    const tplWrapper = html`<div class="wrapper">
      ${tplHeader(state)}
      ${tplMain(state)}
      ${tplFooter(state)}
      ${tplOverlay(state)}
    </div>`;
    const result = render(tplWrapper, document.body);
    return result;
  },
  init: async () => {
    try {
      const state = await Store.init();
      App.render(state);
      setTimeout(initTextpad, 100);
    } catch (err) {
      console.trace(err);
    }
  },
};

App.init();
