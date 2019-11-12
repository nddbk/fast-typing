// utils / parseHTML

import {load} from 'cheerio';
import pretty from 'pretty';
import {minify} from 'html-minifier';

import isAbsoluteURL from './isAbsoluteURL';
import {getConfig} from '../configs';

const config = getConfig();

const minifyHTML = (html) => {
  return minify(html, {
    decodeEntities: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeTagWhitespace: true,
  });
};


export default (content) => {
  const rev = config.rev;

  const $ = load(content, {
    normalizeWhitespace: true,
  });

  const cssLinks = [];
  $('link[rel="stylesheet"]').each((k, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';
    if (href && !isAbsoluteURL(href)) {
      cssLinks.push(href);
      $el.remove();
    }
  });

  const jsLinks = [];
  $('script').each((k, el) => {
    const $el = $(el);
    const href = $el.attr('src') || '';
    if (href && !isAbsoluteURL(href)) {
      jsLinks.push(href);
      $el.remove();
    }
  });

  cssLinks.forEach((href) => {
    const fpath = href + '?v=' + rev;
    const subTag = `<link rel="subresource" href="${fpath}">`;
    $('head').append(subTag);
    const styleTag = `<link rel="stylesheet" type="text/css" href="${fpath}">`;
    $('head').append(styleTag);
  });

  jsLinks.forEach((href) => {
    const fpath = href + '?v=' + rev;
    const scriptTag = `<script type="text/javascript" src="${fpath}"></script>`;
    $('body').append(scriptTag);
  });

  const html = $.html();

  if (config.ENV == 'dev') {
    return pretty(html, {ocd: true});
  }
  return minifyHTML(html);
};

