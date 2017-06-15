import React from 'react';
//import { BrowserRouter,Switch, Route, Link} from 'react-router-dom';


import Main from './components/Main';

/*
const routes = (
	<Switch>
		<Route exact path='/' render={()=>(<h1>Home</h1>)}/>
		<Route path='/MySnippets' render={()=>(<h1>my Snippets</h1>)} />
		<Route path='/new' render={(props)=>(<h1>new snippet</h1>)} />
	</Switch>
);
*/

const routes = [{
  component: Main,
  path: '/snippets/:snippetId?',
  exact: true
}

]


export default routes;

/*
, 
{
  component: ()=>(<h1>my Snippets</h1>),
  path: '/MySnippets'
}, 
{
  component: ()=>(<h1>NEW Snippets</h1>),
  path: '/new'
}
*/