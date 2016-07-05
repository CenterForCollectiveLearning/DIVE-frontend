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
    const { selectDependentVariable, selectRegressionType, params, location } = this.props;
    const regressionType = location.query.reg;

    selectDependentVariable(params.dependentVariable);

    if(regressionType) {
      selectRegressionType(regressionType);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectDependentVariable, fieldProperties, selectRegressionType, location, replace } = this.props;

    //if new type of regression selected, run that regression
    if(location.query.reg != nextProps.location.query.reg && nextProps.location.query.reg) {
      console.log('new regressiontype', nextProps.location.query.reg)
      selectRegressionType(nextProps.location.query.reg);
    }

    //if new dependent variable selected, push to new link
    if(params.dependentVariable != nextProps.params.dependentVariable) {
      selectDependentVariable(nextProps.params.dependentVariable);
      
      const dependentVariableType = fieldProperties.items.find((property) => property.id == nextProps.params.dependentVariable).generalType;
      const recommendedRegressionType = dvToType[dependentVariableType];

      replace(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression/${ nextProps.params.dependentVariable }?reg=${ recommendedRegressionType }`)
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
