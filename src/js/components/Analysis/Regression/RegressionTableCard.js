import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
import RegressionTable from './RegressionTable';
import RegressionSummary from './RegressionSummary';

export default class RegressionTableCard extends Component {
  render() {
    const { regressionType, dependentVariableName, independentVariableNames, regressionResult, contributionToRSquared } = this.props;

    let tableCardHeader;
    if (dependentVariableName) {
      tableCardHeader = <span>Explaining <ColoredFieldItems fields={[ dependentVariableName ]} /> in terms of <ColoredFieldItems fields={ independentVariableNames } /></span>
    }
    return (
      <Card
        header={ tableCardHeader }
        helperText={ 'In statistics, simple linear regression is the least squares estimator of a linear regression model with a single explanatory variable. In other words, simple linear regression fits a straight line through the set of n points in such a way that makes the sum of squared residuals of the model (that is, vertical distances between the points of the data set and the fitted line) as small as possible.' }
      >
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
