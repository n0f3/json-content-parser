import React, { Component } from 'react';
import { Jumbotron} from 'react-bootstrap';
import { loadAPI, signIn, signOut, createSpreadSheet, getSpreadhSheet, updateCells, deleteRange, batchUpdate } from './gdocHelper';
import sampleData from './sampleJson';
import parseJson from './jsonParseHelper';
import JsonObject from './JsonObject';
import NavBar from './NavBar';
import GoogleSheet from './GoogleSheet';

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
      jsonObj: null,
      errorMessage: null,
    };
  }

  onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
        if (this.state.spreadsheet.id) {
          getSpreadhSheet(this.state.spreadsheet.id).then(  
            (spreadsheet) => {
              const { spreadsheetId, properties, spreadsheetUrl } = spreadsheet;
              const { sheetId } = spreadsheet.sheets[0].properties;
              
              this.setState({
                ...this.state,
                spreadsheet: {
                  id: spreadsheetId,
                  sheetId,
                  name: properties.title,
                  spreadsheetUrl
                },
                isSignedIn,
              });
            }
          );
        } else {
          this.setState({
            ...this.state,
            isSignedIn
          });
        }
    } else {
      this.setState({
        ...this.state,
        isSignedIn,
        spreadsheet: {
          id: null,
        },
      });
    }
  };

  handleGoogleAuth = (e) => {
    e.preventDefault();
    this.state.isSignedIn ? signOut() : signIn();
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
      if (fileUploaded) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          const jsonData = event.target.result;
          localStorage.setItem('jsonData', jsonData);
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
        e.target.value = null;
      }
    }
  };

  handleProcessJson = () => {
    const { jsonObj, isSignedIn, spreadsheet } = this.state;
    if (jsonObj) {
      const sheetData = parseJson(this.state.jsonObj);
      if (isSignedIn) {
        if (spreadsheet.id) {
          batchUpdate([
            deleteRange(spreadsheet.sheetId, 0, null, 0, null, 1),
            updateCells(sheetData, spreadsheet.sheetId)
          ],
          spreadsheet.id)
          .then((response) => {
            console.log(response);
            const { spreadsheetId, spreadsheetUrl, properties, sheets } = response.updatedSpreadsheet;
            const { title } = properties;
            localStorage.setItem('spreadsheetId', spreadsheetId);
            this.setState({
              ...this.state,
              spreadsheet: {
                id: spreadsheetId,
                spreadsheetUrl,
                name: title,
                sheetId: sheets[0].properties.sheetId,
              }
            })
          });
        } else {
          createSpreadSheet('Data', 0, 0, sheetData).then((spreadsheet) => {
            const spreadsheetId = spreadsheet.spreadsheetId;
            localStorage.setItem('spreadsheetId', spreadsheetId);
            this.setState({
              ...this.state,
              spreadsheet: {
                id: spreadsheetId,
                sheetId: spreadsheet.sheets[0].properties.sheetId,
                sheetTitle: spreadsheet.sheets[0].properties.title,
                name: spreadsheet.properties.title,
                spreadsheetUrl: spreadsheet.spreadsheetUrl
              },
            });
          });
        }
      }
    }
  };
  
  componentWillMount() {
    const spreadsheetId = localStorage.getItem('spreadsheetId'),
          jsonData = localStorage.getItem('jsonData');
    let   jsonObj = null,
          errorMessage = null;
    if (jsonData) {
      try {
        jsonObj = JSON.parse(jsonData);
      } catch (error) {
        errorMessage = `${error.name}: ${error.message}`;
      }
    } else {
      jsonObj = sampleData;
    }
    this.setState({
      ...this.state,
      spreadsheet: {
        id: spreadsheetId,
      },
      jsonObj,
      errorMessage,
    });
  }

  componentDidMount() {
    loadAPI(this.onAuthChange);
  }

  render() {
    return (
      <div>
        <Jumbotron>
          <div className="container">
            <h1>
              JSON to Google Sheets
            </h1>
            <p>
              Simple application that parses a json document and creates a google sheet document from JSON. 
              <br/>
              It generates sheet columns from all possible unique values contained within the JSON document, whereas rows represents all JSON elements.
              <br />
              If a JSON element contains a value in the columns, the cell will be 1, otherwise 0.
            </p>
          </div>
        </Jumbotron>
        <input 
          type='file'
          style={{display: 'none'}}
          ref={(e) => {
            this.jsonInput = e;
          }}
          onChange={this.handleJsonUpload}
          accept='.json'
        />
        <NavBar 
          isSignedIn={this.state.isSignedIn} 
          jsonObj={this.state.jsonObj}
          handleProcessJson={this.handleProcessJson}
          onFileUploadClick={this.handleJsonFileUploadClick}
          handleGoogleAuth={this.handleGoogleAuth}
        />
        <JsonObject jsonObj={this.state.jsonObj} />
        <GoogleSheet 
          spreadsheetId={this.state.spreadsheet.id}
          isSignedIn={this.state.isSignedIn}
          sheetUrl={this.state.spreadsheet.spreadsheetUrl}
          width='800'
          height='500'
        />
      </div>
    );
  }
}

export default App;
