// utils / parseCSS

import {normalize} from 'path';
import {existsSync} from 'fs';

import postcss from 'postcss';
import CleanCSS from 'clean-css';
import stripCssComments from 'strip-css-comments';

import {error, info} from './logger';
import readFile from './readFile';
import {getConfig} from '../configs';

const config = getConfig();

const POSTCSS_PLUGINS = [
  require('postcss-import'),
  require('postcss-custom-properties'),
  require('postcss-custom-media'),
  require('postcss-nested'),
  require('postcss-short'),
  require('autoprefixer'),
];

const removeComments = (css) => {
  return stripCssComments(css, {
    preserve: false,
  });
};

const postify = async (fileSrc) => {
  try {
    const plugins = [...POSTCSS_PLUGINS];
    const css = readFile(fileSrc);
    const result = await postcss(plugins).process(css, {
      from: fileSrc,
      map: {
        inline: config.ENV == 'dev',
      },
    });

    const minOpt = {level: 2};
    if (config.ENV == 'dev') {
      minOpt.level = 0;
      minOpt.format = 'beautify';
    }
    const cleaner = new CleanCSS(minOpt);
    const minOutput = await cleaner.minify(result.css);

    if (config.ENV == 'dev') {
      return minOutput.styles;
    }
    return removeComments(minOutput.styles);
  } catch (err) {
    error(err);
    return null;
  }
};

export default async (filePath) => {
  const {
    baseDir,
    srcDir,
  } = config;
  const fullPath = normalize(`${baseDir}/${srcDir}/assets/${filePath}`);
  if (!existsSync(fullPath)) {
    error(`File does not exist: ${fullPath}`);
    return null;
  }
  info('Start parsing CSS content with PostCSS...');
  const cssContent = await postify(fullPath);
  info(`Postified CSS file '${fullPath}'`);
  return cssContent;
};
