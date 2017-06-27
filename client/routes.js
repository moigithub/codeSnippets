import React from 'react';
//import { BrowserRouter,Switch, Route, Link} from 'react-router-dom';


import Main from './components/Main';
import CreateSnippetForm from './components/createForm';
import EditSnippetForm from './components/editForm'

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
}, 
{
  component: CreateSnippetForm,
  path: '/new'
}, 
{
  component: EditSnippetForm,
  path: '/edit/:snippetId'
}

]


export default routes;

/*

*/