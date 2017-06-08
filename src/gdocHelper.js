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
