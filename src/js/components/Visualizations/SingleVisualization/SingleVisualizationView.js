import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import canvg from 'canvg-browser';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

import { Button } from '@blueprintjs/core';

import { fetchDatasets } from '../../../actions/DatasetActions';
import { fetchSpecVisualizationIfNeeded, getVisualizationTableData, createExportedSpec, setShareWindow } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import VisualizationView from '../VisualizationView';
import BareDataGrid from '../../Base/BareDataGrid';
import RaisedButton from '../../Base/RaisedButton';

export class SingleVisualizationView extends Component {
  componentWillMount() {
    const { project, datasetSelector, datasets, specId, visualization, fetchSpecVisualizationIfNeeded } = this.props;

    if (project.id && (!datasetSelector.id || (!datasets.isFetching && !datasets.loaded))) {
      fetchDatasets(project.id);
    }

    if (project.id && !visualization.spec.id) {
      fetchSpecVisualizationIfNeeded(project.id, specId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { visualization, dataConfig, conditionals, datasets, datasetSelector, project, fetchSpecVisualizationIfNeeded, fetchDatasets } = this.props;

    const exportingChanged = visualization.isExporting != nextProps.visualization.isExporting;
    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const dataConfigChanged = nextProps.dataConfig.lastUpdated != dataConfig.lastUpdated;
    const projectChanged = (nextProps.project.id !== project.id);

    if ((projectChanged && nextProps.project.id) || (project.id && (!datasetSelector.id || (!datasets.isFetching && !datasets.loaded)))) {
      fetchDatasets(nextProps.project.id);
    }

    if (nextProps.project.id && !visualization.isFetching && (!visualization.spec.id || conditionalsChanged || dataConfigChanged)) {
      fetchSpecVisualizationIfNeeded(nextProps.project.id, nextProps.specId, nextProps.conditionals.items, nextProps.visualization.config);
    }

    if (exportingChanged && !nextProps.visualization.isExporting && nextProps.visualization.shareWindow) {
      nextProps.visualization.shareWindow.location.href = `/share/projects/${ nextProps.project.id }/visualizations/${ nextProps.visualization.exportedSpecId }`;
    }
  }

  saveAs = (filetitle = 'test', format = 'png') => {
    const svgElement = document.querySelectorAll('*[id^="spec-"]')[0].getElementsByTagName('svg')[0];
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    const svgData = svgElement.outerHTML;
    const sourceCanvasElement = document.getElementById('export-canvas');
    let destinationCanvas;

    const filename = `${ filetitle }.${ format }`;

    if (format == 'svg') {
      var svgBlob = new Blob([svgData], { type: 'application/svg+xml;' });
      saveAs(svgBlob, `${ filename }.${ format }`);
      return;
    }
    if (format == 'png' || format == 'pdf') {
      canvg(sourceCanvasElement, svgElement.outerHTML);

      destinationCanvas = document.createElement("canvas");
      destinationCanvas.width = sourceCanvasElement.width;
      destinationCanvas.height = sourceCanvasElement.height;

      var destCtx = destinationCanvas.getContext('2d');
      destCtx.fillStyle = "#FFFFFF";
      destCtx.fillRect(0, 0, sourceCanvasElement.width, sourceCanvasElement.height);
      destCtx.drawImage(sourceCanvasElement, 0, 0);
    }

    if (format == 'png') {
      destinationCanvas.toBlob(function(blob) {
        saveAs(blob, filename);
      }, 'image/png');
      return;
    }

    if (format == 'pdf') {
      var imgData = destinationCanvas.toDataURL('image/jpeg', 1.0);

      var pdf = new jsPDF('landscape');
      pdf.addImage(imgData, 'JPEG', 0, 0);
      pdf.save(filename);
      return;
    }
  }

  saveVisualization = (saveAction = true) => {
    const { project, visualization, createExportedSpec, conditionals } = this.props;
    const { bins, visualizationData, tableData } = visualization;
    createExportedSpec(project.id, visualization.spec.id, { 'visualize': visualizationData, 'table': tableData, 'bins': bins}, conditionals.items, visualization.config, saveAction);
  }

  onClickShare = () => {
    setShareWindow(window.open('about:blank'));
    this.saveVisualization(false);
  }

  onClickExplore = () => {
    const { project, datasetSelector, exploreSelector, push } = this.props;
    push(`/projects/${ project.id }/datasets/${ datasetSelector.id }/visualize/explore${ exploreSelector.queryString }`);
  }

  getTableData = () => {
    const { project, visualization, conditionals, getVisualizationTableData, dataConfig } = this.props;
    getVisualizationTableData(project.id, visualization.spec.id, conditionals.items, dataConfig);
  }

  render() {
    const { visualization, fieldNameToColor, specs, exportedSpecs } = this.props;
    const saved = (visualization.isSaving || (!visualization.isSaving && visualization.exportedSpecId) || visualization.exported) ? true : false;

    let visualizationTitle;
    let fileName;
    if (visualization.spec && visualization.spec.meta) {
      visualizationTitle = (visualization.spec.meta.desc || 'visualization');
      fileName = 'DIVE | ' + visualizationTitle.charAt(0).toUpperCase() + visualizationTitle.slice(1);
    }

    const visualizationId = visualization.spec.id;
    const visualizationFieldIds = visualization.spec.fieldIds;
    let relatedSpecs = [];
    if (visualizationFieldIds) {
      relatedSpecs = specs.items.filter((s) => (s.id !== visualizationId && s.fieldIds.filter((n) => visualizationFieldIds.indexOf(n) !== -1).length > 0));
    }
    console.log('Related', specs, visualizationFieldIds, relatedSpecs);

    return (
      <VisualizationView
        className={ styles.fillContainer }
        visualization={ visualization }
        fieldNameToColor={ fieldNameToColor }
        getTableData={ this.getTableData }
        relatedSpecs={ relatedSpecs }
        exportedSpecs={ exportedSpecs }
      >
        <div className={ styles.hidden }>
          <canvas id="export-canvas"/>
        </div>
        <div className={ styles.headerControlRow }>
          <div className={ styles.headerControl }>
            <Button iconName='undo' text="Back to Explore" onClick={ this.onClickExplore } fullWidth={ true }/>
          </div>
          <div className={ styles.headerControl }>
            <div className="pt-button-group">
              <Button onClick={ this.onClickShare }>
                { visualization.isExporting && "Exporting..." }
                { !visualization.isExporting && "URL" }
              </Button>
              <Button text="SVG" onClick={ () => this.saveAs(fileName, 'svg') } fullWidth={ true }/>
              <Button text="PNG" onClick={ () => this.saveAs(fileName, 'png') } fullWidth={ true }/>
              <Button text="PDF" onClick={ () => this.saveAs(fileName, 'pdf') } fullWidth={ true }/>
            </div>
          </div>
          <div className={ styles.headerControl }>
            <Button onClick={ this.saveVisualization } active={ saved } buttonStyle='blueActive' loading={ visualization.isSaving }>
              { !visualization.isSaving && !visualization.exportedSpecId &&
                <div><span className='pt-icon-standard pt-icon-star-empty' />Save</div>
              }
              { visualization.exportedSpecId &&
                <div><span className='pt-icon-standard pt-icon-star' />Saved</div>
              }
            </Button>
          </div>
        </div>
      </VisualizationView>
    );
  }
}

SingleVisualizationView.propTypes = {
  project: PropTypes.object.isRequired,
  visualization: PropTypes.object.isRequired,
  exploreSelector: PropTypes.object.isRequired,
  specId: PropTypes.string
};

function mapStateToProps(state) {
  const { project, conditionals, datasets, datasetSelector, exportedSpecs, specs, fieldProperties, visualization, exploreSelector } = state;

  return {
    project,
    fieldNameToColor: fieldProperties.fieldNameToColor,
    visualization,
    specs,
    dataConfig: visualization.config.data,
    exploreSelector,
    conditionals,
    datasets,
    datasetSelector,
    exportedSpecs
  }
}

export default connect(mapStateToProps, {
  push,
  fetchSpecVisualizationIfNeeded,
  getVisualizationTableData,
  createExportedSpec,
  setShareWindow,
  fetchDatasets,
})(SingleVisualizationView);
