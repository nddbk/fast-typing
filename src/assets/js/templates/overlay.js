// templates -> overlay

import {html} from 'lit-html';


const reload = () => {
  window.location.reload();
};

export const tplOverlay = (state) => {
  return !state.overlayMessage ? '' : html`
    <div class="overlay">
      <div class="inner">
        <div class="full under"></div>
        <div class="full over">
          <div class="msg-box">
            ${state.overlayMessage}
            <br>
            Please 
              <span
                class="ctrl"
                @click=${reload}>reload page</span> 
            to get new one.
          </div>
        </div>
      </div>
    </div>
  `;
};
