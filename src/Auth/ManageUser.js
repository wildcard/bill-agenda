import auth0 from 'auth0-js';

export default class Manage {
  constructor(token) {
    this.auth0Manage = new auth0.Management({
      domain: 'hasadna.eu.auth0.com',
      token
    });
  }

  getUser(userId) {
    return new Promise((resolve, reject) => {
      this.auth0Manage.getUser(userId, resolve);
    });
  }
}
