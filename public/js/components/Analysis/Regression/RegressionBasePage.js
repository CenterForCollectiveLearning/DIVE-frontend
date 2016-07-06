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
      console.log('navigating in base page')
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c'));
      const dependentVariableId = dependentVariable.id;
      const regressionType = dvToType[dependentVariable.generalType];

      const queryParams = { 'dependent-variable': dependentVariableId, 'regression-type': regressionType };
      console.log(queryParams)
      const url  = createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, queryParams);
      replace(url);
    }

    // if navigating to url /regression without query params
    if(fieldProperties.items.length === 0) {

    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectDependentVariable, fieldProperties, selectRegressionType, location, replace } = this.props;
    const { query } = location;
    const { fieldProperties: nextFieldProperties, params: nextParams, replace: nextReplace, location: nextLocation } = nextProps;
    const { query: nextQuery } = nextLocation;

    // if there's no dependent variable, but there are field properties coming in
    if (nextFieldProperties.items.length > 0 && nextFieldProperties.datasetId == nextParams.datasetId && !nextQuery['dependent-variable']) {
      console.log('no dep var but field properties exist', nextFieldProperties.items);
      const dependentVariable = (nextFieldProperties.items.find((property) => property.generalType == 'q') || nextFieldProperties.items.find((property) => property.generalType == 'c'));
      const dependentVariableId = dependentVariable.id;
      const regressionType = dvToType[dependentVariable.generalType];
      
      const queryParams = { 'dependent-variable': dependentVariableId, 'regression-type': regressionType };
      const url = createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, queryParams);
      replace(url);
    }

    /** When queries update **/

    // Dependent variable change
    if(query['dependent-variable'] != nextQuery['dependent-variable'] && nextQuery['dependent-variable']) {
      console.log('new dependent-variable', nextQuery);
      selectDependentVariable(nextQuery['dependent-variable']);

      if(!nextQuery['regressionType']) {
        const regressionType = dvToType[nextFieldProperties.items.find((property) => property.id == nextQuery['dependent-variable']).generalType];
        const queryParams = { 'dependent-variable': nextQuery['dependent-variable'], 'regression-type': regressionType };
        const url = createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, queryParams);
        replace(url);
      }
    }

    // Regression type change
    if(query['regression-type'] != nextQuery['regression-type'] && nextQuery['regression-type']) {
      console.log('new regression');
      selectRegressionType(nextQuery['regression-type']);
    }

    // if 

    //if there was no regression type specified, and there were no field properties
    //wait for props to come in, then run regression
    // if(fieldProperties.items.length == 0 && nextProps.fieldProperties.items.length > 0) {
    //   console.log('ahhh')
    //   const dependentVariableType = nextProps.fieldProperties.items.find((property) => property.id == parseInt(location.query.dependentVariable)).generalType;
    //   const recommendedRegressionType = dvToType[dependentVariableType];
    //   replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression?dependentVariable=${ nextProps.location.query.dependentVariable }&reg=${ recommendedRegressionType }`);
    // }

    // //if new dependent variable selected, first figure out new regression type
    // if(location.query.dependentVariable != nextProps.location.query.dependentVariable) {
    //   console.log('ahhhhh')
    //   selectDependentVariable(nextProps.location.query.dependentVariable);
    //   const dependentVariableType = fieldProperties.items.find((property) => property.id == nextProps.location.query.dependentVariable).generalType;
    //   const recommendedRegressionType = dvToType[dependentVariableType];
    //   replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression?dependentVariable=${ nextProps.location.query.dependentVariable }&reg=${ recommendedRegressionType }`);
    // }
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
