import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectDependentVariable, selectRegressionType } from '../../../actions/RegressionActions';

export class RegressionPage extends Component {
  componentWillMount() {
    this.props.selectDependentVariable(this.props.params.dependentVariable);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.dependentVariable != nextProps.params.dependentVariable) {
      this.props.selectDependentVariable(nextProps.params.dependentVariable);
    }
  }

  render() { return (<div></div>) }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { selectDependentVariable })(RegressionPage);
