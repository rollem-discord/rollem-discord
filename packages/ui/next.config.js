// next.config.js
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

// references:
// - pg-native failure https://github.com/netlify/next-on-netlify/issues/33

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: webpack is provided, so we do not need to `require` it

    // Do not include .native which tries to load pg-native
    // See: https://github.com/sequelize/sequelize/issues/3781#issuecomment-537979334
    config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/))

    // https://github.com/typeorm/typeorm/blob/master/docs/faq.md#how-to-use-webpack-for-the-backend
    // ignore the drivers you don't want. This is the complete list of all drivers -- remove the suppressions for drivers you want to use.
    config.plugins.push(new FilterWarningsPlugin({
      exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /pg/, /pg-query-stream/, /react-native-sqlite-storage/, /redis/, /sqlite3/, /sql.js/, /typeorm-aurora-data-api-driver/]
    }))

    // Important: return the modified config
    return config
  },
};