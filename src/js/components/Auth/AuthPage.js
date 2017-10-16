import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import styles from './Auth.sass';

export class AuthPage extends Component {
  render() {
    return (
      <div className={ styles.fillContainer + ' ' + styles.appContainer }>
        { this.props.children }
      </div>
    );
  }
}

AuthPage.propTypes = {
  children: PropTypes.node
};
