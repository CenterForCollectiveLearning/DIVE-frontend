import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import styles from '../Analysis.sass';

import { createURL, recommendRegressionType } from '../../../helpers/helpers.js';

import RegressionSidebar from './RegressionSidebar';
import RegressionView from './RegressionView';
import { selectDependentVariable, selectRegressionType } from '../../../actions/RegressionActions';

export class RegressionBasePage extends Component {

  componentWillMount() {
    const { fieldProperties, params, replace, location, selectDependentVariable, selectRegressionType } = this.props;
    const { 'dependent-variable': queriedDependentVariable, 'regression-type': queriedRegressionType } = location.query;

    if(queriedDependentVariable && queriedRegressionType) {
      selectDependentVariable(queriedDependentVariable);
      selectRegressionType(queriedRegressionType);
    }

    if(fieldProperties.items.length > 0 && !queriedDependentVariable) {
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c'));

      const queryParams = { 'dependent-variable': dependentVariable.id, 'regression-type': recommendRegressionType(dependentVariable.generalType) };
      replace(createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/regression`, queryParams));
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

    if(query['regression-type'] != nextQuery['regression-type'] && nextQuery['regression-type']) {
      selectRegressionType(nextQuery['regression-type']);
    }
  }

  render() {
    const { projectTitle } = this.props;
    return (
      <DocumentTitle title={ 'Regression' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.regressionContainer }` }>
          <RegressionView />
          <RegressionSidebar />
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { fieldProperties, project } = state;
  return { fieldProperties, projectTitle: project.properties.title };
}

export default connect(mapStateToProps, { replace, selectDependentVariable, selectRegressionType })(RegressionBasePage);
