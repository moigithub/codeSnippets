import React from 'react';
import ReactDOM from 'react-dom';



import App from './components/App';


import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import { snippetReducer } from "./reducers/SnippetReducer";
import thunkMiddleware from "redux-thunk";


import * as snippetsActions from './actions/snippetsActions';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore)

let store = createStoreWithMiddleware(combineReducers({snippets:snippetReducer}));

// fetch data from server
store.dispatch(snippetsActions.getSnippetsFromServer()); 
console.log("store",store.getState());

ReactDOM.render(<Provider store={store}>
					<App />
				</Provider>
				, document.getElementById("app"));



//asdfdsf