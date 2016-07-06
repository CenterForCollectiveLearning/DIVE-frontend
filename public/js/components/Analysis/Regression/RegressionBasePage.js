import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import styles from '../Analysis.sass';

import { createURL } from '../../../helpers/helpers.js';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';
import { selectDependentVariable, selectRegressionType } from '../../../actions/RegressionActions';

const dvToType = {
  q: 'linear',
  c: 'logistic',
  t: 'linear'
}
// this page finds a dependent variable id and regression type, if not supplied

export class RegressionBasePage extends Component {

  componentWillMount() {
    const { fieldProperties, params, replace, location, selectDependentVariable, selectRegressionType } = this.props;
    const { 'dependent-variable': queriedDependentVariable, 'regression-type': queriedRegressionType } = location.query;

    // if url specifies dependent variable and regression type
    if(queriedDependentVariable && queriedRegressionType) {
      selectDependentVariable(queriedDependentVariable);
      selectRegressionType(queriedRegressionType);
    }

    // if navigating to page within the app
    if(fieldProperties.items.length > 0 && !queriedDependentVariable) {
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c'));
      const dependentVariableId = dependentVariable.id;
      const regressionType = dvToType[dependentVariable.generalType];

      const params = { 'dependent-variable': dependentVariableId, 'regression-type': regressionType };
      const url  = createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, params);
      replace(url);
    }

    // if navigating to url /regression without query params
    if(fieldProperties.items.length === 0) {

    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectDependentVariable, fieldProperties, selectRegressionType, location, replace } = this.props;
    const { fieldProperties: nextFieldProperties, params: nextParams, replace: nextReplace, location: nextLocation } = nextProps;

    if (nextFieldProperties.items.length > 0 && nextFieldProperties.datasetId == nextParams.datasetId && !nextLocation.query['dependent-variable']) {
      const dependentVariable = (nextFieldProperties.items.find((property) => property.generalType == 'q') || nextFieldProperties.items.find((property) => property.generalType == 'c'));
      const dependentVariableId = dependentVariable.id;
      const regressionType = dvToType[dependentVariable.generalType];
      
      const params = { 'dependent-variable': dependentVariable, 'regression-type': regressionType };
      const url = createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, params);
      replace(url);
    }
  }

  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.regressionContainer }` }>
        <RegressionView />
        <RegressionSidebar />
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { fieldProperties } = state;
  return { fieldProperties };
}

export default connect(mapStateToProps, { replace, selectDependentVariable, selectRegressionType })(RegressionBasePage);
