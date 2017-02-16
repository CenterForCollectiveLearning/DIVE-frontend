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
    this.reconcileState();
  }

  reconcileState() {
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString, fieldProperties, regressionType, independentVariablesIds, dependentVariableId } = this.props;

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

  setRecommendedInitialState = (fieldProperties) =>{
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString, getRecommendation } = this.props;

    function setInitialStateCallback(json) {
      json = { ...json, recommended: true };
      const newQueryString = updateQueryString(queryObject, json);
      setPersistedQueryString(newQueryString);
      replace(`${ pathname }${ newQueryString }`);
    }

    getRecommendation(project.id, datasetSelector.datasetId, fieldProperties.items, setInitialStateCallback);
  }

  render() {
    const { project, pathname, queryObject, regressionType, recommendationType, tableLayout, recommended, dependentVariableId, independentVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Regression' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.regressionContainer }` }>
          <RegressionView
            regressionType={ regressionType }
            dependentVariableId={ dependentVariableId }
            independentVariablesIds={ independentVariablesIds }
            tableLayout={ tableLayout }
          />
          <RegressionSidebar
            pathname={ pathname }
            queryObject={ queryObject }
            tableLayout={ tableLayout }
            regressionType={ regressionType }
            recommended={ recommended }
            recommendationType={ recommendationType }
            dependentVariableId={ dependentVariableId }
            independentVariablesIds={ independentVariablesIds }
          />
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
    datasetSelector,
    fieldProperties,
    queryObject: queryObject,
    pathname: pathname,
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
