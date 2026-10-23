const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react-native$': 'react-native-web',
    },
    configure: (webpackConfig, { env, paths }) => {
      // Remove ModuleScopePlugin to allow imports outside of src/
      if (webpackConfig.resolve && webpackConfig.resolve.plugins) {
        webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
          (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
        );
      }

      // Filter out ESLintWebpackPlugin so formatting rules don't crash dev server
      if (webpackConfig.plugins) {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin'
        );
      }
      
      webpackConfig.output = {
        ...webpackConfig.output,
        publicPath: '/',
      };

      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        path: false,
        fs: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        os: false,
        zlib: false,
      };

      return webpackConfig;
    }
  },
  devServer: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  }
};
