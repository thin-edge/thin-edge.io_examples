const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/assets", to: "./assets" },
      ],
    }),
  ],
};