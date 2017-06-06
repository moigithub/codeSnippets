import React from 'react';
import ReactDOMServer from 'react-dom/server'
import { Provider } from "react-redux";
import { StaticRouter } from 'react-router';
import App from './client/components/App';

import configureStore from './client/configureStore';

import * as snippetsActions from './client/actions/snippetsActions';


let store = configureStore();



function htmlToString(){
	const context = {};

	return store.dispatch(snippetsActions.getSnippetsFromServer()).then( ()=>{
		return ReactDOMServer.renderToString(
			<Provider store={store}>
				<StaticRouter context={context}>
					<App />
				</StaticRouter>
			</Provider>
			)
	});
}

export default htmlToString;