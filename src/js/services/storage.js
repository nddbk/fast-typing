/**
 * storage.js
 * Storage service
 * @ndaidong
 */

/* global chrome */

 /* eslint no-console: 0 */

Box.Application.addService('storage', () => {

  'use strict';

  var _store = {};

  var onready = () => {
    return false;
  };

  var ready = (fn) => {
    if (Bella.isFunction(fn)) {
      onready = fn;
    }
  };

  var getCache = (data) => {
    let o;
    if (data) {
      o = Bella.isString(data) ? JSON.parse(data) : data;
    }
    _store = o || {};
    onready();
  };

  var updateStore = () => {
    if (chrome && chrome.storage) {
      chrome.storage.local.set({
        store: _store,
        lastUpdate: Date.now()
      }, () => {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        } else {
          console.log('Saved in local');
        }
      });
    } else {
      localStorage.setItem('store', JSON.stringify(_store));
    }
  };

  var set = (key, value) => {
    _store[key] = value;
    updateStore();
  };
  var get = (key) => {
    return _store[key];
  };
  var remove = (key) => {
    if (Bella.hasProperty(_store, key)) {
      _store[key] = null;
      delete _store[key];
      updateStore();
    }
  };

  Bella.dom.ready(() => {
    if (chrome && chrome.storage) {
      return chrome.storage.local.get('store', (result) => {
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
