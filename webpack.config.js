const CommonConfigWebpackPlugin = require("common-config-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  plugins: [new CommonConfigWebpackPlugin()],
};
