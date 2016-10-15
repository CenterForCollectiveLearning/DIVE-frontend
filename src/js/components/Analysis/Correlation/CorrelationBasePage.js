import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject, updateQueryString } from '../../../helpers/helpers';
import { setCorrelationQueryString, getInitialCorrelationState } from '../../../actions/CorrelationActions';

import CorrelationSidebar from './CorrelationSidebar';
import CorrelationView from './CorrelationView';

export class CorrelationBasePage extends Component {
  componentWillMount() {
    const {
      fieldProperties,
      correlationQueryString,
      setCorrelationQueryString,
      replace
    } = this.props;

    if ( correlationQueryString ) {
      replace(`${ pathname }${ correlationQueryString }`);
    } else {
      if ( fieldProperties.items.length ) {
        this.setRecommendedInitialState(fieldProperties);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      correlationQueryString: currentQueryString
    } = this.props;
    const {
      fieldProperties,
      correlationQueryString: nextQueryString,
    } = nextProps;

    const shouldRecommendInitialState = !currentQueryString && !nextQueryString;
    if ( shouldRecommendInitialState && fieldProperties.items.length) {
      this.setRecommendedInitialState(fieldProperties);
    }
  }

  setRecommendedInitialState(fieldProperties) {
    console.log('setRecommendedInitialState');
    const {
      project,
      datasetSelector,
      pathname,
      replace,
      setCorrelationQueryString,
      queryObject,
      correlationQueryString: currentQueryString
    } = this.props;

    const initialState = getInitialCorrelationState(project.id, datasetSelector.datasetId, fieldProperties.items);
    const newQueryString = updateQueryString(queryObject, initialState);
    setCorrelationQueryString(newQueryString);
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
    fieldProperties: fieldProperties,
    queryObject: queryObject,
    pathname: pathname,
    correlationQueryString: correlationSelector.queryString,
    correlationVariablesIds: parseFromQueryObject(queryObject, 'correlationVariablesIds', true),
  };
}

export default connect(mapStateToProps, {
  replace,
  setCorrelationQueryString
})(CorrelationBasePage);
