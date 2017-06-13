import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import express from 'express';
//import ejs from 'ejs';
import path from 'path';

import ReactDOMServer from 'react-dom/server'
import { match, matchPath, RouterContext } from 'react-router';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';

import config from './config';


import schema from './schema';

import apiSnippets from './api/apiSnippets';

var mongoStore = require('connect-mongo')(session);



import React from 'react';
import { Provider } from "react-redux";
//import App from './client/components/App';
import configureStore from './client/configureStore';
import * as snippetsActions from './client/actions/snippetsActions';
import {renderRoutes} from 'react-router-config';


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

app.use(express.static(path.join(__dirname,'/public')));


app.use(session({
	secret: 'my super secret password.',
	resave: false,
	saveUninitialized: true,
    store: new mongoStore({mongooseConnection: mongoose.connection})

}));

//app.use('/api', apiSnippets);


/*
app.get('/', (req,res)=>{
  htmlToString(req).then(html=>{
    res.render('index', { html:html });
  })
});
*/

// to request data to server from client
// send a POST request with application/json as content-type
// {"query":"{Users{_id,email,displayName}}"}
app.use('/graphql', schema);

// universal routing and rendering
app.get('*', (req, res) => {

  let store = configureStore();
  const context = {};
//console.log("server \n\n\n\n*",req.params);
  return store.dispatch(snippetsActions.getSnippetsFromServer()).then( ()=>{
    const html= ReactDOMServer.renderToString(
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
        console.log("context ",context, context.url);
        res.redirect(301, context.url)
    } else {
      console.log("ssr");
        res.render('index', { html });
    }
  });
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


