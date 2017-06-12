const gapi = window.gapi;

const auth2Info = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  clientId: process.env.REACT_APP_GOOGLE_API_CLIENT_ID,
  discoveryDocs: [process.env.REACT_APP_GOOGLE_API_DISCOVERY_DOCS],
  scope: 'https://www.googleapis.com/auth/spreadsheets',
};

const initClient = (onAuthChange) => {
  gapi.client.init(auth2Info)
    .then(() => {
      if (onAuthChange) {
        gapi.auth2.getAuthInstance().isSignedIn.listen(onAuthChange);
        onAuthChange(gapi.auth2.getAuthInstance().isSignedIn.get());
      }
    }, (reason) => {
      if (reason.result && reason.result.error) {
        console.log(`Error: ${reason.result.error.message}`);
      }
    });
};

const processSheetData = (sheetData) => 
  sheetData.map((row) => ({
    values: row.map((col) => {
      const type = typeof(col);
      // default to string
      let typeValue = 'stringValue';
      if (type === 'string' || type === 'number') {
        typeValue = `${type}Value`;
      }
      return {
        userEnteredValue: {
          [typeValue]: col,
        },
      }
    })
  }));

export const loadAPI = (authChange) => {
  gapi.load('client:auth2', () => {
    initClient(authChange);
  });
};

export const signIn = () => {
  gapi.auth2.getAuthInstance().signIn();
};

export const signOut = () => {
  gapi.auth2.getAuthInstance().signOut();
};

export const createSpreadSheet = (sheetTitle, startRow = 0, startColumn = 0, sheetData) => {
  const request = {
    resource: {
      properties: {
        title: 'JSON Content Parser',
        locale: 'en'
      },
      sheets: [{
        properties: {
          title: sheetTitle,
        },
        data: [{
          startRow,
          startColumn,
          rowData: processSheetData(sheetData),
        }],
      }],
    }
  };
  return gapi.client.sheets.spreadsheets.create(request).then((res) => res.result);
};

export const getSpreadhSheet = (spreadsheetId) => {
  const request = {
    spreadsheetId,
    includeGridData: true,
  };
  return gapi.client.sheets.spreadsheets.get(request).then((res) => res.result);
};

export const updateCells = (sheetData, sheetId) => ({
  updateCells: {
    rows: processSheetData(sheetData),
    fields: '*',
    start: {
      sheetId,
      rowIndex: 0,
      columnIndex: 0,
    },
  },
});

export const deleteRange = (sheetId, startRowIndex, endRowIndex = null, startColumnIndex, endColumnIndex = null, shiftDimension) => {
  const range = {
    sheetId,
    startRowIndex,
    startColumnIndex,
  };
  if (endRowIndex) {
    range.endRowIndex = endRowIndex;
  }
  if (endColumnIndex) {
    range.endColumnIndex = endColumnIndex;
  }
  return {
    deleteRange: {
      range,
      shiftDimension
    },
  }
};

export const batchUpdate = (requests, spreadsheetId, includeSpreadsheetInResponse = true) => 
  gapi.client.sheets.spreadsheets.batchUpdate({
    requests,
    spreadsheetId,
    includeSpreadsheetInResponse
  }).then((res) => res.result, (err) => {
    if (err) {
      console.error(err);
    }
  });
