// config

import {
  existsSync,
  mkdirSync,
} from 'fs';

import {
  genid,
  clone,
} from 'bellajs';

import {
  warning,
} from '../utils/logger';

const staticOpt = {
  maxAge: 6e4 * 60,
  etag: true,
  lastModified: true,
};


const env = process.env || {}; // eslint-disable-line no-process-env

[
  'ENV',
  'HOST',
  'PORT',
].forEach((envar) => {
  if (!env[envar]) {
    warning(`Environment variable ${envar} is missing`);
  }
});

const siteUrl = env.ENV === 'prod' ?
  'https://fast-typing.github.io' :
  'http://0.0.0.0:6212';

let config = {
  ENV: env.ENV || 'dev',
  host: env.HOST || '0.0.0.0',
  port: env.PORT || 6212,
  url: siteUrl,
  baseDir: './',
  srcDir: './src',
  distDir: './dist',
  staticOpt,
  rev: genid(40),
};


export const configure = (conf = {}) => {
  const {
    url = '',
    host = '',
    port = '',
  } = conf;

  if (!url && host && port) {
    conf.url = `http://${host}:${port}`;
  }

  config = Object.assign(config, clone(conf));
  return config;
};

export const getConfig = () => {
  return clone(config);
};

