// templates --> footer.js

import {html} from 'lit-html';

export const tplFooter = (state) => {
  return html`<footer>
      <hr>
      <div class="copyright">
          <a href="${state.authorLink}" target="twitter">${state.author}</a>
      </div>
    </footer>`;
};

