import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Button, NonIdealState, Intent } from '@blueprintjs/core';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { getCorrelations, getCorrelationScatterplot, createExportedCorrelation } from '../../../actions/CorrelationActions';
import { setShareWindow } from '../../../actions/VisualizationActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import styles from '../Analysis.sass';

import ErrorComponent from '../../Base/ErrorComponent';
import Card from '../../Base/Card';
import Loader from '../../Base/Loader';
import HeaderBar from '../../Base/HeaderBar';
import RaisedButton from '../../Base/RaisedButton';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
import CorrelationTable from './CorrelationTable';
import CorrelationScatterplotCard from './CorrelationScatterplotCard';

export class CorrelationView extends Component {

  componentWillMount() {
    const { projectId, datasetId, datasetSelector, datasets, correlationVariableNames, getCorrelations, correlations, conditionals, fetchDatasets } = this.props

    if (projectId && (!datasetSelector.id || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }
    if (projectId && datasetId && correlationVariableNames.length) {
      getCorrelations(projectId, datasetId, correlationVariableNames, conditionals.items)
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, datasets, correlationVariableNames, getCorrelations, getCorrelationScatterplot, conditionals, correlationResult } = this.props

    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const correlationVariableChanged = nextProps.correlationVariableNames.length != correlationVariableNames.length;
    const sideBarChanged = correlationVariableChanged || conditionalsChanged;
    const twoVariablesSelected = nextProps.correlationVariableNames.length >= 2;
    if (nextProps.projectId && nextProps.datasetId && sideBarChanged && twoVariablesSelected) {
      getCorrelations(nextProps.projectId, nextProps.datasetId, nextProps.correlationVariableNames, nextProps.conditionals.items)
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

  saveCorrelation = (saveAction = true) => {
    const { project, correlationResult, createExportedCorrelation } = this.props;
    createExportedCorrelation(project.id, correlationResult.data.id, correlationResult.data, correlationResult.conditionals, correlationResult.config, saveAction);
  }

  onClickShare = () => {
    setShareWindow(window.open('about:blank'));
    this.saveCorrelation(false);
  }

  render() {
    const { correlationResult, correlationVariableNames,  datasets, datasetId } = this.props;

    const { error, loading, progress, data, isExporting, isSaving, exportedRegressionId } = correlationResult;
    const { table, scatterplots } = data;

    const twoCorrelationVariablesSelected = correlationVariableNames.length >= 2;
    const saved = (isSaving || (!isSaving && exportedRegressionId) || correlationResult.exported) ? true : false;

    var correlationContent;
    if (error) {
      correlationContent = <ErrorComponent
        title='Error Running Correlation'
        description={ error }
      />;
    }

    if (!error && correlationVariableNames.length < 2) {
      correlationContent = <div className={ styles.centeredFill }>
        <NonIdealState
          title='Too Few Variables Selected'
          description='To run a correlation, please select two or more variables'
          visual='variable'
        />
      </div>
    }
    else if (!error && twoCorrelationVariablesSelected ) {
      correlationContent =
        <div className={ styles.correlationViewContainer }>
          <Card header={
              <span>Correlating <ColoredFieldItems fields={ correlationVariableNames } /></span>
            }
          >
            { loading && <Loader text={ progress != null ? progress : 'Running correlations…' } /> }
            { (!loading && table && table.rows && table.headers && scatterplots) && 
              <CorrelationTable correlationResult={ table } scatterplotData={ scatterplots } /> 
            }
          </Card>
        </div>
      ;
    }

    return (
      <div className={ styles.analysisViewContainer }>
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
                  onClick={ this.saveCorrelation }
                  loading={ isSaving }>
                  { !correlationResult.isSaving && !correlationResult.exportedCorrelationId &&
                    <div><span className='pt-icon-standard pt-icon-star-empty' />Save</div>
                  }
                  { correlationResult.exportedCorrelationId &&
                    <div><span className='pt-icon-standard pt-icon-star' />Saved</div>
                  }
                </Button>
              </div>
            </div>
          }/>
        { correlationContent }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, datasets, correlationSelector, datasetSelector, fieldProperties, conditionals } = state;
  const { correlationVariablesIds } = ownProps;

  const correlationVariableNames = fieldProperties.items
    .filter((property) => correlationVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  return {
    conditionals,
    datasets: datasets,
    datasetSelector: datasetSelector,
    project: project,
    projectId: project.id,
    datasetId: datasetSelector.id,
    correlationResult: correlationSelector.correlationResult,
    correlationVariableNames: correlationVariableNames
  }
}

export default connect(mapStateToProps, {
  push,
  getCorrelations,
  getCorrelationScatterplot,
  createExportedCorrelation,
  selectDataset,
  fetchDatasets,
  clearAnalysis
})(CorrelationView);
