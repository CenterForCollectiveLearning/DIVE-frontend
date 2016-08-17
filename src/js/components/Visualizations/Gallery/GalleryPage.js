import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { setGalleryQueryString } from '../../../actions/VisualizationActions';

import styles from '../Visualizations.sass';
import GallerySidebar from './GallerySidebar';
import GalleryView from './GalleryView';

class GalleryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uniqueSpecVisualizationTypes: [],
      visualizationTypes: []
    }

    this.getUniqueSpecVisualizationTypes = this.getUniqueSpecVisualizationTypes.bind(this);
    this.getFilteredVisualizationTypes = this.getFilteredVisualizationTypes.bind(this);
    this.updateVisualizationTypes = this.updateVisualizationTypes.bind(this);
  }

  componentWillMount() {
    this.props.setGalleryQueryString(this.props.location.query);
    this.setState({
      uniqueSpecVisualizationTypes: this.getUniqueSpecVisualizationTypes(this.props.specs)
    }, () => this.updateVisualizationTypes(this.props.filters.visualizationTypes));
  }

  componentWillReceiveProps(nextProps) {
    const { location, specs, filters, setGalleryQueryString } = nextProps;

    if (location.query !== this.props.location.query) {
      setGalleryQueryString(location.query);
    }

    if (specs.updatedAt != this.props.specs.updatedAt || filters.updatedAt != this.props.filters.updatedAt) {
      this.setState({
        uniqueSpecVisualizationTypes: this.getUniqueSpecVisualizationTypes(specs)
      }, () => this.updateVisualizationTypes(filters.visualizationTypes));
    }
  }

  updateVisualizationTypes(visualizationTypes) {
    this.setState({
      visualizationTypes: this.getFilteredVisualizationTypes(visualizationTypes)
    });
  }

  getUniqueSpecVisualizationTypes(specs) {
    const allSpecVisualizationTypes = specs.items
      .map((s) => s.vizTypes);

    if (allSpecVisualizationTypes.length) {
      const uniqueSpecVisualizationTypes = allSpecVisualizationTypes.reduce((previousVizTypes, currentVizTypes) => [ ...previousVizTypes, ...currentVizTypes ]);
      return [ ...new Set(uniqueSpecVisualizationTypes) ];
    }

    return [];
  }

  getFilteredVisualizationTypes(visualizationTypes) {
    return visualizationTypes
      .map((filter) =>
        new Object({
          ...filter,
          disabled: this.state.uniqueSpecVisualizationTypes.indexOf(filter.type) == -1
        })
      );
  }

  render() {
    const { projectTitle } = this.props;

    var queryFields = [];
    if (this.props.location.query['fields[]']) {
      if (Array.isArray(this.props.location.query['fields[]'])) {
        queryFields = this.props.location.query['fields[]'];
      } else {
        queryFields = [this.props.location.query['fields[]']];
      }
    }

    const visualizationTypeObjects = this.state.visualizationTypes;
    const filteredVisualizationTypes = visualizationTypeObjects
      .filter((visualizationTypeObject) => visualizationTypeObject.selected);

    const visualizationTypes = (filteredVisualizationTypes.length ? filteredVisualizationTypes : visualizationTypeObjects)
      .map((visualizationTypeObject) => visualizationTypeObject.type);

    return (
      <DocumentTitle title={ 'Explore' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.galleryContainer }` }>
          <GalleryView filteredVisualizationTypes={ visualizationTypes } />
          <GallerySidebar filteredVisualizationTypes={ visualizationTypes } visualizationTypes={ visualizationTypeObjects } queryFields={ queryFields }/>
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { project, filters, specs } = state;
  return { projectTitle: project.properties.title, filters, specs };
}

export default connect(mapStateToProps, { setGalleryQueryString })(GalleryPage);
