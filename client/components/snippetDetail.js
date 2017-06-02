import React from 'react';

const SnippetDetail = (props) => {
	//console.log("details",props);
	if (Object.keys(props).length<1){
		return <div className="col-xs-12 col-sm-8">Select a code snippet</div>
	}

	const links = props.links.length>0?props.links.map((l,i)=>{
		return (
				<li className="list-group-item" key={'link'+i}>
					<a href="#">{l}</a>
				</li>
			) 
	}): null;

	let author = props.author.displayName || props.author.email || "";
	return (
		<div className="col-xs-12 col-sm-8">
			<h1>{props.title}</h1>
			<h3>{props.description}</h3>
			<p>Language: <span>{props.language}</span></p>
			<p>Posted By:<span>{author}</span></p>
			<textarea 
				name="" 
				id="" 
				rows="10"  
				className="form-control"
				value={props.code}>
			</textarea>
			<ul className="list-group">
				{links}
			</ul>
			<button className="btn btn-primary">Edit</button>
			<button className="btn btn-danger">Delete</button>
			<button className="btn btn-default">Copy</button>
		</div>
	);
}

export default SnippetDetail;


