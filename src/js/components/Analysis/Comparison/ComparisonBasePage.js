import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { setQueryString } from '../../../helpers/helpers';

import ComparisonView from './ComparisonView';
import ComparisonSidebar from './ComparisonSidebar';

export class ComparisonBasePage extends Component {
  componentWillMount() {
    const {
      fieldProperties,
      params,
      replace,
      location,
      selectDependentVariables,
      selectIndependentVariables,
    } = this.props;
  }

  render() {
    const { projectTitle, location } = this.props;
    const locationQueryDependentVariablesIds =  location.query['dependentVariablesIds'];
    const locationQueryIndependentVariablesIds = location.query['independentVariablesIds'];
    const queryDependentVariablesIds = locationQueryDependentVariablesIds ? locationQueryDependentVariablesIds.split(',').map((idString) => parseInt(idString)) : [];
    const queryIndependentVariablesIds = locationQueryIndependentVariablesIds ? locationQueryIndependentVariablesIds.split(',').map((idString) => parseInt(idString)) : [];

    return (
      <DocumentTitle title={ 'Comparison' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <ComparisonView />
          <ComparisonSidebar
            queryDependentVariablesIds={ queryDependentVariablesIds }
            queryIndependentVariablesIds={ queryIndependentVariablesIds }
          />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { fieldProperties, project } = state;
  return {
    fieldProperties,
    projectTitle: project.properties.title
  };
}

export default connect(mapStateToProps, {
  setQueryString
})(ComparisonBasePage);
