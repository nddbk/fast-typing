// templates --> main.js

import {html} from 'lit-html';

const clearInput = () => {
  const inputUrl = document.getElementById('inputUrl');
  inputUrl.value = '';
};

const onSubmit = (e, state) => {
  e.preventDefault();
  const btnExtract = document.getElementById('btnExtract');
  if (btnExtract.classList.contains('disable')) {
    return false;
  }
  const inputUrl = document.getElementById('inputUrl');
  const url = inputUrl.value.trim();
  const {
    links = [],
  } = state.article;
  if (links.includes(url)) {
    return false;
  }
  window.App.parse(url, btnExtract);
};


export const tplMain = () => {
  return html`<div class="page-content">
    <main class="main">
      <div class="card" id="summary" data-module="summary">
        <div class="line">
          <label>Recently: </label>
          <span class="section">
            <span class="number" id="numSpeed"></span> wpm
          </span>
          <span class="section">
            <span class="number" id="numMistake"></span> <span id="txtMistake"></span>
          </span>
          <span class="section">
            <span class="number" id="numScore"></span> <span id="txtScore"></span>
          </span>
        </div>
        <div class="line older">
          <label>Highest record: </label>
          <span class="section">
            <span class="number" id="numHrSpeed"></span> wpm
          </span>
          <span class="section">
            <span class="number" id="numHrMistake"></span> <span id="txtHrMistake"></span>
          </span>
          <span class="section">
            <span class="number" id="numHrScore"></span> <span id="txtHrScore"></span>
          </span>
        </div>
      </div>
      <div class="card" id="textpad" data-module="textpad" tabindex="-1">
        <div id="typingArea" class="text-area"></div>
      </div>
    </main>
    <div class="dialog-container" id="preferences" data-module="preferences">
      <div class="dialog">
        <div class="dialog-title">Preferences </div>
        <div class="dialog-body">
          <div id="prefBox"></div>
        </div>
        <div class="dialog-buttons">
          <button class="mdl-button" id="btnSave">Save changes</button>
          <button class="mdl-button close" id="btnCancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>`;
};

