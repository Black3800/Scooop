import React, {Component} from 'react';
import Login from './Login';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedin: false
    };

    this.setToken = this.setToken.bind(this);
  }

  setToken(usr, pwd) {
    if(usr === 'anakin' && pwd === '1234')
    {
      this.setState({
        isLoggedin: true
      });
      sessionStorage.setItem('usr', usr);
    }
    else
    {
      alert('wrong username/password');
    }
  }

  render() {
    if(!this.state.isLoggedin)
    {
      return <Login setToken={this.setToken} />;
    }

    return(
      <div className='App'>
        You're logged in
      </div>
    )
  }
}

export default App;
