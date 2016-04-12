/**
 * parser.js
 * Parser service
 * @ndaidong
 */

 /* eslint no-console: 0 */
 /* eslint func-names: 0 */

Box.Application.addService('parser', function() {

  'use strict';

  function parse(data) {
    var s = '';
    if (Bella.isString(data)) {
      s = data;
    } else if (Bella.isArray(data) || Bella.isObject(data)) {
      var ar = [];
      for (var k in data) {
        if (Bella.hasProperty(data, k)) {
          var val = data[k];
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
  }

  var pull = function(target, data) {
    return new Promise(function(resolve, reject) {
      try {
        var query = target;
        query += (target.charAt(target.length - 1) !== '?' ? '?' : '') + parse(data);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
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
