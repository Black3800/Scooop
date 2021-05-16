import React, {Component} from 'react'
import Login from './Login'
import Home from './Home'
import './App.css'
import {message} from 'antd'

const BASE_URL = 'http://localhost:8080/ScooopServerUltimatum_war_exploded/'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoggedin: false,
      currentUser: null
    }

    this.tryLogin = this.tryLogin.bind(this)
    this.setToken = this.setToken.bind(this)
    this.onLogout = this.onLogout.bind(this)

    // let a = new fakeDB()
    // console.log(a.login('anakin', '1234'))
  }

  async tryLogin(usr, pwd) {
    let response = await fetch(BASE_URL + 'api/auth/login', {
      method: 'post',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      credentials: 'include',
      body: `username=${usr}&password=${pwd}`,
    })
    if (response.status !== 200)
    {
      return false
    }
    let json = await response.json()
    if (json.uid != -1)
    {
      this.setState({currentUser: json})
      return true
    }
    return false
  }

  async setToken(usr, pwd, failCallback) {
    let authenticated = await this.tryLogin(usr, pwd)
    if(authenticated)
    {
      this.setState({
        isLoggedin: true
      })
      sessionStorage.setItem('usr', usr)
      message.success('Welcome, ' + usr + '!')
    }
    else
    {
      message.error('Wrong username or password, please try again.')
      failCallback()
    }
  }
  
  onLogout() {
    sessionStorage.removeItem('usr')
    fetch(BASE_URL + 'api/auth/logout', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      credentials: 'include',
      body: 'logout=true'
    }).then(
      (response) => {
        if (response.status === 200) {
          this.setState({
            isLoggedin: false,
            currentUser: null
          })
          sessionStorage.removeItem('usr')
          message.info('You are logged out.')
        }
        else {
          message.error('Logout failed')
        }
      }
    )
  }

  async componentDidMount() {
    let response = await fetch(BASE_URL + 'api/auth/whoami', {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      credentials: 'include'
    })
    let json = await response.json()
    console.log(json)
    if (json.uid !== -1)
    {
      this.setState({
        isLoggedin: true,
        currentUser: json
      })
      console.log(this.state)
    }
  }

  render() {
    if(!this.state.isLoggedin)
    {
      return <Login setToken={this.setToken} />
    }

    return (
      <div className='App'>
        <Home onLogout={this.onLogout} privilege={this.state.currentUser.privilege} />
      </div>
    )
  }
}

export default App
