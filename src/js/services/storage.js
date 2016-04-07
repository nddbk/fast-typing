/**
 * storage.js
 * Storage service
 * @ndaidong
 */

Box.Application.addService('storage', function _storage() {

  var _store = (function _getCache(data) {
    var o;
    if (data) {
      o = JSON.parse(data);
    }
    return o || {};
  })(localStorage.getItem('store'));

  var updateStore = function _updateStore() {
    localStorage.setItem('store', JSON.stringify(_store));
  };

  var set = function _set(key, value) {
    _store[key] = value;
    updateStore();
  };
  var get = function _get(key) {
    return _store[key];
  };
  var remove = function _remove(key) {
    if (Bella.hasProperty(_store, key)) {
      _store[key] = null;
      delete _store[key];
      updateStore();
    }
  };
  var me = function _me() {
    return _store.user || false;
  };

  return {
    get: get,
    set: set,
    remove: remove,
    me: me
  };
});
