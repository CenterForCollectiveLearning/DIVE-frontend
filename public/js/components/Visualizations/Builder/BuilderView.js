import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { fetchSpecVisualizationIfNeeded, createExportedSpec, setShareWindow } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import VisualizationView from '../VisualizationView';
import RaisedButton from '../../Base/RaisedButton';

export class BuilderView extends Component {
  constructor(props) {
    super(props);

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
    const visualizationSpecChanged = visualization.lastUpdated != nextProps.visualization.lastUpdated;

    if (nextProps.project.properties.id && (!nextProps.visualization.spec.id || visualizationSpecChanged) && !visualization.spec.isFetching) {
      fetchSpecVisualizationIfNeeded(nextProps.project.properties.id, nextProps.specId, nextProps.visualization.conditionals);
    }

    if (exportingChanged && !nextProps.visualization.isExporting && nextProps.visualization.shareWindow) {
      nextProps.visualization.shareWindow.location.href = `/share/projects/${ nextProps.project.properties.id }/visualizations/${ nextProps.visualization.exportedSpecId }`;
    }
  }

  onClickShare() {
    const { project, visualization, createExportedSpec, setShareWindow } = this.props;

    setShareWindow(window.open('about:blank'));
    createExportedSpec(project.properties.id, visualization.spec.id, {}, {});
  }

  onClickGallery() {
    const { project, datasetSelector, gallerySelector, pushState } = this.props;
    pushState(null, `/projects/${ project.properties.id }/datasets/${ datasetSelector.datasetId }/visualize/gallery${ gallerySelector.queryString }`);
  }

  render() {
    const { visualization } = this.props;
    return (
      <VisualizationView visualization={ visualization }>
        <RaisedButton onClick={ this.onClickShare }>
          { visualization.isExporting && "Exporting..." }
          { !visualization.isExporting && "Share" }
        </RaisedButton>
        <RaisedButton label="Back to Gallery" onClick={ this.onClickGallery } fullWidth={ true }/>
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

export default connect(mapStateToProps, { pushState, fetchSpecVisualizationIfNeeded, createExportedSpec, setShareWindow })(BuilderView);
