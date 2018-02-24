import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,
    };
  }

  login = () => {
    this.props.auth.login();
  }

  logout = () => {
    this.props.auth.logout();
    this.setState({ profile: null })
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;

    isAuthenticated() &&
      this.props.auth
        .getProfile()
        .then(profile => {
          this.setState({ profile });
        })
        .catch(err => {
          console.error(err);
        });
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const { name } = this.state.profile || {};

    return (
      <div>
        {!isAuthenticated() && (
          <button className="btn-margin" onClick={this.login}>
            Log In
          </button>
        )}
        {isAuthenticated() && (
          <div>
            {name}
            <button className="btn-margin" onClick={this.logout}>
              Log Out
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Login;
