import React, { Component } from 'react';
import './css/App.css';

import { Margin } from './Spacing';

class About extends Component {
	render() {
		return (
			<Margin all="16px">
        <div className="h1">
          <Margin bottom="8px">
            About
          </Margin>
        </div>
        <div>
          Michael Nielsen once wrote that a new kind of technology, "cognitive tools" had the potential to amplify our collective intelligence, and in doing so, transform the process of science itself.
        </div>
        <p></p>
        <div>
          Tools like Airbnb's Knowledge Repo and Karpathy's Arxiv Sanity have promised to do just that, but each fell short and now sit largely unmaintained.
        </div>
        <p></p>
        <div>
          I think this is a hard problem, but it's also tractable and too important to ignore.
        </div>
      </Margin>
		)
	}
}

export default About;
