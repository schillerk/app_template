import React, { Component } from 'react';

import { TextInput } from './TextInput';
import { Row } from './Row';
import { Margin } from './Spacing';

import { Post } from './Post';

import { INPUT_TYPES, FIELDS } from './consts.js';
import { fuzzyContains, fuzzyContainsArr } from './utils.js';

const SEARCHABLE_FIELDS = ['name', 'description', 'tags', 'authors'];

class Feed extends Component {
  constructor() {
    super();

    this.state = {
      search: '',
      searchPills: [],
      posts: [],
    };

    this.updateSearch = this.updateSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  componentDidMount() {
    fetch('/api/fetchAllPosts')
      .then(res => res.json())
      .then(out => {
			  const postsArr = Object.keys(out).map(key => out[key]);
      	this.setState({
					posts: postsArr
      	});
      });
  }

  clickTag(tag) {
  	if (this.state.searchPills.includes(tag)) {
	  	this.setState(({ searchPills }) => ({
	  		searchPills: searchPills.filter(x => x !== tag)
	  	}));
  	}
  	else {
	  	this.setState(({ searchPills }) => ({
	  		searchPills: [...searchPills, tag],
	  	}));
	  }
  }

  updateSearch(e) {
    this.setState({
      search: e.target.value,
    });
  }

  onSubmit(e) {
  	e.preventDefault();
  	this.setState(({ searchPills, search }) => ({
  		searchPills: [...searchPills, search],
  		search: '',
  	}));
  }

  handleDelete(post_id) {
  	fetch(`/api/delete/${post_id}`);

  	this.setState(({ posts }) => ({
  		posts: posts.filter(post => post.post_id !== post_id)
  	}));
  }

  handleEdit(post_id) {
  	fetch(`/api/delete/${post_id}`);

  	const postObj = this.state.posts.filter(post => post.post_id === post_id)[0];
  	const dataString = encodeURIComponent(JSON.stringify(postObj));

  	window.location.hash = `submit${dataString}`
  }

  handleViewPost(post_id) {
  	const postObj = {
  		post_id: post_id,
  	};

  	const dataString = encodeURIComponent(JSON.stringify(postObj));
  	window.location.hash = `post${dataString}`
  }

  deletePill(pill) {
  	this.setState(({ searchPills  }) => ({
  		searchPills: searchPills.filter(el => el !== pill)
  	}));
  }

  renderPills() {
  	return this.state.searchPills.map(pill => 
  		<div className="pill">
	  		<span className="pill__label">
	  			{pill}
				</span>
	  		<span
	  			className="pill__delete"
	  			onClick={this.deletePill.bind(this, pill)}
  			>
	  			X
				</span>
  		</div>
  	);
  }

  clearAll() {
  	this.setState({
  		search: '',
  		searchPills: [],
  	});
  }

  shouldRender(post) {
    const { search, searchPills } = this.state;
    const searches = [...searchPills, search].filter(x => !!x);

    if (searches.length < 1) {
    	return true;
    }

    return searches.some(el => 
    	SEARCHABLE_FIELDS.some(field => 
    		FIELDS[field].input_type === INPUT_TYPES.single
    			? fuzzyContains(post[field], el)
    			: fuzzyContainsArr(post[field], el)
    	)
    );
  }

  handleLike(post_id) {

	}

  renderCards() {
    const { posts } = this.state;

    const filteredPosts = posts.filter(post => this.shouldRender(post));

    return filteredPosts.map(post => 
    	<Post
    		key={post.post_id}
	      item={post}
	      handleDelete={this.handleDelete.bind(this, post.post_id)}
	      handleEdit={this.handleEdit.bind(this, post.post_id)}
	      handleLike={this.handleLike.bind(this, post.post_id)}
	      handleViewPost={this.handleViewPost.bind(this, post.post_id)}
	      clickTag={this.clickTag.bind(this)}
      />
    );
  }

  renderSearch() {
    const { search } = this.state;
  	return (
      <Margin all="16px" bottom="8px">
	  		<Row>
	  			<Margin right="16px">
		  			<span className="search">
				      <div className="h1">
				      	Search:
				      </div>
				      <div
					      className="tag"
					      onClick={this.clearAll}
				      >
				      	Clear All
				      </div>
			      </span>
		      </Margin>
		      <form
		      	onSubmit={this.onSubmit}
		      >
			  		<TextInput
			        value={search}
			        onChange={this.updateSearch}
			      />
		      </form>
		      {this.renderPills()}
	      </Row>
      </Margin>
    );
  }

  render() {
    return (
      <span>
	      {this.renderSearch()}
	      <Margin all="8px">
	        <Row>
	          {this.renderCards()}
	        </Row>
	      </Margin>
      </span>
    );
  }
}

export default Feed;
