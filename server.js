// server.js

import {normalize} from 'path';
import {existsSync} from 'fs';

import {isString} from 'bellajs';
import express from 'express';

import {getConfig} from './configs';


import readFile from './utils/readFile';
import parseJS from './utils/parseJS';
import parseCSS from './utils/parseCSS';
import parseHTML from './utils/parseHTML';

import {info, error} from './utils/logger';

const {
  baseDir,
  srcDir,
  staticOpt,
  port,
} = getConfig();

const app = express();

app.disable('x-powered-by');

const staticDir = normalize(`${baseDir}/${srcDir}/static`);
if (existsSync(staticDir)) {
  app.use(express.static(staticDir, staticOpt));
}

app.get('/assets/*', async (req, res, next) => {
  const filePath = req.params[0];
  if (filePath.endsWith('.js')) {
    const jsContent = await parseJS(filePath);
    if (jsContent && isString(jsContent)) {
      res.type('text/javascript');
      return res.send(jsContent);
    }
  } else if (filePath.endsWith('.css')) {
    const cssContent = await parseCSS(filePath);
    if (cssContent && isString(cssContent)) {
      res.type('text/css');
      return res.send(cssContent);
    }
  }
  error(`Error while loading file '${filePath}'`);
  return next();
});

app.get('/', (req, res) => {
  const html = readFile(`${baseDir}/${srcDir}/index.html`);
  res.type('text/html');
  res.send(parseHTML(html));
});

app.listen(port, () => {
  info(`Server started at http://0.0.0.0:${port}`);
});
