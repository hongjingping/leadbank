const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.config.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const devConfig = {
  devtool: '#eval',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module : {
  	rules : [
		  		{
			        test: /\.vue$/,
			        use : [{
				        loader : 'vue-loader',
				        options : {
				            loaders: {
				              	less: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
				                	use: ['css-loader','less-loader'],
				                	fallback: 'vue-style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
				            	}))
				            }
				        }
				    }]
				},
				{
					test: /\.css$/,
					use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
						fallback: "style-loader",
						use:["css-loader"]
					}))
				},
				{
					test: /\.less$/,
					use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: [
							"css-loader",
							"less-loader"
						]
					}))
				}
	]
  }
}
baseWebpackConfig.devtool = devConfig.devtool;
baseWebpackConfig.plugins = baseWebpackConfig.plugins.concat(devConfig.plugins);
baseWebpackConfig.module.rules = baseWebpackConfig.module.rules.concat(devConfig.module.rules);

module.exports = baseWebpackConfig;
