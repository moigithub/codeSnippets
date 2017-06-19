import React from 'react';
import {renderRoutes} from 'react-router-config';

import Navigation from './Navigation';
import Main from './Main';
import routes from '../routes';


const AppLayout = (props) => {
//	console.log("AppLayout",props.children);


//TODO *********
// class component.. 
// on didmount u otro life cycle event.. hacer request al server del user

///console.log("applayout props ",props);
	return (
  <div>
	<Navigation user={props.user}/>
	{props.children}
  </div>
)}

AppLayout.defaultProps = {
	user: null
};

export default AppLayout;