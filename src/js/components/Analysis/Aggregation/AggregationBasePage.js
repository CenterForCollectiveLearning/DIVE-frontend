import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers';
import { setAggregationQueryString, getInitialAggregationState } from '../../../actions/AggregationActions';

import AggregationSidebar from './AggregationSidebar';
import AggregationView from './AggregationView';

export class AggregationBasePage extends Component {
  componentWillMount() {
    const {
      pathname,
      fieldProperties,
      aggregationQueryString,
      setAggregationQueryString,
      replace
    } = this.props;

    if ( aggregationQueryString ) {
      replace(`${ pathname }${ aggregationQueryString }`);
    } else {
      if ( fieldProperties.items.length ) {
        this.setRecommendedInitialState(fieldProperties);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      aggregationQueryString: currentQueryString
    } = this.props;
    const {
      fieldProperties,
      aggregationQueryString: nextQueryString,
    } = nextProps;

    const shouldRecommendInitialState = !currentQueryString && !nextQueryString;
    if ( shouldRecommendInitialState && fieldProperties.items.length) {
      this.setRecommendedInitialState(fieldProperties);
    }
  }

  setRecommendedInitialState(fieldProperties) {
    const {
      project,
      datasetSelector,
      pathname,
      replace,
      setAggregationQueryString,
      queryObject,
      aggregationQueryString: currentQueryString
    } = this.props;

    const initialState = getInitialAggregationState(project.id, datasetSelector.datasetId, fieldProperties.items);
    const newQueryString = updateQueryString(queryObject, initialState);
    console.log(queryObject);
    console.log(initialState);
    console.log(newQueryString);    
    setAggregationQueryString(newQueryString);
    replace(`${ pathname }${ newQueryString }`);
  }

  render() {
    const { project, pathname, queryObject, aggregationVariablesIds } = this.props;

    return (
      <DocumentTitle title={ 'Aggregation' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <AggregationView
            aggregationVariablesIds={ aggregationVariablesIds }
          />
          <AggregationSidebar
            pathname={ pathname }
            queryObject={ queryObject }
            aggregationVariablesIds={ aggregationVariablesIds }
          />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, datasetSelector, aggregationSelector, fieldProperties } = state;
  const pathname = ownProps.location.pathname;
  const queryObject = ownProps.location.query;

  return {
    project,
    datasetSelector,
    fieldProperties,
    queryObject: queryObject,
    pathname: pathname,
    aggregationQueryString: aggregationSelector.queryString,
    aggregationVariablesIds: parseFromQueryObject(queryObject, 'aggregationVariablesIds', true),
    aggregationVariablesId: parseFromQueryObject(queryObject, 'aggregationVariablesId', false),
  };
}

export default connect(mapStateToProps, {
  replace,
  setAggregationQueryString
})(AggregationBasePage);
