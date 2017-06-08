import React from 'react';
import { BrowserRouter,Switch, Route, Link} from 'react-router-dom';

import Navigation from './Navigation';
import Main from './Main';

const App = (props) => {
	console.log("app",props.children);
	return (
  <div>
	<Navigation/>
	{props.children}
	<Switch>
		<Route exact path='/' component={Main} />
		<Route path='/MySnippets' render={()=>(<h1>my Snippets</h1>)} />
		<Route path='/new' render={(props)=>(<h1>new snippet</h1>)} />
	</Switch>
  </div>
)}



export default App;