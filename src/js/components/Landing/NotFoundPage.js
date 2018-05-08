import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './NotFoundPage.sass';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Link from '../Base/Link';
import Footer from './Footer';
import HomePage from './HomePage';
import { wipeProjectState } from '../../actions/ProjectActions';

import { Position, Toaster, Button, Intent, NonIdealState } from '@blueprintjs/core';

import Logo from '../../../assets/DIVE_logo_white.svg?name=Logo';

export class NotFoundPage extends Component {
  render() {
    console.log('In not found page');
    return (
      <DocumentTitle title='DIVE | Error'>
        <div className={ styles.fillContainer + ' ' + styles.notFoundPage }>
          <NonIdealState
            className={ styles.centeredFill + ' ' + styles.notFoundPageContent }
            title='Not Found'
            description={ <p>The page you requested could not be located.</p> }
            action={ <span className={ styles.link } onClick={ this.goHome }>Click here to return to DIVE.</span> }
            visual='error'
          />
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { push })(NotFoundPage);
