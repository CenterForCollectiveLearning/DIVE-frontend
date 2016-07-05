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
    const { selectDependentVariable, selectRegressionType, params, location } = this.props;
    const regressionType = location.query.reg;

    selectDependentVariable(params.dependentVariable);

    if(regressionType) {
      selectRegressionType(regressionType)
    }
  }

  componentDidMount() {
    const { selectDependentVariable, params, fieldProperties, selectRegressionType} = this.props;

    const dependentVariable = fieldProperties.items.filter((property) => property.id == params.dependentVariable)

    if(dependentVariable.length > 0) {
      selectRegressionType(dependentVariableToRegressionType(dependentVariable[0].generalType));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectDependentVariable, fieldProperties, selectRegressionType } = this.props;

    if (params.dependentVariable != nextProps.params.dependentVariable) {
      selectDependentVariable(nextProps.params.dependentVariable);
      const dependentVariable = fieldProperties.items.filter((property) => property.id == nextProps.params.dependentVariable)
      selectRegressionType(dependentVariableToRegressionType(dependentVariable[0].generalType))
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
