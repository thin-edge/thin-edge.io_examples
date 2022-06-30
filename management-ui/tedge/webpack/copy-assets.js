const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./branding", to: "./branding" },
      ],
    }),
  ],
};