/**
 * Common scenario for setting up and optimizing system
 * @ndaidong
 **/

/* eslint guard-for-in: 0*/
/* eslint no-console: 0*/

'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').execSync;

var async = require('async');
var Promise = require('bluebird');
var bella = require('bellajs');
var mkdirp = require('mkdirp').sync;
var cpdir = require('copy-dir').sync;

var cheerio = require('cheerio');

var postcss = require('postcss');
var postcssFilter = require('postcss-filter-plugins');
var cssnano = require('cssnano');
var cssnext = require('postcss-cssnext');
var postcssMixin = require('postcss-mixins');
var postcssNested = require('postcss-nested');

var prettydiff = require('prettydiff');

const POSTCSS_PLUGINS = [
  postcssFilter({
    silent: true
  }),
  cssnext,
  cssnano,
  postcssMixin,
  postcssNested
];

var removeNewLines = (s) => {
  s = s.replace(/(?:\r\n|\r|\n)+/gm, '');
  return s;
};

var download = (src, saveas) => {
  if (fs.existsSync(saveas)) {
    fs.unlink(saveas);
  }
  console.log('Downloading %s ...', src);
  exec('wget -O ' + saveas + ' ' + src);
  console.log('Downloaded %s', saveas);
};

var createDir = (ls) => {
  if (bella.isArray(ls)) {
    ls.forEach((d) => {
      d = path.normalize(d);
      if (!fs.existsSync(d)) {
        mkdirp(d);
        console.log('Created dir "%s"... ', d);
      }
    });
  } else {
    ls = path.normalize(ls);
    if (!fs.existsSync(ls)) {
      mkdirp(ls);
    }
  }
};

var removeDir = (ls) => {
  if (bella.isArray(ls)) {
    let k = 0;
    ls.forEach((d) => {
      d = path.normalize(d);
      exec('rm -rf ' + d);
      ++k;
      console.log('%s, removed dir "%s"... ', k, d);
    });
  } else {
    ls = path.normalize(ls);
    exec('rm -rf ' + ls);
  }
  console.log('Done.');
};

var createEmptyFile = (dest) => {
  let ext = path.extname(dest);
  let fname = path.basename(dest);
  let content = '';
  if (ext === '.js') {
    content = '/**' + fname + '*/';
  } else if (ext === '.css' || ext === '.less') {
    content = '/*' + fname + '*/';
  }
  fs.writeFileSync(dest, content, {
    encoding: 'utf8'
  });
};

var copyFile = (source, target) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    }
    var rd = fs.createReadStream(source);
    rd.on('error', reject);
    var wr = fs.createWriteStream(target);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
};

var copyDir = (from, to) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  if (fs.existsSync(to)) {
    exec('rm -rf ' + to);
  }
  mkdirp(to);
  cpdir(from, to);
  return false;
};

var postProcess = (css) => {
  return new Promise((resolve, reject) => {
    return postcss(POSTCSS_PLUGINS)
      .process(css)
      .then((result) => {
        return resolve(result.css);
      }).catch((err) => {
        return reject(err);
      });
  });
};

var compileCSS = (files) => {

  return new Promise((resolve, reject) => {
    let s = '', as = [], vs = [];
    if (bella.isString(files)) {
      files = [ files ];
    }
    files.forEach((file) => {
      if (fs.existsSync(file)) {
        let x = fs.readFileSync(file, 'utf8');
        as.push(x);
      }
    });

    s = as.join('\n');

    if (s.length > 0) {
      let ps = vs.join('\n');
      return postProcess(s).then((rs) => {
        return resolve(ps + rs);
      }).catch((err) => {
        return reject(err);
      });
    }
    return reject(new Error('No CSS data'));
  });
};

var compileJS = (files) => {

  return new Promise((resolve, reject) => {
    let s = '', as = [];
    if (bella.isString(files)) {
      files = [ files ];
    }
    files.forEach((file) => {
      if (fs.existsSync(file)) {
        let x = fs.readFileSync(file, 'utf8');
        as.push(x);
      }
    });

    s = as.join('\n');

    if (s.length > 0) {
      let result = prettydiff.api({
        source: s,
        mode: 'minify',
        lang: 'javascript',
        output: 'string'
      });
      return resolve(result[0]);
    }
    return reject(new Error('No JavaScript data'));
  });
};

var compileHTML = (file) => {

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(file)) {
      return reject(new Error('File not found'));
    }

    let s = fs.readFileSync(file, 'utf8');
    let $ = cheerio.load(s, {
      normalizeWhitespace: true
    });
    let cssFiles = [];
    let jsFiles = [];

    let html = '';
    let style = '';
    let script = '';

    let revision = bella.createId(10);

    return async.series([
      (next) => {
        $('link[rel="stylesheet"]').each((i, elem) => {
          let ofile = $(elem).attr('href');
          cssFiles.push('./src/' + ofile);
        });
        $('link[rel="stylesheet"]').remove();
        return next();
      },
      (next) => {
        $('script').each((i, elem) => {
          let ofile = $(elem).attr('src');
          jsFiles.push('./src' + ofile);
        });
        $('script').remove();
        return next();
      },
      (next) => {
        return compileCSS(cssFiles).then((css) => {
          style = css;
          let styleTag = `<link rel="stylesheet" type="text/css" href="/css/all.min.css?rev=${revision}" />`;
          $('head').append(styleTag);
          return css;
        }).finally(next);
      },
      (next) => {
        return compileJS(jsFiles).then((js) => {
          script = js;
          let scriptTag = `<script type="text/javascript" src="/js/all.min.js?rev=${revision}"></script>`;
          $('body').append(scriptTag);
          return js;
        }).finally(next);
      },
      (next) => {
        html = $.html();
        html = removeNewLines(html);
        return next();
      }
    ], (err) => {
      if (err) {
        return reject(err);
      }

      return resolve({
        html: html,
        css: style,
        js: script
      });
    });
  });
};

module.exports = {
  download: download,
  compileHTML: compileHTML,
  createDir: createDir,
  removeDir: removeDir,
  copyDir: copyDir,
  copyFile: copyFile,
  createEmptyFile: createEmptyFile
};
