import webpack from 'webpack';
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin';
import CopyPlugin from "copy-webpack-plugin";
import path from 'path';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const config = {
  entry: "./src/rollem-bot/bot.ts",
  target: "node",
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
      "@language-v2": path.resolve(__dirname, "src/rollem-language-2/"),
      "@bot": path.resolve(__dirname, "src/rollem-bot/"),
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

export default config;