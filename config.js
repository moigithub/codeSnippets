'use strict';

module.exports= {
	host : process.env.HOST || '//localhost',
	port: process.env.PORT || 3000,
	db: process.env.DB || 'mongodb://localhost/codesnippets'
}
