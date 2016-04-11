/**
 * storage.js
 * Storage service
 * @ndaidong
 */


 /* eslint no-console: 0 */
 /* eslint func-names: 0 */

Box.Application.addService('storage', function() {

  'use strict';

  var _store = (function(data) {
    var o;
    if (data) {
      o = JSON.parse(data);
    }
    return o || {};
  })(localStorage.getItem('store'));

  var updateStore = function() {
    localStorage.setItem('store', JSON.stringify(_store));
  };

  var set = function(key, value) {
    _store[key] = value;
    updateStore();
  };
  var get = function(key) {
    return _store[key];
  };
  var remove = function(key) {
    if (Bella.hasProperty(_store, key)) {
      _store[key] = null;
      delete _store[key];
      updateStore();
    }
  };
  var me = function() {
    return _store.user || false;
  };

  return {
    get: get,
    set: set,
    remove: remove,
    me: me
  };
});
