'use strict';

import React from 'react';
import Highlight from 'react-highlight';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom'

const SnippetDetail=({ links=[], 
			tags=[], 
			author="", title="", 
			description="", 
			language="", code="", 
			isOwner=false, _id="", 
			deleteSnippet=()=>{},
			editSnippet=()=>{}
		})=>{
	//	console.log("details",props);
		
	const allLinks = links && links.length>0?links.map((l,i)=>{
		let link = /:\/\//.test(l) ? l : "http://"+l;
		return (
				<li className="list-group-item" key={'link'+i}>
					<a href={link} target="_blank">{l}</a>
				</li>
			) 
	}): null;

	const allTags = tags && tags.length>0?tags.map((tag,i)=>{
		return (
				<span className="label label-info" key={'tag'+i}>
					<span>{tag}</span>
				</span>
			) 
	}): [];
//console.log("SnippetDetail props: ",props);
	let authorData = author ? (author.name || author.email || "") : "";
	return (
		<div className="col-xs-12 col-sm-8">
			<h1>{title}</h1>
			<h3>{description}</h3>
			<div className="row">
				<div className="col-xs-6">
					<p>Language: <span>{language}</span></p>
				</div>
				<div className="col-xs-6">
					<p className=" pull-right">Posted By:<span>{authorData}</span></p>
				</div>
			</div>
			<div className="filterTags form-group">
				{allTags}
			</div>
			<Highlight language={language}>
			  {code}
			</Highlight>
			
			<ul className="list-group">
				{allLinks}
			</ul>
			{isOwner && 
				<Link
					className="btn btn-primary"
					to={`/edit/${_id}`}
				>Edit</Link> }
			{isOwner && 
				<button className="btn btn-danger"
					onClick={()=>deleteSnippet(_id)}
				>Delete</button> }

			<CopyToClipboard text={code}
				className="btn btn-default"
		           	onCopy={() => alert('Copied')}>
	          		<button>Copy to clipboard</button>
	        </CopyToClipboard>	
		</div>
	);
	
}

export default SnippetDetail;


