import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runRegression } from '../../actions/RegressionActions';

import styles from './Analysis.sass';

export class RegressionView extends Component {

  componentWillReceiveProps(nextProps) {
    const { dependentVariableName, runRegression } = this.props;

    if (nextProps.projectId && nextProps.datasetId && (nextProps.dependentVariableName != dependentVariableName)) {
      runRegression(nextProps.projectId, nextProps.datasetId, nextProps.dependentVariableName);
    }
  }

  render() {
    return (
      <div className={ styles.regressionViewContainer }>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, regressionSelector, datasetSelector, fieldProperties } = state;
  const dependentVariable = fieldProperties.items.find((property) => property.id == regressionSelector.dependentVariableId);
  const dependentVariableName = dependentVariable ? dependentVariable.name : null;
  return {
    projectId: project.properties.id,
    dependentVariableName: dependentVariableName,
    datasetId: datasetSelector.datasetId
  };
}

export default connect(mapStateToProps, { runRegression })(RegressionView);
