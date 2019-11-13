// helpers -> store.js

export const setItem = (k, v) => {
  localStorage.setItem(k, JSON.stringify(v));
};

export const getItem = (k) => {
  const t = localStorage.getItem(k);
  return t ? JSON.parse(t) : null;
};


const createStore = () => {
  const state = {
    title: 'FastTyping',
    author: '@ndaidong',
    authorLink: 'https://twitter.com/ndaidong',
    clientSecret: '__clientSecret__',
  };

  const getState = () => {
    return state;
  };

  const getOptions = () => {
    return {
      numbers: 0,
      sentences: 0,
      punctiations: 0,
    };
  };

  const init = async () => {
    return getState();
  };

  return {
    init,
    getState,
    getOptions,
  };
};

export default createStore();
