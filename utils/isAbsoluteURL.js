// utils / isAbsoluteURL

export default (file = '') => {
  const f = String(file);
  return f.startsWith('http') || f.startsWith('//');
};
