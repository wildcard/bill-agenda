import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import { check, logout, Login } from './obudget-auth'
import Auth from './Auth/Auth.js';
import Auth0Manage from './Auth/ManageUser';
import Login from './Auth/Login';
import BillAgendaEditor from './BillAgendaEditor/BillAgendaEditor';
import BillAgendaViewer from './BillAgendaViewer/BillAgendaViewer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,
      isEditor: null
    };

    this.auth = new Auth('auth0');
  }

  componentDidMount(){
    this.auth.handleAuthentication().then(() => {
      return this.auth
       .getProfile()
       .then(profile => {
         this.setState({ profile });
         return Promise.resolve(profile);
       });
   }).then((profile) => {
    this.setState({
      isEditor: profile['https://api.bill-agenda.co.il/rule'].includes('editor')
    });
     // this.auth0Management.login();
   })
   .catch(err => {
     console.error(err);
   });

   // this.auth0Management.handleAuthentication().then(() => {
   //   this.auth
   //    .getProfile().then(profile => {
   //      if (profile) {
   //        const userId = profile.sub.split('|')[1];
   //        this.auth0ManageUser = new Auth0Manage(this.auth0Management.getIdToken());
   //        return this.auth0ManageUser.getUser(userId).then(userInfo => {
   //          this.setState({ userInfo });
   //
   //          return Promise.resolve(userInfo);
   //        });
   //      }
   //    })
   // });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <Login auth={this.auth} />

        {this.state.isEditor ?
          <BillAgendaEditor /> : <BillAgendaViewer />}
      </div>
    );
  }
}

export default App;
