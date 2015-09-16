/* eslint global-strict:0 */
"use strict";

var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    frameworks: ["phantomjs-shim", "mocha", "sinon-chai"],
    basePath: ".",
    browsers: ["PhantomJS"],
    'PhantomJS_Desktop': {
      base: 'PhantomJS',
        options: {
          viewportSize: {
            width: 1200,
            height: 600
        }
      }
    },
    reporters: ["mocha", "coverage"],
    files: [
      "test/specs/**/*.spec.js",
      "slick/slick.css",
      "slick/slick-theme.css"
    ],
    preprocessors: {
      "test/specs/**/*.spec.js": ["webpack"]
    },
    webpack: {
      cache: true,
      module: {
        loaders: [{
          test: /\.(js)$/,
          exclude: [/node_modules/],
          loader: "babel-loader?stage=1"
        }],
        postLoaders: [{
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components|helpers|plugins|[.]spec[.]js)/,
          loader: "istanbul-instrumenter"
        }]
      },
      resolve: {
        root: [__dirname],
        modulesDirectories: ["node_modules","src"],
        extensions: ["", ".js", ".jsx"]
      },
      plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            "window.$": "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
      ]
    },
    webpackServer: {
      quiet: false,
      noInfo: true,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    },
    exclude: [],
    port: 9999,
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    browserNoActivityTimeout: 60000,
    plugins: [
      require("karma-coverage"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-phantomjs-shim"),
      require("karma-sinon-chai"),
      require("karma-webpack")
    ],
    coverageReporter: {
      type: "text"
    },
    captureTimeout: 100000,
    singleRun: true
  });
};
