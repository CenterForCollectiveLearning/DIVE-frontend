import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

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
    const { visualization, project, fetchSpecVisualizationIfNeeded } = this.props;

    const exportingChanged = visualization.isExporting != nextProps.visualization.isExporting;
    const conditionalsChanged = nextProps.visualization.conditionals != visualization.conditionals;
    const configChanged = nextProps.visualization.config != visualization.config;

    if (nextProps.project.properties.id && !visualization.isFetching && (!visualization.spec.id || conditionalsChanged || configChanged)) {
      fetchSpecVisualizationIfNeeded(nextProps.project.properties.id, nextProps.specId, nextProps.visualization.conditionals, nextProps.visualization.config);
    }

    if (exportingChanged && !nextProps.visualization.isExporting && nextProps.visualization.shareWindow) {
      nextProps.visualization.shareWindow.location.href = `/share/projects/${ nextProps.project.properties.id }/visualizations/${ nextProps.visualization.exportedSpecId }`;
    }
  }

  saveVisualization(saveAction = true) {
    const { project, visualization, createExportedSpec } = this.props;
    createExportedSpec(project.properties.id, visualization.spec.id, visualization.visualizationData, visualization.conditionals, visualization.config, saveAction);
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
    const { visualization } = this.props;
    const disabled = (visualization.isSaving || (!visualization.isSaving && visualization.exportedSpecId) || visualization.exported) ? true : false;

    return (
      <VisualizationView visualization={ visualization }>
        <div className={ styles.headerControlRow }>
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
            <RaisedButton onClick={ this.saveVisualization } disabled={ disabled }>
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
  const { project, datasetSelector, visualization, gallerySelector } = state;
  return {
    project,
    datasetSelector,
    visualization,
    gallerySelector
  }
}

export default connect(mapStateToProps, { push, fetchSpecVisualizationIfNeeded, createExportedSpec, setShareWindow })(BuilderView);
