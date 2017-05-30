import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import express from 'express';
import path from 'path';

import apiSnippets from './api/apiSnippets';

var mongoStore = require('connect-mongo')(session);

import User from './models/User.js';
import Snippet from './models/Snippet.js';


var app = express();


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/snippets');
mongoose.connection.on('error', function(err){
  console.error("error connecting to the DB "+ err);
  process.exit(-1);
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'/public')));


app.use(session({
	secret: 'my super secret password.',
	resave: false,
	saveUninitialized: true,
    store: new mongoStore({mongooseConnection: mongoose.connection})

}));

app.use('/api', apiSnippets);

app.listen(process.env.PORT || 3000, function(){
	console.log("listening on 3000");
});




