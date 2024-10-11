const { IgnorePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const config = {
  entry: './src/bot.ts',
  target: 'node',
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  plugins: [
    new IgnorePlugin({ resourceRegExp: /^bufferutil$/ }), // ws peer dependency
    new IgnorePlugin({ resourceRegExp: /^utf-8-validate$/ }), // ws peer dependency
    // new IgnorePlugin({ resourceRegExp: /^debug$/ }), // follow-redirects peer dependency. Breaks if disabled.
    new FilterWarningsPlugin({ exclude: [ /the request of a dependency is an expression/ ]}), // express produced one
    new FilterWarningsPlugin({ exclude: [ /debug.*?peer dependency/ ]}), // I blame TypeORM
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
        exclude: /node_modules/,
      },
      {
        test: /\.pegjs$/,
        use: "pegjs-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".pegjs"],
    alias: {
      "@bot": path.resolve(__dirname, "src/discord/rollem-bot/"),
      "@common": path.resolve(__dirname, "src/common/"),
    },
  },
  devtool: 'cheap-module-source-map',
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
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