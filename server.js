import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import express from 'express';
var favicon = require('serve-favicon');

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
import {renderRoutes, matchRoutes} from 'react-router-config';

import { match, matchPath, RouterContext } from 'react-router';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';

import User from './models/User.js';
import Snippet from './models/Snippet.js';
import routes from './client/routes';
import AppLayout from './client/components/AppLayout';

var app = express();
app.set('view engine','ejs')
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


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
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

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
  successRedirect: '/snippets',
  failureRedirect: '/signup',
  failureFlash: true
}));

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/user', function(req,res){
//console.log(req);
  if(req.user){
    const  {_id, name, email} = req.user;
    res.json({user: {_id, name, email}});
  } else {
    res.json({user:null});
  }
});


// to request data to server from client
// send a POST request with application/json as content-type
// {"query":"{Users{_id,email,displayName}}"}


const root = {
  authInfo: function(args, request){
    console.log("authInfo",request);
    return request.user;
  }
}


const expressGraphQL = require('express-graphql');

app.use('/graphql', expressGraphQL((request, response)=>{
  console.log('\n\nGRAPHQL\nreq.user:',request.user,'\n\n\nsession:',request.session);
  return {
    schema,
    context:{user : request.user || null},
    graphiql: true,
    rootValue : root
  }
}));


// universal routing and rendering
//load data helper
const loadBranchData = (store,location,query)=> {
//  console.log("server.js: location ", location);

  const branch = matchRoutes(routes, location);

//  console.log("server.js branch", branch);
  const promises = branch.map(({route, match})=>{
    //invoke component loadData method
    //which could be a promise
    
/*   console.log("----------------------");
    console.log("loadBranchData server.js => route: ", route, "\nmatch: ",match);
    console.log("----------------------");
 
    console.log("server.js loadBranchData => route.component :\n", route.component);
    console.log("----------------------");
    console.log("server.js loadBranchData => route.component.wrappedComponent :\n", route.component.WrappedComponent);
    console.log("----------------------");
  */
    const component = route.component;
    return component.WrappedComponent && component.WrappedComponent.loadData  //if have loadData method
      ? component.loadData({store,match,query})  //invoke
      : Promise.resolve(null)
  });

  return Promise.all(promises);
}

//app.get('/snippets/:id?', (req, res) => {
app.get('*', (req,res)=>{

  let store = configureStore();
  const context = {};
  var html;

 // console.log("server \n\n\n\n*",req.params, '\n query: ',req.query);

  loadBranchData(store, req.path, req.query).then(data=>{
//    console.log("server.js: all data loaded",data)

/*    
  });

  return store.dispatch(snippetsActions.getSnippetsFromServer())
    .then( ()=>{
      const snippetId = req.params.id;
      if(snippetId){
//        console.log("snippetId", snippetId);
        return store.dispatch(snippetsActions.getSnippetByIdFromServer(snippetId))
      }
    })
    .then(()=>{
*/      
        html= renderToString(
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              <AppLayout user={req.user|| null }>
                {renderRoutes(routes)}
              </AppLayout>
            </StaticRouter>
          </Provider>
          );
    
  ///  console.log("server.js:  static router context",context);
        if (context.url) {
            // Somewhere a `<Redirect>` was rendered
  //          console.log("context ",context, context.url);
            res.redirect(301, context.url)
        } else {
  //        console.log("ssr");
            res.render('index', { html , user: req.user});
        }
    });
});

/*
app.get('*', (req,res)=>{
  console.log("catch all, redirect");
  res.redirect('/snippets');
});
*/

//create some data on db
const seed=false;
if (seed) {
  Snippet.find({}).remove(function(){
    User.find({}).remove(function() {
      var newUser = new User();
              newUser.email = 'test@test.com';
              newUser.provider = 'local';
              newUser.name= 'test@test.com'
              newUser.password = newUser.generateHash('test');
      newUser.save(function(err){
        //console.log(err, u);

        Snippet.create({
          language : 'javascript',
          title: 'react router 4',
          description: 'asdf asf salfjjkhfkljhfkljwfwef wefd wef',
          code: 'console.log("hello world")',
          tags : ['react','react router 4', 'redux'],
          links: ['google.com','mdn.io','devdocs.io'],
          postedBy : newUser._id
        });

        Snippet.create({
          language : 'javascript',
          title: 'redux saga',
          description: 'salfjjkhfkljhfkljwfwef wefd wef sdfs 435345 657kjrfg ',
          code: 'alert("hello world")',
          tags : ['apollo','react router 4', 'redux', 'relay', 'recompose', 'redux-observable'],
          links: ['google.com','mdn.io','devdocs.io'],
          postedBy : newUser._id
        });

        Snippet.create({
          language : 'Ruby',
          title: 'lambda',
          description: 'salfjjkhfkljhfkljwfwef wefd wef sdfs 435345 657kjrfg ',
          code: 'alert("hello world")',
          tags : ['lambda','router 4', 'meta code'],
          links: ['google.com','mdn.io','devdocs.io'],
          postedBy : newUser._id
        });


      });


      var newUser2 = new User();
              newUser2.email = 'Moi@test.com';
              newUser2.provider = 'local';
              newUser2.name= 'Moi@test.com'
              newUser2.password = newUser2.generateHash('test');
      newUser2.save(function(err){  
        Snippet.create({
          language : 'javascript',
          title: 'mongoose connect & err handler',
          description: ' tgh4 5g 5t 54t 45gdfg  asdf asf salfjjkhfkljhfkljwfwef wefd wef',
          code: 'console.log("hello world")',
          tags : ['react','react router 4', 'flux'],
          links: ['stackoverflow.com','google.com','mdn.io','devdocs.io'],
          postedBy : newUser2._id
        });


      });

      var newUser3 = new User();
              newUser3.email = 'boo@test.com';
              newUser3.provider = 'local';
              newUser3.name= 'boo@test.com'
              newUser3.password = newUser3.generateHash('test');
      newUser3.save(function(err){
        Snippet.create({
          language : 'javascript',
          title: 'redux thunk createStore & middleware',
          description: 'salfjjkhfkljhfkljwfwef wefd wef',
          code: 'console.log("hello world")',
          tags : ['react', 'flux'],
          links: ['stackoverflow.com','google.com','mdn.io','devdocs.io'],
          postedBy : newUser3._id
        });


        Snippet.create({
          language : 'Ruby',
          title: 'bomba',
          description: ' wefd wef sdfs 435345 657kjrfg ',
          code: 'alert("hello world")',
          tags : ['tesla','scoobydoo', 'meta code'],
          links: ['google.com','devdocs.io'],
          postedBy : newUser3._id
        });

      });

      
      });
});
}


app.listen(config.port, function(){
	console.log("listening on 3000!!");
});


