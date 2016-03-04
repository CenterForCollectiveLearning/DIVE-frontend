import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/AuthActions';

import styles from './Auth.sass';

import Input from '../Base/Input'
import BlockingModal from '../Base/BlockingModal';
import RaisedButton from '../Base/RaisedButton';

class AuthModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      columns: columns,
      email: '',
      password: ''
    };

  }
  handleEmailChange: function(e) {
     this.setState({email: e.target.value});

  },
  handlePasswordChange: function(e) {
     this.setState({password: e.target.value});
  },

  submit() {
    const { reduceDatasetColumns, projectId, datasetId } = this.props;

    const selectedColumns = this.state.columns
      .filter((column) => column.selected)
      .map((column) => column.id);

    if (!selectedColumns.length) {
      this.setState({ error: "Please select columns to keep."});
      return;
    }

    reduceDatasetColumns(projectId, datasetId, selectedColumns);
    this.props.closeAction();
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
          <span>Select Columns to Display</span>
        }
        footer={
          <div className={ styles.footerContent }>
            <div className={ styles.footerLabel }>
              { this.state.error &&
                <label className={ styles.error }>{ this.state.error }</label>
              }
            </div>
            <div className={ styles.rightActions }>
              <RaisedButton primary onClick={ this.submit.bind(this) }>Choose columns</RaisedButton>
            </div>
          </div>
        }>
      </BlockingModal>
    );
  }
}

AuthModal.propTypes = {
  authRequired: React.PropTypes.bool
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { })(AuthModal);
