import React from 'react';
import { BrowserRouter,Switch, Route, Link} from 'react-router-dom';

import Header from './Header';
import Main from './Main';

const App = () => (
  <div>
	<BrowserRouter>
	    <div>
	    	<Header/>

			<Switch>
				<Route exact path='/' component={Main} />
				<Route path='/MySnippets' render={()=>(<h1>my Snippets</h1>)} />
				<Route path='/new' render={(props)=>(<h1>new snippet</h1>)} />
			</Switch>
		</div>
	</BrowserRouter>    
  </div>
);


export default App;