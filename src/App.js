import React, {Component} from 'react';
import Login from './Login';
import Home from './Home';
import './App.css';
import {message} from 'antd';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedin: false
    };

    this.setToken = this.setToken.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  setToken(usr, pwd, failCallback) {
    if(usr === 'anakin' && pwd === 'amaterasu')
    {
      this.setState({
        isLoggedin: true
      });
      sessionStorage.setItem('usr', usr);
      message.success('Welcome, ' + usr + '!');
    }
    else
    {
      message.error('Wrong username or password, please try again.');
      failCallback();
    }
  }

  onLogout() {
    console.info('ack logout');
    this.setState({
      isLoggedin: false
    });
    sessionStorage.removeItem('usr');
    message.info('You are logged out.')
  }

  render() {
    if(!this.state.isLoggedin)
    {
      return <Login setToken={this.setToken} />;
    }

    return(
      <div className='App'>
        <Home onLogout={this.onLogout} />
      </div>
    );
  }
}

export default App;
