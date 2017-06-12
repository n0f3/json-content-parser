import React, { Component } from 'react';
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
      jsonObj: null,
      errorMessage: null,
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

  handleJsonFileUploadClick = (e) => {
    if (this.jsonInput) {
      this.jsonInput.click();
    }
    e.preventDefault();
  };

  handleJsonUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const fileUploaded = files[0];
      console.log(`received file ${fileUploaded.name} of type ${fileUploaded.type}`);
      if (fileUploaded) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          const jsonData = event.target.result;
          try {
            const jsonObj = JSON.parse(jsonData);
            this.setState({
              ...this.state,
              jsonObj,
              errorMessage: null,
            });
          } catch (error) {
            this.setState({
              ...this.state,
              jsonObj: null,
              errorMessage: `${error.name}: ${error.message}`,
            });
          }
        };
        fileReader.readAsText(fileUploaded);
      }
    }
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
          <input 
            type='file'
            style={{display: 'none'}}
            ref={(e) => {
              this.jsonInput = e;
            }}
            onChange={this.handleJsonUpload}
            accept='.json'/>
          <button onClick={this.handleJsonFileUploadClick}>
            Upload Json File
          </button>
        </div>
        <div align='center'>
        {
          this.state.jsonObj &&
          <div style={{'text-align': 'left', display: 'inline-block'}}>
            <h3>Json File Uploaded</h3>
            <pre>
              { JSON.stringify(this.state.jsonObj, null, 2) }
            </pre>
          </div>
        }
        {
          this.state.spreadsheet.id &&
          this.state.isSignedIn &&
          <div style={{display: 'inline-block'}}>
            <iframe 
              src={this.state.spreadsheet.spreadsheetUrl} frameBorder="1" 
              headers={false} 
              title='gdoc' 
              width='800' 
              height='500'>
            </iframe>
          </div>
        }
        </div>
      </div>
    );
  }
}

export default App;
