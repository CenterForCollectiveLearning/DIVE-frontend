import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers';
import { setPersistedQueryString, getInitialState } from '../../../actions/CorrelationActions';

import CorrelationSidebar from './CorrelationSidebar';
import CorrelationView from './CorrelationView';

export class CorrelationBasePage extends Component {
  componentWillMount() {
    const { fieldProperties, persistedQueryString, pathname, replace } = this.props;

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
    const { fieldProperties, queryObject: nextQueryObject } = nextProps;

    const shouldRecommendInitialState = Object.keys(currentQueryObject) == 0 && Object.keys(nextQueryObject).length == 0;
    if ( shouldRecommendInitialState && fieldProperties.items.length) {
      this.setRecommendedInitialState(fieldProperties);
    }
  }

  setRecommendedInitialState(fieldProperties) {
    const { project, datasetSelector, pathname, queryObject, replace, setPersistedQueryString } = this.props;

    const initialState = getInitialState(project.id, datasetSelector.id, fieldProperties.items);
    const newQueryString = updateQueryString(queryObject, initialState);
    setPersistedQueryString(newQueryString);
    replace(`${ pathname }${ newQueryString }`);
  }

  render() {
    const { project, pathname, queryObject, correlationVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Correlation' + ( project.title ? ` | ${ project.title }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.correlationContainer }` }>
          <CorrelationView
            correlationVariablesIds={ correlationVariablesIds }
          />
          <CorrelationSidebar
            pathname={ pathname }
            queryObject={ queryObject }
            correlationVariablesIds={ correlationVariablesIds }
          />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, datasetSelector, correlationSelector, fieldProperties } = state;
  const pathname = ownProps.location.pathname;
  const queryObject = ownProps.location.query;

  return {
    project,
    datasetSelector,
    fieldProperties,
    queryObject: queryObject,
    pathname: pathname,
    persistedQueryString: correlationSelector.queryString,
    correlationVariablesIds: parseFromQueryObject(queryObject, 'correlationVariablesIds', true),
  };
}

export default connect(mapStateToProps, {
  replace,
  setPersistedQueryString
})(CorrelationBasePage);
