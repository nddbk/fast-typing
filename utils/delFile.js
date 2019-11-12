// delFile

import {
  existsSync,
  unlinkSync,
} from 'fs';

export default (f) => {
  return existsSync(f) ? unlinkSync(f) : false;
};
