import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { loadAPI, signIn, signOut } from './gdocHelper';

class App extends Component {
  state = {
    authenticated: false,
  };

  onAuthChange = (isSignedIn) => {
    console.log(`changed state: ${isSignedIn}`);
    if (isSignedIn !== this.state.authenticated) {
      this.setState({
        authenticated: isSignedIn,
      });
    }
  };

  handleGoogleSignIn = (e) => {
    e.preventDefault();
    signIn();
  };

  handleGoogleSignOut = (e) => {
    e.preventDefault();
    signOut();
  }

  componentDidMount() {
    loadAPI(this.onAuthChange);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        { 
          !this.state.authenticated &&
          <button onClick={this.handleGoogleSignIn}>
            Connect with Google
          </button>
        }
        {
          this.state.authenticated &&
          <button onClick={this.handleGoogleSignOut}>
            Sign Out
          </button>
        }
      </div>
    );
  }
}

export default App;
