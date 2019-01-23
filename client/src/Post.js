import React  from 'react';

import { Padding } from './Spacing';
import { Col } from './Col';
import { Card } from './Card';
import { Button } from './Button';
import { Label } from './Label';

export const Post = ({
	item,
	handleDelete = () => {},
	handleEdit = () => {},
	handleLike = () => {},
	handleViewPost = () => {},
	clickTag = () => {},
}) => {
	const renderArray = (arr) => {
		return arr.map((item, idx) => 
		  <span
		  	key={idx}
		  	className="tag"
		  	onClick={clickTag.bind(this, item)}
			>
		    {item}
		    {idx === arr.length - 1 ? '' : ','}
		  </span>
		);
	}

	return (
	  <Col size={12} sides="8px" ends="8px">
	    <Card>
	      <Padding all="16px">
	        <div className="h1">
	          {item.name}
	        </div>
	        <div>
	          <Label text="Authors:" />
	          {renderArray(item.authors)}
	        </div>
	        <div>
	          <Label text="Tags:" />
	          {renderArray(item.tags)}
	        </div>
	        <div>
	          <Label text="Description:" />
	          {item.description}
	        </div>
	        <div>
	          <Label text="Link:" />
	          {item.link}
	        </div>
	        <Padding top="16px">
	          <Button onClick={() => {}}>
			        <a href={item.link}>
		            Link
	            </a>
	          </Button>
	          <Button onClick={handleDelete.bind(this, item.post_id)}>
	            Delete
	          </Button>
	          <Button onClick={handleEdit.bind(this, item.post_id)}>
	            Edit
	          </Button>
	          <Button onClick={handleLike.bind(this, item.post_id)}>
	            Like
	          </Button>
	          <Button onClick={handleViewPost.bind(this, item.post_id)}>
	            Comments
	          </Button>
	        </Padding>
	      </Padding>
	    </Card>
  </Col>
  );
}