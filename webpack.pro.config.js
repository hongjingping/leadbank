const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.config.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')


const proConfig = {
	devtool: false,
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
		  mangle: {
		    reserved: ['mutual']
		  }
		})
	],
	module : {
		rules : [
			{
		        test: /\.vue$/,
		        use : [{
		          loader : 'vue-loader',
		          options : {
		          	postcss: [require('autoprefixer')()],
		            loaders: {
		              less: ExtractTextPlugin.extract({
		                use: [
			                	{
									loader : "css-loader",
									options : {
										minimize: true
									}
								},
								"less-loader"
							],
		                fallback: 'vue-style-loader'
		              })
		            }
		          }
		        }]
		      },
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use:[
							{
								loader : "css-loader",
								options : {
									minimize: true
								}
							},
							{
								loader : "postcss-loader",
								options: {           
									plugins:(loader) => [
								      require('autoprefixer')()	
								    ]
								}
							}
						]
					})
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: [
							{
								loader : "css-loader",
								options : {
									minimize: true
								}
							},
							{
								loader : "postcss-loader",
								options: {           
								  plugins: (loader) => [
								      require('autoprefixer')()
								  ]
								}
							},
							"less-loader"
						]
					})
			}
		]
	}
}

baseWebpackConfig.devtool = proConfig.devtool;
baseWebpackConfig.plugins = baseWebpackConfig.plugins.concat(proConfig.plugins);
baseWebpackConfig.module.rules = baseWebpackConfig.module.rules.concat(proConfig.module.rules);

module.exports = baseWebpackConfig;