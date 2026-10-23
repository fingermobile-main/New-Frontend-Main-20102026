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

      if (!webpackConfig.optimization) {
        webpackConfig.optimization = {};
      }
      webpackConfig.optimization.splitChunks = {
        ...(webpackConfig.optimization.splitChunks || {}),
        chunks: 'all',
        cacheGroups: {
          ...(webpackConfig.optimization.splitChunks?.cacheGroups || {}),
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'vendor-lucide',
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
        },
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
  devServer: (devServerConfig) => {
    devServerConfig.port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    devServerConfig.host = '0.0.0.0';
    devServerConfig.allowedHosts = 'all';
    devServerConfig.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    };
    devServerConfig.historyApiFallback = {
      disableDotRule: true,
      index: '/',
    };
    return devServerConfig;
  }
};