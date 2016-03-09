import React, { Component, PropTypes } from 'react';

import { pushState} from 'redux-react-router';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/AuthActions';

import styles from './Auth.sass';

import Input from '../Base/Input'
import BlockingModal from '../Base/BlockingModal';
import RaisedButton from '../Base/RaisedButton';

class AuthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      email: '',
      username: '',
      password: ''
    };
  }

  componentWillMount() {
    this.ensureNotLoggedIn(this.props)
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    this.ensureNotLoggedIn(nextProps)
  }

  handleEmailChange(e) {
     this.setState({ email: e.target.value });
  }

  handleUsernameChange(e) {
     this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
     this.setState({ password: e.target.value });
  }


  ensureNotLoggedIn(props) {
    console.log('in ensureNotLoggedIn', props);
    const { isAuthenticated, pushState } = props;

    console.log('is authenticated', isAuthenticated, props.location.query.next);
    if (isAuthenticated){
      pushState(null, props.location.query.next || '/home');
    }
  };

  submit() {
    const { loginUser } = this.props;
    const { email, username, password } = this.state;
    loginUser(email, username, password);
  }

  render() {
    const { authRequired } = this.props;

    if (authRequired) {
      openModal();
    }

    return (
      <BlockingModal
        scrollable
        closeAction={ this.props.closeAction }
        heading={
          <span>Login or Register to Proceed</span>
        }
        footer={
          <div className={ styles.footerContent }>
            <div className={ styles.footerLabel }>
              { this.state.error &&
                <label className={ styles.error }>{ this.state.error }</label>
              }
            </div>
            <div className={ styles.rightActions }>
            </div>
          </div>
        }>
        <form>
          <Input type="text" placeholder="Email" onChange={this.handleEmailChange.bind(this)} />
          <Input type="text" placeholder="Username" onChange={this.handleUsernameChange.bind(this)} />
          <Input type="password" placeholder="Password" onChange={this.handlePasswordChange.bind(this)}/>
          <RaisedButton primary minWidth={ 100 } onClick={ this.submit.bind(this) }>Done</RaisedButton>
        </form>
      </BlockingModal>
    );
  }
}

AuthPage.propTypes = {
  authRequired: React.PropTypes.bool
};

function mapStateToProps(state) {
  const { user } = state;
  return { isAuthenticated: user.isAuthenticated };
}

export default connect(mapStateToProps, { loginUser, pushState})(AuthPage);
