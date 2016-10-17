import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers';
import { setQueryString, getInitialState } from '../../../actions/RegressionActions';

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
    const { project, datasetSelector, pathname, queryObject, replace, setQueryString, fieldProperties, regressionType, dependentVariableId } = this.props;

    const generalTypeToPermissibleRegressionType = {
      'q': [ 'linear' ],
      'c': [ 'logistic' ],
    }

    // Auto regression type forcing
    if ( dependentVariableId && fieldProperties.items.length ) {
      var dependentVariableGeneralType = fieldProperties.items.find((property) => property.id == dependentVariableId).generalType;
      var permissibleRegressionTypes = generalTypeToPermissibleRegressionType[dependentVariableGeneralType];

      console.log(permissibleRegressionTypes, regressionType, dependentVariableGeneralType, permissibleRegressionTypes.indexOf(regressionType) == -1);
      if (!regressionType || permissibleRegressionTypes.indexOf(regressionType) == -1) {
        console.log('Must reconcile to', permissibleRegressionTypes[0]);
        const newQueryString = updateQueryString(queryObject, {
          regressionType: permissibleRegressionTypes[0]
        });
        setQueryString(newQueryString);
        replace(`${ pathname }${ newQueryString }`);
      }
    }
  }

  setRecommendedInitialState(fieldProperties) {
    const { project, datasetSelector, pathname, queryObject, replace, setQueryString } = this.props;

    const initialState = getInitialState(project.id, datasetSelector.datasetId, fieldProperties.items);
    const newQueryString = updateQueryString(queryObject, initialState);
    setQueryString(newQueryString);
    replace(`${ pathname }${ newQueryString }`);
  }

  render() {
    const { project, pathname, queryObject, regressionType, dependentVariableId, independentVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Regression' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.regressionContainer }` }>
          <RegressionView
            regressionType={ regressionType }
            dependentVariableId={ dependentVariableId }
            independentVariablesIds={ independentVariablesIds }
          />
          <RegressionSidebar
            pathname={ pathname }
            queryObject={ queryObject }
            regressionType={ regressionType }
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
    persistedQueryString: pathname,
    regressionType: parseFromQueryObject(queryObject, 'regressionType', false),
    dependentVariableId: parseFromQueryObject(queryObject, 'dependentVariableId', false),
    independentVariablesIds: parseFromQueryObject(queryObject, 'independentVariablesIds', true),
  };
}

export default connect(mapStateToProps, {
  replace,
  setQueryString
})(RegressionBasePage);
