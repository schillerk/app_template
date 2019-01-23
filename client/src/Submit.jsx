import React, { Component } from 'react';
import './css/App.css';

import { TextInput } from './TextInput';
import { Col } from './Col';
import { Row } from './Row';
import { Card } from './Card';
import { Padding, Margin } from './Spacing';
import { Label } from './Label';
import { Button } from './Button';

import { INPUT_TYPES, FIELDS } from './consts.js';
import { fuzzyContains } from './utils.js';

const DEFAULT_FOCUSED = {
  fieldKey: '',
  index: -1,
  optionIndex: 0,
}

const DEFAULT_STATE =  {
  name: '',
  authors: [''],
  tags: [''],
  description: '',
  link: '',
  editing: false,
  autoOptions: [],
  focused: DEFAULT_FOCUSED,
};

const ARROW_KEY_CODES = {
  38: -1,
  40: 1,
}

class Submit extends Component {
  constructor() {
    super();

    const hash = window.location.hash;
    const dataIndex = hash.indexOf('%');

    if (dataIndex < 0) {
      this.state = DEFAULT_STATE;
    } else {
      const data = JSON.parse(decodeURIComponent(hash.slice(dataIndex)))
      this.state = {
        name: data.name,
        authors: [...data.authors, ''],
        tags: [...data.tags, ''],
        description: data.description,
        link: data.link,
        editing: true,
        autoOptions: [],
        focused: DEFAULT_FOCUSED,
      };
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.allTags = [];
    this.allAuthors = [];
  }

  componentDidMount() {
    fetch('/api/fetchAllTags')
      .then(res => res.json())
      .then(out => {
        this.allTags = out;
      });

    fetch('/api/fetchAllAuthors')
      .then(res => res.json())
      .then(out => {
        this.allAuthors = out;
      });

    window.addEventListener('keydown', this.logKey.bind(this));
  }

  logKey(e) {
    const { keyCode } = e;
    if (Object.keys(ARROW_KEY_CODES).includes(String(keyCode))) {
      const { focused } = this.state;
      focused.optionIndex += ARROW_KEY_CODES[keyCode];
      this.setState({
        focused: focused,
      });
    }
  }

  updateField(fieldKey, e) {
    this.setState({
      [fieldKey]: e.target.value,
    });
  }

  updateMultiField(fieldKey, index, e) {
  	const val = e.target.value;
  	const updateArr = this.state[fieldKey];
  	updateArr[index] = val;

	  // If we're updating the last field, create a new empty field  	
  	if (index === updateArr.length - 1) {
  		updateArr.push('');
  	}

    const autoOptions = this.getAutoOptions(fieldKey, val);

  	this.setState({
  		[fieldKey]: updateArr,
      autoOptions: autoOptions,
  	});
  }

  handleSubmit() {
  	const { name, authors, tags, description, link } = this.state;
  	const newItem = {
  		name: name,
  		description: description,
  		link: link,
  		authors: authors.slice(0, -1),
  		tags: tags.slice(0, -1),
  	};

  	fetch('/api/post', {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(newItem),
	  });

    if (this.state.editing) {
      window.location.hash = 'feed';
    } else {
      this.clearAll();
    }
  }

  renderSingleField(fieldKey) {
		return (
			<Col key={fieldKey} size={10} sides="8px" ends="8px">
	      <TextInput
	        value={this.state[fieldKey]}
	        onChange={this.updateField.bind(this, fieldKey)}
	      />
	    </Col>
    );
  }

  maybeRenderAutoOptions(fieldKey, index) {
    const { focused } = this.state;
    const { optionIndex } = focused;
    if (focused.index === index && focused.fieldKey === fieldKey) {
      return this.state.autoOptions.map((option, optionIdx) => {
        const focusedClass = optionIndex === optionIdx ? 'auto-options__item--focused' : '';
        return (
          <div className={`auto-options__item ${focusedClass}`}>
            {option}
          </div>
        );
      });
    }
    return null;
  }

  getAutoOptions(fieldKey, val) {
    if (fieldKey === 'authors') {
      return this.allAuthors.filter(tag => fuzzyContains(tag, val));
    }
    return this.allTags.filter(tag => fuzzyContains(tag, val));
  }

  setFocus(fieldKey, index) {
    const val = this.state[fieldKey][index] 
    const autoOptions = this.getAutoOptions(fieldKey, val);

    this.setState({
      focused: {
        fieldKey: fieldKey,
        index: index,
        optionIndex: this.state.focused.optionIndex,
      },
      autoOptions: autoOptions,
    });
  }

  selectAutoOption(fieldKey, index) {
    const { focused } = this.state;
    const { optionIndex } = focused;

    const updateArr = this.state[fieldKey];
    updateArr[index] = this.getAutoOptions(fieldKey, updateArr[index])[optionIndex];

    // If we're updating the last field, create a new empty field   
    if (index === updateArr.length - 1) {
      updateArr.push('');
    }

    this.setState({
      [fieldKey]: updateArr,
      focused: DEFAULT_FOCUSED, 
    });
  }

  setBlur() {
    this.setState({
      focused: DEFAULT_FOCUSED
    });
  }

  renderMultiField(fieldKey) {
  	const inputs = this.state[fieldKey].map((input, index) => 
      <form
        key={index}
        onSubmit={this.selectAutoOption.bind(this, fieldKey, index)}
      >
        <TextInput
          value={this.state[fieldKey][index]}
          onChange={this.updateMultiField.bind(this, fieldKey, index)}
          onFocus={this.setFocus.bind(this, fieldKey, index)}
          onBlur={this.setBlur.bind(this)}
          spellCheck="false"
        />
        <div className="auto-options">
          {this.maybeRenderAutoOptions(fieldKey, index)}
        </div>
      </form>
  	)

		return (
			<Col key={fieldKey} size={10} sides="8px" ends="8px">
				{inputs}
	    </Col>
    );
  }

  renderFields() {
  	return Object.keys(FIELDS).map(key => 
  		<div key={key}>
  		 	<Row>
	        <Col size={2} sides="8px" ends="8px">
		        <Label text={`${FIELDS[key].label}:`} />
	        </Col>
	        {FIELDS[key].input_type === INPUT_TYPES.single
	        	? this.renderSingleField(key)
	        	: this.renderMultiField(key)
	        }
        </Row>
      </div>
    );
  }

  clearAll() {
    this.setState({
      name: '',
      authors: [''],
      tags: [''],
      description: '',
      link: '',
      editing: false,
      autoOptions: [],
      focused: DEFAULT_FOCUSED,
    });
  }

	render() {
		return (
      <Col sides="8px">
        <Margin all="8px">
          <span className="search">
            <div className="h1">
              Search:
            </div>
            <div
              className="tag"
              onClick={this.clearAll.bind(this)}
            >
              Clear All
            </div>
          </span>
        </Margin>
        <Card>
          <Padding all="16px">
	          {this.renderFields()}
            <Button onClick={this.handleSubmit}>
	          	Submit
	          </Button>
          </Padding>
        </Card>
      </Col>
		)
	}
}

export default Submit;
