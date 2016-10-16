import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { parseFromQueryObject } from '../../../helpers/helpers'
import { setQueryString } from '../../../actions/VisualizationActions';

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
    const { fieldProperties, persistedQueryString, pathname, replace } = this.props;

    this.setState({
      uniqueSpecVisualizationTypes: this.getUniqueSpecVisualizationTypes(this.props.specs)
    }, () => this.updateVisualizationTypes(this.props.filters.visualizationTypes));

    if ( persistedQueryString ) {
      replace(`${ pathname }${ persistedQueryString }`);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { specs, filters, setQueryString } = nextProps;

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
    const { project, pathname, queryObject, fieldIds } = this.props;

    const visualizationTypeObjects = this.state.visualizationTypes;
    const filteredVisualizationTypes = visualizationTypeObjects
      .filter((visualizationTypeObject) => visualizationTypeObject.selected);

    const visualizationTypes = (filteredVisualizationTypes.length ? filteredVisualizationTypes : visualizationTypeObjects)
      .map((visualizationTypeObject) => visualizationTypeObject.type);

    return (
      <DocumentTitle title={ 'Explore' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.galleryContainer }` }>
          <ExploreView
            filteredVisualizationTypes={ visualizationTypes }
            fieldIds={ fieldIds }
          />
          <ExploreSidebar
            filteredVisualizationTypes={ visualizationTypes }
            visualizationTypes={ visualizationTypeObjects }
            pathname={ pathname }
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
  const { project, datasetSelector, exploreSelector, fieldProperties, filters, specs } = state;
  const pathname = ownProps.location.pathname;
  const queryObject = ownProps.location.query;

  return {
    project,
    datasetSelector,
    fieldProperties,
    queryObject: queryObject,
    pathname: pathname,
    persistedQueryString: exploreSelector.queryString,
    fieldIds: parseFromQueryObject(queryObject, 'fieldIds', true),
    filters,
    specs
  };
}

export default connect(mapStateToProps, { setQueryString, replace })(ExploreBasePage);
