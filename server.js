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

//app.use('/api', apiSnippets);


// to request data to server from client
// send a POST request with application/json as content-type
// {"query":"{Users{_id,email,displayName}}"}
app.use('/graphql', schema);

//create some data on db
const seed=false;
if (seed) {
  Snippet.find().remove();
User.find({}).remove(function() {
  User.create(
  {
  	email: 'test@test.com',
    password: 'test',
    displayName: 'test',
    isAdmin: false
  },function(err,u){
    //console.log(err, u);

    Snippet.create({
      language : 'javascript',
      title: 'some title x',
      description: 'asdf asf salfjjkhfkljhfkljwfwef wefd wef',
      code: 'console.log("hello world")',
      tags : ['react','react router 4', 'redux'],
      links: ['google.com','mdn.io','devdocs.io'],
      postedBy : u._id
    });

    Snippet.create({
      language : 'javascript',
      title: 'some title x',
      description: 'salfjjkhfkljhfkljwfwef wefd wef sdfs 435345 657kjrfg ',
      code: 'alert("hello world")',
      tags : ['apollo','react router 4', 'redux', 'relay', 'recompose', 'redux-observable'],
      links: ['google.com','mdn.io','devdocs.io'],
      postedBy : u._id
    });


  });

  User.create({
  	email: 'Moi@test.com',
    password: 'test',
    displayName: 'Moi',
    isAdmin: false
  },function(err,u){
    Snippet.create({
      language : 'javascript',
      title: 'some title x',
      description: ' tgh4 5g 5t 54t 45gdfg  asdf asf salfjjkhfkljhfkljwfwef wefd wef',
      code: 'console.log("hello world")',
      tags : ['react','react router 4', 'flux'],
      links: ['stackoverflow.com','google.com','mdn.io','devdocs.io'],
      postedBy : u._id
    });


  });

  User.create({
  	email: 'booo@test.com',
    password: 'test',
    displayName: 'Boo',
    isAdmin: false
  },function(err,u){
    Snippet.create({
      language : 'javascript',
      title: 'some title x',
      description: 'salfjjkhfkljhfkljwfwef wefd wef',
      code: 'console.log("hello world")',
      tags : ['react', 'flux'],
      links: ['stackoverflow.com','google.com','mdn.io','devdocs.io'],
      postedBy : u._id
    });


  });

  
  });
}


app.listen(process.env.PORT || 3000, function(){
	console.log("listening on 3000!!");
});


