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

let store = configureStore();
// fetch data from server
store.dispatch(snippetsActions.getSnippetsFromServer()); 
console.log("store2",store.getState());

ReactDOM.render(<Provider store={store}>
					<BrowserRouter>
						<AppLayout>
							{renderRoutes(routes)}
						</AppLayout>
					</BrowserRouter>
				</Provider>
				, document.getElementById("app"));


