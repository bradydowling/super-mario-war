module.exports = (env, options) => {
  const { mode } = options;
  return mode === 'development'
    ? require('./webpack.development.config.js/index.js')(env, options)
    : require('./webpack.production.config.js/index.js')(env, options);
};
