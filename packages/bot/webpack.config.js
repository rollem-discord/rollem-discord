const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const config = {
  entry: './src/discord/rollem-bot/bot.ts',
  target: 'node',
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
    new FilterWarningsPlugin({
      exclude: [
        /the request of a dependency is an expression/,
        /mongodb/,
        /mssql/,
        /mysql/,
        /mysql2/,
        /oracledb/,
        /pg/,
        /pg-query-stream/,
        /react-native-sqlite-storage/,
        /redis/,
        /sqlite3/,
        /sql.js/,
        /typeorm-aurora-data-api-driver/,
        /hdb-pool/,
        /@sap\/hana-client/,
        /utf-8-validate/,
        /bufferutil/,
        /zlib-sync/,
        /erlpack/,
        /@opentelemetry/,
        /applicationinsights-native-metrics/,
      ],
    }),
    // new CopyPlugin({
    //   patterns: [
    //     { from: "**/*", to: "" },
    //   ],
    // }),
  ],
  node: {
    global: true,
    __filename: false,
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        test: /\.pegjs$/,
        use: "pegjs-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@language-v1": path.resolve(__dirname, "src/rollem-language-1/"),
      "@language-v1-beta": path.resolve(__dirname, "src/rollem-language-1-beta/"),
      "@language-v2": path.resolve(__dirname, "src/rollem-language-2/"),
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};

// if (process.env.NODE_ENV !== 'production') {
//   config.plugins.push(new WebpackShellPluginNext({
//     onBuildStart:{
//       scripts: ['echo "Webpack Start"'],
//     },
//     onDoneWatch: {
//       scripts: ['yarn run webpack:launch'],
//       blocking: false,
//     }
//   }));
// }

module.exports = config;