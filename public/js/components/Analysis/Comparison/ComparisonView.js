import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runMakeComparison, runMakeComparisonOneDimensional } from '../../../actions/ComparisonActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import ComparisonTable from './ComparisonTable';
import ComparisonTableOneD from './ComparisonTableOneD';

export class ComparisonView extends Component {
  componentWillReceiveProps(nextProps) {
    const { comparisonVariableNames, aggregationVariableName, aggregationFunction, weightVariableName, runMakeComparison, runMakeComparisonOneDimensional} = this.props;
    const comparisonVariablesChanged = nextProps.comparisonVariableNames.length != comparisonVariableNames.length;
    const aggregationVariableChanged = nextProps.aggregationVariableName != aggregationVariableName;
    const aggregationFunctionChanged = nextProps.aggregationFunction != aggregationFunction;
    const weightVariableChanged = nextProps.weightVariableName != weightVariableName;
    const sideBarChanged = comparisonVariablesChanged || aggregationVariableChanged || aggregationFunctionChanged || weightVariableChanged
    const oneComparisonVariableSelected = nextProps.comparisonVariableNames.length == 1
    const twoComparisonVariablesSelected = nextProps.comparisonVariableNames.length == 2

    if (nextProps.projectId && nextProps.datasetId && sideBarChanged && oneComparisonVariableSelected) {
      const aggregationList = nextProps.aggregationVariableName? ['q', nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null
      runMakeComparisonOneDimensional(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.comparisonVariableNames);

    }

    else if (nextProps.projectId && nextProps.datasetId && sideBarChanged && twoComparisonVariablesSelected) {
      const aggregationList = nextProps.aggregationVariableName? ['q', nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null
      runMakeComparison(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.comparisonVariableNames);
    }

  }
  render() {
    const { comparisonResult, comparisonVariableNames, oneDimensionComparisonResult} = this.props;
    const oneComparisonVariableSelected =comparisonVariableNames.length == 1
    const twoComparisonVariablesSelected = comparisonVariableNames.length == 2
    const oneDimensionDictHasElements = oneDimensionComparisonResult && oneDimensionComparisonResult.rows && oneDimensionComparisonResult.rows.length > 0
    const contingencyDictHasElements = comparisonResult && comparisonResult.rows && comparisonResult.rows.length > 0

    if (oneComparisonVariableSelected && oneDimensionDictHasElements) {
      return (
        <div className={ styles.comparisonViewContainer }>
          <Card>
            <HeaderBar header={ <span>Comparison Table</span> } />
            <ComparisonTableOneD comparisonResult={ oneDimensionComparisonResult } comparisonVariableNames={ comparisonVariableNames }/>
          </Card>
        </div>
      );
    }

    else if (twoComparisonVariablesSelected && contingencyDictHasElements) {
      return (
        <div className={ styles.comparisonViewContainer }>
          <Card>
            <HeaderBar header={ <span>Comparison Table</span> } />
            <ComparisonTable comparisonResult={ comparisonResult } comparisonVariableNames={ comparisonVariableNames }/>
          </Card>
        </div>
      );
    }
    return (
      <div></div>
    );


  }
}

function mapStateToProps(state) {
  const { project, comparisonSelector, datasetSelector, fieldProperties } = state;
  const { comparisonResult, oneDimensionComparisonResult} = comparisonSelector;

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
    comparisonVariableNames: comparisonVariableNames,
    oneDimensionComparisonResult: oneDimensionComparisonResult
  };
}

export default connect(mapStateToProps, { runMakeComparison, runMakeComparisonOneDimensional })(ComparisonView);
