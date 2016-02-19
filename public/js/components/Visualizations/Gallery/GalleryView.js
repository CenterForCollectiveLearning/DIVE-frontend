import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { clearVisualization, fetchSpecs, selectSortingFunction } from '../../../actions/VisualizationActions';
import { fetchExportedVisualizationSpecs } from '../../../actions/ComposeActions';

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
    const { datasetSelector, project, specs, gallerySelector, exportedSpecs, fetchExportedVisualizationSpecs, fetchSpecs } = this.props;
    const datasetChanged = (datasetSelector.datasetId !== previousProps.datasetSelector.datasetId);
    const noSpecsAndNotFetching = (gallerySelector.specs.length == 0 && !specs.isFetching && !specs.error);
    const gallerySelectorChanged = (gallerySelector.updatedAt !== previousProps.gallerySelector.updatedAt);

    if (project.properties.id && datasetSelector.datasetId && gallerySelector.fieldProperties.length && (datasetChanged || gallerySelectorChanged || noSpecsAndNotFetching)) {
      fetchSpecs(project.properties.id, datasetSelector.datasetId, gallerySelector.fieldProperties);
    }

    if (project.properties.id && exportedSpecs.items.length == 0 && !exportedSpecs.isFetching && !exportedSpecs.loaded) {
      fetchExportedVisualizationSpecs(project.properties.id);
    }
  }

  handleClick(specId) {
    this.props.pushState(null, `/projects/${ this.props.project.properties.id }/datasets/${ this.props.datasetSelector.datasetId }/visualize/builder/${ specId }`);
  }

  render() {
    const { specs, filters, gallerySelector, exportedSpecs, selectSortingFunction } = this.props;

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
                <div className={ styles.visualizationBlocksContainer } key={ spec.id }>
                  <Visualization
                    visualizationTypes={ selectedVisualizationTypes }
                    spec={ spec }
                    data={ spec.data.visualize }
                    onClick={ this.handleClick }
                    isMinimalView={ true }
                    showHeader={ true } />
                  <div className={ styles.starContainer }>
                    <i className={ exportedSpecs.items.find((exportedSpec) => exportedSpec.specId == spec.id) ? 'fa fa-star ' + styles.starred : 'fa fa-star-o' }></i>
                  </div>
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
  datasetSelector: PropTypes.object.isRequired,
  exportedSpecs: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, filters, specs, gallerySelector, datasetSelector, exportedSpecs } = state;
  return {
    project,
    filters,
    specs,
    gallerySelector,
    datasetSelector,
    exportedSpecs
  }
}

export default connect(mapStateToProps, { pushState, fetchSpecs, fetchExportedVisualizationSpecs, clearVisualization, selectSortingFunction })(GalleryView);
