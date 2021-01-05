import logo from './logo.svg';
import React, {Component} from 'react'
import './App.css';
import Chat from "./Chat";

class App extends Component {
  constructor()
  {
    super();
    this.unLogin = this.unLogin.bind(this)
    this.state={
      email: null,
      password: null,
      isLoggedin: false,
      store: null
    }
  }

  unLogin() {
    this.validateToken()
  }

  componentDidMount() {
    this.storeCollector()
  }

  storeCollector()
  {
      let store = JSON.parse(localStorage.getItem('Login'));
      if (store && store.isLoggedin)
      {
        this.setState({isLoggedin: true, store: store})
      }
  }

  login()
  {
    fetch('http://localhost:5000/token', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password
      })
    }).then((response)=>{
      if (response.ok) {
        response.json().then((result) => {
          localStorage.setItem('Login', JSON.stringify({
            isLoggedin: true,
            token: result.access_token,
            username: result.username
          }))
          this.storeCollector()
        })
      }
    })
  }

  validateToken()
  {
    let store = JSON.parse(localStorage.getItem('Login'))

    if(store) {
      var requestOptions = {
        method: 'GET'
      };

      fetch(`http://localhost:5000/token?token=${store.token}`, requestOptions)
          .then(response => {
            if (response.status === 401) {
              localStorage.clear()
              this.setState({isLoggedin: false})
            }
          })
    } else {
      localStorage.clear()
      this.setState({isLoggedin: false})
    }
  }

  render() {
    return (
        <div className="App">
            {
              this.state.isLoggedin
                  ?
                    <div>
                      <h1>SMS</h1>
                      <Chat setUnLogin={this.unLogin}/>
                    </div>
                  :
                    <div>
                      <h1>Login</h1>
                      <input type="text" onChange={(event)=>{this.setState({email:event.target.value})}}/> <br/><br/>
                      <input type="password" onChange={(event)=>{this.setState({password:event.target.value})}}/> <br/><br/>
                      <button onClick={()=>{this.login()}}>Login</button>
                    </div>
            }
        </div>
    );
  }
}

export default App;
