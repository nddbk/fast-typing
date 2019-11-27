// templates --> header.js

import {html} from 'lit-html';


export const tplHeader = (state) => {
  return html`
    <header class="header">
      <h1 class="header__title">${state.title}</h1>
      <i id="butSetting" title="Settings" class="ico-button material-icons">settings</i>
    </header>`
  ;
};

