import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from '../Analysis.sass';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runNumericalComparison, runAnova, getAnovaBoxplotData, getPairwiseComparisonData } from '../../../actions/ComparisonActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import Card from '../../Base/Card';
import StatsTable from './StatsTable';
import NumericalComparisonText from './NumericalComparisonText'
import AnovaTable from './AnovaTable';
import AnovaText from './AnovaText';
import PairwiseComparisonCard from './PairwiseComparisonCard';
import AnovaBoxplotCard from './AnovaBoxplotCard';

import HeaderBar from '../../Base/HeaderBar';
import RaisedButton from '../../Base/RaisedButton';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';

export class ComparisonView extends Component {

  componentWillMount() {
    const {
      projectId,
      datasets,
      datasetId,
      fetchDatasets,
      independentVariableNamesAndTypes,
      independentVariableNames,
      dependentVariableNames,
      runNumericalComparison,
      runAnova,
      getAnovaBoxplotData,
      canRunNumericalComparisonDependent,
      canRunNumericalComparisonIndependent,
      conditionals
    } = this.props;

    const canRunAnova = dependentVariableNames.length && independentVariableNames.length;

    if (projectId && (!datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    if (projectId && datasetId) {
      if (canRunNumericalComparisonIndependent) {
        runNumericalComparison(projectId, datasetId, independentVariableNames, true, conditionals.items);
      } else if (canRunNumericalComparisonDependent) {
        runNumericalComparison(projectId, datasetId, dependentVariableNames, false, conditionals.items);
      } else if (canRunAnova) {
        runAnova(projectId, datasetId, independentVariableNamesAndTypes, dependentVariableNames, conditionals.items);
        getAnovaBoxplotData(projectId, datasetId, independentVariableNamesAndTypes, dependentVariableNames, conditionals.items);
        getPairwiseComparisonData(projectId, datasetId, independentVariableNamesAndTypes, dependentVariableNames, conditionals.items);
      }
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const {
      conditionals,
      independentVariableNamesAndTypes,
      independentVariableNames,
      dependentVariableNames,
      runNumericalComparison,
      runAnova,
      getAnovaBoxplotData,
      getPairwiseComparisonData,
      canRunNumericalComparisonDependent,
      canRunNumericalComparisonIndependent
    } = this.props;

    const {
      projectId: nextProjectId,
      datasetId: nextDatasetId,
      conditionals: nextConditionals,
      independentVariableNames: nextIndependentVariableNames,
      dependentVariableNames: nextDependentVariableNames,
      independentVariableNamesAndTypes: nextIndependentVariableNamesAndTypes
    } = nextProps;

    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const independentVariablesChanged = nextIndependentVariableNames.length != independentVariableNames.length;
    const dependentVariablesChanged = nextDependentVariableNames.length != dependentVariableNames.length;
    const sideBarChanged = independentVariablesChanged || dependentVariablesChanged || conditionalsChanged;
    const canRunAnova = nextDependentVariableNames.length && nextIndependentVariableNames.length

    if (nextProjectId && nextDatasetId && sideBarChanged) {
      if (nextProps.canRunNumericalComparisonIndependent) {
        runNumericalComparison(nextProjectId, nextDatasetId, nextIndependentVariableNames, true, nextConditionals.items);
      } else if (nextProps.canRunNumericalComparisonDependent) {
        runNumericalComparison(nextProjectId, nextDatasetId, nextDependentVariableNames, false, nextConditionals.items);
      } else if (canRunAnova) {
        runAnova(nextProjectId, nextDatasetId, nextIndependentVariableNamesAndTypes, nextDependentVariableNames, nextConditionals.items);
        getAnovaBoxplotData(nextProjectId, nextDatasetId, nextIndependentVariableNamesAndTypes, nextDependentVariableNames, nextConditionals.items);
        getPairwiseComparisonData(nextProjectId, nextDatasetId, nextIndependentVariableNamesAndTypes, nextDependentVariableNames, nextConditionals.items);
      }
    }
  }

  componentDidUpdate(previousProps) {
    const { projectId, datasetId, datasets, fetchDatasets } = this.props
    const projectChanged = (previousProps.projectId !== projectId);
    const datasetChanged = (previousProps.datasetId !== datasetId);

    if (projectChanged || (projectId && (!datasetId || (!datasets.isFetching && !datasets.loaded)))) {
      fetchDatasets(projectId);
    }
  }

  render() {
    const { datasets, datasetId, fieldNameToColor, numericalComparisonResult, independentVariableNames, dependentVariableNames, anovaResult, anovaBoxplotData, pairwiseComparisonData, canRunNumericalComparisonDependent, canRunNumericalComparisonIndependent } = this.props;
    const atLeastTwoVariablesSelectedOfOneType = independentVariableNames.length >= 2 || dependentVariableNames.length >= 2;
    const anovaResultNotEmpty = anovaResult && anovaResult.stats && anovaResult.stats.length > 0;
    const anovaCanBeDisplayed = independentVariableNames.length && dependentVariableNames.length && anovaResultNotEmpty;
    const numericalComparisonResultNotEmpty = numericalComparisonResult && numericalComparisonResult.tests && numericalComparisonResult.tests.length > 0
    const canShowNumericalComparison = (canRunNumericalComparisonDependent || canRunNumericalComparisonIndependent) && numericalComparisonResultNotEmpty;

    let cardHeader;
    if (canShowNumericalComparison) {
      const numericalComparisonFields = canRunNumericalComparisonIndependent ? independentVariableNames : dependentVariableNames;
      cardHeader = <span>Comparing Distributions of <ColoredFieldItems fields={ numericalComparisonFields } /></span>
    } else if (anovaCanBeDisplayed) {
      cardHeader = <span>ANOVA Table Comparing <ColoredFieldItems fields={ independentVariableNames } /> by <ColoredFieldItems fields={ dependentVariableNames } /></span>
    }

    var comparisonContent = <div></div>;

    if (canShowNumericalComparison) {
      comparisonContent =
        <Card header={ <span>{ cardHeader }</span> }>
          <StatsTable numericalData={ numericalComparisonResult.tests } />
        </Card>

    } else if (anovaCanBeDisplayed) {
      comparisonContent =
        <div>
          <Card header={ <span>{ cardHeader }</span> }>
            <AnovaTable anovaData={ anovaResult } />
            <AnovaText
              dependentVariableNames={ dependentVariableNames }
              independentVariableNames={ independentVariableNames }
              anovaData={ anovaResult }
            />
          </Card>
          { pairwiseComparisonData.rows && pairwiseComparisonData.rows.length > 0 &&
            <PairwiseComparisonCard
              pairwiseComparisonData={ pairwiseComparisonData }
            />
          }
          { anovaBoxplotData.length > 0 &&
            <AnovaBoxplotCard
              anovaBoxplotData={ anovaBoxplotData }
            />
          }
        </div>
      } else {
      comparisonContent =
      <div className={ styles.watermark }>
        Please Select Two or More Variables
      </div>
    }

    return (
      <div className={ styles.analysisViewContainer }>
        { comparisonContent }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets, comparisonSelector, datasetSelector, fieldProperties, conditionals } = state;
  const { independentVariablesIds, numericalComparisonResult, anovaResult, anovaBoxplotData, pairwiseComparisonData } = comparisonSelector;

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
    datasets: datasets,
    datasetSelector: datasetSelector,
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    canRunNumericalComparisonIndependent: canRunNumericalComparisonIndependent,
    canRunNumericalComparisonDependent: canRunNumericalComparisonDependent,
    independentVariableNames: independentVariableNames,
    independentVariableNamesAndTypes: independentVariableNamesAndTypes,
    dependentVariableNames: dependentVariableNames,
    numericalComparisonResult: numericalComparisonResult,
    anovaResult: anovaResult,
    anovaBoxplotData: anovaBoxplotData,
    pairwiseComparisonData: pairwiseComparisonData,
    conditionals: conditionals
  };
}

export default connect(mapStateToProps, {
  runNumericalComparison,
  runAnova,
  getAnovaBoxplotData,
  getPairwiseComparisonData,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(ComparisonView);
