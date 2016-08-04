import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from '../Analysis.sass';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runNumericalComparison, runAnova, getAnovaBoxplotData } from '../../../actions/ComparisonActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';
import { useWhiteFontFromBackgroundHex, formatListWithCommas } from '../../../helpers/helpers';


import Card from '../../Base/Card';
import StatsTable from './StatsTable';
import NumericalComparisonText from './NumericalComparisonText'
import AnovaTable from './AnovaTable';
import AnovaText from './AnovaText';
import AnovaBoxplotCard from './AnovaBoxplotCard';

import HeaderBar from '../../Base/HeaderBar';
import RaisedButton from '../../Base/RaisedButton';
import DropDownMenu from '../../Base/DropDownMenu';

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
      canRunNumericalComparisonIndependent
    } = this.props;

    if (projectId && (!datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    const independentVariablesChanged = independentVariableNames.length != independentVariableNames.length;
    const dependentVariablesChanged = dependentVariableNames.length != dependentVariableNames.length;
    const canRunAnova = dependentVariableNames.length && independentVariableNames.length

    if (projectId && datasetId) {
      if (canRunNumericalComparisonIndependent) {
        runNumericalComparison(projectId, datasetId, independentVariableNames, true);
      } else if (canRunNumericalComparisonDependent) {
        runNumericalComparison(projectId, datasetId, dependentVariableNames, false);
      } else if (canRunAnova) {
        runAnova(projectId, datasetId, independentVariableNamesAndTypes, dependentVariableNames);
        getAnovaBoxplotData(projectId, datasetId, independentVariableNamesAndTypes, dependentVariableNames);
      }
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

  getColoredFieldSpans(fields) {
    const { fieldNameToColor } = this.props;
    const numFields = fields.length;
    const rawColoredFieldSpans = fields.map(function(field, i) {
      var backgroundColor = fieldNameToColor[field];
      var whiteFont = useWhiteFontFromBackgroundHex(backgroundColor);
      var style = {
        backgroundColor: backgroundColor
      }

      return <span
        style={ style }
        key={ `field-name-${ field }-${ i }` }
        className={
          styles.coloredField
          + ' ' + ( whiteFont ? styles.whiteFont : styles.blackFont )
      }>{ field }</span>
    });

    return formatListWithCommas(rawColoredFieldSpans);
  }

  render() {
    const { datasets, datasetId, fieldNameToColor, numericalComparisonResult, independentVariableNames, dependentVariableNames, anovaResult, anovaBoxplotData, canRunNumericalComparisonDependent, canRunNumericalComparisonIndependent } = this.props;
    const atLeastTwoVariablesSelectedOfOneType = independentVariableNames.length >= 2 || dependentVariableNames.length >= 2;
    const anovaResultNotEmpty = anovaResult && anovaResult.stats && anovaResult.stats.length > 0;
    const anovaCanBeDisplayed = independentVariableNames.length && dependentVariableNames.length && anovaResultNotEmpty;
    const numericalComparisonResultNotEmpty = numericalComparisonResult && numericalComparisonResult.tests && numericalComparisonResult.tests.length > 0
    const canShowNumericalComparison = (canRunNumericalComparisonDependent || canRunNumericalComparisonIndependent) && numericalComparisonResultNotEmpty;

    let cardHeader;
    if (canShowNumericalComparison) {
      const numericalComparisonFields = canRunNumericalComparisonIndependent ? independentVariableNames : dependentVariableNames;
      cardHeader = <span>Comparing Distributions of { this.getColoredFieldSpans(numericalComparisonFields) }</span>
    } else if (anovaCanBeDisplayed) {
      cardHeader = <span>ANOVA Table Comparing { this.getColoredFieldSpans(independentVariableNames) } by { this.getColoredFieldSpans(dependentVariableNames) }</span>
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
      <div className={ styles.regressionViewContainer }>
        <div className={ styles.aggregationViewContainer }>
          { comparisonContent }
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
    anovaBoxplotData: anovaBoxplotData,
    fieldNameToColor: fieldProperties.fieldNameToColor
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
