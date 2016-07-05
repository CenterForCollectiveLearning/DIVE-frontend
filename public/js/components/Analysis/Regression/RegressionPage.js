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
    const { selectDependentVariable, selectRegressionType, fieldProperties, params, location } = this.props;

    selectDependentVariable(params.dependentVariable);

    if(location.query.reg) { //if the link specifies the regression type, run it
      console.log('if the link specifies the regression type, run it')
      selectRegressionType(location.query.reg);
    } else if(fieldProperties.items.length > 0) { //if there's no regression type but there are field properties
      const dependentVariable = fieldProperties.items.find((property) => property.id == params.dependentVariable);
      console.log(dependentVariable, 'if theres no regression type but there are field properties');
      selectRegressionType(dvToType[dependentVariable.generalType]);
    } 
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectDependentVariable, fieldProperties, selectRegressionType, location, replace } = this.props;

    //if new type of regression selected, run that regression
    if(location.query.reg != nextProps.location.query.reg && nextProps.location.query.reg) {
      console.log('query updated');
      selectRegressionType(nextProps.location.query.reg);
    }

    //if there was no regression type specified, and there were no field properties
    //wait for props to come in, then run regression
    if(fieldProperties.items.length == 0 && nextProps.fieldProperties.items.length > 0) {
      console.log('getting field properties', params, nextProps.fieldProperties, params.dependentVariable);
      const dependentVariableType = nextProps.fieldProperties.items.find((property) => property.id == parseInt(params.dependentVariable)).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType];
      console.log('test', dependentVariableType, recommendedRegressionType)
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ nextProps.params.dependentVariable }?reg=${ recommendedRegressionType }`);
    }

    //if new dependent variable selected, figure out new regression type
    if(params.dependentVariable != nextProps.params.dependentVariable) {
      console.log('new dependentVariable')
      selectDependentVariable(nextProps.params.dependentVariable);
      const dependentVariableType = fieldProperties.items.find((property) => property.id == nextProps.params.dependentVariable).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType];
      console.log(dependentVariableType, recommendedRegressionType)
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
