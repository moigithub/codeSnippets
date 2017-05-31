import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import express from 'express';
import path from 'path';

import schema from './schema';

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



app.use('/graphql', schema);

//create some data on db
User.find({}).remove(function() {
  User.create(
  {
  	email: 'test@test.com',
    password: 'test',
    displayName: 'test',
    isAdmin: false
  },
  {
  	email: 'Moi@test.com',
    password: 'test',
    displayName: 'Moi',
    isAdmin: false
  },
  {
  	email: 'booo@test.com',
    password: 'test',
    displayName: 'Boo',
    isAdmin: false
  }
  )
  });



app.listen(process.env.PORT || 3000, function(){
	console.log("listening on 3000");
});


