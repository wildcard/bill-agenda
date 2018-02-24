import auth0 from 'auth0-js';

import history from '../history';

export default class Auth {
  constructor(key, options) {
    this.key = key;
    this.auth0 = new auth0.WebAuth({
      domain: 'hasadna.eu.auth0.com',
      clientID: '8UW62F75B7iXflHPhg1Pc4Eo6YUAleW4',
      redirectUri: 'http://localhost:3000',
      audience: 'https://hasadna.eu.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid profile email name company user_id',
      ...options
    });
  }

  handleAuthentication = () => {
      if (this.isAuthenticated()) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
            window.location.hash = '';

            resolve(authResult);
          } else if (err) {
            reject(err)
            console.error(err);
          }
        });
      });
    }

    setItem = (key, value) => {
      window.localStorage.setItem(`${this.key && this.key + '.'}${key}`, value);
    }

    getItem = (key) => {
      return window.localStorage.getItem(`${this.key && this.key + '.'}${key}`);
    }

    removeItem = (key) => {
      window.localStorage.removeItem(`${this.key && this.key + '.'}${key}`);
    }

    setSession = (authResult) => {
        // Set the time that the Access Token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        this.setItem('access_token', authResult.accessToken);
        this.setItem('id_token', authResult.idToken);
        this.setItem('expires_at', expiresAt);
      }

      logout = () => {
        // Clear Access Token and ID Token from local storage
        this.removeItem('access_token');
        this.removeItem('id_token');
        this.removeItem('expires_at');
      }

      isAuthenticated = () => {
        // Check whether the current time is past the
        // Access Token's expiry time
        let expiresAt = JSON.parse(this.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
      }

      getAccessToken = () => {
        const accessToken = this.getItem('access_token');
        if (!accessToken) {
          throw new Error('No Access Token found');
        }

        return accessToken;
      }

      getIdToken = () => {
        const idToken = this.getItem('id_token');
        if (!idToken) {
            throw new Error('No ID Token found');
        }

        return idToken;
      }

      getProfile = () => {
        let accessToken = this.getAccessToken();

        return new Promise((resolve, reject) => {
          if (this.userProfile) {
            resolve(this.userProfile);
          }

          this.auth0.client.userInfo(accessToken, (err, profile) => {
            if (profile) {
              this.userProfile = profile;
              resolve(profile);
            }

            if (err) {
              reject(err);
            }
          });
        });
      }



  login = () => {
    this.auth0.authorize();
  }
}
