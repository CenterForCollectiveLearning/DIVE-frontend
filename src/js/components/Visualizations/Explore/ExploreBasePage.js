import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers'
import { setPersistedQueryString, getInitialState } from '../../../actions/VisualizationActions';

import ProjectTopBar from '../../ProjectTopBar';
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
    const { fieldProperties, persistedQueryString, pathname, replace, queryObject: currentQueryObject } = this.props;

    this.setState({
      uniqueSpecVisualizationTypes: this.getUniqueSpecVisualizationTypes(this.props.specs)
    }, () => this.updateVisualizationTypes(this.props.filters.visualizationTypes));

    if ( persistedQueryString && !Object.keys(currentQueryObject)) {
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

    // Handling inconsistent state, default selection of certain fields
    this.reconcileState(nextProps);
  }

  reconcileState(nextProps) {
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString, fieldProperties, fieldIds } = nextProps;

    // Limit number of selected fields to three
    const numFields = fieldIds.length;
    if ( numFields > 3 ) {
      // TODO Write function to create a complete replace
      // Deselecting all but last three

      const newQueryString = updateQueryString(queryObject, {
        fieldIds: fieldIds.slice(0, numFields - 3)
      });
      setPersistedQueryString(newQueryString);
      replace(`${ pathname }${ newQueryString }`);
    }
  }

  setRecommendedInitialState(fieldProperties) {
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString } = this.props;

    const initialState = getInitialState(project.id, datasetSelector.id, fieldProperties.items);
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
        <div className={ `${ styles.fillContainer } ${ styles.flexrow } ${ styles.galleryContainer }` }>
          <div className={ styles.fillContainer }>
            <ProjectTopBar paramDatasetId={ this.props.params.datasetId } routes={ this.props.routes } />
            <ExploreView
              filteredVisualizationTypes={ filteredVisualizationTypes }
              sortBy={ sortBy }
              recommendationMode={ recommendationMode }
              fieldIds={ fieldIds }
              pathname={ pathname }
              queryObject={ queryObject }            
            />
          </div>
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
