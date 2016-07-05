import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { selectDependentVariable, selectRegressionType } from '../../../actions/RegressionActions';

const dvToType = {
  q: 'linear',
  c: 'logistic',
  t: 'linear'
}

// this page runs regressions according to the dependent variable and type of regression

export class RegressionPage extends Component {
  componentWillMount() {
    const { selectDependentVariable, selectRegressionType, fieldProperties, params, location, replace } = this.props;

    selectDependentVariable(params.dependentVariable);

    if(location.query.reg) { //if the link specifies the regression type, run it
      selectRegressionType(location.query.reg);
    } else if(fieldProperties.items.length > 0) { //if there's no regression type but there are field properties
      const dependentVariableType = fieldProperties.items.find((property) => property.id == params.dependentVariable).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType]
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ params.dependentVariable }?reg=${ recommendedRegressionType }`);
    } 
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectDependentVariable, fieldProperties, selectRegressionType, location, replace } = this.props;

    //if new type of regression selected, run that regression
    if(location.query.reg != nextProps.location.query.reg && nextProps.location.query.reg) {
      selectRegressionType(nextProps.location.query.reg);
    }

    //if there was no regression type specified, and there were no field properties
    //wait for props to come in, then run regression
    if(fieldProperties.items.length == 0 && nextProps.fieldProperties.items.length > 0) {
      const dependentVariableType = nextProps.fieldProperties.items.find((property) => property.id == parseInt(params.dependentVariable)).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType];
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ nextProps.params.dependentVariable }?reg=${ recommendedRegressionType }`);
    }

    //if new dependent variable selected, figure out new regression type
    if(params.dependentVariable != nextProps.params.dependentVariable) {
      selectDependentVariable(nextProps.params.dependentVariable);
      const dependentVariableType = fieldProperties.items.find((property) => property.id == nextProps.params.dependentVariable).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType];
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ nextProps.params.dependentVariable }?reg=${ recommendedRegressionType }`);
    }
  }

  render() { return (<div></div>) }
}

function mapStateToProps(state) {
  const { fieldProperties } = state;
  return {
    fieldProperties
  };
}

export default connect(mapStateToProps, { selectDependentVariable, selectRegressionType, replace })(RegressionPage);
