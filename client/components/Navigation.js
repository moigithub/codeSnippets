import React from 'react';
import { BrowserRouter,Switch, Route, Link } from 'react-router-dom'
import axios from 'axios';

class Header extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			user: this.props.user
		}
	}

	componentDidMount(){
		console.log("navigation: getting user data");
		axios.get('/user').then(data=>{
			console.log("navigation user",data.data);
			this.setState({user:data.data});
		});
	}

	render(){
		console.log(this.state);

		return (
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

			    {this.state.user &&
			    	<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					      <ul className="nav navbar-nav">
					        <li><Link to='/MySnippets'>My Snippets</Link></li>
					        <li><Link to='/new'>Create Snippet</Link></li>
					      </ul>
					      <ul className="nav navbar-nav navbar-right">
					        <li><p className="navbar-text" href="#">Welcome <strong><span>{this.state.user.local.email}</span></strong></p></li>
					        <li><a href="/logout">Logout</a></li>
					      </ul>
				    </div>
				}
				{!this.state.user &&
			 		<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					
					      <ul className="nav navbar-nav navbar-left">
					        <li><a href="/login">Login</a></li>
					        <li><a href="/signup">SignUp</a></li>
					      </ul>
						
				    </div>
				}

			  </div>
			</nav>

		  </header>
		);
	}


}

Header.defaultProps = {
  user: null
};

export default Header;