const { IgnorePlugin } = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const config = {
  entry: './src/rollem-bot/bot.ts',
  target: 'node',
  plugins: [
    new IgnorePlugin({ resourceRegExp: /^pg-native$/}),
    new FilterWarningsPlugin({
      exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /pg/, /pg-query-stream/, /react-native-sqlite-storage/, /redis/, /sqlite3/, /sql.js/, /typeorm-aurora-data-api-driver/]
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
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.pegjs$/,
        use: 'pegjs-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@language-v1": path.resolve(__dirname, "src/rollem-language-1/"),
      "@language-v2": path.resolve(__dirname, "src/rollem-language-2/"),
      "@bot": path.resolve(__dirname, "src/rollem-bot/"),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
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