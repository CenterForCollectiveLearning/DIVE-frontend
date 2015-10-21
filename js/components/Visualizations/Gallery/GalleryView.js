import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { clearVisualization, fetchSpecsIfNeeded } from '../../../actions/VisualizationActions';
import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import styles from '../Visualizations.sass';

import Visualization from '../Visualization';

export class GalleryView extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { datasetSelector, project, specs, fetchSpecsIfNeeded, fetchFieldPropertiesIfNeeded, clearVisualization, fieldProperties } = this.props;
    const noSpecsAndNotFetching = (!specs.items.length && !specs.isFetching);

    if (project.properties.id && datasetSelector.datasetId && noSpecsAndNotFetching) {
      fetchSpecsIfNeeded(project.properties.id, datasetSelector.datasetId, null);
    }

    clearVisualization();
  }

  componentWillReceiveProps(nextProps) {
    const { datasetSelector, project, specs, fieldProperties, fetchSpecsIfNeeded } = this.props;
    const datasetChanged = (datasetSelector.datasetId !== nextProps.datasetSelector.datasetId);
    const noSpecsAndNotFetching = (!specs.items.length && !specs.isFetching);

    const fieldPropertiesChanged = (fieldProperties.updatedAt !== nextProps.fieldProperties.updatedAt);
    if (project.properties.id && nextProps.datasetSelector.datasetId && (datasetChanged || fieldPropertiesChanged || noSpecsAndNotFetching)) {
      fetchSpecsIfNeeded(project.properties.id, nextProps.datasetSelector.datasetId, nextProps.fieldProperties.items);
    }
  }

  handleClick(specId) {
    this.props.pushState(null, `/projects/${this.props.project.properties.id}/visualize/builder/${ specId }`);
  }

  render() {
    const { specs, filters } = this.props;
    const selectedVisualizationTypes = filters.visualizationTypes
      .filter((filter) => filter.selected)
      .map((filter) => filter.type);

    return (
      <div className={ styles.specsContainer }>
        { specs.isFetching &&
          <div className={ styles.watermark }>Fetching visualizations...</div>
        }
        { !specs.isFetching && specs.items.filter((spec) =>
            (selectedVisualizationTypes.length == 0) || selectedVisualizationTypes.some((filter) => 
              spec.vizTypes.indexOf(filter) >= 0
            )
          ).map((spec) =>
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
  fieldProperties: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, filters, specs, fieldProperties, datasetSelector } = state;
  return {
    project,
    filters,
    specs,
    fieldProperties,
    datasetSelector
  }
}

export default connect(mapStateToProps, { pushState, fetchSpecsIfNeeded, fetchFieldPropertiesIfNeeded, clearVisualization })(GalleryView);
