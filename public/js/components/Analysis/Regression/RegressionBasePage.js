import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import styles from '../Analysis.sass';

import { createURL, recommendRegressionType } from '../../../helpers/helpers.js';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';
import { selectDependentVariable, selectRegressionType } from '../../../actions/RegressionActions';

export class RegressionBasePage extends Component {

  componentWillMount() {
    const { fieldProperties, params, replace, location, selectDependentVariable, selectRegressionType } = this.props;
    const { 'dependent-variable': queriedDependentVariable, 'regression-type': queriedRegressionType } = location.query;

    // URL specifies dependent variable and regression type
    if(queriedDependentVariable && queriedRegressionType) {
      selectDependentVariable(queriedDependentVariable);
      selectRegressionType(queriedRegressionType);
    }

    // Navigate to regression page within the app
    if(fieldProperties.items.length > 0 && !queriedDependentVariable) {
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c'));

      const queryParams = { 'dependent-variable': dependentVariable.id, 'regression-type': recommendRegressionType(dependentVariable.generalType) };
      const url  = createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, queryParams);
      replace(url);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectDependentVariable, fieldProperties, selectRegressionType, location, replace } = this.props;
    const { query } = location;
    const { fieldProperties: nextFieldProperties, params: nextParams, replace: nextReplace, location: nextLocation } = nextProps;
    const { query: nextQuery } = nextLocation;

    // No dependent variable, but there are field properties coming in
    if (nextFieldProperties.items.length > 0 && nextFieldProperties.datasetId == nextParams.datasetId && !nextQuery['dependent-variable']) {
      const dependentVariable = (nextFieldProperties.items.find((property) => property.generalType == 'q') || nextFieldProperties.items.find((property) => property.generalType == 'c'));
      
      const queryParams = { 'dependent-variable': dependentVariable.id, 'regression-type': recommendRegressionType(dependentVariable.generalType) };
      const url = createURL(`/projects/${ nextParams.projectId }/datasets/${ nextParams.datasetId }/analyze/regression`, queryParams);
      replace(url);
    }

    // Dependent variable change
    if(query['dependent-variable'] != nextQuery['dependent-variable'] && nextQuery['dependent-variable']) {
      selectDependentVariable(nextQuery['dependent-variable']);

      if(!nextQuery['regressionType']) {
        const regressionType = recommendRegressionType(nextFieldProperties.items.find((property) => property.id == nextQuery['dependent-variable']).generalType);
        
        const queryParams = { 'dependent-variable': nextQuery['dependent-variable'], 'regression-type': regressionType };
        const url = createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, queryParams);
        replace(url);
      }
    }

    // Regression type change
    if(query['regression-type'] != nextQuery['regression-type'] && nextQuery['regression-type']) {
      selectRegressionType(nextQuery['regression-type']);
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
