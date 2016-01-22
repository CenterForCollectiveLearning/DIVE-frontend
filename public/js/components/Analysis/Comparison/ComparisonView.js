import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from '../Analysis.sass';

export class ComparisonView extends Component {

  componentWillReceiveProps(nextProps) {
    const { comparisonVariableNames } = this.props;
    const comparisonVariablesChanged = nextProps.comparisonVariableNames.length != comparisonVariableNames.length;
  }

  render() {
    return (
      <div></div>
    );
  }
}

function mapStateToProps(state) {
  const { project, comparisonSelector, datasetSelector, fieldProperties } = state;
  const { comparisonVariablesIds } = comparisonSelector;

  const comparisonVariableNames = fieldProperties.items
    .filter((property) => comparisonSelector.comparisonVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    comparisonVariableNames: comparisonVariableNames
  };
}

export default connect(mapStateToProps, { })(ComparisonView);
