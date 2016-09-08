import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import canvg from 'canvg-browser';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

import { fetchSpecVisualizationIfNeeded, createExportedSpec, setShareWindow } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import VisualizationView from '../VisualizationView';
import BareDataGrid from '../../Base/BareDataGrid';
import RaisedButton from '../../Base/RaisedButton';

export class BuilderView extends Component {
  constructor(props) {
    super(props);

    this.saveVisualization = this.saveVisualization.bind(this);
    this.onClickShare = this.onClickShare.bind(this);
    this.onClickGallery = this.onClickGallery.bind(this);
  }

  componentWillMount() {
    const { project, specId, visualization, fetchSpecVisualizationIfNeeded } = this.props;

    if (project.properties.id && !visualization.spec.id) {
      fetchSpecVisualizationIfNeeded(project.properties.id, specId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { visualization, conditionals, project, fetchSpecVisualizationIfNeeded } = this.props;

    const exportingChanged = visualization.isExporting != nextProps.visualization.isExporting;
    const conditionalsChanged = nextProps.conditionals.lastUpdated != conditionals.lastUpdated;
    const configChanged = nextProps.visualization.config != visualization.config;

    if (nextProps.project.properties.id && !visualization.isFetching && (!visualization.spec.id || conditionalsChanged || configChanged)) {
      fetchSpecVisualizationIfNeeded(nextProps.project.properties.id, nextProps.specId, nextProps.conditionals.items, nextProps.visualization.config);
    }

    if (exportingChanged && !nextProps.visualization.isExporting && nextProps.visualization.shareWindow) {
      nextProps.visualization.shareWindow.location.href = `/share/projects/${ nextProps.project.properties.id }/visualizations/${ nextProps.visualization.exportedSpecId }`;
    }
  }

  saveAs(filetitle = 'test', format = 'png') {
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

  saveVisualization(saveAction = true) {
    const { project, visualization, createExportedSpec, conditionals } = this.props;
    createExportedSpec(project.properties.id, visualization.spec.id, visualization.visualizationData, conditionals.items, visualization.config, saveAction);
  }

  onClickShare() {
    setShareWindow(window.open('about:blank'));
    this.saveVisualization(false);
  }

  onClickGallery() {
    const { project, datasetSelector, gallerySelector, push } = this.props;
    push(`/projects/${ project.properties.id }/datasets/${ datasetSelector.datasetId }/visualize/explore${ gallerySelector.queryString }`);
  }

  render() {
    const { visualization, fieldNameToColor } = this.props;
    const saved = (visualization.isSaving || (!visualization.isSaving && visualization.exportedSpecId) || visualization.exported) ? true : false;

    let visualizationTitle;
    let fileName;
    if (visualization.spec && visualization.spec.meta) {
      visualizationTitle = (visualization.spec.meta.desc || 'visualization');
      fileName = 'DIVE | ' + visualizationTitle.charAt(0).toUpperCase() + visualizationTitle.slice(1);
    }

    return (
      <VisualizationView visualization={ visualization } fieldNameToColor={ fieldNameToColor }>
        <div className={ styles.hidden }>
          <canvas id="export-canvas"/>
        </div>
        <div className={ styles.headerControlRow }>
          <div className={ styles.headerControl }>
            <RaisedButton label="Back to Gallery" onClick={ this.onClickGallery } fullWidth={ true }/>
          </div>
          <div className={ styles.headerControl }>
            <RaisedButton onClick={ this.onClickShare }>
              { visualization.isExporting && "Exporting..." }
              { !visualization.isExporting && "URL" }
            </RaisedButton>
            <RaisedButton label="SVG" onClick={ this.saveAs.bind(this, fileName, 'svg') } fullWidth={ true }/>
            <RaisedButton label="PNG" onClick={ this.saveAs.bind(this, fileName, 'png') } fullWidth={ true }/>
            <RaisedButton label="PDF" onClick={ this.saveAs.bind(this, fileName, 'pdf') } fullWidth={ true }/>
          </div>
          <div className={ styles.headerControl }>
            <RaisedButton onClick={ this.saveVisualization } active={ saved }>
              { !visualization.isSaving && visualization.exportedSpecId && <i className="fa fa-star"></i> }
              { !visualization.exportedSpecId && <i className="fa fa-star-o"></i> }
            </RaisedButton>
          </div>
        </div>
      </VisualizationView>
    );
  }
}

BuilderView.propTypes = {
  project: PropTypes.object.isRequired,
  visualization: PropTypes.object.isRequired,
  gallerySelector: PropTypes.object.isRequired,
  specId: PropTypes.string
};

function mapStateToProps(state) {
  const { project, conditionals, datasetSelector, fieldProperties, visualization, gallerySelector } = state;
  return {
    project,
    datasetSelector,
    fieldNameToColor: fieldProperties.fieldNameToColor,
    visualization,
    gallerySelector,
    conditionals
  }
}

export default connect(mapStateToProps, { push, fetchSpecVisualizationIfNeeded, createExportedSpec, setShareWindow })(BuilderView);
