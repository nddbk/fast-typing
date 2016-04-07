/**
 * parser.js
 * Parser service
 * @ndaidong
 */

Box.Application.addService('parser', function _parser() {

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

  return {
    parse: parse
  };
});
