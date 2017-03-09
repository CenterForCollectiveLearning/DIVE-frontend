import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { NonIdealState } from '@blueprintjs/core';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runAggregation, runAggregationOneDimensional } from '../../../actions/AggregationActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import Loader from '../../Base/Loader';
import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
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
      aggregateOnName,
      aggregationFunction,
      weightVariableName,
      runAggregation,
      runAggregationOneDimensional,
      allAggregationVariableIds,
      conditionals,
      fetchDatasets
    } = this.props

    if (projectId && (!datasetSelector.id || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    const noIndependentVariablesSelected = aggregationIndependentVariableNamesAndTypes.length == 0;
    const oneIndependentVariableSelected = aggregationIndependentVariableNamesAndTypes.length == 1;
    const twoIndependentVariablesSelected = aggregationIndependentVariableNamesAndTypes.length == 2;

    if (oneIndependentVariableSelected) {
      const aggregationList = aggregateOnName ? ['q', aggregateOnName, [aggregationFunction, weightVariableName]] : null;
      runAggregationOneDimensional(projectId, datasetId, aggregationList, aggregationIndependentVariableNamesAndTypes, conditionals.items);
    } else if (twoIndependentVariablesSelected) {
      const aggregationList = aggregateOnName ? ['q', aggregateOnName, [aggregationFunction, weightVariableName]] : null;
      runAggregation(projectId, datasetId, aggregationList, aggregationIndependentVariableNamesAndTypes, conditionals.items);
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, datasets, binningConfigX, binningConfigY, loadAggregation, aggregationIndependentVariableNamesAndTypes, aggregateOnName, aggregationFunction, weightVariableName, runAggregation, runAggregationOneDimensional, allAggregationVariableIds, conditionals, fetchDatasets } = this.props;
    const aggregationIndependentVariablesChanged = nextProps.aggregationIndependentVariableNamesAndTypes.length != aggregationIndependentVariableNamesAndTypes.length;
    const aggregationVariableChanged = nextProps.aggregateOnName != aggregateOnName;
    const aggregationFunctionChanged = nextProps.aggregationFunction != aggregationFunction;
    const weightVariableChanged = nextProps.weightVariableName != weightVariableName;
    const shouldLoadAggregation = nextProps.loadAggregation != loadAggregation;
    const binningConfigsChanged = nextProps.binningConfigX != binningConfigX || nextProps.binningConfigY != binningConfigY

    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const sideBarChanged = binningConfigsChanged || aggregationIndependentVariablesChanged || aggregationVariableChanged || aggregationFunctionChanged || weightVariableChanged || conditionalsChanged;
    const noIndependentVariablesSelected = nextProps.aggregationIndependentVariableNamesAndTypes.length == 0;
    const oneIndependentVariableSelected = nextProps.aggregationIndependentVariableNamesAndTypes.length == 1;
    const twoIndependentVariablesSelected = nextProps.aggregationIndependentVariableNamesAndTypes.length == 2;

    if (nextProps.projectId && nextProps.datasetId) {

      if (sideBarChanged) {
        if (oneIndependentVariableSelected) {
          const aggregationList = nextProps.aggregateOnName? ['q', nextProps.aggregateOnName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null;
          runAggregationOneDimensional(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.aggregationIndependentVariableNamesAndTypes, nextProps.conditionals.items);
        } else if (twoIndependentVariablesSelected) {
          const aggregationList = nextProps.aggregateOnName ? ['q', nextProps.aggregateOnName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null;
          runAggregation(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.aggregationIndependentVariableNamesAndTypes, nextProps.conditionals.items);
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
    const { aggregationResult, oneDimensionAggregationResult, aggregationIndependentVariableNames, aggregationFunction, aggregateOn, aggregateOnName, datasets, datasetId } = this.props;

    const noAggregationVariablesSelected = aggregationIndependentVariableNames.length == 0;
    const oneAggregationVariableSelected = aggregationIndependentVariableNames.length == 1;
    const twoAggregationVariablesSelected = aggregationIndependentVariableNames.length == 2;
    const oneDimensionDictHasElements = oneDimensionAggregationResult.data && oneDimensionAggregationResult.data.rows && oneDimensionAggregationResult.data.rows.length > 0;
    const aggregationDictHasElements = aggregationResult.data && aggregationResult.data.rows && aggregationResult.data.rows.length > 0;

    var aggregationContent = <div></div>;

    var header = <span>
      Aggregating <ColoredFieldItems fields={ aggregationIndependentVariableNames } />
      { (aggregateOn == 'count') ? <span> by count</span> : <span> by { (aggregationFunction ? aggregationFunction.toLowerCase() : '') } of <ColoredFieldItems fields={ [ aggregateOnName ] } /></span>}
    </span>;

    if (noAggregationVariablesSelected ) {
      aggregationContent = <div className={ styles.centeredFill }>
        <NonIdealState
          title='Too Few Variables Selected'
          description='Please select one or more variables'
          visual='variable'
        />
      </div>
    }

    else if (oneAggregationVariableSelected) {
      aggregationContent =
        <div className={ styles.aggregationViewContainer }>
          <Card
            header={ header }
          >
            { oneDimensionAggregationResult.loading &&
              <Loader text={ oneDimensionAggregationResult.progress != null ? oneDimensionAggregationResult.progress : 'Calculating Aggregation Result…' } />
            }
            { (!oneDimensionAggregationResult.loading && oneDimensionDictHasElements) &&
              <AggregationTableOneD
                aggregationResult={ oneDimensionAggregationResult.data }
                aggregationVariableNames={ aggregationIndependentVariableNames }
              />
            }
          </Card>
        </div>
      ;
    }

    else if (twoAggregationVariablesSelected) {
      aggregationContent =
        <div className={ styles.aggregationViewContainer }>
        <Card
          header={ header }
        >
            { aggregationResult.loading &&
              <Loader text={ aggregationResult.progress != null ? aggregationResult.progress : 'Calculating aggregation result…' } />
            }
            { (!aggregationResult.loading && aggregationDictHasElements) &&
              <AggregationTable
                aggregationResult={ aggregationResult.data }
                aggregationIndependentVariableNames={ aggregationIndependentVariableNames }
              />
            }
          </Card>
        </div>
      ;
    }

    else {
      aggregationContent = <div className={ styles.watermark }>
        Too many variables selected (maximum two)
      </div>
    }

    return (
      <div className={ styles.analysisViewContainer }>
        { aggregationContent }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, datasets, aggregationSelector, datasetSelector, fieldProperties, conditionals } = state;
  const { aggregationResult, oneDimensionAggregationResult, binningConfigX, binningConfigY } = aggregationSelector;
  const { aggregationFunction, weightVariableId, aggregateOn, aggregationVariablesIds } = ownProps;

  const allAggregationVariableIds = fieldProperties.items.map((field) => field.id);

  const aggregateOnProperty = fieldProperties.items.find((property) => property.id == aggregateOn);
  const aggregateOnName = aggregateOnProperty ? aggregateOnProperty.name : null;

  const aggregationIndependentVariables = fieldProperties.items
    .filter((property) => aggregationVariablesIds.indexOf(property.id) >= 0)

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

  const weightVariableName = weightVariableId ? weightVariableId : 'UNIFORM';

  return {
    conditionals,
    datasets,
    datasetSelector,
    projectId: project.id,
    datasetId: datasetSelector.id,
    aggregationResult,
    aggregationIndependentVariableNames,
    aggregationIndependentVariableNamesAndTypes,
    oneDimensionAggregationResult,
    allAggregationVariableIds,
    loadAggregation: aggregationSelector.loadAggregation,
    aggregateOnName,
    weightVariableName,
    aggregateOn,
    aggregationFunction,
    binningConfigX,
    binningConfigY
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
