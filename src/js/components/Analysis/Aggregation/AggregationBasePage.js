import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers';
import { setPersistedQueryString, getInitialState } from '../../../actions/AggregationActions';

import AggregationSidebar from './AggregationSidebar';
import AggregationView from './AggregationView';

export class AggregationBasePage extends Component {
  componentWillMount() {
    const { fieldProperties, persistedQueryString, pathname, replace } = this.props;

    if ( persistedQueryString ) {
      replace(`${ pathname }${ persistedQueryString }`);
    } else {
      if ( fieldProperties.items.length ) {
        this.setRecommendedInitialState(fieldProperties);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { queryObject: currentQueryObject } = this.props;
    const { fieldProperties, queryObject: nextQueryObject } = nextProps;

    const shouldRecommendInitialState = Object.keys(currentQueryObject) == 0 && Object.keys(nextQueryObject).length == 0;
    if ( shouldRecommendInitialState && fieldProperties.items.length) {
      this.setRecommendedInitialState(fieldProperties);
    }

    // Handling inconsistent state, default selection of certain fields
    this.reconcileState(nextProps);
  }

  reconcileState(nextProps) {
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString, aggregateOn, aggregationFunction, aggregationVariablesIds } = nextProps;

    var newQueryStringModifier = {};

    const numFields = aggregationVariablesIds.length;
    if ( numFields > 2 ) {
      // Deselect all but last two
      newQueryStringModifier.aggregationVariablesIds = aggregationVariablesIds.slice(0, numFields - 2);
    }

    // Auto aggregation function selection
    if ( aggregateOn && aggregateOn !== 'count' && !aggregationFunction ) {
      newQueryStringModifier.aggregationFunction = 'MEAN';
    }

    if (Object.keys(newQueryStringModifier).length > 0) {
      const newQueryString = updateQueryString(queryObject, newQueryStringModifier);

      setPersistedQueryString(newQueryString);
      replace(`${ pathname }${ newQueryString }`);
    }
  }

  setRecommendedInitialState(fieldProperties) {
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString } = this.props;

    const initialState = getInitialState(project.id, datasetSelector.datasetId, fieldProperties.items);
    const newQueryString = updateQueryString(queryObject, initialState);
    setPersistedQueryString(newQueryString);
    replace(`${ pathname }${ newQueryString }`);
  }

  render() {
    const { project, pathname, queryObject, aggregationFunction, weightVariableId, aggregateOn, aggregationVariablesIds } = this.props;

    return (
      <DocumentTitle title={ 'Aggregation' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <AggregationView
            aggregationFunction={ aggregationFunction }
            weightVariableId={ weightVariableId }
            aggregateOn={ aggregateOn }
            aggregationVariablesIds={ aggregationVariablesIds }
          />
          <AggregationSidebar
            pathname={ pathname }
            queryObject={ queryObject }
            aggregationFunction={ aggregationFunction }
            weightVariableId={ weightVariableId }
            aggregateOn={ aggregateOn }
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
    persistedQueryString: aggregationSelector.queryString,
    aggregationFunction: parseFromQueryObject(queryObject, 'aggregationFunction'),
    weightVariableId: parseFromQueryObject(queryObject, 'weightVariableId'),
    aggregationVariablesIds: parseFromQueryObject(queryObject, 'aggregationVariablesIds', true),
    aggregateOn: parseFromQueryObject(queryObject, 'aggregateOn'),
  };
}

export default connect(mapStateToProps, {
  replace,
  setPersistedQueryString
})(AggregationBasePage);
