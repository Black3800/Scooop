import React, {Component} from 'react';
import Login from './Login';
import Home from './Home';
import './App.css';
import {message} from 'antd';
import fakeDB from './fakeDB';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedin: false,
      currentUser: null
    };

    this.tryLogin = this.tryLogin.bind(this);
    this.setToken = this.setToken.bind(this);
    this.onLogout = this.onLogout.bind(this);

    // let a = new fakeDB();
    // console.log(a.login('anakin', '1234'));
  }

  tryLogin(usr, pwd) {
    let u = fakeDB.login(usr, pwd);
    this.setState({
      currentUser: u
    });
    // console.log(u);
    return u !== null;
  }

  setToken(usr, pwd, failCallback) {
    if(this.tryLogin(usr, pwd))
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
        <Home onLogout={this.onLogout} privilege={this.state.currentUser.privilege} />
      </div>
    );
  }
}

export default App;
