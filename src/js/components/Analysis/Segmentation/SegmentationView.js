import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runSegmentation, runSegmentationOneDimensional } from '../../../actions/SegmentationActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import Loader from '../../Base/Loader';
import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
import SegmentationTable from './SegmentationTable';
import SegmentationTableOneD from './SegmentationTableOneD';

export class SegmentationView extends Component {
  componentWillMount() {
    const {
      projectId,
      datasetId,
      datasets,
      datasetSelector,
      segmentationIndependentVariableNamesAndTypes,
      getVariableSegmentationStatistics,
      segmentationVariableName,
      segmentationFunction,
      weightVariableName,
      runSegmentation,
      runSegmentationOneDimensional,
      allSegmentationVariableIds,
      conditionals,
      fetchDatasets
    } = this.props

    if (projectId && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    const noIndependentVariablesSelected = segmentationIndependentVariableNamesAndTypes.length == 0;
    const oneIndependentVariableSelected = segmentationIndependentVariableNamesAndTypes.length == 1;
    const twoIndependentVariablesSelected = segmentationIndependentVariableNamesAndTypes.length == 2;

    if (oneIndependentVariableSelected) {
      const segmentationList = segmentationVariableName ? ['q', segmentationVariableName, [segmentationFunction, weightVariableName]] : null;
      runSegmentationOneDimensional(projectId, datasetId, segmentationList, segmentationIndependentVariableNamesAndTypes, conditionals.items);
    } else if (twoIndependentVariablesSelected) {
      const segmentationList = segmentationVariableName ? ['q', segmentationVariableName, [segmentationFunction, weightVariableName]] : null;
      runSegmentation(projectId, datasetId, segmentationList, segmentationIndependentVariableNamesAndTypes, conditionals.items);
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, datasets, binningConfigX, binningConfigY, loadSegmentation, segmentationIndependentVariableNamesAndTypes, segmentationVariableName, segmentationFunction, weightVariableName, runSegmentation, runSegmentationOneDimensional, allSegmentationVariableIds, conditionals, fetchDatasets } = this.props;
    const segmentationIndependentVariablesChanged = nextProps.segmentationIndependentVariableNamesAndTypes.length != segmentationIndependentVariableNamesAndTypes.length;
    const segmentationVariableChanged = nextProps.segmentationVariableName != segmentationVariableName;
    const segmentationFunctionChanged = nextProps.segmentationFunction != segmentationFunction;
    const weightVariableChanged = nextProps.weightVariableName != weightVariableName;
    const shouldLoadSegmentation = nextProps.loadSegmentation != loadSegmentation;
    const binningConfigsChanged = nextProps.binningConfigX != binningConfigX || nextProps.binningConfigY != binningConfigY

    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const sideBarChanged = binningConfigsChanged || segmentationIndependentVariablesChanged || segmentationVariableChanged || segmentationFunctionChanged || weightVariableChanged || conditionalsChanged;
    const noIndependentVariablesSelected = nextProps.segmentationIndependentVariableNamesAndTypes.length == 0;
    const oneIndependentVariableSelected = nextProps.segmentationIndependentVariableNamesAndTypes.length == 1;
    const twoIndependentVariablesSelected = nextProps.segmentationIndependentVariableNamesAndTypes.length == 2;

    if (nextProps.projectId && nextProps.datasetId) {

      if (sideBarChanged) {
        if (oneIndependentVariableSelected) {
          const segmentationList = nextProps.segmentationVariableName? ['q', nextProps.segmentationVariableName, [nextProps.segmentationFunction, nextProps.weightVariableName]] : null;
          runSegmentationOneDimensional(nextProps.projectId, nextProps.datasetId, segmentationList, nextProps.segmentationIndependentVariableNamesAndTypes, nextProps.conditionals.items);
        } else if (twoIndependentVariablesSelected) {
          const segmentationList = nextProps.segmentationVariableName ? ['q', nextProps.segmentationVariableName, [nextProps.segmentationFunction, nextProps.weightVariableName]] : null;
          runSegmentation(nextProps.projectId, nextProps.datasetId, segmentationList, nextProps.segmentationIndependentVariableNamesAndTypes, nextProps.conditionals.items);
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
    const { segmentationResult, oneDimensionSegmentationResult, segmentationIndependentVariableNames, segmentationFunction, segmentationVariableId, segmentationVariableName, datasets, datasetId } = this.props;

    const noSegmentationVariablesSelected = segmentationIndependentVariableNames.length ==0;
    const oneSegmentationVariableSelected = segmentationIndependentVariableNames.length == 1;
    const twoSegmentationVariablesSelected = segmentationIndependentVariableNames.length == 2;
    const oneDimensionDictHasElements = oneDimensionSegmentationResult.data && oneDimensionSegmentationResult.data.rows && oneDimensionSegmentationResult.data.rows.length > 0;
    const segmentationDictHasElements = segmentationResult.data && segmentationResult.data.rows && segmentationResult.data.rows.length > 0;

    var segmentationContent = <div></div>;

    var header = <span>
      Segmenting <ColoredFieldItems fields={ segmentationIndependentVariableNames } />
      { (segmentationVariableId == 'count') ? <span> by count</span> : <span> by { segmentationFunction.toLowerCase() } of <ColoredFieldItems fields={ [segmentationVariableName] } /></span>}
    </span>;

    if (noSegmentationVariablesSelected ) {
      segmentationContent = <div className={ styles.watermark }>
        Please Select One or More Variables
      </div>
    }

    else if (oneSegmentationVariableSelected) {
      segmentationContent =
        <div className={ styles.segmentationViewContainer }>
          <Card
            header={ header }
          >
            { oneDimensionSegmentationResult.loading &&
              <Loader text={ oneDimensionSegmentationResult.progress != null ? oneDimensionSegmentationResult.progress : 'Calculating Segmentation Result…' } />
            }
            { (!oneDimensionSegmentationResult.loading && oneDimensionDictHasElements) &&
              <SegmentationTableOneD segmentationResult={ oneDimensionSegmentationResult.data } segmentationVariableNames={ segmentationIndependentVariableNames }/>
            }
          </Card>
        </div>
      ;
    }

    else if (twoSegmentationVariablesSelected) {
      segmentationContent =
        <div className={ styles.segmentationViewContainer }>
        <Card
          header={ header }
        >
            { segmentationResult.loading &&
              <Loader text={ segmentationResult.progress != null ? segmentationResult.progress : 'Calculating segmentation result…' } />
            }
            { (!segmentationResult.loading && segmentationDictHasElements) &&
              <SegmentationTable segmentationResult={ segmentationResult.data } segmentationIndependentVariableNames={ segmentationIndependentVariableNames }/>
            }
          </Card>
        </div>
      ;
    }

    return (
      <div className={ styles.analysisViewContainer }>
        { segmentationContent }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets, segmentationSelector, datasetSelector, fieldProperties, conditionals } = state;
  const { segmentationResult, oneDimensionSegmentationResult, binningConfigX, binningConfigY, segmentationVariableId } = segmentationSelector;

  const allSegmentationVariableIds = fieldProperties.items.map((field) => field.id);

  const segmentationVariable = fieldProperties.items.find((property) => property.id == segmentationSelector.segmentationVariableId);
  const segmentationVariableName = segmentationVariable ? segmentationVariable.name : null;

  const segmentationIndependentVariables = fieldProperties.items
    .filter((property) => segmentationSelector.segmentationVariablesIds.indexOf(property.id) >= 0)

  const segmentationIndependentVariableNames = segmentationIndependentVariables
    .map((field) => field.name);

  var segmentationIndependentVariableNamesAndTypes  = segmentationIndependentVariables
    .map(function(field){
      if (field.generalType == 'q'){
        return [field.generalType, field.name, binningConfigX];
      } else {
        return [field.generalType, field.name];
      }
    });

  if (segmentationIndependentVariables.length == 2){
    var var1 = segmentationIndependentVariables[0]
    var var2 = segmentationIndependentVariables[1]
    if (var1.generalType == 'q' && var2.generalType == 'q'){
      segmentationIndependentVariableNamesAndTypes[0] = [var1.generalType, var1.name, binningConfigX]
      segmentationIndependentVariableNamesAndTypes[1] = [var2.generalType, var2.name, binningConfigY]
    }
  }

  const weightVariable = fieldProperties.items.find((property) => property.id == segmentationSelector.weightVariableId);
  const weightVariableName = weightVariable ? weightVariable.name : 'UNIFORM';

  return {
    conditionals,
    datasets,
    datasetSelector,
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    segmentationResult,
    segmentationVariableName,
    segmentationVariableId,
    segmentationFunction: segmentationSelector.segmentationFunction,
    weightVariableName,
    segmentationIndependentVariableNames,
    segmentationIndependentVariableNamesAndTypes,
    oneDimensionSegmentationResult,
    allSegmentationVariableIds,
    loadSegmentation: segmentationSelector.loadSegmentation,
    binningConfigX,
    binningConfigY
  };
}

export default connect(mapStateToProps, {
  push,
  runSegmentation,
  runSegmentationOneDimensional,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(SegmentationView);
