import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from '../Analysis.sass';

import { runNumericalComparison, runAnova } from '../../../actions/ComparisonActions';
import Card from '../../Base/Card';
import StatsTable from './StatsTable';
import HeaderBar from '../../Base/HeaderBar';

export class ComparisonView extends Component {

  componentWillReceiveProps(nextProps) {
    const { independentVariableNames, dependentVariableNames, runNumericalComparison, canRunNumericalComparisonDependent, canRunNumericalComparisonIndependent } = this.props;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariablesChanged = nextProps.dependentVariableNames.length != dependentVariableNames.length;
    const sideBarChanged = independentVariablesChanged || dependentVariablesChanged

    if (nextProps.projectId && nextProps.datasetId && sideBarChanged) {
      if (nextProps.canRunNumericalComparisonIndependent){
        runNumericalComparison(nextProps.projectId, nextProps.datasetId, nextProps.independentVariableNames, true);
      } else if (nextProps.canRunNumericalComparisonDependent){
        runNumericalComparison(nextProps.projectId, nextProps.datasetId, nextProps.dependentVariableNames, false);
      }
    }
  }

  render() {
    const { numericalComparisonResult, independentVariableNames, dependentVariableNames } = this.props;
    const atLeastTwoVariablesSelected = independentVariableNames.length >= 2 || dependentVariableNames.length >= 2
    const numericalComparisonResultNotEmpty = numericalComparisonResult && numericalComparisonResult.tests && numericalComparisonResult.tests.length > 0
    if (atLeastTwoVariablesSelected && numericalComparisonResultNotEmpty) {
      return (
        <div className={ styles.summaryViewContainer }>
          <Card>
            <HeaderBar header={ <span>Statistics Table</span> } />
            <StatsTable numericalData={ numericalComparisonResult.tests } />
          </Card>
        </div>
      );
    }

    return (
      <div> </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, comparisonSelector, datasetSelector, fieldProperties } = state;
  const { independentVariablesIds, numericalComparisonResult } = comparisonSelector;

  const independentVariableNames = fieldProperties.items
    .filter((property) => comparisonSelector.independentVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);



  const dependentVariableNames = fieldProperties.items
    .filter((property) => comparisonSelector.dependentVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  const canRunNumericalComparisonIndependent = (fieldProperties.items
    .filter((property) => comparisonSelector.independentVariablesIds.indexOf(property.id) >= 0 && property.generalType == 'q')
    .length == independentVariableNames.length) && dependentVariableNames.length == 0 && independentVariableNames.length >= 2;

  const canRunNumericalComparisonDependent = (fieldProperties.items
    .filter((property) => comparisonSelector.dependentVariablesIds.indexOf(property.id) >= 0 && property.generalType == 'q')
    .length == dependentVariableNames.length) && independentVariableNames.length == 0 && dependentVariableNames.length >= 2;

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    canRunNumericalComparisonIndependent: canRunNumericalComparisonIndependent,
    canRunNumericalComparisonDependent: canRunNumericalComparisonDependent,
    independentVariableNames: independentVariableNames,
    dependentVariableNames: dependentVariableNames,
    numericalComparisonResult: numericalComparisonResult
  };
}

export default connect(mapStateToProps, { runNumericalComparison, runAnova })(ComparisonView);
