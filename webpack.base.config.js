var path = require('path')
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let moduleConfig = {
  entry: {
    index: ['./src/index.js']
  },
  output: {
    path: __dirname + '/dist/',
    filename: 'js/[name].js?[hash:5]',
    publicPath : '/',
    chunkFilename: "js/chunk[id].js?[hash:5]"
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
    new ImageminPlugin({
      disable : process.env.DEV_ENV.replace(/\s/,'') !== 'build25' && process.env.DEV_ENV.replace(/\s/,'') !== 'build',
      test : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      minFileSize : 10000,
      pngquant: {
        quality: '80-90',
      },
    }),
    new ExtractTextPlugin({
      filename : "css/common.css?[hash:5]",
      allChunks: true
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./vendor-manifest.json')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // 在htmlwebpack后插入一个AddAssetHtmlPlugin插件，用于将vendor插入打包后的页面
    new AddAssetHtmlPlugin({ 
      filepath: require.resolve('./src/library/vendor.js'), 
      includeSourcemap: false ,
      hash : true,
      outputPath : "./lib", //相对与d输出文件dist的相对路径
      publicPath : process.env.DEV_ENV.replace(/\s/,'') == 'build' ? '/html/resume/dist/lib' : '/lib',  //HTML中引入公共第三方js的路径链接
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/otherFiles/safe-min.js',
        to: 'js'
      }
    ],{
      copyUnmodified: true
    }),
    new webpack.BannerPlugin('leadBank版权所有,请勿转载'),
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve('src')],
        exclude :  /library/
      },
      {
        test: /\.js|jsx$/,
        use :[
          {
            loader : 'babel-loader'
          }
        ],
        include: [path.resolve('src')],
        exclude :  /(node_modules|bower_components)/
        
      },
      {
        test: /\jweixin-1.2.0.js$/,
        use :[{
          loader : 'script-loader'
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use : [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name : '[name].[ext]?[hash:5]',
              outputPath : 'img/'
            }
          }
        ]
        
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use : [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name : '[name].[ext]?[hash:5]',
              outputPath : 'video/'
            }
        }]
        
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use : [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name : '[name].[ext]?[hash:5]',
                outputPath : 'font/'
              }
          }
        ]
        
      }
    ]
  }
}

if(process.env.DEV_ENV.replace(/\s/,'') == 'build'){
  moduleConfig.output.publicPath = "/html/resume/dist/"
}else{
  moduleConfig.output.publicPath = "/"
}
module.exports = moduleConfig;