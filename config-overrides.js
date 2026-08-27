/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */ // Build tools need console output
const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = override(
  // Enhanced path aliases matching tsconfig.json baseUrl and common import patterns
  addWebpackAlias({
    // Root alias matching tsconfig.json
    "@": path.resolve(__dirname, "src"),
    
    // Common directory aliases for cleaner imports
    "@/components": path.resolve(__dirname, "src/components"),
    "@/hooks": path.resolve(__dirname, "src/hooks"),
    "@/utils": path.resolve(__dirname, "src/utils"),
    "@/services": path.resolve(__dirname, "src/services"),
    "@/contexts": path.resolve(__dirname, "src/contexts"),
    "@/types": path.resolve(__dirname, "src/types"),
    "@/constants": path.resolve(__dirname, "src/constants"),
    "@/assets": path.resolve(__dirname, "src/assets"),
    "@/styles": path.resolve(__dirname, "src/styles"),
    "@/layouts": path.resolve(__dirname, "src/layouts"),
    "@/pages": path.resolve(__dirname, "src/pages"),
    "@/store": path.resolve(__dirname, "src/store"),
    "@/models": path.resolve(__dirname, "src/models"),
    "@/config": path.resolve(__dirname, "src/config"),
    
    // Specific file aliases for frequently imported modules
    "@/components/icons": path.resolve(__dirname, "src/icons/index.ts"),
    "@/hooks/use-toast": path.resolve(__dirname, "src/hooks/use-toast.ts")
  }),
  
  (config) => {
    // ==========================================
    // SELECTIVE NODE.JS POLYFILLS CONFIGURATION
    // ==========================================
    // Enable only polyfills that are actually used by dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      
      // DISABLED - Not needed in browser environment
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      dgram: false,
      dns: false,
      readline: false,
      repl: false,
      vm: false,
      
      // ENABLED - Required by some dependencies
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      os: require.resolve('os-browserify/browser'),
      zlib: require.resolve('browserify-zlib'),
      assert: require.resolve('assert/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      events: require.resolve('events/'),
      buffer: require.resolve('buffer/'),
      querystring: false, // Use URLSearchParams instead
      
      // Process global
      process: require.resolve('process/browser')
    };
    
    // ==========================================
    // PROVIDE PLUGINS FOR GLOBALS
    // ==========================================
    config.plugins.push(
      // Provide Buffer and process globally
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      }),
      
      // Define environment variables for better debugging
      new webpack.DefinePlugin({
        'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG || ''),
        'process.env.BROWSER': JSON.stringify(true)
      })
    );

    // ==========================================
    // PERFORMANCE OPTIMIZATIONS
    // ==========================================
    
    // Optimize production builds
    if (process.env.NODE_ENV === 'production') {
      // Code splitting optimization
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            // Vendor chunk for node_modules
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              enforce: true
            },
            // React ecosystem chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
              name: 'react-vendor',
              chunks: 'all',
              priority: 20,
              enforce: true
            },
            // UI libraries chunk
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|@headlessui|framer-motion|lucide-react)[\\/]/,
              name: 'ui-vendor',
              chunks: 'all',
              priority: 15,
              enforce: true
            },
            // Default chunk
            default: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true
            }
          }
        },
        
        // Minification
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // Remove console.log in production
                drop_debugger: true,
                pure_funcs: ['console.debug'] // Mark debug functions as pure
              },
              format: {
                comments: false // Remove comments
              }
            },
            extractComments: false
          }),
          new CssMinimizerPlugin()
        ],
        
        // Runtime chunk for better caching
        runtimeChunk: 'single'
      };
    }
    
    // ==========================================
    // DEVELOPMENT ENHANCEMENTS
    // ==========================================
    if (process.env.NODE_ENV !== 'production') {
      // Better error overlay in development
      config.devtool = 'cheap-module-source-map';
      
      // Faster rebuilds
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename]
        }
      };
    }
    
    // ==========================================
    // MODULE RESOLUTION ENHANCEMENTS
    // ==========================================
    
    // Disable ModuleScopePlugin to allow imports from outside src
    config.resolve.plugins = config.resolve.plugins.filter(
      plugin => plugin.constructor.name !== 'ModuleScopePlugin'
    );
    
    // Add extensions for easier imports
    config.resolve.extensions = [
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
      '.json',
      '.mjs'
    ];
    
    // Fix for ESM modules requiring process/browser
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false
      }
    });
    
    // ==========================================
    // ENSURE POSTCSS/TAILWIND PROCESSING
    // ==========================================
    // Find and verify existing CSS/PostCSS rules are intact
    const cssRuleIndex = config.module.rules.findIndex(rule => 
      rule.oneOf && rule.oneOf.some(r => r.test && r.test.toString().includes('css'))
    );
    
    if (cssRuleIndex !== -1) {
      console.log('✅ CSS/PostCSS rules found and preserved');
      // Debug: Log the CSS rule structure
      const cssRule = config.module.rules[cssRuleIndex];
      if (cssRule.oneOf) {
        console.log('📋 CSS Rule oneOf entries:', cssRule.oneOf.length);
        cssRule.oneOf.forEach((rule, idx) => {
          if (rule.use && Array.isArray(rule.use)) {
            const loaders = rule.use.map(u => typeof u === 'string' ? u : u.loader).filter(Boolean);
            console.log(`  Entry ${idx}:`, loaders.join(' → '));
          }
        });
      }
    } else {
      console.warn('⚠️  WARNING: CSS/PostCSS rules not found - Tailwind may not work!');
    }
    
    // ==========================================
    // ENHANCED CSS INJECTION WITH TAILWIND SUPPORT
    // ==========================================
    // Make sure the CSS processing works for both development and production
    config.module.rules = config.module.rules.map(rule => {
      if (rule.oneOf) {
        return {
          ...rule,
          oneOf: rule.oneOf.map(subRule => {
            // Look for CSS rules and enhance them
            if (subRule.test && subRule.test.toString().includes('css')) {
              // Ensure the CSS rule has proper PostCSS processing for Tailwind
              if (subRule.use) {
                const hasPostCssLoader = subRule.use.some(use => 
                  typeof use === 'object' && use.loader && use.loader.includes('postcss-loader')
                );
                
                if (!hasPostCssLoader) {
                  // Add postcss-loader for Tailwind processing after css-loader
                  const newUse = [];
                  subRule.use.forEach(use => {
                    newUse.push(use);
                    // Add postcss-loader after css-loader
                    if (typeof use === 'object' && use.loader && use.loader.includes('css-loader')) {
                      newUse.push({
                        loader: require.resolve('postcss-loader'),
                        options: {
                          ident: 'postcss',
                          plugins: () => [
                            require('tailwindcss'),
                            require('autoprefixer')
                          ]
                        }
                      });
                    }
                  });
                  subRule.use = newUse;
                }
              }
            }
            return subRule;
          })
        };
      }
      return rule;
    });
    
    // ==========================================
    // CSS INJECTION DEBUGGING
    // ==========================================
    // Add a plugin to track CSS module processing
    const CssInjectionTrackerPlugin = {
      apply: (compiler) => {
        compiler.hooks.compilation.tap('CssInjectionTracker', (compilation) => {
          compilation.hooks.succeedModule.tap('CssInjectionTracker', (module) => {
            if (module.resource && module.resource.endsWith('.css')) {
              console.log(`✅ CSS Module Processed: ${module.resource.replace(__dirname, '.')}`);
            }
          });
          
          compilation.hooks.finishModules.tap('CssInjectionTracker', (modules) => {
            const cssModules = modules.filter(m => m.resource && m.resource.endsWith('.css'));
            console.log(`\n📊 CSS Processing Summary:`);
            console.log(`   Total CSS modules: ${cssModules.length}`);
            cssModules.forEach(m => {
              console.log(`   - ${m.resource.replace(__dirname, '.')}`);
            });
            
            if (cssModules.length === 0) {
              console.error('❌ CRITICAL: No CSS modules were processed!');
              console.error('   This means index.css is not being imported or webpack cannot find it.');
              
              // Try to find index.css and report its status
              const fs = require('fs');
              const indexPath = path.join(__dirname, 'src', 'index.css');
              if (fs.existsSync(indexPath)) {
                console.log(`✅ index.css file exists at: ${indexPath}`);
                console.log('   Make sure it\'s being imported in index.tsx');
              } else {
                console.error(`❌ index.css file does not exist at: ${indexPath}`);
              }
            } else {
              console.log('✅ CSS processing appears to be working correctly');
            }
          });
        });
      }
    };
    
    config.plugins.push(CssInjectionTrackerPlugin);

    // ==========================================
    // BUILD MONITORING & ANALYSIS
    // ==========================================
    
    // Add progress reporting
    config.infrastructureLogging = {
      level: 'warn' // Reduce noise in logs
    };
    
    // Performance hints
    config.performance = {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxAssetSize: 500000, // 500 KB
      maxEntrypointSize: 500000, // 500 KB,
      assetFilter: (assetFilename) => {
        // Don't show warnings for map files or HTML
        return !assetFilename.endsWith('.map') && !assetFilename.endsWith('.html');
      }
    };
    
    return config;
  }
);