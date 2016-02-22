import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import styles from '../Analysis.sass';

import CorrelationSidebar from './CorrelationSidebar';
import CorrelationView from './CorrelationView';

export class CorrelationPage extends Component {
  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
        <CorrelationSidebar />
        <CorrelationView />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState })(CorrelationPage);
