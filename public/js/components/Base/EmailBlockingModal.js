import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setUserEmail, submitUser } from '../../actions/UserActions';

import styles from './EmailBlockingModal.sass';

import BlockingModal from './BlockingModal';
import RaisedButton from './RaisedButton';
import Input from './Input';

class EmailBlockingModal extends Component {
  constructor(props) {
    super(props);

    this.enteredEmailInput = this.enteredEmailInput.bind(this);
    this.clickedSubmitEmail = this.clickedSubmitEmail.bind(this);
  }

  enteredEmailInput(event) {
    this.props.setUserEmail(event.target.value);
  }

  clickedSubmitEmail() {
    this.props.submitUser();
  }

  render() {
    return (
      <div>
        { !this.props.userSubmitted &&
          <BlockingModal styles={ styles } heading={
            <span>Get Early Beta Access to <strong>DIVE</strong></span>
          }>
            <div>
              <Input
                type="email"
                placeholder="email"
                large
                onChange={ this.enteredEmailInput }
                onSubmit={ this.clickedSubmitEmail }/>
              <RaisedButton primary minWidth={ 110 } onClick={ this.clickedSubmitEmail }>Get Access</RaisedButton>
            </div>
          </BlockingModal>
        }
      </div>
    );
  }
}

EmailBlockingModal.propTypes = {
  userSubmitted: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { user } = state;
  return {
    userSubmitted: user.properties.submitted == true
  };
}

export default connect(mapStateToProps, { setUserEmail, submitUser })(EmailBlockingModal);
