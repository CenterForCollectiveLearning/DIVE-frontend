import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { parseFromQueryObject , recommendRegressionType } from '../../../helpers/helpers.js';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';
import { selectDependentVariable, selectRegressionType } from '../../../actions/RegressionActions';

export class RegressionBasePage extends Component {

  componentWillMount() {
    const { pathname, regressionQueryString, location, replace } = this.props;
    if ( regressionQueryString ) {
      replace(`${ pathname }${ regressionQueryString }`);
    }
  }

  render() {
    const { projectTitle, pathname, queryObject, regressionType, dependentVariableId, independentVariablesIds } = this.props;
    return (
      <DocumentTitle title={ 'Regression' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.regressionContainer }` }>
          <RegressionView
            regressionType={ regressionType }
            dependentVariableId={ dependentVariableId }
            independentVariablesIds={ independentVariablesIds }
          />
          <RegressionSidebar
            pathname={ pathname }
            queryObject={ queryObject }
            regressionType={ regressionType }
            dependentVariableId={ dependentVariableId }
            independentVariablesIds={ independentVariablesIds }
          />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { project, regressionSelector } = state;
  const pathname = ownProps.location.pathname;
  const queryObject = ownProps.location.query;

  return {
    queryObject: queryObject,
    pathname: pathname,
    regressionQueryString: regressionSelector.queryString,
    regressionType: parseFromQueryObject(queryObject, 'regressionType', false),
    dependentVariableId: parseFromQueryObject(queryObject, 'dependentVariableId', false),
    independentVariablesIds: parseFromQueryObject(queryObject, 'independentVariablesIds', true),
    projectTitle: project.title
  };
}

export default connect(mapStateToProps, { replace })(RegressionBasePage);
