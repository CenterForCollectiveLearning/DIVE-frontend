import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from '../Analysis.sass';

import { runNumericalComparison, runAnova } from '../../../actions/ComparisonActions';
import Card from '../../Base/Card';
import StatsTable from './StatsTable';
import AnovaTable from './AnovaTable';
import HeaderBar from '../../Base/HeaderBar';

export class ComparisonView extends Component {

  componentWillReceiveProps(nextProps) {
    const { independentVariableNamesAndTypes, independentVariableNames, dependentVariableNames, runNumericalComparison, runAnova, canRunNumericalComparisonDependent, canRunNumericalComparisonIndependent } = this.props;

    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariablesChanged = nextProps.dependentVariableNames.length != dependentVariableNames.length;
    const sideBarChanged = independentVariablesChanged || dependentVariablesChanged
    const canRunAnova = nextProps.dependentVariableNames.length && nextProps.independentVariableNames.length

    if (nextProps.projectId && nextProps.datasetId && sideBarChanged) {
      if (nextProps.canRunNumericalComparisonIndependent){
        runNumericalComparison(nextProps.projectId, nextProps.datasetId, nextProps.independentVariableNames, true);
      } else if (nextProps.canRunNumericalComparisonDependent){
        runNumericalComparison(nextProps.projectId, nextProps.datasetId, nextProps.dependentVariableNames, false);
      } else if (canRunAnova){
        runAnova(nextProps.projectId, nextProps.datasetId, nextProps.independentVariableNamesAndTypes, nextProps.dependentVariableNames);
      }
    }
  }

  render() {
    const { numericalComparisonResult, independentVariableNames, dependentVariableNames, anovaResult, canRunNumericalComparisonDependent, canRunNumericalComparisonIndependent } = this.props;
    const atLeastTwoVariablesSelectedOfOneType = independentVariableNames.length >= 2 || dependentVariableNames.length >= 2;
    const anovaResultNotEmpty = anovaResult && anovaResult.stats && anovaResult.stats.length > 0;
    const anovaCanBeDisplayed = independentVariableNames.length && dependentVariableNames.length && anovaResultNotEmpty;
    const numericalComparisonResultNotEmpty = numericalComparisonResult && numericalComparisonResult.length > 0

    if ((canRunNumericalComparisonDependent || canRunNumericalComparisonIndependent) && numericalComparisonResultNotEmpty) {
      console.log('SHOULD BE DISPLAYING STUFF');
      return (
        <div className={ styles.aggregationViewContainer }>
          <Card>
            <HeaderBar header={ <span>Statistics Table</span> } />
            <StatsTable numericalData={ numericalComparisonResult } />
          </Card>
        </div>
      );
    }

    else if (anovaCanBeDisplayed) {
      return (
        <div className={ styles.aggregationViewContainer }>
          <Card>
            <HeaderBar header={ <span>Anova Table</span> } />
            <AnovaTable anovaData={ anovaResult } />
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
  const { independentVariablesIds, numericalComparisonResult, anovaResult } = comparisonSelector;

  const independentVariableNames = fieldProperties.items
    .filter((property) => comparisonSelector.independentVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  const independentVariableNamesAndTypes = fieldProperties.items
    .filter((property) => comparisonSelector.independentVariablesIds.indexOf(property.id) >= 0)
    .map((field) => [field.generalType, field.name, 0]);

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
    independentVariableNamesAndTypes: independentVariableNamesAndTypes,
    dependentVariableNames: dependentVariableNames,
    numericalComparisonResult: numericalComparisonResult,
    anovaResult: anovaResult
  };
}

export default connect(mapStateToProps, { runNumericalComparison, runAnova })(ComparisonView);
