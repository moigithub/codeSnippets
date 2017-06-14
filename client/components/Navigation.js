import React from 'react';
import { BrowserRouter,Switch, Route, Link } from 'react-router-dom'

const Header = () => (
  <header>
	<nav className="navbar navbar-default">
	  <div className="container-fluid">
	    {/*<!-- Brand and toggle get grouped for better mobile display -->*/}
	    <div className="navbar-header">
	      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
	        <span className="sr-only">Toggle navigation</span>
	        <span className="icon-bar"></span>
	        <span className="icon-bar"></span>
	        <span className="icon-bar"></span>
	      </button>
	      
	      <Link className="navbar-brand" to='/snippets'>CodeSnippets</Link>
	    </div>

	    {/*<!-- Collect the nav links, forms, and other content for toggling -->*/}
	    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
	        <ul className="nav navbar-nav">
		        <li><Link to='/MySnippets'>My Snippets</Link></li>
		        <li><Link to='/new'>Create Snippet</Link></li>
            </ul>
	    </div>
	  </div>
	</nav>

  </header>
);


export default Header;