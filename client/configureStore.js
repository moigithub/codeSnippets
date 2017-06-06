import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";


import { snippetReducer } from "./reducers/SnippetReducer";


const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore)


/*
let store = createStore(
  todos,
  [ 'Use Redux' ],
  applyMiddleware(logger)
)


let store = createStore(reducer, applyMiddleware(thunk))
*/
//var store = createStore(reducerFunction, initialState, storeEnhancers);
export default function configureStore(initialState){
	return createStoreWithMiddleware(
		combineReducers({snippets:snippetReducer}),
		initialState
		);	
} 