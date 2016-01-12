import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import styles from '../Analysis.sass';

import ComparisonSidebar from './ComparisonSidebar';
import ComparisonView from './ComparisonView';


export class ComparisonPage extends Component {
  render() {
    return (
      <div className={ `${styles.fillContainer} ${styles.comparisonContainer}` }>
        <ComparisonSidebar />
        <ComparisonView />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState })(ComparisonPage);
