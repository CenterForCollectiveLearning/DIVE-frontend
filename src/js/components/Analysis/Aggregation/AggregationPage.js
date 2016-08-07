import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from '../Analysis.sass';

import AggregationSidebar from './AggregationSidebar';
import AggregationView from './AggregationView';

export class AggregationPage extends Component {
  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
        <AggregationView />
        <AggregationSidebar />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { })(AggregationPage);
