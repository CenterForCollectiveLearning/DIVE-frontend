import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Button, Intent, NonIdealState } from '@blueprintjs/core';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { runAggregation, runAggregationOneDimensional, createExportedAggregation } from '../../../actions/AggregationActions';
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
      aggregationVariablesNames,
      aggregationDependentVariableName,
      aggregationFunction,
      weightVariableName,
      conditionals,
      binningConfigX,
      binningConfigY,
      runAggregation,      
      fetchDatasets,      
    } = this.props

    if (projectId & (!datasetSelector.id || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    console.log(aggregationVariablesNames);

    const numVariablesSelected = aggregationVariablesNames.length;

    console.log('Aggregation Variables Name', aggregationVariablesNames);

    if (0 < numVariablesSelected < 3) {
      runAggregation(
        projectId,
        datasetId,
        aggregationVariablesNames,
        aggregationDependentVariableName,
        aggregationFunction,
        weightVariableName,
        binningConfigX,
        binningConfigY,        
        conditionals.items
      );
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, datasets, binningConfigX, binningConfigY, aggregationVariablesNames, aggregationDependentVariableName, aggregationFunction, weightVariableName, runAggregation, conditionals, fetchDatasets } = this.props;

    const aggregationIndependentVariablesChanged = nextProps.aggregationVariablesNames.length != aggregationVariablesNames.length;
    const aggregationDependentVariableChanged = nextProps.aggregationDependentVariableName != aggregationDependentVariableName;
    const aggregationFunctionChanged = nextProps.aggregationFunction != aggregationFunction;
    const weightVariableChanged = nextProps.weightVariableName != weightVariableName;
    const binningConfigsChanged = nextProps.binningConfigX != binningConfigX || nextProps.binningConfigY != binningConfigY

    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const sideBarChanged = binningConfigsChanged || aggregationIndependentVariablesChanged || aggregationDependentVariableChanged || aggregationFunctionChanged || weightVariableChanged || conditionalsChanged;
    const numVariablesSelected = aggregationVariablesNames.length;

    if (nextProps.projectId && nextProps.datasetId && sideBarChanged && 0 < numVariablesSelected < 3) {
      runAggregation(
        nextProps.projectId,
        nextProps.datasetId,
        nextProps.aggregationVariablesNames,
        nextProps.aggregationDependentVariableName,
        nextProps.aggregationFunction,
        nextProps.weightVariableName,
        nextProps.binningConfigX,
        nextProps.binningConfigY,        
        nextProps.conditionals.items
      );      
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

  saveAggregation = (saveAction = true) => {
    const { projectId, aggregationResult, createExportedAggregation } = this.props;
    createExportedAggregation(projectId, aggregationResult.data.id, aggregationResult.data, aggregationResult.conditionals, aggregationResult.config, saveAction);
  }

  onClickShare = () => {
    setShareWindow(window.open('about:blank'));
    this.saveAggregation(false);
  }  

  render() {
    const { aggregationResult, aggregationVariablesNames, aggregationFunction, aggregationDependentVariableName, datasets, datasetId } = this.props;

    const { isSaving, isExporting, exportedAggregationId, exported, error, progress, loading, data } = aggregationResult;    
    const { oneDimensionalContingencyTable, twoDimensionalContingencyTable } = data;
    const numVariablesSelected = aggregationVariablesNames.length;

    var aggregationContent = <div></div>;

    var header = <span>
      Aggregating <ColoredFieldItems fields={ aggregationVariablesNames } />
      { (aggregationDependentVariableName == 'count') ? <span> by count</span> : <span> by { (aggregationFunction ? aggregationFunction.toLowerCase() : '') } of <ColoredFieldItems fields={ [ aggregationDependentVariableName ] } /></span>}
    </span>;

    if (error) {
        return (
          <div className={ styles.centeredFill }>
            <NonIdealState
              title='Error Running Aggregation'
              description={ error }
              visual='error'
              action={ <div className={ styles.errorAction }>
                <div>Please change your selection or</div>
                <Button
                  onClick={ () => location.reload() }
                  iconName='refresh'
                  intent={ Intent.PRIMARY }
                  text="Refresh DIVE" />
                </div>
            }
            />
          </div>
        )
      }

    if ( numVariablesSelected == 0 ) {
      aggregationContent = <div className={ styles.centeredFill }>
        <NonIdealState
          title='Too Few Variables Selected'
          description='Please select one or more variables'
          visual='variable'
        />
      </div>
    }

    else if (0 < numVariablesSelected < 3) {
      aggregationContent =
        <div className={ styles.aggregationViewContainer }>
          <HeaderBar
            actions={
              <div className={ styles.headerControlRow }>
                <div className={ styles.headerControl }>
                  <Button
                    iconName='share'
                    onClick={ this.onClickShare }
                    loading={ isExporting }
                  >
                    { !isExporting && "Share" }
                  </Button>
                </div>
                <div className={ styles.headerControl }>
                  <Button
                    onClick={ this.saveAggregation }
                    loading={ isSaving }>
                    { !isSaving && !exportedAggregationId &&
                      <div><span className='pt-icon-standard pt-icon-star-empty' />Save</div>
                    }
                    { exportedAggregationId &&
                      <div><span className='pt-icon-standard pt-icon-star' />Saved</div>
                    }
                  </Button>
                </div>
            </div>
            }
          />
          <Card
            header={ header }
          >
            { loading &&
              <Loader text={ progress != null ? progress : 'Calculating Aggregation Result…' } />
            }
            { (!loading && oneDimensionalContingencyTable && oneDimensionalContingencyTable.rows) &&
              <AggregationTableOneD
                aggregationResult={ oneDimensionalContingencyTable }
                aggregationVariablesNames={ aggregationVariablesNames }
              />
            }
            { (!loading && twoDimensionalContingencyTable && twoDimensionalContingencyTable.rows) &&
              <AggregationTable
                aggregationResult={ twoDimensionalContingencyTable }
                aggregationVariablesNames={ aggregationVariablesNames }
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
  const { aggregationResult, binningConfigX, binningConfigY } = aggregationSelector;
  const { aggregationFunction, weightVariableId, aggregationDependentVariableId, aggregationVariablesIds } = ownProps;

  const aggregationVariablesNames = fieldProperties.items
    .filter((property) => aggregationVariablesIds.indexOf(property.id) >= 0)
    .map((property) => property.name );

  let aggregationDependentVariableName;
  if (aggregationDependentVariableId == 'count' ) {
    aggregationDependentVariableName = 'count'
  } else {
    aggregationDependentVariableName = aggregationDependentVariableId ? fieldProperties.items.find((p) => (p.id == aggregationDependentVariableId)).name : null;
  }

  const weightVariableName = weightVariableId ? weightVariableId : 'UNIFORM';

  return {
    conditionals,
    datasets,
    datasetSelector,
    projectId: project.id,
    datasetId: datasetSelector.id,
    aggregationDependentVariableName,
    aggregationResult,
    aggregationVariablesNames,
    weightVariableName,
    aggregationFunction,
    binningConfigX,
    binningConfigY
  };
}

export default connect(mapStateToProps, {
  push,
  runAggregation,
  createExportedAggregation,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(AggregationView);
