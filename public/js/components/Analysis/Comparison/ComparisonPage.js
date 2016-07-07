import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import styles from '../Analysis.sass';

import { createURL, recommendRegressionType } from '../../../helpers/helpers.js';

import ComparisonSidebar from './ComparisonSidebar';
import ComparisonView from './ComparisonView';
import { selectDependentVariable, selectIndependentVariables } from '../../../actions/ComparisonActions';


export class ComparisonPage extends Component {

  componentWillMount() {
    const { fieldProperties, params, replace, location, selectDependentVariable } = this.props;
    const {
      dependentVariable: queriedDependentVariable,
      independentVariables: queriedIndependentVariables
    } = location.query;

    if(queriedDependentVariable) {
      selectDependentVariable(queriedDependentVariable);
    }

    if(fieldProperties.items.length > 0 && !queriedDependentVariable) {
      const dependentVariable = (fieldProperties.items.find((property) => property.generalType == 'q') || fieldProperties.items.find((property) => property.generalType == 'c'));

      const queryParams = { 'dependent-variable': dependentVariable.name };
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

      const queryParams = { 'dependent-variable': dependentVariable.id };
      replace(createURL(`/projects/${ nextParams.projectId }/datasets/${ nextParams.datasetId }/analyze/comparison`, queryParams));
    }

    if(nextQuery['dependent-variable'] && (query['dependent-variable'] != nextQuery['dependent-variable'])) {
      selectDependentVariable(nextQuery['dependent-variable']);

      if(!nextQuery['comparisonType']) {
        const comparisonType = recommendRegressionType(nextFieldProperties.items.find((property) => property.id == nextQuery['dependent-variable']).generalType);

        const queryParams = { 'dependent-variable': nextQuery['dependent-variable'] };
        replace(createURL(`/projects/${ params.projectId }/datasets/${ params.datasetId }/analyze/comparison`, queryParams));
      }
    }

    if(query['comparison-type'] != nextQuery['comparison-type'] && nextQuery['comparison-type']) {
      selectRegressionType(nextQuery['comparison-type']);
    }
  }

  render() {
    return (
      <div className={ `${ styles.fillContainer } ${ styles.summaryContainer }` }>
        <ComparisonView />
        <ComparisonSidebar />
        { this.props.children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { fieldProperties } = state;
  return { fieldProperties };
}

export default connect(mapStateToProps, { replace, selectDependentVariable, selectIndependentVariables })(ComparisonPage);
