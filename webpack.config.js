/* eslint global-strict:0 */
"use strict";

var webpack = require("webpack");
var path = require("path");
var info = require('./package.json');

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
    path: path.join(__dirname, "slick")
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
    new webpack.BannerPlugin([
' Version: ' + info.version,
'  Author: Ken Wheeler',
' Website: http://kenwheeler.github.io',
'    Docs: http://kenwheeler.github.io/slick',
'    Repo: http://github.com/kenwheeler/slick',
'  Issues: http://github.com/kenwheeler/slick/issues',
    ].join('\r\n'))
  ],
  resolve: {
    root: [__dirname],
    modulesDirectories: ["node_modules"],
    extensions: ["", ".js"]
  }
};
