import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { loadAPI, signIn, signOut, createSpreadSheet, getSpreadhSheet } from './gdocHelper';

class App extends Component {
  state = {
    isSignedIn: false,
    spreadSheetId: null,
    spreadSheet: null,
  };

  onAuthChange = (isSignedIn) => {
    console.log(`changed state: ${isSignedIn}`);
    console.log(`spreadSheetId: ${this.state.spreadSheetId}`);
    if (isSignedIn) {
      if (!this.state.spreadSheetId) {
        createSpreadSheet().then((spreadSheet) => {
          const spreadSheetId = spreadSheet.spreadsheetId;
          localStorage.setItem('spreadSheetId', spreadSheetId);
          this.setState(Object.assign({}, this.state, {
            spreadSheetId,
            isSignedIn,
          }));
        });
      } else {
        getSpreadhSheet(this.state.spreadSheetId).then((spreadSheet) => {
          console.log(spreadSheet);
          this.setState(Object.assign({}, this.state, {
            spreadSheet,
            isSignedIn,
          }));
        });
      }
    } else {
      this.setState({
        isSignedIn,
        spreadSheet: null,
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
    if (localStorage.getItem('spreadSheetId')) {
      const spreadSheetId = localStorage.getItem('spreadSheetId');
      console.log(`found spreadsheet with id: ${spreadSheetId}`);
      this.setState({
        spreadSheetId,
      });
    }
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
          !this.state.isSignedIn &&
          <button onClick={this.handleGoogleSignIn}>
            Connect with Google
          </button>
        }
        {
          this.state.isSignedIn &&
          <button onClick={this.handleGoogleSignOut}>
            Sign Out
          </button>
        }
        {
          this.state.spreadSheetId &&
          this.state.isSignedIn &&
          <iframe src={this.state.spreadSheet.spreadsheetUrl} frameBorder="1" headers={false} title='gdoc' width='800' height='400'>
          </iframe>
        }
      </div>
    );
  }
}

export default App;
