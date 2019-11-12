// readFile

import {
  existsSync,
  readFileSync,
} from 'fs';

export default (f) => {
  return existsSync(f) ? readFileSync(f, 'utf8') : '';
};

