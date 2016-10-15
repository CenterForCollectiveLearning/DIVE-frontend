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
      pathname,
      fieldProperties,
      comparisonQueryString,
      setComparisonQueryString,
      replace
    } = this.props;

    if ( comparisonQueryString ) {
      replace(`${ pathname }${ comparisonQueryString }`);
    } else {
      if ( fieldProperties.items.length ) {
        this.setRecommendedInitialState(fieldProperties);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      comparisonQueryString: currentQueryString
    } = this.props;
    const {
      fieldProperties,
      comparisonQueryString: nextQueryString,
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
      setComparisonQueryString,
      queryObject,
      comparisonQueryString: currentQueryString
    } = this.props;

    const initialState = getInitialComparisonState(project.id, datasetSelector.datasetId, fieldProperties.items);
    const newQueryString = updateQueryString(queryObject, initialState);
    setComparisonQueryString(newQueryString);
    replace(`${ pathname }${ newQueryString }`);
  }

  render() {
    const { project, pathname, queryObject, independentVariablesIds, dependentVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Comparison' + ( project.title ? ` | ${ project.title }` : '' ) }>
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
