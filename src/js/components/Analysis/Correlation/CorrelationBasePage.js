import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject } from '../../../helpers/helpers'

import CorrelationSidebar from './CorrelationSidebar';
import CorrelationView from './CorrelationView';

export class CorrelationBasePage extends Component {
  componentWillMount() {
    const { pathname, correlationQueryString, location, replace } = this.props;
    if ( correlationQueryString ) {
      replace(`${ pathname }${ correlationQueryString }`);
    }
  }

  render() {
    const { projectTitle, pathname, queryObject, correlationVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Correlation' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
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
  const { project, correlationSelector } = state;
  const pathname = ownProps.location.pathname;
  const queryObject = ownProps.location.query;

  return {
    projectTitle: project.title,
    queryObject: queryObject,
    pathname: pathname,
    correlationQueryString: correlationSelector.queryString,
    correlationVariablesIds: parseFromQueryObject(queryObject, 'correlationVariablesIds', true),
  };
}

export default connect(mapStateToProps, {
  replace
})(CorrelationBasePage);
