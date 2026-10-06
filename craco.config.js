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
  }
};