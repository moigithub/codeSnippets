import React from 'react';
import ReactDOM from 'react-dom';

import Main from './components/main';


import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import { snippetReducer } from "./reducers/SnippetReducer";
import thunkMiddleware from "redux-thunk";

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore)

let store = createStoreWithMiddleware(combineReducers({snippet:snippetReducer}))

ReactDOM.render(<Provider store={store}>
					<Main />
				</Provider>
				, document.getElementById("app"));



//asdfdsf