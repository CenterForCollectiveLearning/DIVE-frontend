import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject } from '../../../helpers/helpers'

import ComparisonSidebar from './ComparisonSidebar';
import ComparisonView from './ComparisonView';

export class ComparisonBasePage extends Component {
  render() {
    const { projectTitle, queryObject, independentVariablesIds, dependentVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Comparison' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <ComparisonView
            queryObject={ queryObject }
            independentVariablesIds={ independentVariablesIds }
            dependentVariablesIds={ dependentVariablesIds }
          />
          <ComparisonSidebar
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
  const { project } = state;
  const queryObject = ownProps.location.query;

  return {
    projectTitle: project.title,
    queryObject: queryObject,
    independentVariablesIds: parseFromQueryObject(queryObject, 'independentVariablesIds', true),
    dependentVariablesIds: parseFromQueryObject(queryObject, 'dependentVariablesIds', true)
  };
}

export default connect(mapStateToProps, { })(ComparisonBasePage);
