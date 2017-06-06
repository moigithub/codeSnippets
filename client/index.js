import React from 'react';
import ReactDOM from 'react-dom';


import { BrowserRouter,Switch, Route, Link} from 'react-router-dom';


import App from './components/App';



import { Provider } from "react-redux";

import * as snippetsActions from './actions/snippetsActions';

import configureStore from './configureStore';

let store = configureStore();
// fetch data from server
store.dispatch(snippetsActions.getSnippetsFromServer()); 
console.log("store2",store.getState());

ReactDOM.render(<Provider store={store}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</Provider>
				, document.getElementById("app"));



//asdfdsf