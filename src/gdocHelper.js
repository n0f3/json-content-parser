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

const getUpdateRequest = ([{updateKind, updateObj}]) => {
  const request = {};
  console.log([...arguments]);
  [...arguments].forEach((arg) => {
    request[arg.updateKind] = arg.updateObj;
  });
  return request;
};

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

export const createSpreadSheet = (sheetProps) => {
  const request = {
    resource: {
      properties: {
        title: 'JSON Content Parser',
        locale: 'en'
      },
      sheets: [sheetProps],
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

export const updateSpreadsheetGrid = (spreadsheetId, sheetId, sheetTitle, rowCount, columnCount) => {
  const updateRequest = {
    updateSheetProperties: {
      properties: {
        sheetId,
        title: sheetTitle,
        gridProperties: {
          rowCount,
          columnCount,
        },
      },
      fields: '*',
    }
  };
  console.log(updateRequest);
  const request = {
    requests: [updateRequest],
    includeSpreadsheetInResponse: true,
    spreadsheetId,
  }
  return gapi.client.sheets.spreadsheets.batchUpdate(request)
    .then((res) => res.result, (err) => {
      if (err) {
        console.error(err);
      }
    });
};
