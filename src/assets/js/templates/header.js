// templates --> header.js

import {html} from 'lit-html';


export const tplHeader = (state) => {
  return html`<header>
    <h1><a href="https://github.com/ndaidong/fast-typing">${state.title}</a></h1>
    </header>`
  ;
};

