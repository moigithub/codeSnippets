import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { reducer as formReducer } from 'redux-form'


import { 
	snippetReducer, 
	currentSnippetReducer, 
	snippetTagFilterReducer,
	mySnippetsReducer,
	languageFilterReducer
} from "./reducers/SnippetReducer";


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
		combineReducers(
			{
				form              :formReducer,
				snippets          :snippetReducer, 
				currentSelected   :currentSnippetReducer,
				snippetTagFilter  :snippetTagFilterReducer,
				mySnippets        :mySnippetsReducer,
				languageFilter    :languageFilterReducer
			}
		),
		initialState
		);	
} 