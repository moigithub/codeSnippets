const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin=require('extract-text-webpack-plugin');

var clientConfig = {
	context: path.resolve(__dirname, './'),
	target: 'web',
	entry: './client/index.js',
	output: {
		path:path.resolve(__dirname, './public'),
		libraryTarget: 'commonjs',
		publicPath: '/',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		//root: path.resolve(__dirname),
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use:{
					loader: 'babel-loader',
					options: {
		              presets: ['es2015', 'react', 'stage-0'],
		            }
	        	},
				exclude: /node_modules/
			},
  			{
                test: /\.(css|scss)$/,
                loader: ExtractTextPlugin.extract({
				    fallback: 'style-loader',
			        use: [
			          {loader:'css-loader?-url&sourceMap&localIdentName=css-module-[hash:base64]'},
			          {loader:'sass-loader?sourceMap'}
			        ]                	
                }),
            },		
    ]

	},
	devtool: "cheap-module-eval-source-map",
	plugins: [
	    new webpack.DefinePlugin({
	      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	    }),
	    new ExtractTextPlugin({
		    filename: 'build.min.css',
		    allChunks: true,
		}),
		new webpack.optimize.CommonsChunkPlugin({
		    name: 'vendor',
		    filename: 'vendor-[hash].min.js',
		}),
	    new webpack.optimize.OccurrenceOrderPlugin(),
	    new webpack.optimize.UglifyJsPlugin({
	      compress: { warnings: false },
	      mangle: true,
	      sourcemap: false,
	      beautify: false,
	      dead_code: true
	    })
	]	
};

var serverConfig = {
	context: path.resolve(__dirname, './server'),
	target: 'node',
	entry: './server.js',
	output: {
		path:path.resolve(__dirname, './dist'),
		filename: 'server.js'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
//		root: path.resolve(__dirname),
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use:{
					loader: 'babel-loader',
					options: {
		              presets: ['es2015', 'react', 'stage-0'],
		            }
	        	},
				exclude: /node_modules/
			}
		]

	},
	devtool: "cheap-module-eval-source-map",
	plugins: [
	    new webpack.DefinePlugin({
	      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	    }),
	    new webpack.optimize.OccurrenceOrderPlugin(),
	    new webpack.optimize.UglifyJsPlugin({ // NO usar webpack -p (-p option add uglify, tons seria duplicado)
	      compress: { warnings: false },
	      mangle: true,
	      sourcemap: false,
	      beautify: false,
	      dead_code: true
	    })
	]	
};

module.exports=[clientConfig, serverConfig];