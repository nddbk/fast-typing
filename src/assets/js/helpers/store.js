// helpers -> store.js

const createStore = () => {
  const state = {
    title: 'FastTyping',
    author: '@ndaidong',
    authorLink: 'https://twitter.com/ndaidong',
    clientSecret: '__clientSecret__',
    K: 0.123456789,
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
