import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers'
import { setPersistedQueryString, getInitialState } from '../../../actions/VisualizationActions';

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
    } else {
      if ( fieldProperties.items.length ) {
        this.setRecommendedInitialState(fieldProperties);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { queryObject: currentQueryObject } = this.props;
    const { specs, filters, fieldProperties, queryObject: nextQueryObject } = nextProps;

    if (specs.updatedAt != this.props.specs.updatedAt || filters.updatedAt != this.props.filters.updatedAt) {
      this.setState({
        uniqueSpecVisualizationTypes: this.getUniqueSpecVisualizationTypes(specs)
      }, () => this.updateVisualizationTypes(filters.visualizationTypes));
    }

    const shouldRecommendInitialState = Object.keys(currentQueryObject) == 0 && Object.keys(nextQueryObject).length == 0;
    if ( shouldRecommendInitialState && fieldProperties.items.length) {
      this.setRecommendedInitialState(fieldProperties);
    }
  }

  setRecommendedInitialState(fieldProperties) {
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString } = this.props;

    const initialState = getInitialState(project.id, datasetSelector.datasetId, fieldProperties.items);
    const newQueryString = updateQueryString(queryObject, initialState);
    setPersistedQueryString(newQueryString);
    replace(`${ pathname }${ newQueryString }`);
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
    const { project, filteredVisualizationTypes, pathname, queryObject, fieldIds, sortBy, recommendationMode } = this.props;
    const allValidVisualizationTypes = this.state.visualizationTypes;

    return (
      <DocumentTitle title={ 'Explore' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.galleryContainer }` }>
          <ExploreView
            filteredVisualizationTypes={ filteredVisualizationTypes }
            sortBy={ sortBy }
            recommendationMode={ recommendationMode }
            fieldIds={ fieldIds }
          />
          <ExploreSidebar
            filteredVisualizationTypes={ filteredVisualizationTypes }
            sortBy={ sortBy }
            recommendationMode={ recommendationMode }
            visualizationTypes={ allValidVisualizationTypes }
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
    exploreSelector,
    specs,
    filters,
    queryObject: queryObject,
    pathname: pathname,
    persistedQueryString: exploreSelector.queryString,
    recommendationMode: parseFromQueryObject(queryObject, 'recommendationMode'),
    sortBy: parseFromQueryObject(queryObject, 'sortBy'),
    filteredVisualizationTypes: parseFromQueryObject(queryObject, 'filteredVisualizationTypes', true),
    fieldIds: parseFromQueryObject(queryObject, 'fieldIds', true),
  };
}

export default connect(mapStateToProps, {
  replace,
  setPersistedQueryString
})(ExploreBasePage);
