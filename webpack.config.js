const webpack = require('webpack');

var config = {
	entry: './client/index.js',
	output: {
		path: __dirname+'/public',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				query: {
	              presets: ['es2015', 'react', 'stage-0']
	            },
			}
		]

	},
	devtool: "cheap-module-eval-source-map",
	plugins: [
	    new webpack.DefinePlugin({
	      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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

module.exports=config;