import React from 'react';
import {renderRoutes} from 'react-router-config';

import Navigation from './Navigation';
import Main from './Main';
import routes from '../routes';


const AppLayout = (props) => {
	console.log("AppLayout",props.children);
	return (
  <div>
	<Navigation/>
	{props.children}
  </div>
)}



export default AppLayout;