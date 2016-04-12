/**
 * storage.js
 * Storage service
 * @ndaidong
 */

/* global chrome */

 /* eslint no-console: 0 */
 /* eslint func-names: 0 */

Box.Application.addService('storage', function() {

  'use strict';

  var _store = {};

  var onready = function() {
    return false;
  };

  var ready = function(fn) {
    if (Bella.isFunction(fn)) {
      onready = fn;
    }
  };

  var getCache = function(data) {
    var o;
    if (data) {
      o = Bella.isString(data) ? JSON.parse(data) : data;
    }
    _store = o || {};
    onready();
  };

  var updateStore = function() {
    if (chrome && chrome.storage) {
      chrome.storage.local.set({
        store: _store,
        lastUpdate: Date.now()
      }, function() {
        console.log('Saved');
      });
    } else {
      localStorage.setItem('store', JSON.stringify(_store));
    }
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

  Bella.dom.ready(function() {
    if (chrome && chrome.storage) {
      return chrome.storage.local.get('store', function(result) {
        getCache(result.store);
      });
    }
    return getCache(localStorage.getItem('store'));
  });

  return {
    ready: ready,
    get: get,
    set: set,
    remove: remove
  };
});
