import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from '../Analysis.sass';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runNumericalComparison, runAnova, getAnovaBoxplotData } from '../../../actions/ComparisonActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import Card from '../../Base/Card';
import StatsTable from './StatsTable';
import NumericalComparisonText from './NumericalComparisonText'
import AnovaTable from './AnovaTable';
import AnovaText from './AnovaText';

import HeaderBar from '../../Base/HeaderBar';
import RaisedButton from '../../Base/RaisedButton';
import DropDownMenu from '../../Base/DropDownMenu';

export class ComparisonView extends Component {

  componentWillMount() {
    const { projectId, datasets, datasetSelector, fetchDatasets } = this.props;

    if (projectId && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const {
      independentVariableNamesAndTypes,
      independentVariableNames,
      dependentVariableNames,
      runNumericalComparison,
      runAnova,
      getAnovaBoxplotData,
      canRunNumericalComparisonDependent,
      canRunNumericalComparisonIndependent
    } = this.props;

    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariablesChanged = nextProps.dependentVariableNames.length != dependentVariableNames.length;
    const sideBarChanged = independentVariablesChanged || dependentVariablesChanged
    const canRunAnova = nextProps.dependentVariableNames.length && nextProps.independentVariableNames.length

    if (nextProps.projectId && nextProps.datasetId && sideBarChanged) {
      if (nextProps.canRunNumericalComparisonIndependent) {
        runNumericalComparison(nextProps.projectId, nextProps.datasetId, nextProps.independentVariableNames, true);
      } else if (nextProps.canRunNumericalComparisonDependent) {
        runNumericalComparison(nextProps.projectId, nextProps.datasetId, nextProps.dependentVariableNames, false);
      } else if (canRunAnova) {
        runAnova(nextProps.projectId, nextProps.datasetId, nextProps.independentVariableNamesAndTypes, nextProps.dependentVariableNames);
        getAnovaBoxplotData(nextProps.projectId, nextProps.datasetId, nextProps.independentVariableNamesAndTypes, nextProps.dependentVariableNames);
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

  clickDataset(datasetId) {
    const { projectId, clearAnalysis, selectDataset, push } = this.props;
    clearAnalysis();
    selectDataset(projectId, datasetId);
    push(`/projects/${ projectId }/datasets/${ datasetId }/analyze/regression`);
  }

  render() {
    const { datasets, datasetId, numericalComparisonResult, independentVariableNames, dependentVariableNames, anovaResult, anovaBoxplotData, canRunNumericalComparisonDependent, canRunNumericalComparisonIndependent } = this.props;
    const atLeastTwoVariablesSelectedOfOneType = independentVariableNames.length >= 2 || dependentVariableNames.length >= 2;
    const anovaResultNotEmpty = anovaResult && anovaResult.stats && anovaResult.stats.length > 0;
    const anovaCanBeDisplayed = independentVariableNames.length && dependentVariableNames.length && anovaResultNotEmpty;
    const numericalComparisonResultNotEmpty = numericalComparisonResult && numericalComparisonResult.tests && numericalComparisonResult.tests.length > 0
    const canShowNumericalComparison = (canRunNumericalComparisonDependent || canRunNumericalComparisonIndependent) && numericalComparisonResultNotEmpty;

    let cardHeader;
    if (canShowNumericalComparison) {
      cardHeader = 'Numerical Comparison Statistics'
    } else if (anovaCanBeDisplayed) {
      cardHeader = `ANOVA Table Comparing ${ dependentVariableNames } by ${ independentVariableNames }`
    }

    var comparisonContent = <div></div>;

    if (canShowNumericalComparison) {
      comparisonContent =
        <div>
          <StatsTable numericalData={ numericalComparisonResult.tests } />
        </div>

    } else if (anovaCanBeDisplayed) {
      comparisonContent =
        <div>
          <AnovaTable anovaData={ anovaResult } />
          <AnovaText
            dependentVariableNames={ dependentVariableNames }
            independentVariableNames={ independentVariableNames }
            anovaData={ anovaResult }
          />
        </div>
    } else {
      comparisonContent =
      <div className={ styles.watermark }>
        Please Select Two or More Variables
      </div>
    }

    return (
      <div className={ styles.regressionViewContainer }>
        <HeaderBar
          header={ 'Comparison' }
          actions={
            <div className={ styles.headerControlRow }>
              <div className={ styles.headerControl }>
                { datasets.items && datasets.items.length > 0 ?
                  <div className={ styles.headerControl }>
                    <DropDownMenu
                      prefix="Dataset"
                      width={ 240 }
                      value={ parseInt(datasetId) }
                      options={ datasets.items }
                      valueMember="datasetId"
                      displayTextMember="title"
                      onChange={ this.clickDataset.bind(this) } />
                  </div>
              : '' }
            </div>
          </div>
        }/>
        <div className={ styles.aggregationViewContainer }>
          <Card header={ <span>{ cardHeader }</span> }>
            { comparisonContent }
          </Card>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets, comparisonSelector, datasetSelector, fieldProperties } = state;
  const { independentVariablesIds, numericalComparisonResult, anovaResult, anovaBoxplotData } = comparisonSelector;

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
    anovaBoxplotData: anovaBoxplotData
  };
}

export default connect(mapStateToProps, {
  runNumericalComparison,
  runAnova,
  getAnovaBoxplotData,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(ComparisonView);
