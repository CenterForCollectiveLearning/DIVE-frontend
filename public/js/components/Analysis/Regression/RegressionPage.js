import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectDependentVariable, selectRegressionType } from '../../../actions/RegressionActions';

function dependentVariableToRegressionType(type) {
  const dvToType = {
    q: 'linear',
    c: 'logistic',
    t: 'linear'
  }
  return dvToType[type];
}

export class RegressionPage extends Component {
  componentWillMount() {
    const { selectDependentVariable, params, fieldProperties, selectRegressionType} = this.props;
    selectDependentVariable(params.dependentVariable);
    const dependentVariable = fieldProperties.items.filter((property) => property.id == params.dependentVariable)
    if(dependentVariable.length > 0) {
      selectRegressionType(dependentVariableToRegressionType(dependentVariable[0].generalType));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.dependentVariable != nextProps.params.dependentVariable) {
      this.props.selectDependentVariable(nextProps.params.dependentVariable);
      const dependentVariable = this.props.fieldProperties.items.filter((property) => property.id == nextProps.params.dependentVariable)
      this.props.selectRegressionType(dependentVariableToRegressionType(dependentVariable[0].generalType))
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

export default connect(mapStateToProps, { selectDependentVariable, selectRegressionType })(RegressionPage);
