module.exports = (env, options) => {
  const { mode } = options;
  return mode === 'development'
    ? require('./webpack.development.config.js')(env, options)
    : require('./webpack.production.config.js')(env, options);
};
