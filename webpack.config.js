/* eslint global-strict:0 */
"use strict";

var webpack = require("webpack");
var path = require("path");

module.exports = {
  cache: true,
  entry: {
    bundle: "./src/index.js"
  },
  externals: [
    {
      "jquery": {
        root: "$",
        commonjs2: "jquery",
        commonjs: "jquery",
        amd: "jquery"
      }
    }
  ],
  output: {
    libraryTarget: "umd",
    library: "Slick",
    filename: "slick.min.js",
    path: path.join(__dirname, "dist")
  },
  module: {
    loaders: [{
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: "babel-loader?stage=1"
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.SourceMapDevToolPlugin("[file].map")
  ],
  resolve: {
    root: [__dirname],
    modulesDirectories: ["node_modules"],
    extensions: ["", ".js"]
  }
};
