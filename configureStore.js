import { createStore, applyMiddleware, combineReducers } from "redux";
import { reducer as reduxFormReducer } from 'redux-form';
import thunkMiddleware from "redux-thunk";


import { 
	snippetReducer, 
	snippetTagFilterReducer, 
	languageFilterReducer, 
	currentSnippetReducer } from "./reducers/SnippetReducer";


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
	console.log("initial state", initialState);;
	return createStoreWithMiddleware(
		combineReducers({
			form            : reduxFormReducer, // mounted under "form"
			snippets        : snippetReducer,
			filterTags      : snippetTagFilterReducer,
			language        : languageFilterReducer,
			currentSelected : currentSnippetReducer,
		}),
		initialState
		);	
} 

