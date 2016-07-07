import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';
import { getRoundedString } from '../../../helpers/helpers';

export default class AnovaText extends Component {
  render() {
    const { dependentVariableNames, independentVariableNames, anovaData } = this.props;

    const independentVariableNamesString = independentVariableNames.length > 1 ?
      independentVariableNames
        .map((name) => <strong>{ name }</strong>)
        .reduce((previousValue, currentValue, index, array) =>
          <span><span>{ previousValue }</span><span>{ (index == array.length - 1 ? ', and ' : ', ') }</span><span>{ currentValue }</span></span>
        )
      : <strong>{ independentVariableNames }</strong>;


    const textParams = {
      anovaType: ( dependentVariableNames.length > 1 ? 'two-way' : 'one-way' ),
      dependentVariableName: <strong>{ dependentVariableNames[0] }</strong>,
      independentVariableNames: independentVariableNamesString,
      rSquaredAdjustedText: <div className={ styles.rSquaredAdjust }><div className={ styles.r }>R</div><sup>2</sup></div>,
      rSquaredText: <div className={ styles.rSquared }><div className={ styles.r }>R</div><sup>2</sup></div>,
    }

    return (
      <div className={ styles.regressionSummary }>
        <div className={ styles.regressionSummaryColumn }>
          <div>
            This table displays the results of a <strong>{ textParams.anovaType } analysis of variance (ANOVA)</strong> comparing mean of { textParams.dependentVariableName } by { textParams.independentVariableNames }.
          </div>
        </div>
      </div>
    );
  }
}

AnovaText.propTypes = {
  dependentVariableNames: PropTypes.array.isRequired,
  independentVariableNames: PropTypes.array.isRequired,
  anovaData: PropTypes.object.isRequired,
}
