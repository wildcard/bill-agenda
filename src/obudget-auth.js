import React, { Component } from 'react';

const authServerUrl = 'http://next.obudget.org'
const jwtQueryParam = 'jwt';
const jwtLocalStorageKey = 'jwt';

function getToken() {
        let search = document.location.search.trim();
        if (search.startsWith('?')) search = search.substring(1);
        let params = new URLSearchParams(search);
        let jwt = params.get(jwtQueryParam);
        if (jwt) {
            // remove the jwt query param from the URL
            window.history.replaceState(null, document.title, document.location.href.split("?")[0]);
            return jwt;
        } else {
            return window.localStorage.getItem(jwtLocalStorageKey);
        }
    }

function setToken(jwt) {
    window.localStorage.setItem(jwtLocalStorageKey, jwt);
}

    /**
     * delete the token from local storage
     */
    function deleteToken() {
        window.localStorage.removeItem(jwtLocalStorageKey);
    }

export function check(next) {
    let jwt = getToken();
    if (jwt) {
        setToken(jwt)
    }

    return fetch(authServerUrl + '/auth/check?jwt=' + (jwt ? jwt : '') + '&next=' + encodeURIComponent(next))
        .then(res => res.json())

  }

    export function logout() {
        deleteToken();
        let search = document.location.search.trim();
        if (search.startsWith('?')) search = search.substring(1);
        let params = new URLSearchParams(search);
        if (params.has(jwtQueryParam)) params.delete(jwtQueryParam);
        document.location.search = params.toString();
    }

    export class Login extends Component {
      constructor(props) {
        super(props);

        this.state = {
          user: null
        };
      }

      login = (event) => {
          const user = this.state.user;
          event.stopPropagation();
          event.preventDefault();

          if (user && user.providers) {
              if (user.providers.google) {
                  window.location.href = user.providers.google["url"];
              } else if (user.providers.github) {
                  window.location.href = user.providers.github["url"];
              }
          }
      }

      logout(event) {
          event.stopPropagation();
          event.preventDefault();
          logout();
      }

      componentDidMount() {
        check(document.location.href)
          .then((response: any) => {
            this.setState({ user:response });
            this.props.setUser(response);
          });
      }

      render() {
        const user = this.state.user;

        return (<div>
            {!user || !user.authenticated ?
              <a className="menu-item" onClick={this.login} href="#">כניסה למערכת</a> :
              <span className="menu-item">שלום {user.profile.name} <a onClick={this.logout} href="#">יציאה</a></span>}

        </div>);
      }
    }
