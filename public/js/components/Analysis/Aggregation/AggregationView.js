import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runAggregation, runAggregationOneDimensional } from '../../../actions/AggregationActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
import AggregationTable from './AggregationTable';
import AggregationTableOneD from './AggregationTableOneD';

export class AggregationView extends Component {
  componentWillMount() {
    const {
      projectId,
      datasetId,
      datasets,
      datasetSelector,
      aggregationIndependentVariableNamesAndTypes,
      getVariableAggregationStatistics,
      aggregationVariableName,
      aggregationFunction,
      weightVariableName,
      runAggregation,
      runAggregationOneDimensional,
      allAggregationVariableIds,
      fetchDatasets
    } = this.props

    if (projectId && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    const noIndependentVariablesSelected = aggregationIndependentVariableNamesAndTypes.length == 0;
    const oneIndependentVariableSelected = aggregationIndependentVariableNamesAndTypes.length == 1;
    const twoIndependentVariablesSelected = aggregationIndependentVariableNamesAndTypes.length == 2;

    if (oneIndependentVariableSelected) {
      const aggregationList = aggregationVariableName ? ['q', aggregationVariableName, [aggregationFunction, weightVariableName]] : null;
      runAggregationOneDimensional(projectId, datasetId, aggregationList, aggregationIndependentVariableNamesAndTypes);
    } else if (twoIndependentVariablesSelected) {
      const aggregationList = aggregationVariableName ? ['q', aggregationVariableName, [aggregationFunction, weightVariableName]] : null;
      runAggregation(projectId, datasetId, aggregationList, aggregationIndependentVariableNamesAndTypes);
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, datasets, binningConfigX, binningConfigY, loadAggregation, aggregationIndependentVariableNamesAndTypes, aggregationVariableName, aggregationFunction, weightVariableName, runAggregation, runAggregationOneDimensional, allAggregationVariableIds, fetchDatasets } = this.props;
    const aggregationIndependentVariablesChanged = nextProps.aggregationIndependentVariableNamesAndTypes.length != aggregationIndependentVariableNamesAndTypes.length;
    const aggregationVariableChanged = nextProps.aggregationVariableName != aggregationVariableName;
    const aggregationFunctionChanged = nextProps.aggregationFunction != aggregationFunction;
    const weightVariableChanged = nextProps.weightVariableName != weightVariableName;
    const shouldLoadAggregation = nextProps.loadAggregation != loadAggregation;
    const binningConfigsChanged = nextProps.binningConfigX != binningConfigX || nextProps.binningConfigY != binningConfigY

    const sideBarChanged = binningConfigsChanged || aggregationIndependentVariablesChanged || aggregationVariableChanged || aggregationFunctionChanged || weightVariableChanged;
    const noIndependentVariablesSelected = nextProps.aggregationIndependentVariableNamesAndTypes.length == 0;
    const oneIndependentVariableSelected = nextProps.aggregationIndependentVariableNamesAndTypes.length == 1;
    const twoIndependentVariablesSelected = nextProps.aggregationIndependentVariableNamesAndTypes.length == 2;

    if (nextProps.projectId && nextProps.datasetId) {

      if (sideBarChanged) {
        if (oneIndependentVariableSelected) {
          const aggregationList = nextProps.aggregationVariableName? ['q', nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null;
          runAggregationOneDimensional(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.aggregationIndependentVariableNamesAndTypes);
        } else if (twoIndependentVariablesSelected) {
          const aggregationList = nextProps.aggregationVariableName ? ['q', nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null;
          runAggregation(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.aggregationIndependentVariableNamesAndTypes);
        }
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
    const { aggregationResult, oneDimensionAggregationResult, aggregationIndependentVariableNames, datasets, datasetId } = this.props;

    const noAggregationVariablesSelected = aggregationIndependentVariableNames.length ==0;
    const oneAggregationVariableSelected = aggregationIndependentVariableNames.length == 1;
    const twoAggregationVariablesSelected = aggregationIndependentVariableNames.length == 2;
    const oneDimensionDictHasElements = oneDimensionAggregationResult.data && oneDimensionAggregationResult.data.rows && oneDimensionAggregationResult.data.rows.length > 0;
    const aggregationDictHasElements = aggregationResult.data && aggregationResult.data.rows && aggregationResult.data.rows.length > 0;

    var aggregationContent = <div></div>;

    if (noAggregationVariablesSelected ) {
      aggregationContent = <div className={ styles.watermark }>
        Please Select One or More Variables
      </div>
    }

    else if (oneAggregationVariableSelected) {
      aggregationContent =
        <div className={ styles.aggregationViewContainer }>
          <Card header={
            <span>Aggregation Table: <span className={ styles.titleField }>{ aggregationIndependentVariableNames[0] }</span></span>
          }>
            { oneDimensionAggregationResult.loading &&
              <div className={ styles.watermark }>
                { oneDimensionAggregationResult.progress != null ? oneDimensionAggregationResult.progress : 'Calculating oneDimensionAggregationResult…' }
              </div>
            }
            { (!oneDimensionAggregationResult.loading && oneDimensionDictHasElements) &&
              <AggregationTableOneD aggregationResult={ oneDimensionAggregationResult.data } aggregationVariableNames={ aggregationIndependentVariableNames }/>
            }
          </Card>
        </div>
      ;
    }

    else if (twoAggregationVariablesSelected) {
      aggregationContent =
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
        { aggregationContent }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets, aggregationSelector, datasetSelector, fieldProperties } = state;
  const { aggregationResult, oneDimensionAggregationResult, binningConfigX, binningConfigY } = aggregationSelector;

  const allAggregationVariableIds = fieldProperties.items.map((field) => field.id);

  const aggregationVariable = fieldProperties.items.find((property) => property.id == aggregationSelector.aggregationVariableId);
  const aggregationVariableName = aggregationVariable ? aggregationVariable.name : null;

  const aggregationIndependentVariables = fieldProperties.items
    .filter((property) => aggregationSelector.aggregationVariablesIds.indexOf(property.id) >= 0)

  const aggregationIndependentVariableNames = aggregationIndependentVariables
    .map((field) => field.name);

  var aggregationIndependentVariableNamesAndTypes  = aggregationIndependentVariables
    .map(function(field){
      if (field.generalType == 'q'){
        return [field.generalType, field.name, binningConfigX];
      } else {
        return [field.generalType, field.name];
      }
    });

  if (aggregationIndependentVariables.length == 2){
    var var1 = aggregationIndependentVariables[0]
    var var2 = aggregationIndependentVariables[1]
    if (var1.generalType == 'q' && var2.generalType == 'q'){
      aggregationIndependentVariableNamesAndTypes[0] = [var1.generalType, var1.name, binningConfigX]
      aggregationIndependentVariableNamesAndTypes[1] = [var2.generalType, var2.name, binningConfigY]
    }
  }



  const weightVariable = fieldProperties.items.find((property) => property.id == aggregationSelector.weightVariableId);
  const weightVariableName = weightVariable ? weightVariable.name : 'UNIFORM';

  return {
    datasets: datasets,
    datasetSelector: datasetSelector,
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    aggregationResult: aggregationResult,
    aggregationVariableName: aggregationVariableName,
    aggregationFunction: aggregationSelector.aggregationFunction,
    weightVariableName: weightVariableName,
    aggregationIndependentVariableNames: aggregationIndependentVariableNames,
    aggregationIndependentVariableNamesAndTypes: aggregationIndependentVariableNamesAndTypes,
    oneDimensionAggregationResult: oneDimensionAggregationResult,
    allAggregationVariableIds: allAggregationVariableIds,
    loadAggregation: aggregationSelector.loadAggregation,
    binningConfigX: binningConfigX,
    binningConfigY: binningConfigY
  };
}

export default connect(mapStateToProps, {
  push,
  runAggregation,
  runAggregationOneDimensional,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(AggregationView);
