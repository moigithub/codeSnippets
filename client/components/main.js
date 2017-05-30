import React from 'react';
import ReactDOM from 'react-dom';

export default class Main extends React.Component {
	render(){
		return (
			<div>
				main component here
			</div>
		);
	}
}
ReactDOM.render(<Main />, document.getElementById("app"));