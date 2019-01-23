import React, { Component } from 'react';

import { Post } from './Post';

class SinglePost extends Component {
	constructor() {
		super();

		this.state = {
			data: {},
		};
	}

	componentDidMount() {
    const hash = window.location.hash;
    const dataIndex = hash.indexOf('%');
    const data = JSON.parse(decodeURIComponent(hash.slice(dataIndex)))
    const { post_id } = data;
		fetch(`/api/fetchPost/${post_id}`)
		 	.then(res => res.json())
      .then(out => {
      	this.setState({
      		data: out[post_id]
      	});
      });
	}

	maybeRenderPost() {
		return this.state.data.post_id &&
			<Post
				item={this.state.data} 
			/>
	}

	render() {
		console.log(this.state.data);
		return (
			<div>
				{this.maybeRenderPost()}
			</div>
		);
	}
}

export default SinglePost;
