'use strict';

module.exports= {
	host : 'http://localhost',
	port: process.env.PORT || 3000,
	db: process.env.DB || 'mongodb://localhost/snippets'
}
