import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runAggregation, runComparisonOneDimensional, getVariableSummaryStatistics } from '../../../actions/SummaryActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
import AggregationTable from './AggregationTable';
import ComparisonTableOneD from './ComparisonTableOneD';
import VariableSummaryCard from './VariableSummaryCard';

export class SummaryView extends Component {
  componentWillMount() {
    const {projectId, datasetId, allComparisonVariableIds, getVariableSummaryStatistics} = this.props

    if (projectId && datasetId && allComparisonVariableIds.length) {
      getVariableSummaryStatistics(projectId, datasetId, allComparisonVariableIds)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, loadSummary, aggregationIndependentVariableNamesAndTypes, aggregationVariableName, aggregationFunction, weightVariableName, runAggregation, runComparisonOneDimensional, allComparisonVariableIds, getVariableSummaryStatistics, fetchDatasets } = this.props;
    const aggregationIndependentVariablesChanged = nextProps.aggregationIndependentVariableNamesAndTypes.length != aggregationIndependentVariableNamesAndTypes.length;
    const aggregationVariableChanged = nextProps.aggregationVariableName != aggregationVariableName;
    const aggregationFunctionChanged = nextProps.aggregationFunction != aggregationFunction;
    const weightVariableChanged = nextProps.weightVariableName != weightVariableName;
    const shouldLoadSummary = nextProps.loadSummary != loadSummary;

    const sideBarChanged = aggregationIndependentVariablesChanged || aggregationVariableChanged || aggregationFunctionChanged || weightVariableChanged;
    const noIndependentVariablesSelected = nextProps.aggregationIndependentVariableNamesAndTypes.length == 0;
    const oneIndependentVariableSelected = nextProps.aggregationIndependentVariableNamesAndTypes.length == 1;
    const twoIndependentVariablesSelected = nextProps.aggregationIndependentVariableNamesAndTypes.length == 2;

    const projectChanged = (nextProps.projectId !== projectId);
    const datasetChanged = (nextProps.datasetId !== datasetId);


    if (nextProps.projectId && nextProps.datasetId) {
      if (sideBarChanged) {
        if (oneIndependentVariableSelected) {
          const aggregationList = nextProps.aggregationVariableName? ['q', nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null;
          runComparisonOneDimensional(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.aggregationIndependentVariableNamesAndTypes);
        } else if (twoIndependentVariablesSelected) {
          const aggregationList = nextProps.aggregationVariableName ? ['q', nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null;
          runAggregation(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.aggregationIndependentVariableNamesAndTypes);
        }
      } else{
        if (noIndependentVariablesSelected && shouldLoadSummary) {
          getVariableSummaryStatistics(nextProps.projectId, nextProps.datasetId, nextProps.allComparisonVariableIds);
        }
      }
    }
  }

  clickDataset(datasetId) {
    const { projectId, clearAnalysis, selectDataset, pushState } = this.props;
    clearAnalysis();
    selectDataset(projectId, datasetId);
    pushState(null, `/projects/${ projectId }/datasets/${ datasetId }/analyze/summary`);
  }

  render() {
    const { aggregationResult, summaryResult, oneDimensionComparisonResult, aggregationIndependentVariableNames, datasets, datasetId } = this.props;

    const noComparisonVariablesSelected = aggregationIndependentVariableNames.length ==0;
    const oneComparisonVariableSelected = aggregationIndependentVariableNames.length == 1;
    const twoComparisonVariablesSelected = aggregationIndependentVariableNames.length == 2;
    const oneDimensionDictHasElements = oneDimensionComparisonResult.data && oneDimensionComparisonResult.data.rows && oneDimensionComparisonResult.data.rows.length > 0;
    const aggregationDictHasElements = aggregationResult.data && aggregationResult.data.rows && aggregationResult.data.rows.length > 0;
    const summaryDictHasElements = summaryResult.data && summaryResult.data.items && summaryResult.data.items.length > 0;

    var summaryContent = <div></div>;

    if (noComparisonVariablesSelected ) {
      summaryContent =
        <div>
          { summaryResult.loading &&
            <div className={ styles.watermark }>
              { summaryResult.progress != null ? summaryResult.progress : 'Calculating summary…' }
            </div>
          }
          { (!summaryResult.loading && summaryDictHasElements) && summaryResult.data.items.map((item, i) => {
            const columnHeaders = (item.type == 'c') ? summaryResult.data.categoricalHeaders : summaryResult.data.numericalHeaders;
            return (
              <div className={ styles.summaryCardHolder } key={ `variable-summary-card-${ i }` }>
              <VariableSummaryCard
                variable={ item }
                columnHeaders={ columnHeaders }/>
              </div>
            );
          })}

        </div>
      ;
    }

    else if (oneComparisonVariableSelected) {
      summaryContent =
        <div className={ styles.aggregationViewContainer }>
          <Card header={
            <span>Comparison Table: <span className={ styles.titleField }>{ aggregationIndependentVariableNames[0] }</span></span>
          }>
            { oneDimensionComparisonResult.loading &&
              <div className={ styles.watermark }>
                { oneDimensionComparisonResult.progress != null ? oneDimensionComparisonResult.progress : 'Calculating oneDimensionComparisonResult…' }
              </div>
            }
            { (!oneDimensionComparisonResult.loading && oneDimensionDictHasElements) &&
              <ComparisonTableOneD comparisonResult={ oneDimensionComparisonResult.data } comparisonVariableNames={ aggregationIndependentVariableNames }/>
            }
          </Card>
        </div>
      ;
    }

    else if (twoComparisonVariablesSelected) {
      summaryContent =
        <div className={ styles.aggregationViewContainer }>
          <Card header={
            <span>Aggregation Table: {
              aggregationIndependentVariableNames.map((name, i) =>
                <span
                  key={ `aggregation-title-${ name }-${ i }` }
                  className={ `${ styles.titleField }` }>
                  { name }
                </span>
              )
            }
            </span>
          }>
            { aggregationResult.loading &&
              <div className={ styles.watermark }>
                { aggregationResult.progress != null ? aggregationResult.progress : 'Calculating aggregationResult…' }
              </div>
            }
            { (!aggregationResult.loading && aggregationDictHasElements) &&
              <AggregationTable aggregationResult={ aggregationResult.data } aggregationIndependentVariableNames={ aggregationIndependentVariableNames }/>
            }
          </Card>
        </div>
      ;
    }

    return (
      <div className={ styles.summaryViewContainer }>
        <HeaderBar
          header="Summary Statistics"
          actions={
            datasets.items && datasets.items.length > 0 ?
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
            : ''
          }/>
        { summaryContent }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets, summarySelector, datasetSelector, fieldProperties } = state;
  const { aggregationResult, oneDimensionComparisonResult } = summarySelector;

  const allComparisonVariableIds = fieldProperties.items.map((field) => field.id);

  const aggregationVariable = fieldProperties.items.find((property) => property.id == summarySelector.aggregationVariableId);
  const aggregationVariableName = aggregationVariable ? aggregationVariable.name : null;

  const aggregationIndependentVariables = fieldProperties.items
    .filter((property) => summarySelector.comparisonVariablesIds.indexOf(property.id) >= 0)

  const aggregationIndependentVariableNames = aggregationIndependentVariables
    .map((field) => field.name);

  const aggregationIndependentVariableNamesAndTypes = aggregationIndependentVariables
    .map(function(field){
      if (field.generalType == 'q'){
        return [field.generalType, field.name, 5];
      } else {
        return [field.generalType, field.name];
      }
    });


  const weightVariable = fieldProperties.items.find((property) => property.id == summarySelector.weightVariableId);
  const weightVariableName = weightVariable ? weightVariable.name : 'UNIFORM';

  return {
    datasets: datasets,
    datasetSelector: datasetSelector,
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    aggregationResult: aggregationResult,
    aggregationVariableName: aggregationVariableName,
    aggregationFunction: summarySelector.aggregationFunction,
    weightVariableName: weightVariableName,
    aggregationIndependentVariableNames: aggregationIndependentVariableNames,
    aggregationIndependentVariableNamesAndTypes: aggregationIndependentVariableNamesAndTypes,
    oneDimensionComparisonResult: oneDimensionComparisonResult,
    summaryResult: summarySelector.summaryResult,
    allComparisonVariableIds: allComparisonVariableIds,
    loadSummary: summarySelector.loadSummary
  };
}

export default connect(mapStateToProps, {
  pushState,
  runAggregation,
  runComparisonOneDimensional,
  getVariableSummaryStatistics,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(SummaryView);
