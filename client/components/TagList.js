import React from 'react';

const TagList = (props)=>{
	const tags = props.tags.map((t,i)=>{
		return (
			<span className="tag label label-info" key={'tag'+i}>
				<span>{t.title}</span>
				<a><i className="remove glyphicon glyphicon-remove-sign glyphicon-white"></i></a> 
			</span>
		);
	});
	return (
		<div className="filterTags form-group">
			{tags}
		</div>
	);
}

export default TagList;