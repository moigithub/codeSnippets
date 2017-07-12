'use strict';

import React from 'react';

const TagAndOrFilter=(props)=>{


	return (
		<div className="andorfilter">
			<div className="form-group">
				<div className="form-control">
					<label>
						<input type="radio" name="all" 
							checked={props.selectedOption === false} 
	                        onChange={()=>props.setTag(false)}
						/> Any
					</label>
				    {" "}
	  				<label>
	  					<input type="radio" name="all" 
							checked={props.selectedOption === true} 
	                        onChange={()=>props.setTag(true)}
	  					/> Only with
	  				</label>
  				</div>
				</div>
		</div>
		);
}

export default TagAndOrFilter;