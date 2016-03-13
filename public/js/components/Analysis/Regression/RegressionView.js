import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runRegression, getContributionToRSquared } from '../../../actions/RegressionActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import RegressionTableCard from './RegressionTableCard';
import ContributionToRSquaredCard from './ContributionToRSquaredCard';

export class RegressionView extends Component {

  componentWillReceiveProps(nextProps) {
    const { dependentVariableName, independentVariableNames, regressionResult, runRegression, getContributionToRSquared } = this.props;
    const independentVariablesChanged = nextProps.independentVariableNames.length != independentVariableNames.length;
    const dependentVariableChanged = (nextProps.dependentVariableName != dependentVariableName);
    const dependentVariableExists = (nextProps.dependentVariableName != null);

    if (nextProps.projectId && nextProps.datasetId && dependentVariableExists && (dependentVariableChanged || independentVariablesChanged)) {
      runRegression(nextProps.projectId, nextProps.datasetId, nextProps.dependentVariableName, nextProps.independentVariableNames);
    }

    if (nextProps.projectId && nextProps.regressionResult.data && nextProps.regressionResult.data.id && (this.props.regressionResult.data == null || (nextProps.regressionResult.data.id != this.props.regressionResult.data.id))) {
      getContributionToRSquared(nextProps.projectId, nextProps.regressionResult.data.id);
    }
  }

  render() {
    const { regressionResult, contributionToRSquared, dependentVariableName, independentVariableNames } = this.props;

    if (!regressionResult.data || !regressionResult.data.fields || regressionResult.data.fields.length == 0) {
      return (
        <div className={ styles.regressionViewContainer }></div>
      );
    }

    return (
      <div className={ styles.regressionViewContainer }>
        <RegressionTableCard
          dependentVariableName={ dependentVariableName }
          independentVariableNames={ independentVariableNames }
          regressionResult={ regressionResult.data || {} }
          contributionToRSquared={ contributionToRSquared }/>

        { (contributionToRSquared.length > 0 && regressionResult.data) &&
          <ContributionToRSquaredCard id={ `${ regressionResult.data.id }` } contributionToRSquared={ contributionToRSquared } />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { project, regressionSelector, datasetSelector, fieldProperties } = state;
  const { regressionResult, contributionToRSquared } = regressionSelector;

  const dependentVariable = fieldProperties.items.find((property) => property.id == regressionSelector.dependentVariableId);
  const dependentVariableName = dependentVariable ? dependentVariable.name : null;

  const independentVariableNames = fieldProperties.items
    .filter((property) => regressionSelector.independentVariableIds.indexOf(property.id) >= 0)
    .map((independentVariable) => independentVariable.name);

  return {
    projectId: project.properties.id,
    dependentVariableName: dependentVariableName,
    independentVariableNames: independentVariableNames,
    datasetId: datasetSelector.datasetId,
    regressionResult: regressionResult,
    contributionToRSquared: contributionToRSquared
  };
}

export default connect(mapStateToProps, { runRegression, getContributionToRSquared })(RegressionView);
