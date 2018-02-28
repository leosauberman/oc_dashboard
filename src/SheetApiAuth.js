import React from 'react';

const GOOGLE_API_CLIENT_ID = '140736458087-plcplg5rjn0vn7nuhg021gk2qfbdu03b.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'AIzaSyAwmG8S2C99fpFpLhphiH6iT4sE62emIhA';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

class SheetApiAuth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false
    }

    this.gapi = null;
    this.authorizeDiv = null;
    this.authorizeButton = null;
    this.signoutButton = null;
    this.initClient = this.initClient.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.loadGoogleApi = this.loadGoogleApi.bind(this);
    this.loadSheetsApi = this.loadSheetsApi.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.handleSignoutClick = this.handleSignoutClick.bind(this);
    this.handleAuthResult = this.handleAuthResult.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
  }

  componentDidMount() {
    this.authorizeDiv = document.getElementById('authorize-div');
    this.authorizeButton = document.getElementById('authorize-button');
    this.signoutButton = document.getElementById('signout-button');
    this.authorizeDiv.className = '';

    if (!this.gapi) this.loadGoogleApi();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isSignedIn) {
      this.authorizeButton.style.display = 'none';
      this.signoutButton.style.display = 'block';
      this.authorizeDiv.className = '';

      if (!prevState.isSignedIn) {
        this.props.onReady();
      }
    } else {
      this.authorizeDiv.className = 'active';
      this.authorizeButton.style.display = 'block';
      this.signoutButton.style.display = 'none';
    }
  }

  loadGoogleApi() {
    const script = document.createElement('script');

    script.src = 'https://apis.google.com/js/api.js';

    script.onload = () => {
      window.gapi.load('client:auth2', this.initClient);
    };

    document.body.appendChild(script);
  }

  loadSheetsApi() {
    this.gapi.client.load(DISCOVERY_DOCS).then(this.props.onReady);
  }

  checkAuth() {
    this.gapi = window.gapi; // you can do like this. Now you can access gapi in all methods if this class.

    this.gapi.auth.authorize({
      client_id: GOOGLE_API_CLIENT_ID,
      scope: SCOPES,
      immediate: true,
    }, this.handleAuthResult());
  }

  handleAuthResult(authResult) {
    if (authResult && !authResult.error) this.loadSheetsApi();
  }

  initClient() {
    this.gapi = window.gapi;

    this.gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_API_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      // Listen for sign-in state changes.
      this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      this.updateSigninStatus(this.gapi.auth2.getAuthInstance().isSignedIn.get());

      this.authorizeButton.onclick = this.handleAuthClick;
      this.signoutButton.onclick = this.handleSignoutClick;
    });
  }

  updateSigninStatus(isSignedIn) {
    this.setState({isSignedIn: isSignedIn})
  }

  handleSignoutClick() {
    this.gapi.auth2.getAuthInstance().signOut();
  }

  handleAuthClick(event) {
    this.gapi.auth2.getAuthInstance().signIn();
  }

  fetchData() {
    this.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.props.spreadsheet,
      range: 'A1:F500',
    }).then((response) => {
      this.setState({sheetValues: response.result.values});
    }, (response) => {
      console.error(response.result.error.message);
    });
  }

  startIndex() {
    if (this.props.type === 'team') {
      const startIndex = this.state.sheetValues.findIndex(function(v) {
        return v[0] === '__dashboard'
      });

      return startIndex === -1 ? 0 : startIndex;
    } else {
      return 0;
    }
  }

  getHeaderValues() {
    return this.state.sheetValues.slice(this.startIndex(), this.startIndex() + 8)[0];
  }

  getBodyValues() {
    return this.state.sheetValues.slice(this.startIndex(), this.startIndex() + 8).slice(1, 8);
  }

  renderTable() {
    return(
      <table>
        <thead>
          <tr>
            {this.getHeaderValues().map(function(v, i) {
              return <th>{v}</th>
            })}
          </tr>
        </thead>

        <tbody>
          {this.getBodyValues().map(function(vals, i) {
            return(
              <tr>
                {vals.map(function(v, vi) {
                  return <td>{v}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <div id="authorize-div">
        <button id="authorize-button">Auth</button>
        <button id="signout-button">Sair</button>
      </div>
    );
  }
}

export default SheetApiAuth;
