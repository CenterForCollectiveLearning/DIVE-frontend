import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import RegressionTable from './RegressionTable';
import RegressionSummary from './RegressionSummary';

export default class RegressionTableCard extends Component {
  render() {
    const { dependentVariableName, independentVariableNames, regressionResult, contributionToRSquared } = this.props;

    return (
      <Card>
        <HeaderBar header={ <span>Explaining <strong className={ styles.dependentVariableTitle }>{ dependentVariableName }</strong></span> } />

        <RegressionTable regressionResult={ regressionResult }/>
        <RegressionSummary
          dependentVariableName={ dependentVariableName }
          independentVariableNames={ independentVariableNames }
          regressionResult={ regressionResult }
          contributionToRSquared={ contributionToRSquared }/>
      </Card>
    );
  }
}
