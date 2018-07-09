const fontAwesomeConfig = require('./font-awesome.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// fontAwesomeConfig.styleLoader = ExtractTextPlugin.extract('css-loader!less-loader');
module.exports = fontAwesomeConfig;

