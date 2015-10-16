import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { clearVisualization, fetchSpecsIfNeeded } from '../../actions/VisualizationActions';
import { fetchFieldPropertiesIfNeeded } from '../../actions/FieldPropertiesActions';
import styles from './Visualizations.sass';

import Visualization from './Visualization';

export class GalleryView extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { specSelector, project, fetchSpecsIfNeeded, fetchFieldPropertiesIfNeeded, clearVisualization, fieldProperties } = this.props;

    if (project.properties.id && specSelector.datasetId) {
      fetchSpecsIfNeeded(project.properties.id, specSelector.datasetId, null);
    }

    clearVisualization();
  }

  componentWillReceiveProps(nextProps) {
    const { specSelector, project, fieldProperties } = this.props;
    const datasetChanged = (specSelector.datasetId !== nextProps.specSelector.datasetId);

    const fieldPropertiesChanged = (fieldProperties.updatedAt !== nextProps.fieldProperties.updatedAt);
    if (project.properties.id) {
      if (datasetChanged) {
        this.props.fetchSpecsIfNeeded(project.properties.id, nextProps.specSelector.datasetId, fieldProperties.items);
        this.props.fetchFieldPropertiesIfNeeded(project.properties.id, nextProps.specSelector.datasetId);
      } else if (fieldPropertiesChanged) {
        this.props.fetchSpecsIfNeeded(project.properties.id, nextProps.specSelector.datasetId, fieldProperties.items);
      }
    }
  }

  handleClick(specId) {
    this.props.pushState(null, `/projects/${this.props.project.properties.id}/visualize/builder/${ specId }`);
  }

  render() {
    return (
      <div className={ styles.specsContainer }>
        { this.props.specs.items.map((spec) =>
          <div className={ styles.blockContainer } key={ spec.id }>
            <Visualization
              containerClassName="block"
              visualizationClassName="visualization"
              overflowTextClassName="overflowText"
              spec={ spec }
              data={ spec.data.visualize }
              onClick={ this.handleClick }
              isMinimalView={ true }
              showHeader={ true } />
          </div>
        )}
      </div>
    );
  }
}

GalleryView.propTypes = {
  project: PropTypes.object.isRequired,
  specs: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  specSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, specs, fieldProperties, specSelector } = state;
  return {
    project,
    specs,
    fieldProperties,
    specSelector
  }
}

export default connect(mapStateToProps, { pushState, fetchSpecsIfNeeded, fetchFieldPropertiesIfNeeded, clearVisualization })(GalleryView);
