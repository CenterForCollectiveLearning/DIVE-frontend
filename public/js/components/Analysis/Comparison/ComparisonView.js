import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runMakeComparison } from '../../../actions/ComparisonActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

export class ComparisonView extends Component {
  componentWillReceiveProps(nextProps) {
    const { comparisonVariableNames, aggregationVariableName, aggregationFunction, runMakeComparison} = this.props;
    const comparisonVariablesChanged = nextProps.comparisonVariableNames.length != comparisonVariableNames.length;
    const aggregationVariableChanged = nextProps.aggregationVariableName != aggregationVariableName;

    if (nextProps.projectId && nextProps.datasetId && (aggregationVariableChanged || comparisonVariablesChanged) && (nextProps.comparisonVariableNames.length == 2)) {
      const aggregationList = nextProps.aggregationVariableName? [nextProps.aggregationVariableName, aggregationFunction] : null
      runMakeComparison(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.comparisonVariableNames);
    }

  }
  render() {
    const { comparisonResult, comparisonVariableNames} = this.props;

    if (!(comparisonVariableNames.length == 2) || !(comparisonResult.result) || !(comparisonResult.result.row) || comparisonResult.result.row.length == 0) {
      return (
        <div></div>
      );
    }

    return (
      <div className={ styles.comparisonViewContainer }>
        <Card>
          <HeaderBar header={ <span>Comparison Tables</span> } />
          {this.props.comparisonResult}
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, comparisonSelector, datasetSelector, fieldProperties } = state;
  const { comparisonResult } = comparisonSelector;

  const aggregationVariable = fieldProperties.items.find((property) => property.id == comparisonSelector.aggregationVariableId);
  const aggregationVariableName = aggregationVariable ? aggregationVariable.name : null;

  const comparisonVariableNames = fieldProperties.items
    .filter((property) => comparisonSelector.comparisonVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    comparisonResult: comparisonResult,
    aggregationVariableName: aggregationVariableName,
    aggregationFunction: comparisonSelector.aggregationFunction,
    comparisonVariableNames: comparisonVariableNames
  };
}

export default connect(mapStateToProps, { runMakeComparison})(ComparisonView);
