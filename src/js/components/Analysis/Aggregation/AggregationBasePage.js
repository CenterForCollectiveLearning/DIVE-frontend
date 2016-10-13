import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject } from '../../../helpers/helpers'

import AggregationSidebar from './AggregationSidebar';
import AggregationView from './AggregationView';

export class AggregationBasePage extends Component {
  render() {
    const { projectTitle, queryObject, aggregationVariablesIds } = this.props;

    return (
      <DocumentTitle title={ 'Aggregation' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <AggregationView
            aggregationVariablesIds={ aggregationVariablesIds }
          />
          <AggregationSidebar
            queryObject={ queryObject }
            aggregationVariablesIds={ aggregationVariablesIds }
          />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project } = state;
  const queryObject = ownProps.location.query;

  return {
    projectTitle: project.title,
    queryObject: queryObject,
    aggregationVariablesIds: parseFromQueryObject(queryObject, 'aggregationVariablesIds', true),
    aggregationVariablesId: parseFromQueryObject(queryObject, 'aggregationVariablesId', false),
  };
}

export default connect(mapStateToProps, { })(AggregationBasePage);
