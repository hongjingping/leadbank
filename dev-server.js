var webpack = require('webpack')
var opn = require('opn')
var express = require("express")
var http = require('http')
var ip = require('ip')
var proxy = require('http-proxy-middleware')
var webpackDevMiddleware = require("webpack-dev-middleware")
var webpackHotMiddleware = require("webpack-hot-middleware")
var config = require('./webpack.dev.config.js')

// var Dashboard = require('webpack-dashboard');
// const DashboardPlugin = require('webpack-dashboard/plugin')

var app = express();
Object.keys(config.entry).forEach(function(name){
	(config.entry)[name].push("webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true");
})
var compiler = webpack(config);

// 美化控制台
// compiler.apply(new DashboardPlugin(new Dashboard().setData));

var devMiddlewqreConfig = webpackDevMiddleware(compiler,{
		noInfo: true, 
    	publicPath: config.output.publicPath,
    	contentBase: 'dist/',
		stats: {
		   colors: true,
		   hash: false,
		   timings: true,
		   chunks: false,
		   chunkModules: false,
		   modules: false
		}
})
var proxyOption = [
	{
		target: 'http://10.1.1.166:8898', 
  		changeOrigin: true
  },
	{
		target: 'http://10.1.1.25:8086', 
  		changeOrigin: true
	},
	{
		target: 'http://devwww.leadbank.com.cn', 
  		changeOrigin: true
	},
	{
		target: 'http://10.1.1.25:8086', 
  		changeOrigin: true
	},
	{
		target: 'http://testwww.leadfund.com.cn', 
  		changeOrigin: true
	},
]
app.use('/front-gateway-web',proxy(proxyOption[0]));
app.use('/appjson',proxy(proxyOption[1]));
app.use('/wechatgateweb',proxy(proxyOption[2]));
app.use('/cms-gateway',proxy(proxyOption[3]));
app.use(devMiddlewqreConfig);

app.use(require("webpack-hot-middleware")(compiler));

var server = http.createServer(app);

// 监听的端口
const port = 1108;

server.listen(port,ip.address(),(err) => {
  if (err) throw err
  console.log('==> 🌎 Listening on  http:// ' + ip.address() +":" + port );
})
opn("http://" + ip.address() + ":" + port + "/index.html");