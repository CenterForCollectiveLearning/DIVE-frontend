import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import AggregationSidebar from './AggregationSidebar';
import AggregationView from './AggregationView';

export class AggregationPage extends Component {
  render() {
    const { projectTitle } = this.props;
    return (
      <DocumentTitle title={ 'Aggregation' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <AggregationView />
          <AggregationSidebar />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { project } = state;
  return { projectTitle: project.properties.title };
}

export default connect(mapStateToProps, { })(AggregationPage);
