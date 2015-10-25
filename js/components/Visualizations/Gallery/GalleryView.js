import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { clearVisualization, fetchSpecsIfNeeded } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import Visualization from '../Visualization';

export class GalleryView extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { datasetSelector, project, specs, fetchSpecsIfNeeded, clearVisualization, fieldProperties } = this.props;
    const noSpecsAndNotFetching = (!specs.loaded && !specs.isFetching);

    if (project.properties.id && datasetSelector.datasetId && noSpecsAndNotFetching) {
      fetchSpecsIfNeeded(project.properties.id, datasetSelector.datasetId, null);
    }

    clearVisualization();
  }

  componentDidUpdate(previousProps) {
    const { datasetSelector, project, specs, gallerySelector, fetchSpecsIfNeeded } = this.props;
    const datasetChanged = (datasetSelector.datasetId !== previousProps.datasetSelector.datasetId);
    const noSpecsAndNotFetching = (!specs.loaded && !specs.isFetching);
    const gallerySelectorChanged = (gallerySelector.updatedAt !== previousProps.gallerySelector.updatedAt);

    if (project.properties.id && datasetSelector.datasetId && (datasetChanged || gallerySelectorChanged || noSpecsAndNotFetching)) {
      fetchSpecsIfNeeded(project.properties.id, datasetSelector.datasetId, gallerySelector.fieldProperties);
    }
  }

  handleClick(specId) {
    this.props.pushState(null, `/projects/${this.props.project.properties.id}/visualize/builder/${ specId }`);
  }

  render() {
    const { specs, filters } = this.props;

    if (specs.isFetching) {
      return (
        <div className={ styles.specsContainer }>
          <div className={ styles.watermark }>Fetching visualizations...</div>
        </div>
      );
    }

    const selectedVisualizationTypes = filters.visualizationTypes
      .filter((filter) => filter.selected)
      .map((filter) => filter.type);

    const filteredSpecs = specs.items.filter((spec) =>
      (selectedVisualizationTypes.length == 0) || selectedVisualizationTypes.some((filter) => 
        spec.vizTypes.indexOf(filter) >= 0
      )
    );

    if (!filteredSpecs.length) {
      return (
        <div className={ styles.specsContainer }>
          <div className={ styles.watermark }>No visualizations</div>
        </div>
      );      
    }

    return (
      <div className={ styles.specsContainer }>
        { filteredSpecs.map((spec) =>
            <div className={ styles.blockContainer } key={ spec.id }>
              <Visualization
                containerClassName="block"
                visualizationClassName="visualization"
                overflowTextClassName="overflowText"
                visualizationTypes={ selectedVisualizationTypes }
                spec={ spec }
                data={ spec.data.visualize }
                onClick={ this.handleClick }
                isMinimalView={ true }
                showHeader={ true } />
            </div>
          )
        }
      </div>
    );
  }
}

GalleryView.propTypes = {
  project: PropTypes.object.isRequired,
  specs: PropTypes.object.isRequired,
  gallerySelector: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, filters, specs, gallerySelector, datasetSelector } = state;
  return {
    project,
    filters,
    specs,
    gallerySelector,
    datasetSelector
  }
}

export default connect(mapStateToProps, { pushState, fetchSpecsIfNeeded, clearVisualization })(GalleryView);
