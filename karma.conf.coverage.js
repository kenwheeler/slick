"use strict";
/*
 * Karma Configuration: "coverage" version.
 *
 * This configuration is the same as basic one-shot version, just with coverage.
 */
var webpackCovCfg = require("./webpack.config.coverage");

module.exports = function (config) {
  require("./karma.conf")(config);
  config.set({
    reporters: ["spec", "coverage"],
    webpack: webpackCovCfg,
    coverageReporter: {
      reporters: [
        { type: "json", file: "coverage.json" },
        { type: "lcov" },
        { type: "text-summary" }
      ],
      dir: "coverage/client"
    }
  });
};
