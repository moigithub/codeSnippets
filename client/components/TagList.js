'use strict';

import React from 'react';

const TagList = ({tagList, removeTag})=>{
	const tags = tagList.map((tag,i)=>{
		return (
			<span className="tag label label-info" key={'tag'+i}>
				<span>{tag}</span>
				<a onClick={()=>removeTag(tag)}>
					<i className="remove glyphicon glyphicon-remove-sign glyphicon-white"></i>
				</a> 
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