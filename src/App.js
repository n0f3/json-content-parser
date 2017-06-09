import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { loadAPI, signIn, signOut, createSpreadSheet, getSpreadhSheet, updateSpreadsheetGrid } from './gdocHelper';
import sampleData from './sampleJson';
import parseJson from './jsonParseHelper';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      spreadsheet: {
        id: null,
        sheetId: 0,
        sheetTitle: '',
        name: '',
      },
      sheetData: {
        data: [],
      },
    };
  }

  onAuthChange = (isSignedIn) => {
    console.log(`changed state: ${isSignedIn}`);
    console.log(`spreadsheetId: ${this.state.spreadsheet.id}`);
    if (isSignedIn) {
        console.log('creating spreadsheet');
        const rowData = this.state.sheetData.data.map((val) => {
          const values = val.map((rowVal) => {
            const rowValType = typeof(rowVal);
            let extendedValue = '';
            if (rowValType === 'string') {
              extendedValue = 'stringValue';
            } else if (rowValType === 'number') {
              extendedValue = 'numberValue';
            }
            return {
              userEnteredValue: {
                [extendedValue]: rowVal,
              },
            }
          });
          return {
            values,
          }
        });
        createSpreadSheet({
          properties: {
            title: 'Data',
            
          },
          data: [{
            startRow: 0,
            startColumn: 0,
            rowData,
          }],
        }).then((spreadsheet) => {
          const spreadsheetId = spreadsheet.spreadsheetId;
          localStorage.setItem('spreadsheetId', spreadsheetId);
          this.setState(Object.assign({}, this.state, {
            isSignedIn,
            spreadsheet: {
              id: spreadsheetId,
              sheetId: spreadsheet.sheets[0].properties.sheetId,
              sheetTitle: spreadsheet.sheets[0].properties.title,
              name: spreadsheet.properties.title,
              spreadsheetUrl: spreadsheet.spreadsheetUrl
            },
          }));
        });
        // getSpreadhSheet(this.state.spreadsheet.id).then((spreadsheet) => {
        //   console.log(spreadsheet);
        //   const { spreadsheetId, properties, spreadsheetUrl } = spreadsheet;
        //   const { sheetId, title } = spreadsheet.sheets[0].properties;
        //   updateSpreadsheetGrid(spreadsheetId,
        //     sheetId,
        //     title,
        //     this.state.sheetData.rows.length, this.state.sheetData.columns.size).then((newSpreadsheet) => {
        //       console.log(`new spreadsheet: ${JSON.stringify(newSpreadsheet)}`);
        //   });
        //   this.setState(Object.assign({}, this.state, {
        //     spreadsheet: {
        //       id: spreadsheetId,
        //       sheetId: spreadsheet.sheets[0].properties.sheetId,
        //       name: properties.title,
        //       spreadsheetUrl
        //     },
        //     isSignedIn,
        //   }));
        // });
    } else {
      this.setState(Object.assign({}, this.state, {
        isSignedIn,
        spreadsheet: {
          id: null,
        },
      }));
    }
  };

  handleGoogleSignIn = (e) => {
    e.preventDefault();
    signIn();
  };

  handleGoogleSignOut = (e) => {
    e.preventDefault();
    signOut();
  };

  componentDidMount() {
    if (localStorage.getItem('spreadsheetId')) {
      const spreadsheetId = localStorage.getItem('spreadsheetId');
      console.log(`found spreadsheet with id: ${spreadsheetId}`);
      this.setState(Object.assign({}, this.state, {
        spreadsheet: {
          id: spreadsheetId,
        },
      }));
    }
    this.setState({
      sheetData: {
        data: parseJson(sampleData),
      },
    });
    loadAPI(this.onAuthChange);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div>
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
        </div>
        <div>
        {
          this.state.spreadsheet.id &&
          this.state.isSignedIn &&
          <iframe src={this.state.spreadsheet.spreadsheetUrl} frameBorder="1" headers={false} title='gdoc' width='1000' height='500'>
          </iframe>
        }
        </div>
      </div>
    );
  }
}

export default App;
