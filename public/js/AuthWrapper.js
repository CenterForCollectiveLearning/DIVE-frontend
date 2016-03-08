import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

export function requireAuthentication(Component) {
    class AuthenticatedComponent extends Component {

        constructor() {

        }

        componentWillMount() {
          this.checkAuth();
          console.log('will mount!')
        }

        componentWillReceiveProps(nextProps) {
          console.log('will receive props!', nextProps, this.checkAuth());
          this.checkAuth();
        }

        checkAuth() {
          console.log('check auth');
          if (!this.props.isAuthenticated) {
              let redirectAfterLogin = this.props.location.pathname;
              this.props.dispatch(pushState(null, `/auth?next=${redirectAfterLogin}`));
          }
        }

        render() {
          console.log('Rendering AuthenticatedComponent');
            return (
                <div>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            )

        }
    }

    function mapStateToProps(state) {
      const { user } = state;
      console.log('mapStateToProps', state, user);
      return {
        isAuthenticated: state.user.isAuthenticated
      };
    };

    return connect(mapStateToProps)(AuthenticatedComponent);

}
