import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { saveSvgAsPng } from 'save-svg-as-png';
import canvg from 'canvg-browser';
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

  saveAs(filename = 'test', format = 'png') {
    let mimetype;
    switch (format) {
      case 'svg':
        mimetype = 'image/svg+xml'
        var svgElement = document.getElementById('chart').getElementsByTagName('svg')[0];
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        var svgData = svgElement.outerHTML;
        var svgBlob = new Blob([svgData], { type: 'application/svg+xml;' });
        saveAs(svgBlob, `${ filename }.${ format }`);

        break;
      case 'png':
        mimetype = 'image/png'
        var svgElement = document.getElementById('chart').getElementsByTagName('svg')[0];
        var canvasElement = document.getElementById('export-canvas');

        var ctx = canvasElement.getContext('2d');
        ctx.fillStyle = 'white';
        console.log(canvasElement.width, canvasElement.height);
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.drawImage(canvasElement, 0, 0)

        canvg(canvasElement, svgElement.outerHTML)
        // const dataUrl = canvasElement.toDataURL("image/png");
        // saveAs(dataUrl);
        canvasElement.toBlob(function(blob) {
          saveAs(blob, `${ filename }.${ format }`);
        }, mimetype);
        break;
      case 'pdf':
        mimetype = 'application/pdf'
        break;
      default:
        mimetype = 'image/png'
    }

    console.log('Saving visualization', format, mimetype);
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
    const fileName = 'test';

    return (
      <VisualizationView visualization={ visualization } fieldNameToColor={ fieldNameToColor }>
        <div className={ styles.hidden }>
          <canvas id="export-canvas"/>
        </div>
        <div className={ styles.headerControlRow }>
          <div className={ styles.headerControl }>
            <RaisedButton label="SVG" onClick={ this.saveAs.bind(this, fileName, 'svg') } fullWidth={ true }/>
            <RaisedButton label="PNG" onClick={ this.saveAs.bind(this, fileName, 'png') } fullWidth={ true }/>
            <RaisedButton label="PDF" onClick={ this.saveAs.bind(this, fileName, 'pdf') } fullWidth={ true }/>
          </div>
          <div className={ styles.headerControl }>
            <RaisedButton label="Back to Gallery" onClick={ this.onClickGallery } fullWidth={ true }/>
          </div>
          <div className={ styles.headerControl }>
            <RaisedButton onClick={ this.onClickShare }>
              { visualization.isExporting && "Exporting..." }
              { !visualization.isExporting && "Share" }
            </RaisedButton>
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
