/**
 * parser.js
 * Parser service
 * @ndaidong
 */

 /* eslint no-console: 0 */

Box.Application.addService('parser', () => {

  'use strict';

  var parse = (data) => {
    let s = '';
    if (Bella.isString(data)) {
      s = data;
    } else if (Bella.isArray(data) || Bella.isObject(data)) {
      let ar = [];
      for (let k in data) {
        if (Bella.hasProperty(data, k)) {
          let val = data[k];
          if (Bella.isString(val)) {
            val = Bella.encode(val);
          } else if (Bella.isArray(val) || Bella.isObject(val)) {
            val = JSON.stringify(val);
          }
          ar.push(Bella.encode(k) + '=' + val);
        }
      }
      if (ar.length > 0) {
        s = ar.join('&');
      }
    }
    return s;
  };

  var pull = (target, data) => {
    return new Promise((resolve, reject) => {
      try {
        let query = target;
        query += (target.charAt(target.length - 1) !== '?' ? '?' : '') + parse(data);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            return resolve(xhr.responseText, xhr.status);
          }
          return false;
        };
        xhr.open('GET', query, true);
        return xhr.send();
      } catch (e) {
        return reject(e);
      }
    });
  };

  return {
    parse: parse,
    pull: pull
  };
});
