var webpack = require('webpack')
var rm = require('rimraf')
var proConfig = require('./webpack.pro.config.js')

rm("./dist",err => {
	webpack(proConfig,(e,s) => {
		if (e) throw e
		process.stdout.write(s.toString({
	      colors: true,
	      modules: false,
	      children: false,
	      chunks: false,
	      chunkModules: false
	    }) + '\n')
	})
})

