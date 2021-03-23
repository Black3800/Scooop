import React, {Component} from 'react';

class Login extends Component {
    render() {
        return(
            <div className='Login'>
                <form onSubmit={(e) => { 
                    this.props.setToken(
                        document.getElementById('usr').value,
                        document.getElementById('pwd').value
                    );
                    e.preventDefault();
                }}>
                    <h1>Login</h1>
                    <label for='usr'>
                        Username
                        <input type='text' name='usr' id='usr' />
                    </label>
                    <br/>
                    <label for='pwd'>
                        Password
                        <input type='password' name='pwd' id='pwd' />
                    </label>
                    <br/>
                    <button>Login</button>
                </form>
            </div>
        );
    }
}

export default Login;