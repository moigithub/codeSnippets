import React from 'react';
import {  Link} from 'react-router-dom';

const SnippetList = (props) => {
	//console.log("snipets list ",props);
	const snippets = props.snippetsList.map(snippet => {
		return (
		    <Link to={`/${snippet._id}`}  
		    	className="list-group-item" 
		    	key={snippet._id} 
		    	>
			    	<span className="badge">{snippet.language}</span>
			     	{snippet.title}
		     </Link>
		 );
	});

	return (
		<div className="list-group">
			{snippets}
		</div>
	);
}

// snippetsList : [{language: 'js', title: 'some title'}]

export default SnippetList;