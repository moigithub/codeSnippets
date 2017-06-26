import React from 'react';
import Highlight from 'react-highlight';

const SnippetDetail = (props) => {
//	console.log("details",props);
	if (Object.keys(props).length<1){
		return <div className="col-xs-12 col-sm-8">Select a code snippet</div>
	}

	const links = props.links && props.links.length>0?props.links.map((l,i)=>{
		return (
				<li className="list-group-item" key={'link'+i}>
					<a href="#">{l}</a>
				</li>
			) 
	}): null;

	const tags = props.tags && props.tags.length>0?props.tags.map((tag,i)=>{
		return (
				<span className="label label-info" key={'tag'+i}>
					<span>{tag}</span>
				</span>
			) 
	}): [];
//console.log("SnippetDetail props: ",props);
	let author = props.author ? (props.author.name || props.author.email || "") : "";
	return (
		<div className="col-xs-12 col-sm-8">
			<h1>{props.title}</h1>
			<h3>{props.description}</h3>
			<div className="row">
				<div className="col-xs-6">
					<p>Language: <span>{props.language}</span></p>
				</div>
				<div className="col-xs-6">
					<p className=" pull-right">Posted By:<span>{author}</span></p>
				</div>
			</div>
			<div className="filterTags form-group">
				{tags}
			</div>
			<Highlight language={props.language}>
			  {props.code}
			</Highlight>
			
			<ul className="list-group">
				{links}
			</ul>
			{props.isOwner && <button className="btn btn-primary">Edit</button> }
			{props.isOwner && 
				<button className="btn btn-danger"
					onClick={()=>props.deleteSnippet(props._id)}
				>Delete</button> }
			<button className="btn btn-default">Copy</button>
		</div>
	);
}

export default SnippetDetail;


