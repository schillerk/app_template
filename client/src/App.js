import React, { Component } from 'react';
import './css/App.css';

import { Margin } from './Spacing';

import Submit from './Submit';
import Feed from './Feed';
import About from './About';
import SinglePost from './SinglePost';

import { GoogleLogin, GoogleLogout } from 'react-google-login';

// https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

const hashToComponent = {
  'submit': <Submit />,
  'feed': <Feed />,
  'about': <About />,
  'post': <SinglePost />,
};

function getPage() {
  const hash = window.location.hash;
  const dataIndex = hash.indexOf('%')
  return dataIndex > -1
    ? hash.slice(1, dataIndex)
    : hash.slice(1);
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: getPage(),
      username: getCookie('name'),
    };

    this.handleHashChange = this.handleHashChange.bind(this);
  }

  handleHashChange() {
    this.setState({
      currentPage: getPage()
    });
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.handleHashChange, false);
  }

  renderCurrentPage() {
    const currentPage = hashToComponent[this.state.currentPage];
    return currentPage ? currentPage : <Feed />
  }

  responseGoogle(response) {
    const userId = response.googleId;
    const email = response.profileObj.email;
    const name = response.profileObj.name;
    const userObj = {
      id: userId,
      email: email,
      name: name,
    };

    document.cookie = `user_id=${userId}`;
    fetch(`api/getUser/${userId}`)
      .then(res => res.json())
      .then(out => {
        if (out.length < 1) {
          fetch('/api/createUser', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userObj),
          })
            .then(res => {
              document.cookie = `user_id = ${userId}`;
              document.cookie = `email = ${email}`;
              document.cookie = `name = ${name}`;
              this.setState({
                username: name,
              });
            });
        } else {
          document.cookie = `user_id = ${out.id}`;
          document.cookie = `email = ${out.email}`;
          document.cookie = `name = ${out.name}`;
          this.setState({
            username: out.name
          });
        }
      });
  }

  handleLogout() {
    document.cookie = `user_id=`;
    document.cookie = `email=`;
    document.cookie = `name=`;

    this.setState({
      username: '',
    });
  }

  renderUserOrLogin() {
    const { username } = this.state;
    if (username) {
      return (
        <span>
          {username}
           <GoogleLogin
            clientId="167790313353-uapi0ksh5q79e9rsfqcu8as0n5d09t43.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle.bind(this)}
            onFailure={this.responseGoogle.bind(this)}
          />
          <GoogleLogout
            buttonText="Logout"
            onLogoutSuccess={this.handleLogout.bind(this)}
          >
          </GoogleLogout>
        </span>
      )
    }

    return (
      <GoogleLogin
        clientId="167790313353-uapi0ksh5q79e9rsfqcu8as0n5d09t43.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={this.responseGoogle.bind(this)}
        onFailure={this.responseGoogle.bind(this)}
      />
    );
  }



  renderHeader() {
    return (
      <Margin all="16px">
        <span
          className="header__item"
          onClick={() => window.location.hash='about'}
        >
          About
        </span>
        <span
          className="header__item"
          onClick={() => window.location.hash='feed'}
        >
          Feed
        </span>
        <span
          className="header__item"
          onClick={() => window.location.hash='submit'}
        >
          Submit
        </span>
        <span>
          {this.renderUserOrLogin()}
        </span>
      </Margin>
    )
  }

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderCurrentPage()}
      </div>
    )
  }
}

export default App;
