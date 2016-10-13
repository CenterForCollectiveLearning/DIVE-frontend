import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { parseFromQueryObject } from '../../../helpers/helpers'
import { setExploreQueryString } from '../../../actions/VisualizationActions';

import styles from '../Visualizations.sass';
import ExploreSidebar from './ExploreSidebar';
import ExploreView from './ExploreView';

class ExploreBasePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uniqueSpecVisualizationTypes: [],
      visualizationTypes: []
    }
  }

  componentWillMount() {
    this.props.setExploreQueryString(this.props.location.query);
    this.setState({
      uniqueSpecVisualizationTypes: this.getUniqueSpecVisualizationTypes(this.props.specs)
    }, () => this.updateVisualizationTypes(this.props.filters.visualizationTypes));
  }

  componentWillReceiveProps(nextProps) {
    const { location, specs, filters, setExploreQueryString } = nextProps;

    if (location.query !== this.props.location.query) {
      setExploreQueryString(location.query);
    }

    if (specs.updatedAt != this.props.specs.updatedAt || filters.updatedAt != this.props.filters.updatedAt) {
      this.setState({
        uniqueSpecVisualizationTypes: this.getUniqueSpecVisualizationTypes(specs)
      }, () => this.updateVisualizationTypes(filters.visualizationTypes));
    }
  }

  updateVisualizationTypes = (visualizationTypes) => {
    this.setState({
      visualizationTypes: this.getFilteredVisualizationTypes(visualizationTypes)
    });
  }

  getUniqueSpecVisualizationTypes = (specs) => {
    const allSpecVisualizationTypes = specs.items
      .map((s) => s.vizTypes);

    if (allSpecVisualizationTypes.length) {
      const uniqueSpecVisualizationTypes = allSpecVisualizationTypes.reduce((previousVizTypes, currentVizTypes) => [ ...previousVizTypes, ...currentVizTypes ]);
      return [ ...new Set(uniqueSpecVisualizationTypes) ];
    }

    return [];
  }

  getFilteredVisualizationTypes = (visualizationTypes) => {
    return visualizationTypes
      .map((filter) =>
        new Object({
          ...filter,
          disabled: this.state.uniqueSpecVisualizationTypes.indexOf(filter.type) == -1
        })
      );
  }

  render() {
    const { projectTitle, queryObject, fieldIds } = this.props;

    const visualizationTypeObjects = this.state.visualizationTypes;
    const filteredVisualizationTypes = visualizationTypeObjects
      .filter((visualizationTypeObject) => visualizationTypeObject.selected);

    const visualizationTypes = (filteredVisualizationTypes.length ? filteredVisualizationTypes : visualizationTypeObjects)
      .map((visualizationTypeObject) => visualizationTypeObject.type);

    return (
      <DocumentTitle title={ 'Explore' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.galleryContainer }` }>
          <ExploreView
            filteredVisualizationTypes={ visualizationTypes }
            fieldIds={ fieldIds }
          />
          <ExploreSidebar
            filteredVisualizationTypes={ visualizationTypes }
            visualizationTypes={ visualizationTypeObjects }
            queryObject={ queryObject }
            fieldIds={ fieldIds }
          />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, filters, specs } = state;
  const queryObject = ownProps.location.query;

  return {
    projectTitle: project.title,
    queryObject: queryObject,
    fieldIds: parseFromQueryObject(queryObject, 'fieldIds', true),
    filters,
    specs
  };
}

export default connect(mapStateToProps, { setExploreQueryString })(ExploreBasePage);
