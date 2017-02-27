import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';
import { getRoundedString } from '../../../helpers/helpers';

export default class RegressionSummary extends Component {
  render() {
    const { dependentVariableName, independentVariableNames, regressionResult, contributionToRSquared } = this.props;

    const regressedIndependentVariableNames = independentVariableNames.length == 0 ?
      regressionResult.fields.map((field) => field.name)
      : independentVariableNames;

    const independentVariableNamesString = regressedIndependentVariableNames.length > 1 ?
      regressedIndependentVariableNames
        .map((name) => <strong>{ name }</strong>)
        .reduce((previousValue, currentValue, index, array) =>
          <span><span>{ previousValue }</span><span>{ (index == array.length - 1 ? ', and ' : ', ') }</span><span>{ currentValue }</span></span>
        )
      : <strong>{ regressedIndependentVariableNames }</strong>;

    const sortedRSquaredAdjusted = regressionResult.regressionsByColumn
      .map((column, i) => new Object({ index: `(${ i + 1 })`, value: column.columnProperties.rSquaredAdj }))
      .sort((a, b) => (a.value >= b.value) ? (a.value > b.value ? -1 : 0) : 1)
      .map((obj) => new Object({ ...obj, value: getRoundedString(obj.value)}));

    const rSquaredAdjustedStrings = {
      highest: sortedRSquaredAdjusted[0],
      lowest: sortedRSquaredAdjusted[sortedRSquaredAdjusted.length - 1]
    }

    const sortedContributionToRSquared = contributionToRSquared.slice(1)
      .map((row) => new Object({ name: row[0], value: row[1] }))
      .sort((a, b) => (a.value >= b.value) ? (a.value > b.value ? -1 : 0) : 1)
      .map((obj) => new Object({ ...obj, value: getRoundedString(obj.value)}));

    const contributionToRSquaredStrings = {
      highest: sortedContributionToRSquared[0],
      lowest: sortedContributionToRSquared[sortedContributionToRSquared.length - 1]
    };

    const textParams = {
      dependentVariableName: <strong>{ dependentVariableName }</strong>,
      independentVariableNames: independentVariableNamesString,
      rSquaredAdjustedText: <div className={ styles.rSquaredAdjust }><div className={ styles.r }>R</div><sup>2</sup></div>,
      rSquaredText: <div className={ styles.rSquared }><div className={ styles.r }>R</div><sup>2</sup></div>,
      rSquaredAdjusted: rSquaredAdjustedStrings,
      contributionToRSquared: contributionToRSquaredStrings
    }

    return (
      <div className={ styles.regressionSummary }>
        <div className={ styles.regressionSummaryColumn }>
          <p className="pt-running-text">
            This table displays the results of a linear regression explaining the dependent variable { textParams.dependentVariableName } with combinations of the independent variables { textParams.independentVariableNames }.
          </p>
          <p className="pt-running-text">
            For each variable, the regression coefficient is the first value, significance is represented by number of asterisks, and standard error by the number in parentheses.
          </p>
        </div>
        <div className={ styles.regressionSummaryColumn }>
          { ((textParams.rSquaredAdjusted.lowest.index != textParams.rSquaredAdjusted.highest.index) || (textParams.rSquaredAdjusted.lowest.value != textParams.rSquaredAdjusted.highest.value)) &&
            <p className="pt-running-text">
              The { textParams.rSquaredAdjustedText }, the amount of variance explained by the independent variables, varies from <strong>{ textParams.rSquaredAdjusted.highest.value }</strong> in equation <strong>{ textParams.rSquaredAdjusted.highest.index }</strong> to <strong>{ textParams.rSquaredAdjusted.lowest.value }</strong> in equation <strong>{ textParams.rSquaredAdjusted.lowest.index }</strong>.
            </p>
          }
          { ((textParams.rSquaredAdjusted.lowest.index == textParams.rSquaredAdjusted.highest.index) && (textParams.rSquaredAdjusted.lowest.value == textParams.rSquaredAdjusted.highest.value)) &&
            <p className="pt-running-text">
              The { textParams.rSquaredAdjustedText }, the amount of variance explained by the independent variables, is <strong>{ textParams.rSquaredAdjusted.highest.value }</strong>.
            </p>
          }
          { textParams.contributionToRSquared.highest &&
            <p className="pt-running-text">
              Contribution to { textParams.rSquaredText }, determined by comparing models without a variable to the full model with all variables, is highest for <strong>{ textParams.contributionToRSquared.highest.name }</strong> and lowest for variable <strong>{ textParams.contributionToRSquared.lowest.name }</strong>.
            </p>
          }
        </div>
      </div>
    );
  }
}

RegressionSummary.propTypes = {
  dependentVariableName: PropTypes.string,
  independentVariableNames: PropTypes.array.isRequired,
  regressionResult: PropTypes.object.isRequired,
  contributionToRSquared: PropTypes.array.isRequired
}
