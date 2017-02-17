import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers';
import { setPersistedQueryString, getRecommendation } from '../../../actions/RegressionActions';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';
import { selectDependentVariable, selectRegressionType } from '../../../actions/RegressionActions';

export class RegressionBasePage extends Component {

  componentWillMount() {
    const { project, datasetId, fieldProperties, persistedQueryString, pathname, replace } = this.props;

    if ( persistedQueryString ) {
      replace(`${ pathname }${ persistedQueryString }`);
    } else {
      if ( project.id && datasetId ) {
        this.setRecommendedInitialState(this.props);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { queryObject: currentQueryObject, recommendationResult } = this.props;
    const { queryObject: nextQueryObject, project, datasetId, persistedQueryString } = nextProps;

    const shouldRecommendInitialState = Object.keys(currentQueryObject).length == 0 && Object.keys(nextQueryObject).length == 0 && !recommendationResult.loading && !nextProps.recommendationResult.loading && !persistedQueryString;
    if ( project.id && datasetId && shouldRecommendInitialState) {
      this.setRecommendedInitialState(nextProps);
    }

    // Handling inconsistent state, default selection of certain fields
    this.reconcileState(nextProps);
  }

  reconcileState(props) {
    const { project, datasetId, pathname, queryObject, replace, setPersistedQueryString, fieldProperties, regressionType, independentVariablesIds, dependentVariableId } = props;

    const generalTypeToPermissibleRegressionType = {
      'q': [ 'linear' ],
      'c': [ 'logistic' ],
    }

    // Auto regression type forcing
    if ( dependentVariableId && fieldProperties.items.length ) {
      var dependentVariableGeneralType = fieldProperties.items.find((property) => property.id == dependentVariableId).generalType;
      var permissibleRegressionTypes = generalTypeToPermissibleRegressionType[dependentVariableGeneralType];

      if (!regressionType || permissibleRegressionTypes.indexOf(regressionType) == -1) {
        const newQueryString = updateQueryString(queryObject, {
          regressionType: permissibleRegressionTypes[0]
        });
        setPersistedQueryString(newQueryString);
        replace(`${ pathname }${ newQueryString }`);
      }
    }

    if ( dependentVariableId && independentVariablesIds.length && independentVariablesIds.indexOf(dependentVariableId) > -1 ) {
      const newQueryString = updateQueryString(queryObject, {
        independentVariablesIds: [ dependentVariableId ]
      });
      setPersistedQueryString(newQueryString);
      replace(`${ pathname }${ newQueryString }`);
    }
  }

  setRecommendedInitialState = (props) => {
    const { project, datasetId, pathname, queryObject, replace, setPersistedQueryString, getRecommendation } = props;

    function setInitialStateCallback(json) {
      const newQueryString = updateQueryString(queryObject, json);
      setPersistedQueryString(newQueryString);
      replace(`${ pathname }${ newQueryString }`);
    }

    getRecommendation(project.id, datasetId, setInitialStateCallback);
  }

  render() {
    const { project, pathname, queryObject, regressionType, recommendationType, tableLayout, recommended, dependentVariableId, independentVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Regression' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.regressionContainer }` }>
          <RegressionView { ...this.props } />
          <RegressionSidebar { ...this.props } />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, datasetSelector, regressionSelector, fieldProperties } = state;
  const pathname = ownProps.location.pathname;
  const queryObject = ownProps.location.query;

  return {
    project,
    fieldProperties,
    regressionSelector,
    queryObject,
    pathname,
    datasetId: datasetSelector.datasetId,
    recommendationResult: regressionSelector.recommendationResult,
    persistedQueryString: regressionSelector.queryString,
    recommended: (parseFromQueryObject(queryObject, 'recommended', false) == 'true'),
    tableLayout: parseFromQueryObject(queryObject, 'tableLayout', false),
    recommendationType: parseFromQueryObject(queryObject, 'recommendationType', false),
    regressionType: parseFromQueryObject(queryObject, 'regressionType', false),
    dependentVariableId: parseFromQueryObject(queryObject, 'dependentVariableId', false),
    independentVariablesIds: parseFromQueryObject(queryObject, 'independentVariablesIds', true),
  };
}

export default connect(mapStateToProps, {
  replace,
  setPersistedQueryString,
  getRecommendation
})(RegressionBasePage);
