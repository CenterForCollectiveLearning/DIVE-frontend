import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject } from '../../../helpers/helpers'

import ComparisonSidebar from './ComparisonSidebar';
import ComparisonView from './ComparisonView';

export class ComparisonBasePage extends Component {
  componentWillMount() {
    const { pathname, comparisonQueryString, location, replace } = this.props;
    if ( comparisonQueryString ) {
      replace(`${ pathname }${ comparisonQueryString }`);
    }
  }

  render() {
    const { projectTitle, pathname, queryObject, independentVariablesIds, dependentVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Comparison' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <ComparisonView
            independentVariablesIds={ independentVariablesIds }
            dependentVariablesIds={ dependentVariablesIds }
          />
          <ComparisonSidebar
            pathname={ pathname }
            queryObject={ queryObject }
            independentVariablesIds={ independentVariablesIds }
            dependentVariablesIds={ dependentVariablesIds }
          />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, comparisonSelector } = state;
  const pathname = ownProps.location.pathname;
  const queryObject = ownProps.location.query;

  return {
    projectTitle: project.title,
    queryObject: queryObject,
    pathname: pathname,
    comparisonQueryString: comparisonSelector.queryString,
    independentVariablesIds: parseFromQueryObject(queryObject, 'independentVariablesIds', true),
    dependentVariablesIds: parseFromQueryObject(queryObject, 'dependentVariablesIds', true)
  };
}

export default connect(mapStateToProps, {
  replace
})(ComparisonBasePage);
