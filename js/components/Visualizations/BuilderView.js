import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { fetchSpecVisualizationIfNeeded, createExportedSpec } from '../../actions/VisualizationActions';
import styles from './Visualizations.sass';

import VisualizationView from './VisualizationView';
import RaisedButton from '../Base/RaisedButton';

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

    if (nextProps.project.properties.id && !nextProps.visualization.spec.id && !visualization.spec.isFetching) {
      fetchSpecVisualizationIfNeeded(nextProps.project.properties.id, nextProps.specId);
    }

    if (exportingChanged && !nextProps.visualization.isExporting) {
      window.open(`/share/projects/${ nextProps.project.properties.id }/visualizations/${ nextProps.visualization.exportedSpecId }`);
    }
  }

  onClickShare() {
    const { createExportedSpec, project, visualization } = this.props;

    createExportedSpec(project.properties.id, visualization.spec.id, {}, {});
  }

  onClickGallery() {
    this.props.pushState(null, `/projects/${this.props.project.properties.id}/visualize/gallery`);
  }

  render() {
    const { visualization } = this.props;
    return (
      <VisualizationView visualization={ visualization }>
        <RaisedButton onClick={ this.onClickShare }>
          { visualization.isExporting && "Exporting..." }
          { !visualization.isExporting && "Share" }
        </RaisedButton>
        <RaisedButton label="Gallery" onClick={ this.onClickGallery }/>
      </VisualizationView>
    );
  }
}

BuilderView.propTypes = {
  project: PropTypes.object.isRequired,
  visualization: PropTypes.object.isRequired,
  specId: PropTypes.string
};

function mapStateToProps(state) {
  const { project, visualization } = state;
  return {
    project,
    visualization
  }
}

export default connect(mapStateToProps, { pushState, fetchSpecVisualizationIfNeeded, createExportedSpec })(BuilderView);
