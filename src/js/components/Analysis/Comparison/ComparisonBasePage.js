import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { selectDependentVariables, selectIndependentVariables } from '../../../actions/ComparisonActions';

import ComparisonSidebar from './ComparisonSidebar';
import ComparisonView from './ComparisonView';

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

    const {
      dependentVariables: queriedDependentVariables,
      independentVariables: queriedIndependentVariables,
    } = location.query;

    // Parsing passed state
    if(queriedDependentVariables && queriedIndependentVariables) {
      selectDependentVariables(queriedDependentVariables);
      selectIndependentVariables(queriedIndependentVariables);
    }

    // Initial recommended state
    if(fieldProperties.items.length > 0 && queriedDependentVariables.length == 0 && queriedIndependentVariables.length == 0) {
      const dependentVariables = [ (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c')).map((fieldProperty) => fieldProperty.id) ]

      const queryParams = {
        dependentVariables: dependentVariables,
        independentVariables: independentVariables,
      };
      replace(createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/comparison`, queryParams));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, selectDependentVariable, fieldProperties, selectRegressionType, location, replace } = this.props;
    const { query } = location;
    const { fieldProperties: nextFieldProperties, params: nextParams, replace: nextReplace, location: nextLocation } = nextProps;
    const { query: nextQuery } = nextLocation;

    if (nextFieldProperties.items.length > 0 && nextFieldProperties.datasetId == nextParams.datasetId && !nextQuery['dependent-variable']) {
      const dependentVariable = (nextFieldProperties.items.find((property) => property.generalType == 'q') || nextFieldProperties.items.find((property) => property.generalType == 'c'));

      const queryParams = { 'dependent-variable': dependentVariable.id, 'regression-type': recommendRegressionType(dependentVariable.generalType) };
      replace(createURL(`/projects/${ nextParams.projectId }/datasets/${ nextParams.datasetId }/analyze/regression`, queryParams));
    }

    if(nextQuery['dependent-variable'] && (query['dependent-variable'] != nextQuery['dependent-variable'])) {
      selectDependentVariable(nextQuery['dependent-variable']);

      if(!nextQuery['regressionType']) {
        const regressionType = recommendRegressionType(nextFieldProperties.items.find((property) => property.id == nextQuery['dependent-variable']).generalType);

        const queryParams = { 'dependent-variable': nextQuery['dependent-variable'], 'regression-type': regressionType };
        replace(createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, queryParams));
      }
    }
  }

  render() {
    const { projectTitle } = this.props;
    return (
      <DocumentTitle title={ 'Comparison' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
          <ComparisonView />
          <ComparisonSidebar />
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
  replace,
  selectDependentVariables,
  selectIndependentVariables
})(ComparisonBasePage);
