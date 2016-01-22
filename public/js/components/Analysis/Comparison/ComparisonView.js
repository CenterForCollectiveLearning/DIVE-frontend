import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from '../Analysis.sass';

import { runNumericalComparison } from '../../../actions/ComparisonActions';
import Card from '../../Base/Card';
import StatsTable from './StatsTable';
import HeaderBar from '../../Base/HeaderBar';

export class ComparisonView extends Component {

  componentWillReceiveProps(nextProps) {
    const { comparisonVariableNames, runNumericalComparison } = this.props;
    const comparisonVariablesChanged = nextProps.comparisonVariableNames.length != comparisonVariableNames.length;

    if (nextProps.projectId && nextProps.datasetId && (nextProps.comparisonVariableNames.length >= 2) && comparisonVariablesChanged) {
      runNumericalComparison(nextProps.projectId, nextProps.datasetId, nextProps.comparisonVariableNames, true);
    }
  }

  render() {
    const { numericalComparisonResult, comparisonVariableNames } = this.props;
    const atLeastTwoVariablesSelected = comparisonVariableNames.length >= 2
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
  const { comparisonVariablesIds, numericalComparisonResult } = comparisonSelector;

  const comparisonVariableNames = fieldProperties.items
    .filter((property) => comparisonSelector.comparisonVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    comparisonVariableNames: comparisonVariableNames,
    numericalComparisonResult: numericalComparisonResult
  };
}

export default connect(mapStateToProps, { runNumericalComparison })(ComparisonView);
