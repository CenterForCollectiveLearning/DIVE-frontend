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

    console.log('in regressionPage', location.query.dependentVariable)
    selectDependentVariable(location.query.dependentVariable);

    if(location.query.regressionType) { //if the link specifies the regression type, run it
      selectRegressionType(location.query.regressionType);
    } else if(fieldProperties.items.length > 0) { //if there's no regression type but there are field properties
      const dependentVariableType = fieldProperties.items.find((property) => property.id == location.query.dependentVariable).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType]
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression?dependentVariable=${ location.query.dependentVariable }&reg=${ recommendedRegressionType }`);
    } 
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectDependentVariable, fieldProperties, selectRegressionType, location, replace } = this.props;

    //if new type of regression selected, run that regression
    if(location.query.regressionType != nextProps.location.query.regressionType && nextProps.location.query.regressionType) {
      console.log('ahh')
      selectRegressionType(nextProps.location.query.regressionType);
    }

    //if there was no regression type specified, and there were no field properties
    //wait for props to come in, then run regression
    if(fieldProperties.items.length == 0 && nextProps.fieldProperties.items.length > 0) {
      console.log('ahhh')
      const dependentVariableType = nextProps.fieldProperties.items.find((property) => property.id == parseInt(location.query.dependentVariable)).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType];
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression?dependentVariable=${ nextProps.location.query.dependentVariable }&reg=${ recommendedRegressionType }`);
    }

    //if new dependent variable selected, first figure out new regression type
    if(location.query.dependentVariable != nextProps.location.query.dependentVariable) {
      console.log('ahhhhh')
      selectDependentVariable(nextProps.location.query.dependentVariable);
      const dependentVariableType = fieldProperties.items.find((property) => property.id == nextProps.location.query.dependentVariable).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType];
      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression?dependentVariable=${ nextProps.location.query.dependentVariable }&reg=${ recommendedRegressionType }`);
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
