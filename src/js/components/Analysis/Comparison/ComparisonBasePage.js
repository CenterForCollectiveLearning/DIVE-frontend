import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers';
import { setComparisonQueryString, getInitialComparisonState } from '../../../actions/ComparisonActions';

import ComparisonSidebar from './ComparisonSidebar';
import ComparisonView from './ComparisonView';

export class ComparisonBasePage extends Component {
  componentWillMount() {
    const {
      project,
      datasetSelector,
      pathname,
      fieldProperties,
      comparisonQueryString,
      setComparisonQueryString,
      queryObject,
      replace
    } = this.props;
    if ( comparisonQueryString ) {
      replace(`${ pathname }${ comparisonQueryString }`);
    } else {
      if ( fieldProperties.items.length ) {
        const selectedVariableIds = getInitialComparisonState(project.id, datasetSelector.datasetId, fieldProperties.items)
        const newQueryString = updateQueryString(queryObject, 'independentVariablesIds', indepVariableIds, true);
        setComparisonQueryString(newQueryString);
        replace(`${ pathname }${ newQueryString }`);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      project,
      datasetSelector,
      pathname,
      replace,
      setComparisonQueryString,
      queryObject,
      correlationQueryString: currentQueryString
    } = this.props;
    const {
      fieldProperties,
      correlationQueryString: nextQueryString,
    } = nextProps;

    const shouldRecommendInitialState = !currentQueryString && !nextQueryString;
    if ( shouldRecommendInitialState && fieldProperties.items.length) {
      const selectedVariableIds = getInitialComparisonState(project.id, datasetSelector.datasetId, fieldProperties.items);
      const newQueryString = updateQueryString(queryObject, 'correlationVariablesIds', selectedVariableIds, true);
      setComparisonQueryString(newQueryString);
      replace(`${ pathname }${ newQueryString }`);
    }
  }

  render() {
    const { projectTitle, pathname, queryObject, independentVariablesIds, dependentVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Comparison' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <ComparisonView
            independentVariablesIds={ independentVariablesIds }
            dependentVariablesIds={ dependentVariablesIds }
          />
          <ComparisonSidebar
            pathname={ pathname }
            queryObject={ queryObject }
            independentVariablesIds={ independentVariablesIds }
            dependentVariablesIds={ dependentVariablesIds }
          />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, datasetSelector, comparisonSelector, fieldProperties } = state;
  const pathname = ownProps.location.pathname;
  const queryObject = ownProps.location.query;

  return {
    project,
    datasetSelector,
    fieldProperties,
    queryObject: queryObject,
    pathname: pathname,
    comparisonQueryString: comparisonSelector.queryString,
    independentVariablesIds: parseFromQueryObject(queryObject, 'independentVariablesIds', true),
    dependentVariablesIds: parseFromQueryObject(queryObject, 'dependentVariablesIds', true)
  };
}

export default connect(mapStateToProps, {
  replace,
  setComparisonQueryString
})(ComparisonBasePage);
