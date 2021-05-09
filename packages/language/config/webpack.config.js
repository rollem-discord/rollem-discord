const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const config = require('./webpack.base.config');
config.plugins.push(
  new WebpackShellPluginNext({
    onBuildStart: {
      scripts: ['yarn run build:lang:pegjs'],
      blocking: false,
      parallel: false,
    },
  }),
);

module.exports = config;