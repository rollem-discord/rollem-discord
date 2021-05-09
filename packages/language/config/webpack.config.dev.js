const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const config = require('./webpack.config.base');
config.plugins.push(
  new WebpackShellPluginNext({
    onBuildStart: {
      scripts: ['yarn run watch:lang:pegjs'],
      blocking: false,
      parallel: false,
    },
  }),
  new WebpackShellPluginNext({
    onBuildStart: {
      scripts: ['yarn run build:lang:pegjs'],
      blocking: true,
      parallel: false,
    },
  }),
);

module.exports = config;