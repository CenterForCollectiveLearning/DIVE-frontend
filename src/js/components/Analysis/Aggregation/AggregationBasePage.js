import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers';
import { setPersistedQueryString, getInitialState } from '../../../actions/AggregationActions';

import ProjectTopBar from '../../ProjectTopBar';
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
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString, aggregationDependentVariableId, aggregationFunction, aggregationVariablesIds } = nextProps;

    var newQueryStringModifier = {};

    const numFields = aggregationVariablesIds.length;
    if ( numFields > 2 ) {
      // Deselect all but last two
      newQueryStringModifier.aggregationVariablesIds = aggregationVariablesIds.slice(0, numFields - 2);
    }

    // Auto aggregation function selection
    if ( aggregationDependentVariableId && aggregationDependentVariableId !== 'count' && !aggregationFunction ) {
      newQueryStringModifier.aggregationFunction = 'MEAN';
      newQueryStringModifier.weightVariableId = 'UNIFORM';
    }

    if (Object.keys(newQueryStringModifier).length > 0) {
      const newQueryString = updateQueryString(queryObject, newQueryStringModifier);

      setPersistedQueryString(newQueryString);
      replace(`${ pathname }${ newQueryString }`);
    }
  }

  setRecommendedInitialState(fieldProperties) {
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString } = this.props;

    const initialState = getInitialState(project.id, datasetSelector.id, fieldProperties.items);
    const newQueryString = updateQueryString(queryObject, initialState);
    setPersistedQueryString(newQueryString);
    replace(`${ pathname }${ newQueryString }`);
  }

  render() {
    const { project, pathname, queryObject, aggregationFunction, weightVariableId, aggregationDependentVariableId, aggregationVariablesIds } = this.props;

    return (
      <DocumentTitle title={ 'Aggregation' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <div className={ styles.fillContainer }>
            <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
            <AggregationView
              aggregationFunction={ aggregationFunction }
              weightVariableId={ weightVariableId }
              aggregationDependentVariableId={ aggregationDependentVariableId }
              aggregationVariablesIds={ aggregationVariablesIds }
            />
          </div>
          <AggregationSidebar
            pathname={ pathname }
            queryObject={ queryObject }
            aggregationFunction={ aggregationFunction }
            weightVariableId={ weightVariableId }
            aggregationDependentVariableId={ aggregationDependentVariableId }
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
    aggregationDependentVariableId: parseFromQueryObject(queryObject, 'aggregationDependentVariableId'),
  };
}

export default connect(mapStateToProps, {
  replace,
  setPersistedQueryString
})(AggregationBasePage);
