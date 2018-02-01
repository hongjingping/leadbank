var path = require('path')
const webpack = require('webpack');

const config = {
  entry: {
    vendor : [
      'vue',
      'vuex',
      'better-scroll',
      'vue-router',
      'md5',
      'axios',
      'lib/echarts.min.js',
      'lib/picker.js',
      'lib/RSA.js'
    ]
  },
  output: {
    path: __dirname + '/src/',
    filename: 'library/[name].js',
    library: '[name]_library',
  },
  resolve: {  
      alias: {  
          'vue': 'vue/dist/vue.common.js',
          'less' : path.resolve(__dirname, 'src/less/'),
          'css' : path.resolve(__dirname, 'src/css/'),
          'js' : path.resolve(__dirname, 'src/js/'),
          'lib' : path.resolve(__dirname, 'src/library/'),
          'components' : path.resolve(__dirname, 'src/components/'),
          'router' : path.resolve(__dirname, 'src/router/'),
          'store' : path.resolve(__dirname, 'src/store/')
      }  
  }, 
  plugins : [
    new webpack.DllPlugin({
    // 指定路径
      path: path.join(__dirname, '/', '[name]-manifest.json'),
    // 指定依赖库的名称
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        reserved: ['mutual']
      }
    }),
    new webpack.BannerPlugin('leadBank版权所有,请勿转载'),
  ],
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use :[{
          loader : 'babel-loader'
        }],
        include: [path.resolve('src')],
        exclude :  /(node_modules|bower_components)/
        
      },
    ]
  },
}

webpack(config,function(e,s){
  if (e) throw e
  process.stdout.write(s.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
})