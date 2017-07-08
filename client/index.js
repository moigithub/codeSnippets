'use strict';

import React from 'react';
import ReactDOM from 'react-dom';


import { BrowserRouter,Switch, Route, Link} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';

//import App from './components/App';

import routes from './routes';

import { Provider } from "react-redux";
import AppLayout from './components/AppLayout';

import * as snippetsActions from './actions/snippetsActions';

import configureStore from './configureStore';

import getUser from './components/userService';

//console.log("\n\n\n\nstate",window.__STATE__);
let store = configureStore(window.__STATE__);
// fetch data from server
//store.dispatch(snippetsActions.getSnippetsFromServer()); 
//console.log("store2",store.getState());

const user = null; // get user from store?? service? global variable?

getUser().then(user=>{

	ReactDOM.render(<Provider store={store}>
						<BrowserRouter>
							<AppLayout user={ user || null }>
								{renderRoutes(routes)}
							</AppLayout>
						</BrowserRouter>
					</Provider>
					, document.getElementById("app"));


});