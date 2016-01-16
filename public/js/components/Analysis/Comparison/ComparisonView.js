import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runMakeComparison } from '../../../actions/ComparisonActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import ComparisonTable from './ComparisonTable';

export class ComparisonView extends Component {
  componentWillReceiveProps(nextProps) {
    const { comparisonVariableNames, aggregationVariableName, aggregationFunction, weightVariableName, runMakeComparison} = this.props;
    const comparisonVariablesChanged = nextProps.comparisonVariableNames.length != comparisonVariableNames.length;
    const aggregationVariableChanged = nextProps.aggregationVariableName != aggregationVariableName;
    const aggregationFunctionChanged = nextProps.aggregationFunction != aggregationFunction;
    const weightVariableChanged = nextProps.weightVariableName != weightVariableName;

    if (nextProps.projectId && nextProps.datasetId && (aggregationVariableChanged || comparisonVariablesChanged || aggregationFunctionChanged || weightVariableChanged) && (nextProps.comparisonVariableNames.length == 2)) {
      const aggregationList = nextProps.aggregationVariableName? [nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null
      runMakeComparison(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.comparisonVariableNames);
    }

  }
  render() {
    const { comparisonResult, comparisonVariableNames} = this.props;

    if (!(comparisonVariableNames.length == 2) || !comparisonResult || !(comparisonResult.rows) || comparisonResult.rows.length == 0) {
      return (
        <div></div>
      );
    }

    return (
      <div className={ styles.comparisonViewContainer }>
        <Card>
          <HeaderBar header={ <span>Comparison Table</span> } />
          <ComparisonTable comparisonResult={ comparisonResult }/>
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

  const weightVariable = fieldProperties.items.find((property) => property.id == comparisonSelector.weightVariableId);
  const weightVariableName = weightVariable ? weightVariable.name : 'UNIFORM';


  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    comparisonResult: comparisonResult,
    aggregationVariableName: aggregationVariableName,
    aggregationFunction: comparisonSelector.aggregationFunction,
    weightVariableName: weightVariableName,
    comparisonVariableNames: comparisonVariableNames
  };
}

export default connect(mapStateToProps, { runMakeComparison})(ComparisonView);
