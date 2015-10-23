import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from '../Analysis.sass';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';

export class RegressionBasePage extends Component {
  render() {
    return (
      <div className={ `${styles.fillContainer} ${styles.regressionContainer}` }>
        <RegressionSidebar />
        <RegressionView />
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(RegressionBasePage);
