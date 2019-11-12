// writeFile

import {
  writeFileSync,
} from 'fs';

export default (f, content) => {
  return writeFileSync(f, content, 'utf8');
};

