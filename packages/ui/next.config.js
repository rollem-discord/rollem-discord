const path = require('path');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

// references:
// - pg-native failure https://github.com/netlify/next-on-netlify/issues/33
// - nextjs TS module import https://github.com/vercel/next.js/issues/9474

module.exports = {
  async redirects() {
    return [
      {
        source: '/invite',
        destination: 'https://discordapp.com/oauth2/authorize?client_id=240732567744151553&scope=bot&permissions=103079282688',
        permanent: false,
      },
      {
        source: '/invite/next',
        destination: 'https://discordapp.com/oauth2/authorize?client_id=840409146738475028&scope=bot&permissions=103079282688',
        permanent: false,
      },
      {
        source: '/app-directory',
        destination: 'https://discord.com/application-directory/240732567744151553',
        permanent: false,
      },
      {
        source: '/app-directory/next',
        destination: 'https://discord.com/application-directory/840409146738475028',
        permanent: false,
      },
      {
        source: '/get-support',
        destination: 'https://discord.gg/VhYX9u7',
        permanent: false,
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: webpack is provided, so we do not need to `require` it
    const IgnorePlugin = webpack.IgnorePlugin;

    // Do not include .native which tries to load pg-native
    // See: https://github.com/sequelize/sequelize/issues/3781#issuecomment-537979334
    config.plugins.push(
      new IgnorePlugin({ resourceRegExp: /^react-native-sqlite-storage$/}), // typeorm peer dependency
      new IgnorePlugin({ resourceRegExp: /^mysql$/}), // typeorm peer dependency
      new FilterWarningsPlugin({ exclude: [ /the request of a dependency is an expression/ ] }), // type ORM spams these
    );

    // console.log(defaultLoaders);
    config.module.rules.push({
      test: /\.tsx?$/,
      use: ["ts-loader"],
    })
    // config.module.rules.push({
    //   test: /\.tsx?|\.ts?$/,
    //   use: [defaultLoaders.type],
    // });

    // config.resolve.alias = config.alias || {};
    // config.resolve.alias['pg-native'] = path.join(__dirname, 'aliases/pg-native.js');

    // Important: return the modified config
    return config
  },
  experimental: {
    // Need to disable minification for TypeORM
    // See https://github.com/typeorm/typeorm/issues/4714
    // See https://github.com/vercel/next.js/issues/59594
    // See https://github.com/vercel/next.js/discussions/58182
    serverMinification: false,
  },

  // Standalone required for docker deploy?
  // Source: https://nextjs.org/docs/pages/building-your-application/deploying#docker-image
  // -> https://github.com/vercel/next.js/tree/v14.2.13/examples/with-docker
  // TODO: Didn't work for me. Trying without.
  // output: "standalone",
};