import React from 'react';

const SnippetList = (props) => {
	//console.log("snipets list ",props);
	const snippets = props.snippetsList.map(snippet => {
		return (
		    <a href="#"  className="list-group-item" key={snippet._id} onClick={()=>props.setSnippetSelected(snippet)}>
		    	<span className="badge">{snippet.language}</span>
		     	{snippet.title}
		     </a>
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