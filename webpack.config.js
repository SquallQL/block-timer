const CommonConfigWebpackPlugin = require("common-config-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  plugins: [new CommonConfigWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.mp3$/,
        loader: "file-loader",
      },
    ],
  },
};
