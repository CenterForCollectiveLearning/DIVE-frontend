import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { clearVisualization, fetchSpecs, selectSortingFunction } from '../../../actions/VisualizationActions';
import styles from '../Visualizations.sass';

import HeaderBar from '../../Base/HeaderBar';
import DropDownMenu from '../../Base/DropDownMenu';
import Visualization from '../Visualization';

export class GalleryView extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const { datasetSelector, project, specs, fetchSpecs, clearVisualization, gallerySelector } = this.props;
    const noSpecsAndNotFetching = (gallerySelector.specs.length == 0 && !specs.isFetching && !specs.error);

    if (project.properties.id && datasetSelector.datasetId && gallerySelector.fieldProperties.length && noSpecsAndNotFetching) {
      fetchSpecs(project.properties.id, datasetSelector.datasetId, gallerySelector.fieldProperties);
    }

    clearVisualization();
  }

  componentDidUpdate(previousProps) {
    const { datasetSelector, project, specs, gallerySelector, fetchSpecs } = this.props;
    const datasetChanged = (datasetSelector.datasetId !== previousProps.datasetSelector.datasetId);
    const noSpecsAndNotFetching = (gallerySelector.specs.length == 0 && !specs.isFetching && !specs.error);
    const gallerySelectorChanged = (gallerySelector.updatedAt !== previousProps.gallerySelector.updatedAt);

    if (project.properties.id && datasetSelector.datasetId && gallerySelector.fieldProperties.length && (datasetChanged || gallerySelectorChanged || noSpecsAndNotFetching)) {
      fetchSpecs(project.properties.id, datasetSelector.datasetId, gallerySelector.fieldProperties);
    }
  }

  handleClick(specId) {
    this.props.pushState(null, `/projects/${this.props.project.properties.id}/visualize/builder/${ specId }`);
  }

  render() {
    const { specs, filters, gallerySelector, selectSortingFunction } = this.props;

    const selectedVisualizationTypes = filters.visualizationTypes
      .filter((filter) => filter.selected)
      .map((filter) => filter.type);

    const filteredSpecs = gallerySelector.specs.filter((spec) =>
      (selectedVisualizationTypes.length == 0) || selectedVisualizationTypes.some((filter) => 
        spec.vizTypes.indexOf(filter) >= 0
      )
    );

    return (
      <div className={ styles.specsContainer }>
        <div className={ styles.innerSpecsContainer }>
          <HeaderBar
            header={ gallerySelector.title.map((construct, i) =>
              <span
                key={ `construct-${ construct.type }-${ i }` }
                className={ `${ styles.headerFragment } ${ styles[construct.type] }` }>
                { construct.string }
              </span>
            )}
            actions={ filteredSpecs.length > 0 && 
              <div className={ styles.sortingControl }>
                <span>Sort by </span>
                <DropDownMenu
                  options={ gallerySelector.sortingFunctions }
                  valueMember="value"
                  displayTextMember="label"
                  onChange={ selectSortingFunction } />
              </div>
            }/>
          <div className={ styles.specBlocksContainer }>
            { specs.isFetching &&
              <div className={ styles.watermark }>
                { specs.progress != null ? specs.progress : 'Fetching visualizations…' }
              </div> 
            }
            { !specs.isFetching && filteredSpecs.length == 0 &&
              <div className={ styles.watermark }>No visualizations</div>
            }
            { !specs.isFetching && filteredSpecs.length > 0 && filteredSpecs.map((spec) =>
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
        </div>
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

export default connect(mapStateToProps, { pushState, fetchSpecs, clearVisualization, selectSortingFunction })(GalleryView);
