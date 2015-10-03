import React, { Component, PropTypes } from 'react';
import styles from './landing.sass';
import { connect } from 'react-redux';
import { fetchProjectIfNeeded, createAUID } from '../../actions/ProjectActions.js';

import RaisedButton from '../Base/RaisedButton';
import Dropzone from 'react-dropzone';

var Logo = require('babel!svg-react!../../../assets/DIVE_logo_white.svg?name=Logo');

export class LandingPage extends Component {
  render() {
    return (
      <div className={styles.fillContainer + ' ' + styles.background}>
        <div className={styles.fillContainer + ' ' + styles.grid}>
          <div className={styles.top}>
            <div className={styles.header}>
              <div className={styles.logoContainer} href="/">
                <Logo className={styles.logo} />
                <div className={styles.logoText}>
                  DIVE
                </div>
              </div>
            </div>
            <div className={styles.primaryText}>
              Stop Processing Data and Start Understanding It
            </div>
            <div className={styles.secondaryText}>
              Merge and query datasets, conduct statistical analyses, and explore
              autmatically generated visualizations within seconds.
            </div>
            <RaisedButton label="Select & upload a file" primary={ true } onClick={ this.onOpenClick } />
          </div>
          <div className={styles.separator}></div>
          <div className={styles.preloaded}>
            <div className={styles.header}>Or explore our preloaded projects:</div>
          </div>
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { fetchProjectIfNeeded })(LandingPage);
