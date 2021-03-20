// next.config.js

// references:
// - pg-native failure https://github.com/netlify/next-on-netlify/issues/33

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: webpack is provided, so we do not need to `require` it

    // Do not include .native which tries to load pg-native
    // See: https://github.com/sequelize/sequelize/issues/3781#issuecomment-537979334
    config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/))

    // Important: return the modified config
    return config
  },
};