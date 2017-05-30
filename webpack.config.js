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

	}
};

module.exports=config;