import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import RegressionTable from './RegressionTable';
import RegressionSummary from './RegressionSummary';

export default class RegressionTableCard extends Component {
  render() {
    const { regressionType, dependentVariableName, independentVariableNames, regressionResult, contributionToRSquared } = this.props;
    return (
      <Card
        header={
          <span>Explaining <strong className={ styles.dependentVariableTitle }>{ dependentVariableName }</strong></span>
        }>
        <RegressionTable regressionType={ regressionType } regressionResult={ regressionResult }/>
        <RegressionSummary
          dependentVariableName={ dependentVariableName }
          independentVariableNames={ independentVariableNames }
          regressionResult={ regressionResult }
          contributionToRSquared={ contributionToRSquared }/>
      </Card>
    );
  }
}

RegressionTableCard.propTypes = {
  dependentVariableName: PropTypes.string,
  independentVariableNames: PropTypes.array.isRequired,
  regressionResult: PropTypes.object,
  contributionToRSquared: PropTypes.array
}
