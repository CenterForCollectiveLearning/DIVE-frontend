import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset, fetchDatasets } from '../../../actions/DatasetActions';
import { getCorrelations, getCorrelationScatterplot, createExportedCorrelation } from '../../../actions/CorrelationActions';
import { setShareWindow } from '../../../actions/VisualizationActions';
import { clearAnalysis } from '../../../actions/AnalysisActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import RaisedButton from '../../Base/RaisedButton';
import DropDownMenu from '../../Base/DropDownMenu';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
import CorrelationTable from './CorrelationTable';
import CorrelationScatterplotCard from './CorrelationScatterplotCard';

export class CorrelationView extends Component {

  constructor(props) {
    super(props);

    this.saveCorrelation = this.saveCorrelation.bind(this);
    this.onClickShare = this.onClickShare.bind(this);
  }

  componentWillMount() {
    const { projectId, datasetId, datasetSelector, datasets, correlationVariableNames, getCorrelations, fetchDatasets } = this.props

    if (projectId && (!datasetSelector.datasetId || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(projectId);
    }

    if (projectId && datasetId && correlationVariableNames.length) {
      getCorrelations(projectId, datasetId, correlationVariableNames)
    }

    clearAnalysis();
  }

  componentWillReceiveProps(nextProps) {
    const { projectId, datasetId, datasets, correlationVariableNames, getCorrelations, getCorrelationScatterplot, correlationResult } = this.props

    const correlationVariableChanged = nextProps.correlationVariableNames.length != correlationVariableNames.length;
    const twoVariablesSelected = nextProps.correlationVariableNames.length >= 2;
    if (nextProps.projectId && nextProps.datasetId && correlationVariableChanged && twoVariablesSelected) {
      getCorrelations(nextProps.projectId, nextProps.datasetId, nextProps.correlationVariableNames)
    }

    if (nextProps.projectId && nextProps.correlationResult.data && nextProps.correlationResult.data.id && (this.props.correlationResult.data == null || (nextProps.correlationResult.data.id != this.props.correlationResult.data.id))) {
      getCorrelationScatterplot(nextProps.projectId, nextProps.correlationResult.data.id);
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

  saveCorrelation(saveAction = true) {
    const { project, correlationResult, createExportedCorrelation } = this.props;
    createExportedCorrelation(project.properties.id, correlationResult.data.id, correlationResult.data, correlationResult.conditionals, correlationResult.config, saveAction);
  }

  onClickShare() {
    setShareWindow(window.open('about:blank'));
    this.saveCorrelation(false);
  }

  render() {
    const { correlationResult, correlationVariableNames, correlationScatterplots, datasets, datasetId } = this.props;
    const twoCorrelationVariablesSelected = correlationVariableNames.length >= 2;
    const correlationResultHasElements = correlationResult.data && correlationResult.data.rows && correlationResult.data.rows.length > 0;
    const disabled = (correlationResult.isSaving || (!correlationResult.isSaving && correlationResult.exportedRegressionId) || correlationResult.exported) ? true : false;

    var correlationContent;
    if (twoCorrelationVariablesSelected ) {
      correlationContent =
        <div className={ styles.correlationViewContainer }>
          <Card header={
              <span>Correlating <ColoredFieldItems fields={ correlationVariableNames } /></span>
            }
          >
            { correlationResult.loading &&
              <div className={ styles.watermark }>
                { correlationResult.progress != null ? correlationResult.progress : 'Running correlations…' }
              </div>
            }
            { (!correlationResult.loading && correlationResultHasElements) &&
              <CorrelationTable correlationResult={ correlationResult.data || {} } />
            }
          </Card>
          { (correlationResultHasElements && correlationScatterplots.length > 0) &&
            <CorrelationScatterplotCard
              data={ correlationScatterplots }
            />
          }
        </div>
      ;
    }

    return (
      <div className={ styles.analysisViewContainer }>
        <HeaderBar
          actions={
            <div className={ styles.headerControlRow }>
              <div className={ styles.headerControl }>
                <RaisedButton onClick={ this.onClickShare }>
                  { correlationResult.isExporting && "Exporting..." }
                  { !correlationResult.isExporting && "Share" }
                </RaisedButton>
              </div>
              <div className={ styles.headerControl }>
                <RaisedButton onClick={ this.saveCorrelation } disabled={ disabled }>
                  { !correlationResult.isSaving && correlationResult.exportedCorrelationId && <i className="fa fa-star"></i> }
                  { !correlationResult.exportedCorrelationId && <i className="fa fa-star-o"></i> }
                </RaisedButton>
              </div>
            </div>
          }/>
        { correlationContent }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets, correlationSelector, datasetSelector, fieldProperties } = state;
  const { correlationScatterplots } = correlationSelector;

  const correlationVariableNames = fieldProperties.items
    .filter((property) => correlationSelector.correlationVariableIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  return {
    datasets: datasets,
    datasetSelector: datasetSelector,
    project: project,
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    correlationResult: correlationSelector.correlationResult,
    correlationVariableNames: correlationVariableNames,
    correlationScatterplots: correlationScatterplots,
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
