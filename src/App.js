import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import { check, logout, Login } from './obudget-auth'
import Auth from './Auth/Auth.js';
import Auth0Manage from './Auth/ManageUser';
import Login from './Auth/Login';
import BillAgendaEditor from './BillAgendaEditor/BillAgendaEditor';
import BillAgendaViewer from './BillAgendaViewer/BillAgendaViewer';

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cje1hr7h70t990128cvmbvsop' })

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

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
   })
   .catch(err => {
     console.error(err);
   });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>

          <Login auth={this.auth} />

          {this.state.isEditor ?
            <BillAgendaEditor /> : <BillAgendaViewer />}
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
