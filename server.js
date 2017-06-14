import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import express from 'express';


var passport = require('passport');
var flash    = require('connect-flash');


import path from 'path';

import config from './config';

import schema from './schema';

//import apiSnippets from './api/apiSnippets';


import React from 'react';
import { Provider } from "react-redux";
//import App from './client/components/App';
import configureStore from './client/configureStore';
import * as snippetsActions from './client/actions/snippetsActions';
import {renderRoutes} from 'react-router-config';
import { match, matchPath, RouterContext } from 'react-router';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';

import User from './models/User.js';
import Snippet from './models/Snippet.js';
import routes from './client/routes';
import AppLayout from './client/components/AppLayout';

var app = express();
app.set('view engine','ejs')



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
app.use(flash());

app.use(express.static(path.join(__dirname,'/public')));

var mongoStore = require('connect-mongo')(session);

app.use(session({
	secret: 'my super secret password.',
	resave: false,
	saveUninitialized: true,
    store: new mongoStore({mongooseConnection: mongoose.connection})

}));

//app.use('/api', apiSnippets);



/* **************  */
/*  auth           */
/* **************  */
import passportConfig from './passport';
passportConfig(passport);

app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') }); 
});

app.post('/login', passport.authenticate('local-login',{
  successRedirect: '/snippets',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/user', function(req,res){
  res.json(req.User);
});

function checkMid(req,res,next){
  console.log("signup");
  return next();
}


// to request data to server from client
// send a POST request with application/json as content-type
// {"query":"{Users{_id,email,displayName}}"}
app.use('/graphql', schema);


// universal routing and rendering
app.get('/snippets/:id?', (req, res) => {

let store = configureStore();
const context = {};
var html;

//console.log("server \n\n\n\n*",req.params);
  return store.dispatch(snippetsActions.getSnippetsFromServer())
    .then( ()=>{
      const snippetId = req.params.id;
      if(snippetId){
//        console.log("snippetId", snippetId);
        return store.dispatch(snippetsActions.getSnippetByIdFromServer(snippetId))
      }
    })
    .then(()=>{
        html= renderToString(
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              <AppLayout>
                {renderRoutes(routes)}
              </AppLayout>
            </StaticRouter>
          </Provider>
          );
    
        if (context.url) {
            // Somewhere a `<Redirect>` was rendered
  //          console.log("context ",context, context.url);
            res.redirect(301, context.url)
        } else {
  //        console.log("ssr");
            res.render('index', { html });
        }
    });
});

app.get('*', (req,res)=>{
  res.redirect('/snippets');
});

//create some data on db
const seed=true;
if (seed) {
  Snippet.find({}).remove(function(){
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
          title: 'react router 4',
          description: 'asdf asf salfjjkhfkljhfkljwfwef wefd wef',
          code: 'console.log("hello world")',
          tags : ['react','react router 4', 'redux'],
          links: ['google.com','mdn.io','devdocs.io'],
          postedBy : u._id
        });

        Snippet.create({
          language : 'javascript',
          title: 'redux saga',
          description: 'salfjjkhfkljhfkljwfwef wefd wef sdfs 435345 657kjrfg ',
          code: 'alert("hello world")',
          tags : ['apollo','react router 4', 'redux', 'relay', 'recompose', 'redux-observable'],
          links: ['google.com','mdn.io','devdocs.io'],
          postedBy : u._id
        });

        Snippet.create({
          language : 'Ruby',
          title: 'lambda',
          description: 'salfjjkhfkljhfkljwfwef wefd wef sdfs 435345 657kjrfg ',
          code: 'alert("hello world")',
          tags : ['lambda','router 4', 'meta code'],
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
          title: 'mongoose connect & err handler',
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
          title: 'redux thunk createStore & middleware',
          description: 'salfjjkhfkljhfkljwfwef wefd wef',
          code: 'console.log("hello world")',
          tags : ['react', 'flux'],
          links: ['stackoverflow.com','google.com','mdn.io','devdocs.io'],
          postedBy : u._id
        });


        Snippet.create({
          language : 'Ruby',
          title: 'bomba',
          description: ' wefd wef sdfs 435345 657kjrfg ',
          code: 'alert("hello world")',
          tags : ['tesla','scoobydoo', 'meta code'],
          links: ['google.com','devdocs.io'],
          postedBy : u._id
        });

      });

      
      });
});
}


app.listen(config.port, function(){
	console.log("listening on 3000!!");
});


